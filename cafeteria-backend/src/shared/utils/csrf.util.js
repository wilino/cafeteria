const crypto = require('crypto');

/**
 * Generate CSRF token using HMAC
 * @param {number} userId - User ID to include in token
 * @returns {string} CSRF token
 */
function generateCsrfToken(userId) {
  const secret = process.env.CSRF_SECRET;
  if (!secret) {
    throw new Error('CSRF_SECRET not configured');
  }
  
  return crypto
    .createHmac('sha256', secret)
    .update(String(userId))
    .digest('hex');
}

/**
 * Verify CSRF token
 * @param {string} token - CSRF token to verify
 * @param {number} userId - User ID to verify against
 * @returns {boolean} True if token is valid
 */
function verifyCsrfToken(token, userId) {
  const expectedToken = generateCsrfToken(userId);
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expectedToken)
  );
}

module.exports = {
  generateCsrfToken,
  verifyCsrfToken
};
