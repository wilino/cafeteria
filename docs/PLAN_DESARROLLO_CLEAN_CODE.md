# Plan de Desarrollo - Sistema de Cafetería con Clean Code

> **Proyecto:** Sistema de gestión de cafetería con Node.js + Express + MySQL  
> **Repositorio:** https://github.com/wilino/cafeteria  
> **Enfoque:** Clean Code, SOLID, Arquitectura limpia, Seguridad OWASP

---

## Tabla de Contenidos

1. [Principios Clean Code Aplicados](#principios-clean-code)
2. [Arquitectura del Sistema](#arquitectura)
3. [Instalación de Software Requerido](#instalacion)
4. [Estructura del Proyecto](#estructura)
5. [Plan de Implementación](#plan-implementacion)
6. [Estándares de Código](#estandares)
7. [Checklist de Calidad](#checklist)
8. [Frontend - React con Medidas de Seguridad](#frontend-react-seguridad)

---

## 1. Principios Clean Code Aplicados {#principios-clean-code}

### 1.1 Nombres Significativos
- Variables, funciones y clases con nombres descriptivos
- Evitar abreviaciones confusas
- Usar términos del dominio del negocio (ingrediente, pedido, menu)

### 1.2 Funciones Pequeñas
- Una función = una responsabilidad (SRP)
- Máximo 20 líneas por función
- Nombres verbales que describen la acción

### 1.3 Comentarios Mínimos
- Código autoexplicativo
- Comentarios solo para lógica compleja de negocio
- JSDoc para funciones públicas

### 1.4 Manejo de Errores
- Try-catch específicos
- Errores como objetos con contexto
- No retornar null, usar Optional pattern

### 1.5 DRY (Don't Repeat Yourself)
- Extraer código duplicado a funciones/utilidades
- Reutilización mediante composición

### 1.6 Principios SOLID
- **S**ingle Responsibility: Cada clase/módulo una responsabilidad
- **O**pen/Closed: Abierto a extensión, cerrado a modificación
- **L**iskov Substitution: Subtipos intercambiables
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Depender de abstracciones

---

## 2. Arquitectura del Sistema {#arquitectura}

### 2.1 Capas de la Aplicación

```
┌─────────────────────────────────────┐
│   HTTP Layer (Express Routes)       │  ← Puntos de entrada API
├─────────────────────────────────────┤
│   Controllers                        │  ← Orquestación, validación
├─────────────────────────────────────┤
│   Services (Business Logic)         │  ← Lógica de negocio pura
├─────────────────────────────────────┤
│   Repositories (Data Access)        │  ← Acceso a datos
├─────────────────────────────────────┤
│   Database (MySQL)                  │  ← Persistencia
└─────────────────────────────────────┘

        ┌─────────────────┐
        │  Middlewares    │  ← Cross-cutting concerns
        │  - Auth         │
        │  - Validation   │
        │  - Error Handle │
        │  - Logging      │
        └─────────────────┘
```

### 2.2 Patrón Repository
- Abstracción de acceso a datos
- Facilita testing con mocks
- Separa SQL de lógica de negocio

### 2.3 Dependency Injection
- Inyectar dependencias en constructores
- Facilita testing y flexibilidad

### 2.4 Separación de Responsabilidades
- **Routes**: Solo definir endpoints y middlewares
- **Controllers**: Validar entrada, llamar servicios, formatear respuesta
- **Services**: Lógica de negocio pura, agnóstica de HTTP
- **Repositories**: Queries SQL, mapeo de datos

---

## 3. Instalación de Software Requerido {#instalacion}

### 3.1 Verificar Instalaciones Existentes

```bash
# Node.js (requerido: v20+)
node --version

# npm
npm --version

# MySQL (requerido: v8+)
mysql --version

# OpenSSL (para certificados HTTPS)
openssl version

# Git
git --version
```

### 3.2 Instalación de Faltantes

#### Node.js (si no está instalado)
```bash
# macOS con Homebrew
brew install node@20

# Verificar instalación
node --version  # debe ser >= 20.x
```

#### MySQL 8
```bash
# macOS con Homebrew
brew install mysql@8.0
brew services start mysql@8.0

# Configurar contraseña root
mysql_secure_installation
```

#### OpenSSL (generalmente ya instalado en macOS)
```bash
# Si no está instalado
brew install openssl

# Verificar
openssl version
```

#### Xcode Command Line Tools (para Git)
```bash
xcode-select --install
```

### 3.3 Configuración de MySQL

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE cafedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Crear usuario de aplicación
CREATE USER 'cafeapp'@'localhost' IDENTIFIED BY 'cafe_secure_2024';
GRANT ALL PRIVILEGES ON cafedb.* TO 'cafeapp'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 4. Estructura del Proyecto {#estructura}

### 4.1 Estructura de Carpetas (Clean Architecture)

```
cafeteria/
├── .gitignore
├── .env.example
├── .env
├── .eslintrc.json
├── package.json
├── README.md
├── PLAN_DESARROLLO_CLEAN_CODE.md
│
├── cert/                           # Certificados SSL locales
│   ├── key.pem
│   └── cert.pem
│
├── src/
│   ├── app.js                      # Configuración Express
│   ├── server.js                   # Punto de entrada
│   │
│   ├── config/                     # Configuraciones
│   │   ├── database.config.js      # Pool MySQL
│   │   ├── jwt.config.js           # Configuración JWT
│   │   ├── security.config.js      # Configuración seguridad
│   │   └── constants.js            # Constantes de aplicación
│   │
│   ├── middlewares/                # Middlewares reutilizables
│   │   ├── auth.middleware.js      # Verificación JWT
│   │   ├── authorization.middleware.js  # Control de acceso por rol
│   │   ├── csrf.middleware.js      # Protección CSRF
│   │   ├── validation.middleware.js     # Validaciones generales
│   │   ├── rateLimit.middleware.js      # Rate limiting
│   │   ├── error.middleware.js     # Manejo de errores
│   │   └── logging.middleware.js   # Logging de requests
│   │
│   ├── modules/                    # Módulos por dominio
│   │   │
│   │   ├── auth/                   # Autenticación
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.validator.js
│   │   │   └── mfa.service.js
│   │   │
│   │   ├── users/                  # Usuarios
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.repository.js
│   │   │   ├── user.routes.js
│   │   │   └── user.validator.js
│   │   │
│   │   ├── ingredientes/           # Inventario de ingredientes
│   │   │   ├── ingrediente.controller.js
│   │   │   ├── ingrediente.service.js
│   │   │   ├── ingrediente.repository.js
│   │   │   ├── ingrediente.routes.js
│   │   │   └── ingrediente.validator.js
│   │   │
│   │   ├── menu/                   # Menú del café
│   │   │   ├── menu.controller.js
│   │   │   ├── menu.service.js
│   │   │   ├── menu.repository.js
│   │   │   ├── menu.routes.js
│   │   │   └── menu.validator.js
│   │   │
│   │   └── pedidos/                # Pedidos de clientes
│   │       ├── pedido.controller.js
│   │       ├── pedido.service.js
│   │       ├── pedido.repository.js
│   │       ├── pedido.routes.js
│   │       └── pedido.validator.js
│   │
│   ├── shared/                     # Código compartido
│   │   ├── errors/                 # Errores personalizados
│   │   │   ├── AppError.js
│   │   │   ├── ValidationError.js
│   │   │   ├── AuthenticationError.js
│   │   │   └── AuthorizationError.js
│   │   │
│   │   ├── utils/                  # Utilidades
│   │   │   ├── password.util.js    # Bcrypt helpers
│   │   │   ├── jwt.util.js         # JWT helpers
│   │   │   ├── csrf.util.js        # CSRF token helpers
│   │   │   ├── idempotency.util.js # Idempotency key
│   │   │   └── logger.util.js      # Winston logger
│   │   │
│   │   └── types/                  # Tipos y constantes
│   │       ├── roles.js            # Roles del sistema
│   │       └── enums.js            # Enumeraciones
│   │
│   └── database/                   # SQL scripts
│       ├── migrations/
│       │   ├── 001_create_roles_table.sql
│       │   ├── 002_create_users_table.sql
│       │   ├── 003_create_ingredientes_table.sql
│       │   ├── 004_create_menu_table.sql
│       │   ├── 005_create_menu_ingredientes_table.sql
│       │   ├── 006_create_pedidos_table.sql
│       │   └── 007_create_pedido_items_table.sql
│       │
│       └── seeds/
│           ├── 001_seed_roles.sql
│           └── 002_seed_admin_user.sql
│
├── tests/                          # Tests
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
└── docs/                           # Documentación
    ├── API.md
    ├── SECURITY.md
    └── ARCHITECTURE.md
```

### 4.2 Justificación de la Estructura

#### ✅ Ventajas
- **Modularidad**: Cada dominio es independiente
- **Testabilidad**: Fácil crear tests unitarios e integración
- **Escalabilidad**: Agregar nuevos módulos sin afectar existentes
- **Mantenibilidad**: Código organizado y fácil de encontrar
- **Separación de responsabilidades**: Cada capa tiene un propósito claro

---

## 5. Plan de Implementación {#plan-implementacion}

### Fase 1: Configuración Inicial ✅

#### 1.1 Inicializar Proyecto Node.js
```bash
cd cafeteria
npm init -y
```

#### 1.2 Instalar Dependencias
```bash
# Dependencias de producción
npm install express mysql2 dotenv bcrypt jsonwebtoken helmet cors cookie-parser uuid express-validator winston express-rate-limit

# Dependencias de desarrollo
npm install --save-dev nodemon eslint prettier eslint-config-prettier eslint-plugin-node
```

#### 1.3 Configurar ESLint y Prettier
```bash
npx eslint --init
```

#### 1.4 Generar Certificados SSL
```bash
mkdir -p cert
openssl req -x509 -newkey rsa:4096 -keyout cert/key.pem -out cert/cert.pem -days 365 -nodes -subj "/CN=localhost"
```

#### 1.5 Crear Archivos de Configuración

**.gitignore**
```
node_modules/
.env
cert/
*.log
.DS_Store
coverage/
```

**.env.example**
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=cafeapp
DB_PASS=cafe_secure_2024
DB_NAME=cafedb

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=2h

# CSRF
CSRF_SECRET=your_super_secret_csrf_key_change_in_production

# Server
NODE_ENV=development
PORT=3000
HTTPS_PORT=3443

# Logging
LOG_LEVEL=debug
```

#### 1.6 Configurar package.json scripts
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "audit": "npm audit --audit-level=moderate",
    "test": "echo \"Tests pending\" && exit 0"
  }
}
```

---

### Fase 2: Infraestructura Base

#### 2.1 Crear Configuraciones (`src/config/`)

**database.config.js**
```javascript
const mysql = require('mysql2/promise');
const logger = require('../shared/utils/logger.util');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    logger.info('Database connection established');
    connection.release();
  })
  .catch(err => {
    logger.error('Database connection failed', err);
  });

module.exports = pool;
```

**constants.js**
```javascript
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
    LOGIN: { windowMs: 60000, max: 5 }, // 5 intentos por minuto
    PEDIDOS: { windowMs: 900000, max: 10 } // 10 pedidos por 15 min
  }
};
```

#### 2.2 Crear Utilidades Compartidas (`src/shared/utils/`)

**logger.util.js**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cafeteria-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
```

**password.util.js**
```javascript
const bcrypt = require('bcrypt');
const { PASSWORD_MIN_LENGTH } = require('../../config/constants');

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param {string} plainPassword - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(plainPassword) {
  if (!plainPassword || plainPassword.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare plain password with hash
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets requirements
 */
function validatePasswordStrength(password) {
  if (!password || password.length < PASSWORD_MIN_LENGTH) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
```

#### 2.3 Crear Errores Personalizados (`src/shared/errors/`)

**AppError.js**
```javascript
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

**ValidationError.js**
```javascript
const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
```

---

### Fase 3: Base de Datos

#### 3.1 Crear Migraciones SQL (`src/database/migrations/`)

**001_create_roles_table.sql**
```sql
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**002_create_users_table.sql**
```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  mfa_enabled TINYINT(1) DEFAULT 0,
  mfa_secret VARCHAR(64) NULL,
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  INDEX idx_email (email),
  INDEX idx_role (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 3.2 Script de Migración

**src/database/migrate.js**
```javascript
const fs = require('fs').promises;
const path = require('path');
const pool = require('../config/database.config');
const logger = require('../shared/utils/logger.util');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = await fs.readdir(migrationsDir);
  const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

  for (const file of sqlFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, 'utf-8');
    
    try {
      await pool.query(sql);
      logger.info(`Migration executed: ${file}`);
    } catch (error) {
      logger.error(`Migration failed: ${file}`, error);
      throw error;
    }
  }
  
  logger.info('All migrations completed');
}

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = runMigrations;
```

---

### Fase 4: Módulo de Autenticación

#### 4.1 Implementar Repository Pattern

**auth.repository.js**
```javascript
const pool = require('../../../config/database.config');

class AuthRepository {
  /**
   * Find user by email with role information
   */
  async findUserByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.nombre as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? AND u.active = 1`,
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    const { nombre, email, passwordHash, roleId } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (nombre, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, roleId]
    );
    return result.insertId;
  }

  /**
   * Find role by name
   */
  async findRoleByName(roleName) {
    const [rows] = await pool.execute(
      'SELECT * FROM roles WHERE nombre = ?',
      [roleName]
    );
    return rows[0] || null;
  }
}

module.exports = new AuthRepository();
```

#### 4.2 Implementar Service Layer

**auth.service.js**
```javascript
const authRepository = require('./auth.repository');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../../shared/utils/password.util');
const { generateToken } = require('../../shared/utils/jwt.util');
const ValidationError = require('../../shared/errors/ValidationError');
const AuthenticationError = require('../../shared/errors/AuthenticationError');

class AuthService {
  /**
   * Register new user (Clean Code: Single Responsibility)
   */
  async register(userData) {
    const { nombre, email, password, roleName } = userData;
    
    // Validate password strength
    if (!validatePasswordStrength(password)) {
      throw new ValidationError('Password does not meet strength requirements');
    }

    // Check if user exists
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ValidationError('User already exists');
    }

    // Get role
    const role = await authRepository.findRoleByName(roleName);
    if (!role) {
      throw new ValidationError('Invalid role');
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const userId = await authRepository.createUser({
      nombre,
      email,
      passwordHash,
      roleId: role.id
    });

    return { userId, email, nombre, role: roleName };
  }

  /**
   * Authenticate user and generate JWT
   */
  async login(email, password) {
    // Find user
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      role: user.role_name
    });

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role_name
      }
    };
  }
}

module.exports = new AuthService();
```

---

### Fase 5: Middlewares de Seguridad

#### 5.1 Authentication Middleware

**auth.middleware.js**
```javascript
const { verifyToken } = require('../shared/utils/jwt.util');
const AuthenticationError = require('../shared/errors/AuthenticationError');

/**
 * Verify JWT token from cookie or Authorization header
 */
function authenticateJWT(req, res, next) {
  try {
    // Try to get token from cookie first, then from header
    const token = req.cookies?.auth || 
                  req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Authentication token required');
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
}

module.exports = { authenticateJWT };
```

#### 5.2 Authorization Middleware

**authorization.middleware.js**
```javascript
const AuthorizationError = require('../shared/errors/AuthorizationError');

/**
 * Check if user has required role
 * @param {...string} allowedRoles - Roles allowed to access
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
}

/**
 * Check if user owns the resource
 * @param {Function} getResourceOwnerId - Function to extract owner ID from request
 */
function authorizeOwnership(getResourceOwnerId) {
  return async (req, res, next) => {
    try {
      const ownerId = await getResourceOwnerId(req);
      
      if (req.user.id !== ownerId && req.user.role !== 'admin') {
        return next(new AuthorizationError('Access denied to this resource'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  authorizeRoles,
  authorizeOwnership
};
```

---

### Fase 6: Módulo de Pedidos (Con Transacciones)

#### 6.1 Repository con Transacciones

**pedido.repository.js**
```javascript
const pool = require('../../../config/database.config');

class PedidoRepository {
  /**
   * Create pedido with transaction support
   */
  async createPedido(connection, pedidoData) {
    const { userId, total, idempotencyKey } = pedidoData;
    const [result] = await connection.execute(
      'INSERT INTO pedidos (user_id, total, idempotency_key, estado) VALUES (?, ?, ?, ?)',
      [userId, total, idempotencyKey, 'pendiente']
    );
    return result.insertId;
  }

  /**
   * Check if pedido with idempotency key exists
   */
  async findByIdempotencyKey(connection, key) {
    const [rows] = await connection.execute(
      'SELECT id FROM pedidos WHERE idempotency_key = ? FOR UPDATE',
      [key]
    );
    return rows[0] || null;
  }

  /**
   * Add item to pedido
   */
  async addPedidoItem(connection, itemData) {
    const { pedidoId, menuId, cantidad, precioUnitario, subtotal } = itemData;
    await connection.execute(
      'INSERT INTO pedido_items (pedido_id, menu_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
      [pedidoId, menuId, cantidad, precioUnitario, subtotal]
    );
  }

  /**
   * Get menu item price
   */
  async getMenuPrice(connection, menuId) {
    const [rows] = await connection.execute(
      'SELECT precio FROM menu WHERE id = ?',
      [menuId]
    );
    return rows[0] || null;
  }

  /**
   * Get required ingredients for menu item with stock lock
   */
  async getRequiredIngredients(connection, menuId, cantidad) {
    const [rows] = await connection.execute(
      `SELECT i.id, i.stock, mi.cantidad_req * ? as req
       FROM menu_ingredientes mi
       JOIN ingredientes i ON i.id = mi.ingrediente_id
       WHERE mi.menu_id = ?
       FOR UPDATE`,
      [cantidad, menuId]
    );
    return rows;
  }

  /**
   * Decrease ingredient stock
   */
  async decreaseStock(connection, ingredienteId, cantidad) {
    await connection.execute(
      'UPDATE ingredientes SET stock = stock - ? WHERE id = ?',
      [cantidad, ingredienteId]
    );
  }
}

module.exports = new PedidoRepository();
```

#### 6.2 Service con Lógica Transaccional

**pedido.service.js**
```javascript
const pool = require('../../../config/database.config');
const pedidoRepository = require('./pedido.repository');
const ValidationError = require('../../shared/errors/ValidationError');
const logger = require('../../shared/utils/logger.util');

class PedidoService {
  /**
   * Create pedido with atomic transaction
   * Clean Code: Single Responsibility, Error Handling, Transaction Management
   */
  async createPedido(userId, items, idempotencyKey) {
    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items are required');
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Check idempotency
      const existing = await pedidoRepository.findByIdempotencyKey(connection, idempotencyKey);
      if (existing) {
        await connection.rollback();
        throw new ValidationError('Pedido already processed', { code: 'DUPLICATE_PEDIDO' });
      }

      // Calculate total and validate stock
      let total = 0;
      const validatedItems = [];

      for (const item of items) {
        // Get menu price
        const menuItem = await pedidoRepository.getMenuPrice(connection, item.menu_id);
        if (!menuItem) {
          throw new ValidationError(`Menu item ${item.menu_id} not found`);
        }

        // Check stock availability
        const ingredients = await pedidoRepository.getRequiredIngredients(
          connection, 
          item.menu_id, 
          item.cantidad
        );

        for (const ing of ingredients) {
          if (ing.stock < ing.req) {
            throw new ValidationError(`Insufficient stock for item ${item.menu_id}`);
          }
        }

        const subtotal = menuItem.precio * item.cantidad;
        total += subtotal;

        validatedItems.push({
          ...item,
          precio: menuItem.precio,
          subtotal,
          ingredients
        });
      }

      // Create pedido
      const pedidoId = await pedidoRepository.createPedido(connection, {
        userId,
        total,
        idempotencyKey
      });

      // Add items and decrease stock
      for (const item of validatedItems) {
        await pedidoRepository.addPedidoItem(connection, {
          pedidoId,
          menuId: item.menu_id,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.subtotal
        });

        // Decrease stock for each ingredient
        for (const ing of item.ingredients) {
          await pedidoRepository.decreaseStock(connection, ing.id, ing.req);
        }
      }

      await connection.commit();
      
      logger.info(`Pedido created: ${pedidoId}`, { userId, total });

      return {
        id: pedidoId,
        total,
        estado: 'pendiente'
      };

    } catch (error) {
      await connection.rollback();
      logger.error('Error creating pedido', { error: error.message, userId });
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new PedidoService();
```

---

## 6. Estándares de Código {#estandares}

### 6.1 Convenciones de Nombres

```javascript
// ✅ BIEN: Nombres descriptivos
async function getUserByEmail(email) { }
const MAX_LOGIN_ATTEMPTS = 5;
class UserRepository { }

// ❌ MAL: Nombres vagos o abreviados
async function get(e) { }
const mla = 5;
class UsrRep { }
```

### 6.2 Funciones Pequeñas

```javascript
// ✅ BIEN: Función con única responsabilidad
async function validateUserPassword(password) {
  if (!password || password.length < 8) {
    throw new ValidationError('Password too short');
  }
  
  if (!hasRequiredCharacters(password)) {
    throw new ValidationError('Password missing required characters');
  }
  
  return true;
}

// ❌ MAL: Función que hace demasiado
async function handleLogin(req, res) {
  // Valida
  // Busca usuario
  // Verifica contraseña
  // Crea token
  // Envía email
  // Registra log
  // ... (demasiadas responsabilidades)
}
```

### 6.3 Manejo de Errores

```javascript
// ✅ BIEN: Errores específicos y descriptivos
try {
  const user = await userService.create(userData);
  return user;
} catch (error) {
  if (error instanceof ValidationError) {
    logger.warn('User validation failed', { email: userData.email });
    throw error;
  }
  
  logger.error('Unexpected error creating user', { error });
  throw new AppError('Failed to create user');
}

// ❌ MAL: Silenciar errores o mensajes genéricos
try {
  await userService.create(userData);
} catch (error) {
  return null; // Silencia el error
}
```

### 6.4 Inyección de Dependencias

```javascript
// ✅ BIEN: Dependencias inyectadas
class PedidoController {
  constructor(pedidoService, logger) {
    this.pedidoService = pedidoService;
    this.logger = logger;
  }

  async create(req, res, next) {
    // Usa this.pedidoService
  }
}

// ❌ MAL: Dependencias hardcodeadas
class PedidoController {
  async create(req, res, next) {
    const pedidoService = new PedidoService(); // Hardcoded
  }
}
```

---

## 7. Checklist de Calidad {#checklist}

### ✅ Clean Code
- [ ] Nombres descriptivos en variables, funciones y clases
- [ ] Funciones con una sola responsabilidad (max 20 líneas)
- [ ] Código autoexplicativo con comentarios mínimos
- [ ] No hay código duplicado (DRY)
- [ ] Errores manejados correctamente
- [ ] Constantes extraídas (no magic numbers)

### ✅ Arquitectura
- [ ] Separación en capas (routes → controllers → services → repositories)
- [ ] Patrón Repository implementado
- [ ] Inyección de dependencias donde corresponda
- [ ] Módulos independientes por dominio
- [ ] Errores personalizados por tipo

### ✅ Seguridad OWASP
- [ ] **A01**: Control de acceso por roles (RBAC)
- [ ] **A02**: Contraseñas con bcrypt, HTTPS con TLS
- [ ] **A03**: Consultas preparadas (sin inyección SQL)
- [ ] **A05**: Helmet, CORS, env variables seguras
- [ ] **A07**: JWT en HttpOnly cookies, MFA opcional
- [ ] **A08**: npm audit ejecutado sin vulnerabilidades críticas

### ✅ Funcionalidad
- [ ] CRUD completo de ingredientes
- [ ] CRUD completo de menú
- [ ] Disponibilidad de menú según stock
- [ ] Creación de pedidos con transacciones
- [ ] Idempotencia en pedidos
- [ ] Descuento de stock atómico
- [ ] Rate limiting en endpoints críticos

### ✅ Testing
- [ ] Tests unitarios de servicios
- [ ] Tests de integración de repositorios
- [ ] Tests de endpoints (Postman/Jest)
- [ ] Cobertura mínima del 70%

### ✅ Documentación
- [ ] README con instrucciones claras
- [ ] Documentación de API
- [ ] Comentarios JSDoc en funciones públicas
- [ ] Diagrama de arquitectura

---

## 8. Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor en desarrollo
npm run dev

# Ejecutar linter
npm run lint

# Formatear código
npm run format

# Auditoría de seguridad
npm audit

# Ejecutar migraciones
node src/database/migrate.js
```

### Git
```bash
# Inicializar repositorio
git init

# Conectar con repositorio remoto
git remote add origin https://github.com/wilino/cafeteria.git

# Commit inicial
git add .
git commit -m "Initial commit: Clean architecture setup"

# Push a GitHub
git push -u origin main
```

### MySQL
```bash
# Conectar a base de datos
mysql -u cafeapp -p cafedb

# Ejecutar script SQL
mysql -u cafeapp -p cafedb < src/database/migrations/001_create_roles_table.sql
```

---

## 9. Próximos Pasos

1. ✅ Configurar entorno (Node.js, MySQL, OpenSSL)
2. ✅ Crear estructura de carpetas
3. ✅ Implementar configuraciones base
4. ⬜ Crear migraciones de base de datos
5. ⬜ Implementar módulo de autenticación
6. ⬜ Implementar módulo de ingredientes
7. ⬜ Implementar módulo de menú
8. ⬜ Implementar módulo de pedidos
9. ⬜ Agregar tests
10. ⬜ Documentar API
11. ⬜ Deploy y testing final

---

## Referencias

- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 20. Frontend - React con Medidas de Seguridad {#frontend-react-seguridad}

### 20.1 Stack Tecnológico Frontend

**Framework Principal:** React 18+ con Vite

```bash
npm create vite@latest cafeteria-frontend -- --template react
cd cafeteria-frontend
npm install
```

**Dependencias de Seguridad:**
```bash
npm install axios              # Cliente HTTP con interceptores
npm install js-cookie          # Manejo seguro de cookies
npm install dompurify          # Sanitización XSS
npm install uuid               # Generación de Idempotency-Keys
npm install react-router-dom   # Enrutamiento
```

### 20.2 Medidas de Seguridad por OWASP Top 10

#### **A01: Control de Acceso (Broken Access Control)**

**Implementación de Rutas Protegidas:**

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return <div className="loading">Verificando acceso...</div>;
  }

  // Redirigir a login si no está autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

**Uso en Rutas:**
```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas de cliente */}
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <MenuPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de empleado */}
        <Route 
          path="/pedidos" 
          element={
            <ProtectedRoute allowedRoles={['empleado', 'admin']}>
              <PedidosPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de admin */}
        <Route 
          path="/admin/usuarios" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsuariosPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

**Contexto de Autenticación:**
```javascript
// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión al cargar
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### **A02: Fallas Criptográficas (Cryptographic Failures)**

**Cookies Seguras con JWT HttpOnly:**

```javascript
// src/services/api.service.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3443';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // ✅ CRÍTICO: Permite enviar cookies HttpOnly
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
```

**IMPORTANTE - Configuración de Cookies en Backend:**
```javascript
// Backend: src/shared/utils/jwt.util.js
res.cookie('auth', token, {
  httpOnly: true,    // ✅ JavaScript no puede acceder (previene XSS)
  secure: true,      // ✅ Solo HTTPS
  sameSite: 'strict', // ✅ Protección CSRF adicional
  maxAge: 7200000    // 2 horas
});
```

**❌ NUNCA hacer esto:**
```javascript
// ❌ MAL: Almacenar JWT en localStorage
localStorage.setItem('token', token); // Vulnerable a XSS

// ❌ MAL: Enviar JWT en headers manualmente
headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
```

#### **A03: Inyección (Injection)**

**Sanitización de Entrada con DOMPurify:**

```javascript
// src/utils/sanitizer.js
import DOMPurify from 'dompurify';

export const sanitize = {
  // Sanitizar HTML (eliminar scripts, eventos, etc.)
  html: (dirty) => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  },

  // Sanitizar texto plano (eliminar todas las etiquetas)
  text: (input) => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  },

  // Escape manual para contextos específicos
  escapeHtml: (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
```

**Uso en Componentes:**
```javascript
// src/components/PedidoCard.jsx
import { sanitize } from '../utils/sanitizer';

function PedidoCard({ pedido }) {
  // ✅ Sanitizar antes de renderizar
  const notasSanitized = sanitize.text(pedido.notas);

  return (
    <div className="pedido-card">
      <p>Estado: {pedido.estado}</p>
      <p>Notas: {notasSanitized}</p>
    </div>
  );
}
```

**Validación de Formularios:**
```javascript
// src/utils/validators.js
export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  password: (password) => {
    // Mínimo 8 caracteres, una mayúscula, una minúscula, un número
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  },

  cantidad: (cantidad) => {
    const num = parseInt(cantidad, 10);
    return Number.isInteger(num) && num > 0 && num <= 100;
  },

  menuId: (id) => {
    const num = parseInt(id, 10);
    return Number.isInteger(num) && num > 0;
  }
};

// Uso en formularios
function validatePedidoForm(items) {
  const errors = [];
  
  if (!Array.isArray(items) || items.length === 0) {
    errors.push('Debe seleccionar al menos un item');
  }
  
  items.forEach((item, index) => {
    if (!validators.menuId(item.menu_id)) {
      errors.push(`Item ${index + 1}: ID de menú inválido`);
    }
    if (!validators.cantidad(item.cantidad)) {
      errors.push(`Item ${index + 1}: Cantidad inválida (1-100)`);
    }
  });
  
  return errors;
}
```

#### **A05: Configuración de Seguridad Incorrecta (Security Misconfiguration)**

**Variables de Entorno:**
```bash
# .env.example (subir a git)
VITE_API_URL=https://localhost:3443
VITE_APP_NAME="Sistema Cafetería"
VITE_ENV=development

# .env.local (NO subir a git)
VITE_API_URL=https://localhost:3443
VITE_APP_NAME="Sistema Cafetería"
VITE_ENV=development
```

**Configuración de Vite con Headers de Seguridad:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    https: true, // ✅ HTTPS en desarrollo
    port: 5173,
    headers: {
      // Content Security Policy
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'", // Vite necesita inline en dev
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://localhost:3443",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
      
      // Otros headers de seguridad
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  build: {
    sourcemap: false, // ✅ No exponer source maps en producción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // ✅ Eliminar console.log en producción
        drop_debugger: true
      }
    }
  }
});
```

**Manejo de Errores sin Exponer Información:**
```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  // ✅ No exponer detalles internos al usuario
  if (error.response) {
    // Error del servidor
    const status = error.response.status;
    const message = error.response.data?.error || 'Error en el servidor';
    
    switch (status) {
      case 400:
        return 'Solicitud inválida. Verifica los datos enviados.';
      case 401:
        return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'No tienes permiso para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no existe.';
      case 409:
        return 'Esta operación ya fue procesada.';
      case 429:
        return 'Demasiadas solicitudes. Intenta más tarde.';
      case 500:
        return 'Error en el servidor. Intenta más tarde.';
      default:
        return message;
    }
  } else if (error.request) {
    // Error de red
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  } else {
    // Error de configuración
    console.error('Error:', error.message);
    return 'Ocurrió un error inesperado.';
  }
};
```

#### **A07: Identificación y Autenticación (Identification and Authentication Failures)**

**Servicio de Autenticación con Rate Limiting Visual:**
```javascript
// src/services/auth.service.js
import apiClient from './api.service';
import Cookies from 'js-cookie';

export const authService = {
  loginAttempts: 0,
  maxAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutos
  lockoutUntil: null,

  async login(email, password) {
    // ✅ Rate limiting client-side (complementa el del backend)
    if (this.isLockedOut()) {
      const remainingTime = Math.ceil((this.lockoutUntil - Date.now()) / 60000);
      throw new Error(`Demasiados intentos fallidos. Intenta en ${remainingTime} minutos.`);
    }

    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password
      });

      // ✅ Reset intentos en login exitoso
      this.loginAttempts = 0;
      this.lockoutUntil = null;

      // El JWT se guarda automáticamente en cookie HttpOnly
      // El CSRF token se guarda en cookie no-HttpOnly
      return response.data;
    } catch (error) {
      // ✅ Incrementar intentos fallidos
      this.loginAttempts++;
      
      if (this.loginAttempts >= this.maxAttempts) {
        this.lockoutUntil = Date.now() + this.lockoutTime;
      }

      throw error;
    }
  },

  isLockedOut() {
    if (this.lockoutUntil && Date.now() < this.lockoutUntil) {
      return true;
    }
    if (this.lockoutUntil && Date.now() >= this.lockoutUntil) {
      // Reset después del lockout
      this.loginAttempts = 0;
      this.lockoutUntil = null;
    }
    return false;
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
      // ✅ Limpiar cookies localmente
      Cookies.remove('csrf');
      Cookies.remove('auth'); // Por si acaso (debería ser HttpOnly)
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  }
};
```

**Componente de Login con Validación:**
```javascript
// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validators } from '../utils/validators';
import { sanitize } from '../utils/sanitizer';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!validators.email(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (password.length < 8) {
      newErrors.password = 'Contraseña debe tener al menos 8 caracteres';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validar antes de enviar
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // ✅ Sanitizar entrada
      const sanitizedEmail = sanitize.text(email);
      
      await login(sanitizedEmail, password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ 
        general: error.message || 'Error de autenticación' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      
      {errors.general && <div className="error">{errors.general}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

#### **A08: Integridad del Software y Datos (Software and Data Integrity Failures)**

**Scripts de NPM Audit:**
```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx",
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix",
    "check-updates": "npm outdated"
  }
}
```

**Pre-commit Hook (opcional):**
```bash
# .husky/pre-commit
#!/bin/sh
npm audit --audit-level=high
npm run lint
```

### 20.3 Protección CSRF (Cross-Site Request Forgery)

**Interceptor de Axios para CSRF:**

```javascript
// src/services/api.service.js
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:3443',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Interceptor de Request: Agregar CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Para operaciones que modifican estado, agregar CSRF
    const methodsRequiringCsrf = ['post', 'put', 'patch', 'delete'];
    
    if (methodsRequiringCsrf.includes(config.method.toLowerCase())) {
      const csrfToken = Cookies.get('csrf');
      
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      } else {
        console.warn('CSRF token no encontrado');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Interceptor de Response: Manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      Cookies.remove('csrf');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Posible ataque CSRF o falta de permisos
      console.error('Acceso denegado');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 20.4 Idempotencia en Creación de Pedidos

**Servicio de Pedidos con Idempotency-Key:**

```javascript
// src/services/pedidos.service.js
import apiClient from './api.service';
import { v4 as uuidv4 } from 'uuid';

export const pedidosService = {
  async createPedido(items, notas = '') {
    try {
      // ✅ Generar Idempotency-Key única
      const idempotencyKey = uuidv4();
      
      const response = await apiClient.post(
        '/api/cliente/pedidos',
        { items, notas },
        {
          headers: {
            'Idempotency-Key': idempotencyKey
          }
        }
      );
      
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 409) {
        // ✅ Pedido duplicado
        return { 
          success: false, 
          error: 'Este pedido ya fue procesado anteriormente' 
        };
      }
      
      throw error;
    }
  },

  async getMyPedidos() {
    const response = await apiClient.get('/api/cliente/pedidos');
    return response.data;
  },

  async getPedidoById(id) {
    const response = await apiClient.get(`/api/cliente/pedidos/${id}`);
    return response.data;
  }
};
```

**Componente de Crear Pedido:**
```javascript
// src/components/PedidoForm.jsx
import { useState } from 'react';
import { pedidosService } from '../services/pedidos.service';
import { validators } from '../utils/validators';

function PedidoForm({ menuItems }) {
  const [items, setItems] = useState([]);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddItem = (menuId, cantidad) => {
    // ✅ Validar antes de agregar
    if (!validators.menuId(menuId)) {
      setError('ID de menú inválido');
      return;
    }
    
    if (!validators.cantidad(cantidad)) {
      setError('Cantidad inválida (1-100)');
      return;
    }

    const existingItem = items.find(item => item.menu_id === menuId);
    
    if (existingItem) {
      // Actualizar cantidad
      setItems(items.map(item => 
        item.menu_id === menuId 
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      // Agregar nuevo
      setItems([...items, { menu_id: menuId, cantidad }]);
    }
    
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      setError('Debe seleccionar al menos un item');
      return;
    }

    // ✅ Deshabilitar botón durante procesamiento
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await pedidosService.createPedido(items, notas);
      
      if (result.success) {
        setSuccess(true);
        setItems([]);
        setNotas('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al crear el pedido. Intenta nuevamente.');
    } finally {
      // ✅ Re-habilitar botón después de 2 segundos
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Lista de items del menú */}
      {menuItems.map(item => (
        <div key={item.id}>
          <span>{item.nombre} - ${item.precio}</span>
          <button
            type="button"
            onClick={() => handleAddItem(item.id, 1)}
            disabled={loading || !item.disponible}
          >
            Agregar
          </button>
        </div>
      ))}
      
      {/* Items seleccionados */}
      {items.length > 0 && (
        <div>
          <h3>Tu pedido:</h3>
          {items.map((item, index) => (
            <div key={index}>
              Item {item.menu_id} - Cantidad: {item.cantidad}
            </div>
          ))}
        </div>
      )}
      
      {/* Notas */}
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Notas adicionales (opcional)"
        maxLength={500}
        disabled={loading}
      />
      
      {/* Mensajes */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">¡Pedido creado exitosamente!</div>}
      
      {/* Submit */}
      <button type="submit" disabled={loading || items.length === 0}>
        {loading ? 'Procesando...' : 'Crear Pedido'}
      </button>
    </form>
  );
}

export default PedidoForm;
```

### 20.5 Checklist de Seguridad Frontend

**Control de Acceso:**
- [ ] Rutas protegidas con `ProtectedRoute`
- [ ] Verificación de roles en componentes
- [ ] Redirección automática a login si no autenticado
- [ ] Contexto de autenticación global

**Criptografía:**
- [ ] HTTPS obligatorio (`https://`)
- [ ] JWT en cookies con `HttpOnly`, `Secure`, `SameSite=Strict`
- [ ] No almacenar tokens en `localStorage` ni `sessionStorage`
- [ ] `withCredentials: true` en Axios

**Inyección:**
- [ ] Sanitización con `DOMPurify` antes de renderizar
- [ ] Validación de formularios con `validators.js`
- [ ] Escape de caracteres especiales
- [ ] Validación de tipos (números, emails, etc.)

**Configuración:**
- [ ] Variables de entorno en `.env.local` (no subir a git)
- [ ] CSP headers configurados en `vite.config.js`
- [ ] Source maps deshabilitados en producción
- [ ] `console.log` eliminados en build de producción
- [ ] Headers de seguridad (X-Content-Type-Options, X-Frame-Options, etc.)

**Autenticación:**
- [ ] Rate limiting visual (bloqueo después de 5 intentos)
- [ ] Validación de contraseñas robustas (≥8 chars, mayús, minus, número)
- [ ] Logout seguro con limpieza de cookies
- [ ] Refresh de token antes de expiración (opcional)

**CSRF:**
- [ ] Token CSRF en header `X-CSRF-Token` para POST/PUT/PATCH/DELETE
- [ ] Interceptor de Axios configurado
- [ ] Cookie `csrf` accesible por JavaScript
- [ ] Validación en backend de cookie + header

**Idempotencia:**
- [ ] Generación de `Idempotency-Key` con UUID v4
- [ ] Manejo de respuesta 409 (pedido duplicado)
- [ ] Botones deshabilitados durante procesamiento
- [ ] Mensajes claros de éxito/error

**Dependencias:**
- [ ] `npm audit` ejecutado regularmente
- [ ] `package-lock.json` en control de versiones
- [ ] Actualizaciones de dependencias críticas
- [ ] Sin vulnerabilidades high/critical

### 20.6 Estructura de Archivos Frontend

```
cafeteria-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── menu/
│   │   │   ├── MenuCard.jsx
│   │   │   └── MenuList.jsx
│   │   ├── pedidos/
│   │   │   ├── PedidoCard.jsx
│   │   │   ├── PedidoList.jsx
│   │   │   └── PedidoForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Menu.jsx
│   │   ├── Pedidos.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Inventario.jsx
│   │   └── Usuarios.jsx
│   ├── services/
│   │   ├── api.service.js      # Cliente Axios con interceptores
│   │   ├── auth.service.js
│   │   ├── menu.service.js
│   │   ├── pedidos.service.js
│   │   └── usuarios.service.js
│   ├── config/
│   │   ├── api.config.js
│   │   └── constants.js
│   ├── utils/
│   │   ├── validators.js       # Validación de entrada
│   │   ├── sanitizer.js        # Sanitización con DOMPurify
│   │   ├── errorHandler.js     # Manejo de errores
│   │   └── formatters.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useMenu.js
│   │   └── usePedidos.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env.example
├── .env.local              # NO subir a git
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

### 20.7 Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Auditoría de seguridad
npm audit
npm audit fix

# Lint
npm run lint

# Verificar actualizaciones
npm outdated
```

---

**Última actualización:** 9 de noviembre de 2025  
**Autor:** Equipo de Desarrollo Cafetería  
**Versión:** 2.0 - Con Frontend React y Seguridad OWASP
