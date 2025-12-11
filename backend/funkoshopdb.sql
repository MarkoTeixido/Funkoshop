-- ============================================
-- FUNKOSHOP DATABASE - COMPLETE SCHEMA
-- E-commerce con JWT, Carrito, Órdenes, Admin
-- ============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ============================================
-- TABLA: category
-- ============================================
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  `category_description` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `category` (`category_id`, `category_name`, `category_description`) VALUES
(1, 'funkos', 'Figuras coleccionables Funko Pop'),
(2, 'ropa', 'Camisetas y ropa temática'),
(3, 'accesorios', 'Llaveros, tazas y más');

-- ============================================
-- TABLA: licence
-- ============================================
CREATE TABLE IF NOT EXISTS `licence` (
  `licence_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `licence_name` VARCHAR(45) NOT NULL,
  `licence_description` VARCHAR(255) NOT NULL,
  `licence_image` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`licence_id`),
  UNIQUE KEY `licence_id_UNIQUE` (`licence_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `licence` (`licence_id`, `licence_name`, `licence_description`, `licence_image`) VALUES
(1, 'Star Wars', 'La saga galáctica más icónica', '/images/licences/star-wars.webp'),
(2, 'Harry Potter', 'El mundo mágico de Hogwarts', '/images/licences/harry-potter.webp'),
(3, 'Pokemon', 'Hazte con todos', '/images/licences/pokemon. webp');

-- ============================================
-- TABLA: user (con roles y autenticación)
-- ============================================
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `lastname` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1 NOT NULL,
  `email_verified` TINYINT(1) DEFAULT 0,
  `phone` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABLA:  refresh_token (para JWT)
-- ============================================
CREATE TABLE IF NOT EXISTS `refresh_token` (
  `token_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token_id`),
  KEY `fk_token_user` (`user_id`),
  INDEX `idx_token` (`token`(255)),
  CONSTRAINT `fk_token_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABLA:  product (mejorada)
-- ============================================
CREATE TABLE IF NOT EXISTS `product` (
  `product_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(100) NOT NULL,
  `product_description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT(11) NOT NULL DEFAULT 0,
  `discount` INT(11) DEFAULT NULL,
  `discount_end_date` TIMESTAMP NULL DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `sku` VARCHAR(30) NOT NULL,
  `dues` INT(11) DEFAULT NULL,
  `image_front` VARCHAR(200) NOT NULL,
  `image_back` VARCHAR(200) NOT NULL,
  `licence_id` INT(10) UNSIGNED NOT NULL,
  `category_id` INT(10) UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_id_UNIQUE` (`product_id`),
  UNIQUE KEY `sku_UNIQUE` (`sku`),
  KEY `fk_product_licence` (`licence_id`),
  KEY `fk_product_category` (`category_id`),
  INDEX `idx_featured` (`is_featured`),
  INDEX `idx_active` (`is_active`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_licence` FOREIGN KEY (`licence_id`) REFERENCES `licence` (`licence_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `product` (`product_id`, `product_name`, `product_description`, `price`, `stock`, `discount`, `sku`, `dues`, `image_front`, `image_back`, `licence_id`, `category_id`, `is_featured`) VALUES
(1, 'Stormtrooper Lightsaber', 'Figura coleccionable Funko Pop de un Stormtrooper con sable de luz. Ideal para coleccionistas de Star Wars.', 1799.99, 10, 10, 'STW001004', 3, '/images/star-wars/trooper-1.webp', '/images/star-wars/trooper-box.webp', 1, 1, 1),
(2, 'Pidgeotto Flying', 'Figura coleccionable Funko Pop de Pidgeotto en posición de vuelo.  Perfecto para fans de Pokémon.', 1799.99, 10, NULL, 'PKM001003', 3, '/images/pokemon/pidgeotto-1.webp', '/images/pokemon/pidgeotto-box.webp', 3, 1, 1),
(3, 'Luna Lovegood Lion Mask', 'Figura coleccionable Funko Pop de Luna Lovegood con máscara de león. Exclusivo de Harry Potter.', 1799.99, 10, 15, 'HPT001003', 3, '/images/harry-potter/luna-1.webp', '/images/harry-potter/luna-box.webp', 2, 1, 0);

-- ============================================
-- TABLA: address (direcciones de envío)
-- ============================================
CREATE TABLE IF NOT EXISTS `address` (
  `address_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  KEY `fk_address_user` (`user_id`),
  INDEX `idx_default` (`user_id`, `is_default`),
  CONSTRAINT `fk_address_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABLA: cart (carrito de compras)
-- ============================================
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABLA:  cart_item (items del carrito)
-- ============================================
CREATE TABLE IF NOT EXISTS `cart_item` (
  `cart_item_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cart_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_item_id`),
  KEY `fk_cartitem_cart` (`cart_id`),
  KEY `fk_cartitem_product` (`product_id`),
  UNIQUE KEY `unique_cart_product` (`cart_id`, `product_id`),
  CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABLA:  order (pedidos/órdenes)
-- ============================================
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_number` VARCHAR(50) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
  `final_amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  `payment_method` VARCHAR(50) DEFAULT 'credit_card',
  `payment_status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  `shipping_street` VARCHAR(255) NOT NULL,
  `shipping_city` VARCHAR(100) NOT NULL,
  `shipping_state` VARCHAR(100) NOT NULL,
  `shipping_postal_code` VARCHAR(20) NOT NULL,
  `shipping_country` VARCHAR(100) NOT NULL,
  `shipping_phone` VARCHAR(20) NOT NULL,
  `promotion_code` VARCHAR(50) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_number_UNIQUE` (`order_number`),
  KEY `fk_order_user` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABLA: order_item (items de la orden)
-- ============================================
CREATE TABLE IF NOT EXISTS `order_item` (
  `order_item_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `product_name` VARCHAR(100) NOT NULL,
  `product_sku` VARCHAR(30) NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `discount_applied` INT DEFAULT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_orderitem_order` (`order_id`),
  KEY `fk_orderitem_product` (`product_id`),
  CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABLA:  promotion (cupones y descuentos)
-- ============================================
CREATE TABLE IF NOT EXISTS `promotion` (
  `promotion_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `discount_type` ENUM('percentage', 'fixed') NOT NULL,
  `discount_value` DECIMAL(10,2) NOT NULL,
  `min_purchase` DECIMAL(10,2) DEFAULT NULL,
  `max_uses` INT DEFAULT NULL,
  `current_uses` INT DEFAULT 0,
  `start_date` TIMESTAMP NOT NULL,
  `end_date` TIMESTAMP NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`promotion_id`),
  UNIQUE KEY `code_UNIQUE` (`code`),
  INDEX `idx_code_active` (`code`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `promotion` (`code`, `description`, `discount_type`, `discount_value`, `min_purchase`, `max_uses`, `start_date`, `end_date`, `is_active`) VALUES
('WELCOME10', 'Descuento de bienvenida 10%', 'percentage', 10.00, 1000.00, 100, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1),
('FUNKO50', 'Descuento fijo $50', 'fixed', 50.00, 500.00, NULL, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1);

-- ============================================
-- TABLA: product_history (auditoría)
-- ============================================
CREATE TABLE IF NOT EXISTS `product_history` (
  `history_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` INT UNSIGNED NOT NULL,
  `admin_id` INT UNSIGNED NOT NULL,
  `action` ENUM('create', 'update', 'delete', 'stock_change') NOT NULL,
  `field_changed` VARCHAR(50) DEFAULT NULL,
  `old_value` TEXT DEFAULT NULL,
  `new_value` TEXT DEFAULT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_admin` (`admin_id`),
  KEY `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- TABLA: wishlist (lista de deseos - BONUS)
-- ============================================
CREATE TABLE IF NOT EXISTS `wishlist` (
  `wishlist_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wishlist_id`),
  UNIQUE KEY `unique_user_product` (`user_id`, `product_id`),
  KEY `fk_wishlist_user` (`user_id`),
  KEY `fk_wishlist_product` (`product_id`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- VISTAS ÚTILES PARA REPORTES
-- ============================================

-- Vista:  Ventas totales por producto
CREATE OR REPLACE VIEW `v_sales_by_product` AS
SELECT 
  p.product_id,
  p.product_name,
  p. sku,
  COUNT(DISTINCT oi.order_id) as total_orders,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi. subtotal) as total_revenue,
  p.stock as current_stock
FROM product p
LEFT JOIN order_item oi ON p.product_id = oi.product_id
LEFT JOIN `order` o ON oi.order_id = o.order_id AND o.status != 'cancelled'
GROUP BY p.product_id;

-- Vista: Resumen de órdenes
CREATE OR REPLACE VIEW `v_order_summary` AS
SELECT 
  o.order_id,
  o.order_number,
  CONCAT(u.name, ' ', u.lastname) as customer_name,
  u.email as customer_email,
  o.final_amount,
  o.status,
  o.payment_status,
  o.created_at,
  COUNT(oi.order_item_id) as total_items
FROM `order` o
JOIN user u ON o.user_id = u.id
LEFT JOIN order_item oi ON o.order_id = oi.order_id
GROUP BY o.order_id;