/**
 * services/notificationService.js
 * Notification service abstraction layer for LayoverX.
 * Saves notifications to PostgreSQL via Supabase and integrates with Resend and Twilio.
 */

const emailService = require('./emailService');

const getSupabaseClient = () => {
  if (global.supabase) return global.supabase;
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.SUPABASE_URL || 'https://mock.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key'
  );
};

async function sendNotification({ userId, bookingId, title, message, type }) {
  const supabase = getSupabaseClient();

  const notificationData = {
    user_id: userId || 'guest-traveler',
    booking_id: bookingId || 'unknown',
    title,
    message,
    type, // 'flight_delay' | 'flight_cancellation' | 'layover_update' | 'experience_unfeasible'
    created_at: new Date().toISOString()
  };

  try {
    // 1. Primary Channel: Save to PostgreSQL notifications table
    const { error } = await supabase.from("notifications").insert(notificationData);
    if (error) throw error;
    console.log(`[Notification Logged to Database] User: ${userId}, Title: "${title}"`);

    // 2. Future SMS / WhatsApp Channel (Twilio)
    const twilioSid = process.env.TWILIO_SID;
    const twilioToken = process.env.TWILIO_TOKEN;
    if (twilioSid && twilioToken) {
      // Lazy load Twilio if configured in environment
      // const twilio = require('twilio')(twilioSid, twilioToken);
      // await twilio.messages.create({ body: message, to: userPhone, from: twilioNumber });
      console.log(`[SMS Channel Stub] Sending Twilio alert to user...`);
    }

    // 3. Email Channel (Resend)
    try {
      await emailService.sendEmail({
        from: 'concierge@layoverx.com',
        to: 'alerts@layoverx.com', // fallback alert recipient or fetch traveler email
        subject: title,
        text: message
      });
    } catch (emailErr) {
      console.error("Notification email delivery failed:", emailErr.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to process notification:", error.message);
    throw error;
  }
}

module.exports = {
  sendNotification
};
