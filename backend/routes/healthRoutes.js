const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

// GET /api/health - Health check endpoint for uptime monitoring and connectivity testing
router.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    services: {
      server: 'healthy',
      database: 'unhealthy'
    }
  };

  try {
    // Run a query on Supabase to ensure connection is live
    const { error } = await supabaseAdmin
      .from('transfers')
      .select('id')
      .limit(1);

    if (error) throw error;
    
    healthCheck.services.database = 'healthy';
    
    res.status(200).json({
      success: true,
      status: 'UP',
      ...healthCheck
    });
  } catch (error) {
    console.error('DATABASE CONNECTIVITY FAILURE:', error);
    res.status(503).json({
      success: false,
      status: 'DEGRADED',
      error: error.message,
      ...healthCheck
    });
  }
});

module.exports = router;
