-- Admin user (password: Admin123!)
-- Run this after roles are seeded
INSERT INTO users (nombre, email, password_hash, role_id) VALUES
('Administrador', 'admin@cafeteria.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIRq8YxGqO', 1);

-- Note: The password hash above is for 'Admin123!'
-- In production, generate this hash using bcrypt with your own secure password
