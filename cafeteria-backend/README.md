# 🔙 Sistema de Cafetería - Backend API

API RESTful para el sistema de cafetería, desarrollada con Node.js, Express y MySQL, aplicando Clean Code y principios SOLID.

## 📚 Documentación Completa

- **[INDICE_DOCUMENTACION.md](./docs/INDICE_DOCUMENTACION.md)** - Índice completo
- **[GUIA_INICIO_RAPIDO.md](./docs/GUIA_INICIO_RAPIDO.md)** - Setup paso a paso ⭐
- **[PLAN_DESARROLLO_CLEAN_CODE.md](./docs/PLAN_DESARROLLO_CLEAN_CODE.md)** - Arquitectura

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env
nano .env  # Editar con tus credenciales

# Generar certificados SSL
mkdir -p cert
openssl req -x509 -newkey rsa:4096 -keyout cert/key.pem -out cert/cert.pem -days 365 -nodes -subj "/CN=localhost"

# Crear base de datos y ejecutar migraciones
npm run migrate

# Iniciar en desarrollo
npm run dev
```

API disponible en: `https://localhost:3443`

## 📋 Requisitos

- Node.js >= 20.0.0
- MySQL >= 8.0
- npm >= 10.0.0

## 🔧 Stack Tecnológico

- **Runtime**: Node.js 20+
- **Framework**: Express 4+
- **Base de datos**: MySQL 8+
- **Autenticación**: JWT (HttpOnly cookies)
- **Seguridad**: Helmet, CORS, Rate Limiting, CSRF
- **Logging**: Winston
- **Validación**: express-validator

## 🏗️ Arquitectura

```
src/
├── config/              # Configuraciones
│   ├── database.config.js
│   └── constants.js
├── shared/              # Código compartido
│   ├── errors/         # Errores personalizados
│   ├── utils/          # Utilidades (jwt, password, csrf, etc.)
│   └── types/          # Tipos y enums
├── middlewares/        # Middlewares Express
│   ├── auth.middleware.js
│   ├── authorization.middleware.js
│   └── error.middleware.js
├── modules/            # Módulos por dominio (Clean Architecture)
│   ├── auth/          # Autenticación
│   ├── users/         # Gestión de usuarios
│   ├── ingredientes/  # Inventario
│   ├── menu/          # Menú
│   └── pedidos/       # Pedidos
└── database/          # Migraciones y seeds
    ├── migrations/
    └── seeds/
```

## 🔒 Seguridad (OWASP Top 10)

- ✅ **A01**: Control de acceso (RBAC)
- ✅ **A02**: Criptografía (bcrypt, HTTPS/TLS)
- ✅ **A03**: Prevención de inyección (prepared statements)
- ✅ **A05**: Configuración segura (helmet, CORS, env)
- ✅ **A07**: Autenticación (JWT + MFA opcional)
- ✅ **A08**: Integridad de dependencias (npm audit)

## 📝 Scripts

```bash
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm run migrate      # Ejecutar migraciones
npm run lint         # Linter
npm run audit        # Auditoría de seguridad
```

## 🗄️ Base de Datos

### Tablas
- `roles` - Roles del sistema
- `users` - Usuarios
- `ingredientes` - Inventario
- `menu` - Productos del menú
- `menu_ingredientes` - Relación menú-ingredientes
- `pedidos` - Pedidos de clientes
- `pedido_items` - Items de pedidos

Ver [src/database/migrations/](./src/database/migrations/) para el esquema completo.

## 👥 Roles

- **admin**: Acceso completo
- **empleado**: Gestión de inventario y pedidos
- **cliente**: Ver menú y crear pedidos

## 📄 Variables de Entorno

Ver [.env.example](./.env.example) para la configuración completa.

## 📧 Contacto

Repositorio: https://github.com/wilino/cafeteria

---

**Fecha:** 9 de noviembre de 2025  
**Versión:** 1.0.0  
**Licencia:** MIT
