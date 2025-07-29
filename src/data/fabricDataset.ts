// Comprehensive Fabric Dataset
export interface FabricData {
  code: string;
  description: string;
  company: string;
  collection: string;
  color: string;
  colorHex: string;
  pricePerMeter: number;
  upgradeCharges: number;
  category: 'leather' | 'velvet' | 'linen' | 'cotton' | 'synthetic' | 'premium';
  texture: string;
  durability: 'High' | 'Medium' | 'Premium';
  careInstructions: string;
}

export const fabricDataset: FabricData[] = [
  // Premium Leather Collection
  {
    code: 'LEA-LUX-001',
    description: 'Premium Italian Nappa Leather',
    company: 'Natuzzi Italia',
    collection: 'Luxury Leather',
    color: 'Midnight Black',
    colorHex: '#1a1a1a',
    pricePerMeter: 2800,
    upgradeCharges: 450,
    category: 'leather',
    texture: 'Smooth Grain',
    durability: 'Premium',
    careInstructions: 'Professional cleaning recommended'
  },
  {
    code: 'LEA-LUX-002',
    description: 'Hand-Finished Cognac Leather',
    company: 'Natuzzi Italia',
    collection: 'Luxury Leather',
    color: 'Cognac Brown',
    colorHex: '#8B4513',
    pricePerMeter: 2650,
    upgradeCharges: 420,
    category: 'leather',
    texture: 'Natural Grain',
    durability: 'Premium',
    careInstructions: 'Leather conditioner monthly'
  },
  {
    code: 'LEA-LUX-003',
    description: 'Vintage Distressed Leather',
    company: 'Natuzzi Italia',
    collection: 'Luxury Leather',
    color: 'Vintage Tan',
    colorHex: '#D2B48C',
    pricePerMeter: 2950,
    upgradeCharges: 480,
    category: 'leather',
    texture: 'Distressed',
    durability: 'Premium',
    careInstructions: 'Avoid direct sunlight'
  },

  // Royal Velvet Collection
  {
    code: 'VEL-ROY-001',
    description: 'Royal Emerald Velvet',
    company: 'Designers Guild',
    collection: 'Royal Velvet',
    color: 'Emerald Green',
    colorHex: '#50C878',
    pricePerMeter: 1850,
    upgradeCharges: 280,
    category: 'velvet',
    texture: 'Plush Pile',
    durability: 'High',
    careInstructions: 'Professional dry clean only'
  },
  {
    code: 'VEL-ROY-002',
    description: 'Deep Navy Velvet',
    company: 'Designers Guild',
    collection: 'Royal Velvet',
    color: 'Deep Navy',
    colorHex: '#000080',
    pricePerMeter: 1750,
    upgradeCharges: 260,
    category: 'velvet',
    texture: 'Crushed Velvet',
    durability: 'High',
    careInstructions: 'Vacuum regularly with soft brush'
  },
  {
    code: 'VEL-ROY-003',
    description: 'Champagne Gold Velvet',
    company: 'Designers Guild',
    collection: 'Royal Velvet',
    color: 'Champagne Gold',
    colorHex: '#F7E7CE',
    pricePerMeter: 1950,
    upgradeCharges: 300,
    category: 'velvet',
    texture: 'Silk Velvet',
    durability: 'Premium',
    careInstructions: 'Professional cleaning required'
  },

  // Natural Linen Collection
  {
    code: 'LIN-NAT-001',
    description: 'Belgian Natural Linen',
    company: 'Libeco Home',
    collection: 'Natural Linen',
    color: 'Natural Beige',
    colorHex: '#F5F5DC',
    pricePerMeter: 1200,
    upgradeCharges: 180,
    category: 'linen',
    texture: 'Woven',
    durability: 'High',
    careInstructions: 'Machine washable, gentle cycle'
  },
  {
    code: 'LIN-NAT-002',
    description: 'Sage Green Linen',
    company: 'Libeco Home',
    collection: 'Natural Linen',
    color: 'Sage Green',
    colorHex: '#9CAF88',
    pricePerMeter: 1150,
    upgradeCharges: 170,
    category: 'linen',
    texture: 'Textured Weave',
    durability: 'High',
    careInstructions: 'Iron while damp for best results'
  },
  {
    code: 'LIN-NAT-003',
    description: 'Stone Grey Linen',
    company: 'Libeco Home',
    collection: 'Natural Linen',
    color: 'Stone Grey',
    colorHex: '#8C8C8C',
    pricePerMeter: 1180,
    upgradeCharges: 175,
    category: 'linen',
    texture: 'Fine Weave',
    durability: 'High',
    careInstructions: 'Avoid bleach, air dry'
  },

  // Cotton Blend Collection
  {
    code: 'COT-BLE-001',
    description: 'Premium Cotton Blend',
    company: 'Kravet',
    collection: 'Cotton Blend',
    color: 'Cream White',
    colorHex: '#FFFDD0',
    pricePerMeter: 850,
    upgradeCharges: 120,
    category: 'cotton',
    texture: 'Smooth',
    durability: 'Medium',
    careInstructions: 'Machine washable, warm water'
  },
  {
    code: 'COT-BLE-002',
    description: 'Charcoal Cotton Blend',
    company: 'Kravet',
    collection: 'Cotton Blend',
    color: 'Charcoal Grey',
    colorHex: '#36454F',
    pricePerMeter: 820,
    upgradeCharges: 115,
    category: 'cotton',
    texture: 'Textured',
    durability: 'Medium',
    careInstructions: 'Cold wash, tumble dry low'
  },
  {
    code: 'COT-BLE-003',
    description: 'Terracotta Cotton Blend',
    company: 'Kravet',
    collection: 'Cotton Blend',
    color: 'Terracotta',
    colorHex: '#E2725B',
    pricePerMeter: 880,
    upgradeCharges: 125,
    category: 'cotton',
    texture: 'Canvas Weave',
    durability: 'High',
    careInstructions: 'Fade resistant, easy care'
  },

  // Synthetic Premium Collection
  {
    code: 'SYN-PRE-001',
    description: 'Microfiber Suede',
    company: 'Ultrafabrics',
    collection: 'Synthetic Premium',
    color: 'Mocha Brown',
    colorHex: '#8B4513',
    pricePerMeter: 950,
    upgradeCharges: 140,
    category: 'synthetic',
    texture: 'Suede-like',
    durability: 'High',
    careInstructions: 'Stain resistant, easy clean'
  },
  {
    code: 'SYN-PRE-002',
    description: 'Performance Fabric',
    company: 'Ultrafabrics',
    collection: 'Synthetic Premium',
    color: 'Ocean Blue',
    colorHex: '#006994',
    pricePerMeter: 1050,
    upgradeCharges: 155,
    category: 'synthetic',
    texture: 'Smooth',
    durability: 'Premium',
    careInstructions: 'Water resistant, antimicrobial'
  },
  {
    code: 'SYN-PRE-003',
    description: 'Eco-Friendly Synthetic',
    company: 'Ultrafabrics',
    collection: 'Synthetic Premium',
    color: 'Forest Green',
    colorHex: '#228B22',
    pricePerMeter: 1120,
    upgradeCharges: 165,
    category: 'synthetic',
    texture: 'Textured',
    durability: 'Premium',
    careInstructions: 'Sustainable, easy maintenance'
  }
];

// Fabric measurement logic based on sofa configuration
export const calculateFabricRequirement = (config: any): number => {
  let totalMeters = 0;

  // Base fabric requirement by seat count
  const seatFabricMap: Record<string, number> = {
    '1 (One) seat': 6,
    '2 (Two) seats': 9,
    '3 (Three) seats': 12,
    '2+3+C seats': 18
  };

  totalMeters += seatFabricMap[config.seats] || 12;

  // Lounger fabric requirement
  if (config.needsLounger === 'Yes') {
    const loungerLengthMap: Record<string, number> = {
      '5.5 feet': 6.5,
      '6 feet': 7.2,
      '6.5 feet': 7.8,
      '7 feet': 8.4
    };
    totalMeters += loungerLengthMap[config.loungerLength] || 7.2;
  }

  // Console fabric requirement
  if (config.needsConsole === 'Yes') {
    const consoleCount = config.consoleCount === '2 (Two)' ? 2 : 1;
    const consoleTypeMap: Record<string, number> = {
      'Tray': 1.5,
      'USB': 1.8,
      'Lighting...': 2.0,
      'Single cup holder': 1.2,
      'Dual cup holder': 2.0
    };
    const consoleMeters = consoleTypeMap[config.consoleType] || 1.5;
    totalMeters += consoleMeters * consoleCount;
  }

  // Corner unit fabric requirement
  if (config.needsCorner === 'Yes') {
    totalMeters += 4.5;
  }

  // Fabric plan multiplier
  const fabricPlanMultiplier: Record<string, number> = {
    'Single Colour': 1.0,
    'Dual Colour': 1.2,
    'Tri Colour': 1.4
  };
  totalMeters *= fabricPlanMultiplier[config.fabricPlan] || 1.0;

  return Math.ceil(totalMeters * 10) / 10; // Round to 1 decimal place
};

export const getFabricByCode = (code: string): FabricData | undefined => {
  return fabricDataset.find(fabric => fabric.code === code);
};

export const getFabricsByCategory = (category: string): FabricData[] => {
  return fabricDataset.filter(fabric => fabric.category === category);
};

export const getAllFabricCategories = (): string[] => {
  return Array.from(new Set(fabricDataset.map(fabric => fabric.category)));
};