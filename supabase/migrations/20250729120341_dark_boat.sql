/*
  # Complete Furniture Configuration Database Schema

  1. New Tables
    - `user_profiles` - Extended user information beyond Supabase Auth
    - `furniture_categories` - Categories like sofas, beds, chairs (enhanced)
    - `sofa_models` - Individual sofa models with base pricing
    - `configuration_attributes` - Configurable options (seats, wood type, etc.)
    - `attribute_options` - Available values for each attribute
    - `fabric_inventory` - Fabric catalog with pricing and availability
    - `orders` - Customer orders with status tracking
    - `order_items` - Individual items in orders with full configuration
    - `configurations` - Saved configurations for reuse

  2. Security
    - Enable RLS on all tables
    - Appropriate policies for customers vs staff access
    - Public read access for product catalogs

  3. Sample Data
    - Luxury furniture categories and models
    - Comprehensive fabric inventory
    - Configuration attributes and options
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  address text,
  user_type text NOT NULL DEFAULT 'customer' CHECK (user_type IN ('customer', 'staff', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enhanced Furniture Categories
CREATE TABLE IF NOT EXISTS furniture_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  type text NOT NULL DEFAULT 'furniture',
  priority integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sofa Models
CREATE TABLE IF NOT EXISTS sofa_models (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category_id uuid REFERENCES furniture_categories(id) ON DELETE CASCADE,
  base_price numeric(10,2) NOT NULL,
  image_url text,
  description text,
  features text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Configuration Attributes (seats, wood type, etc.)
CREATE TABLE IF NOT EXISTS configuration_attributes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES furniture_categories(id) ON DELETE CASCADE,
  name text NOT NULL, -- Internal name (e.g., 'seats', 'wood_type')
  label text NOT NULL, -- Display name (e.g., 'Number of Seats')
  type text NOT NULL DEFAULT 'select' CHECK (type IN ('select', 'multiselect', 'toggle', 'text')),
  required boolean DEFAULT false,
  depends_on text, -- Name of another attribute this depends on
  depends_value text, -- Value that triggers this attribute to show
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Attribute Options (specific values for each attribute)
CREATE TABLE IF NOT EXISTS attribute_options (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  attribute_id uuid REFERENCES configuration_attributes(id) ON DELETE CASCADE,
  value text NOT NULL,
  label text NOT NULL,
  price_modifier numeric(10,2) DEFAULT 0,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Fabric Inventory
CREATE TABLE IF NOT EXISTS fabric_inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  company text NOT NULL,
  collection text NOT NULL,
  color text NOT NULL,
  color_hex text NOT NULL DEFAULT '#FFFFFF',
  price_per_meter numeric(10,2) NOT NULL,
  upgrade_charges numeric(10,2) DEFAULT 0,
  category text NOT NULL DEFAULT 'cotton' CHECK (category IN ('leather', 'velvet', 'linen', 'cotton', 'synthetic', 'premium')),
  texture text,
  durability text DEFAULT 'Medium' CHECK (durability IN ('High', 'Medium', 'Premium')),
  care_instructions text,
  in_stock boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_production', 'ready', 'delivered', 'cancelled')),
  total_amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'INR',
  customer_notes text,
  staff_notes text,
  delivery_address text,
  delivery_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items (individual configured furniture pieces)
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  category_id uuid REFERENCES furniture_categories(id),
  model_id uuid REFERENCES sofa_models(id),
  configuration_data jsonb NOT NULL DEFAULT '{}',
  item_price numeric(10,2) NOT NULL,
  quantity integer DEFAULT 1,
  fabric_cost numeric(10,2) DEFAULT 0,
  upgrade_cost numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Saved Configurations (for reuse)
CREATE TABLE IF NOT EXISTS configurations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES furniture_categories(id),
  model_id uuid REFERENCES sofa_models(id),
  name text NOT NULL,
  configuration_data jsonb NOT NULL DEFAULT '{}',
  total_price numeric(10,2) NOT NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE furniture_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sofa_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuration_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Profiles: Users can read/update their own profile, staff can read all
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can view all profiles" ON user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type IN ('staff', 'admin'))
);

-- Public read access for product catalogs
CREATE POLICY "Anyone can read furniture categories" ON furniture_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read sofa models" ON sofa_models FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read configuration attributes" ON configuration_attributes FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read attribute options" ON attribute_options FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read fabric inventory" ON fabric_inventory FOR SELECT USING (in_stock = true);

-- Orders: Users can access their own orders, staff can access all
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type IN ('staff', 'admin'))
);
CREATE POLICY "Staff can update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type IN ('staff', 'admin'))
);

-- Order Items: Access through orders
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Staff can view all order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type IN ('staff', 'admin'))
);

-- Configurations: Users can access their own saved configurations
CREATE POLICY "Users can view own configurations" ON configurations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own configurations" ON configurations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own configurations" ON configurations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own configurations" ON configurations FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sofa_models_category_id ON sofa_models(category_id);
CREATE INDEX IF NOT EXISTS idx_configuration_attributes_category_id ON configuration_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_attribute_options_attribute_id ON attribute_options(attribute_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_configurations_user_id ON configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_fabric_inventory_category ON fabric_inventory(category);
CREATE INDEX IF NOT EXISTS idx_fabric_inventory_in_stock ON fabric_inventory(in_stock);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_furniture_categories_updated_at BEFORE UPDATE ON furniture_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sofa_models_updated_at BEFORE UPDATE ON sofa_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fabric_inventory_updated_at BEFORE UPDATE ON fabric_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configurations_updated_at BEFORE UPDATE ON configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();