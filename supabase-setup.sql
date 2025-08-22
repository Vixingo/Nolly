-- E-commerce Database Setup for Supabase
-- Run this script in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category VARCHAR(100),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

  -- Create store_settings table
  CREATE TABLE IF NOT EXISTS store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name VARCHAR(255) NOT NULL,
    store_description TEXT,
    store_logo_url TEXT,
    store_email VARCHAR(255) NOT NULL,
    store_phone VARCHAR(50) NOT NULL,
    store_address TEXT NOT NULL,
    store_city VARCHAR(100) NOT NULL,
    store_state VARCHAR(100) NOT NULL,
    store_zip VARCHAR(20) NOT NULL,
    store_country VARCHAR(100) NOT NULL DEFAULT 'United States',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/New_York',
    facebook_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    terms_of_service TEXT,
    privacy_policy TEXT,
    return_policy TEXT,
    shipping_policy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation and premium sound quality.', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Electronics', 50),
('Organic Cotton T-Shirt', 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'Clothing', 100),
('Stainless Steel Water Bottle', 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.', 24.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 'Accessories', 75),
('Bluetooth Speaker', 'Portable Bluetooth speaker with excellent sound quality and long battery life.', 79.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 'Electronics', 30),
('Yoga Mat', 'Non-slip yoga mat perfect for all types of yoga and exercise routines.', 39.99, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', 'Fitness', 40),
('Coffee Mug Set', 'Set of 4 ceramic coffee mugs with beautiful designs, perfect for daily use.', 34.99, 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500', 'Home & Kitchen', 60)
ON CONFLICT DO NOTHING;

-- Sample store settings (you can modify these values)
INSERT INTO store_settings (
  store_name,
  store_description,
  store_email,
  store_phone,
  store_address,
  store_city,
  store_state,
  store_zip,
  store_country,
  currency,
  timezone
) VALUES (
  'Nolly Store',
  'Your one-stop shop for premium products and exceptional customer service.',
  'hello@nollystore.com',
  '+1 (555) 123-4567',
  '123 Commerce Street',
  'New York',
  'NY',
  '10001',
  'United States',
  'USD',
  'America/New_York'
)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to products and store settings
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Store settings are viewable by everyone" ON store_settings
  FOR SELECT USING (true);

-- Create policies for orders (public can insert, admins can view/update)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Admin policies (you'll need to set up authentication for these)
-- These policies assume you have proper authentication set up
-- You may need to modify these based on your auth setup

-- Allow authenticated users to manage products
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow authenticated users to view and update orders
CREATE POLICY "Authenticated users can view orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to view order items
CREATE POLICY "Authenticated users can view order items" ON order_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage admin users
CREATE POLICY "Authenticated users can manage admin users" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage store settings
CREATE POLICY "Authenticated users can manage store settings" ON store_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
  (SELECT COUNT(*) FROM orders) as total_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled') as total_revenue,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders;

-- Grant access to the view
GRANT SELECT ON dashboard_stats TO authenticated, anon;

-- Create a function to get monthly revenue
CREATE OR REPLACE FUNCTION get_monthly_revenue()
RETURNS TABLE(month TEXT, revenue DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(created_at, 'YYYY-MM') as month,
    COALESCE(SUM(total_amount), 0) as revenue
  FROM orders 
  WHERE status != 'cancelled'
    AND created_at >= NOW() - INTERVAL '12 months'
  GROUP BY TO_CHAR(created_at, 'YYYY-MM')
  ORDER BY month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_monthly_revenue() TO authenticated, anon;

-- Create a function to get top products
CREATE OR REPLACE FUNCTION get_top_products(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
  product_id UUID,
  product_name VARCHAR,
  total_sold BIGINT,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as product_id,
    p.name as product_name,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
  FROM products p
  LEFT JOIN order_items oi ON p.id = oi.product_id
  LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
  WHERE p.is_active = true
  GROUP BY p.id, p.name
  ORDER BY total_sold DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_top_products(INTEGER) TO authenticated, anon;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created: products, orders, order_items, admin_users, store_settings';
  RAISE NOTICE 'Sample data inserted for products and store settings';
  RAISE NOTICE 'Row Level Security enabled with appropriate policies';
  RAISE NOTICE 'Dashboard views and functions created';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Set up authentication in your Supabase project';
  RAISE NOTICE '2. Configure your environment variables';
  RAISE NOTICE '3. Test the application with the sample data';
  RAISE NOTICE '4. Customize store settings through the admin panel';
END $$;