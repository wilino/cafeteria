/**
 * Authentication Service
 * Business logic for authentication
 */

const authRepository = require('./auth.repository');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../../shared/utils/password.util');
const { generateToken } = require('../../shared/utils/jwt.util');
const { isValidEmail } = require('../../shared/utils/validation.util');
const ValidationError = require('../../shared/errors/ValidationError');
const AuthenticationError = require('../../shared/errors/AuthenticationError');
const logger = require('../../shared/utils/logger.util');

class AuthService {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Created user info and token
   */
  async register(userData) {
    const { nombre, email, password } = userData;

    // Validate input
    if (!nombre || !email || !password) {
      throw new ValidationError('Missing required fields: nombre, email, password');
    }

    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new ValidationError('Weak password', passwordValidation.errors);
    }

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    // Get default role (cliente)
    const clienteRole = await authRepository.findRoleByName('cliente');
    if (!clienteRole) {
      logger.error('Default role "cliente" not found in database');
      throw new Error('System configuration error');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = await authRepository.createUser({
      nombre,
      email,
      passwordHash,
      roleId: clienteRole.id,
    });

    // Get created user
    const user = await authRepository.findUserById(userId);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role_name,
    });

    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role_name,
      },
      token,
    };
  }

  /**
   * Login user
   * @param {object} credentials - Login credentials
   * @returns {Promise<object>} User info and token (or MFA required)
   */
  async login(credentials) {
    const { email, password, mfaToken } = credentials;

    // Validate input
    if (!email || !password) {
      throw new ValidationError('Missing required fields: email, password');
    }

    if (!isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Find user
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      logger.warn('Failed login attempt', { email });
      throw new AuthenticationError('Invalid credentials');
    }

    // Check if MFA is enabled
    if (user.mfa_enabled && user.mfa_secret) {
      // MFA is required
      if (!mfaToken) {
        logger.info('MFA required for login', { userId: user.id, email });
        return {
          mfaRequired: true,
          tempToken: generateToken({ userId: user.id, temp: true }, '5m'),
        };
      }

      // Verify MFA token
      const mfaService = require('../mfa/mfa.service');
      const mfaValid = await mfaService.verifyToken(user.id, mfaToken);
      
      if (!mfaValid) {
        logger.warn('Invalid MFA token during login', { userId: user.id, email });
        throw new AuthenticationError('Invalid MFA token');
      }
    }

    // Update last login
    await authRepository.updateLastLogin(user.id);

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role_name,
    });

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role_name,
        mfaEnabled: user.mfa_enabled === 1,
      },
      token,
    };
  }

  /**
   * Get user profile
   * @param {number} userId - User ID
   * @returns {Promise<object>} User profile
   */
  async getProfile(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role_name,
      created_at: user.created_at,
    };
  }
}

module.exports = new AuthService();
