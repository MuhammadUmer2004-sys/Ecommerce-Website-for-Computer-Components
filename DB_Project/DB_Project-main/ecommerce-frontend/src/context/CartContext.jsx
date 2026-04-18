import React, { createContext, useState, useContext, useEffect } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch cart from backend on login
  useEffect(() => {
    if (isLoggedIn) {
      const syncCart = async () => {
        const remoteCart = await cartService.getCart();
        if (remoteCart && remoteCart.length > 0) {
          // Merge logic or prioritize remote
          setCartItems(remoteCart.map(item => ({
            id: item.product_id,
            name: item.product_name,
            price: item.product_price,
            quantity: item.quantity,
            image: item.image_url
          })));
        }
      };
      syncCart();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const parsePrice = (price) => {
    if(!price) return 0;
    return parseInt(price.toString().replace(/[^0-9]/g, "")) || 0;
  };

  const addToCart = async (product) => {
    if (!product?.id) return;
    
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

    if (isLoggedIn) {
      await cartService.addToCart(product.id, 1);
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    if (isLoggedIn) {
      await cartService.removeFromCart(productId);
    }
  };

  const updateQuantity = async (productId, change) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
    
    if (isLoggedIn) {
        // Simple logic: add/remove 1
        if(change > 0) await cartService.addToCart(productId, 1);
        else await cartService.removeFromCart(productId); // This is crude but works for now
    }
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
