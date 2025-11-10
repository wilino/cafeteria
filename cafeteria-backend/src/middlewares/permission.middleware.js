/**
 * Permission-based Authorization Middleware (OWASP Compliant)
 * Implements fine-grained access control instead of role-based only
 */

const pool = require('../config/database.config');
const AuthorizationError = require('../shared/errors/AuthorizationError');
const logger = require('../shared/utils/logger.util');

/**
 * Check if user has specific permission
 * @param {string} permission - Permission name (e.g., 'users.create')
 * @returns {function} Middleware function
 */
function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthorizationError('User not authenticated');
      }

      // Get user's permissions through their role
      const [permissions] = await pool.execute(
        `SELECT p.nombre, p.recurso, p.accion
         FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         JOIN users u ON u.role_id = rp.role_id
         WHERE u.id = ?`,
        [req.user.id]
      );

      const hasPermission = permissions.some(p => p.nombre === permission);

      if (!hasPermission) {
        logger.warn('Permission denied', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredPermission: permission,
          path: req.path,
          method: req.method,
        });

        // Log to audit table
        await logAuditEvent(req, 'ACCESS_DENIED', permission);

        throw new AuthorizationError(`Insufficient permissions: ${permission} required`);
      }

      // Log successful authorization
      req.userPermissions = permissions.map(p => p.nombre);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Check if user has any of the specified permissions
 * @param {array} permissions - Array of permission names
 * @returns {function} Middleware function
 */
function requireAnyPermission(...permissions) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthorizationError('User not authenticated');
      }

      const [userPermissions] = await pool.execute(
        `SELECT p.nombre
         FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         JOIN users u ON u.role_id = rp.role_id
         WHERE u.id = ?`,
        [req.user.id]
      );

      const userPermissionNames = userPermissions.map(p => p.nombre);
      const hasAnyPermission = permissions.some(p => userPermissionNames.includes(p));

      if (!hasAnyPermission) {
        logger.warn('Permission denied', {
          userId: req.user.id,
          requiredPermissions: permissions,
          userPermissions: userPermissionNames,
        });

        await logAuditEvent(req, 'ACCESS_DENIED', permissions.join(', '));

        throw new AuthorizationError('Insufficient permissions');
      }

      req.userPermissions = userPermissionNames;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Log audit event for sensitive operations
 * @param {object} req - Express request object
 * @param {string} accion - Action performed
 * @param {string} detalles - Additional details
 */
async function logAuditEvent(req, accion, detalles) {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const userId = req.user ? req.user.id : null;

    await pool.execute(
      `INSERT INTO audit_log (user_id, accion, recurso, detalles, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        accion,
        req.path,
        JSON.stringify({ detalles, method: req.method }),
        ip,
        userAgent,
      ]
    );
  } catch (error) {
    logger.error('Failed to log audit event', error);
  }
}

/**
 * Middleware to log all sensitive operations
 */
function auditLog(accion, recurso) {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = function(data) {
      // Log after successful operation
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logAuditEvent(req, accion, `${req.method} ${req.path}`).catch(err => {
          logger.error('Audit log failed', err);
        });
      }
      originalSend.call(this, data);
    };

    next();
  };
}

module.exports = {
  requirePermission,
  requireAnyPermission,
  auditLog,
  logAuditEvent,
};
