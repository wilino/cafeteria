CREATE TABLE IF NOT EXISTS pedidos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  estado ENUM('pendiente','aceptado','preparando','listo','cancelado') DEFAULT 'pendiente',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notas TEXT,
  idempotency_key VARCHAR(64) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_user (user_id),
  INDEX idx_estado (estado),
  INDEX idx_created (created_at),
  INDEX idx_idempotency (idempotency_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
