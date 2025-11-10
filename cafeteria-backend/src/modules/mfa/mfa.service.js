/**
 * MFA (Multi-Factor Authentication) Module
 * Implements TOTP (Time-based One-Time Password) for enhanced security
 */

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const pool = require('../../config/database.config');
const AuthenticationError = require('../../shared/errors/AuthenticationError');
const logger = require('../../shared/utils/logger.util');

class MFAService {
  /**
   * Generate MFA secret for user
   * @param {number} userId - User ID
   * @returns {Object} Secret and QR code
   */
  async generateSecret(userId) {
    try {
      // Get user info
      const [users] = await pool.execute(
        'SELECT id, nombre, email FROM users WHERE id = ?',
        [userId]
      );

      if (!users.length) {
        throw new AuthenticationError('User not found');
      }

      const user = users[0];

      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `Cafetería (${user.email})`,
        issuer: 'Cafetería App',
        length: 32,
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      // Save secret (not enabled yet)
      await pool.execute(
        'UPDATE users SET mfa_secret = ?, mfa_enabled = 0 WHERE id = ?',
        [secret.base32, userId]
      );

      logger.info('MFA secret generated', { userId, email: user.email });

      return {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        otpauthUrl: secret.otpauth_url,
      };
    } catch (error) {
      logger.error('Error generating MFA secret', error);
      throw error;
    }
  }

  /**
   * Verify and enable MFA
   * @param {number} userId - User ID
   * @param {string} token - TOTP token from authenticator app
   * @returns {boolean} Success
   */
  async enableMFA(userId, token) {
    try {
      // Get user's secret
      const [users] = await pool.execute(
        'SELECT id, mfa_secret FROM users WHERE id = ?',
        [userId]
      );

      if (!users.length || !users[0].mfa_secret) {
        throw new AuthenticationError('MFA not configured');
      }

      const secret = users[0].mfa_secret;

      // Verify token
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 2, // Allow 2 time steps before/after
      });

      if (!verified) {
        logger.warn('Failed MFA verification attempt', { userId });
        throw new AuthenticationError('Invalid MFA token');
      }

      // Enable MFA
      await pool.execute(
        'UPDATE users SET mfa_enabled = 1 WHERE id = ?',
        [userId]
      );

      logger.info('MFA enabled successfully', { userId });

      return true;
    } catch (error) {
      logger.error('Error enabling MFA', error);
      throw error;
    }
  }

  /**
   * Verify MFA token during login
   * @param {number} userId - User ID
   * @param {string} token - TOTP token
   * @returns {boolean} Valid or not
   */
  async verifyToken(userId, token) {
    try {
      const [users] = await pool.execute(
        'SELECT id, mfa_secret, mfa_enabled FROM users WHERE id = ?',
        [userId]
      );

      if (!users.length) {
        throw new AuthenticationError('User not found');
      }

      const user = users[0];

      if (!user.mfa_enabled || !user.mfa_secret) {
        return true; // MFA not enabled, skip verification
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfa_secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        logger.warn('Invalid MFA token during login', { userId });
        return false;
      }

      logger.info('MFA verification successful', { userId });
      return true;
    } catch (error) {
      logger.error('Error verifying MFA token', error);
      throw error;
    }
  }

  /**
   * Disable MFA for user
   * @param {number} userId - User ID
   * @param {string} token - Current valid token to confirm
   */
  async disableMFA(userId, token) {
    try {
      // Verify token before disabling
      const valid = await this.verifyToken(userId, token);

      if (!valid) {
        throw new AuthenticationError('Invalid MFA token');
      }

      // Disable and clear secret
      await pool.execute(
        'UPDATE users SET mfa_enabled = 0, mfa_secret = NULL WHERE id = ?',
        [userId]
      );

      logger.info('MFA disabled', { userId });

      return true;
    } catch (error) {
      logger.error('Error disabling MFA', error);
      throw error;
    }
  }

  /**
   * Check if user has MFA enabled
   * @param {number} userId - User ID
   * @returns {boolean}
   */
  async isMFAEnabled(userId) {
    const [users] = await pool.execute(
      'SELECT mfa_enabled FROM users WHERE id = ?',
      [userId]
    );

    return users.length > 0 && users[0].mfa_enabled === 1;
  }

  /**
   * Generate backup codes for MFA
   * @param {number} userId - User ID
   * @returns {Array<string>} Backup codes
   */
  async generateBackupCodes(userId) {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
    }

    // Store hashed backup codes
    const bcrypt = require('bcrypt');
    const hashedCodes = await Promise.all(
      codes.map(code => bcrypt.hash(code, 10))
    );

    await pool.execute(
      'UPDATE users SET mfa_backup_codes = ? WHERE id = ?',
      [JSON.stringify(hashedCodes), userId]
    );

    logger.info('MFA backup codes generated', { userId, count: codes.length });

    return codes;
  }
}

module.exports = new MFAService();
