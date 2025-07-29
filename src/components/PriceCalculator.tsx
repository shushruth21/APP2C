import React from 'react';
import { IndianRupee } from 'lucide-react';

interface PriceCalculatorProps {
  config: any;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ config }) => {
  const calculatePrice = () => {
    let basePrice = 45000; // Base price for 1-seater
    
    // Seat pricing
    if (config.seats === 2) basePrice = 65000;
    else if (config.seats === 3) basePrice = 85000;
    else if (config.seats === 123) basePrice = 150000; // 1+2+3 set
    
    // Lounger pricing
    if (config.needsLounger) {
      basePrice += 25000 + (config.loungerLength - 6) * 2000;
    }
    
    // Seat width adjustment
    const widthMultiplier = config.seatWidth / 28;
    basePrice *= widthMultiplier;
    
    // Armrest type pricing
    const armrestPrices = { smug: 0, ocean: 3000, box: 1500 };
    basePrice += armrestPrices[config.armRestType as keyof typeof armrestPrices] || 0;
    
    // Console pricing
    if (config.needsConsole) {
      const consolePrices = { '6"': 4000, '8"': 5500, '10"': 7000 };
      basePrice += (consolePrices[config.consoleType as keyof typeof consolePrices] || 4000) * config.consoleCount;
    }
    
    // Corner unit
    if (config.needsCorner) basePrice += 15000;
    
    // Wood type pricing
    if (config.woodType === 'pine') basePrice += 8000;
    
    // Foam type pricing
    if (config.seatFoam === 'latex') basePrice += 12000;
    
    // Fabric plan pricing
    const fabricPrices = { single: 0, dual: 8000, triple: 15000 };
    basePrice += fabricPrices[config.fabricPlan as keyof typeof fabricPrices] || 0;
    
    // Accessories pricing
    const accessoryPrice = config.accessories.length * 2500;
    basePrice += accessoryPrice;
    
    return Math.round(basePrice);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('₹', '');
  };

  const currentPrice = calculatePrice();

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-center space-x-2">
        <IndianRupee className="w-6 h-6 text-emerald-900" />
        <div className="text-center">
          <p className="text-emerald-900/70 text-sm font-medium">Current Price</p>
          <p className="text-2xl font-bold text-emerald-900">₹{formatPrice(currentPrice)}</p>
        </div>
      </div>
    </div>
  );
};