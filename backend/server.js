const app = require('./app');
const { supabaseAdmin } = require('./config/supabase');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Catch uncaught exceptions globally
process.on('uncaughtException', (err) => {
  console.error('CRITICAL UNCAUGHT EXCEPTION! Shutting down server...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Verify connection with Supabase before starting listener
const verifyDatabaseConnection = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('transfers')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log('✓ DATABASE CONNECTIVITY SUCCESS: Connected to Supabase PostgreSQL database.');
  } catch (error) {
    console.error('✗ DATABASE CONNECTIVITY FAILURE: Could not connect to Supabase PostgreSQL database.');
    console.error(error.message);
    // Don't shut down in development so server can be inspected/run without credentials, but warning is logged
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Start Server Listener
const server = app.listen(PORT, async () => {
  console.log(`========================================================`);
  console.log(`LayoverX Backend API listening on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================================`);
  
  await verifyDatabaseConnection();
});

// Catch unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.error('CRITICAL UNHANDLED REJECTION! Shutting down server gracefully...');
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
