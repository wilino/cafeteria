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
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * 
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets requirements
 */
function validatePasswordStrength(password) {
  if (!password || password.length < PASSWORD_MIN_LENGTH) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
