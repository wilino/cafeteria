/**
 * Users Controller
 * Handles HTTP requests for users management
 */

const usersService = require('./users.service');

class UsersController {
  /**
   * Get all users
   * GET /api/users
   */
  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const result = await usersService.getAllUsers(page, limit);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await usersService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user
   * POST /api/users
   */
  async createUser(req, res, next) {
    try {
      const user = await usersService.createUser(req.body, req.user);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * PUT /api/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const user = await usersService.updateUser(req.params.id, req.body, req.user);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   * DELETE /api/users/:id
   */
  async deleteUser(req, res, next) {
    try {
      await usersService.deleteUser(req.params.id, req.user);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user password
   * POST /api/users/:id/change-password
   */
  async changePassword(req, res, next) {
    try {
      await usersService.changePassword(req.params.id, req.body, req.user);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all roles
   * GET /api/users/roles
   */
  async getRoles(req, res, next) {
    try {
      const roles = await usersService.getRoles();

      res.status(200).json({
        success: true,
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
