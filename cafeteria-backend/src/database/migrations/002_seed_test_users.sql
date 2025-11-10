-- ============================================================================
-- Seed Test Users Migration
-- Crea usuarios de prueba para diferentes roles del sistema
-- ============================================================================

USE cafedb;

-- Eliminar usuarios de prueba existentes si existen
DELETE FROM users WHERE email IN ('admin@cafe.com', 'barista@cafe.com', 'cliente@cafe.com');

-- ============================================================================
-- Usuario Administrador
-- Email: admin@cafe.com
-- Password: Adm!n#2025.Cafe_Latte
-- ============================================================================
INSERT INTO users (nombre, email, password_hash, role_id, mfa_enabled, active, created_at)
VALUES (
  'Administrador del Sistema',
  'admin@cafe.com',
  '$2b$10$LNxacnQ4POmvpOyHLpmVVevJAyEAcd8w0r.EjSu5VK2QvEwIMIR5G',
  1,
  0,
  1,
  NOW()
);

-- ============================================================================
-- Usuario Empleado (Barista)
-- Email: barista@cafe.com
-- Password: B@r1st@#2025.Espresso
-- ============================================================================
INSERT INTO users (nombre, email, password_hash, role_id, mfa_enabled, active, created_at)
VALUES (
  'María García - Barista',
  'barista@cafe.com',
  '$2b$10$q7vm3ZA9cawbDQpq5P6OueXb7efj2yllsZXHuMzCv0oGSW9Vq.9I2',
  2,
  0,
  1,
  NOW()
);

-- ============================================================================
-- Usuario Cliente
-- Email: cliente@cafe.com
-- Password: Cl!ente#2025.Mocha_Safe
-- ============================================================================
INSERT INTO users (nombre, email, password_hash, role_id, mfa_enabled, active, created_at)
VALUES (
  'Juan Pérez - Cliente',
  'cliente@cafe.com',
  '$2b$10$IjtjUVQT2DWTbbQh/NU.Du.4370moQHqEJ7A88cMxmhWV/AZvNkXC',
  3,
  0,
  1,
  NOW()
);

-- ============================================================================
-- Verificación de usuarios creados
-- ============================================================================
SELECT 
  u.id,
  u.nombre,
  u.email,
  r.nombre as rol,
  u.active,
  u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email IN ('admin@cafe.com', 'barista@cafe.com', 'cliente@cafe.com')
ORDER BY r.id;
