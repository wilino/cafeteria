# 🛠️ Solución de Problemas

Guía para resolver los problemas más comunes del Sistema de Cafetería.

## 🔐 Problemas de Inicio de Sesión

### No puedo iniciar sesión

**Síntomas:** Al ingresar credenciales, aparece "Credenciales inválidas"

**Soluciones:**

1. **Verifica tu email y contraseña**
   - Asegúrate de que no hay espacios extra
   - Verifica que CAPS LOCK no esté activado
   - Prueba copiar y pegar el email

2. **Si tienes MFA activado**
   - El código expira cada 30 segundos
   - Usa el código más reciente
   - Si no funciona, usa un código de respaldo

3. **Restablece tu contraseña**
   - Contacta al administrador para que restablezca tu contraseña

### "Token expirado" o "Sesión inválida"

**Causa:** Tu sesión ha expirado (por seguridad, después de cierto tiempo)

**Solución:**
1. Cierra sesión completamente
2. Limpia las cookies del navegador
3. Vuelve a iniciar sesión

### MFA no funciona

**Problema 1: "Código incorrecto"**

**Soluciones:**
- Verifica que la hora de tu teléfono esté sincronizada automáticamente
- Espera al siguiente código (30 segundos)
- Asegúrate de estar viendo la cuenta correcta en la app

**Problema 2: Perdí acceso a la app autenticadora**

**Solución:**
- Usa uno de los 10 códigos de respaldo
- Si no tienes códigos, contacta al administrador

## 🌐 Problemas de Conexión

### "No se puede conectar al servidor"

**Causas posibles:**
- Backend no está corriendo
- Frontend no puede conectar con el backend
- Firewall bloqueando conexiones

**Soluciones:**

1. **Verifica que el backend esté corriendo**
   ```bash
   # Busca procesos de Node.js
   ps aux | grep node
   ```

2. **Verifica las URLs en .env del frontend**
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Reinicia ambos servidores**
   ```bash
   # Backend
   cd cafeteria-backend
   npm run dev
   
   # Frontend (en otra terminal)
   cd cafeteria-frontend
   npm run dev
   ```

### Error 404 - Página no encontrada

**Causa:** URL incorrecta o ruta no existe

**Solución:**
1. Verifica que estés usando la URL correcta: `http://localhost:5173`
2. Si estás en producción, verifica la URL con tu administrador
3. Limpia la caché del navegador

### Error 500 - Error interno del servidor

**Causa:** Problema en el backend

**Soluciones:**
1. Revisa la consola del backend para ver el error específico
2. Verifica que la base de datos esté corriendo
3. Reinicia el backend
4. Contacta al administrador si persiste

## 🛒 Problemas con Pedidos

### No puedo agregar items al carrito

**Causa:** Item marcado como "No Disponible"

**Solución:**
- Contacta a un empleado, el item puede estar desactivado o sin stock

### Mi pedido no aparece

**Soluciones:**
1. Refresca la página (F5 o Cmd+R)
2. Verifica que hayas confirmado el pedido (clic en "Realizar Pedido")
3. Revisa si hay algún mensaje de error

### Error al crear pedido: "Idempotency key already used"

**Causa:** Intentaste crear el mismo pedido dos veces

**Solución:**
- Revisa la sección **Pedidos** - probablemente el pedido sí se creó
- Refresca la página
- Si el pedido no aparece, contacta a un empleado

## 📦 Problemas con Inventario

### No puedo actualizar el stock

**Causa:** Permisos insuficientes o valor inválido

**Soluciones:**
1. Verifica que tienes rol de Empleado o Admin
2. Asegúrate de ingresar un número válido (positivo)
3. No uses comas, solo puntos para decimales (ej: 10.5, no 10,5)

### Alerta de stock bajo no desaparece

**Causa:** La cantidad actual sigue siendo menor a la cantidad mínima

**Solución:**
1. Actualiza el stock del ingrediente
2. O reduce la cantidad mínima en la configuración del ingrediente

## 👥 Problemas con Usuarios (Admin)

### No puedo crear usuarios

**Causas posibles:**
- Email ya está en uso
- Contraseña muy corta (mínimo 8 caracteres)

**Solución:**
1. Verifica que el email no esté registrado
2. Usa una contraseña de al menos 8 caracteres
3. Revisa mensajes de error específicos

### No puedo eliminar un usuario

**Causa:** Puede haber restricciones de integridad (ej: usuario tiene pedidos)

**Solución:**
- Contacta a soporte técnico para eliminar usuarios con datos asociados

## 🖥️ Problemas del Sistema

### El sitio está muy lento

**Causas y Soluciones:**

1. **Internet lento**
   - Verifica tu conexión a internet
   - Prueba abrir otros sitios web

2. **Muchos usuarios simultáneos**
   - Espera unos minutos
   - Contacta al administrador si persiste

3. **Caché del navegador lleno**
   ```
   Chrome: Cmd/Ctrl + Shift + Delete
   Firefox: Cmd/Ctrl + Shift + Delete
   Safari: Cmd + Option + E
   ```

### Cambios no se reflejan

**Solución:**
1. **Refresca la página:** F5 o Cmd+R
2. **Refresco forzado:** Cmd/Ctrl + Shift + R
3. **Limpia caché del navegador**
4. **Cierra sesión y vuelve a entrar**

### Botones o formularios no responden

**Causas:**
- JavaScript deshabilitado
- Extensiones del navegador interfiriendo
- Error en consola

**Soluciones:**
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Desactiva extensiones temporalmente
4. Prueba en modo incógnito
5. Prueba otro navegador

### Diseño roto o elementos mal ubicados

**Causa:** CSS no se cargó correctamente

**Solución:**
1. Refresca la página (F5)
2. Limpia caché del navegador
3. Verifica tu conexión a internet

## 📱 Problemas en Móvil

### El sitio no se ve bien en mi teléfono

**Solución:**
1. Gira el teléfono (orientación horizontal puede funcionar mejor)
2. Usa el zoom del navegador
3. Actualiza tu navegador
4. Reporta el problema al soporte

### No puedo escanear código QR para MFA

**Soluciones:**
1. Aumenta el brillo de la pantalla
2. Prueba desde una distancia diferente
3. Usa la opción de código manual

## 🗄️ Problemas con la Base de Datos

### Error: "Can't connect to MySQL server"

**Causa:** MySQL no está corriendo

**Solución:**
```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
net start MySQL80
```

### Error: "Access denied for user"

**Causa:** Credenciales incorrectas en .env

**Solución:**
1. Verifica el archivo `.env` del backend
2. Confirma usuario, contraseña y nombre de base de datos
3. Recrea el usuario si es necesario:
   ```sql
   DROP USER 'cafeapp'@'localhost';
   CREATE USER 'cafeapp'@'localhost' IDENTIFIED BY 'tu_contraseña';
   GRANT ALL PRIVILEGES ON cafedb.* TO 'cafeapp'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Error: "Table doesn't exist"

**Causa:** Migraciones no ejecutadas

**Solución:**
```bash
cd cafeteria-backend
npm run migrate
```

## 🔍 Herramientas de Diagnóstico

### Ver logs del backend

```bash
cd cafeteria-backend
tail -f logs/app.log
```

### Ver logs del navegador

1. Abre las DevTools (F12)
2. Ve a la pestaña **Console**
3. Busca mensajes de error (en rojo)

### Verificar estado del sistema

```bash
# Backend corriendo?
lsof -i :3000

# Frontend corriendo?
lsof -i :5173

# MySQL corriendo?
mysqladmin -u root -p ping
```

## 📞 ¿Cuándo Contactar Soporte?

Contacta al soporte si:
- ✅ Has intentado las soluciones aquí listadas
- ✅ El problema persiste después de reiniciar
- ✅ Ves errores técnicos que no entiendes
- ✅ Has perdido acceso a tu cuenta
- ✅ Sospechas un problema de seguridad

## 📋 Información Útil para Reportar Problemas

Al contactar soporte, proporciona:

1. **Descripción del problema**
   - ¿Qué estabas intentando hacer?
   - ¿Qué pasó en su lugar?

2. **Información del sistema**
   - Navegador y versión
   - Sistema operativo
   - Si el problema es en móvil o desktop

3. **Pasos para reproducir**
   - Lista los pasos exactos para que ocurra el error

4. **Mensajes de error**
   - Captura de pantalla del error
   - Texto exacto del mensaje de error
   - Cualquier código de error

5. **Tu rol en el sistema**
   - ¿Eres Cliente, Empleado o Admin?

## 🔗 Recursos Adicionales

- [Manual de Usuario](./MANUAL_USUARIO.md)
- [FAQ](./FAQ.md)
- [Configuración MFA](./CONFIGURACION_MFA.md)
- [Contacto y Soporte](./SOPORTE.md)

---

**Última actualización:** 9 de noviembre de 2025
