# 🚀 Guía Rápida de Inicio

## ⚠️ IMPORTANTE: Instalar Software Primero

Antes de ejecutar cualquier comando del proyecto, **DEBES** instalar:

1. ✅ Xcode Command Line Tools
2. ✅ Homebrew
3. ✅ Node.js 20+ (para backend y frontend)
4. ✅ MySQL 8+ (para backend)

---

## 📋 Pasos de Instalación Completos

### PASO 1: Instalar Xcode Command Line Tools

```bash
xcode-select --install
```

Espera a que termine la instalación (10-30 minutos).

**Verificar:**
```bash
xcode-select -p
# Debe mostrar: /Library/Developer/CommandLineTools
```

---

### PASO 2: Instalar Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**IMPORTANTE**: Al finalizar, ejecuta los comandos que aparecen en pantalla para agregar Homebrew al PATH:

```bash
# Para Apple Silicon (M1/M2/M3)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Para Intel Macs
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

**Verificar:**
```bash
brew --version
```

---

### PASO 3: Instalar Node.js

```bash
brew install node@20
```

**Agregar al PATH:**
```bash
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Verificar:**
```bash
node --version  # Debe mostrar v20.x.x
npm --version   # Debe mostrar 10.x.x
```

---

### PASO 4: Instalar MySQL

```bash
brew install mysql@8.0
brew services start mysql@8.0
```

**Agregar al PATH:**
```bash
echo 'export PATH="/opt/homebrew/opt/mysql@8.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Configurar seguridad:**
```bash
mysql_secure_installation
```

Responde:
- Establecer contraseña de root: **SÍ** (anótala)
- Eliminar usuarios anónimos: **Y**
- No permitir login root remoto: **Y**
- Eliminar base de datos de prueba: **Y**
- Recargar tablas de privilegios: **Y**

**Verificar:**
```bash
mysql --version  # Debe mostrar 8.0.x
```

---

### PASO 5: Crear Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p
```

Ejecuta estos comandos en MySQL:

```sql
CREATE DATABASE cafedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'cafeapp'@'localhost' IDENTIFIED BY 'cafe_secure_2024';

GRANT ALL PRIVILEGES ON cafedb.* TO 'cafeapp'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

**Probar conexión:**
```bash
mysql -u cafeapp -p cafedb
# Contraseña: cafe_secure_2024
# Si entras sin errores, ¡funciona!
# Escribe EXIT; para salir
```

---

## 🔧 Configuración del Proyecto

### PASO 6: Configurar Backend

```bash
# Navegar al backend
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-backend

# Instalar dependencias Node.js
npm install
```

### PASO 7: Configurar Frontend

```bash
# Navegar al frontend
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-frontend

# Inicializar proyecto React con Vite
npm create vite@latest . -- --template react

# Instalar dependencias base
npm install

# Instalar dependencias de seguridad
npm install axios js-cookie dompurify uuid react-router-dom

# Crear archivo .env.local
echo 'VITE_API_URL=https://localhost:3443' > .env.local
```

### PASO 8: Configurar Variables de Entorno del Backend

```bash
# Navegar al backend
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-backend

# Copiar ejemplo
cp .env.example .env
```

**Editar el archivo `.env`:**

```bash
nano .env
```

**IMPORTANTE**: Cambia estos valores:

```env
# Genera secretos seguros usando:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

JWT_SECRET=<genera_un_secreto_de_64_caracteres>
CSRF_SECRET=<genera_otro_secreto_de_64_caracteres>
```

**Generar secretos:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y pégalo en `JWT_SECRET`, luego repite para `CSRF_SECRET`.

Guarda y cierra (Ctrl+X, luego Y, luego Enter).

---

### PASO 9: Generar Certificados SSL (Backend)

```bash
# Desde cafeteria-backend/
mkdir -p cert
openssl req -x509 -newkey rsa:4096 -keyout cert/key.pem -out cert/cert.pem -days 365 -nodes -subj "/CN=localhost"
```

---

### PASO 10: Ejecutar Migraciones (Backend)

```bash
# Desde cafeteria-backend/
npm run migrate
```

Deberías ver:
```
✅ Migration executed: 001_create_roles_table.sql
✅ Migration executed: 002_create_users_table.sql
...
✅ All migrations completed successfully
✅ Seed executed: 001_seed_roles.sql
✅ Seed executed: 002_seed_admin_user.sql
```

---

### PASO 11: Inicializar Git (Opcional)

```bash
# Navegar a la raíz del monorepo
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria

# Inicializar Git
git init
git add .
git commit -m "Initial commit: Clean architecture setup with frontend and backend"

# Conectar con GitHub
git remote add origin https://github.com/wilino/cafeteria.git
git branch -M main
git push -u origin main
```

---

## ✅ Verificación Final

Ejecuta todos estos comandos para confirmar que todo está instalado:

```bash
echo "=== Xcode Tools ==="
xcode-select -p

echo "\n=== Homebrew ==="
brew --version

echo "\n=== Node.js ==="
node --version

echo "\n=== npm ==="
npm --version

echo "\n=== MySQL ==="
mysql --version

echo "\n=== OpenSSL ==="
openssl version

echo "\n=== Git ==="
git --version

echo "\n=== Backend Dependencies ==="
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-backend
npm list --depth=0

echo "\n=== Frontend Dependencies ==="
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-frontend
npm list --depth=0
```

---

## 🎯 Iniciar el Proyecto

### Backend (API)

```bash
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-backend
npm run dev
```

Deberías ver:
```
✅ Database connection established
HTTPS server running on https://localhost:3443
```

### Frontend (React)

En otra terminal:

```bash
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-frontend
npm run dev
```

Deberías ver:
```
VITE v5.x.x ready in xxx ms

➜  Local:   https://localhost:5173/
➜  Network: use --host to expose
```

Ahora puedes abrir:
- **Backend API**: https://localhost:3443
- **Frontend**: https://localhost:5173

---

## 🐛 Solución de Problemas

### Error: "command not found: brew"
**Solución**: Ejecuta los comandos de configuración de PATH después de instalar Homebrew y reinicia la terminal.

### Error: "command not found: node"
**Solución**: 
```bash
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Error: "command not found: mysql"
**Solución**:
```bash
echo 'export PATH="/opt/homebrew/opt/mysql@8.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Error: "Database connection failed"
**Solución**:
1. Verifica que MySQL esté corriendo: `brew services list`
2. Si no está activo: `brew services start mysql@8.0`
3. Verifica credenciales en `.env` del backend

### Error: "Cannot find module" (Backend)
**Solución**:
```bash
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Cannot find module" (Frontend)
**Solución**:
```bash
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria/cafeteria-frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: "CORS" en Frontend
**Solución**: Asegúrate de que el backend esté corriendo en `https://localhost:3443` y que el frontend tenga `VITE_API_URL=https://localhost:3443` en `.env.local`.

---

## 📚 Recursos Adicionales

- **[README Principal](../README.md)** - Documentación del monorepo
- **[Backend README](../cafeteria-backend/README.md)** - Documentación del API
- **[Frontend README](../cafeteria-frontend/README.md)** - Documentación de React
- **[PLAN_DESARROLLO_CLEAN_CODE.md](./PLAN_DESARROLLO_CLEAN_CODE.md)** - Arquitectura completa
- **[INSTALACION_SOFTWARE.md](./INSTALACION_SOFTWARE.md)** - Guía detallada de instalación
- **[RESUMEN_PROYECTO.md](./RESUMEN_PROYECTO.md)** - Resumen del proyecto
- **[INDICE_DOCUMENTACION.md](./INDICE_DOCUMENTACION.md)** - Índice completo

---

## 🎓 Usuario Admin por Defecto

Después de ejecutar las migraciones del backend, tendrás un usuario admin:

- **Email**: `admin@cafeteria.com`
- **Password**: `Admin123!`

**IMPORTANTE**: Cambia esta contraseña en producción.

---

## ⏱️ Tiempo Total Estimado

- Instalación de software: **30-60 minutos**
- Configuración del backend: **10-15 minutos**
- Configuración del frontend: **5-10 minutos**
- **Total**: **45-85 minutos**

---

## ✅ Checklist de Instalación

### Software Base
- [ ] Xcode Command Line Tools instalado
- [ ] Homebrew instalado y en PATH
- [ ] Node.js 20+ instalado y en PATH
- [ ] npm funcionando
- [ ] MySQL 8+ instalado y corriendo

### Backend
- [ ] Base de datos `cafedb` creada
- [ ] Usuario `cafeapp` creado con permisos
- [ ] Dependencias backend instaladas (`npm install`)
- [ ] Archivo `.env` configurado en backend
- [ ] Secretos JWT y CSRF generados
- [ ] Certificados SSL generados en `cert/`
- [ ] Migraciones ejecutadas exitosamente
- [ ] Backend corriendo en `https://localhost:3443`

### Frontend
- [ ] Proyecto Vite + React inicializado
- [ ] Dependencias frontend instaladas (`npm install`)
- [ ] Dependencias de seguridad instaladas (axios, dompurify, etc.)
- [ ] Archivo `.env.local` creado con `VITE_API_URL`
- [ ] Frontend corriendo en `https://localhost:5173`

### Git (Opcional)
- [ ] Git inicializado en monorepo
- [ ] Repositorio conectado con GitHub

---

**Fecha de creación:** 9 de noviembre de 2025  
**Última actualización:** 9 de noviembre de 2025  
**Estado:** Lista para usar ✅
