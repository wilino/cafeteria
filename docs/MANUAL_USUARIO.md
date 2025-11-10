# 📖 Manual de Usuario

Guía completa para usar el Sistema de Cafetería.

## 🔐 Inicio de Sesión

### Primera Vez

1. Abre tu navegador en `http://localhost:5173`
2. Verás la pantalla de inicio de sesión
3. Ingresa tu email y contraseña
4. Si tienes MFA activado, ingresa el código de 6 dígitos

### ¿Olvidaste tu contraseña?

Contacta a un administrador para que restablezca tu contraseña.

## 🏠 Panel de Control (Dashboard)

Después de iniciar sesión, verás el panel principal con:

### Para Clientes
- Total de items disponibles en el menú
- Cantidad de pedidos que has realizado

### Para Empleados y Administradores
- Total de usuarios registrados
- Items en el menú
- Ingredientes en inventario
- Pedidos totales
- Alertas de stock bajo (si hay ingredientes con inventario crítico)

## 🍽️ Menú

### Ver el Menú (Todos los roles)

1. Haz clic en **Menú** en el menú lateral
2. Verás todos los items disponibles con:
   - Nombre del producto
   - Descripción
   - Precio

### Realizar un Pedido (Clientes)

1. Navega al **Menú**
2. Haz clic en **Agregar** en los items que desees
3. Verás un icono de carrito flotante con la cantidad de items
4. Haz clic en el carrito para revisar tu pedido
5. Ajusta las cantidades usando los botones **+** y **-**
6. Haz clic en **Realizar Pedido**
7. Recibirás un número de pedido
8. Puedes ver el estado en **Pedidos**

### Gestionar Items del Menú (Empleados y Admin)

1. En la página de **Menú**, haz clic en **Agregar Item**
2. Completa el formulario:
   - Nombre del item
   - Descripción (opcional)
   - Precio
3. Haz clic en **Guardar**

Para **editar** un item:
- Haz clic en el icono de lápiz (✏️)
- Modifica los campos
- Guarda los cambios

Para **eliminar** un item:
- Haz clic en el icono de basura (🗑️)
- Confirma la eliminación

## 📦 Pedidos

### Ver Mis Pedidos (Clientes)

1. Ve a **Pedidos**
2. Verás una lista con todos tus pedidos
3. Haz clic en la flecha (▼) para ver los detalles:
   - Items del pedido
   - Cantidades
   - Precio total

### Estados de Pedido

- **Pendiente** 🟡 - El pedido fue creado
- **En Preparación** 🔵 - Se está preparando
- **Listo** 🟢 - Está listo para recoger
- **Entregado** ⚪ - Ya fue entregado
- **Cancelado** 🔴 - El pedido fue cancelado

### Gestionar Pedidos (Empleados y Admin)

1. Ve a **Pedidos**
2. Verás todos los pedidos del sistema
3. Para cambiar el estado:
   - Expande el pedido
   - Selecciona el nuevo estado en el dropdown
   - Haz clic en **Actualizar**

4. Para cancelar un pedido pendiente:
   - Haz clic en **Cancelar**
   - Confirma la acción

## 📊 Inventario (Solo Empleados y Admin)

### Ver Ingredientes

1. Ve a **Inventario**
2. Verás todos los ingredientes con:
   - Nombre
   - Cantidad actual
   - Unidad de medida (kg, g, L, ml, etc.)
   - Estado (Normal o Stock Bajo)

### Agregar Ingrediente

1. Haz clic en **Agregar Ingrediente**
2. Completa:
   - Nombre
   - Cantidad inicial
   - Unidad
   - Cantidad mínima (para alertas)
3. Haz clic en **Guardar**

### Actualizar Stock

1. Haz clic en el icono de inventario (📦) junto al ingrediente
2. Ingresa la **nueva cantidad total**
3. Haz clic en **Actualizar**

### Alertas de Stock Bajo

Si un ingrediente está por debajo de la cantidad mínima:
- Aparecerá con una etiqueta **Stock Bajo** 🟡
- Se mostrará una alerta en la parte superior
- También aparecerá en el dashboard

## 👥 Usuarios (Solo Admin)

### Ver Usuarios

1. Ve a **Usuarios**
2. Verás la lista completa con:
   - ID
   - Nombre
   - Email
   - Rol
   - Estado de MFA

### Crear Usuario

1. Haz clic en **Nuevo Usuario**
2. Completa:
   - Nombre
   - Email
   - Contraseña
   - Rol (Cliente, Empleado o Admin)
3. Haz clic en **Guardar**

### Cambiar Contraseña de Usuario

1. Haz clic en el icono de candado (🔒)
2. Ingresa la nueva contraseña
3. Haz clic en **Cambiar**

### Eliminar Usuario

1. Haz clic en el icono de basura (🗑️)
2. Confirma la eliminación

⚠️ **Advertencia:** Esta acción no se puede deshacer

## 👤 Mi Perfil

### Editar Información Personal

1. Haz clic en tu nombre en la esquina superior derecha
2. Selecciona **Mi Perfil**
3. Edita tu nombre o email
4. Haz clic en **Guardar Cambios**

### Cambiar Contraseña

1. En **Mi Perfil**, haz clic en **Cambiar Contraseña**
2. Ingresa tu nueva contraseña
3. Confírmala
4. Haz clic en **Cambiar**

### Configurar MFA

1. En **Mi Perfil**, haz clic en **Configurar MFA**
2. Sigue el asistente de 3 pasos
3. Guarda los códigos de respaldo

📖 Guía completa: [Configuración MFA](./CONFIGURACION_MFA.md)

## 🚪 Cerrar Sesión

1. Haz clic en tu nombre en la esquina superior derecha
2. Selecciona **Cerrar Sesión**

---

## 🎯 Atajos de Teclado

Actualmente no hay atajos de teclado configurados. Todas las acciones se realizan mediante clics.

## 💡 Consejos y Trucos

### Para Clientes
- Revisa el menú completo antes de hacer tu pedido
- Puedes modificar las cantidades en el carrito antes de confirmar
- Tus pedidos anteriores están disponibles en la sección Pedidos

### Para Empleados
- Mantén el inventario actualizado para reflejar la disponibilidad real
- Actualiza los estados de los pedidos en tiempo real
- Revisa regularmente las alertas de stock bajo

### Para Administradores
- Activa MFA para todos los usuarios con acceso privilegiado
- Revisa regularmente la actividad del sistema
- Mantén las contraseñas seguras

## ❓ Preguntas Frecuentes

**¿Puedo hacer múltiples pedidos al mismo tiempo?**  
Sí, pero cada pedido debe confirmarse por separado.

**¿Cómo sé si mi pedido está listo?**  
El estado cambiará a "Listo" 🟢 en tu lista de pedidos.

**¿Puedo cancelar un pedido?**  
Solo los empleados y administradores pueden cancelar pedidos.

**¿Qué hago si un ingrediente no está en el inventario?**  
Los empleados o admin pueden agregarlo desde la sección Inventario.

Más preguntas en [FAQ](./FAQ.md)

---

¿Necesitas ayuda? Consulta [Soporte](./SOPORTE.md)
