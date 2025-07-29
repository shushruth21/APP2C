import React, { useState, useEffect } from 'react';
import { Palette, Search, Filter, Info, Calculator } from 'lucide-react';
import { calculateFabricRequirement } from '../data/fabricDataset';
import { useFabricInventory } from '../hooks/useSupabase';
import { LoadingSpinner, SkeletonLoader } from './LoadingSpinner';
import { DataErrorFallback } from './ErrorBoundary';

interface FabricSelectorProps {
  fabricPlan: string;
  fabricCodes: string[];
  onFabricPlanChange: (plan: string) => void;
  onFabricCodesChange: (codes: string[]) => void;
  config: any;
  onPriceUpdate: (fabricCost: number, upgradeCost: number) => void;
}

export const FabricSelector: React.FC<FabricSelectorProps> = ({
  fabricPlan,
  fabricCodes,
  onFabricPlanChange,
  onFabricCodesChange,
  config,
  onPriceUpdate
}) => {
  const { fabrics, fabricsByCategory, loading, error } = useFabricInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fabricBreakdown, setFabricBreakdown] = useState<{
    totalMeters: number;
    fabricCost: number;
    upgradeCost: number;
    totalCost: number;
  }>({ totalMeters: 0, fabricCost: 0, upgradeCost: 0, totalCost: 0 });

  const fabricCategories = [
    { id: 'all', name: 'All Fabrics', count: fabrics.length },
    { id: 'leather', name: 'Premium Leather', count: fabricsByCategory.leather?.length || 0 },
    { id: 'velvet', name: 'Luxury Velvet', count: fabricsByCategory.velvet?.length || 0 },
    { id: 'linen', name: 'Natural Linen', count: fabricsByCategory.linen?.length || 0 },
    { id: 'cotton', name: 'Cotton Blend', count: fabricsByCategory.cotton?.length || 0 },
    { id: 'synthetic', name: 'Synthetic Premium', count: fabricsByCategory.synthetic?.length || 0 },
  ];

  const filteredFabrics = fabrics.filter(fabric => {
    const matchesSearch = fabric.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fabric.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fabric.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fabric.collection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || fabric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate fabric requirements and costs
  useEffect(() => {
    const totalMeters = calculateFabricRequirement(config);
    let totalFabricCost = 0;
    let totalUpgradeCost = 0;

    fabricCodes.forEach(code => {
      if (code) {
        const fabric = fabrics.find(f => f.code === code);
        if (fabric) {
          const metersForThisFabric = fabricPlan === 'Single Colour' ? totalMeters : totalMeters / fabricCodes.length;
          totalFabricCost += metersForThisFabric * fabric.price_per_meter;
          totalUpgradeCost += metersForThisFabric * fabric.upgrade_charges;
        }
      }
    });

    const breakdown = {
      totalMeters,
      fabricCost: totalFabricCost,
      upgradeCost: totalUpgradeCost,
      totalCost: totalFabricCost + totalUpgradeCost
    };

    setFabricBreakdown(breakdown);
    onPriceUpdate(totalFabricCost, totalUpgradeCost);
  }, [config, fabricCodes, fabricPlan, onPriceUpdate]);

  const handleFabricSelect = (fabricCode: string, index: number) => {
    const newCodes = [...fabricCodes];
    newCodes[index] = fabricCode;
    onFabricCodesChange(newCodes);
  };

  const getNumberOfInputs = () => {
    switch (fabricPlan) {
      case 'Single Colour': return 1;
      case 'Dual Colour': return 2;
      case 'Tri Colour': return 3;
      default: return 1;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('₹', '');
  };

  const FabricCard = React.memo(({ fabric, isSelected, onClick }: { 
    fabric: any; 
    isSelected: boolean; 
    onClick: () => void; 
  }) => (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl p-4 border transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg
        ${isSelected
          ? 'border-champagne-gold bg-champagne-gold/20 shadow-lg shadow-desert-shadow'
          : 'border-champagne-gold/30 hover:border-champagne-gold/50 bg-desert-sand'
        }
      `}
    >
      <div 
        className="w-full h-20 rounded-lg mb-3 border-2 border-champagne-gold/20 shadow-inner"
        style={{ backgroundColor: fabric.color_hex }}
      />
      
      <div className="space-y-2">
        <h4 className="text-rich-brown-800 text-sm font-semibold truncate">
          {fabric.description}
        </h4>
        
        <div className="text-xs space-y-1">
          <div className="text-warm-grey-600">
            <span className="font-medium">{fabric.company}</span>
          </div>
          <div className="text-warm-grey-600">
            {fabric.collection}
          </div>
          <div className="text-champagne-gold font-semibold">
            ₹{formatPrice(fabric.price_per_meter)}/mtr
          </div>
          <div className="text-burnt-sienna text-xs">
            +₹{formatPrice(fabric.upgrade_charges)} upgrade
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-champagne-gold/30">
          <span className="text-warm-grey-600 text-xs">{fabric.code}</span>
          <span className="text-warm-grey-600 text-xs capitalize">{fabric.durability}</span>
        </div>
      </div>
    </div>
  ));

  if (loading) {
    return (
      <div className="bg-desert-sand rounded-xl p-6 border border-champagne-gold/30 shadow-luxury shadow-parchment">
        <div className="flex items-center mb-6">
          <LoadingSpinner size="sm" className="mr-2" />
          <h3 className="text-rich-brown-800 font-display font-bold">Loading Fabric Options...</h3>
        </div>
        <div className="space-y-4">
          <SkeletonLoader className="h-12 w-full" />
          <SkeletonLoader className="h-32 w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <SkeletonLoader className="h-40 w-full" count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-desert-sand rounded-xl p-6 border border-champagne-gold/30 shadow-luxury shadow-parchment">
        <DataErrorFallback 
          error={error} 
          title="Failed to load fabric inventory"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="bg-desert-sand rounded-xl p-6 border border-champagne-gold/30 shadow-luxury shadow-parchment">
      <h3 className="text-rich-brown-800 font-display font-bold mb-6 flex items-center">
        <Palette className="w-5 h-5 mr-2" />
        Fabric Configuration & Pricing
      </h3>

      {/* Fabric Plan Selection */}
      <div className="mb-6">
        <label className="block text-rich-brown-800 font-body font-medium mb-3">Cladding Plan</label>
        <div className="grid grid-cols-3 gap-3">
          {['Single Colour', 'Dual Colour', 'Tri Colour'].map(plan => (
            <button
              key={plan}
              onClick={() => onFabricPlanChange(plan)}
              className={`
                p-3 rounded-lg border transition-all duration-200 text-center
                ${fabricPlan === plan
                  ? 'border-champagne-gold bg-champagne-gold/20 text-burnt-sienna font-semibold'
                  : 'border-champagne-gold/30 text-rich-brown-800 hover:border-champagne-gold/50 hover:bg-champagne-gold/10'
                }
              `}
            >
              <div className="font-semibold">{plan}</div>
              <div className="text-xs opacity-70">
                {plan === 'Single Colour' ? '1 Color' : plan === 'Dual Colour' ? '2 Colors' : '3 Colors'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Cost Breakdown */}
      <div className="mb-6 bg-champagne-gold/10 rounded-lg p-4 border border-champagne-gold/20">
        <h4 className="text-rich-brown-800 font-body font-semibold mb-3 flex items-center">
          <Calculator className="w-4 h-4 mr-2" />
          Fabric Cost Breakdown
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-warm-grey-600">Total Meters Required:</span>
              <span className="text-rich-brown-800 font-medium">{fabricBreakdown.totalMeters}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-grey-600">Fabric Cost:</span>
              <span className="text-rich-brown-800 font-medium">₹{formatPrice(fabricBreakdown.fabricCost)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-warm-grey-600">Upgrade Charges:</span>
              <span className="text-burnt-sienna font-medium">₹{formatPrice(fabricBreakdown.upgradeCost)}</span>
            </div>
            <div className="flex justify-between border-t border-champagne-gold/30 pt-2">
              <span className="text-champagne-gold font-semibold">Total Fabric Cost:</span>
              <span className="text-champagne-gold font-bold">₹{formatPrice(fabricBreakdown.totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warm-grey-500" />
          <input
            type="text"
            placeholder="Search by description, company, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-desert-sand border border-champagne-gold/30 rounded-lg pl-10 pr-4 py-3 text-rich-brown-800 placeholder-warm-grey-500 focus:border-champagne-gold focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 shadow-parchment"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {fabricCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-3 py-1 rounded-full text-sm transition-all duration-200
                ${selectedCategory === category.id
                  ? 'bg-champagne-gold text-desert-sand font-semibold'
                  : 'bg-champagne-gold/20 text-rich-brown-800 hover:bg-champagne-gold/30'
                }
              `}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Selection for Each Color */}
      <div className="space-y-6">
        {Array.from({ length: getNumberOfInputs() }).map((_, index) => (
          <div key={index} className="space-y-3">
            <label className="block text-rich-brown-800 font-body font-medium">
              Fabric {index + 1} {fabricPlan !== 'Single Colour' && (
                <span className="text-warm-grey-600 text-sm">
                  ({index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Accent'})
                </span>
              )}
            </label>

            {/* Current Selection Display */}
            {fabricCodes[index] && (
              <div className="bg-champagne-gold/10 rounded-lg p-4 border border-champagne-gold/20">
                {(() => {
                  const selectedFabric = fabrics.find(f => f.code === fabricCodes[index]);
                  if (!selectedFabric) return null;
                  
                  const metersForThisFabric = fabricPlan === 'Single Colour' 
                    ? fabricBreakdown.totalMeters 
                    : fabricBreakdown.totalMeters / getNumberOfInputs();
                  
                  return (
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded border-2 border-desert-sand/20 flex-shrink-0"
                        style={{ backgroundColor: selectedFabric.color_hex }}
                      />
                      <div className="flex-1">
                        <div className="text-rich-brown-800 font-medium">{selectedFabric.description}</div>
                        <div className="text-warm-grey-600 text-sm">{selectedFabric.company} - {selectedFabric.collection}</div>
                        <div className="text-champagne-gold text-sm font-semibold">
                          {metersForThisFabric.toFixed(1)}m × ₹{formatPrice(selectedFabric.price_per_meter)} = ₹{formatPrice(metersForThisFabric * selectedFabric.price_per_meter)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Fabric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-champagne-gold/30">
              {filteredFabrics.map(fabric => (
                <FabricCard
                  key={fabric.code}
                  fabric={fabric}
                  isSelected={fabricCodes[index] === fabric.code}
                  onClick={() => handleFabricSelect(fabric.code, index)}
                />
              ))}
              {filteredFabrics.length === 0 && (
                <div className="col-span-full text-center py-8 text-warm-grey-600">
                  No fabrics found matching your criteria
                </div>
              )}
            </div>

            {/* Custom Fabric Input */}
            <div className="border-t border-champagne-gold/30 pt-3">
              <input
                type="text"
                placeholder="Or enter custom fabric code"
                value={fabricCodes[index] || ''}
                onChange={(e) => handleFabricSelect(e.target.value, index)}
                className="w-full bg-desert-sand border border-champagne-gold/30 rounded-lg px-3 py-2 text-rich-brown-800 placeholder-warm-grey-500 focus:border-champagne-gold focus:outline-none focus:ring-2 focus:ring-champagne-gold/20 text-sm shadow-parchment transition-all duration-300 ease-in-out"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fabric Care Instructions */}
      <div className="mt-6 bg-champagne-gold/10 rounded-lg p-4 border border-champagne-gold/20">
        <h4 className="text-rich-brown-800 font-body font-semibold mb-2 text-sm flex items-center">
          <Info className="w-4 h-4 mr-2" />
          Fabric Care & Information
        </h4>
        <div className="text-warm-grey-600 text-xs space-y-1">
          <p>• All prices include GST and are calculated per meter as per BOM</p>
          <p>• Upgrade charges cover premium finishing and installation</p>
          <p>• Fabric requirements calculated based on your sofa configuration</p>
          <p>• Professional cleaning recommended for premium fabrics</p>
          <p>• Color variations may occur due to screen settings</p>
        </div>
      </div>
    </div>
  );
};