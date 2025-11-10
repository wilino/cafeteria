const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
function generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN || '2h') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null if invalid
 */
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
