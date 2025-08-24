-- Zaui Coffee Database Schema
-- PostgreSQL

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    zalo_id VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(15),
    full_name VARCHAR(100),
    email VARCHAR(100),
    avatar_url TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    fullname VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    detail TEXT NOT NULL,
    ward VARCHAR(100),
    district VARCHAR(100),
    province VARCHAR(100),
    is_selected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vouchers Table
CREATE TABLE IF NOT EXISTS vouchers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL,
    min_order_amount DECIMAL(10,2) NOT NULL,
    max_discount_amount DECIMAL(10,2),
    expiry_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    address_id INTEGER REFERENCES addresses(id),
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    voucher_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    points_earned INTEGER DEFAULT 0,
    points_claimed BOOLEAN DEFAULT FALSE,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    options JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Points History Table
CREATE TABLE IF NOT EXISTS points_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id),
    points_change INTEGER NOT NULL,
    description VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Vouchers Table
CREATE TABLE IF NOT EXISTS user_vouchers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    voucher_id INTEGER REFERENCES vouchers(id),
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_zalo_id ON users(zalo_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON points_history(user_id);

-- Insert sample data
INSERT INTO categories (name, slug, icon_url, sort_order) VALUES
('Cà phê', 'coffee', '/static/icons-optimized/category-coffee.webp', 1),
('Trà sữa', 'milktea', '/static/icons-optimized/category-milktea.webp', 2),
('Nước ép', 'juice', '/static/icons-optimized/category-juice.webp', 3),
('Matcha', 'matcha', '/static/icons-optimized/category-matcha.webp', 4),
('Đồ ăn', 'food', '/static/icons-optimized/category-food.webp', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES
(1, 'Cà phê đen', 'Cà phê đen truyền thống', 25000, '/static/icons-optimized/product-square-1.webp', 1),
(1, 'Cà phê sữa', 'Cà phê sữa đậm đà', 30000, '/static/icons-optimized/product-square-2.webp', 2),
(2, 'Trà sữa trân châu', 'Trà sữa trân châu đường đen', 45000, '/static/icons-optimized/product-square-3.webp', 1),
(3, 'Nước cam ép', 'Nước cam tươi nguyên chất', 35000, '/static/icons-optimized/product-square-4.webp', 1),
(4, 'Matcha latte', 'Matcha latte béo ngậy', 55000, '/static/icons-optimized/product-square-5.webp', 1),
(5, 'Bánh tiramisu', 'Bánh tiramisu truyền thống', 40000, '/static/icons-optimized/product-square-6.webp', 1)
ON CONFLICT DO NOTHING;
