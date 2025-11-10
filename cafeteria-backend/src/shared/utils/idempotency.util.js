const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique idempotency key
 * @returns {string} UUID v4
 */
function generateIdempotencyKey() {
  return uuidv4();
}

/**
 * Validate idempotency key format
 * @param {string} key - Key to validate
 * @returns {boolean} True if valid UUID v4
 */
function validateIdempotencyKey(key) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(key);
}

module.exports = {
  generateIdempotencyKey,
  validateIdempotencyKey
};
