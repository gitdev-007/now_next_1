/**
 * index.js
 * Core Backend Logic for LayoverX integrated with Supabase & Resend.
 */

const emailService = require('./services/emailService');
const Razorpay = require('razorpay');
const stripe = require('stripe')(process.env.STRIPE_SECRET || 'mock_stripe_key');

const flightProvider = require('./services/flightProvider');
const notificationService = require('./services/notificationService');

const getSupabaseClient = () => {
  if (global.supabase) return global.supabase;
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.SUPABASE_URL || 'https://mock.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key'
  );
};

function sanitizeLogContent(str) {
  if (!str) return "";
  let clean = String(str);
  clean = clean.replace(/(passport(?:[_\s]*number)?\s*[:=]?\s*["']?)[A-PR-WY0-9][1-9]\d\s?\d{4}[1-9]\b/gi, "$1[REDACTED_PASSPORT]");
  clean = clean.replace(/\b[A-PR-WY][1-9]\d\s?\d{4}[1-9]\b/gi, "[REDACTED_PASSPORT]");
  clean = clean.replace(/(passport(?:\s*number)?\s*[:=]\s*)['"]?[a-z0-9]+['"]?/gi, "$1[REDACTED_PASSPORT]");
  clean = clean.replace(/\b[a-fA-F0-9]{64}\b/g, "[REDACTED_SIGNATURE]");
  clean = clean.replace(/rzp_(?:test|live)_[a-zA-Z0-9]{14,24}/g, "[REDACTED_RAZORPAY_KEY]");
  clean = clean.replace(/sk_(?:test|live)_[a-zA-Z0-9]{24,100}/g, "[REDACTED_STRIPE_KEY]");
  clean = clean.replace(/ey[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/g, "[REDACTED_TOKEN]");
  clean = clean.replace(/(password|secret|pass|token)\s*[:=]\s*['"]?[a-zA-Z0-9_\-\.\/+=]{8,}['"]?/gi, "$1: [REDACTED]");
  return clean;
}

async function logToErrorLogs(severity, source, message, error = null, uid = null) {
  const cleanMessage = sanitizeLogContent(message);
  const cleanStack = error && error.stack ? sanitizeLogContent(error.stack) : (error ? sanitizeLogContent(String(error)) : "");

  console.error(`[Backend Logged] [${severity}] ${source}: ${cleanMessage}`);

  try {
    const supabase = getSupabaseClient();
    await supabase.from("error_logs").insert({
      severity,
      source,
      message: cleanMessage,
      stack: cleanStack,
      uid: uid || "system-backend",
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to write to error_logs collection:", err);
  }
}

// ------------------------------------------------------------------
// Improvement 1.2: Real-time inventory locking (10 minutes)
// ------------------------------------------------------------------
async function lockInventory(data, context) {
  const { items, sessionId } = data;
  const uid = context.auth ? context.auth.uid : 'guest-traveler';
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes

  const supabase = getSupabaseClient();

  try {
    if (!items || items.length === 0 || !sessionId) {
      throw new Error("Missing items or sessionId parameter");
    }

    // Clean up all expired locks to release stale locks
    const { error: deleteError } = await supabase
      .from('inventory_locks')
      .delete()
      .lt('expires_at', now);

    if (deleteError) throw deleteError;

    // Verify and place locks
    for (const item of items) {
      const lockId = `${item.serviceId}_${item.slot}`;

      // Check if lock exists and is valid
      const { data: existingLock } = await supabase
        .from('inventory_locks')
        .select('*')
        .eq('lock_id', lockId)
        .single();

      if (existingLock) {
        const warnMsg = `Service slot ${lockId} is currently held by another session/user.`;
        await logToErrorLogs("WARNING", "inventory-lock", warnMsg, null, uid);
        throw { status: 409, message: 'Service slot is currently held by another user.' };
      }

      // Try inserting the lock
      const { error: insertError } = await supabase
        .from('inventory_locks')
        .insert({
          lock_id: lockId,
          session_id: sessionId,
          locked_at: now,
          expires_at: expiresAt
        });

      if (insertError) {
        // Unique constraint violation (duplicate key) means another user grabbed it concurrently
        const warnMsg = `Concurrency conflict: service slot ${lockId} was grabbed by another user.`;
        await logToErrorLogs("WARNING", "inventory-lock", warnMsg, null, uid);
        throw { status: 409, message: 'Service slot is currently held by another user.' };
      }
    }
    return { success: true, sessionId, expiresAt, serverTime: now };
  } catch (error) {
    if (error.status !== 409) {
      await logToErrorLogs("WARNING", "inventory-lock", `Inventory lock failed: ${error.message}`, error, uid);
    }
    throw error;
  }
}

async function validateLockSession(data, context) {
  const { items, sessionId } = data;
  const now = Date.now();
  const uid = context.auth ? context.auth.uid : 'guest-traveler';

  const supabase = getSupabaseClient();

  try {
    if (!items || items.length === 0 || !sessionId) {
      return { success: false, error: "Missing items or sessionId" };
    }

    let minExpiresAt = null;
    let allValid = true;

    for (const item of items) {
      const lockId = `${item.serviceId}_${item.slot}`;
      const { data: lock, error } = await supabase
        .from('inventory_locks')
        .select('*')
        .eq('lock_id', lockId)
        .single();

      if (!error && lock) {
        if (lock.session_id === sessionId && lock.expires_at > now) {
          if (minExpiresAt === null || lock.expires_at < minExpiresAt) {
            minExpiresAt = lock.expires_at;
          }
        } else {
          allValid = false;
          break;
        }
      } else {
        allValid = false;
        break;
      }
    }

    if (allValid && minExpiresAt !== null) {
      return { success: true, expiresAt: Number(minExpiresAt), serverTime: now };
    } else {
      return { success: false, error: "Lock session invalid or expired" };
    }
  } catch (error) {
    await logToErrorLogs("WARNING", "inventory-lock-validation", `Lock validation error: ${error.message}`, error, uid);
    return { success: false, error: error.message };
  }
}

// ------------------------------------------------------------------
// Secure Payment Gateway & Cart Validation
// ------------------------------------------------------------------
async function createPaymentIntent(data, context) {
  const { cartItems } = data;
  let validatedTotal = 0;
  const supabase = getSupabaseClient();
  const uid = context.auth ? context.auth.uid : 'guest-traveler';

  try {
    for (const item of cartItems) {
      const { data: service, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', String(item.serviceId))
        .single();

      if (error || !service) {
        throw new Error(`Service ${item.serviceId} not found`);
      }
      validatedTotal += (service.price * item.quantity);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: validatedTotal * 100, // paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: { integration_check: 'accept_a_payment' },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      validatedTotal: validatedTotal
    };
  } catch (error) {
    await logToErrorLogs("CRITICAL", "payment-selection", `Stripe PaymentIntent Creation Failed: ${error.message}`, error, uid);
    throw error;
  }
}

// ------------------------------------------------------------------
// Partner Registration alert endpoint (Resend-backed webhook)
// ------------------------------------------------------------------
async function partnerRegistration(req, res) {
  const { appId, data } = req.body;
  const supabase = getSupabaseClient();

  if (!appId || !data) {
    return res.status(400).json({ error: "Missing registration metadata" });
  }

  try {
    // 1. Write the partner application details to PostgreSQL database
    const payload = {
      application_id: appId,
      user_id: data.userId || data.uid,
      business_name: data.businessName,
      business_category: data.businessCategory,
      website: data.website || null,
      description: data.description || null,
      documents: data.documents || {},
      status: 'pending_review',
      created_at: new Date().toISOString()
    };

    const { error: dbError } = await supabase.from('supplier_applications').upsert(payload);
    if (dbError) throw dbError;

    console.log(`[Supplier application logged in PostgreSQL]: Application: ${appId}`);

    // 2. Email notification to Admin via Resend
    try {
      await emailService.sendEmail({
        from: 'LayoverX Onboarding <noreply@layoverx.com>',
        to: 'admin@layoverx.com',
        subject: `New Partner Application: ${data.businessName}`,
        text: `Review required for new vendor: ${data.businessName} (${data.businessCategory}). Application Reference: ${appId}`
      });
    } catch (emailErr) {
      console.error("Resend email delivery failed:", emailErr.message);
      await logToErrorLogs("ERROR", "partner-registration", `Resend notification failed for ${data.businessName}: ${emailErr.message}`, emailErr);
    }

    res.json({ success: true, applicationId: appId });
  } catch (error) {
    console.error("Partner onboarding registration webhook failure:", error);
    await logToErrorLogs("ERROR", "partner-registration", `Partner registration webhook failure: ${error.message}`, error);
    res.status(500).json({ error: "Partner registration failed: " + error.message });
  }
}

// ------------------------------------------------------------------
// Razorpay Secure Payment Integration
// ------------------------------------------------------------------
async function createRazorpayOrder(data, context) {
  const { cartItems, bookingId } = data;
  let validatedTotal = 0;
  const supabase = getSupabaseClient();
  const uid = context.auth ? context.auth.uid : 'guest-traveler';

  try {
    for (const item of cartItems) {
      let price = 0;
      const { data: service } = await supabase
        .from('services')
        .select('*')
        .eq('id', String(item.serviceId || item.id))
        .single();

      if (service) {
        price = service.price;
      } else {
        price = item.price; // fallback
      }
      validatedTotal += (price * (item.quantity || 1));
    }

    const razorpayKey = process.env.RAZORPAY_KEY || 'rzp_test_mockKey';
    const razorpaySecret = process.env.RAZORPAY_SECRET || 'mockSecret';

    const razorpay = new Razorpay({
      key_id: razorpayKey,
      key_secret: razorpaySecret
    });

    const options = {
      amount: Math.round(validatedTotal * 100), // paise
      currency: "INR",
      receipt: bookingId || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKey
    };
  } catch (error) {
    console.error("Razorpay Order Creation Failed:", error);
    await logToErrorLogs("CRITICAL", "payment-selection", `Razorpay Order Creation Failed for booking ${bookingId}: ${error.message}`, error, uid);
    throw error;
  }
}

async function verifyRazorpayPayment(data, context) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, sessionId, items } = data;
  const uid = context.auth ? context.auth.uid : 'guest-traveler';
  const now = Date.now();
  const GRACE_PERIOD_MS = 30 * 1000; // 30-second grace window

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    const errMsg = `Missing Razorpay signature fields during verification for booking ${bookingId}`;
    await logToErrorLogs("CRITICAL", "payment-selection", errMsg, null, uid);
    throw { status: 400, message: 'Missing Razorpay signature fields' };
  }

  const supabase = getSupabaseClient();
  let lockValidationBlocked = false;
  let lockBlockReason = null;

  if (sessionId && items && items.length > 0) {
    for (const item of items) {
      const lockId = `${item.serviceId}_${item.slot}`;
      
      const { data: lock, error: fetchErr } = await supabase
        .from('inventory_locks')
        .select('*')
        .eq('lock_id', lockId)
        .single();

      if (fetchErr || !lock) {
        lockValidationBlocked = true;
        lockBlockReason = 'expired-session-payment-attempt';
        await logToErrorLogs("ERROR", "payment-verification",
          `Lock document missing/expired for ${lockId} during verification of booking ${bookingId}. Current time: ${now}. Blocking.`,
          null, uid);
        break;
      }

      // Case C: Session ownership mismatch
      if (lock.session_id !== sessionId) {
        lockValidationBlocked = true;
        lockBlockReason = 'session-ownership-mismatch';
        await logToErrorLogs("ERROR", "payment-verification",
          `Session ownership mismatch for booking ${bookingId}. Expected sessionId: ${sessionId}, found: ${lock.session_id}. Blocking.`,
          null, uid);
        break;
      }

      // Cases A & B: Check expiry with grace window
      const expiresAt = Number(lock.expires_at) || 0;
      const elapsed = now - expiresAt;

      if (elapsed > GRACE_PERIOD_MS) {
        lockValidationBlocked = true;
        lockBlockReason = 'expired-session-payment-attempt';
        await logToErrorLogs("ERROR", "payment-verification",
          `Expired lock for booking ${bookingId}. Lock expired at ${expiresAt}, current time ${now}, elapsed ${elapsed}ms (grace is ${GRACE_PERIOD_MS}ms). Blocking.`,
          null, uid);
        break;
      }
    }
  } else {
    // Case D: Missing sessionId or items
    await logToErrorLogs("WARNING", "payment-verification",
      `Missing lock session metadata for booking ${bookingId}. Anomaly logged — proceeding with signature verification only.`,
      null, uid);
  }

  // If lock revalidation blocked, update booking to Failed and return immediately
  if (lockValidationBlocked) {
    if (bookingId) {
      await supabase.from("trips").update({
        status: 'Failed',
        payment_failure_reason: `Lock revalidation blocked: ${lockBlockReason}`,
        updated_at: new Date().toISOString()
      }).eq('booking_id', bookingId);
    }
    return { success: false, blocked: true, reason: lockBlockReason, message: 'Booking blocked: lock validation failed.' };
  }

  // Cryptographic Razorpay Signature Verification
  try {
    const razorpaySecret = process.env.RAZORPAY_SECRET || 'mockSecret';
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', razorpaySecret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    const success = (generatedSignature === razorpay_signature);

    if (success) {
      if (bookingId) {
        await supabase.from("trips").update({
          status: 'Confirmed',
          payment_id: razorpay_payment_id,
          updated_at: new Date().toISOString()
        }).eq('booking_id', bookingId);
      }
      return { success: true, message: 'Payment verified successfully.' };
    } else {
      const failMsg = `Razorpay signature verification mismatch for booking ${bookingId}. Sent signature: ${razorpay_signature}, generated: ${generatedSignature}`;
      await logToErrorLogs("CRITICAL", "payment-selection", failMsg, null, uid);

      if (bookingId) {
        await supabase.from("trips").update({
          status: 'Failed',
          payment_failure_reason: 'Signature verification mismatch',
          updated_at: new Date().toISOString()
        }).eq('booking_id', bookingId);
      }
      return { success: false, message: 'Payment verification failed.' };
    }
  } catch (error) {
    console.error("Razorpay verification execution failed:", error);
    await logToErrorLogs("CRITICAL", "payment-selection", `Razorpay verification execution failed for booking ${bookingId}: ${error.message}`, error, uid);
    throw error;
  }
}

async function razorpayWebhook(req, res) {
  const signature = req.headers['x-razorpay-signature'];
  const supabase = getSupabaseClient();

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mockWebhookSecret';
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(JSON.stringify(req.body));
    const generatedSignature = hmac.digest('hex');

    const isValid = (generatedSignature === signature);

    if (!isValid) {
      console.warn("Invalid webhook signature received");
      await logToErrorLogs("CRITICAL", "razorpay-webhook", `Invalid webhook signature received. Sent signature: ${signature}, generated: ${generatedSignature}`);
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const orderId = payload.payment.entity.order_id;
      const paymentId = payload.payment.entity.id;
      console.log(`Webhook: Payment captured for order ${orderId}, payment ${paymentId}`);

      const { error } = await supabase
        .from("trips")
        .update({
          status: 'Confirmed',
          payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (error) throw error;
    } else if (event === 'payment.failed') {
      const orderId = payload.payment.entity.order_id;
      const errorDesc = payload.payment.entity.error_description;
      console.log(`Webhook: Payment failed for order ${orderId}: ${errorDesc}`);

      await logToErrorLogs("CRITICAL", "razorpay-webhook", `Webhook Payment Failed event for order ${orderId}: ${errorDesc}`);

      const { error } = await supabase
        .from("trips")
        .update({
          status: 'Failed',
          payment_failure_reason: errorDesc || 'Payment failed',
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (error) throw error;
    }
  } catch (globalErr) {
    console.error("Global webhook error:", globalErr);
    await logToErrorLogs("ERROR", "razorpay-webhook", `Global webhook execution exception: ${globalErr.message}`, globalErr);
  }
  res.status(200).send("Ok");
}

// ------------------------------------------------------------------
// Flight Delay Real-time Adjustments (Supabase / Render scheduled)
// ------------------------------------------------------------------
async function runFlightDelaysCheck() {
  console.log("Running flight delay check routine on PostgreSQL...");
  const now = Date.now();
  const fortyEightHoursLater = now + 48 * 60 * 60 * 1000;
  let processedCount = 0;

  const supabase = getSupabaseClient();

  try {
    const { data: trips, error } = await supabase
      .from("trips")
      .select('*')
      .eq('status', 'Confirmed');

    if (error) throw error;
    if (!trips || trips.length === 0) {
      console.log("No active confirmed trips found to monitor.");
      return 0;
    }

    for (const trip of trips) {
      const tripId = trip.booking_id;
      
      // Resolve arrival and departure dates
      const rawArrival = trip.arrival;
      const rawDeparture = trip.departure;

      if (!rawArrival || !rawDeparture) {
        console.warn(`Trip ${tripId} has missing schedule fields. Skipping.`);
        continue;
      }

      const schedArrivalMs = new Date(rawArrival).getTime();
      const schedDepartureMs = new Date(rawDeparture).getTime();

      // Filter for next 48 hours
      const isWithin48h = (schedArrivalMs >= now && schedArrivalMs <= fortyEightHoursLater) ||
                          (schedDepartureMs >= now && schedDepartureMs <= fortyEightHoursLater) ||
                          (schedArrivalMs <= now && schedDepartureMs >= now); // currently in layover

      if (!isWithin48h) {
        continue;
      }

      processedCount++;
      console.log(`Checking flight status for Trip ID: ${tripId}, Traveler: ${trip.uid}`);

      let incomingDelay = trip.incoming_flight_delay || 0;
      let outgoingDelay = trip.outgoing_flight_delay || 0;
      let isCancelled = trip.flight_cancelled || false;
      let currentGate = trip.departure_gate || null;

      let incomingChanged = false;
      let outgoingChanged = false;
      let gateChanged = false;

      // Check Incoming Flight
      if (trip.incoming_flight) {
        try {
          const incomingStatus = await flightProvider.fetchFlightStatus(trip.incoming_flight);
          const newIncomingDelay = incomingStatus.departureDelayMinutes || incomingStatus.arrivalDelayMinutes || 0;
          if (newIncomingDelay !== incomingDelay) {
            incomingDelay = newIncomingDelay;
            incomingChanged = true;
          }
          if (incomingStatus.status === 'Cancelled' && !isCancelled) {
            isCancelled = true;
            incomingChanged = true;
          }
        } catch (err) {
          await logToErrorLogs("ERROR", "flight-delay-monitoring", `Failed to check incoming flight ${trip.incoming_flight} for trip ${tripId}: ${err.message}`, err);
        }
      }

      // Check Outgoing Flight
      if (trip.outgoing_flight) {
        try {
          const outgoingStatus = await flightProvider.fetchFlightStatus(trip.outgoing_flight);
          const newOutgoingDelay = outgoingStatus.departureDelayMinutes || outgoingStatus.arrivalDelayMinutes || 0;
          if (newOutgoingDelay !== outgoingDelay) {
            outgoingDelay = newOutgoingDelay;
            outgoingChanged = true;
          }
          if (outgoingStatus.status === 'Cancelled' && !isCancelled) {
            isCancelled = true;
            outgoingChanged = true;
          }

          const newGate = outgoingStatus.gateChanges?.departureGate;
          if (newGate && newGate !== currentGate) {
            currentGate = newGate;
            gateChanged = true;
          }
        } catch (err) {
          await logToErrorLogs("ERROR", "flight-delay-monitoring", `Failed to check outgoing flight ${trip.outgoing_flight} for trip ${tripId}: ${err.message}`, err);
        }
      }

      // If timing or cancellation changed, execute recalculation
      if (incomingChanged || outgoingChanged || gateChanged) {
        console.log(`Change detected on Trip ${tripId}. Recalculating layover...`);

        const updatedArrivalMs = schedArrivalMs + incomingDelay * 60 * 1000;
        const updatedDepartureMs = schedDepartureMs + outgoingDelay * 60 * 1000;
        const layoverDurationHours = (updatedDepartureMs - updatedArrivalMs) / 3600000;

        // Safe Exit Window = Departure - 2h - (Arrival + 1.5h) = Duration - 3.5h
        const safeExitWindowHours = layoverDurationHours - 3.5;

        // Estimate service load
        const details = trip.details || {};
        let totalServiceHours = 0;
        if (details.hotelId) totalServiceHours += 6.0;
        if (details.diningId) totalServiceHours += 1.5;
        if (details.activityId) totalServiceHours += 4.0;
        if (details.spaId) totalServiceHours += 1.5;
        if (details.gamingId) totalServiceHours += 2.0;

        const experienceFeasible = !isCancelled && (safeExitWindowHours >= totalServiceHours) && (safeExitWindowHours > 1.0);

        // Prepare Updates
        const updates = {
          incoming_flight_delay: incomingDelay,
          outgoing_flight_delay: outgoingDelay,
          flight_cancelled: isCancelled,
          departure_gate: currentGate,
          actual_arrival: new Date(updatedArrivalMs).toISOString(),
          actual_departure: new Date(updatedDepartureMs).toISOString(),
          layover_duration: layoverDurationHours,
          safe_exit_window: safeExitWindowHours,
          experience_feasible: experienceFeasible,
          updated_at: new Date().toISOString()
        };

        // Write updates in PostgreSQL
        const { error: updateError } = await supabase
          .from("trips")
          .update(updates)
          .eq('booking_id', tripId);

        if (updateError) throw updateError;
        console.log(`Trip ${tripId} updated in PostgreSQL.`, updates);

        // Dispatch Notifications
        const userId = trip.uid || 'guest-traveler';
        if (isCancelled) {
          await notificationService.sendNotification({
            userId, bookingId: tripId, title: "🚨 Transit Flight Cancelled",
            message: `Your flight has been cancelled. Please contact concierge support immediately.`,
            type: "flight_cancellation"
          });
        } else {
          if (incomingChanged && incomingDelay > 0) {
            await notificationService.sendNotification({
              userId, bookingId: tripId, title: "⚠️ Incoming Flight Delayed",
              message: `Your incoming flight is delayed by ${incomingDelay} minutes. Your layover has been shortened.`,
              type: "flight_delay"
            });
          }
          if (outgoingChanged && outgoingDelay > 0) {
            await notificationService.sendNotification({
              userId, bookingId: tripId, title: "✈️ Outgoing Flight Delayed",
              message: `Your departure flight is delayed by ${outgoingDelay} minutes. Your layover has been extended.`,
              type: "flight_delay"
            });
          }
          if (gateChanged && currentGate) {
            await notificationService.sendNotification({
              userId, bookingId: tripId, title: "🎫 Boarding Gate Updated",
              message: `Your departure gate has been updated to ${currentGate}.`,
              type: "layover_update"
            });
          }
          if (!experienceFeasible && (trip.experience_feasible !== false)) {
            await notificationService.sendNotification({
              userId, bookingId: tripId, title: "🚨 Layover Safe Window Warning",
              message: `Due to delays, your booked experiences exceed the safe layover exit window. Reschedule required.`,
              type: "experience_unfeasible"
            });
          }
        }
      } else {
        console.log(`No updates for Trip ${tripId}. Flight schedule is on track.`);
      }
    }
  } catch (error) {
    console.error("Error checking flight delays:", error);
    await logToErrorLogs("ERROR", "flight-delay-monitoring", `Global scheduler failed: ${error.message}`, error);
  }
  return processedCount;
}

async function contactSubmit(data, context) {
  const { name, email, subject, message } = data;
  const uid = context.auth ? context.auth.uid : 'guest-traveler';

  if (!name || !email || !subject || !message) {
    throw { status: 400, message: "Missing required contact form fields." };
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('contacts').insert({
    name,
    email,
    subject,
    message,
    user_id: uid,
    created_at: new Date().toISOString()
  });

  if (error) {
    throw error;
  }

  // Send email to admin
  try {
    await emailService.sendEmail({
      from: 'LayoverX Contact Form <contact@layoverx.com>',
      to: 'admin@layoverx.com',
      subject: `New Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });
  } catch (emailErr) {
    console.error("Failed to send contact notification email to admin:", emailErr.message);
  }

  // Send confirmation email to client
  try {
    await emailService.sendEmail({
      from: 'LayoverX Support <support@layoverx.com>',
      to: email,
      subject: `We've received your request: ${subject}`,
      text: `Hi ${name},\n\nThank you for reaching out to LayoverX. We have received your message and our team will get back to you shortly.\n\nYour message:\n"${message}"\n\nBest regards,\nLayoverX Concierge Team`
    });
  } catch (emailErr) {
    console.error("Failed to send contact confirmation email to user:", emailErr.message);
  }

  return { success: true, message: "Contact form submitted successfully." };
}

module.exports = {
  lockInventory,
  validateLockSession,
  createPaymentIntent,
  partnerRegistration,
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
  runFlightDelaysCheck,
  contactSubmit
};