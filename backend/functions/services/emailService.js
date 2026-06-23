/**
 * services/emailService.js
 * Centralized email notification service for LayoverX using Resend.
 */

const { Resend } = require('resend');

// Load Resend client only if API key is present
const resendKey = process.env.RESEND_API_KEY;
let resendInstance = null;

if (resendKey && resendKey !== 'YOUR_RESEND_KEY') {
  resendInstance = new Resend(resendKey);
} else {
  console.warn("WARNING: RESEND_API_KEY is missing or unconfigured. Emails will be logged but not sent.");
}

/**
 * Send an email via Resend
 * @param {Object} options - Email sending options
 * @param {string} options.from - Sender email (defaults to concierge@layoverx.com)
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text content
 * @param {string} [options.html] - HTML content
 */
async function sendEmail({ from = 'concierge@layoverx.com', to, subject, text, html }) {
  if (!to) {
    throw new Error("Missing recipient 'to' for email delivery");
  }

  const payload = {
    from,
    to,
    subject,
    text,
    html
  };

  if (resendInstance) {
    try {
      const result = await resendInstance.emails.send(payload);
      console.log(`[Email Sent] To: ${to}, Subject: "${subject}", ID: ${result.id || 'unknown'}`);
      return result;
    } catch (error) {
      console.error(`[Email Error] Failed to send email to ${to}:`, error.message);
      throw error;
    }
  } else {
    console.log(`[Email Stub Log]
    FROM: ${from}
    TO: ${to}
    SUBJECT: ${subject}
    CONTENT (Text): ${text || 'N/A'}
    CONTENT (HTML): ${html || 'N/A'}`);
    return { success: true, stub: true };
  }
}

module.exports = {
  sendEmail
};
