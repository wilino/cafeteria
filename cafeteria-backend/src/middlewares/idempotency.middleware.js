/**
 * Idempotency Middleware
 * Prevents duplicate requests (especially for order creation)
 * Implements idempotency keys as per best practices
 */

const pool = require('../config/database.config');
const logger = require('../shared/utils/logger.util');
const { v4: uuidv4, validate: isUUID } = require('uuid');

// In-memory cache for recent idempotency keys (production should use Redis)
const idempotencyCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Idempotency middleware for POST requests
 * Requires 'Idempotency-Key' header with UUID v4
 */
function idempotencyMiddleware(req, res, next) {
  // Only apply to POST/PUT/PATCH methods
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'];

  // Idempotency key is optional but recommended
  if (!idempotencyKey) {
    logger.warn('Request without idempotency key', {
      method: req.method,
      path: req.path,
      userId: req.user?.id,
    });
    return next();
  }

  // Validate UUID format
  if (!isUUID(idempotencyKey)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid idempotency key format. Must be UUID v4.',
      example: uuidv4(),
    });
  }

  // Check cache first (faster)
  const cachedResponse = idempotencyCache.get(idempotencyKey);
  if (cachedResponse) {
    logger.info('Idempotency key found in cache - returning cached response', {
      idempotencyKey,
      userId: req.user?.id,
    });
    
    return res.status(cachedResponse.statusCode).json(cachedResponse.body);
  }

  // Check database for existing request
  checkIdempotencyInDB(idempotencyKey, req, res, next);
}

/**
 * Check if idempotency key exists in database
 */
async function checkIdempotencyInDB(idempotencyKey, req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT response_status, response_body, created_at 
       FROM idempotency_keys 
       WHERE idempotency_key = ? AND user_id = ?`,
      [idempotencyKey, req.user?.id || null]
    );

    if (rows.length > 0) {
      const existing = rows[0];
      const response = JSON.parse(existing.response_body);

      logger.info('Idempotency key found in DB - returning stored response', {
        idempotencyKey,
        userId: req.user?.id,
        originalTimestamp: existing.created_at,
      });

      // Cache it for future requests
      idempotencyCache.set(idempotencyKey, {
        statusCode: existing.response_status,
        body: response,
      });

      return res.status(existing.response_status).json(response);
    }

    // Key not found, process request normally
    // Intercept response to store it
    interceptResponse(req, res, next, idempotencyKey);
  } catch (error) {
    logger.error('Error checking idempotency', error);
    // Don't block request if idempotency check fails
    next();
  }
}

/**
 * Intercept response to store idempotency key
 */
function interceptResponse(req, res, next, idempotencyKey) {
  const originalSend = res.send;

  res.send = function (data) {
    // Only store successful responses (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      storeIdempotencyKey(idempotencyKey, req.user?.id, res.statusCode, data).catch(err => {
        logger.error('Failed to store idempotency key', err);
      });
    }

    originalSend.call(this, data);
  };

  req.idempotencyKey = idempotencyKey;
  next();
}

/**
 * Store idempotency key and response in database
 */
async function storeIdempotencyKey(idempotencyKey, userId, statusCode, responseBody) {
  try {
    await pool.execute(
      `INSERT INTO idempotency_keys (idempotency_key, user_id, response_status, response_body, expires_at)
       VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
       ON DUPLICATE KEY UPDATE response_status = VALUES(response_status), response_body = VALUES(response_body)`,
      [idempotencyKey, userId, statusCode, responseBody]
    );

    // Also cache it
    idempotencyCache.set(idempotencyKey, {
      statusCode,
      body: typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody,
    });

    // Set TTL for cache
    setTimeout(() => {
      idempotencyCache.delete(idempotencyKey);
    }, CACHE_TTL);

    logger.info('Idempotency key stored', {
      idempotencyKey,
      userId,
      statusCode,
    });
  } catch (error) {
    logger.error('Error storing idempotency key', error);
  }
}

/**
 * Clean up expired idempotency keys (run periodically)
 */
async function cleanupExpiredKeys() {
  try {
    const [result] = await pool.execute(
      'DELETE FROM idempotency_keys WHERE expires_at < NOW()'
    );

    if (result.affectedRows > 0) {
      logger.info('Cleaned up expired idempotency keys', {
        count: result.affectedRows,
      });
    }
  } catch (error) {
    logger.error('Error cleaning up idempotency keys', error);
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredKeys, 60 * 60 * 1000);

module.exports = idempotencyMiddleware;
