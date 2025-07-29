import React, { useState } from 'react';
import { Eye, Heart, Info } from 'lucide-react';

interface EnhancedSofaModelCardProps {
  name: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
  price: string;
  description: string;
  features: string[];
}

export const EnhancedSofaModelCard: React.FC<EnhancedSofaModelCardProps> = ({
  name,
  image,
  isSelected,
  onSelect,
  price,
  description,
  features,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div
      className={`
        relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 group
        ${isSelected 
          ? 'ring-2 ring-metallic-gold shadow-2xl shadow-metallic-gold-shadow scale-105' 
          : 'hover:scale-102 hover:shadow-xl hover:shadow-dark-charcoal/30'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Main Image Container */}
      <div className="aspect-[4/3] bg-dark-charcoal/20 rounded-2xl overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className={`
            w-full h-full object-cover transition-all duration-700
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/70 via-dark-charcoal/10 to-transparent" />
        <div className={`
          absolute inset-0 bg-gradient-to-t from-metallic-gold/20 to-transparent transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} />

        {/* Action Buttons */}
        <div className={`
          absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
        `}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
            className={`
              w-10 h-10 rounded-full backdrop-blur-sm border transition-all duration-200
              ${isFavorited 
                ? 'bg-red-500/90 border-red-400 text-ivory-white' 
                : 'bg-ivory-white/80 border-metallic-gold/30 text-dark-charcoal hover:bg-ivory-white/90'
              }
              flex items-center justify-center
            `}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          
          <button className="w-10 h-10 bg-ivory-white/80 backdrop-blur-sm border border-metallic-gold/30 rounded-full text-dark-charcoal hover:bg-ivory-white/90 transition-all duration-200 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-4 left-4 w-8 h-8 bg-metallic-gold rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-ivory-white rounded-full" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-4 left-4 bg-ivory-white/90 backdrop-blur-sm rounded-full px-3 py-1 border border-metallic-gold/30">
          <span className="text-metallic-gold font-semibold text-sm">From {price}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className={`
          transition-all duration-300 transform
          ${isHovered ? 'translate-y-0' : 'translate-y-2'}
        `}>
          <h3 className="text-metallic-gold font-display text-xl font-bold mb-2">
            {name}
          </h3>
          
          <p className={`
            text-ivory-white/80 text-sm mb-3 transition-all duration-300
            ${isHovered ? 'opacity-100 max-h-20' : 'opacity-70 max-h-0 overflow-hidden'}
          `}>
            {description}
          </p>

          {/* Features */}
          <div className={`
            flex flex-wrap gap-1 transition-all duration-300
            ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}
          `}>
            {features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-metallic-gold/20 text-metallic-gold text-xs px-2 py-1 rounded-full border border-metallic-gold/30"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Overlay with Info */}
      <div className={`
        absolute inset-0 bg-dark-charcoal/95 backdrop-blur-sm flex items-center justify-center transition-all duration-300
        ${isHovered && !isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="text-center p-6">
          <Info className="w-8 h-8 text-metallic-gold mx-auto mb-3" />
          <h4 className="text-metallic-gold font-display text-lg font-bold mb-2">
            {name} Collection
          </h4>
          <p className="text-ivory-white/80 text-sm mb-4">
            {description}
          </p>
          <div className="space-y-1">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-metallic-gold rounded-full"></div>
                <span className="text-ivory-white/70 text-xs">{feature}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 bg-metallic-gold text-ivory-white px-4 py-2 rounded-lg font-body font-semibold text-sm hover:bg-metallic-gold/90 transition-colors duration-200">
            Select & Configure
          </button>
        </div>
      </div>
    </div>
  );
};