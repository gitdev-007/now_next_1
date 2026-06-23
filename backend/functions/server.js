/**
 * server.js
 * Standalone Express.js server for LayoverX Backend (Render Deployment)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Supabase Client on Backend (Service Role to bypass RLS)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are missing!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
global.supabase = supabase; // Expose globally to be used in index.js and admin_approval.js

// Import logic modules
const backendLogic = require('./index');
const adminLogic = require('./admin_approval');

// --------------------------------------------------------
// JWT AUTHENTICATION MIDDLEWARE
// --------------------------------------------------------
const authenticateRequestJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let auth = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        auth = { uid: user.id, email: user.email, token: user };
      }
    } catch (err) {
      console.warn("Token authorization warning:", err.message);
    }
  }
  req.context = { auth };
  next();
};

// Wrapper helper to convert business handlers (data, context) to standard Express
const makeRestRoute = (handler) => {
  return async (req, res) => {
    try {
      const result = await handler(req.body, req.context);
      res.json(result);
    } catch (error) {
      console.error(`Route Execution Error:`, error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || String(error)
      });
    }
  };
};

// --------------------------------------------------------
// ROUTE ASSIGNMENTS
// --------------------------------------------------------

// Auth Endpoints: POST /api/auth/*
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    if (error) throw error;
    res.json({ success: true, user: data.user, session: data.session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    res.json({ success: true, user: data.user, session: data.session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const { error } = await supabase.auth.admin.signOut(token);
      if (error) throw error;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/reset', async (req, res) => {
  const { email } = req.body;
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    res.json({ success: true, message: 'Password reset link sent.' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Bookings Endpoints: POST /api/bookings/*
app.post('/api/bookings/lock', authenticateRequestJWT, makeRestRoute(backendLogic.lockInventory));
app.post('/api/bookings/validate-lock', authenticateRequestJWT, makeRestRoute(backendLogic.validateLockSession));

// Payments Endpoints: POST /api/payments/*
app.post('/api/payments/create-order', authenticateRequestJWT, makeRestRoute(backendLogic.createRazorpayOrder));
app.post('/api/payments/verify', authenticateRequestJWT, makeRestRoute(backendLogic.verifyRazorpayPayment));
app.post('/api/payments/intent', authenticateRequestJWT, makeRestRoute(backendLogic.createPaymentIntent));

// Suppliers Endpoints: POST /api/suppliers/*
app.post('/api/suppliers/register', backendLogic.partnerRegistration);

// Admin Endpoints: POST /api/admin/*
app.post('/api/admin/pending', adminLogic.getPendingPartners);
app.post('/api/admin/approve', adminLogic.approvePartner);
app.post('/api/admin/reject', adminLogic.rejectPartner);
// Support GET fallback for compatibility with existing tests
app.get('/api/admin/pending', adminLogic.getPendingPartners);

// Contact Endpoint: POST /api/contact/*
app.post('/api/contact', authenticateRequestJWT, makeRestRoute(backendLogic.contactSubmit));
app.post('/api/contact/submit', authenticateRequestJWT, makeRestRoute(backendLogic.contactSubmit));

// Webhook Endpoints: POST /api/webhooks/*
app.post('/api/webhooks/razorpay', backendLogic.razorpayWebhook);

// Cron trigger endpoint for flight checks (Protected by secret token)
app.get('/api/cron/check-flight-delays', async (req, res) => {
  const secret = req.query.secret || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split('Bearer ')[1] : null);
  const expectedSecret = process.env.CRON_SECRET || 'layoverx_cron_secret';
  
  if (secret !== expectedSecret) {
    return res.status(401).json({ success: false, message: 'Unauthorized cron trigger' });
  }

  console.log("Cron trigger: Starting flight delays monitoring routine...");
  try {
    const count = await backendLogic.runFlightDelaysCheck();
    res.json({ success: true, checkedCount: count });
  } catch (err) {
    console.error("Cron trigger checkFlightDelays failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start listening
app.listen(PORT, () => {
  console.log(`LayoverX backend server running on port ${PORT}`);
  
  // Set up an automatic background interval (failsafe fallback if Render Cron is not configured)
  const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
  setInterval(async () => {
    console.log("Automatic Background Run: Triggering flight delay monitoring...");
    try {
      await backendLogic.runFlightDelaysCheck();
    } catch (err) {
      console.error("Background flight delay runner failed:", err);
    }
  }, INTERVAL_MS);
});
