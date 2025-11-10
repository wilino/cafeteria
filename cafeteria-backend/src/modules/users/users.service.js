/**
 * Users Service
 * Business logic for users management
 */

const usersRepository = require('./users.repository');
const { hashPassword, validatePasswordStrength } = require('../../shared/utils/password.util');
const { isValidEmail, isValidInteger } = require('../../shared/utils/validation.util');
const ValidationError = require('../../shared/errors/ValidationError');
const NotFoundError = require('../../shared/errors/NotFoundError');
const AuthorizationError = require('../../shared/errors/AuthorizationError');
const logger = require('../../shared/utils/logger.util');

class UsersService {
  /**
   * Get all users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Records per page
   * @returns {Promise<object>} Paginated users
   */
  async getAllUsers(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const users = await usersRepository.findAll(limit, offset);
    const total = await usersRepository.count();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<object>} User object
   */
  async getUserById(id) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid user ID');
    }

    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Remove sensitive data
    delete user.password_hash;

    return user;
  }

  /**
   * Create new user (admin only)
   * @param {object} userData - User data
   * @param {object} requestingUser - User making the request
   * @returns {Promise<object>} Created user
   */
  async createUser(userData, requestingUser) {
    const { nombre, email, password, roleId } = userData;

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

    // Check if email already exists
    const existingUser = await usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }

    // Validate role
    if (roleId && !isValidInteger(roleId)) {
      throw new ValidationError('Invalid role ID');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = await usersRepository.create({
      nombre,
      email,
      passwordHash,
      roleId: roleId || 3, // Default to cliente role
    });

    logger.info('User created', {
      userId,
      createdBy: requestingUser.id,
    });

    return await this.getUserById(userId);
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {object} userData - User data to update
   * @param {object} requestingUser - User making the request
   * @returns {Promise<object>} Updated user
   */
  async updateUser(id, userData, requestingUser) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid user ID');
    }

    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Users can only update themselves unless they're admin
    if (requestingUser.role !== 'admin' && requestingUser.id !== id) {
      throw new AuthorizationError('Cannot update other users');
    }

    const updateData = {};

    if (userData.nombre) {
      updateData.nombre = userData.nombre;
    }

    if (userData.email) {
      if (!isValidEmail(userData.email)) {
        throw new ValidationError('Invalid email format');
      }
      
      // Check if email is already in use by another user
      const existingUser = await usersRepository.findByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new ValidationError('Email already in use');
      }
      
      updateData.email = userData.email;
    }

    // Only admins can change role and active status
    if (requestingUser.role === 'admin') {
      if (userData.roleId !== undefined) {
        if (!isValidInteger(userData.roleId)) {
          throw new ValidationError('Invalid role ID');
        }
        updateData.roleId = userData.roleId;
      }

      if (userData.active !== undefined) {
        updateData.active = userData.active ? 1 : 0;
      }
    }

    const updated = await usersRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update user');
    }

    logger.info('User updated', {
      userId: id,
      updatedBy: requestingUser.id,
    });

    return await this.getUserById(id);
  }

  /**
   * Delete user (soft delete)
   * @param {number} id - User ID
   * @param {object} requestingUser - User making the request
   * @returns {Promise<void>}
   */
  async deleteUser(id, requestingUser) {
    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid user ID');
    }

    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Cannot delete yourself
    if (requestingUser.id === id) {
      throw new ValidationError('Cannot delete your own account');
    }

    const deleted = await usersRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete user');
    }

    logger.info('User deleted', {
      userId: id,
      deletedBy: requestingUser.id,
    });
  }

  /**
   * Change user password
   * @param {number} id - User ID
   * @param {object} passwordData - Password change data
   * @param {object} requestingUser - User making the request
   * @returns {Promise<void>}
   */
  async changePassword(id, passwordData, requestingUser) {
    const { newPassword } = passwordData;

    if (!isValidInteger(id)) {
      throw new ValidationError('Invalid user ID');
    }

    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Users can only change their own password unless they're admin
    if (requestingUser.role !== 'admin' && requestingUser.id !== id) {
      throw new AuthorizationError('Cannot change other users passwords');
    }

    if (!newPassword) {
      throw new ValidationError('New password is required');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new ValidationError('Weak password', passwordValidation.errors);
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    const updated = await usersRepository.updatePassword(id, passwordHash);
    if (!updated) {
      throw new Error('Failed to update password');
    }

    logger.info('Password changed', {
      userId: id,
      changedBy: requestingUser.id,
    });
  }

  /**
   * Get all roles
   * @returns {Promise<array>} List of roles
   */
  async getRoles() {
    return await usersRepository.findAllRoles();
  }
}

module.exports = new UsersService();
