const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret);
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const db = admin.firestore();

// ------------------------------------------------------------------
// Improvement 1.2: Real-time inventory locking (10 minutes)
// ------------------------------------------------------------------
exports.lockInventory = functions.https.onCall(async (data, context) => {
    // Note: In production, verify user auth via context.auth
    const { items, sessionId } = data;
    const batch = db.batch();
    const locksRef = db.collection('inventory_locks');

    try {
        for (const item of items) {
            const lockDoc = locksRef.doc(`${item.serviceId}_${item.slot}`);
            const doc = await lockDoc.get();
            if (doc.exists && doc.data().expiresAt > Date.now()) {
                throw new functions.https.HttpsError('aborted', 'Service slot is currently held by another user.');
            }
            batch.set(lockDoc, {
                sessionId: sessionId,
                lockedAt: Date.now(),
                expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
            });
        }
        await batch.commit();
        return { success: true, message: "Inventory locked successfully for 10 minutes." };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// ------------------------------------------------------------------
// Improvement 2.3 & 3.1: Secure Payment Gateway & Cart Validation
// ------------------------------------------------------------------
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
    const { cartItems } = data;
    let validatedTotal = 0;

    // Secure Cart Validation: Calculate totals securely on the backend
    for (const item of cartItems) {
        const serviceDoc = await db.collection('services').doc(item.serviceId).get();
        if (!serviceDoc.exists) throw new functions.https.HttpsError('not-found', 'Service not found');
        validatedTotal += (serviceDoc.data().price * item.quantity);
    }

    try {
        // Create Stripe Payment Intent handling marketplace split/escrow
        const paymentIntent = await stripe.paymentIntents.create({
            amount: validatedTotal * 100, // in smallest currency unit (e.g., paise)
            currency: 'inr',
            automatic_payment_methods: { enabled: true },
            // In a real marketplace, use Stripe Connect 'transfer_data' here
            metadata: { integration_check: 'accept_a_payment' },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            validatedTotal: validatedTotal
        };
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// ------------------------------------------------------------------
// Improvement 2.1: Partner Registration Notification
// ------------------------------------------------------------------
exports.onPartnerRegistration = functions.firestore
    .document('supplier_applications/{appId}')
    .onCreate(async (snap, context) => {
        const newPartner = snap.data();
        
        // Ensure status is explicitly pending
        await snap.ref.update({ status: 'pending_review' });

        // Email notification to Admin
        sgMail.setApiKey(functions.config().sendgrid.key);
        const msg = {
            to: 'admin@layoverx.com',
            from: 'noreply@layoverx.com',
            subject: `New Partner Application: ${newPartner.businessName}`,
            text: `Review required for new vendor: ${newPartner.businessName} (${newPartner.businessCategory})`,
        };
        
        try {
            await sgMail.send(msg);
            console.log('Admin notification sent');
        } catch (error) {
            console.error('Error sending email', error);
        }
    });

// ------------------------------------------------------------------
// Improvement 3.2: Flight Delay Real-time Adjustments (Stub)
// ------------------------------------------------------------------
exports.checkFlightDelays = functions.pubsub.schedule('every 30 minutes').onRun(async (context) => {
    // 1. Fetch upcoming bookings within next 24 hours.
    // 2. Call FlightAware API with their flight numbers.
    // 3. If delay > 30 mins, push notification/SMS to user and update itinerary timeline in Firestore.
    console.log("Running flight delay check routine...");
    return null;
});