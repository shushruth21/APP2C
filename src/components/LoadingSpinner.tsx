import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-champagne-gold/30 border-t-champagne-gold ${sizeClasses[size]} ${className}`} />
  );
};

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  count = 1 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-champagne-gold/20 rounded ${className}`}
        />
      ))}
    </>
  );
};

export const CategoryCardSkeleton: React.FC = () => (
  <div className="bg-desert-sand border border-champagne-gold/30 rounded-2xl overflow-hidden shadow-luxury animate-pulse">
    <div className="aspect-[4/3] bg-champagne-gold/20" />
    <div className="p-6 space-y-3">
      <div className="h-6 bg-champagne-gold/20 rounded w-3/4" />
      <div className="h-4 bg-champagne-gold/20 rounded w-full" />
      <div className="h-4 bg-champagne-gold/20 rounded w-2/3" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-champagne-gold/20 rounded w-1/3" />
        <div className="w-8 h-8 bg-champagne-gold/20 rounded-full" />
      </div>
    </div>
  </div>
);

export const ConfigurationSkeleton: React.FC = () => (
  <div className="space-y-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-desert-sand rounded-2xl border border-champagne-gold/30 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-champagne-gold/20 rounded" />
            <div className="h-6 bg-champagne-gold/20 rounded w-48" />
          </div>
          <div className="w-5 h-5 bg-champagne-gold/20 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, fieldIndex) => (
            <div key={fieldIndex} className="space-y-2">
              <div className="h-4 bg-champagne-gold/20 rounded w-1/3" />
              <div className="h-12 bg-champagne-gold/20 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);