import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  address?: string;
  user_type: 'customer' | 'staff' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface FurnitureCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  image_url?: string;
  type: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SofaModel {
  id: string;
  name: string;
  category_id: string;
  base_price: number;
  image_url?: string;
  description?: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConfigurationAttribute {
  id: string;
  category_id: string;
  name: string;
  label: string;
  type: 'select' | 'multiselect' | 'toggle' | 'text';
  required: boolean;
  depends_on?: string;
  depends_value?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface AttributeOption {
  id: string;
  attribute_id: string;
  value: string;
  label: string;
  price_modifier: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface FabricInventory {
  id: string;
  code: string;
  description: string;
  company: string;
  collection: string;
  color: string;
  color_hex: string;
  price_per_meter: number;
  upgrade_charges: number;
  category: 'leather' | 'velvet' | 'linen' | 'cotton' | 'synthetic' | 'premium';
  texture?: string;
  durability: 'High' | 'Medium' | 'Premium';
  care_instructions?: string;
  in_stock: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'in_production' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  customer_notes?: string;
  staff_notes?: string;
  delivery_address?: string;
  delivery_date?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  category_id: string;
  model_id: string;
  configuration_data: Record<string, any>;
  item_price: number;
  quantity: number;
  fabric_cost: number;
  upgrade_cost: number;
  created_at: string;
}

export interface Configuration {
  id: string;
  user_id: string;
  category_id: string;
  model_id: string;
  name: string;
  configuration_data: Record<string, any>;
  total_price: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      }
    }
  });
  
  if (error) throw error;
  
  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: data.user.id,
        full_name: fullName,
        phone: phone,
        user_type: 'customer'
      });
    
    if (profileError) throw profileError;
  }
  
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Database helper functions
export const getFurnitureCategories = async (): Promise<FurnitureCategory[]> => {
  const { data, error } = await supabase
    .from('furniture_categories')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const getSofaModels = async (categoryId: string): Promise<SofaModel[]> => {
  const { data, error } = await supabase
    .from('sofa_models')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const getConfigurationAttributes = async (categoryId: string): Promise<ConfigurationAttribute[]> => {
  const { data, error } = await supabase
    .from('configuration_attributes')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const getAttributeOptions = async (attributeIds: string[]): Promise<AttributeOption[]> => {
  const { data, error } = await supabase
    .from('attribute_options')
    .select('*')
    .in('attribute_id', attributeIds)
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const getFabricInventory = async (): Promise<FabricInventory[]> => {
  const { data, error } = await supabase
    .from('fabric_inventory')
    .select('*')
    .eq('in_stock', true)
    .order('company', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const createOrder = async (orderData: {
  total_amount: number;
  customer_notes?: string;
  delivery_address?: string;
  items: {
    category_id: string;
    model_id: string;
    configuration_data: Record<string, any>;
    item_price: number;
    quantity: number;
    fabric_cost: number;
    upgrade_cost: number;
  }[];
}): Promise<Order> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  // Generate order number
  const orderNumber = `EST-${Date.now().toString().slice(-8)}`;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      total_amount: orderData.total_amount,
      customer_notes: orderData.customer_notes,
      delivery_address: orderData.delivery_address,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = orderData.items.map(item => ({
    ...item,
    order_id: order.id
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};

export const getUserOrders = async (): Promise<Order[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return data || [];
};

export const saveConfiguration = async (configData: {
  category_id: string;
  model_id: string;
  name: string;
  configuration_data: Record<string, any>;
  total_price: number;
}): Promise<Configuration> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('configurations')
    .insert({
      ...configData,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserConfigurations = async (): Promise<Configuration[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('configurations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No profile found
    throw error;
  }
  return data;
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .update(profileData)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};