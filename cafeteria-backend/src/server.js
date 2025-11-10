/**
 * Server Entry Point
 * Cafetería API - Clean Architecture
 */

const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const logger = require('./shared/utils/logger.util');
const errorMiddleware = require('./middlewares/error.middleware');
const { rateLimiterMiddleware } = require('./middlewares/rateLimiter.middleware');
const csrfMiddleware = require('./middlewares/csrf.middleware');
const { swaggerUi, swaggerSpec } = require('./config/swagger.config');

// Initialize Express app
const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting
app.use(rateLimiterMiddleware);

// CSRF Protection (after cookie parser)
app.use(csrfMiddleware);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Cafetería API Documentation',
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 environment:
 *                   type: string
 *                   example: development
 */
// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Cafetería API - Sistema de Gestión',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      auth: '/api/auth',
      users: '/api/users',
      menu: '/api/menu',
      ingredientes: '/api/ingredientes',
      pedidos: '/api/pedidos',
    },
  });
});

// Module Routes
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const ingredientesRoutes = require('./modules/ingredientes/ingredientes.routes');
const menuRoutes = require('./modules/menu/menu.routes');
const pedidosRoutes = require('./modules/pedidos/pedidos.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/ingredientes', ingredientesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/pedidos', pedidosRoutes);
// const ingredientesRoutes = require('./modules/ingredientes/ingredientes.routes');
// const pedidosRoutes = require('./modules/pedidos/pedidos.routes');
//
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/ingredientes', ingredientesRoutes);
// app.use('/api/pedidos', pedidosRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Error Handler (must be last)
app.use(errorMiddleware);

// Server Configuration
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start HTTP Server
http.createServer(app).listen(PORT, () => {
  logger.info(`🚀 HTTP Server running on port ${PORT}`, {
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Start HTTPS Server (if certificates exist)
const certPath = path.join(__dirname, '../cert/cert.pem');
const keyPath = path.join(__dirname, '../cert/key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const httpsOptions = {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  };

  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    logger.info(`🔒 HTTPS Server running on port ${HTTPS_PORT}`, {
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });
} else {
  logger.warn('SSL certificates not found. HTTPS server not started.', {
    certPath,
    keyPath,
  });
}

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
