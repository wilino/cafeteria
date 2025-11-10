/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

const { verifyToken } = require('../shared/utils/jwt.util');
const AuthenticationError = require('../shared/errors/AuthenticationError');
const logger = require('../shared/utils/logger.util');

async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    logger.warn('Authentication failed:', {
      error: error.message,
      ip: req.ip,
      path: req.path,
    });
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Invalid or expired token'));
    }
    
    next(error);
  }
}

module.exports = authenticate;
