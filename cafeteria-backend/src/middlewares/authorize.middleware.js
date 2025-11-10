/**
 * Authorization Middleware
 * Checks user roles
 */

const AuthorizationError = require('../shared/errors/AuthorizationError');
const logger = require('../shared/utils/logger.util');

/**
 * Check if user has required role
 * @param {array} allowedRoles - Array of allowed role names
 * @returns {function} Middleware function
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthorizationError('User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Authorization failed:', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          path: req.path,
        });
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = authorize;
