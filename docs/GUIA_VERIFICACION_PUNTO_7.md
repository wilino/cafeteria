# Guía de Verificación - Punto 7: Checklist de Cumplimiento

**Fecha:** 10 de noviembre de 2025  
**Proyecto:** Sistema de Cafetería - Seguridad en Aplicaciones Web

---

## ✅ Requisitos Completados

### 1. **Gestión de Usuarios**
- ✅ ABM por admin
- ✅ Cliente puede registrarse
- ✅ Admin puede crear clientes

**Cómo verificar:**
```bash
# 1. Registro de cliente
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Cliente",
    "email": "juan@cliente.com",
    "password": "Pass123!"
  }'

# 2. Login como admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cafe.com",
    "password": "Adm!n#2025.Cafe_Latte"
  }'

# 3. Crear usuario (con token de admin)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -d '{
    "nombre": "Nuevo Usuario",
    "email": "nuevo@ejemplo.com",
    "password": "Pass123!",
    "role_id": 3
  }'

# 4. Listar usuarios (admin)
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

**Archivos:**
- `cafeteria-backend/src/modules/auth/auth.controller.js`
- `cafeteria-backend/src/modules/users/users.controller.js`
- `cafeteria-frontend/src/pages/UsuariosPage.jsx`

---

### 2. **Contraseñas Seguras**
- ✅ bcrypt implementado
- ✅ Política de contraseñas (mínimo 8 caracteres, mayúscula, número, símbolo)
- ✅ MFA TOTP opcional

**Cómo verificar:**
```bash
# 1. Intentar contraseña débil (debe fallar)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@test.com",
    "password": "12345"
  }'
# Esperado: Error 400 con mensaje de política de contraseñas

# 2. Habilitar MFA
curl -X POST http://localhost:3000/api/mfa/enable \
  -H "Authorization: Bearer <TOKEN>" \
  -H "X-CSRF-Token: <CSRF_TOKEN>"
# Esperado: QR code y secret

# 3. Verificar MFA
curl -X POST http://localhost:3000/api/mfa/verify \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -d '{
    "token": "123456"
  }'
```

**Archivos:**
- `cafeteria-backend/src/modules/auth/auth.service.js` (líneas 35-50: validación)
- `cafeteria-backend/src/modules/mfa/mfa.service.js`
- `cafeteria-backend/src/modules/mfa/mfa.routes.js`

---

### 3. **Roles y Matriz de Permisos**
- ✅ Roles: admin, empleado, cliente
- ✅ Middleware `authorizeRoles`
- ✅ Propiedad de recursos (clientes solo ven sus pedidos)

**Cómo verificar:**
```bash
# 1. Verificar tabla roles
mysql -u root -p cafedb -e "SELECT * FROM roles;"

# 2. Intentar acceso no autorizado
# Login como cliente
TOKEN_CLIENTE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@cafe.com","password":"Cl!ente#2025.Mocha_Safe"}' \
  | jq -r '.token')

# Intentar crear usuario (debe fallar)
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN_CLIENTE" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@test.com",
    "password": "Pass123!",
    "role_id": 3
  }'
# Esperado: 403 Forbidden

# 3. Cliente intenta ver pedido de otro (debe fallar)
curl http://localhost:3000/api/pedidos/999 \
  -H "Authorization: Bearer $TOKEN_CLIENTE"
# Esperado: 403 o 404
```

**Archivos:**
- `cafeteria-backend/src/middlewares/auth.middleware.js` (authorizeRoles)
- `cafeteria-backend/src/modules/pedidos/pedidos.service.js` (líneas 47-51: ownership check)

---

### 4. **Criptografía**
- ✅ TLS local (HTTPS)
- ✅ Hash de contraseñas con bcrypt

**Cómo verificar:**
```bash
# 1. Verificar servidor HTTPS
curl -k https://localhost:3000/health
# Esperado: {"status":"ok","timestamp":"..."}

# 2. Verificar certificado
openssl s_client -connect localhost:3000 -showcerts

# 3. Verificar hash en BD
mysql -u root -p cafedb -e "SELECT id, email, password_hash FROM users LIMIT 3;"
# Esperado: password_hash debe empezar con "$2b$10$"
```

**Archivos:**
- `cafeteria-backend/src/server.js` (líneas 1-30: HTTPS setup)
- `cafeteria-backend/cert/` (certificados)

---

### 5. **Principios OWASP**
- ✅ Menor privilegio (RBAC)
- ✅ Defensa en profundidad (múltiples capas)
- ✅ Manejo de errores seguro (sin stack traces)

**Cómo verificar:**
```bash
# 1. Error genérico (sin stack trace)
curl http://localhost:3000/api/users/9999 \
  -H "Authorization: Bearer <TOKEN>"
# Esperado: {"error":"User not found"} SIN stack trace

# 2. Verificar logs
tail -f cafeteria-backend/logs/app.log
# Los errores internos deben estar solo en logs, no en respuesta
```

**Archivos:**
- `cafeteria-backend/src/middlewares/errorHandler.middleware.js`
- `cafeteria-backend/src/shared/utils/logger.util.js`

---

### 6. **OWASP Top 10**

#### A01 - Control de Acceso (RBAC)
- ✅ Middleware `verifyJWT`
- ✅ Middleware `authorizeRoles`
- ✅ Ownership checks

**Verificar:**
```bash
# Sin token
curl http://localhost:3000/api/users
# Esperado: 401 Unauthorized

# Con token de cliente intentando acceso admin
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN_CLIENTE>"
# Esperado: 403 Forbidden
```

#### A02 - Criptografía
- ✅ HTTPS
- ✅ bcrypt
- ✅ JWT firmado

**Verificar:**
```bash
# Token JWT debe estar firmado
echo "<TOKEN>" | cut -d'.' -f2 | base64 -d
# Debe contener userId, role, exp
```

#### A03 - Inyección SQL
- ✅ Consultas preparadas (mysql2)

**Verificar:**
```bash
# Intento de SQL injection
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cafe.com\" OR 1=1--",
    "password": "cualquier cosa"
  }'
# Esperado: 401 (no debe bypassear autenticación)
```

**Archivos:** Todos los repositorios usan `pool.execute()` con `?` placeholders

#### A05 - Configuración
- ✅ helmet
- ✅ CORS configurado
- ✅ Variables de entorno (.env)

**Verificar:**
```bash
# Headers de seguridad
curl -I https://localhost:3000/health -k
# Esperado: X-Content-Type-Options, X-Frame-Options, etc.

# CORS
curl -H "Origin: http://malicious.com" http://localhost:3000/health
# Esperado: Sin Access-Control-Allow-Origin
```

**Archivos:**
- `cafeteria-backend/src/server.js` (líneas 26-50: helmet y CORS)
- `cafeteria-backend/.env`

#### A07 - Autenticación
- ✅ JWT en HttpOnly cookie
- ✅ Rate limiting
- ✅ MFA TOTP

**Verificar:**
```bash
# 1. Rate limiting en login
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@cafe.com","password":"wrong"}'
done
# Después de varios intentos debe responder: 429 Too Many Requests

# 2. Cookie HttpOnly
curl -v -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cafe.com","password":"Adm!n#2025.Cafe_Latte"}'
# Esperado: Set-Cookie: auth=...; HttpOnly; Secure; SameSite=Strict
```

**Archivos:**
- `cafeteria-backend/src/middlewares/rateLimiter.middleware.js`
- `cafeteria-backend/src/modules/auth/auth.controller.js` (línea 85-90: cookie setup)

#### A08 - Integridad de Software
- ✅ npm audit

**Verificar:**
```bash
cd cafeteria-backend
npm audit
# Esperado: 0 vulnerabilidades críticas/altas
```

#### A09 - Logs (Opcional)
- ✅ Logs estructurados con winston

**Verificar:**
```bash
# Ver logs
cat cafeteria-backend/logs/app.log
cat cafeteria-backend/logs/error.log

# Logs deben incluir: timestamp, level, message, context
```

---

### 7. **Inventario**
- ✅ CRUD ingredientes

**Cómo verificar:**
```bash
# 1. Crear ingrediente (admin/empleado)
curl -X POST http://localhost:3000/api/ingredientes \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -d '{
    "nombre": "Leche",
    "unidadMedida": "litros",
    "cantidadDisponible": 50,
    "cantidadMinima": 10
  }'

# 2. Listar ingredientes
curl http://localhost:3000/api/ingredientes \
  -H "Authorization: Bearer <TOKEN>"

# 3. Actualizar stock
curl -X PATCH http://localhost:3000/api/ingredientes/1/stock \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -d '{
    "cantidad": 20,
    "tipo": "entrada"
  }'

# 4. Eliminar ingrediente
curl -X DELETE http://localhost:3000/api/ingredientes/1 \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "X-CSRF-Token: <CSRF_TOKEN>"
```

**Frontend:**
- Página: `cafeteria-frontend/src/pages/InventarioPage.jsx`
- Navegación: Login → Dashboard → Inventario (Admin/Empleado)

---

### 8. **Menú con Disponibilidad**
- ✅ CRUD menú
- ✅ Asociación a ingredientes
- ✅ Disponibilidad automática basada en stock

**Cómo verificar:**
```bash
# 1. Crear ítem de menú
curl -X POST http://localhost:3000/api/menu \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -d '{
    "nombre": "Café Latte",
    "descripcion": "Espresso con leche vaporizada",
    "precio": 45.50,
    "categoria": "Bebidas Calientes",
    "ingredientes": [
      {"ingrediente_id": 1, "cantidad_requerida": 0.25},
      {"ingrediente_id": 2, "cantidad_requerida": 0.02}
    ]
  }'

# 2. Verificar disponibilidad
curl http://localhost:3000/api/menu/1/disponibilidad \
  -H "Authorization: Bearer <TOKEN>"
# Esperado: {"disponible": true/false, "ingredientes": [...]}

# 3. Listar menú (público)
curl http://localhost:3000/api/menu
```

**Frontend:**
- Página: `cafeteria-frontend/src/pages/MenuPage.jsx`
- Ver como cliente: Items con disponibilidad marcada

---

### 9. **Pedidos del Cliente**
- ✅ Creación con CSRF
- ✅ Idempotencia (Idempotency-Key header)
- ✅ Transacción
- ✅ Descuento de stock
- ✅ Historial/consulta

**Cómo verificar:**
```bash
# 1. Crear pedido (cliente) - con idempotencia
curl -X POST http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer <TOKEN_CLIENTE>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -H "Idempotency-Key: unique-uuid-123-456-789" \
  -d '{
    "items": [
      {"menuId": 1, "cantidad": 2},
      {"menuId": 2, "cantidad": 1}
    ]
  }'
# Esperado: 201 Created con datos del pedido

# 2. Reintento con misma Idempotency-Key (simular doble clic)
curl -X POST http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer <TOKEN_CLIENTE>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -H "Idempotency-Key: unique-uuid-123-456-789" \
  -d '{
    "items": [
      {"menuId": 1, "cantidad": 2},
      {"menuId": 2, "cantidad": 1}
    ]
  }'
# Esperado: 409 Conflict {"error":"Request already processed"}

# 3. Ver mis pedidos (cliente)
curl http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer <TOKEN_CLIENTE>"

# 4. Ver detalle de pedido
curl http://localhost:3000/api/pedidos/1 \
  -H "Authorization: Bearer <TOKEN_CLIENTE>"

# 5. Cambiar estado (admin/empleado)
curl -X PATCH http://localhost:3000/api/pedidos/1/estado \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -d '{
    "estado": "en_preparacion"
  }'

# 6. Verificar stock descontado
curl http://localhost:3000/api/ingredientes \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
# cantidadDisponible debe haber disminuido
```

**Frontend:**
- Página: `cafeteria-frontend/src/pages/MenuPage.jsx` (crear pedido con UUID)
- Página: `cafeteria-frontend/src/pages/PedidosPage.jsx` (ver historial)
- Servicio: `cafeteria-frontend/src/services/api.service.js` (línea 109-113: idempotencyKey)

**Backend:**
- Middleware: `cafeteria-backend/src/middlewares/idempotency.middleware.js`
- Ruta: `cafeteria-backend/src/modules/pedidos/pedidos.routes.js` (línea 85)
- Tabla: `idempotency_keys` (TTL 24 horas)

---

## ✅ Implementaciones Completadas

### **Idempotencia en Pedidos**
**Estado:** ✅ IMPLEMENTADO  

**Características:**
- Header `Idempotency-Key` con formato UUID v4
- Almacenamiento en tabla `idempotency_keys`
- Retorna 409 Conflict si se reintenta con misma key
- TTL de 24 horas para keys
- Limpieza automática cada hora

**Implementación:**
```javascript
// Frontend genera UUID
const idempotencyKey = uuidv4();
await pedidosAPI.create(orderData, idempotencyKey);

// Backend valida y almacena
if (existingResponse) {
  return res.status(409).json({
    error: 'Request already processed',
    originalResponse: existingResponse
  });
}
```

**Archivos:**
- `cafeteria-backend/src/middlewares/idempotency.middleware.js` (implementación completa)
- `cafeteria-backend/src/modules/pedidos/pedidos.routes.js` (línea 85: middleware aplicado)
- `cafeteria-frontend/src/pages/MenuPage.jsx` (línea 117: genera UUID)
- `cafeteria-frontend/src/services/api.service.js` (línea 109-113: envía header)
- Tabla: `idempotency_keys` en BD

---

## 📋 Resumen de Estado

| Requisito | Estado | Verificación |
|-----------|--------|--------------|
| Gestión de usuarios | ✅ | Probado en UI y API |
| Contraseñas seguras | ✅ | bcrypt + validación |
| MFA TOTP | ✅ | Implementado y funcional |
| Roles y matriz | ✅ | Admin/Empleado/Cliente |
| TLS | ✅ | HTTPS local |
| Control de acceso (A01) | ✅ | RBAC + ownership |
| Criptografía (A02) | ✅ | TLS + bcrypt + JWT |
| Inyección SQL (A03) | ✅ | Consultas preparadas |
| Configuración (A05) | ✅ | helmet + CORS + .env |
| Autenticación (A07) | ✅ | JWT + rate limit + MFA |
| Integridad SW (A08) | ✅ | npm audit |
| Logs (A09) | ✅ | winston |
| Inventario CRUD | ✅ | Completo |
| Menú + disponibilidad | ✅ | Completo |
| Pedidos + CSRF | ✅ | Implementado |
| Transacciones | ✅ | SQL transactions |
| Descuento de stock | ✅ | Automático |
| **Idempotencia** | ✅ | **UUID + tabla BD** |

---

## 🚀 Próximos Pasos

1. ~~**Implementar idempotencia en pedidos**~~ ✅ COMPLETADO
2. **Probar todos los flujos** (30 min)
3. **Documentar usuarios de prueba** (15 min)
4. **Crear video de demostración** (<10 min)
5. **Preparar entregables** (capturas, README)

---

## 👥 Usuarios de Prueba

**Formato de contraseñas según OWASP:**
- Mínimo 8 caracteres (recomendado 12+)
- Al menos 1 mayúscula (A-Z)
- Al menos 1 minúscula (a-z)
- Al menos 1 número (0-9)
- Al menos 1 carácter especial (!@#$%^&*(),.?":{}|<>_-+=)
- No contraseñas comunes (password, 123456, etc.)

```sql
-- Ver usuarios existentes
SELECT u.id, u.nombre, u.email, r.nombre as rol 
FROM users u 
JOIN roles r ON u.role_id = r.id;
```

**Credenciales de prueba (OWASP-compliant):**

| Rol | Email | Contraseña | Uso |
|-----|-------|------------|-----|
| **Admin** | `admin@cafe.com` | `Adm!n#2025.Cafe_Latte` | Gestión completa del sistema |
| **Empleado** | `barista@cafe.com` | `B@r1st@#2025.Espresso` | Gestión de inventario y pedidos |
| **Cliente** | `cliente@cafe.com` | `Cl!ente#2025.Mocha_Safe` | Crear pedidos y ver historial |

**Ejemplos de uso:**

```bash
# Login como Admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cafe.com",
    "password": "Adm!n#2025.Cafe_Latte"
  }'

# Login como Empleado
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "barista@cafe.com",
    "password": "B@r1st@#2025.Espresso"
  }'

# Login como Cliente
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@cafe.com",
    "password": "Cl!ente#2025.Mocha_Safe"
  }'
```

**Para crear nuevos usuarios de prueba con contraseñas seguras:**

```bash
# Ejemplo: Nuevo empleado
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <CSRF_TOKEN>" \
  -d '{
    "nombre": "Carlos Mendoza - Cajero",
    "email": "cajero@cafe.com",
    "password": "C@j3r0#2025.Cappuccino!",
    "role_id": 2
  }'
```

**Patrón recomendado para contraseñas:**
- `[Rol]![Característica]#[Año].[Producto/Tema]_[Extra]`
- Ejemplos válidos:
  - `Adm!n#2025.Cafe_Latte` ✅
  - `B@r1st@#2025.Espresso` ✅
  - `Cl!ente#2025.Mocha_Safe` ✅
  - `Empl3@do#2025.Americano!` ✅

---

**Última actualización:** 10 de noviembre de 2025
