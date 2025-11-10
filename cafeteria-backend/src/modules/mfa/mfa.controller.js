/**
 * MFA Controller
 * Handles MFA setup, verification, and management
 */

const mfaService = require('./mfa.service');
const logger = require('../../shared/utils/logger.util');

class MFAController {
  /**
   * Setup MFA - Generate QR code
   * POST /api/mfa/setup
   */
  async setup(req, res, next) {
    try {
      const userId = req.user.id;

      const { secret, qrCode, otpauthUrl } = await mfaService.generateSecret(userId);

      res.json({
        success: true,
        message: 'Scan the QR code with your authenticator app',
        data: {
          secret,
          qrCode,
          otpauthUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify and enable MFA
   * POST /api/mfa/enable
   */
  async enable(req, res, next) {
    try {
      const userId = req.user.id;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required',
        });
      }

      await mfaService.enableMFA(userId, token);

      // Generate backup codes
      const backupCodes = await mfaService.generateBackupCodes(userId);

      res.json({
        success: true,
        message: 'MFA enabled successfully',
        data: {
          backupCodes,
          warning: 'Save these backup codes in a secure location. They can be used if you lose access to your authenticator app.',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Disable MFA
   * POST /api/mfa/disable
   */
  async disable(req, res, next) {
    try {
      const userId = req.user.id;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required to disable MFA',
        });
      }

      await mfaService.disableMFA(userId, token);

      res.json({
        success: true,
        message: 'MFA disabled successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get MFA status
   * GET /api/mfa/status
   */
  async getStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const enabled = await mfaService.isMFAEnabled(userId);

      res.json({
        success: true,
        data: {
          mfaEnabled: enabled,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify MFA token (for testing)
   * POST /api/mfa/verify
   */
  async verify(req, res, next) {
    try {
      const userId = req.user.id;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required',
        });
      }

      const valid = await mfaService.verifyToken(userId, token);

      res.json({
        success: true,
        data: {
          valid,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MFAController();
