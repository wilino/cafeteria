const AppError = require('./AppError');

/**
 * Error for validation failures
 */
class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
