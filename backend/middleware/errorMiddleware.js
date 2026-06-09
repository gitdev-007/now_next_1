/**
 * Global Error Handling Middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  console.error('SERVER EXCEPTION ERROR:', err.stack || err);

  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    errors: err.errors || null,
    // Only expose stack traces in development environment
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * Custom error class for API client failures
 */
class ApiError extends Error {
  constructor(message, status = 400, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  ApiError
};
