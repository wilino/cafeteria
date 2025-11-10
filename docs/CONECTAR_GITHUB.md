# 🔗 Conectar Proyecto con GitHub

Este documento explica cómo vincular tu proyecto local con el repositorio de GitHub.

---

## Prerrequisitos

Antes de continuar, asegúrate de tener instalado:

✅ **Git** - Incluido con Xcode Command Line Tools
✅ **Cuenta de GitHub** - Crea una en [github.com](https://github.com)

**Verificar Git:**
```bash
git --version
# Debería mostrar: git version 2.x.x
```

**Si no tienes Git instalado:**
```bash
# Opción 1: Xcode Command Line Tools (Recomendado - Ya instalado)
xcode-select --install

# Opción 2: Homebrew (Para versión más reciente)
brew install git

# Opción 3: Descargar instalador desde git-scm.com
```

Ver más opciones en [INSTALACION_SOFTWARE.md](./INSTALACION_SOFTWARE.md#11-opciones-de-instalación-de-git).

---

## 🚀 Pasos para Vincular con GitHub

### PASO 1: Configurar Git (Primera vez)

Si es la primera vez que usas Git en este Mac:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

**Verificar configuración:**
```bash
git config --list
```

---

### PASO 2: Inicializar Repositorio Local

```bash
cd /Users/willy-pc/Maestria-Cato/Seguridad/cafeteria

# Inicializar Git
git init

# Verificar que .gitignore existe
cat .gitignore
```

---

### PASO 3: Agregar Archivos al Staging

```bash
# Ver estado actual
git status

# Agregar todos los archivos
git add .

# Ver lo que se va a commitear
git status
```

---

### PASO 4: Crear Commit Inicial

```bash
git commit -m "Initial commit: Clean architecture setup with Clean Code principles

- Estructura de carpetas modular por dominio
- Configuraciones base (database, constants)
- Utilidades compartidas (logger, password, jwt, csrf)
- Errores personalizados por tipo
- Migraciones SQL para todas las tablas
- Seeds con roles y usuario admin
- Documentación completa
- Package.json con scripts configurados
- ESLint y Prettier configurados"
```

---

### PASO 5: Crear Rama Main

```bash
git branch -M main
```

---

### PASO 6: Conectar con Repositorio Remoto

```bash
git remote add origin https://github.com/wilino/cafeteria.git
```

**Verificar:**
```bash
git remote -v
```

Deberías ver:
```
origin  https://github.com/wilino/cafeteria.git (fetch)
origin  https://github.com/wilino/cafeteria.git (push)
```

---

### PASO 7: Push al Repositorio

```bash
# Primera vez (con -u para trackear la rama)
git push -u origin main
```

Si el repositorio no está vacío, puedes necesitar:

```bash
# Forzar el push (solo si estás seguro)
git push -u origin main --force
```

---

## 🔐 Autenticación con GitHub

GitHub ya no acepta contraseñas para autenticación por línea de comandos. Necesitas usar un **Personal Access Token (PAT)**.

### Opción 1: Personal Access Token (Recomendado)

1. **Ir a GitHub**: https://github.com/settings/tokens

2. **Generar nuevo token**:
   - Click en "Generate new token" → "Generate new token (classic)"
   - **Nombre**: "cafeteria-project"
   - **Expiration**: 90 days o más
   - **Scopes**: Selecciona `repo` (acceso completo a repositorios)

3. **Copiar el token** (solo se muestra una vez)

4. **Usar el token como contraseña** cuando Git te pida:
   ```bash
   git push -u origin main
   Username: wilino
   Password: <pega_aquí_tu_token>
   ```

### Opción 2: SSH (Más seguro para uso frecuente)

1. **Generar clave SSH**:
   ```bash
   ssh-keygen -t ed25519 -C "tu.email@ejemplo.com"
   # Presiona Enter para ubicación por defecto
   # Opcionalmente agrega una contraseña
   ```

2. **Copiar clave pública**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

3. **Agregar a GitHub**:
   - Ve a https://github.com/settings/keys
   - Click "New SSH key"
   - Pega la clave pública

4. **Cambiar URL del remoto a SSH**:
   ```bash
   git remote set-url origin git@github.com:wilino/cafeteria.git
   ```

5. **Verificar conexión**:
   ```bash
   ssh -T git@github.com
   ```

---

## 📝 Comandos Git Comunes

### Ver Estado
```bash
git status
```

### Agregar Cambios
```bash
# Agregar archivo específico
git add archivo.js

# Agregar todos los archivos modificados
git add .

# Agregar solo archivos rastreados modificados
git add -u
```

### Crear Commit
```bash
git commit -m "Descripción del cambio"

# Commit con mensaje detallado
git commit -m "Título corto" -m "Descripción más larga
- Cambio 1
- Cambio 2"
```

### Ver Historial
```bash
git log
git log --oneline
git log --graph --oneline --all
```

### Push a GitHub
```bash
# Push normal
git push

# Forzar push (¡cuidado!)
git push --force

# Push de una rama específica
git push origin nombre-rama
```

### Pull desde GitHub
```bash
git pull
```

### Crear Nueva Rama
```bash
git checkout -b feature/nueva-funcionalidad
```

### Cambiar de Rama
```bash
git checkout main
```

### Ver Ramas
```bash
git branch        # Locales
git branch -r     # Remotas
git branch -a     # Todas
```

---

## 🌿 Workflow Recomendado

### Para Nuevas Funcionalidades

```bash
# 1. Crear rama desde main
git checkout main
git pull
git checkout -b feature/auth-module

# 2. Trabajar en la funcionalidad
# ... editar archivos ...

# 3. Agregar cambios
git add .
git commit -m "feat: implement authentication module"

# 4. Push de la rama
git push -u origin feature/auth-module

# 5. Crear Pull Request en GitHub
# Ve a https://github.com/wilino/cafeteria/pulls
# Click "New Pull Request"

# 6. Después de merge, actualizar main
git checkout main
git pull
git branch -d feature/auth-module
```

---

## 🏷️ Convenciones de Commits

Usa commits semánticos para mejor organización:

```bash
# Nuevas funcionalidades
git commit -m "feat: add user authentication"

# Corrección de bugs
git commit -m "fix: resolve JWT expiration issue"

# Documentación
git commit -m "docs: update README with installation steps"

# Refactoring
git commit -m "refactor: restructure auth module"

# Tests
git commit -m "test: add unit tests for password utils"

# Configuración
git commit -m "chore: update dependencies"

# Estilos (formato)
git commit -m "style: format code with prettier"
```

---

## 🔄 Mantener Sincronizado

```bash
# Antes de empezar a trabajar cada día
git pull

# Después de trabajar
git add .
git commit -m "descripción"
git push
```

---

## 🆘 Solución de Problemas

### Error: "repository not found"
**Solución**: Verifica que el repositorio existe y tienes acceso:
```bash
git remote -v
```

### Error: "failed to push some refs"
**Solución**: Pull primero, luego push:
```bash
git pull --rebase origin main
git push
```

### Error: "authentication failed"
**Solución**: Usa un Personal Access Token en lugar de contraseña.

### Deshacer último commit (local)
```bash
git reset --soft HEAD~1  # Mantiene cambios
git reset --hard HEAD~1  # Elimina cambios (¡cuidado!)
```

### Ver diferencias
```bash
git diff                 # Cambios no agregados
git diff --staged        # Cambios en staging
git diff HEAD           # Todos los cambios
```

---

## 📚 Recursos Adicionales

- [GitHub Docs](https://docs.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)

---

## ✅ Checklist de Conexión

- [ ] Xcode Command Line Tools instalado
- [ ] Git configurado (nombre y email)
- [ ] Repositorio local inicializado (`git init`)
- [ ] Archivos agregados al staging (`git add .`)
- [ ] Commit inicial creado
- [ ] Rama main creada (`git branch -M main`)
- [ ] Remoto agregado (`git remote add origin`)
- [ ] Token de GitHub o SSH configurado
- [ ] Push exitoso a GitHub

---

**Fecha:** 9 de noviembre de 2025  
**Autor:** Guía de configuración Git/GitHub
