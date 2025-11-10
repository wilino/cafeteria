/**
 * Validation Utility
 * Common validation functions
 */

const validator = require('validator');

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  return validator.isEmail(email);
}

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} True if valid
 */
function isValidUUID(uuid) {
  return validator.isUUID(uuid);
}

/**
 * Validate integer
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid integer
 */
function isValidInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

/**
 * Validate decimal number
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid decimal
 */
function isValidDecimal(value) {
  return !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) >= 0;
}

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return validator.trim(validator.escape(input));
}

/**
 * Validate required fields
 * @param {object} data - Data object
 * @param {array} fields - Required field names
 * @returns {object} Validation result
 */
function validateRequiredFields(data, fields) {
  const missing = [];

  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} True if valid
 */
function isValidLength(value, min, max) {
  if (typeof value !== 'string') return false;
  return value.length >= min && value.length <= max;
}

module.exports = {
  isValidEmail,
  isValidUUID,
  isValidInteger,
  isValidDecimal,
  sanitizeString,
  validateRequiredFields,
  isValidLength,
};
