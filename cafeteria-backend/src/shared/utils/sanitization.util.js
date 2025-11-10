/**
 * Sanitization Utility
 * Input sanitization for security
 */

const DOMPurify = require('isomorphic-dompurify');
const validator = require('validator');

/**
 * Sanitize HTML content
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize SQL input (basic)
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
function sanitizeSql(input) {
  if (typeof input !== 'string') return '';
  // Remove common SQL injection patterns
  return input
    .replace(/['";]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * Sanitize filename
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  if (typeof filename !== 'string') return '';
  return filename.replace(/[^a-zA-Z0-9._-]/g, '');
}

/**
 * Sanitize object for logging (remove sensitive data)
 * @param {object} obj - Object to sanitize
 * @returns {object} Sanitized object
 */
function sanitizeForLogging(obj) {
  const sensitiveFields = ['password', 'password_hash', 'token', 'secret', 'api_key'];
  const sanitized = { ...obj };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  }

  return sanitized;
}

/**
 * Escape special characters for regex
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  sanitizeHtml,
  sanitizeSql,
  sanitizeFilename,
  sanitizeForLogging,
  escapeRegex,
};
