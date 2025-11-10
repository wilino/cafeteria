# ❓ Preguntas Frecuentes (FAQ)

Respuestas a las preguntas más comunes sobre el Sistema de Cafetería.

## 🔐 Inicio de Sesión y Cuentas

### ¿Cómo obtengo una cuenta?

**Para clientes:** Puedes registrarte en la página de registro o solicitar que un administrador te cree una cuenta.

**Para empleados/admin:** Solo un administrador puede crear cuentas con estos roles.

### ¿Qué hago si olvidé mi contraseña?

Contacta a un administrador del sistema. Por seguridad, solo ellos pueden restablecer contraseñas.

### ¿Puedo cambiar mi email?

Sí, desde tu perfil puedes actualizar tu email. Ve a **Mi Perfil** → Edita el campo de email → **Guardar Cambios**.

### ¿Es seguro el sistema?

Sí, el sistema implementa múltiples medidas de seguridad:
- Contraseñas encriptadas
- Autenticación JWT
- HTTPS/TLS
- Autenticación multifactor (MFA) opcional
- Protección CSRF
- Rate limiting

## 🍽️ Pedidos

### ¿Puedo editar un pedido después de realizarlo?

No, una vez confirmado el pedido no puede editarse. Si necesitas modificarlo, contacta a un empleado para que lo cancele y crea uno nuevo.

### ¿Puedo cancelar mi pedido?

Los clientes no pueden cancelar pedidos directamente. Contacta a un empleado o administrador para cancelaciones.

### ¿Cuánto tiempo tarda un pedido?

El tiempo depende de la complejidad del pedido. Puedes ver el estado en tiempo real en la sección **Pedidos**.

### ¿Qué significan los estados del pedido?

- **Pendiente** 🟡 - Recibido, esperando preparación
- **En Preparación** 🔵 - Se está preparando tu pedido
- **Listo** 🟢 - Tu pedido está listo para recoger
- **Entregado** ⚪ - Ya fue entregado
- **Cancelado** 🔴 - El pedido fue cancelado

### ¿Puedo ver mis pedidos anteriores?

Sí, en la sección **Pedidos** puedes ver todo tu historial de pedidos.

### ¿Hay un límite de items por pedido?

No hay un límite establecido, pero se recomienda ser razonable.

## 📋 Menú

### ¿El menú se actualiza automáticamente?

Sí, los empleados y administradores pueden agregar, editar o eliminar items del menú en cualquier momento.

### ¿Por qué un item dice "No Disponible"?

Puede ser por:
- Stock insuficiente de ingredientes
- El item fue desactivado temporalmente
- Mantenimiento del item

### ¿Puedo sugerir nuevos items para el menú?

Contacta a un empleado o administrador con tus sugerencias.

## 📦 Inventario (Empleados/Admin)

### ¿Cómo funciona la alerta de stock bajo?

Cada ingrediente tiene una "cantidad mínima" configurada. Cuando el stock cae por debajo de ese número, aparece una alerta.

### ¿Puedo ver el historial de cambios de inventario?

Actualmente no hay un historial visible, pero los administradores pueden consultar los logs del sistema.

### ¿Qué son las unidades de medida?

Son las unidades en las que se mide cada ingrediente:
- **kg** - Kilogramos
- **g** - Gramos
- **L** - Litros
- **ml** - Mililitros
- **unidad** - Unidades individuales (ej: huevos, tomates)

### ¿Cómo actualizo el stock?

1. Ve a **Inventario**
2. Haz clic en el icono de inventario (📦) junto al ingrediente
3. Ingresa la nueva cantidad **total** (no la cantidad a agregar)
4. Haz clic en **Actualizar**

## 👥 Usuarios (Admin)

### ¿Puedo cambiar el rol de un usuario?

Sí, edita el usuario y cambia el rol en el dropdown.

### ¿Qué pasa si elimino un usuario?

- Se elimina la cuenta permanentemente
- Los pedidos previos del usuario permanecen en el sistema
- ⚠️ Esta acción **no se puede deshacer**

### ¿Puedo ver la actividad de los usuarios?

Los administradores tienen acceso a logs del sistema que registran acciones importantes.

## 🔒 Seguridad MFA

### ¿Es obligatorio usar MFA?

No es obligatorio, pero es **altamente recomendado**, especialmente para:
- Administradores
- Empleados
- Cuentas con información sensible

### ¿Qué pasa si pierdo mi teléfono?

Usa los códigos de respaldo que guardaste al configurar MFA. Si no los tienes, contacta al administrador.

### ¿Puedo usar MFA en múltiples dispositivos?

Sí, durante la configuración inicial puedes escanear el código QR en todos tus dispositivos.

📖 Más información: [Configuración MFA](./CONFIGURACION_MFA.md)

## 🖥️ Técnico

### ¿En qué dispositivos funciona el sistema?

El sistema es una aplicación web que funciona en cualquier dispositivo con un navegador moderno:
- Computadoras (Windows, Mac, Linux)
- Tablets
- Teléfonos móviles

### ¿Necesito instalar algo?

No, solo necesitas un navegador web. El sistema funciona completamente en línea.

### ¿Funciona sin internet?

No, necesitas conexión a internet para usar el sistema.

### ¿Hay una app móvil?

Actualmente no hay una app nativa, pero el sistema web es responsive y funciona bien en móviles.

### ¿Qué navegadores son compatibles?

- Chrome (recomendado)
- Firefox
- Safari
- Edge
- Opera

Versiones recientes (últimos 2 años).

## 💾 Datos

### ¿Mis datos están seguros?

Sí, todos los datos están:
- Encriptados en tránsito (HTTPS)
- Almacenados en una base de datos segura
- Protegidos contra accesos no autorizados

### ¿Se hace backup de los datos?

Consulta con tu administrador sobre las políticas de backup del sistema.

### ¿Puedo exportar mis datos?

Actualmente no hay una función de exportación automática. Contacta al administrador si necesitas tus datos.

## 🛠️ Problemas Técnicos

### El sistema está lento

**Posibles causas:**
- Conexión a internet lenta
- Muchos usuarios simultáneos
- Problema con el servidor

**Solución:** Consulta [Solución de Problemas](./SOLUCION_PROBLEMAS.md)

### No puedo iniciar sesión

**Verifica:**
1. Email y contraseña correctos
2. Si tienes MFA, el código no ha expirado
3. CAPS LOCK no está activado
4. Conexión a internet funciona

**Si persiste:** Consulta [Solución de Problemas](./SOLUCION_PROBLEMAS.md)

### Veo un error 404

Verifica que estés usando la URL correcta: `http://localhost:5173` (desarrollo) o la URL de producción proporcionada.

### Los cambios no se reflejan

1. Refresca la página (F5 o Cmd+R)
2. Limpia la caché del navegador
3. Cierra sesión y vuelve a entrar

## 📞 Soporte

### ¿Cómo obtengo ayuda?

1. Consulta esta FAQ
2. Revisa el [Manual de Usuario](./MANUAL_USUARIO.md)
3. Consulta [Solución de Problemas](./SOLUCION_PROBLEMAS.md)
4. Contacta al [Soporte](./SOPORTE.md)

### ¿Puedo reportar bugs o sugerir mejoras?

Sí, contacta al equipo de desarrollo a través de los canales de soporte.

---

¿No encontraste tu pregunta? Consulta el [Soporte](./SOPORTE.md)

**Última actualización:** 9 de noviembre de 2025
