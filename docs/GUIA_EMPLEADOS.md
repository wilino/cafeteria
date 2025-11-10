# 👨‍💼 Guía para Empleados

Guía completa para empleados del Sistema de Cafetería.

## 🎯 Permisos de Empleado

Como empleado tienes acceso a:
- ✅ Ver y gestionar todos los pedidos
- ✅ Cambiar estados de pedidos
- ✅ Cancelar pedidos
- ✅ Gestionar inventario (ver, agregar, editar)
- ✅ Actualizar stock de ingredientes
- ✅ Gestionar items del menú (CRUD completo)
- ✅ Ver estadísticas del sistema
- ❌ Gestionar usuarios (solo admin)

## 📦 Gestión de Pedidos

### Ver Todos los Pedidos
1. Ve a **Pedidos**
2. Verás TODOS los pedidos del sistema (no solo los tuyos)
3. Cada pedido muestra: ID, Cliente, Estado, Total, Fecha

### Actualizar Estado de Pedido
1. Haz clic en la flecha **▼** para expandir el pedido
2. En la sección de estado, selecciona el nuevo estado:
   - Pendiente → En Preparación
   - En Preparación → Listo
   - Listo → Entregado
3. Haz clic en **Actualizar**

### Cancelar Pedido
1. Solo pedidos con estado **Pendiente** pueden cancelarse
2. Haz clic en **Cancelar**
3. Confirma la acción en el modal

## 📊 Gestión de Inventario

### Ver Ingredientes
- Ve a **Inventario**
- Verás todos los ingredientes con:
  - Nombre
  - Cantidad actual
  - Unidad de medida
  - Estado (Normal o Stock Bajo)

### Agregar Nuevo Ingrediente
1. Haz clic en **Agregar Ingrediente**
2. Completa:
   - Nombre (ej: "Café Molido")
   - Cantidad (ej: 5)
   - Unidad (ej: "kg")
   - Cantidad Mínima (ej: 2) - Para alertas de stock bajo
3. Haz clic en **Guardar**

### Actualizar Stock
**Importante:** Ingresas la cantidad TOTAL, no lo que agregas.

1. Haz clic en el icono de inventario 📦
2. Ingresa la nueva cantidad total
   - Si tenías 5 kg y llegan 10 kg más
   - Ingresa: 15 (no 10)
3. Haz clic en **Actualizar**

### Editar Ingrediente
1. Haz clic en el icono de lápiz ✏️
2. Modifica nombre, cantidad o unidad
3. Haz clic en **Guardar**

### Alertas de Stock Bajo
- Aparece automáticamente cuando: Cantidad < Cantidad Mínima
- Se muestra en:
  - Dashboard (alerta naranja)
  - Inventario (chip de advertencia)
  - Lista de ingredientes

## 🍽️ Gestión del Menú

### Agregar Item al Menú
1. Ve a **Menú**
2. Haz clic en **Agregar Item**
3. Completa:
   - Nombre (ej: "Café Americano")
   - Descripción (opcional, ej: "Café negro tradicional")
   - Precio (ej: 2.50)
4. Haz clic en **Guardar**

### Editar Item
1. Haz clic en el icono de lápiz ✏️ en el item
2. Modifica los campos necesarios
3. Haz clic en **Guardar**

### Eliminar Item
1. Haz clic en el icono de basura 🗑️
2. Confirma la eliminación en el modal

⚠️ **Nota:** Si eliminas un item, no afectará pedidos anteriores

## 📈 Dashboard de Empleado

Tu dashboard muestra:
- **Total de Usuarios** - Usuarios registrados
- **Items en Menú** - Total de productos disponibles
- **Ingredientes** - Total de ingredientes en inventario
- **Pedidos** - Total de pedidos realizados
- **Alertas de Stock** - Ingredientes con stock bajo

## 💡 Flujo de Trabajo Recomendado

### Al Inicio del Turno
1. ✅ Revisa el **Dashboard** para ver estado general
2. ✅ Verifica **alertas de stock bajo**
3. ✅ Revisa **pedidos pendientes**
4. ✅ Actualiza stock si recibiste suministros

### Durante el Turno
1. ✅ Monitorea **Pedidos** regularmente
2. ✅ Actualiza estados conforme preparas
3. ✅ Marca como **Listo** cuando termines
4. ✅ Cambia a **Entregado** cuando entregues

### Al Final del Turno
1. ✅ Actualiza stock de ingredientes usados
2. ✅ Verifica que no haya pedidos pendientes
3. ✅ Revisa items del menú (disponibilidad)

## 🎯 Buenas Prácticas

### Pedidos
✅ Actualiza estados en tiempo real  
✅ No marques como "Listo" hasta que realmente lo esté  
✅ Comunica con el cliente si hay demora  
✅ Cancela pedidos solo con razón válida

### Inventario
✅ Actualiza stock inmediatamente al recibir  
✅ Verifica unidades antes de actualizar  
✅ Reporta ingredientes dañados o vencidos  
✅ Actúa rápido ante alertas de stock bajo

### Menú
✅ Mantén descripciones claras y cortas  
✅ Verifica precios antes de guardar  
✅ Desactiva items sin ingredientes  
✅ Informa cambios importantes

## 🔒 Seguridad

- ✅ **Activa MFA** - Obligatorio para empleados
- ✅ **Usa contraseñas fuertes** - Mínimo 12 caracteres
- ✅ **Cierra sesión** - Al finalizar turno
- ✅ **No compartas credenciales** - Nunca

## ❓ Preguntas Comunes

**¿Puedo eliminar pedidos?**  
No, solo puedes cancelarlos. Los pedidos se mantienen en el sistema.

**¿Puedo crear usuarios?**  
No, solo el administrador puede crear usuarios.

**¿Qué hago si un cliente quiere modificar un pedido?**  
Cancela el pedido actual y ayúdalo a crear uno nuevo.

**¿Cómo reporto un problema técnico?**  
Contacta al administrador o usa el [Soporte](./SOPORTE.md).

## 📚 Más Información

- [Manual de Usuario Completo](./MANUAL_USUARIO.md)
- [Solución de Problemas](./SOLUCION_PROBLEMAS.md)
- [FAQ](./FAQ.md)
- [Soporte](./SOPORTE.md)

---

**Última actualización:** 9 de noviembre de 2025
