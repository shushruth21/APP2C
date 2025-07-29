/*
  # Create furniture_categories table

  1. New Tables
    - `furniture_categories`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Category name (e.g. Sofa Luxury)
      - `priority` (int4, not null) - Used for sorting categories
      - `created_at` (timestamptz, default now()) - Optional timestamp field

  2. Security
    - Enable RLS on `furniture_categories` table
    - Add policy for public read access to furniture categories

  3. Sample Data
    - Insert initial furniture categories: SOFA LUXURY, RECLINER, ARM CHAIR
*/

-- Create the furniture_categories table
CREATE TABLE IF NOT EXISTS furniture_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  priority int4 NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE furniture_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (categories are public information)
CREATE POLICY "Anyone can read furniture categories"
  ON furniture_categories
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO furniture_categories (id, name, priority) VALUES
  (gen_random_uuid(), 'SOFA LUXURY', 1),
  (gen_random_uuid(), 'RECLINER', 2),
  (gen_random_uuid(), 'ARM CHAIR', 3);