const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-access-secret-1234';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-1234';

/**
 * Generate a JWT access token for a user
 * @param {object} user - User properties (e.g. { id, email })
 * @returns {string} Signed access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate a JWT refresh token for a user
 * @param {object} user - User properties
 * @returns {string} Signed refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify access token and decode payload
 * @param {string} token - Access token
 * @returns {object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Verify refresh token and decode payload
 * @param {string} token - Refresh token
 * @returns {object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
