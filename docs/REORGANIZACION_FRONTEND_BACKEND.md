# 🔄 Reorganización: Arquitectura Frontend-Backend Separada

## ✅ Cambios Realizados

Se ha reorganizado el proyecto en **arquitectura separada frontend-backend**, siguiendo las mejores prácticas modernas.

---

## 📁 Estructura Anterior (Monolítico)

```
cafeteria/
├── README.md
├── package.json
├── src/
│   ├── config/
│   ├── shared/
│   ├── middlewares/
│   ├── modules/
│   └── database/
├── docs/
└── logs/
```

**Problema**: Todo en un solo proyecto (backend + posible frontend mezclados).

---

## 📁 Estructura Nueva (Separada) ✅

```
cafeteria/                           # Raíz del monorepo
├── README.md                        # Documentación principal
├── .gitignore                       # Gitignore del monorepo
│
├── cafeteria-backend/              # 🔙 Backend (API REST)
│   ├── README.md
│   ├── package.json
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── src/
│   │   ├── config/
│   │   ├── shared/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   └── database/
│   ├── docs/                       # Documentación completa
│   │   ├── GUIA_INICIO_RAPIDO.md
│   │   ├── PLAN_DESARROLLO_CLEAN_CODE.md
│   │   ├── INSTALACION_SOFTWARE.md
│   │   ├── CONECTAR_GITHUB.md
│   │   └── ...
│   └── logs/
│
└── cafeteria-frontend/             # 🎨 Frontend (UI)
    ├── README.md
    ├── package.json (pendiente)
    ├── src/ (pendiente)
    └── public/ (pendiente)
```

---

## 🎯 Ventajas de la Separación

### ✅ Desarrollo Independiente
- **Backend** y **Frontend** se desarrollan por separado
- Equipos pueden trabajar en paralelo
- No hay dependencias cruzadas

### ✅ Despliegue Independiente
- Backend puede desplegarse en un servidor
- Frontend en otro (o CDN/hosting estático)
- Escalado independiente

### ✅ Tecnologías Específicas
- **Backend**: Node.js + Express (ya implementado)
- **Frontend**: React/Vue/Angular (a elegir)

### ✅ Versionado Independiente
- Backend: v1.0.0
- Frontend: v1.0.0
- Cada uno con su propio package.json

### ✅ Repositorios Separados (Opcional)
- Backend: https://github.com/wilino/cafeteria-backend
- Frontend: https://github.com/wilino/cafeteria-frontend

---

## 🚀 Cómo Trabajar con Esta Estructura

### Backend

```bash
# Navegar al backend
cd cafeteria/cafeteria-backend

# Instalar dependencias
npm install

# Configurar
cp .env.example .env
nano .env

# Ejecutar migraciones
npm run migrate

# Iniciar desarrollo
npm run dev
# API en https://localhost:3443
```

### Frontend (Cuando esté implementado)

```bash
# Navegar al frontend
cd cafeteria/cafeteria-frontend

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
# UI en http://localhost:5173
```

### Desarrollo Simultáneo

```bash
# Terminal 1 - Backend
cd cafeteria/cafeteria-backend
npm run dev

# Terminal 2 - Frontend
cd cafeteria/cafeteria-frontend
npm run dev
```

---

## 📡 Comunicación Frontend ↔ Backend

### Backend expone API REST
```
https://localhost:3443/api/
├── /auth/login
├── /auth/register
├── /menu
├── /ingredientes
├── /pedidos
└── /users
```

### Frontend consume la API
```javascript
// En el frontend
const API_URL = 'https://localhost:3443';

// Ejemplo de login
async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include', // Para enviar/recibir cookies
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

---

## 🔐 Autenticación entre Frontend y Backend

### Backend envía JWT en cookie HttpOnly
```javascript
// Backend (ya implementado)
res.cookie('auth', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

### Frontend incluye cookies automáticamente
```javascript
// Frontend (configuración)
fetch(url, {
  credentials: 'include' // Importante!
});
```

---

## 📋 Documentación Actualizada

### Documentación Principal (Raíz)
- [README.md](./README.md) - Overview del proyecto completo

### Documentación Backend
- [cafeteria-backend/README.md](./cafeteria-backend/README.md)
- [cafeteria-backend/docs/](./cafeteria-backend/docs/) - Documentación completa
  - GUIA_INICIO_RAPIDO.md ⭐
  - PLAN_DESARROLLO_CLEAN_CODE.md
  - INSTALACION_SOFTWARE.md
  - CONECTAR_GITHUB.md
  - Y más...

### Documentación Frontend (Pendiente)
- [cafeteria-frontend/README.md](./cafeteria-frontend/README.md)

---

## 🔄 Workflow de Git

### Opción 1: Un solo repositorio (Monorepo)
```bash
cd cafeteria
git init
git add .
git commit -m "Initial commit: Separated frontend-backend architecture"
git remote add origin https://github.com/wilino/cafeteria.git
git push -u origin main
```

### Opción 2: Repositorios separados
```bash
# Backend
cd cafeteria/cafeteria-backend
git init
git remote add origin https://github.com/wilino/cafeteria-backend.git
git add .
git commit -m "Initial commit: Backend API"
git push -u origin main

# Frontend
cd ../cafeteria-frontend
git init
git remote add origin https://github.com/wilino/cafeteria-frontend.git
git add .
git commit -m "Initial commit: Frontend"
git push -u origin main
```

---

## ✅ Checklist de Migración

- [x] Crear carpetas cafeteria-backend y cafeteria-frontend
- [x] Mover código backend a cafeteria-backend/
- [x] Crear README.md principal (monorepo)
- [x] Crear README.md para backend
- [x] Crear README.md para frontend
- [x] Actualizar .gitignore para monorepo
- [x] Actualizar referencias en documentación
- [ ] Implementar frontend
- [ ] Configurar CORS en backend
- [ ] Probar comunicación frontend-backend

---

## 🎯 Próximos Pasos

### 1. Backend (Ya está listo)
- ✅ Estructura completa
- ✅ Configuraciones
- ✅ Utilidades y errores
- ✅ Migraciones SQL
- ⏳ Implementar módulos (auth, users, etc.)

### 2. Frontend (Por implementar)
1. **Decidir framework**
   - React (recomendado)
   - Vue
   - Vanilla JS

2. **Configurar proyecto**
   ```bash
   cd cafeteria/cafeteria-frontend
   npm create vite@latest . -- --template react
   ```

3. **Implementar vistas**
   - Login
   - Menú
   - Pedidos
   - Panel admin

4. **Integrar con backend**
   - Configurar axios/fetch
   - Manejo de cookies
   - Manejo de errores

---

## 🌐 Despliegue (Futuro)

### Backend
- **Servidor**: VPS, AWS EC2, Heroku
- **Base de datos**: MySQL en servidor dedicado
- **SSL**: Let's Encrypt

### Frontend
- **Hosting estático**: Vercel, Netlify, GitHub Pages
- **CDN**: Cloudflare
- **Build**: `npm run build` → carpeta `dist/`

---

## 📊 Comparación

| Aspecto | Antes (Monolítico) | Ahora (Separado) |
|---------|-------------------|------------------|
| Estructura | Todo mezclado | Backend y Frontend separados |
| Desarrollo | Secuencial | Paralelo |
| Despliegue | Todo junto | Independiente |
| Escalado | Difícil | Fácil |
| Versionado | Uno para todo | Independiente |
| Repositorios | 1 | 1 o 2 (opcional) |

---

## 🤝 Colaboración

Con esta estructura:
- Un desarrollador puede trabajar en **Backend**
- Otro desarrollador en **Frontend**
- No se bloquean entre sí
- Pull requests independientes
- Testing independiente

---

**Fecha de reorganización:** 9 de noviembre de 2025  
**Versión:** 2.0.0  
**Estado:** ✅ Backend listo | ⏳ Frontend pendiente
