-- Permissions table (OWASP: Principle of Least Privilege)
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    recurso VARCHAR(50) NOT NULL COMMENT 'users, ingredientes, menu, pedidos',
    accion VARCHAR(20) NOT NULL COMMENT 'create, read, update, delete, manage',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role-Permission relationship (many-to-many)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Audit log for sensitive operations
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    accion VARCHAR(100) NOT NULL,
    recurso VARCHAR(50) NOT NULL,
    recurso_id INT,
    detalles JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_recurso (recurso, recurso_id),
    INDEX idx_created_at (created_at)
);
