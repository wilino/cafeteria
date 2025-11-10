const bcrypt = require('bcrypt');
const { PASSWORD_MIN_LENGTH } = require('../../config/constants');

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param {string} plainPassword - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(plainPassword) {
  if (!plainPassword || plainPassword.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare plain password with hash
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Validate password strength according to OWASP recommendations
 * Requirements:
 * - At least 8 characters (minimum)
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*(),.?":{}|<>_-+=)
 * - No common passwords (optional check)
 * 
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and errors array
 */
function validatePasswordStrength(password) {
  const errors = [];
  
  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }
  
  // Check minimum length
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }
  
  // Check maximum length (OWASP recommends max 128)
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }
  
  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }
  
  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/;']/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>_-+=)');
  }
  
  // Check for common weak patterns (OWASP recommendation)
  const weakPatterns = [
    /^(password|Password|PASSWORD|12345678|qwerty|abc123)/i,
    /^(.)\1+$/, // All same character
    /(123456|password|qwerty|letmein|welcome)/i
  ];
  
  for (const pattern of weakPatterns) {
    if (pattern.test(password)) {
      errors.push('Password is too common or weak. Please choose a stronger password');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
