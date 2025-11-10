# Guía de Instalación de Software Requerido

## Estado Actual del Sistema

✅ **OpenSSL/LibreSSL**: Instalado (LibreSSL 3.3.6)  
✅ **Xcode Command Line Tools**: Instalado  
❌ **Node.js**: No instalado  
❌ **npm**: No instalado  
❌ **MySQL**: No instalado  
❌ **Homebrew**: No instalado (opcional)  
⚠️ **Git**: Incluido con Xcode Command Line Tools

---

## Instalación Paso a Paso

### 1. Instalar Xcode Command Line Tools

Las herramientas de línea de comandos de Xcode son necesarias para Git y otras herramientas de desarrollo.

```bash
xcode-select --install
```

**Acción**: Se abrirá una ventana emergente. Haz clic en "Instalar" y espera a que se complete (puede tardar 10-30 minutos dependiendo de tu conexión).

**Verificar instalación:**
```bash
xcode-select -p
# Debería mostrar: /Library/Developer/CommandLineTools

git --version
# Debería mostrar: git version 2.x.x
```

**Nota**: Xcode Command Line Tools incluye Git automáticamente.

---

### 1.1 Opciones de Instalación de Git (Si necesitas actualizar)

Si necesitas una versión más reciente de Git o prefieres otra opción, puedes instalar Git de estas formas:

#### Opción A: Homebrew (Recomendado para actualizaciones)
```bash
brew install git
```
- ✅ Fácil de actualizar (`brew upgrade git`)
- ✅ Versiones más recientes
- ✅ Gestión centralizada de paquetes

#### Opción B: MacPorts
```bash
sudo port install git
```
- Alternativa a Homebrew
- Requiere MacPorts instalado

#### Opción C: Xcode Command Line Tools (Ya instalado)
```bash
# Ya incluido, no requiere instalación adicional
git --version
```
- ✅ Ya instalado
- ⚠️ Versión puede ser más antigua
- ✅ Oficial de Apple

#### Opción D: Instalador binario oficial
- Descargar desde: https://git-scm.com/download/mac
- Instalador gráfico (.dmg)
- ⚠️ Puede no estar actualizado

#### Opción E: Git GUI (Interfaz gráfica)
Si prefieres usar Git con interfaz gráfica:
```bash
brew install git-gui
```

**Recomendación**: Si ya tienes Xcode Command Line Tools instalado, Git ya funciona. Solo instala vía Homebrew si necesitas la última versión.

**Verificar Git:**
```bash
git --version
git config --list
```

---

### 1.2 Git Bash (Alternativa a Terminal nativa)

**Git Bash** es principalmente una herramienta de Windows. En macOS ya tienes un terminal superior:

#### Terminal nativo de macOS (Recomendado) ✅
- **Zsh** (shell moderno, por defecto en macOS)
- **Bash** (también disponible)
- Integrado con el sistema
- Comandos Unix/Linux nativos

#### Si quieres Git Bash en macOS:
Git Bash NO es necesario en macOS porque:
- ✅ Terminal.app ya tiene Zsh/Bash
- ✅ Git funciona perfectamente en terminal nativo
- ✅ Todos los comandos Unix están disponibles

**Alternativas modernas al Terminal:**
```bash
# iTerm2 (Terminal mejorado)
brew install --cask iterm2

# Oh My Zsh (Framework para Zsh)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

**Conclusión**: En macOS, usa el Terminal nativo con Zsh. No necesitas Git Bash.

---

### 2. Instalar Homebrew (Recomendado)

Homebrew es el gestor de paquetes más popular para macOS. Facilita la instalación de Node.js, MySQL y otras herramientas.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Post-instalación**: Sigue las instrucciones en pantalla para agregar Homebrew a tu PATH. Generalmente es algo como:

```bash
# Para Apple Silicon (M1/M2/M3)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Para Intel Macs
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

**Verificar instalación:**
```bash
brew --version
# Debería mostrar algo como: Homebrew 4.x.x
```

---

### 3. Instalar Node.js y npm

Node.js es el entorno de ejecución de JavaScript que usaremos para el backend.

#### Opción A: Con Homebrew (Recomendado)

```bash
# Instalar Node.js 20 (versión LTS)
brew install node@20

# Agregar a PATH
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Opción B: Instalador oficial (si no usas Homebrew)

1. Ir a https://nodejs.org/
2. Descargar el instalador LTS (v20.x) para macOS
3. Ejecutar el instalador .pkg
4. Seguir las instrucciones en pantalla

**Verificar instalación:**
```bash
node --version
# Debería mostrar: v20.x.x

npm --version
# Debería mostrar: 10.x.x
```

---

### 4. Instalar MySQL 8

MySQL es la base de datos que usaremos para almacenar toda la información.

#### Opción A: Con Homebrew (Recomendado)

```bash
# Instalar MySQL 8
brew install mysql@8.0

# Iniciar servicio de MySQL
brew services start mysql@8.0

# Agregar a PATH
echo 'export PATH="/opt/homebrew/opt/mysql@8.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Opción B: Instalador oficial (si no usas Homebrew)

1. Ir a https://dev.mysql.com/downloads/mysql/
2. Descargar el instalador DMG para macOS
3. Ejecutar el instalador
4. **IMPORTANTE**: Anota la contraseña temporal que aparece al final de la instalación

**Configuración de seguridad:**
```bash
# Ejecutar script de seguridad
mysql_secure_installation

# Seguir las instrucciones:
# - Establecer contraseña de root
# - Eliminar usuarios anónimos: Y
# - No permitir login root remoto: Y
# - Eliminar base de datos de prueba: Y
# - Recargar tablas de privilegios: Y
```

**Verificar instalación:**
```bash
mysql --version
# Debería mostrar: mysql  Ver 8.0.x
```

**Crear base de datos y usuario para el proyecto:**
```bash
# Conectar a MySQL como root
mysql -u root -p
# Ingresa la contraseña que estableciste

# Dentro de MySQL, ejecutar:
CREATE DATABASE cafedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'cafeapp'@'localhost' IDENTIFIED BY 'cafe_secure_2024';

GRANT ALL PRIVILEGES ON cafedb.* TO 'cafeapp'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

**Probar conexión:**
```bash
mysql -u cafeapp -p cafedb
# Ingresa: cafe_secure_2024
# Si entras sin errores, ¡funciona!
```

---

### 5. Configurar Git (si es necesario)

Una vez instalado Xcode Command Line Tools, Git debería estar disponible.

**Configuración inicial:**
```bash
# Verificar que Git está instalado
git --version

# Configurar tu identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Verificar configuración
git config --list

# Ver qué shell estás usando
echo $SHELL
# Debería mostrar: /bin/zsh (por defecto en macOS moderno)
```

**Opciones de terminal en macOS:**

#### Terminal Nativo (Recomendado) ✅
```bash
# Abrir Terminal.app (viene con macOS)
# - Usa Zsh por defecto
# - Git funciona perfectamente
# - Todos los comandos Unix disponibles
```

#### iTerm2 (Terminal Mejorado)
```bash
# Instalar iTerm2 (opcional)
brew install --cask iterm2

# Características:
# - Split panes
# - Búsqueda mejorada
# - Temas personalizables
# - Hotkey window
```

#### Oh My Zsh (Framework para Zsh)
```bash
# Instalar Oh My Zsh (opcional)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Beneficios:
# - Auto-completado mejorado
# - Temas visuales
# - Plugins útiles (git, npm, etc.)
# - Prompt personalizable
```

**¿Por qué NO necesitas Git Bash en macOS?**
- ✅ Terminal nativo ya tiene Bash/Zsh
- ✅ Git funciona nativamente
- ✅ Comandos Unix completos disponibles
- ✅ Mejor integración con macOS

**Git Bash es solo para Windows** (donde no hay terminal Unix nativo).

---

## Resumen de Comandos de Verificación

Ejecuta estos comandos para confirmar que todo está instalado correctamente:

```bash
# Xcode Command Line Tools
xcode-select -p

# Homebrew (si lo instalaste)
brew --version

# Node.js y npm
node --version
npm --version

# MySQL
mysql --version

# OpenSSL
openssl version

# Git
git --version
```

---

## Próximos Pasos

Una vez que todo esté instalado:

1. **Inicializar el proyecto Node.js**
   ```bash
   cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria
   npm init -y
   ```

2. **Instalar dependencias del proyecto**
   ```bash
   npm install express mysql2 dotenv bcrypt jsonwebtoken helmet cors cookie-parser uuid express-validator winston express-rate-limit
   
   npm install --save-dev nodemon eslint prettier
   ```

3. **Generar certificados SSL**
   ```bash
   mkdir -p cert
   openssl req -x509 -newkey rsa:4096 -keyout cert/key.pem -out cert/cert.pem -days 365 -nodes -subj "/CN=localhost"
   ```

4. **Crear archivos de configuración**
   - .env
   - .gitignore
   - .eslintrc.json
   - package.json (actualizar scripts)

5. **Ejecutar migraciones de base de datos**
   ```bash
   node src/database/migrate.js
   ```

6. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

---

## Solución de Problemas Comunes

### Error: "xcode-select: command not found"
- Instala manualmente desde App Store: busca "Xcode" o instala solo las herramientas de línea de comandos.

### Error: "brew: command not found" después de instalar
- Asegúrate de ejecutar los comandos de configuración de PATH que aparecen al final de la instalación.
- Reinicia la terminal o ejecuta `source ~/.zshrc`.

### Error: "Access denied for user 'cafeapp'@'localhost'"
- Verifica que creaste el usuario correctamente en MySQL.
- Confirma que la contraseña en `.env` coincide con la que estableciste.

### MySQL no inicia con Homebrew
```bash
# Ver logs
brew services list
brew services restart mysql@8.0

# Si persiste el error
rm -rf /opt/homebrew/var/mysql
brew reinstall mysql@8.0
mysql_install_db
brew services start mysql@8.0
```

### Node.js instalado pero comando no encontrado
```bash
# Verificar PATH
echo $PATH

# Agregar Node.js a PATH manualmente
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## Tiempos Estimados de Instalación

- Xcode Command Line Tools: 10-30 minutos
- Homebrew: 5-10 minutos
- Node.js: 2-5 minutos
- MySQL: 5-10 minutos
- Configuración total: **30-60 minutos**

---

## Referencias

- [Homebrew](https://brew.sh/)
- [Node.js](https://nodejs.org/)
- [MySQL Downloads](https://dev.mysql.com/downloads/)
- [Xcode Command Line Tools](https://developer.apple.com/xcode/)

---

**Fecha:** 9 de noviembre de 2025  
**Sistema:** macOS  
**Shell:** zsh
