-- ============================================================================
-- Seed Menu and Ingredientes Migration
-- Crea datos de prueba para ingredientes, menú y sus relaciones
-- ============================================================================

USE cafedb;

-- ============================================================================
-- LIMPIAR DATOS EXISTENTES
-- ============================================================================
DELETE FROM menu_ingredientes;
DELETE FROM pedido_items;
DELETE FROM pedidos;
DELETE FROM menu;
DELETE FROM ingredientes;

-- Resetear auto_increment
ALTER TABLE menu AUTO_INCREMENT = 1;
ALTER TABLE ingredientes AUTO_INCREMENT = 1;

-- ============================================================================
-- INGREDIENTES (Inventario)
-- ============================================================================

-- Cafés
INSERT INTO ingredientes (nombre, stock, unidad, stock_minimo) VALUES
('Café en grano arábica', 50.00, 'kg', 10.00),
('Café en grano robusta', 30.00, 'kg', 8.00),
('Café descafeinado', 15.00, 'kg', 5.00);

-- Leches
INSERT INTO ingredientes (nombre, stock, unidad, stock_minimo) VALUES
('Leche entera', 80.00, 'litros', 20.00),
('Leche descremada', 60.00, 'litros', 15.00),
('Leche de almendra', 25.00, 'litros', 8.00),
('Leche de soja', 20.00, 'litros', 5.00);

-- Endulzantes
INSERT INTO ingredientes (nombre, stock, unidad, stock_minimo) VALUES
('Azúcar blanca', 40.00, 'kg', 10.00),
('Azúcar morena', 25.00, 'kg', 8.00),
('Stevia', 5.00, 'kg', 2.00),
('Miel', 10.00, 'kg', 3.00);

-- Saborizantes
INSERT INTO ingredientes (nombre, stock, unidad, stock_minimo) VALUES
('Jarabe de vainilla', 8.00, 'litros', 2.00),
('Jarabe de caramelo', 8.00, 'litros', 2.00),
('Jarabe de avellana', 6.00, 'litros', 2.00),
('Chocolate en polvo', 15.00, 'kg', 5.00),
('Cacao premium', 12.00, 'kg', 4.00);

-- Complementos
INSERT INTO ingredientes (nombre, stock, unidad, stock_minimo) VALUES
('Crema batida', 20.00, 'litros', 5.00),
('Canela en polvo', 3.00, 'kg', 1.00),
('Nuez moscada', 1.50, 'kg', 0.50),
('Galletas oreo', 50.00, 'paquetes', 15.00),
('Malvaviscos', 30.00, 'paquetes', 10.00);

-- Tés y otros
INSERT INTO ingredientes (nombre, stock, unidad, stock_minimo) VALUES
('Té negro', 8.00, 'kg', 2.00),
('Té verde', 8.00, 'kg', 2.00),
('Té chai', 5.00, 'kg', 2.00),
('Hielo', 200.00, 'kg', 50.00),
('Agua filtrada', 500.00, 'litros', 100.00);

-- Repostería
INSERT INTO ingredientes (nombre, stock, unidad, stock_minimo) VALUES
('Croissant', 60.00, 'unidades', 20.00),
('Muffins chocolate', 45.00, 'unidades', 15.00),
('Pan de plátano', 30.00, 'unidades', 10.00),
('Brownie', 40.00, 'unidades', 15.00),
('Cheesecake', 20.00, 'unidades', 8.00);

-- ============================================================================
-- MENÚ (Productos disponibles para clientes)
-- ============================================================================

-- CAFÉS CALIENTES
INSERT INTO menu (nombre, descripcion, precio, activo, imagen_url) VALUES
('Espresso Simple', 'Café espresso intenso y aromático, 30ml', 2.50, 1, '/images/espresso.jpg'),
('Espresso Doble', 'Doble shot de espresso para los que necesitan energía extra', 3.50, 1, '/images/espresso-doble.jpg'),
('Americano', 'Espresso con agua caliente, 240ml', 3.00, 1, '/images/americano.jpg'),
('Cappuccino', 'Espresso con leche espumada y un toque de canela, 180ml', 4.00, 1, '/images/cappuccino.jpg'),
('Latte', 'Espresso con leche vaporizada y suave espuma, 240ml', 4.50, 1, '/images/latte.jpg'),
('Mocha', 'Latte con chocolate, crema batida y cacao, 300ml', 5.00, 1, '/images/mocha.jpg'),
('Macchiato', 'Espresso marcado con espuma de leche, 60ml', 3.50, 1, '/images/macchiato.jpg'),
('Flat White', 'Espresso doble con microespuma de leche, 180ml', 4.50, 1, '/images/flat-white.jpg');

-- CAFÉS FRÍOS
INSERT INTO menu (nombre, descripcion, precio, activo, imagen_url) VALUES
('Café Frío', 'Café negro servido con hielo, refrescante', 3.50, 1, '/images/cafe-frio.jpg'),
('Frappé Caramelo', 'Bebida helada con café, caramelo y crema batida', 5.50, 1, '/images/frappe-caramelo.jpg'),
('Frappé Mocha', 'Café frío con chocolate, hielo y crema batida', 5.50, 1, '/images/frappe-mocha.jpg'),
('Cold Brew', 'Café de extracción en frío, suave y dulce, 300ml', 4.50, 1, '/images/cold-brew.jpg'),
('Affogato', 'Espresso sobre helado de vainilla', 5.00, 1, '/images/affogato.jpg');

-- BEBIDAS ESPECIALES
INSERT INTO menu (nombre, descripcion, precio, activo, imagen_url) VALUES
('Caramel Macchiato', 'Latte con caramelo y crema batida', 5.50, 1, '/images/caramel-macchiato.jpg'),
('Vainilla Latte', 'Latte con jarabe de vainilla', 5.00, 1, '/images/vainilla-latte.jpg'),
('Chai Latte', 'Té chai especiado con leche vaporizada', 4.50, 1, '/images/chai-latte.jpg'),
('Chocolate Caliente', 'Chocolate premium con crema batida y malvaviscos', 4.00, 1, '/images/chocolate-caliente.jpg'),
('Matcha Latte', 'Té verde matcha con leche, dulce y cremoso', 5.50, 1, '/images/matcha-latte.jpg');

-- TÉS
INSERT INTO menu (nombre, descripcion, precio, activo, imagen_url) VALUES
('Té Negro', 'Té negro clásico, 240ml', 2.50, 1, '/images/te-negro.jpg'),
('Té Verde', 'Té verde antioxidante, 240ml', 2.50, 1, '/images/te-verde.jpg'),
('Té Chai Especiado', 'Té chai con especias tradicionales', 3.00, 1, '/images/te-chai.jpg');

-- REPOSTERÍA
INSERT INTO menu (nombre, descripcion, precio, activo, imagen_url) VALUES
('Croissant de Mantequilla', 'Croissant francés hojaldrado y crujiente', 3.00, 1, '/images/croissant.jpg'),
('Muffin de Chocolate', 'Muffin con chispas de chocolate', 3.50, 1, '/images/muffin-chocolate.jpg'),
('Pan de Plátano', 'Pan casero de plátano con nueces', 4.00, 1, '/images/pan-platano.jpg'),
('Brownie de Chocolate', 'Brownie denso y chocolatoso', 4.50, 1, '/images/brownie.jpg'),
('Cheesecake', 'Cheesecake cremoso con base de galleta', 5.50, 1, '/images/cheesecake.jpg');

-- ============================================================================
-- RELACIONES MENÚ - INGREDIENTES
-- ============================================================================

-- Espresso Simple (ID: 1)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(1, 1, 0.018), -- 18g café arábica
(1, 26, 0.030); -- 30ml agua

-- Espresso Doble (ID: 2)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(2, 1, 0.036), -- 36g café arábica
(2, 26, 0.060); -- 60ml agua

-- Americano (ID: 3)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(3, 1, 0.018), -- 18g café arábica
(3, 26, 0.240); -- 240ml agua

-- Cappuccino (ID: 4)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(4, 1, 0.018), -- 18g café
(4, 4, 0.120), -- 120ml leche entera
(4, 18, 0.002); -- 2g canela

-- Latte (ID: 5)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(5, 1, 0.018), -- 18g café
(5, 4, 0.200); -- 200ml leche entera

-- Mocha (ID: 6)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(6, 1, 0.018), -- 18g café
(6, 4, 0.180), -- 180ml leche
(6, 15, 0.030), -- 30g chocolate en polvo
(6, 17, 0.050), -- 50ml crema batida
(6, 16, 0.010); -- 10g cacao premium

-- Macchiato (ID: 7)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(7, 1, 0.018), -- 18g café
(7, 4, 0.030); -- 30ml leche

-- Flat White (ID: 8)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(8, 1, 0.036), -- 36g café (doble)
(8, 4, 0.150); -- 150ml leche

-- Café Frío (ID: 9)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(9, 1, 0.025), -- 25g café
(9, 26, 0.200), -- 200ml agua
(9, 25, 0.100); -- 100g hielo

-- Frappé Caramelo (ID: 10)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(10, 1, 0.025), -- 25g café
(10, 4, 0.150), -- 150ml leche
(10, 13, 0.030), -- 30ml jarabe caramelo
(10, 25, 0.150), -- 150g hielo
(10, 17, 0.050); -- 50ml crema batida

-- Frappé Mocha (ID: 11)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(11, 1, 0.025), -- 25g café
(11, 4, 0.150), -- 150ml leche
(11, 15, 0.030), -- 30g chocolate
(11, 25, 0.150), -- 150g hielo
(11, 17, 0.050); -- 50ml crema batida

-- Cold Brew (ID: 12)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(12, 1, 0.060), -- 60g café (extracción en frío)
(12, 26, 0.300), -- 300ml agua fría
(12, 25, 0.050); -- 50g hielo

-- Affogato (ID: 13)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(13, 1, 0.018); -- 18g café espresso sobre helado

-- Caramel Macchiato (ID: 14)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(14, 1, 0.018), -- 18g café
(14, 4, 0.200), -- 200ml leche
(14, 13, 0.030), -- 30ml jarabe caramelo
(14, 17, 0.030); -- 30ml crema batida

-- Vainilla Latte (ID: 15)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(15, 1, 0.018), -- 18g café
(15, 4, 0.200), -- 200ml leche
(15, 12, 0.030); -- 30ml jarabe vainilla

-- Chai Latte (ID: 16)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(16, 24, 0.015), -- 15g té chai
(16, 4, 0.200), -- 200ml leche
(16, 26, 0.050); -- 50ml agua

-- Chocolate Caliente (ID: 17)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(17, 15, 0.040), -- 40g chocolate en polvo
(17, 4, 0.240), -- 240ml leche
(17, 17, 0.040), -- 40ml crema batida
(17, 21, 0.005); -- 5 malvaviscos

-- Matcha Latte (ID: 18)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(18, 23, 0.010), -- 10g té verde matcha
(18, 4, 0.240); -- 240ml leche

-- Té Negro (ID: 19)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(19, 22, 0.008), -- 8g té negro
(19, 26, 0.240); -- 240ml agua

-- Té Verde (ID: 20)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(20, 23, 0.008), -- 8g té verde
(20, 26, 0.240); -- 240ml agua

-- Té Chai Especiado (ID: 21)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(21, 24, 0.012), -- 12g té chai
(21, 26, 0.240); -- 240ml agua

-- Croissant (ID: 22)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(22, 27, 1.00); -- 1 unidad croissant

-- Muffin Chocolate (ID: 23)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(23, 28, 1.00); -- 1 unidad muffin

-- Pan de Plátano (ID: 24)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(24, 29, 1.00); -- 1 unidad pan plátano

-- Brownie (ID: 25)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(25, 30, 1.00); -- 1 unidad brownie

-- Cheesecake (ID: 26)
INSERT INTO menu_ingredientes (menu_id, ingrediente_id, cantidad_req) VALUES
(26, 31, 1.00); -- 1 unidad cheesecake

-- ============================================================================
-- VERIFICACIÓN DE DATOS CREADOS
-- ============================================================================
SELECT 'Ingredientes creados:' as resultado;
SELECT COUNT(*) as total_ingredientes FROM ingredientes;

SELECT 'Productos en menú creados:' as resultado;
SELECT COUNT(*) as total_productos FROM menu;

SELECT 'Relaciones menú-ingredientes creadas:' as resultado;
SELECT COUNT(*) as total_relaciones FROM menu_ingredientes;

-- Muestra algunos productos con sus ingredientes
SELECT 'Ejemplo: Ingredientes del Mocha:' as resultado;
SELECT 
    m.nombre as producto,
    i.nombre as ingrediente,
    mi.cantidad_req as cantidad,
    i.unidad
FROM menu m
JOIN menu_ingredientes mi ON m.id = mi.menu_id
JOIN ingredientes i ON mi.ingrediente_id = i.id
WHERE m.nombre = 'Mocha';
