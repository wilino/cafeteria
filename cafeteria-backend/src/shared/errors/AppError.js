/**
 * Base error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
