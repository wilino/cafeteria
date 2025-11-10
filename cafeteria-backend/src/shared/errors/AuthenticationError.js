const AppError = require('./AppError');

/**
 * Error for authentication failures
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
