import React, { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../components/CartManager';
import { PriceCalculator } from '../components/PriceCalculator';

interface CartPageProps {
  onBack: () => void;
  onCheckout: () => void;
  customerData: { name: string; email: string; id: string };
}

export const CartPage: React.FC<CartPageProps> = ({ onBack, onCheckout, customerData }) => {
  const { cartItems, removeFromCart, getTotalPrice, getItemCount } = useCart();
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('₹', '');
  };

  const getConfigSummary = (config: any) => {
    const summary = [];
    
    if (typeof config.seats === 'number') {
      summary.push(`${config.seats} Seater`);
    } else if (config.seats === 123) {
      summary.push('1+2+3 Set');
    }
    
    if (config.needsLounger) {
      summary.push(`${config.loungerPosition} Lounger (${config.loungerLength}ft)`);
    }
    
    if (config.fabricPlan !== 'single') {
      summary.push(`${config.fabricPlan} Color Fabric`);
    }
    
    if (config.accessories.length > 0) {
      summary.push(`${config.accessories.length} Accessories`);
    }
    
    return summary.slice(0, 3).join(' • ');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-desert-sand bg-parchment relative">
        
        <div className="relative min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="bg-desert-sand backdrop-blur-sm rounded-2xl p-12 border border-champagne-gold/30 shadow-luxury shadow-parchment">
              <ShoppingBag className="w-16 h-16 text-champagne-gold mx-auto mb-6" />
              <h2 className="text-2xl font-display text-rich-brown-800 mb-4 font-bold">Your Cart is Empty</h2>
              <p className="text-warm-grey-600 mb-8">
                Start building your perfect sofa configuration
              </p>
              <button
                onClick={onBack}
                className="bg-burnt-gradient text-desert-sand font-body font-semibold py-3 px-6 rounded-xl hover:shadow-desert-shadow transition-all duration-200 hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-desert-sand bg-parchment pb-32">
      
      <div className="relative">
        {/* Header */}
        <header className="bg-desert-sand/95 backdrop-blur-sm border-b border-champagne-gold/30 shadow-luxury">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="text-warm-grey-600 hover:text-champagne-gold transition-colors duration-200"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-display text-rich-brown-800 tracking-wider font-bold">
                  Your Cart
                </h1>
              </div>
              <div className="text-rich-brown-800 font-body">
                <span>Welcome, {customerData.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-desert-sand backdrop-blur-sm rounded-2xl p-6 border border-champagne-gold/30 shadow-luxury shadow-parchment">
                <h2 className="text-xl font-display text-rich-brown-800 mb-6 font-bold">
                  Cart Items ({getItemCount()})
                </h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-desert-sand rounded-xl p-6 border border-champagne-gold/20 shadow-luxury shadow-parchment"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="w-16 h-16 bg-champagne-gold/20 rounded-lg flex items-center justify-center border border-champagne-gold/30">
                              <span className="text-burnt-sienna font-display text-lg font-bold">
                                {item.modelName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-rich-brown-800 font-body font-semibold text-lg">
                                {item.modelName} Sofa
                              </h3>
                              <p className="text-warm-grey-600 text-sm">
                                {getConfigSummary(item.config)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-champagne-gold font-body font-bold text-xl">
                            ₹{formatPrice(item.price)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                            className="text-warm-grey-600 hover:text-champagne-gold transition-colors duration-200"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-warm-grey-600 hover:text-red-500 transition-colors duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {editingItem === item.id && (
                        <div className="mt-6 pt-6 border-t border-metallic-gold/50">
                          <div className="bg-champagne-gold/10 rounded-lg p-4 border border-champagne-gold/20">
                            <h4 className="text-rich-brown-800 font-body font-semibold mb-3">Configuration Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-warm-grey-600">Seats:</span>
                                <span className="text-rich-brown-800 ml-2 font-medium">
                                  {item.config.seats === 123 ? '1+2+3 Set' : `${item.config.seats} Seater`}
                                </span>
                              </div>
                              <div>
                                <span className="text-warm-grey-600">Wood:</span>
                                <span className="text-rich-brown-800 ml-2 capitalize font-medium">{item.config.woodType}</span>
                              </div>
                              <div>
                                <span className="text-warm-grey-600">Fabric:</span>
                                <span className="text-rich-brown-800 ml-2 capitalize font-medium">{item.config.fabricPlan} Color</span>
                              </div>
                              <div>
                                <span className="text-warm-grey-600">Foam:</span>
                                <span className="text-rich-brown-800 ml-2 capitalize font-medium">{item.config.seatFoam}</span>
                              </div>
                            </div>
                            <button className="mt-4 text-champagne-gold hover:text-champagne-gold/80 text-sm font-medium">
                              Edit Configuration →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-desert-sand backdrop-blur-sm rounded-2xl p-6 border border-champagne-gold/30 shadow-luxury sticky top-8 shadow-parchment">
                <h2 className="text-xl font-display text-rich-brown-800 mb-6 font-bold">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-rich-brown-800">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>₹{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-rich-brown-800">
                    <span>Delivery</span>
                    <span className="text-burnt-sienna font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-rich-brown-800">
                    <span>Installation</span>
                    <span className="text-burnt-sienna font-medium">Included</span>
                  </div>
                  <hr className="border-champagne-gold/30" />
                  <div className="flex justify-between text-rich-brown-800 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-champagne-gold">₹{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full bg-burnt-gradient text-desert-sand font-body font-semibold py-4 px-6 rounded-xl hover:shadow-desert-shadow transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>

                <div className="mt-6 space-y-3 text-sm text-warm-grey-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-burnt-sienna rounded-full"></div>
                    <span>Free delivery & installation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-burnt-sienna rounded-full"></div>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-burnt-sienna rounded-full"></div>
                    <span>Lifetime warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};