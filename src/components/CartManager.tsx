import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  modelName: string;
  config: any;
  price: number;
  timestamp: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (modelName: string, config: any, price: number) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, config: any, price: number) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('estre-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('estre-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (modelName: string, config: any, price: number) => {
    const newItem: CartItem = {
      id: `${modelName}-${Date.now()}`,
      modelName,
      config,
      price,
      timestamp: Date.now(),
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItem = (id: string, config: any, price: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, config, price } : item
    ));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const getItemCount = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItem,
      getTotalPrice,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};