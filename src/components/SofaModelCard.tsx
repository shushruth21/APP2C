import React from 'react';

interface SofaModelCardProps {
  name: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const SofaModelCard: React.FC<SofaModelCardProps> = ({
  name,
  image,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300
        ${isSelected 
          ? 'ring-2 ring-metallic-gold shadow-lg shadow-metallic-gold-shadow scale-105' 
          : 'hover:scale-102 hover:shadow-lg'
        }
      `}
    >
      <div className="aspect-[4/3] bg-dark-charcoal/20 rounded-xl overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/60 via-transparent to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-metallic-gold font-display text-lg font-bold text-center">
          {name}
        </h3>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-metallic-gold rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-ivory-white rounded-full" />
        </div>
      )}
    </div>
  );
};