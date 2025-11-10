/**
 * Swagger/OpenAPI Configuration
 * API Documentation setup
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cafetería API',
      version: '1.0.0',
      description: 'Sistema de gestión de cafetería con Node.js, Express y MySQL aplicando Clean Code y principios SOLID',
      contact: {
        name: 'API Support',
        email: 'support@cafeteria.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development HTTP server',
      },
      {
        url: 'https://localhost:3443',
        description: 'Development HTTPS server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
        csrfToken: {
          type: 'apiKey',
          in: 'header',
          name: 'X-CSRF-Token',
          description: 'CSRF protection token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nombre: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com',
            },
            role_id: {
              type: 'integer',
              example: 2,
            },
            active: {
              type: 'boolean',
              example: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@cafeteria.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'Admin123!@#',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['nombre', 'email', 'password'],
          properties: {
            nombre: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'SecurePass123!',
            },
          },
        },
        Ingrediente: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nombre: {
              type: 'string',
              example: 'Café en grano',
            },
            unidad_medida: {
              type: 'string',
              example: 'kg',
            },
            cantidad_disponible: {
              type: 'number',
              format: 'decimal',
              example: 50.5,
            },
            cantidad_minima: {
              type: 'number',
              format: 'decimal',
              example: 10.0,
            },
          },
        },
        MenuItem: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nombre: {
              type: 'string',
              example: 'Cappuccino',
            },
            descripcion: {
              type: 'string',
              example: 'Espresso con leche vaporizada',
            },
            precio: {
              type: 'number',
              format: 'decimal',
              example: 4.50,
            },
            disponible: {
              type: 'boolean',
              example: true,
            },
            categoria: {
              type: 'string',
              example: 'Bebidas Calientes',
            },
          },
        },
        Pedido: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            cliente_id: {
              type: 'integer',
              example: 5,
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'],
              example: 'pendiente',
            },
            total: {
              type: 'number',
              format: 'decimal',
              example: 15.50,
            },
            fecha_pedido: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints de autenticación y registro',
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios',
      },
      {
        name: 'Ingredientes',
        description: 'Gestión de ingredientes y stock',
      },
      {
        name: 'Menu',
        description: 'Gestión del menú de productos',
      },
      {
        name: 'Pedidos',
        description: 'Gestión de pedidos',
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.js', './src/server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
