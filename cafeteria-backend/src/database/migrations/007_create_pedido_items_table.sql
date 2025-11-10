CREATE TABLE IF NOT EXISTS pedido_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pedido_id BIGINT NOT NULL,
  menu_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE RESTRICT,
  INDEX idx_pedido (pedido_id),
  INDEX idx_menu (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
