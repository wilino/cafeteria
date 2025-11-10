# 🏗️ Sistema de Cafetería - Monorepo

Sistema completo de gestión de cafetería con **arquitectura separada frontend-backend**.

## 📁 Estructura del Proyecto

```
cafeteria/
├── README.md                    # Este archivo
├── docs/                        # 📚 Documentación compartida (frontend + backend)
│   ├── GUIA_INICIO_RAPIDO.md
│   ├── PLAN_DESARROLLO_CLEAN_CODE.md
│   ├── INSTALACION_SOFTWARE.md
│   ├── CONECTAR_GITHUB.md
│   └── ...
├── cafeteria-backend/          # API REST Node.js + Express + MySQL
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── cafeteria-frontend/         # Aplicación web
    ├── src/
    ├── public/
    ├── package.json
    └── README.md
```

> **📚 Documentación Compartida**: [docs/](./docs/)  
> **🚀 Guía de Inicio**: [GUIA_INICIO_RAPIDO.md](./docs/GUIA_INICIO_RAPIDO.md)

## 🚀 Características

- ✅ **Arquitectura separada**: Frontend y Backend independientes
- ✅ Autenticación JWT con cookies HttpOnly
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Gestión de inventario de ingredientes
- ✅ Menú dinámico con disponibilidad en tiempo real
- ✅ Sistema de pedidos con transacciones atómicas
- ✅ Protección CSRF
- ✅ Rate limiting
- ✅ Logging estructurado
- ✅ Validación de entrada
- ✅ Consultas preparadas (prevención de inyección SQL)

## 🚀 Inicio Rápido

### Backend (API)
```bash
cd cafeteria-backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run migrate
npm run dev
# API corre en https://localhost:3443
```

### Frontend (UI)
```bash
cd cafeteria-frontend
npm install
npm run dev
# UI corre en http://localhost:5173
```

**Documentación completa**: [docs/GUIA_INICIO_RAPIDO.md](./docs/GUIA_INICIO_RAPIDO.md)

## 📋 Requisitos Previos

- Node.js >= 20.0.0
- MySQL >= 8.0
- npm >= 10.0.0
- OpenSSL (para certificados HTTPS locales)
- Git (incluido con Xcode Command Line Tools)

## 🔧 Stack Tecnológico

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 4+
- **Base de datos**: MySQL 8+
- **Autenticación**: JWT (HttpOnly cookies)
- **Seguridad**: Helmet, CORS, Rate Limiting, CSRF
- **Logging**: Winston
- **Arquitectura**: Clean Architecture + SOLID

### Frontend (Por implementar)
- **Framework**: React/Vue/Vanilla JS
- **Build**: Vite
- **Styling**: CSS Modules / Tailwind
- **HTTP Client**: Axios / Fetch

## 🔧 Instalación

### 1. Instalar Software Requerido

Consulta [docs/INSTALACION_SOFTWARE.md](./docs/INSTALACION_SOFTWARE.md) para instrucciones detalladas.

### 2. Clonar el Proyecto

```bash
cd /Users/willy-pc/Maestria-Cato/Seguridad
# El proyecto ya está aquí
```

### 3. Configurar Backend

```bash
cd cafeteria/cafeteria-backend
npm install
cp .env.example .env
nano .env  # Editar con tus credenciales

# Generar certificados SSL
mkdir -p cert
openssl req -x509 -newkey rsa:4096 -keyout cert/key.pem -out cert/cert.pem -days 365 -nodes -subj "/CN=localhost"

# Crear base de datos
mysql -u root -p
CREATE DATABASE cafedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cafeapp'@'localhost' IDENTIFIED BY 'cafe_secure_2024';
GRANT ALL PRIVILEGES ON cafedb.* TO 'cafeapp'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Ejecutar migraciones
npm run migrate
```

### 4. Configurar Frontend (Pendiente)

```bash
cd ../cafeteria-frontend
# Por implementar
```

## 🚀 Uso

### Backend (Desarrollo)
```bash
cd cafeteria-backend
npm run dev
```
El servidor iniciará en `https://localhost:3443`

### Frontend (Desarrollo - Pendiente)
```bash
cd cafeteria-frontend
npm run dev
```
La aplicación iniciará en `http://localhost:5173`

### Backend (Producción)
```bash
cd cafeteria-backend
npm start
```

## 📚 Documentación

### 📖 Documentación Compartida
- **[INDICE_DOCUMENTACION](./docs/INDICE_DOCUMENTACION.md)** - Índice completo
- **[GUIA_INICIO_RAPIDO](./docs/GUIA_INICIO_RAPIDO.md)** - Setup paso a paso ⭐
- **[INSTALACION_SOFTWARE](./docs/INSTALACION_SOFTWARE.md)** - Instalación detallada
- **[PLAN_DESARROLLO_CLEAN_CODE](./docs/PLAN_DESARROLLO_CLEAN_CODE.md)** - Arquitectura y Clean Code
- **[CONECTAR_GITHUB](./docs/CONECTAR_GITHUB.md)** - Git y GitHub

### 📖 Específica por Proyecto
- **[Backend README](./cafeteria-backend/README.md)** - Documentación del API
- **[Frontend README](./cafeteria-frontend/README.md)** - Documentación del frontend (pendiente)

## 🏗️ Arquitectura

### Separación Frontend-Backend

```
┌─────────────────────────────────────┐
│       cafeteria-frontend            │
│   (React/Vue - Puerto 5173)         │
│   - Interfaz de usuario             │
│   - Manejo de estado                │
│   - Componentes visuales            │
└─────────────┬───────────────────────┘
              │ HTTP/HTTPS
              │ (API REST)
┌─────────────▼───────────────────────┐
│       cafeteria-backend             │
│   (Node.js + Express - Puerto 3443) │
│   - API RESTful                     │
│   - Lógica de negocio               │
│   - Autenticación                   │
│   - Validación                      │
└─────────────┬───────────────────────┘
              │ mysql2
┌─────────────▼───────────────────────┐
│          MySQL 8                    │
│   - Base de datos                   │
│   - Persistencia                    │
└─────────────────────────────────────┘
```

### Backend - Arquitectura Limpia

```
cafeteria-backend/src/
├── config/              # Configuraciones
├── middlewares/         # Middlewares Express
├── modules/             # Módulos por dominio
│   ├── auth/           # Autenticación
│   ├── users/          # Usuarios
│   ├── ingredientes/   # Inventario
│   ├── menu/           # Menú
│   └── pedidos/        # Pedidos
├── shared/             # Código compartido
│   ├── errors/        # Errores personalizados
│   ├── utils/         # Utilidades
│   └── types/         # Tipos y enums
└── database/          # Migraciones y seeds
```

Ver [PLAN_DESARROLLO_CLEAN_CODE.md](./cafeteria-backend/docs/PLAN_DESARROLLO_CLEAN_CODE.md) para más detalles.

## 🔒 Seguridad (OWASP Top 10)

- **A01** - Control de acceso: RBAC implementado
- **A02** - Criptografía: bcrypt + HTTPS/TLS
- **A03** - Inyección: Consultas preparadas
- **A05** - Configuración: Helmet + CORS + env
- **A07** - Autenticación: JWT + cookies HttpOnly
- **A08** - Integridad: npm audit

## 🧪 Tests

```bash
npm test
```

## 📝 Scripts Disponibles

### Backend
```bash
cd cafeteria-backend

npm run dev          # Iniciar en modo desarrollo
npm start            # Iniciar en modo producción
npm run lint         # Ejecutar linter
npm run lint:fix     # Corregir problemas de linting
npm run format       # Formatear código
npm run audit        # Auditoría de seguridad
npm run migrate      # Ejecutar migraciones
npm run seed         # Sembrar datos iniciales
```

### Frontend (Pendiente)
```bash
cd cafeteria-frontend

npm run dev          # Iniciar en modo desarrollo
npm run build        # Construir para producción
npm run preview      # Preview de producción
```

## 👥 Roles del Sistema

- **Admin**: Acceso completo al sistema
- **Empleado**: Gestión de inventario y pedidos
- **Cliente**: Visualización de menú y creación de pedidos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONECTAR_GITHUB.md](./cafeteria-backend/docs/CONECTAR_GITHUB.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📧 Contacto

Tu Nombre - tu.email@ejemplo.com

**Repositorios**:
- Backend: [https://github.com/wilino/cafeteria-backend](https://github.com/wilino/cafeteria)
- Frontend: https://github.com/wilino/cafeteria-frontend (Pendiente)

## 🙏 Agradecimientos

- Clean Code - Robert C. Martin
- OWASP Foundation
- Node.js Best Practices Guide

---

**Fecha de actualización:** 9 de noviembre de 2025  
**Versión:** 2.0.0 (Arquitectura separada frontend-backend)  
**Estado:** Backend ✅ | Frontend ⏳
