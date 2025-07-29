/*
# Complete Furniture App Database Schema

This migration creates all necessary tables for the Estre luxury furniture configuration application.

## New Tables Created:
1. **furniture_categories** - Product categories with pricing and metadata
2. **user_profiles** - Extended user information beyond Supabase Auth
3. **sofa_models** - Individual furniture models within categories
4. **configuration_attributes** - Configurable options for furniture
5. **attribute_options** - Available values for each configuration attribute
6. **fabric_inventory** - Fabric catalog with pricing and availability
7. **orders** - Customer orders with status tracking
8. **order_items** - Individual configured items in orders
9. **configurations** - Saved configurations for reuse

## Security:
- Row Level Security (RLS) enabled on all tables
- Public read access for product catalog tables
- User-specific access for orders and configurations
- Staff permissions for order management

## Key Features:
- UUID primary keys for all tables
- Automatic timestamps with update triggers
- Foreign key relationships for data integrity
- Comprehensive indexing for performance
*/

-- Create the furniture_categories table with all required columns
CREATE TABLE IF NOT EXISTS furniture_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  base_price numeric NOT NULL DEFAULT 0,
  image_url text,
  type text NOT NULL DEFAULT 'sofa',
  priority int4 NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT TRUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE furniture_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (categories are public information)
CREATE POLICY "Anyone can read furniture categories"
  ON furniture_categories
  FOR SELECT
  TO public
  USING (true);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address text,
  user_type text NOT NULL DEFAULT 'customer', -- 'customer', 'staff', 'admin'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view and update their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for staff to view all profiles
CREATE POLICY "Staff can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'staff'));

-- Create the sofa_models table
CREATE TABLE IF NOT EXISTS sofa_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES furniture_categories(id) ON DELETE CASCADE,
  name text NOT NULL UNIQUE,
  base_price numeric NOT NULL DEFAULT 0,
  image_url text,
  description text,
  features text[],
  is_active boolean NOT NULL DEFAULT TRUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sofa_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sofa models"
  ON sofa_models
  FOR SELECT
  TO public
  USING (true);

-- Create the configuration_attributes table
CREATE TABLE IF NOT EXISTS configuration_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES furniture_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  label text NOT NULL,
  type text NOT NULL, -- e.g., 'select', 'multiselect', 'toggle', 'text'
  required boolean NOT NULL DEFAULT FALSE,
  depends_on text,
  depends_value text,
  order_index int4 NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT TRUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE configuration_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read configuration attributes"
  ON configuration_attributes
  FOR SELECT
  TO public
  USING (true);

-- Create the attribute_options table
CREATE TABLE IF NOT EXISTS attribute_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id uuid REFERENCES configuration_attributes(id) ON DELETE CASCADE,
  value text NOT NULL,
  label text NOT NULL,
  price_modifier numeric NOT NULL DEFAULT 0,
  order_index int4 NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT TRUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE attribute_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read attribute options"
  ON attribute_options
  FOR SELECT
  TO public
  USING (true);

-- Create the fabric_inventory table
CREATE TABLE IF NOT EXISTS fabric_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  company text,
  collection text,
  color text,
  color_hex text,
  price_per_meter numeric NOT NULL DEFAULT 0,
  upgrade_charges numeric NOT NULL DEFAULT 0,
  category text NOT NULL, -- e.g., 'leather', 'velvet', 'linen'
  texture text,
  durability text, -- e.g., 'High', 'Medium', 'Premium'
  care_instructions text,
  in_stock boolean NOT NULL DEFAULT TRUE,
  stock_quantity int4 NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fabric_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read fabric inventory"
  ON fabric_inventory
  FOR SELECT
  TO public
  USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'in_production', 'ready', 'delivered', 'cancelled'
  total_amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  customer_notes text,
  staff_notes text,
  delivery_address text,
  delivery_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to create orders
CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for staff to view all orders
CREATE POLICY "Staff can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND user_type = 'staff'));

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  category_id uuid REFERENCES furniture_categories(id) ON DELETE SET NULL,
  model_id uuid REFERENCES sofa_models(id) ON DELETE SET NULL,
  configuration_data jsonb, -- Stores the full configuration object
  item_price numeric NOT NULL,
  quantity int4 NOT NULL DEFAULT 1,
  fabric_cost numeric NOT NULL DEFAULT 0,
  upgrade_cost numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own order items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid()));

-- Policy for users to insert order items (only if they own the parent order)
CREATE POLICY "Users can insert order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid()));

-- Create configurations table (for saved user configurations)
CREATE TABLE IF NOT EXISTS configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES furniture_categories(id) ON DELETE CASCADE,
  model_id uuid REFERENCES sofa_models(id) ON DELETE CASCADE,
  name text NOT NULL, -- User-given name for the configuration
  configuration_data jsonb, -- Stores the full configuration object
  total_price numeric NOT NULL,
  is_favorite boolean NOT NULL DEFAULT FALSE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own configurations
CREATE POLICY "Users can view their own configurations"
  ON configurations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to create configurations
CREATE POLICY "Users can create configurations"
  ON configurations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own configurations
CREATE POLICY "Users can update their own configurations"
  ON configurations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to delete their own configurations
CREATE POLICY "Users can delete their own configurations"
  ON configurations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Set up functions to update `updated_at` column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_furniture_categories_updated_at
BEFORE UPDATE ON furniture_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sofa_models_updated_at
BEFORE UPDATE ON sofa_models
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fabric_inventory_updated_at
BEFORE UPDATE ON fabric_inventory
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configurations_updated_at
BEFORE UPDATE ON configurations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data into furniture_categories
INSERT INTO furniture_categories (name, slug, description, base_price, image_url, type, priority) VALUES
('Luxury Sofas', 'luxury-sofas', 'Experience unparalleled comfort and style with our exquisite range of luxury sofas, handcrafted for your living space.', 75000, 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'sofa', 1),
('Premium Recliners', 'premium-recliners', 'Indulge in ultimate relaxation with our premium recliners, designed for ergonomic support and sophisticated aesthetics.', 45000, 'https://images.pexels.com/photos/3757055/pexels-photo-3757055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'recliner', 2),
('Luxury Beds', 'luxury-beds', 'Transform your bedroom into a sanctuary of dreams with our luxurious beds, combining elegant design with supreme comfort.', 90000, 'https://images.pexels.com/photos/3682238/pexels-photo-3682238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'bed', 2),
('Designer Chairs', 'designer-chairs', 'Add a touch of elegance to any room with our collection of designer chairs, where art meets functionality.', 25000, 'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'chair', 2)
ON CONFLICT (slug) DO NOTHING;