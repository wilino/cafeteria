# Migraciones de Base de Datos

Este directorio contiene las migraciones SQL para inicializar y actualizar la base de datos del sistema.

## Migraciones Disponibles

### 001_initial_schema.sql
Crea la estructura inicial de la base de datos:
- Tablas: roles, users, permissions, role_permissions, productos, pedidos, pedido_items, audit_log, idempotency_keys
- Roles predeterminados: admin, empleado, cliente
- Permisos granulares (20 permisos)
- Relaciones y restricciones de integridad

**Ejecutar:**
```bash
mysql -u cafeapp -p'cafe_secure_2024' cafedb < src/database/migrations/001_initial_schema.sql
```

### 002_seed_test_users.sql
Crea usuarios de prueba para cada rol del sistema con contraseñas seguras.

**Usuarios creados:**

| Rol | Email | Contraseña | Nombre |
|-----|-------|-----------|--------|
| Administrador | admin@cafe.com | Adm!n#2025.Cafe_Latte | Administrador del Sistema |
| Empleado | barista@cafe.com | B@r1st@#2025.Espresso | María García - Barista |
| Cliente | cliente@cafe.com | Cl!ente#2025.Mocha_Safe | Juan Pérez - Cliente |

**Ejecutar:**
```bash
mysql -u cafeapp -p'cafe_secure_2024' cafedb < src/database/migrations/002_seed_test_users.sql
```

## Orden de Ejecución

Las migraciones deben ejecutarse en orden numérico:

1. Primero: `001_initial_schema.sql` - Crea la estructura de la base de datos
2. Segundo: `002_seed_test_users.sql` - Crea usuarios de prueba

## Verificación

Para verificar que las migraciones se ejecutaron correctamente:

```bash
# Verificar tablas creadas
mysql -u cafeapp -p'cafe_secure_2024' cafedb -e "SHOW TABLES;"

# Verificar usuarios creados
mysql -u cafeapp -p'cafe_secure_2024' cafedb -e "
  SELECT u.id, u.nombre, u.email, r.nombre as rol 
  FROM users u 
  JOIN roles r ON u.role_id = r.id;
"

# Verificar roles y permisos
mysql -u cafeapp -p'cafe_secure_2024' cafedb -e "
  SELECT r.nombre as rol, COUNT(rp.permission_id) as permisos 
  FROM roles r 
  LEFT JOIN role_permissions rp ON r.id = rp.role_id 
  GROUP BY r.nombre;
"
```

## Rollback

Para revertir los usuarios de prueba:

```sql
DELETE FROM users WHERE email IN ('admin@cafe.com', 'barista@cafe.com', 'cliente@cafe.com');
```

Para recrear la base de datos desde cero:

```bash
mysql -u root -p << EOF
DROP DATABASE IF EXISTS cafedb;
CREATE DATABASE cafedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON cafedb.* TO 'cafeapp'@'localhost';
FLUSH PRIVILEGES;
EOF

# Luego ejecutar las migraciones en orden
mysql -u cafeapp -p'cafe_secure_2024' cafedb < src/database/migrations/001_initial_schema.sql
mysql -u cafeapp -p'cafe_secure_2024' cafedb < src/database/migrations/002_seed_test_users.sql
```

## Generar Nuevos Hashes de Contraseñas

Si necesitas cambiar las contraseñas de los usuarios de prueba:

```bash
node scripts/generate-password-hashes.js
```

Este script genera hashes bcrypt para las contraseñas definidas y muestra el resultado en consola.
