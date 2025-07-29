/*
  # Seed Data for Furniture Configuration App
  
  This file populates the database with sample data for:
  - Furniture categories
  - Sofa models
  - Configuration attributes and options
  - Fabric inventory
*/

-- Insert Furniture Categories
INSERT INTO furniture_categories (id, name, slug, description, base_price, image_url, type, priority) VALUES
  (uuid_generate_v4(), 'Luxury Sofas', 'luxury-sofas', 'Premium handcrafted sofas with customizable configurations', 45000, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'sofa', 1),
  (uuid_generate_v4(), 'Premium Recliners', 'premium-recliners', 'Comfortable recliners with premium materials and advanced features', 35000, 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'recliner', 2),
  (uuid_generate_v4(), 'Luxury Beds', 'luxury-beds', 'Elegant beds with premium comfort and sophisticated design', 55000, 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'bed', 2),
  (uuid_generate_v4(), 'Designer Chairs', 'designer-chairs', 'Stylish chairs combining comfort with contemporary design', 25000, 'https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'chair', 2);

-- Get category IDs for reference
DO $$
DECLARE
    sofa_category_id uuid;
    recliner_category_id uuid;
    bed_category_id uuid;
    chair_category_id uuid;
BEGIN
    SELECT id INTO sofa_category_id FROM furniture_categories WHERE slug = 'luxury-sofas';
    SELECT id INTO recliner_category_id FROM furniture_categories WHERE slug = 'premium-recliners';
    SELECT id INTO bed_category_id FROM furniture_categories WHERE slug = 'luxury-beds';
    SELECT id INTO chair_category_id FROM furniture_categories WHERE slug = 'designer-chairs';

    -- Insert Sofa Models
    INSERT INTO sofa_models (name, category_id, base_price, image_url, description, features) VALUES
      ('Dale', sofa_category_id, 45000, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'Classic design with premium comfort and elegant styling', ARRAY['Premium Fabric', 'Solid Wood Frame', 'High Density Foam']),
      ('Decker', sofa_category_id, 52000, 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'Modern minimalist design with superior craftsmanship', ARRAY['Contemporary Design', 'Premium Materials', 'Ergonomic Support']),
      ('Crave', sofa_category_id, 58000, 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'Luxurious comfort meets sophisticated design', ARRAY['Luxury Finish', 'Custom Configurations', 'Premium Comfort']),
      ('Dapper', sofa_category_id, 65000, 'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'Premium luxury sofa with exceptional attention to detail', ARRAY['Handcrafted Excellence', 'Premium Leather Options', 'Lifetime Warranty']),
      ('Conrad', sofa_category_id, 48000, 'https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop', 'Comfortable family sofa with durable construction', ARRAY['Family Friendly', 'Durable Materials', 'Easy Maintenance']);

    -- Insert Configuration Attributes for Sofas
    INSERT INTO configuration_attributes (category_id, name, label, type, required, order_index) VALUES
      (sofa_category_id, 'seats', 'Number of Seats', 'select', true, 1),
      (sofa_category_id, 'needsLounger', 'Do you need lounger?', 'select', false, 2),
      (sofa_category_id, 'loungerPosition', 'Lounger Position', 'select', false, 3),
      (sofa_category_id, 'loungerLength', 'Lounger Length', 'select', false, 4),
      (sofa_category_id, 'seatWidth', 'Seat Width', 'select', false, 5),
      (sofa_category_id, 'armRestType', 'Arm Rest Type', 'select', false, 6),
      (sofa_category_id, 'needsConsole', 'Do you need console/s?', 'select', false, 7),
      (sofa_category_id, 'consoleCount', 'How many consoles?', 'select', false, 8),
      (sofa_category_id, 'consoleType', 'Console Type', 'select', false, 9),
      (sofa_category_id, 'needsCorner', 'Do you need Corner unit?', 'select', false, 10),
      (sofa_category_id, 'seatDepth', 'Seat Depth', 'select', false, 11),
      (sofa_category_id, 'seatHeight', 'Seat Height', 'select', false, 12),
      (sofa_category_id, 'woodType', 'Wood Type', 'select', false, 13),
      (sofa_category_id, 'seatFoam', 'Foam Type - Seats', 'select', false, 14),
      (sofa_category_id, 'backFoam', 'Foam Type - Back Rest', 'select', false, 15),
      (sofa_category_id, 'fabricPlan', 'Fabric Cladding Plan', 'select', false, 16),
      (sofa_category_id, 'legs', 'Legs', 'select', false, 17),
      (sofa_category_id, 'accessories', 'Accessories', 'multiselect', false, 18),
      (sofa_category_id, 'stitchingType', 'Stitching Type', 'select', false, 19);

    -- Set dependencies for conditional attributes
    UPDATE configuration_attributes SET depends_on = 'needsLounger', depends_value = 'Yes' 
    WHERE name IN ('loungerPosition', 'loungerLength') AND category_id = sofa_category_id;
    
    UPDATE configuration_attributes SET depends_on = 'needsConsole', depends_value = 'Yes' 
    WHERE name IN ('consoleCount', 'consoleType') AND category_id = sofa_category_id;

END $$;

-- Insert Attribute Options
DO $$
DECLARE
    attr_id uuid;
BEGIN
    -- Seats options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'seats';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '2', '2 Seater', 0, 1),
      (attr_id, '3', '3 Seater', 15000, 2),
      (attr_id, '2+3', '2+3 Seater Set', 25000, 3);

    -- Lounger need options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'needsLounger';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'Yes', 'Yes', 18000, 1),
      (attr_id, 'No', 'No', 0, 2);

    -- Lounger position options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'loungerPosition';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'Right Hand Side', 'Right Hand Side (picture)', 0, 1),
      (attr_id, 'Left Hand Side', 'Left Hand Side (picture)', 0, 2);

    -- Lounger length options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'loungerLength';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '5.5 feet', '5.5 (Five and a half) feet', 0, 1),
      (attr_id, '6 feet', '6 (Six) feet', 2000, 2),
      (attr_id, '6.5 feet', '6.5 (Six and a half) feet', 4000, 3),
      (attr_id, '7 feet', '7 (Seven) feet', 6000, 4);

    -- Seat width options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'seatWidth';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '22 inches', '22" (Twenty-two inches)', 0, 1),
      (attr_id, '24 inches', '24" (Twenty-four inches)', 2000, 2),
      (attr_id, '26 inches', '26" (Twenty-six inches)', 4000, 3),
      (attr_id, '28 inches', '28" (Twenty-eight inches)', 6000, 4);

    -- Arm rest type options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'armRestType';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'Default', 'Default', 0, 1),
      (attr_id, 'Box', 'Box', 3000, 2),
      (attr_id, 'Ocean', 'Ocean', 5000, 3),
      (attr_id, 'Smug', 'Smug', 4000, 4);

    -- Console need options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'needsConsole';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'Yes', 'Yes', 0, 1),
      (attr_id, 'No', 'No', 0, 2);

    -- Console count options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'consoleCount';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '1', '1 (One)', 4000, 1),
      (attr_id, '2', '2 (Two)', 8000, 2);

    -- Console type options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'consoleType';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '6 inches', '6" (Six inches)', 0, 1),
      (attr_id, '8 inches', '8" (Eight inches)', 1500, 2),
      (attr_id, '10 inches', '10" (Ten inches)', 3000, 3);

    -- Corner unit options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'needsCorner';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'Yes', 'Yes', 15000, 1),
      (attr_id, 'No', 'No', 0, 2);

    -- Seat depth options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'seatDepth';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '22 inches', '22" (Twenty-two inches)', 0, 1),
      (attr_id, '24 inches', '24" (Twenty-four inches)', 2000, 2);

    -- Seat height options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'seatHeight';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '16 inches', '16" (Sixteen inches)', 0, 1),
      (attr_id, '18 inches', '18" (Eighteen inches)', 2000, 2);

    -- Wood type options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'woodType';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'Neem', 'Neem', 0, 1),
      (attr_id, 'Pine', 'Pine', 8000, 2);

    -- Seat foam options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'seatFoam';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '20-D SSG', '20-D SSG', 0, 1),
      (attr_id, '32-D P', '32-D P', 5000, 2),
      (attr_id, '40-D U/R', '40-D U/R', 8000, 3),
      (attr_id, 'Candy C', 'Candy C', 12000, 4);

    -- Back foam options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'backFoam';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, '20-D SSG', '20-D SSG', 0, 1),
      (attr_id, '32-D P', '32-D P', 3000, 2);

    -- Fabric plan options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'fabricPlan';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'Single Colour', 'Single Colour', 0, 1),
      (attr_id, 'Dual Colour', 'Dual Colour', 8000, 2),
      (attr_id, 'Tri Colour', 'Tri Colour', 15000, 3);

    -- Legs options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'legs';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'Stainless Steel', 'Stainless Steel', 5000, 1),
      (attr_id, 'Mild Steel Black', 'Mild Steel - Black', 2000, 2),
      (attr_id, 'Wood Teak', 'Wood - Teak', 8000, 3),
      (attr_id, 'Wood Walnut', 'Wood - Walnut', 10000, 4),
      (attr_id, 'Golden', 'Golden', 12000, 5);

    -- Accessories options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'accessories';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'USB', 'USB Charging Port', 3000, 1),
      (attr_id, 'Cup Holder', 'Cup Holder', 2000, 2),
      (attr_id, 'Storage', 'Storage Compartment', 5000, 3),
      (attr_id, 'LED Lighting', 'LED Lighting', 8000, 4);

    -- Stitching type options
    SELECT id INTO attr_id FROM configuration_attributes WHERE name = 'stitchingType';
    INSERT INTO attribute_options (attribute_id, value, label, price_modifier, order_index) VALUES
      (attr_id, 'S1', 'Standard Stitching (S1)', 0, 1),
      (attr_id, 'S2', 'Premium Stitching (S2)', 3000, 2),
      (attr_id, 'S3', 'Luxury Stitching (S3)', 6000, 3);

END $$;

-- Insert Fabric Inventory
INSERT INTO fabric_inventory (code, description, company, collection, color, color_hex, price_per_meter, upgrade_charges, category, texture, durability, care_instructions, in_stock, stock_quantity) VALUES
  -- Premium Leather Collection
  ('LEA-LUX-001', 'Premium Italian Nappa Leather', 'Natuzzi Italia', 'Luxury Leather', 'Midnight Black', '#1a1a1a', 2800, 450, 'leather', 'Smooth Grain', 'Premium', 'Professional cleaning recommended', true, 50),
  ('LEA-LUX-002', 'Hand-Finished Cognac Leather', 'Natuzzi Italia', 'Luxury Leather', 'Cognac Brown', '#8B4513', 2650, 420, 'leather', 'Natural Grain', 'Premium', 'Leather conditioner monthly', true, 35),
  ('LEA-LUX-003', 'Vintage Distressed Leather', 'Natuzzi Italia', 'Luxury Leather', 'Vintage Tan', '#D2B48C', 2950, 480, 'leather', 'Distressed', 'Premium', 'Avoid direct sunlight', true, 25),

  -- Royal Velvet Collection
  ('VEL-ROY-001', 'Royal Emerald Velvet', 'Designers Guild', 'Royal Velvet', 'Emerald Green', '#50C878', 1850, 280, 'velvet', 'Plush Pile', 'High', 'Professional dry clean only', true, 40),
  ('VEL-ROY-002', 'Deep Navy Velvet', 'Designers Guild', 'Royal Velvet', 'Deep Navy', '#000080', 1750, 260, 'velvet', 'Crushed Velvet', 'High', 'Vacuum regularly with soft brush', true, 45),
  ('VEL-ROY-003', 'Champagne Gold Velvet', 'Designers Guild', 'Royal Velvet', 'Champagne Gold', '#F7E7CE', 1950, 300, 'velvet', 'Silk Velvet', 'Premium', 'Professional cleaning required', true, 30),

  -- Natural Linen Collection
  ('LIN-NAT-001', 'Belgian Natural Linen', 'Libeco Home', 'Natural Linen', 'Natural Beige', '#F5F5DC', 1200, 180, 'linen', 'Woven', 'High', 'Machine washable, gentle cycle', true, 60),
  ('LIN-NAT-002', 'Sage Green Linen', 'Libeco Home', 'Natural Linen', 'Sage Green', '#9CAF88', 1150, 170, 'linen', 'Textured Weave', 'High', 'Iron while damp for best results', true, 55),
  ('LIN-NAT-003', 'Stone Grey Linen', 'Libeco Home', 'Natural Linen', 'Stone Grey', '#8C8C8C', 1180, 175, 'linen', 'Fine Weave', 'High', 'Avoid bleach, air dry', true, 50),

  -- Cotton Blend Collection
  ('COT-BLE-001', 'Premium Cotton Blend', 'Kravet', 'Cotton Blend', 'Cream White', '#FFFDD0', 850, 120, 'cotton', 'Smooth', 'Medium', 'Machine washable, warm water', true, 80),
  ('COT-BLE-002', 'Charcoal Cotton Blend', 'Kravet', 'Cotton Blend', 'Charcoal Grey', '#36454F', 820, 115, 'cotton', 'Textured', 'Medium', 'Cold wash, tumble dry low', true, 75),
  ('COT-BLE-003', 'Terracotta Cotton Blend', 'Kravet', 'Cotton Blend', 'Terracotta', '#E2725B', 880, 125, 'cotton', 'Canvas Weave', 'High', 'Fade resistant, easy care', true, 65),

  -- Synthetic Premium Collection
  ('SYN-PRE-001', 'Microfiber Suede', 'Ultrafabrics', 'Synthetic Premium', 'Mocha Brown', '#8B4513', 950, 140, 'synthetic', 'Suede-like', 'High', 'Stain resistant, easy clean', true, 70),
  ('SYN-PRE-002', 'Performance Fabric', 'Ultrafabrics', 'Synthetic Premium', 'Ocean Blue', '#006994', 1050, 155, 'synthetic', 'Smooth', 'Premium', 'Water resistant, antimicrobial', true, 60),
  ('SYN-PRE-003', 'Eco-Friendly Synthetic', 'Ultrafabrics', 'Synthetic Premium', 'Forest Green', '#228B22', 1120, 165, 'synthetic', 'Textured', 'Premium', 'Sustainable, easy maintenance', true, 45);