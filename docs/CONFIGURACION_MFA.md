# 🔒 Configuración de Autenticación Multifactor (MFA)

La autenticación multifactor (MFA) agrega una capa adicional de seguridad a tu cuenta al requerir dos formas de verificación: tu contraseña y un código temporal generado por una aplicación en tu teléfono.

## 📱 Aplicaciones Autenticadoras Recomendadas

Antes de comenzar, descarga una de estas aplicaciones en tu teléfono:

### iOS
- **Google Authenticator** - [Descargar](https://apps.apple.com/app/google-authenticator/id388497605)
- **Microsoft Authenticator** - [Descargar](https://apps.apple.com/app/microsoft-authenticator/id983156458)
- **Authy** - [Descargar](https://apps.apple.com/app/authy/id494168017)

### Android
- **Google Authenticator** - [Descargar](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)
- **Microsoft Authenticator** - [Descargar](https://play.google.com/store/apps/details?id=com.azure.authenticator)
- **Authy** - [Descargar](https://play.google.com/store/apps/details?id=com.authy.authy)

## 🚀 Activar MFA

### Paso 1: Acceder a la Configuración

1. Inicia sesión en el sistema
2. Haz clic en tu nombre en la esquina superior derecha
3. Selecciona **Mi Perfil**
4. Haz clic en el botón **Configurar MFA**

### Paso 2: Generar Código QR

1. Haz clic en **Comenzar Configuración**
2. Se generará un código QR en la pantalla
3. Mantén esta ventana abierta

### Paso 3: Escanear el Código

1. Abre tu aplicación autenticadora en el teléfono
2. Busca la opción **Agregar cuenta** o el icono **+**
3. Selecciona **Escanear código QR**
4. Apunta la cámara al código QR en la pantalla

#### Opción Alternativa: Código Manual

Si no puedes escanear el código:

1. Haz clic en **O ingresa este código manualmente**
2. Copia el código mostrado
3. En tu app autenticadora, selecciona **Ingresar código manual**
4. Pega el código copiado
5. Nombre de la cuenta: "Cafetería - tu_email"

### Paso 4: Verificar

1. Tu app autenticadora mostrará un código de 6 dígitos
2. Ingresa este código en el campo **Código de Verificación**
3. Haz clic en **Verificar y Activar**

✅ Si el código es correcto, MFA se activará

### Paso 5: Guardar Códigos de Respaldo

**⚠️ MUY IMPORTANTE**

1. Se mostrarán 10 códigos de respaldo
2. **Guárdalos en un lugar seguro** (no en tu teléfono)
3. Opciones recomendadas:
   - Anotarlos en papel y guardarlos en un lugar seguro
   - Guardarlos en un gestor de contraseñas
   - Hacer clic en **Copiar Todos los Códigos** y guardarlos en un archivo cifrado

⚠️ **Cada código solo puede usarse una vez**

## 🔑 Iniciar Sesión con MFA

Una vez activado MFA, el proceso de inicio de sesión cambia:

### Paso 1: Credenciales Normales

1. Ingresa tu email
2. Ingresa tu contraseña
3. Haz clic en **Iniciar Sesión**

### Paso 2: Código MFA

1. Se mostrará un campo adicional: **Código MFA**
2. Abre tu aplicación autenticadora
3. Busca la cuenta "Cafetería"
4. Ingresa el código de 6 dígitos mostrado
5. Haz clic en **Iniciar Sesión**

💡 **Consejo:** El código cambia cada 30 segundos. Si expira, usa el nuevo código.

## 🆘 ¿Perdiste Acceso a tu Aplicación?

### Opción 1: Usar Códigos de Respaldo

1. En la pantalla de inicio de sesión, ingresa tu email y contraseña
2. En el campo **Código MFA**, ingresa uno de tus códigos de respaldo
3. ⚠️ Recuerda: cada código solo funciona una vez

### Opción 2: Contactar Administrador

Si no tienes códigos de respaldo disponibles:

1. Contacta al administrador del sistema
2. Proporciona tu información de usuario
3. El administrador puede desactivar MFA temporalmente
4. Inicia sesión y vuelve a configurar MFA

## 🔄 Desactivar MFA

Si necesitas desactivar MFA:

1. Ve a **Configurar MFA** (mismo lugar donde lo activaste)
2. Verás el estado: **MFA Activo** 🟢
3. Haz clic en **Desactivar MFA**
4. Ingresa un código de tu aplicación o un código de respaldo
5. Confirma la desactivación

⚠️ **Advertencia:** Desactivar MFA reduce la seguridad de tu cuenta

## 📱 Cambiar de Teléfono

Si cambias de teléfono o app autenticadora:

1. **Antes** de cambiar:
   - Guarda tus códigos de respaldo si aún los tienes
   - Considera desactivar MFA temporalmente

2. Después del cambio:
   - Desactiva MFA usando un código de respaldo
   - Configura MFA nuevamente con tu nuevo dispositivo

## 🛡️ Buenas Prácticas de Seguridad

### ✅ Recomendaciones

- **Guarda múltiples copias** de los códigos de respaldo en lugares diferentes
- **No compartas** tus códigos de respaldo con nadie
- **Usa contraseñas fuertes** además de MFA
- **Mantén actualizada** tu aplicación autenticadora
- **No uses capturas de pantalla** de códigos QR (pueden ser hackeadas)

### ❌ Evita

- Guardar códigos de respaldo en el mismo dispositivo que usas para MFA
- Usar la misma app autenticadora en múltiples dispositivos sin sincronización
- Compartir tu pantalla mientras configuras MFA
- Desactivar MFA sin una buena razón

## ❓ Preguntas Frecuentes

**¿Es obligatorio usar MFA?**  
No es obligatorio, pero es **altamente recomendado** para todos los usuarios, especialmente empleados y administradores.

**¿Qué pasa si pierdo mi teléfono?**  
Usa los códigos de respaldo o contacta al administrador.

**¿Puedo usar la misma app para múltiples cuentas?**  
Sí, las apps autenticadoras pueden manejar múltiples cuentas.

**¿El código funciona sin internet?**  
Sí, los códigos se generan localmente en tu dispositivo.

**¿Cuánto tiempo es válido un código?**  
Cada código es válido por 30 segundos.

**¿Puedo configurar MFA en múltiples dispositivos?**  
Sí, escanea el mismo código QR en todos tus dispositivos durante la configuración inicial.

## 🆘 Problemas Comunes

### "Código incorrecto"

**Causas posibles:**
- El código expiró (espera el siguiente)
- Hora del teléfono desincronizada
- App autenticadora incorrecta

**Solución:**
1. Verifica que la hora de tu teléfono esté correcta
2. Asegúrate de estar usando la app correcta
3. Espera al siguiente código (30 segundos)

### "No puedo escanear el código QR"

**Solución:**
- Usa la opción de código manual
- Aumenta el brillo de la pantalla
- Prueba desde una distancia diferente

### "Perdí mis códigos de respaldo"

**Solución:**
1. Si aún tienes acceso:
   - Desactiva y reactiva MFA para generar nuevos códigos
2. Si no tienes acceso:
   - Contacta al administrador del sistema

## 📞 Soporte

Si tienes problemas con MFA, consulta:
- [Solución de Problemas](./SOLUCION_PROBLEMAS.md)
- [Contacto y Soporte](./SOPORTE.md)

---

**Última actualización:** 9 de noviembre de 2025
