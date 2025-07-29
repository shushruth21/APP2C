import { useState, useEffect, useCallback } from 'react';
import {
  supabase,
  FurnitureCategory,
  SofaModel,
  ConfigurationAttribute,
  AttributeOption,
  FabricInventory,
  Order,
  OrderItem,
  Configuration,
  UserProfile,
  getFurnitureCategories,
  getSofaModels,
  getConfigurationAttributes,
  getAttributeOptions,
  getFabricInventory,
  createOrder,
  getUserOrders,
  getOrderItems,
  saveConfiguration,
  getUserConfigurations,
  getUserProfile,
  updateUserProfile,
} from '../lib/supabase';

// Custom hook for furniture categories
export const useFurnitureCategories = () => {
  const [categories, setCategories] = useState<FurnitureCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFurnitureCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: () => fetchCategories() };
};

// Custom hook for sofa models by category
export const useSofaModels = (categoryId: string | null) => {
  const [models, setModels] = useState<SofaModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    if (!categoryId) {
      setModels([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getSofaModels(categoryId);
      setModels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { models, loading, error, refetch: fetchModels };
};

// Custom hook for configuration attributes and options
export const useConfigurationAttributes = (categoryId: string | null) => {
  const [attributes, setAttributes] = useState<ConfigurationAttribute[]>([]);
  const [options, setOptions] = useState<Record<string, AttributeOption[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttributesAndOptions = useCallback(async () => {
    if (!categoryId) {
      setAttributes([]);
      setOptions({});
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch attributes
      const attributesData = await getConfigurationAttributes(categoryId);
      setAttributes(attributesData);

      // Fetch options for all attributes
      if (attributesData.length > 0) {
        const attributeIds = attributesData.map(attr => attr.id);
        const optionsData = await getAttributeOptions(attributeIds);

        // Group options by attribute_id
        const groupedOptions: Record<string, AttributeOption[]> = {};
        optionsData.forEach(option => {
          if (!groupedOptions[option.attribute_id]) {
            groupedOptions[option.attribute_id] = [];
          }
          groupedOptions[option.attribute_id].push(option);
        });

        setOptions(groupedOptions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration options');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchAttributesAndOptions();
  }, [fetchAttributesAndOptions]);

  return { attributes, options, loading, error, refetch: fetchAttributesAndOptions };
};

// Custom hook for fabric inventory
export const useFabricInventory = () => {
  const [fabrics, setFabrics] = useState<FabricInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFabrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFabricInventory();
      setFabrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fabric inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFabrics();
  }, [fetchFabrics]);

  const fabricsByCategory = React.useMemo(() => {
    const grouped: Record<string, FabricInventory[]> = {};
    fabrics.forEach(fabric => {
      if (!grouped[fabric.category]) {
        grouped[fabric.category] = [];
      }
      grouped[fabric.category].push(fabric);
    });
    return grouped;
  }, [fabrics]);

  return { fabrics, fabricsByCategory, loading, error, refetch: fetchFabrics };
};

// Custom hook for orders
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createNewOrder = useCallback(async (orderData: Parameters<typeof createOrder>[0]) => {
    try {
      const newOrder = await createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      throw err;
    }
  }, []);

  return { orders, loading, error, refetch: fetchOrders, createOrder: createNewOrder };
};

// Custom hook for order items
export const useOrderItems = (orderId: string | null) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!orderId) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getOrderItems(orderId);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order items');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
};

// Custom hook for saved configurations
export const useConfigurations = () => {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserConfigurations();
      setConfigurations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  const saveNewConfiguration = useCallback(async (configData: Parameters<typeof saveConfiguration>[0]) => {
    try {
      const newConfig = await saveConfiguration(configData);
      setConfigurations(prev => [newConfig, ...prev]);
      return newConfig;
    } catch (err) {
      throw err;
    }
  }, []);

  return { configurations, loading, error, refetch: fetchConfigurations, saveConfiguration: saveNewConfiguration };
};

// Custom hook for user profile
export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    try {
      const updatedProfile = await updateUserProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      throw err;
    }
  }, []);

  return { profile, loading, error, refetch: fetchProfile, updateProfile };
};

// Custom hook for authentication state
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};