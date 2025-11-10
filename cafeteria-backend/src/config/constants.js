module.exports = {
  ROLES: {
    ADMIN: 'admin',
    EMPLEADO: 'empleado',
    CLIENTE: 'cliente'
  },
  
  PEDIDO_ESTADOS: {
    PENDIENTE: 'pendiente',
    ACEPTADO: 'aceptado',
    PREPARANDO: 'preparando',
    LISTO: 'listo',
    CANCELADO: 'cancelado'
  },
  
  PASSWORD_MIN_LENGTH: 8,
  
  RATE_LIMITS: {
    LOGIN: { 
      windowMs: 60000,  // 1 minuto
      max: 5  // 5 intentos
    },
    PEDIDOS: { 
      windowMs: 900000,  // 15 minutos
      max: 10  // 10 pedidos
    },
    GENERAL: {
      windowMs: 900000,  // 15 minutos
      max: 100  // 100 requests
    }
  },

  JWT: {
    COOKIE_NAME: 'auth',
    CSRF_COOKIE_NAME: 'csrf'
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
  }
};
