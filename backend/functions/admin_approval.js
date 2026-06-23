/**
 * admin_approval.js
 * Express.js routes for the admin dashboard to review pending partners.
 * Integrates with Supabase Auth and Supabase Database.
 */

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

  console.error(`[Admin Backend Logged] [${severity}] ${source}: ${cleanMessage}`);

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

/**
 * Reusable Authentication Middleware
 * Validates the presence and signature of the Supabase JWT.
 * Attaches req.uid and req.user on success.
 */
async function authenticateRequest(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const msg = `Unauthorized access attempt to ${req.originalUrl || req.url}: Missing or malformed Authorization header`;
    console.warn(msg);
    await logToErrorLogs("WARNING", "admin-auth-middleware", msg, null, "unauthenticated");
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return false;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw error || new Error("User session invalid");
    }
    req.uid = user.id;
    req.user = user;
    return true;
  } catch (error) {
    const msg = `Unauthorized access to ${req.originalUrl || req.url}: Supabase token verification failed: ${error.message}`;
    console.error(msg);
    await logToErrorLogs("ERROR", "admin-auth-middleware", msg, error, "unauthenticated");
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return false;
  }
}

/**
 * Helper to verify user record has admin claims
 */
async function verifyAdmin(email, user) {
  // 1. Verify against explicit admin email whitelist configured in Env Variables
  const adminEmails = (process.env.ADMIN_EMAILS || 'admin@layoverx.com')
    .split(',')
    .map(e => e.trim().toLowerCase());

  if (email && adminEmails.includes(email.toLowerCase())) {
    return true;
  }

  // 2. Fallback to Supabase app_metadata custom role claims
  const claims = user?.app_metadata?.claims || {};
  return claims.admin === true || user?.app_metadata?.role === 'admin';
}

exports.getPendingPartners = async (req, res) => {
  const authenticated = await authenticateRequest(req, res);
  if (!authenticated) return;

  try {
    const isAdmin = await verifyAdmin(req.user.email, req.user);
    if (!isAdmin) {
      const msg = `Forbidden access attempt to ${req.originalUrl || req.url}: User UID ${req.uid} does not have admin claims.`;
      console.warn(msg);
      await logToErrorLogs("ERROR", "admin-auth-middleware", msg, null, req.uid);
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const supabase = getSupabaseClient();
    const { data: partners, error } = await supabase
      .from('partners')
      .select('*')
      .eq('status', 'pending');

    if (error) throw error;

    const pending = partners.map(p => ({
      id: p.partner_id,
      data: {
        partnerId: p.partner_id,
        status: p.status,
        createdAt: p.created_at
      }
    }));

    // Audit Log success
    const auditMsg = `Admin Email ${req.user.email} successfully fetched pending partner registrations.`;
    await logToErrorLogs("INFO", "admin-action", auditMsg, null, req.uid);

    res.json({ pending });
  } catch (e) {
    console.error('Error in getPendingPartners:', e);
    await logToErrorLogs("ERROR", "admin-pending-partners", `Failed to get pending partners for UID ${req.uid || 'unknown'}: ${e.message}`, e, req.uid);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.approvePartner = async (req, res) => {
  const authenticated = await authenticateRequest(req, res);
  if (!authenticated) return;

  try {
    const isAdmin = await verifyAdmin(req.user.email, req.user);
    if (!isAdmin) {
      const msg = `Forbidden access attempt to ${req.originalUrl || req.url}: User UID ${req.uid} does not have admin claims.`;
      console.warn(msg);
      await logToErrorLogs("ERROR", "admin-auth-middleware", msg, null, req.uid);
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { partnerId } = req.body;
    if (!partnerId) {
      const errMsg = "partnerId required for approval";
      await logToErrorLogs("ERROR", "admin-approve-partner", errMsg, null, req.uid);
      return res.status(400).json({ error: 'partnerId required' });
    }

    const supabase = getSupabaseClient();
    const { data: partner, error: fetchError } = await supabase
      .from('partners')
      .select('*')
      .eq('partner_id', partnerId)
      .single();

    if (fetchError || !partner) {
      const errMsg = `Partner ${partnerId} not found during approval`;
      await logToErrorLogs("ERROR", "admin-approve-partner", errMsg, null, req.uid);
      return res.status(404).json({ error: 'Partner not found' });
    }

    if (partner.status !== 'pending') {
      const errMsg = `Partner ${partnerId} status is ${partner.status}, only pending can be approved`;
      await logToErrorLogs("ERROR", "admin-approve-partner", errMsg, null, req.uid);
      return res.status(400).json({ error: 'Only pending partners can be approved' });
    }

    const { error: updateError } = await supabase
      .from('partners')
      .update({ 
        status: 'active', 
        approved_by_admin_uid: req.uid,
        updated_at: new Date().toISOString()
      })
      .eq('partner_id', partnerId);

    if (updateError) throw updateError;

    // Audit Log success
    const auditMsg = `Admin Email ${req.user.email} successfully approved partner ID: ${partnerId}`;
    await logToErrorLogs("INFO", "admin-action", auditMsg, null, req.uid);

    res.json({ success: true, updatedId: partnerId });
  } catch (e) {
    console.error('Error in approvePartner:', e);
    await logToErrorLogs("ERROR", "admin-approve-partner", `approvePartner failure: ${e.message}`, e, req.uid);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.rejectPartner = async (req, res) => {
  const authenticated = await authenticateRequest(req, res);
  if (!authenticated) return;

  try {
    const isAdmin = await verifyAdmin(req.user.email, req.user);
    if (!isAdmin) {
      const msg = `Forbidden access to ${req.originalUrl || req.url}: User UID ${req.uid} does not have admin claims.`;
      console.warn(msg);
      await logToErrorLogs("ERROR", "admin-auth-middleware", msg, null, req.uid);
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { partnerId } = req.body;
    if (!partnerId) {
      const errMsg = "partnerId required for rejection";
      await logToErrorLogs("ERROR", "admin-reject-partner", errMsg, null, req.uid);
      return res.status(400).json({ error: 'partnerId required' });
    }

    const supabase = getSupabaseClient();
    const { data: partner, error: fetchError } = await supabase
      .from('partners')
      .select('*')
      .eq('partner_id', partnerId)
      .single();

    if (fetchError || !partner) {
      const errMsg = `Partner ${partnerId} not found during rejection`;
      await logToErrorLogs("ERROR", "admin-reject-partner", errMsg, null, req.uid);
      return res.status(404).json({ error: 'Partner not found' });
    }

    if (partner.status !== 'pending') {
      const errMsg = `Partner ${partnerId} status is ${partner.status}, only pending can be rejected`;
      await logToErrorLogs("ERROR", "admin-reject-partner", errMsg, null, req.uid);
      return res.status(400).json({ error: 'Only pending partners can be rejected' });
    }

    const { error: updateError } = await supabase
      .from('partners')
      .update({ 
        status: 'rejected', 
        rejected_by_admin_uid: req.uid,
        updated_at: new Date().toISOString()
      })
      .eq('partner_id', partnerId);

    if (updateError) throw updateError;

    // Audit Log success
    const auditMsg = `Admin Email ${req.user.email} successfully rejected partner ID: ${partnerId}`;
    await logToErrorLogs("INFO", "admin-action", auditMsg, null, req.uid);

    res.json({ success: true, updatedId: partnerId });
  } catch (e) {
    console.error('Error in rejectPartner:', e);
    await logToErrorLogs("ERROR", "admin-reject-partner", `rejectPartner failure: ${e.message}`, e, req.uid);
    res.status(500).json({ error: 'Internal server error' });
  }
};