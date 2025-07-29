import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useFurnitureCategories, useSofaModels, useConfigurationAttributes, useFabricInventory } from '../hooks/useSupabase';
import { CheckCircle, XCircle, AlertCircle, Database, Wifi } from 'lucide-react';

export const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [connectionError, setConnectionError] = useState<string>('');
  
  const { categories, loading: categoriesLoading, error: categoriesError } = useFurnitureCategories();
  const { models, loading: modelsLoading, error: modelsError } = useSofaModels(categories[0]?.id || null);
  const { attributes, options, loading: attributesLoading, error: attributesError } = useConfigurationAttributes(categories[0]?.id || null);
  const { fabrics, loading: fabricsLoading, error: fabricsError } = useFabricInventory();

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('furniture_categories').select('count').limit(1);
        if (error) throw error;
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('error');
        setConnectionError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    testConnection();
  }, []);

  const TestSection = ({ title, loading, error, data, icon }: {
    title: string;
    loading: boolean;
    error: string | null;
    data: any[];
    icon: React.ReactNode;
  }) => (
    <div className="bg-white rounded-lg p-4 border border-gold-500/30 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-semibold text-forest-green">{title}</h3>
        </div>
        <div className="flex items-center">
          {loading ? (
            <AlertCircle className="w-5 h-5 text-yellow-500 animate-spin" />
          ) : error ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>
      
      {loading && (
        <p className="text-sm text-gray-600">Loading...</p>
      )}
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          Error: {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className="text-sm text-gray-700">
          <p className="mb-2">✅ Loaded {data.length} items</p>
          {data.length > 0 && (
            <div className="bg-gray-50 p-2 rounded text-xs">
              <p><strong>Sample:</strong> {JSON.stringify(data[0], null, 2).slice(0, 200)}...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-forest-green mb-2">
          Supabase Integration Test
        </h1>
        <p className="text-forest-green/70">Testing database connection and data fetching</p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg p-6 border border-gold-500/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wifi className="w-6 h-6 text-forest-green" />
            <h2 className="text-xl font-semibold text-forest-green">Database Connection</h2>
          </div>
          <div className="flex items-center space-x-2">
            {connectionStatus === 'testing' && (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-500 animate-spin" />
                <span className="text-yellow-600">Testing...</span>
              </>
            )}
            {connectionStatus === 'connected' && (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600">Connected</span>
              </>
            )}
            {connectionStatus === 'error' && (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600">Error</span>
              </>
            )}
          </div>
        </div>
        
        {connectionError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <strong>Connection Error:</strong> {connectionError}
          </div>
        )}
        
        {connectionStatus === 'connected' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            ✅ Successfully connected to Supabase database
          </div>
        )}
      </div>

      {/* Data Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TestSection
          title="Furniture Categories"
          loading={categoriesLoading}
          error={categoriesError}
          data={categories}
          icon={<Database className="w-5 h-5 text-forest-green" />}
        />
        
        <TestSection
          title="Sofa Models"
          loading={modelsLoading}
          error={modelsError}
          data={models}
          icon={<Database className="w-5 h-5 text-forest-green" />}
        />
        
        <TestSection
          title="Configuration Attributes"
          loading={attributesLoading}
          error={attributesError}
          data={attributes}
          icon={<Database className="w-5 h-5 text-forest-green" />}
        />
        
        <TestSection
          title="Fabric Inventory"
          loading={fabricsLoading}
          error={fabricsError}
          data={fabrics}
          icon={<Database className="w-5 h-5 text-forest-green" />}
        />
      </div>

      {/* Configuration Options Test */}
      {Object.keys(options).length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gold-500/30 shadow-sm">
          <h3 className="font-semibold text-forest-green mb-3">Configuration Options</h3>
          <div className="text-sm text-gray-700">
            <p className="mb-2">✅ Loaded options for {Object.keys(options).length} attributes</p>
            <div className="bg-gray-50 p-2 rounded text-xs">
              <p><strong>Sample Options:</strong></p>
              {Object.entries(options).slice(0, 2).map(([attrId, opts]) => (
                <div key={attrId} className="mt-1">
                  <strong>Attribute {attrId}:</strong> {opts.map(o => o.label).join(', ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Environment Variables Check */}
      <div className="bg-white rounded-lg p-4 border border-gold-500/30 shadow-sm">
        <h3 className="font-semibold text-forest-green mb-3">Environment Variables</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>VITE_SUPABASE_URL:</span>
            <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>VITE_SUPABASE_ANON_KEY:</span>
            <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};