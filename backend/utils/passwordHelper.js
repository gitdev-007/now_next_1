const bcrypt = require('bcryptjs');

/**
 * Hash a plain text password using bcrypt
 * @param {string} password - The plain text password
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hash
 * @param {string} password - The plain text password
 * @param {string} hash - The hashed password to compare against
 * @returns {Promise<boolean>} Match result
 */
const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  verifyPassword
};
