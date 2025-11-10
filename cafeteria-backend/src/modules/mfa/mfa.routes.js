/**
 * MFA Routes
 * Multi-Factor Authentication endpoints
 */

const express = require('express');
const router = express.Router();
const mfaController = require('./mfa.controller');
const authenticate = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/mfa/setup:
 *   post:
 *     summary: Setup MFA - Generate QR code
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR code and secret generated
 */
router.post('/setup', authenticate, mfaController.setup.bind(mfaController));

/**
 * @swagger
 * /api/mfa/enable:
 *   post:
 *     summary: Enable MFA with token verification
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "123456"
 */
router.post('/enable', authenticate, mfaController.enable.bind(mfaController));

/**
 * @swagger
 * /api/mfa/disable:
 *   post:
 *     summary: Disable MFA (requires valid token)
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 */
router.post('/disable', authenticate, mfaController.disable.bind(mfaController));

/**
 * @swagger
 * /api/mfa/status:
 *   get:
 *     summary: Get MFA status for current user
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 */
router.get('/status', authenticate, mfaController.getStatus.bind(mfaController));

/**
 * @swagger
 * /api/mfa/verify:
 *   post:
 *     summary: Verify MFA token (testing)
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 */
router.post('/verify', authenticate, mfaController.verify.bind(mfaController));

module.exports = router;
