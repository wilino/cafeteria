# 🎨 Sistema de Cafetería - Frontend

Aplicación web para el sistema de cafetería desarrollada con **React 18+** y aplicando las mejores prácticas de seguridad según OWASP.

## 🚧 En Desarrollo

Este proyecto está en proceso de desarrollo. Próximamente estará disponible.

## 🎯 Objetivos

- Interfaz moderna y responsive
- Consumo seguro del API backend
- Autenticación con JWT (cookies HttpOnly)
- Protección CSRF en operaciones críticas
- Gestión de pedidos con idempotencia
- Visualización de menú con disponibilidad

## 🔧 Stack Tecnológico

### Framework Principal: **React 18+ con Vite**
```bash
npm create vite@latest . -- --template react
npm install
```

### Dependencias de Seguridad
```bash
npm install axios
npm install react-router-dom
npm install dompurify
npm install js-cookie
```

### Herramientas de Desarrollo
```bash
npm install --save-dev eslint eslint-plugin-react
npm install --save-dev prettier
```

## 📋 Funcionalidades Planeadas

### Para Clientes
- [ ] Ver menú disponible (con stock en tiempo real)
- [ ] Crear pedidos (con protección CSRF e idempotencia)
- [ ] Ver historial de pedidos
- [ ] Seguimiento de estado de pedido en tiempo real

### Para Empleados
- [ ] Gestión de inventario
- [ ] Actualizar stock de ingredientes
- [ ] Ver pedidos activos
- [ ] Cambiar estado de pedidos (pendiente → preparando → listo)

### Para Administradores
- [ ] Panel de control con métricas
- [ ] Gestión de usuarios y roles
- [ ] CRUD de menú con asignación de ingredientes
- [ ] CRUD de ingredientes con control de stock
- [ ] Reportes y auditoría de operaciones

## 🔒 Medidas de Seguridad Implementadas

### **OWASP A01: Control de Acceso**
- **Roles y permisos**: Validación de roles (admin, empleado, cliente) en cada ruta
- **Propiedad de recursos**: Usuarios solo acceden a sus propios datos
- **Rutas protegidas**: Componente `ProtectedRoute` con verificación de autenticación y autorización
- **Redirección automática**: Usuarios no autorizados son redirigidos al login

### **OWASP A02: Fallas Criptográficas**
- **HTTPS obligatorio**: Todas las comunicaciones sobre TLS
- **Cookies seguras**: JWT en cookies con flags `HttpOnly`, `Secure`, `SameSite=Strict`
- **No almacenamiento de secretos**: Tokens solo en cookies, nunca en localStorage
- **Validación de certificados**: Configuración correcta de CORS y certificados

### **OWASP A03: Inyección**
- **Sanitización de entrada**: Uso de `DOMPurify` para contenido dinámico
- **Validación de formularios**: Validación client-side antes de enviar al servidor
- **Escape de HTML**: Prevención de XSS en campos de texto y comentarios
- **Validación de tipos**: TypeScript/PropTypes para validar estructura de datos

### **OWASP A05: Configuración de Seguridad**
- **Headers de seguridad**: Configuración de CSP (Content Security Policy)
- **Variables de entorno**: Configuración sensible en archivos `.env`
- **Modo producción**: Desactivación de debug y console.log en producción
- **CORS restrictivo**: Origen del backend explícitamente configurado

### **OWASP A07: Identificación y Autenticación**
- **JWT en cookies HttpOnly**: El token JWT nunca es accesible por JavaScript
- **Refresh automático**: Renovación silenciosa de tokens antes de expiración
- **Logout seguro**: Limpieza completa de sesión y cookies
- **Rate limiting**: Control de intentos de login en frontend (complementa backend)
- **MFA (Opcional)**: Soporte para autenticación de dos factores con TOTP

### **OWASP A08: Integridad del Software**
- **npm audit**: Escaneo regular de vulnerabilidades en dependencias
- **Lock file**: `package-lock.json` en control de versiones
- **Actualizaciones controladas**: Revisión de cambios en dependencias críticas
- **Subresource Integrity (SRI)**: Para CDN externos si se usan

### **Protección CSRF**
- **Token CSRF**: Header `X-CSRF-Token` en todas las operaciones de estado
- **Cookie csrf**: Token obtenido de cookie no-HttpOnly y enviado en header
- **Validación doble**: Cookie + Header verificados por el backend
- **Operaciones protegidas**: POST, PUT, PATCH, DELETE requieren token válido

### **Idempotencia en Pedidos**
- **Idempotency-Key**: UUID v4 único por intento de creación de pedido
- **Prevención de duplicados**: Reintentos con misma key retornan 409
- **Experiencia de usuario**: Botones deshabilitados durante procesamiento
- **Feedback claro**: Mensajes de éxito/error distinguiendo entre duplicados y fallos

## 🔌 Conexión Segura con Backend

### Configuración Base
```javascript
// src/config/api.config.js
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3443';

export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Crucial para enviar cookies HttpOnly
  headers: {
    'Content-Type': 'application/json'
  }
};
```

### Cliente Axios con Interceptores de Seguridad
```javascript
// src/services/api.service.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from '../config/api.config';

const apiClient = axios.create(API_CONFIG);

// Interceptor de request: Agregar CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Para operaciones que modifican estado, agregar CSRF
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      const csrfToken = Cookies.get('csrf');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: Manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido, redirigir al login
      Cookies.remove('csrf');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Ejemplo: Obtener Menú Disponible
```javascript
// src/services/menu.service.js
import apiClient from './api.service';

export const menuService = {
  async getAvailableMenu() {
    try {
      const response = await apiClient.get('/api/cliente/menu-disponible');
      return response.data;
    } catch (error) {
      console.error('Error al obtener menú:', error);
      throw error;
    }
  }
};
```

### Ejemplo: Crear Pedido con Seguridad
```javascript
// src/services/pedidos.service.js
import apiClient from './api.service';
import { v4 as uuidv4 } from 'uuid';

export const pedidosService = {
  async createPedido(items, notas = '') {
    try {
      const idempotencyKey = uuidv4(); // Generar key única
      
      const response = await apiClient.post(
        '/api/cliente/pedidos',
        { items, notas },
        {
          headers: {
            'Idempotency-Key': idempotencyKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        // Pedido duplicado
        return { error: 'Este pedido ya fue procesado' };
      }
      throw error;
    }
  },

  async getMyPedidos() {
    const response = await apiClient.get('/api/cliente/pedidos');
    return response.data;
  }
};
```

### Ejemplo: Autenticación
```javascript
// src/services/auth.service.js
import apiClient from './api.service';

export const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password
      });
      // El JWT y CSRF se guardan automáticamente en cookies
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error de autenticación');
    }
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
      // Limpiar cookies localmente también
      Cookies.remove('csrf');
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

## 📂 Estructura del Proyecto

```
cafeteria-frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── common/          # Botones, Inputs, Modales
│   │   ├── layout/          # Header, Footer, Sidebar
│   │   ├── menu/            # MenuCard, MenuList
│   │   ├── pedidos/         # PedidoCard, PedidoList, PedidoForm
│   │   └── ProtectedRoute.jsx  # HOC para rutas protegidas
│   ├── pages/               # Páginas/vistas
│   │   ├── Login.jsx        # Autenticación
│   │   ├── Register.jsx     # Registro de usuarios
│   │   ├── Menu.jsx         # Menú para clientes
│   │   ├── Pedidos.jsx      # Historial de pedidos
│   │   ├── Dashboard.jsx    # Panel admin/empleado
│   │   ├── Inventario.jsx   # Gestión de ingredientes
│   │   └── Usuarios.jsx     # Gestión de usuarios (admin)
│   ├── services/            # Servicios API
│   │   ├── api.service.js   # Cliente Axios configurado
│   │   ├── auth.service.js  # Autenticación
│   │   ├── menu.service.js  # Menú
│   │   ├── pedidos.service.js   # Pedidos
│   │   └── usuarios.service.js  # Usuarios
│   ├── config/              # Configuración
│   │   ├── api.config.js    # URLs y configuración de API
│   │   └── constants.js     # Constantes globales
│   ├── utils/               # Utilidades
│   │   ├── validators.js    # Validación de formularios
│   │   ├── sanitizer.js     # Sanitización con DOMPurify
│   │   └── formatters.js    # Formateo de fechas, moneda
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js       # Hook de autenticación
│   │   ├── useMenu.js       # Hook de menú
│   │   └── usePedidos.js    # Hook de pedidos
│   ├── context/             # Context API
│   │   └── AuthContext.jsx  # Contexto de autenticación
│   ├── styles/              # Estilos globales
│   │   ├── global.css       # Estilos base
│   │   └── variables.css    # Variables CSS
│   ├── App.jsx              # Componente principal
│   └── main.jsx             # Entry point
├── public/                  # Assets estáticos
│   ├── favicon.ico
│   └── logo.png
├── .env.example             # Ejemplo de variables de entorno
├── .env.local               # Variables de entorno (no subir a git)
├── .gitignore
├── package.json
├── vite.config.js           # Configuración de Vite
├── eslint.config.js         # Configuración de ESLint
└── README.md
```

## 🛡️ Componente de Ruta Protegida

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Uso en App.jsx
<Route 
  path="/admin/usuarios" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <UsuariosPage />
    </ProtectedRoute>
  } 
/>
```

## 🧪 Validación y Sanitización

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
    return Number.isInteger(cantidad) && cantidad > 0 && cantidad <= 100;
  }
};

// src/utils/sanitizer.js
import DOMPurify from 'dompurify';

export const sanitize = {
  html: (dirty) => DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] }),
  
  text: (input) => {
    return String(input).trim().replace(/[<>]/g, '');
  }
};
```

## 🚀 Próximos Pasos

1. ✅ **Framework definido**: React 18+ con Vite
2. ⏳ **Configurar proyecto**: `npm create vite@latest`
3. ⏳ **Instalar dependencias de seguridad**: axios, js-cookie, dompurify, uuid
4. ⏳ **Configurar variables de entorno**: `.env.local` con URL del backend
5. ⏳ **Implementar servicios API**: Cliente Axios con interceptores
6. ⏳ **Crear contexto de autenticación**: AuthContext y useAuth hook
7. ⏳ **Implementar rutas protegidas**: ProtectedRoute component
8. ⏳ **Crear páginas**: Login, Register, Menu, Pedidos, Dashboard
9. ⏳ **Implementar validación**: Formularios con validación client-side
10. ⏳ **Integrar con backend**: Pruebas de conexión y flujos completos
11. ⏳ **Agregar estilos**: CSS moderno o Tailwind CSS
12. ⏳ **Pruebas de seguridad**: Verificar CSRF, cookies, sanitización

## � Recursos y Referencias

### Documentación Oficial
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Axios**: https://axios-http.com/
- **DOMPurify**: https://github.com/cure53/DOMPurify

### Guías de Seguridad
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **OWASP Cheat Sheet Series**: https://cheatsheetseries.owasp.org/
- **React Security Best Practices**: https://snyk.io/blog/10-react-security-best-practices/

### Documentación del Proyecto
- **Plan de Desarrollo**: `../docs/PLAN_DESARROLLO_CLEAN_CODE.md`
- **Guía de Inicio Rápido**: `../docs/GUIA_INICIO_RAPIDO.md`
- **Backend README**: `../cafeteria-backend/README.md`

## 🔐 Variables de Entorno

```bash
# .env.example
VITE_API_URL=https://localhost:3443
VITE_APP_NAME="Sistema Cafetería"
VITE_ENV=development
```

```bash
# .env.local (no subir a git)
VITE_API_URL=https://localhost:3443
VITE_APP_NAME="Sistema Cafetería"
VITE_ENV=development
```

## 📝 Checklist de Seguridad Frontend

- [ ] **HTTPS obligatorio** en todas las comunicaciones
- [ ] **JWT en cookies HttpOnly**, nunca en localStorage
- [ ] **CSRF token** en header para POST/PUT/PATCH/DELETE
- [ ] **Sanitización** de entrada con DOMPurify
- [ ] **Validación** de formularios antes de enviar
- [ ] **Rutas protegidas** con verificación de roles
- [ ] **npm audit** ejecutado regularmente
- [ ] **CSP headers** configurados en Vite
- [ ] **Manejo de errores** sin exponer información sensible
- [ ] **Idempotency-Key** en creación de pedidos
- [ ] **Rate limiting** visual (deshabilitar botones)
- [ ] **Logout seguro** con limpieza de cookies
- [ ] **Variables de entorno** para configuración sensible
- [ ] **.gitignore** con `.env.local` y node_modules

## 📧 Contacto

Repositorio: https://github.com/wilino/cafeteria

---

**Fecha:** 9 de noviembre de 2025  
**Estado:** 🚧 En planificación  
**Backend:** https://github.com/wilino/cafeteria
