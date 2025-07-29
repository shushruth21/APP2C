import React, { useState, useEffect } from 'react';
import { ChevronDown, Info, ShoppingCart, Save, Eye, Palette, Settings, Ruler } from 'lucide-react';
import { PriceCalculator } from './PriceCalculator';
import { FabricSelector } from './FabricSelector';
import { useCart } from './CartManager';
import { ErrorBoundary, DataErrorFallback } from './ErrorBoundary';
import { LoadingSpinner, ConfigurationSkeleton } from './LoadingSpinner';
import { useConfigurationAttributes, useSofaModels } from '../hooks/useSupabase';
import { useFurnitureCategories, useConfigurations } from '../hooks/useSupabase';

interface ConfigurationSectionProps {
  selectedCategory: string;
}

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({ selectedCategory }) => {
  const { addToCart } = useCart();
  const { categories } = useFurnitureCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { models, loading: modelsLoading } = useSofaModels(selectedCategoryId);
  const { attributes, options, loading: attributesLoading } = useConfigurationAttributes(selectedCategoryId);
  const { saveConfiguration, loading: saving } = useConfigurations();
  const [isSaving, setIsSaving] = useState(false);
  const [fabricCosts, setFabricCosts] = useState({ fabricCost: 0, upgradeCost: 0 });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    dimensions: false,
    comfort: false,
    materials: false,
    aesthetics: false,
  });

  // Find category ID from slug
  useEffect(() => {
    if (categories.length > 0) {
      const category = categories.find(cat => 
        cat.slug === selectedCategory.toLowerCase().replace(/\s+/g, '-')
      );
      setSelectedCategoryId(category?.id || null);
    }
  }, [categories, selectedCategory]);

  const [config, setConfig] = useState({
    category: selectedCategory,
    sofaModel: '',
    fabricPlan: 'Single Colour',
    fabricCodes: [''],
  });

  // Initialize config with first model when models load
  useEffect(() => {
    if (models.length > 0 && !config.sofaModel) {
      setConfig(prev => ({ ...prev, sofaModel: models[0].name }));
    }
  }, [models, config.sofaModel]);

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Check if field should be visible based on dependencies
  const isFieldVisible = (attribute: any) => {
    if (!attribute.depends_on || !attribute.depends_value) return true;
    return config[attribute.depends_on] === attribute.depends_value;
  };

  const handleFabricPriceUpdate = (fabricCost: number, upgradeCost: number) => {
    setFabricCosts({ fabricCost, upgradeCost });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const calculatePrice = () => {
    // Find selected model
    const selectedModel = models.find(model => model.name === config.sofaModel);
    let basePrice = selectedModel?.base_price || 45000;

    // Calculate price modifiers from selected options
    attributes.forEach(attribute => {
      const selectedValue = config[attribute.name];
      if (selectedValue && options[attribute.id]) {
        const selectedOption = options[attribute.id].find(opt => opt.value === selectedValue);
        if (selectedOption) {
          basePrice += selectedOption.price_modifier;
        }
      }
    });
    
    // Add fabric costs
    basePrice += fabricCosts.fabricCost + fabricCosts.upgradeCost;
    
    return Math.round(basePrice);
  };

  const handleAddToCart = () => {
    const price = calculatePrice();
    addToCart(config.sofaModel, config, price);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSaveConfiguration = async () => {
    if (!selectedCategoryId) return;
    
    try {
      const selectedModel = models.find(model => model.name === config.sofaModel);
      if (!selectedModel) return;

      await saveConfiguration(
        'guest-user', // In real app, get from auth context
        selectedCategoryId,
        selectedModel.id,
        config,
        calculatePrice()
      );
      
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  const SelectField = React.memo(({ 
    label, 
    value, 
    options, 
    onChange, 
    disabled = false,
    icon,
    loading = false
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    loading?: boolean;
  }) => (
    <div className="space-y-2">
      <label className="block text-rich-brown-800 font-body text-xs sm:text-sm font-medium flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {loading && <LoadingSpinner size="sm" className="ml-2" />}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className={`
          w-full bg-desert-sand border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-rich-brown-800 font-body h-10 sm:h-12 text-sm sm:text-base shadow-parchment
          focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 focus:border-champagne-gold transition-all duration-300 ease-in-out
          ${disabled || loading
            ? 'border-champagne-gold/20 opacity-50 cursor-not-allowed bg-champagne-gold/5' 
            : 'border-champagne-gold/30 hover:border-champagne-gold/50'
          }
        `}
      >
        {options.map(option => (
          <option key={option} value={option} className="bg-desert-sand text-rich-brown-800">
            {option}
          </option>
        ))}
      </select>
    </div>
  ));

  const ConfigSection = React.memo(({ 
    title, 
    sectionKey, 
    icon, 
    children 
  }: {
    title: string;
    sectionKey: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="bg-desert-sand rounded-xl sm:rounded-2xl border border-champagne-gold/30 overflow-hidden shadow-luxury shadow-parchment">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-champagne-gold/10 transition-colors duration-300 ease-in-out"
      >
        <div className="flex items-center space-x-3">
          <div className="text-champagne-gold">{icon}</div>
          <h3 className="text-rich-brown-800 font-display text-lg sm:text-xl font-bold">{title}</h3>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-champagne-gold transition-transform duration-300 ease-in-out ${
            expandedSections[sectionKey] ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      <div className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${expandedSections[sectionKey] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="p-4 sm:p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {children}
        </div>
      </div>
    </div>
  ));

  if (attributesLoading || modelsLoading) {
    return (
      <div className="space-y-8 relative">
        <div className="text-center mb-8 px-4">
          <div className="h-8 bg-champagne-gold/20 rounded w-96 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-champagne-gold/20 rounded w-64 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-0">
          <div className="lg:col-span-3">
            <ConfigurationSkeleton />
          </div>
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="h-32 bg-champagne-gold/20 rounded-2xl animate-pulse" />
              <div className="h-64 bg-champagne-gold/20 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8 relative">
        <div className="text-center mb-8 px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display text-rich-brown-800 mb-4 font-bold">Configure Your {selectedCategory}</h2>
          <p className="text-warm-grey-600 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">Customize every detail to match your vision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-0">
          <>
          {/* Configuration Sections */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Model Selection */}
            <ConfigSection title="Model Selection" sectionKey="basic" icon={<Eye className="w-6 h-6" />}>
              <SelectField
                label="Sofa Model"
                value={config.sofaModel}
                options={models.map(model => model.name)}
                onChange={(value) => updateConfig('sofaModel', value)}
                icon={<Eye className="w-4 h-4" />}
                loading={modelsLoading}
              />
            </ConfigSection>

            {/* Dynamic Configuration Sections */}
            {attributes.length > 0 && (
              <>
                {/* Group attributes by section */}
                {['basic', 'dimensions', 'comfort', 'materials'].map(sectionKey => {
                  const sectionAttributes = attributes.filter(attr => 
                    attr.name.toLowerCase().includes(sectionKey) || 
                    (sectionKey === 'basic' && !['dimensions', 'comfort', 'materials'].some(s => attr.name.toLowerCase().includes(s)))
                  );
                  
                  if (sectionAttributes.length === 0) return null;
                  
                  const sectionIcons = {
                    basic: <Settings className="w-6 h-6" />,
                    dimensions: <Ruler className="w-6 h-6" />,
                    comfort: <Info className="w-6 h-6" />,
                    materials: <Settings className="w-6 h-6" />
                  };
                  
                  const sectionTitles = {
                    basic: 'Basic Configuration',
                    dimensions: 'Dimensions & Sizing',
                    comfort: 'Comfort & Support',
                    materials: 'Materials & Structure'
                  };
                  
                  return (
                    <ConfigSection 
                      key={sectionKey}
                      title={sectionTitles[sectionKey as keyof typeof sectionTitles]} 
                      sectionKey={sectionKey} 
                      icon={sectionIcons[sectionKey as keyof typeof sectionIcons]}
                    >
                      {sectionAttributes.map(attribute => {
                        if (!isFieldVisible(attribute)) return null;
                        
                        const attributeOptions = options[attribute.id] || [];
                        const currentValue = config[attribute.name] || (attributeOptions[0]?.value || '');
                        
                        if (attribute.type === 'multiselect') {
                          return (
                            <div key={attribute.id} className="md:col-span-2 space-y-3">
                              <label className="block text-rich-brown-800 font-body text-sm font-medium">
                                {attribute.label}
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {attributeOptions.map(option => (
                                  <button
                                    key={option.id}
                                    onClick={() => {
                                      const currentValues = config[attribute.name] || [];
                                      const newValues = currentValues.includes(option.value)
                                        ? currentValues.filter((v: string) => v !== option.value)
                                        : [...currentValues, option.value];
                                      updateConfig(attribute.name, newValues);
                                    }}
                                    className={`
                                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                                      ${(config[attribute.name] || []).includes(option.value)
                                        ? 'bg-champagne-gold text-desert-sand shadow-lg'
                                        : 'bg-champagne-gold/20 text-rich-brown-800 border border-champagne-gold/30 hover:border-champagne-gold/50 hover:bg-champagne-gold/30'
                                      }
                                    `}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <SelectField
                            key={attribute.id}
                            label={attribute.label}
                            value={currentValue}
                            options={attributeOptions.map(opt => opt.value)}
                            onChange={(value) => updateConfig(attribute.name, value)}
                            disabled={!isFieldVisible(attribute)}
                          />
                        );
                      })}
                    </ConfigSection>
                  );
                })}
              </>
            )}

            {/* Fabric Selection */}
            <ConfigSection title="Fabric & Aesthetics" sectionKey="aesthetics" icon={<Palette className="w-6 h-6" />}>
              <div className="md:col-span-2">
                <FabricSelector
                  fabricPlan={config.fabricPlan}
                  fabricCodes={config.fabricCodes}
                  onFabricPlanChange={(plan) => updateConfig('fabricPlan', plan)}
                  onFabricCodesChange={(codes) => updateConfig('fabricCodes', codes)}
                  config={config}
                  onPriceUpdate={handleFabricPriceUpdate}
                />
              </div>
            </ConfigSection>
          </div>

          {/* Sticky Summary Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-8 space-y-4 sm:space-y-6 animate-slide-in-right">
              {/* Live Price Display */}
              <div className="bg-burnt-gradient rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-desert-glow">
                <div className="text-center">
                  <p className="text-desert-sand/80 font-body text-xs sm:text-sm font-medium mb-1">Current Price</p>
                  <p className="text-2xl sm:text-3xl font-bold text-desert-sand font-display">
                    ₹{calculatePrice().toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Configuration Summary */}
              <div className="bg-desert-sand rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-champagne-gold/30 shadow-luxury sticky top-8 shadow-parchment">
                <h3 className="text-rich-brown-800 font-display text-base sm:text-lg font-bold mb-3 sm:mb-4">
                  Current Selection
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-warm-grey-600">Category:</span>
                    <span className="text-rich-brown-800 font-medium text-right">{selectedCategory}</span>
                  </div>
                  {config.sofaModel && (
                    <div className="flex justify-between">
                      <span className="text-warm-grey-600">Model:</span>
                      <span className="text-rich-brown-800 font-medium text-right">{config.sofaModel}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-warm-grey-600">Fabric:</span>
                    <span className="text-rich-brown-800 font-medium text-right">
                      {config.fabricCodes.filter(code => code).length > 0 
                        ? `${config.fabricPlan} (${config.fabricCodes.filter(code => code).length} selected)`
                        : config.fabricPlan
                      }
                    </span>
                  </div>
                  {fabricCosts.fabricCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-warm-grey-600">Fabric Cost:</span>
                      <span className="text-champagne-gold font-medium text-right">₹{fabricCosts.fabricCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={isSaving || !config.sofaModel}
                  className="w-full bg-burnt-gradient text-desert-sand font-body font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:shadow-desert-shadow transition-all duration-300 ease-in-out hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 h-10 sm:h-12 text-sm sm:text-base"
                >
                  {isSaving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleSaveConfiguration}
                  disabled={saving || !config.sofaModel}
                  className="w-full bg-desert-sand text-rich-brown-800 font-body font-semibold py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl border border-champagne-gold/30 hover:bg-champagne-gold/10 hover:border-champagne-gold transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 h-10 sm:h-12 text-sm sm:text-base shadow-parchment"
                >
                  {saving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Save Config</span>
                    </>
                  )}
                </button>
              </div>

              {/* Features */}
              <div className="bg-champagne-gold/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-champagne-gold/20">
                <div className="space-y-1.5 sm:space-y-2 text-xs text-warm-grey-600 font-body">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-champagne-gold rounded-full flex-shrink-0"></div>
                    <span>Free delivery & installation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-champagne-gold rounded-full flex-shrink-0"></div>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-champagne-gold rounded-full flex-shrink-0"></div>
                    <span>Lifetime warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        </div>
      </div>
    </ErrorBoundary>
  );
};