CREATE TABLE IF NOT EXISTS menu_ingredientes (
  menu_id INT NOT NULL,
  ingrediente_id INT NOT NULL,
  cantidad_req DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (menu_id, ingrediente_id),
  FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE,
  FOREIGN KEY (ingrediente_id) REFERENCES ingredientes(id) ON DELETE RESTRICT,
  INDEX idx_menu (menu_id),
  INDEX idx_ingrediente (ingrediente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
