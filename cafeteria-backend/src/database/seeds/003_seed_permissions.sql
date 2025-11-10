-- Seed Permissions (OWASP: Fine-grained access control)

-- Users permissions
INSERT INTO permissions (nombre, descripcion, recurso, accion) VALUES
('users.read', 'Ver información de usuarios', 'users', 'read'),
('users.create', 'Crear nuevos usuarios', 'users', 'create'),
('users.update', 'Actualizar usuarios', 'users', 'update'),
('users.delete', 'Eliminar usuarios', 'users', 'delete'),
('users.manage_roles', 'Gestionar roles de usuarios', 'users', 'manage');

-- Ingredientes permissions
INSERT INTO permissions (nombre, descripcion, recurso, accion) VALUES
('ingredientes.read', 'Ver ingredientes', 'ingredientes', 'read'),
('ingredientes.create', 'Crear ingredientes', 'ingredientes', 'create'),
('ingredientes.update', 'Actualizar ingredientes', 'ingredientes', 'update'),
('ingredientes.delete', 'Eliminar ingredientes', 'ingredientes', 'delete'),
('ingredientes.manage_stock', 'Gestionar stock de ingredientes', 'ingredientes', 'manage');

-- Menu permissions
INSERT INTO permissions (nombre, descripcion, recurso, accion) VALUES
('menu.read', 'Ver menú', 'menu', 'read'),
('menu.create', 'Crear items del menú', 'menu', 'create'),
('menu.update', 'Actualizar items del menú', 'menu', 'update'),
('menu.delete', 'Eliminar items del menú', 'menu', 'delete'),
('menu.manage_ingredientes', 'Gestionar ingredientes del menú', 'menu', 'manage');

-- Pedidos permissions
INSERT INTO permissions (nombre, descripcion, recurso, accion) VALUES
('pedidos.read', 'Ver pedidos', 'pedidos', 'read'),
('pedidos.create', 'Crear pedidos', 'pedidos', 'create'),
('pedidos.update', 'Actualizar pedidos', 'pedidos', 'update'),
('pedidos.cancel', 'Cancelar pedidos', 'pedidos', 'delete'),
('pedidos.manage_estado', 'Gestionar estado de pedidos', 'pedidos', 'manage');

-- Assign permissions to ADMIN role (NOT full access, only administrative tasks)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions WHERE nombre IN (
    'users.read', 'users.create', 'users.update', 'users.delete', 'users.manage_roles',
    'ingredientes.read', 'ingredientes.update', 'ingredientes.delete',
    'menu.read', 'menu.update', 'menu.delete',
    'pedidos.read', 'pedidos.update'
);

-- Assign permissions to EMPLEADO role (operational tasks)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE nombre IN (
    'users.read',
    'ingredientes.read', 'ingredientes.create', 'ingredientes.update', 'ingredientes.manage_stock',
    'menu.read', 'menu.create', 'menu.update', 'menu.manage_ingredientes',
    'pedidos.read', 'pedidos.update', 'pedidos.manage_estado'
);

-- Assign permissions to CLIENTE role (customer tasks)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE nombre IN (
    'menu.read',
    'pedidos.read', 'pedidos.create', 'pedidos.cancel'
);
