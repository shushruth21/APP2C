import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Save, Sparkles, Check, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useConfigurationAttributes, useSofaModels } from '../hooks/useSupabase';
import { useCart } from './CartManager';
import { LoadingSpinner } from './LoadingSpinner';

interface LuxurySofaConfiguratorProps {
  categoryId: string;
  categoryName: string;
}

interface ConfigurationState {
  [key: string]: string | string[];
}

export const LuxurySofaConfigurator: React.FC<LuxurySofaConfiguratorProps> = ({
  categoryId,
  categoryName
}) => {
  const { addToCart } = useCart();
  const { models, loading: modelsLoading } = useSofaModels(categoryId);
  const { attributes, options, loading: attributesLoading } = useConfigurationAttributes(categoryId);
  
  const [configuration, setConfiguration] = useState<ConfigurationState>({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize configuration with first model
  useEffect(() => {
    if (models.length > 0 && !configuration.model) {
      setConfiguration(prev => ({ ...prev, model: models[0].name }));
    }
  }, [models, configuration.model]);

  // Check if field should be visible based on dependencies
  const isFieldVisible = (attribute: any) => {
    if (!attribute.depends_on || !attribute.depends_value) return true;
    return configuration[attribute.depends_on] === attribute.depends_value;
  };

  // Get visible attributes sorted by order
  const visibleAttributes = useMemo(() => {
    return attributes
      .filter(isFieldVisible)
      .sort((a, b) => a.order_index - b.order_index);
  }, [attributes, configuration]);

  // Calculate estimated price
  const calculatePrice = useMemo(() => {
    const selectedModel = models.find(model => model.name === configuration.model);
    let basePrice = selectedModel?.base_price || 45000;

    // Add price modifiers from selected options
    attributes.forEach(attribute => {
      const selectedValue = configuration[attribute.name];
      if (selectedValue && options[attribute.id]) {
        const selectedOption = options[attribute.id].find(opt => opt.value === selectedValue);
        if (selectedOption) {
          basePrice += selectedOption.price_modifier;
        }
      }
    });

    return basePrice;
  }, [configuration, models, attributes, options]);

  const handleConfigurationChange = (attributeName: string, value: string) => {
    setIsAnimating(true);
    setConfiguration(prev => ({ ...prev, [attributeName]: value }));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleAddToCart = () => {
    const selectedModel = models.find(model => model.name === configuration.model);
    if (selectedModel) {
      addToCart(selectedModel.name, configuration, calculatePrice);
    }
  };

  const isConfigurationComplete = () => {
    const requiredFields = visibleAttributes.filter(attr => attr.required);
    return requiredFields.every(field => configuration[field.name]);
  };

  if (modelsLoading || attributesLoading) {
    return (
      <div className="min-h-screen bg-ivory-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-forest-green font-display text-xl">Loading luxury configurator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-forest-green mb-4">
            Configure Your Dream {categoryName}
          </h1>
          <p className="text-forest-green/70 font-body text-lg max-w-2xl mx-auto">
            Craft the perfect piece with our luxury customization options. Every detail matters.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Form - Left Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-ivory-white rounded-2xl shadow-luxury p-8 border border-gold-500/20">
              <div className="flex items-center mb-8">
                <Sparkles className="w-6 h-6 text-gold-500 mr-3" />
                <h2 className="text-2xl font-display font-bold text-forest-green">
                  Customization Options
                </h2>
              </div>

              <div className="space-y-8">
                {/* Model Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <label className="block text-forest-green font-body font-semibold text-sm uppercase tracking-wide">
                    Select Model
                  </label>
                  <Select
                    value={configuration.model || ''}
                    onValueChange={(value) => handleConfigurationChange('model', value)}
                  >
                    <SelectTrigger className="h-14">
                      <SelectValue placeholder="Choose your model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(model => (
                        <SelectItem key={model.id} value={model.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <span className="text-gold-500 font-semibold ml-4">
                              ₹{model.base_price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Dynamic Attributes */}
                <AnimatePresence>
                  {visibleAttributes.map((attribute, index) => {
                    const attributeOptions = options[attribute.id] || [];
                    
                    return (
                      <motion.div
                        key={attribute.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <label className="block text-forest-green font-body font-semibold text-sm uppercase tracking-wide flex items-center">
                          {attribute.label}
                          {attribute.required && (
                            <span className="text-gold-500 ml-1">*</span>
                          )}
                        </label>

                        {attribute.type === 'multiselect' ? (
                          <div className="grid grid-cols-2 gap-3">
                            {attributeOptions.map(option => {
                              const isSelected = (configuration[attribute.name] as string[] || []).includes(option.value);
                              return (
                                <motion.button
                                  key={option.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    const currentValues = configuration[attribute.name] as string[] || [];
                                    const newValues = isSelected
                                      ? currentValues.filter(v => v !== option.value)
                                      : [...currentValues, option.value];
                                    handleConfigurationChange(attribute.name, newValues as any);
                                  }}
                                  className={`
                                    p-4 rounded-xl border-2 transition-all duration-300 text-left
                                    ${isSelected
                                      ? 'border-gold-500 bg-gold-500/10 text-forest-green'
                                      : 'border-gold-500/30 hover:border-gold-500/50 text-forest-green/70'
                                    }
                                  `}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{option.label}</span>
                                    {isSelected && <Check className="w-4 h-4 text-gold-500" />}
                                  </div>
                                  {option.price_modifier > 0 && (
                                    <span className="text-gold-500 text-sm font-semibold">
                                      +₹{option.price_modifier.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        ) : (
                          <Select
                            value={configuration[attribute.name] as string || ''}
                            onValueChange={(value) => handleConfigurationChange(attribute.name, value)}
                          >
                            <SelectTrigger className="h-14">
                              <SelectValue placeholder={`Select ${attribute.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {attributeOptions.map(option => (
                                <SelectItem key={option.id} value={option.value}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{option.label}</span>
                                    {option.price_modifier > 0 && (
                                      <span className="text-gold-500 font-semibold ml-4">
                                        +₹{option.price_modifier.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Summary Panel - Right Sticky */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-6">
              {/* Price Display */}
              <motion.div 
                animate={{ scale: isAnimating ? 1.02 : 1 }}
                className="bg-forest-gradient rounded-2xl p-8 text-center shadow-luxury"
              >
                <div className="text-ivory-white/80 font-body text-sm uppercase tracking-wide mb-2">
                  Estimated Price
                </div>
                <div className="text-3xl font-display font-bold text-ivory-white mb-4">
                  ₹{calculatePrice.toLocaleString('en-IN')}
                </div>
                <div className="text-ivory-white/60 font-body text-xs">
                  *Final price may vary based on fabric selection
                </div>
              </motion.div>

              {/* Configuration Summary */}
              <div className="bg-ivory-white rounded-2xl shadow-luxury p-6 border border-gold-500/20">
                <h3 className="text-forest-green font-display font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Your Selection
                </h3>
                
                <div className="space-y-3 text-sm">
                  {configuration.model && (
                    <div className="flex justify-between items-center py-2 border-b border-gold-500/10">
                      <span className="text-forest-green/70 font-body">Model:</span>
                      <span className="text-forest-green font-semibold">{configuration.model}</span>
                    </div>
                  )}
                  
                  {visibleAttributes.map(attribute => {
                    const value = configuration[attribute.name];
                    if (!value) return null;
                    
                    const displayValue = Array.isArray(value) 
                      ? value.join(', ') 
                      : value;
                    
                    return (
                      <div key={attribute.id} className="flex justify-between items-center py-2 border-b border-gold-500/10">
                        <span className="text-forest-green/70 font-body">{attribute.label}:</span>
                        <span className="text-forest-green font-semibold text-right max-w-32 truncate">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!isConfigurationComplete()}
                  className="w-full bg-forest-gradient text-ivory-white font-body font-bold py-4 px-6 rounded-xl shadow-luxury hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border-2 border-transparent hover:border-gold-500/50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-ivory-white text-forest-green font-body font-semibold py-4 px-6 rounded-xl border-2 border-gold-500/30 hover:border-gold-500 hover:bg-gold-500/5 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Configuration</span>
                </motion.button>
              </div>

              {/* Features */}
              <div className="bg-gold-500/10 rounded-xl p-4 border border-gold-500/20">
                <div className="space-y-2 text-xs text-forest-green/70 font-body">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>Free white-glove delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>Professional installation included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>Lifetime craftsmanship warranty</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span>30-day satisfaction guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};