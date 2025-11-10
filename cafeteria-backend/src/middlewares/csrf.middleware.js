/**
 * CSRF Protection Middleware
 * Custom implementation using crypto tokens
 */

const crypto = require('crypto');
const logger = require('../shared/utils/logger.util');

// Store tokens in memory (consider Redis for production)
const tokenStore = new Map();

// Generate CSRF token
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Skip CSRF for health check and public endpoints
const skipCsrfForPaths = ['/health', '/api/auth/login', '/api/auth/register', '/api'];

// Middleware to generate and attach CSRF token
const attachCsrfToken = (req, res, next) => {
  if (skipCsrfForPaths.some(path => req.path === path || req.path.startsWith(path + '/'))) {
    return next();
  }

  // Generate token
  const csrfToken = generateCsrfToken();
  const sessionId = req.cookies.sessionId || crypto.randomUUID();

  // Store token
  tokenStore.set(sessionId, csrfToken);

  // Set cookies
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour
  });

  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: false, // Accessible to JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000,
  });

  next();
};

// Middleware to validate CSRF token
const validateCsrfToken = (req, res, next) => {
  // Skip validation for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip validation for excluded paths
  if (skipCsrfForPaths.some(path => req.path === path || req.path.startsWith(path + '/'))) {
    return next();
  }

  const sessionId = req.cookies.sessionId;
  const clientToken = req.headers['x-csrf-token'] || req.body._csrf;

  if (!sessionId || !clientToken) {
    logger.warn('CSRF validation failed: Missing token', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    return res.status(403).json({
      success: false,
      message: 'CSRF token missing',
    });
  }

  const serverToken = tokenStore.get(sessionId);

  if (!serverToken || serverToken !== clientToken) {
    logger.warn('CSRF validation failed: Invalid token', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
    });
  }

  next();
};

// Clean up expired tokens periodically (every 1 hour)
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of tokenStore.entries()) {
    if (data.expires && data.expires < now) {
      tokenStore.delete(sessionId);
    }
  }
}, 3600000);

module.exports = [attachCsrfToken, validateCsrfToken];
