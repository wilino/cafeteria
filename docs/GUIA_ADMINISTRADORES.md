# 👑 Guía para Administradores

Guía completa para administradores del Sistema de Cafetería.

## 🎯 Permisos de Administrador

Como administrador tienes acceso COMPLETO:
- ✅ **Todo lo que pueden empleados** (pedidos, inventario, menú)
- ✅ **Gestión de usuarios** (crear, editar, eliminar)
- ✅ **Cambiar contraseñas** de cualquier usuario
- ✅ **Asignar roles** (Cliente, Empleado, Admin)
- ✅ **Acceso a logs** del sistema
- ✅ **Configuración** del sistema

## 👥 Gestión de Usuarios

### Ver Todos los Usuarios
1. Ve a **Usuarios** (solo visible para admin)
2. Verás lista completa con:
   - ID, Nombre, Email, Rol, Estado MFA

### Crear Nuevo Usuario

1. Haz clic en **Nuevo Usuario**
2. Completa el formulario:
   - **Nombre:** Nombre completo
   - **Email:** Email único (no puede estar registrado)
   - **Contraseña:** Mínimo 8 caracteres
   - **Rol:** Selecciona según necesidad
     - **Cliente:** Solo pedidos
     - **Empleado:** Pedidos + Inventario + Menú
     - **Admin:** Acceso completo
3. Haz clic en **Guardar**

💡 **Consejo:** Proporciona al usuario su email y contraseña inicial. Recomienda que la cambien al primer inicio de sesión.

### Editar Usuario

1. Haz clic en el icono de lápiz ✏️
2. Puedes modificar:
   - Nombre
   - Email
   - Rol
   - Contraseña (opcional, dejar vacío para no cambiar)
3. Haz clic en **Guardar**

### Cambiar Contraseña de Usuario

1. Haz clic en el icono de candado 🔒
2. Ingresa la nueva contraseña
3. Haz clic en **Cambiar**

⚠️ **Importante:** Comunica la nueva contraseña al usuario de forma segura.

### Eliminar Usuario

1. Haz clic en el icono de basura 🗑️
2. Lee la advertencia
3. Confirma la eliminación

⚠️ **Advertencia:** 
- Esta acción NO se puede deshacer
- Los pedidos del usuario permanecen en el sistema
- Se recomienda desactivar en vez de eliminar (próxima versión)

## 🔒 Seguridad del Sistema

### Gestión de MFA

**Ver Estado MFA de Usuarios**
- En la lista de usuarios, columna "MFA"
- **Activado** 🟢 = MFA configurado
- **Desactivado** ⚪ = MFA no configurado

**Desactivar MFA de un Usuario**
- Actualmente no hay interfaz directa
- Contacta a soporte técnico con el ID del usuario
- Usa: `UPDATE users SET mfa_enabled = 0, mfa_secret = NULL WHERE id = ?`

⚠️ Solo en casos de emergencia (usuario perdió acceso)

### Auditoría

El sistema registra automáticamente:
- Inicios de sesión
- Cambios en usuarios
- Creación/modificación/eliminación de datos
- Accesos denegados

**Acceder a logs:**
```bash
cd cafeteria-backend
tail -f logs/app.log
```

### Políticas de Contraseñas

**Requisitos actuales:**
- Mínimo 8 caracteres
- Sin otros requisitos obligatorios

**Recomendaciones para usuarios:**
- Mínimo 12 caracteres
- Mezcla de mayúsculas, minúsculas, números y símbolos
- No reutilizar contraseñas
- Activar MFA

## 🛠️ Configuración del Sistema

### Variables de Entorno (Backend)

Archivo: `cafeteria-backend/.env`

```env
# Base de Datos
DB_HOST=localhost
DB_USER=cafeapp
DB_PASSWORD=tu_contraseña
DB_NAME=cafedb
DB_PORT=3306

# JWT
JWT_SECRET=tu_secreto_muy_seguro
JWT_EXPIRES_IN=1h

# Servidor
NODE_ENV=production
PORT=3000
HTTPS_PORT=3443

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Variables de Entorno (Frontend)

Archivo: `cafeteria-frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

### Base de Datos

**Conexión:**
```bash
mysql -u cafeapp -p cafedb
```

**Backup:**
```bash
mysqldump -u cafeapp -p cafedb > backup_$(date +%Y%m%d).sql
```

**Restaurar:**
```bash
mysql -u cafeapp -p cafedb < backup_20251109.sql
```

## 📊 Monitoreo del Sistema

### Dashboard de Admin

Tu dashboard muestra:
- Total de usuarios (todos los roles)
- Items en menú
- Ingredientes totales
- Pedidos totales
- Alertas de stock bajo

### Verificar Estado de Servicios

```bash
# Backend
lsof -i :3000

# Frontend
lsof -i :5173

# MySQL
mysqladmin -u root -p ping
```

### Logs del Sistema

```bash
# Backend logs
cd cafeteria-backend
tail -f logs/app.log           # Todos los logs
tail -f logs/error.log         # Solo errores

# Acceso denegado
grep "Access denied" logs/app.log

# Inicios de sesión
grep "Login successful" logs/app.log
```

## 🚀 Operaciones Comunes

### Reiniciar Sistema

```bash
# Backend
cd cafeteria-backend
pm2 restart all
# O si usas npm
pkill -f "node src/server.js"
npm run dev

# Frontend
cd cafeteria-frontend
pkill -f "vite"
npm run dev
```

### Actualizar Sistema

```bash
cd cafeteria
git pull origin main

# Backend
cd cafeteria-backend
npm install
npm run migrate

# Frontend
cd cafeteria-frontend
npm install
```

### Ejecutar Migraciones

```bash
cd cafeteria-backend
npm run migrate
```

### Sembrar Datos Iniciales

```bash
npm run seed
```

## 👥 Gestión de Roles

### Estructura de Roles

**Cliente (rol: "cliente")**
- Permisos: 4
- Ver menú, crear pedidos, ver propios pedidos, editar perfil

**Empleado (rol: "empleado")**
- Permisos: 12
- Todo lo de cliente + gestionar pedidos, inventario y menú

**Admin (rol: "admin")**
- Permisos: 13
- Todo lo de empleado + gestión de usuarios

### Cambiar Rol de Usuario

1. Ve a **Usuarios**
2. Haz clic en editar ✏️
3. Cambia el **Rol** en el dropdown
4. Guarda cambios

⚠️ El cambio es inmediato. El usuario verá nuevas opciones al refrescar.

## 🔧 Mantenimiento

### Tareas Diarias
- ✅ Revisar logs de errores
- ✅ Verificar alertas de stock
- ✅ Monitorear pedidos acumulados

### Tareas Semanales
- ✅ Backup de base de datos
- ✅ Revisar usuarios inactivos
- ✅ Limpiar logs antiguos
- ✅ Actualizar dependencias (npm audit)

### Tareas Mensuales
- ✅ Auditoría de seguridad
- ✅ Revisión de permisos de usuarios
- ✅ Análisis de uso del sistema
- ✅ Actualización del sistema

## 🆘 Resolución de Problemas

### Usuario No Puede Iniciar Sesión

1. Verifica que el email exista:
   ```sql
   SELECT * FROM users WHERE email = 'usuario@ejemplo.com';
   ```

2. Restablece contraseña:
   - Desde interfaz: Usuarios → Candado 🔒
   - O directo en BD (contraseña hasheada con bcrypt)

3. Si tiene MFA:
   - Desactiva MFA temporalmente si perdió acceso

### Sistema Lento

1. Verifica recursos del servidor:
   ```bash
   top
   df -h
   ```

2. Revisa logs de errores
3. Reinicia servicios
4. Considera aumentar recursos

### Errores de Base de Datos

1. Verifica conexión:
   ```bash
   mysql -u cafeapp -p
   ```

2. Verifica integridad:
   ```bash
   mysqlcheck -u cafeapp -p cafedb --auto-repair
   ```

3. Restaura backup si es necesario

## 📞 Soporte Técnico

Como admin, eres el primer nivel de soporte. Si necesitas ayuda:

- **Documentación:** [Todas las guías](./README.md)
- **Issues GitHub:** https://github.com/wilino/cafeteria/issues
- **Email:** soporte@cafe.com

## 🔐 Mejores Prácticas de Seguridad

### Para el Sistema
- ✅ Mantén software actualizado
- ✅ Backups automáticos regulares
- ✅ Monitorea logs de seguridad
- ✅ Usa HTTPS en producción
- ✅ Firewall configurado
- ✅ Passwords de BD fuertes

### Para Usuarios
- ✅ Fuerza MFA para empleados y admins
- ✅ Política de contraseñas fuertes
- ✅ Revoca acceso de usuarios inactivos
- ✅ Audita permisos regularmente
- ✅ Capacita sobre seguridad

## 📚 Recursos Adicionales

- [Manual Completo](./MANUAL_USUARIO.md)
- [Guía de Empleados](./GUIA_EMPLEADOS.md)
- [Guía de Clientes](./GUIA_CLIENTES.md)
- [Configuración MFA](./CONFIGURACION_MFA.md)
- [Solución de Problemas](./SOLUCION_PROBLEMAS.md)
- [FAQ](./FAQ.md)

---

**Última actualización:** 9 de noviembre de 2025
