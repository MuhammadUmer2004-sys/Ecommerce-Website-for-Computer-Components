import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const parsePrice = (price) => {
    return parseInt(price?.toString().replace(/[^0-9]/g, "")) || 0;
  };

  const addToCart = (product) => {
    if (!product?.id || !product?.price) return;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => 
    sum + (parsePrice(item.price) * item.quantity), 0
  );

  return (
    <CartContext.Provider value={{ 
      cartItems,
      cartCount,
      cartTotal: cartTotal.toLocaleString(),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
