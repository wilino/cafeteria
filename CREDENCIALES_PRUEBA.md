# Credenciales de Prueba - Sistema de Cafetería

**Fecha:** 10 de noviembre de 2025

## 🔐 Usuarios de Prueba (OWASP-Compliant)

Todas las contraseñas cumplen con los estándares de seguridad OWASP:
- ✅ Mínimo 12 caracteres
- ✅ Mayúsculas y minúsculas
- ✅ Números
- ✅ Caracteres especiales
- ✅ No son contraseñas comunes

---

### 👨‍💼 Administrador

**Email:** `admin@cafe.com`  
**Contraseña:** `Adm!n#2025.Cafe_Latte`  

**Permisos:**
- Gestión completa de usuarios
- Gestión de inventario
- Gestión de menú
- Visualización de todos los pedidos
- Cambiar estado de pedidos
- Habilitar/deshabilitar MFA

**Pruebas recomendadas:**
- Crear, editar y eliminar usuarios
- Crear, editar y eliminar ingredientes
- Crear y editar ítems del menú
- Ver todos los pedidos del sistema
- Cambiar estado de pedidos (pendiente → en_preparacion → listo → entregado)

---

### 👩‍🍳 Empleado (Barista)

**Email:** `barista@cafe.com`  
**Contraseña:** `B@r1st@#2025.Espresso`  

**Permisos:**
- Gestión de inventario (crear, editar, actualizar stock)
- Ver menú (solo lectura)
- Ver y gestionar pedidos
- Cambiar estado de pedidos

**Pruebas recomendadas:**
- Agregar ingredientes al inventario
- Actualizar stock de ingredientes
- Ver pedidos pendientes
- Cambiar estado de pedidos a "en_preparacion" o "listo"
- Verificar alertas de stock bajo

---

### 👤 Cliente

**Email:** `cliente@cafe.com`  
**Contraseña:** `Cl!ente#2025.Mocha_Safe`  

**Permisos:**
- Ver menú (solo items disponibles)
- Crear pedidos
- Ver historial de sus propios pedidos
- Ver detalle de sus pedidos

**Pruebas recomendadas:**
- Ver menú de productos disponibles
- Agregar ítems al carrito
- Crear pedido (verifica idempotencia con UUID)
- Ver historial de pedidos
- Intentar ver pedido de otro usuario (debe fallar con 403)

---

## 🧪 Comandos de Prueba Rápidos

### Login como Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cafe.com",
    "password": "Adm!n#2025.Cafe_Latte"
  }'
```

### Login como Empleado
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "barista@cafe.com",
    "password": "B@r1st@#2025.Espresso"
  }'
```

### Login como Cliente
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@cafe.com",
    "password": "Cl!ente#2025.Mocha_Safe"
  }'
```

---

## 🆕 Crear Nuevos Usuarios de Prueba

Para crear usuarios adicionales, usa contraseñas con este patrón:
```
[Rol]![Característica]#[Año].[Producto]_[Extra]
```

### Ejemplos válidos:
- `C@j3r0#2025.Cappuccino!`
- `G3r3nt3#2025.Macchiato_Boss`
- `Cl!ent3#2025.Frappuccino@`
- `Empl3@do#2025.Americano!`

### Crear empleado desde Admin:
```bash
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

---

## 🔄 Actualizar Contraseñas

Si necesitas regenerar las contraseñas de prueba:

```bash
cd cafeteria-backend
node scripts/update-test-passwords.js
```

Este script actualizará automáticamente las contraseñas en la base de datos.

---

## 🛡️ Validación de Contraseñas (OWASP)

El sistema valida que todas las contraseñas cumplan con:

1. **Longitud mínima:** 8 caracteres (recomendado 12+)
2. **Mayúsculas:** Al menos 1 letra A-Z
3. **Minúsculas:** Al menos 1 letra a-z
4. **Números:** Al menos 1 dígito 0-9
5. **Especiales:** Al menos 1 carácter `!@#$%^&*(),.?":{}|<>_-+=`
6. **No comunes:** Rechaza passwords, 123456, qwerty, etc.

**Archivo de validación:** `cafeteria-backend/src/shared/utils/password.util.js`

---

## 📝 Notas de Seguridad

- ⚠️ Estas contraseñas son SOLO para ambiente de prueba/desarrollo
- ⚠️ NUNCA uses estas contraseñas en producción
- ⚠️ En producción, cada usuario debe crear su propia contraseña única
- ✅ El sistema usa bcrypt con 12 salt rounds para hashear contraseñas
- ✅ Las contraseñas nunca se almacenan en texto plano
- ✅ Las contraseñas no aparecen en logs

---

## 🔗 Documentación Relacionada

- **API Endpoints:** `docs-dev/API_ENDPOINTS.md`
- **Errores de Integración:** `docs-dev/ERRORES_INTEGRACION.md`
- **Guía de Verificación:** `docs/GUIA_VERIFICACION_PUNTO_7.md`
- **Correcciones Aplicadas:** `docs-dev/CORRECCIONES_APLICADAS.md`

---

**Última actualización:** 10 de noviembre de 2025
