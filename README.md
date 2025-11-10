# ☕ Sistema de Gestión de Cafetería

Sistema completo de gestión de cafetería con arquitectura cliente-servidor, enfocado en seguridad y mejores prácticas de desarrollo.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Documentación

### 🚀 Para Empezar
- **[Guía de Inicio Rápido](./docs/GUIA_INICIO_RAPIDO.md)** - Instalación en 5 minutos
- **[Manual de Usuario](./docs/MANUAL_USUARIO.md)** - Guía completa de uso

### 👥 Guías por Rol
- **[Guía para Clientes](./docs/GUIA_CLIENTES.md)** - Cómo realizar pedidos
- **[Guía para Empleados](./docs/GUIA_EMPLEADOS.md)** - Gestión operativa
- **[Guía para Administradores](./docs/GUIA_ADMINISTRADORES.md)** - Administración completa

### 🔒 Seguridad
- **[Configuración MFA](./docs/CONFIGURACION_MFA.md)** - Autenticación de dos factores

### 🆘 Soporte
- **[Solución de Problemas](./docs/SOLUCION_PROBLEMAS.md)** - Troubleshooting
- **[Preguntas Frecuentes](./docs/FAQ.md)** - FAQ
- **[Contacto y Soporte](./docs/SOPORTE.md)** - Cómo obtener ayuda

📚 **[Ver toda la documentación](./docs/README.md)**

---

## ✨ Características

### 🔐 Seguridad (OWASP Top 10 Compliant)
- ✅ **Autenticación JWT** con cookies HttpOnly
- ✅ **MFA/TOTP** con QR codes y códigos de respaldo
- ✅ **20 Permisos Granulares** (PBAC) - Sin rol con acceso total
- ✅ **Audit Logging** en 29+ endpoints
- ✅ **Protección CSRF** con tokens
- ✅ **Rate Limiting** anti-fuerza bruta
- ✅ **Idempotencia** para prevenir pedidos duplicados
- ✅ **HTTPS/TLS** con certificados SSL
- ✅ **Contraseñas hasheadas** con bcrypt
- ✅ **Consultas preparadas** anti-SQL injection

### 🍽️ Gestión de Cafetería
- ✅ **Menú dinámico** con disponibilidad en tiempo real
- ✅ **Sistema de pedidos** con estados rastreables
- ✅ **Carrito de compras** con gestión de cantidades
- ✅ **Gestión de inventario** con alertas de stock bajo
- ✅ **Panel de control** con estadísticas por rol

### 👥 Gestión de Usuarios
- ✅ **3 Roles:** Cliente, Empleado, Administrador
- ✅ **Permisos granulares** por acción
- ✅ **Perfil de usuario** editable
- ✅ **Cambio de contraseña** con validación
- ✅ **Gestión de usuarios** (solo admin)

### 💻 Experiencia de Usuario
- ✅ **Interfaz moderna** con Material UI
- ✅ **Responsive** - Funciona en móvil, tablet y desktop
- ✅ **Modales de confirmación** para acciones críticas
- ✅ **Feedback visual** con notificaciones
- ✅ **Estilos centralizados** para consistencia
- ✅ **Validación en tiempo real**

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────┐
│     FRONTEND (Puerto 5173)          │
│   React 18 + Vite + Material UI     │
│                                     │
│  • Componentes React                │
│  • Context API (Auth)               │
│  • Axios Interceptors               │
│  • Protected Routes                 │
│  • Centralized Styles               │
└─────────────┬───────────────────────┘
              │ HTTP/HTTPS REST API
              │ JWT + CSRF Tokens
┌─────────────▼───────────────────────┐
│     BACKEND (Puertos 3000/3443)     │
│   Node.js 20 + Express + MySQL      │
│                                     │
│  • Clean Architecture               │
│  • Repository Pattern               │
│  • Service Layer                    │
│  • Permission Middleware            │
│  • MFA Module                       │
│  • Idempotency Middleware           │
└─────────────┬───────────────────────┘
              │ mysql2 (Prepared Statements)
┌─────────────▼───────────────────────┐
│      BASE DE DATOS (MySQL 8.0)      │
│                                     │
│  • 11 Tablas                        │
│  • Migrations                       │
│  • Seeds                            │
│  • Audit Log                        │
└─────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
cafeteria/
├── README.md                      # Este archivo
├── docs/                          # 📚 Documentación para usuarios
│   ├── README.md                  # Índice de documentación
│   ├── GUIA_INICIO_RAPIDO.md
│   ├── MANUAL_USUARIO.md
│   ├── GUIA_CLIENTES.md
│   ├── GUIA_EMPLEADOS.md
│   ├── GUIA_ADMINISTRADORES.md
│   ├── CONFIGURACION_MFA.md
│   ├── SOLUCION_PROBLEMAS.md
│   ├── FAQ.md
│   └── SOPORTE.md
│
├── cafeteria-backend/             # 🔧 API REST
│   ├── src/
│   │   ├── config/               # Configuración
│   │   ├── middlewares/          # Middlewares Express
│   │   ├── modules/              # Módulos por dominio
│   │   │   ├── auth/            # Autenticación JWT
│   │   │   ├── users/           # Usuarios CRUD
│   │   │   ├── mfa/             # MFA/TOTP
│   │   │   ├── menu/            # Menú CRUD
│   │   │   ├── ingredientes/    # Inventario
│   │   │   └── pedidos/         # Pedidos
│   │   ├── database/            # Migrations & Seeds
│   │   └── server.js
│   ├── .env                      # Variables de entorno
│   ├── package.json
│   └── README.md
│
└── cafeteria-frontend/            # 🎨 Aplicación Web
    ├── src/
    │   ├── components/           # Componentes React
    │   │   ├── ProtectedRoute.jsx
    │   │   └── MainLayout.jsx
    │   ├── pages/                # Páginas
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── MenuPage.jsx
    │   │   ├── PedidosPage.jsx
    │   │   ├── InventarioPage.jsx
    │   │   ├── UsuariosPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── MFASetupPage.jsx
    │   ├── context/              # Context API
    │   │   └── AuthContext.jsx
    │   ├── services/             # API Client
    │   │   └── api.service.js
    │   ├── styles/               # Estilos centralizados
    │   │   └── commonStyles.js
    │   └── App.jsx
    ├── .env                      # Variables de entorno
    ├── package.json
    └── README.md
```

---

## 🚀 Inicio Rápido

### 1. Requisitos Previos

- **Node.js** 20.0 o superior
- **MySQL** 8.0 o superior
- **Git**

### 2. Clonar el Repositorio

```bash
git clone https://github.com/wilino/cafeteria.git
cd cafeteria
```

### 3. Configurar Base de Datos

```bash
mysql -u root -p
```

```sql
CREATE DATABASE cafedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cafeapp'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON cafedb.* TO 'cafeapp'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Configurar Backend

```bash
cd cafeteria-backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run migrate
npm run dev
```

✅ Backend corriendo en `http://localhost:3000` y `https://localhost:3443`

### 5. Configurar Frontend

```bash
cd ../cafeteria-frontend
npm install
# Editar .env si es necesario
npm run dev
```

✅ Frontend corriendo en `http://localhost:5173`

### 6. Acceder al Sistema

**URL:** `http://localhost:5173`

**Usuarios de prueba:**

| Rol | Email | Contraseña |
|-----|-------|-----------|
| **Admin** | admin@cafe.com | admin123 |
| **Empleado** | empleado@cafe.com | empleado123 |
| **Cliente** | cliente@cafe.com | cliente123 |

📖 **Guía completa:** [GUIA_INICIO_RAPIDO.md](./docs/GUIA_INICIO_RAPIDO.md)

---

## 🔧 Stack Tecnológico

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express 4.21+
- **Base de Datos:** MySQL 8.0+ (mysql2)
- **Autenticación:** JSON Web Tokens (jsonwebtoken)
- **MFA:** speakeasy, qrcode
- **Seguridad:** helmet, cors, express-rate-limit
- **Logging:** winston
- **Validación:** express-validator
- **Otros:** bcryptjs, cookie-parser, dotenv, uuid

### Frontend
- **Framework:** React 18.3+
- **Build Tool:** Vite 7.2+
- **UI Library:** Material UI 5+
- **Router:** react-router-dom 7+
- **HTTP Client:** axios 1.7+
- **State:** Context API
- **Styling:** Material UI sx prop + Emotion

### Base de Datos
- **MySQL** 8.0.44
- **11 Tablas:** users, roles, user_sessions, ingredientes, menu, pedidos, pedido_items, permissions, role_permissions, audit_log, idempotency_keys
- **Migraciones** con SQL scripts

---

## 📊 Sistema de Permisos

### Roles y Permisos

| Permiso | Admin | Empleado | Cliente |
|---------|-------|----------|---------|
| **Usuarios** ||||
| view_users | ✅ | ❌ | ❌ |
| create_users | ✅ | ❌ | ❌ |
| edit_users | ✅ | ❌ | ❌ |
| delete_users | ✅ | ❌ | ❌ |
| **Menú** ||||
| view_menu | ✅ | ✅ | ✅ |
| create_menu_items | ✅ | ✅ | ❌ |
| edit_menu_items | ✅ | ✅ | ❌ |
| delete_menu_items | ✅ | ✅ | ❌ |
| **Ingredientes** ||||
| view_ingredientes | ✅ | ✅ | ❌ |
| create_ingredientes | ✅ | ✅ | ❌ |
| edit_ingredientes | ✅ | ✅ | ❌ |
| delete_ingredientes | ✅ | ❌ | ❌ |
| update_stock | ✅ | ✅ | ❌ |
| **Pedidos** ||||
| view_pedidos | ✅ | ✅ | ✅* |
| create_pedidos | ✅ | ✅ | ✅ |
| edit_pedidos | ✅ | ✅ | ❌ |
| delete_pedidos | ✅ | ✅ | ❌ |
| view_all_pedidos | ✅ | ✅ | ❌ |
| cancel_pedidos | ✅ | ✅ | ❌ |
| **Otros** ||||
| view_stats | ✅ | ✅ | ❌ |

*Clientes solo ven sus propios pedidos

---

## 🔐 Seguridad Implementada

### OWASP Top 10 2021 Compliance

| Vulnerabilidad | Mitigación Implementada |
|----------------|------------------------|
| **A01: Broken Access Control** | ✅ PBAC con 20 permisos granulares, sin rol con acceso total |
| **A02: Cryptographic Failures** | ✅ bcrypt para passwords, HTTPS/TLS, JWT secret fuerte |
| **A03: Injection** | ✅ Consultas preparadas (mysql2), validación de entrada |
| **A04: Insecure Design** | ✅ Clean Architecture, principios SOLID |
| **A05: Security Misconfiguration** | ✅ Helmet, CORS configurado, variables .env |
| **A06: Vulnerable Components** | ✅ npm audit regular, dependencias actualizadas |
| **A07: Authentication Failures** | ✅ JWT + MFA/TOTP opcional, rate limiting |
| **A08: Software Integrity Failures** | ✅ package-lock.json, verificación de dependencias |
| **A09: Logging & Monitoring** | ✅ Winston logs, audit_log table |
| **A10: Server-Side Request Forgery** | ✅ Validación de URLs, whitelist de dominios |

### Características Adicionales
- **CSRF Protection** con tokens
- **Idempotency Keys** para prevenir duplicados
- **Password Strength** validado en frontend
- **MFA Backup Codes** (10 por usuario)
- **Session Management** con expiración JWT
- **HTTP Security Headers** con Helmet

---

## 📝 Scripts Disponibles

### Backend

```bash
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm run migrate      # Ejecutar migraciones
npm run seed         # Sembrar datos iniciales
npm run lint         # ESLint
npm run format       # Prettier
npm run audit        # Auditoría de seguridad
```

### Frontend

```bash
npm run dev          # Desarrollo con Vite
npm run build        # Build para producción
npm run preview      # Preview de build
npm run lint         # ESLint
```

---

## 🧪 Testing

```bash
# Backend
cd cafeteria-backend
npm test

# Frontend
cd cafeteria-frontend
npm test
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Lineamientos de Código
- Sigue los principios de Clean Code
- Usa ESLint y Prettier
- Escribe tests para nuevas features
- Documenta funciones complejas
- Mantén commits atómicos y descriptivos

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📧 Contacto y Soporte

- **Repositorio:** https://github.com/wilino/cafeteria
- **Issues:** https://github.com/wilino/cafeteria/issues
- **Email:** soporte@cafe.com

---

## 🙏 Agradecimientos

- Clean Code - Robert C. Martin
- OWASP Foundation
- Node.js Best Practices Guide
- Material UI Team
- Express.js Community

---

## 📈 Roadmap

### Próximas Funciones
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Sistema de pagos en línea
- [ ] App móvil nativa (React Native)
- [ ] Dashboard de analytics
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Multi-idioma (i18n)
- [ ] Tema oscuro
- [ ] Historial de cambios de inventario
- [ ] Programación de pedidos
- [ ] Sistema de calificaciones

---

**🎉 ¡Gracias por usar el Sistema de Gestión de Cafetería!**

**Fecha de actualización:** 9 de noviembre de 2025  
**Versión:** 2.0.0  
**Estado:** ✅ Producción  
**Mantenedor:** [@wilino](https://github.com/wilino)
