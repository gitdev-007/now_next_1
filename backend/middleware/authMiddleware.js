const { verifyAccessToken } = require('../utils/jwtHelper');
const { ApiError } = require('./errorMiddleware');

/**
 * Authentication Middleware to protect routes with JWT token validations
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Format should be: Bearer <JWT_ACCESS_TOKEN>
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return next(new ApiError('Access Denied: No authentication token provided', 401));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach user payload to request (contains id and email)
    next();
  } catch (error) {
    let message = 'Unauthorized: Invalid token session';
    if (error.name === 'TokenExpiredError') {
      message = 'Unauthorized: Access token expired';
    }
    next(new ApiError(message, 401));
  }
};

module.exports = {
  authenticateToken
};
