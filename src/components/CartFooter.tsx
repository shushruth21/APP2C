import React from 'react';
import { ShoppingCart, IndianRupee } from 'lucide-react';
import { useCart } from './CartManager';

interface CartFooterProps {
  onViewCart: () => void;
}

export const CartFooter: React.FC<CartFooterProps> = ({ onViewCart }) => {
  const { getItemCount, getTotalPrice } = useCart();
  
  const itemCount = getItemCount();
  const totalPrice = getTotalPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('₹', '');
  };

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-desert-sand/95 backdrop-blur-md border-t border-champagne-gold/30 p-4 z-50 shadow-luxury">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-rich-brown-800">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-body font-medium">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-1 text-champagne-gold">
            <IndianRupee className="w-4 h-4" />
            <span className="font-body font-semibold">₹{formatPrice(totalPrice)}</span>
          </div>
        </div>
        
        <button 
          onClick={onViewCart}
          className="bg-burnt-gradient text-desert-sand font-body font-semibold py-3 px-6 rounded-lg hover:shadow-desert-shadow transition-all duration-200 hover:scale-[1.02] flex items-center space-x-2 h-12"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>View Cart</span>
        </button>
      </div>
    </div>
  );
};