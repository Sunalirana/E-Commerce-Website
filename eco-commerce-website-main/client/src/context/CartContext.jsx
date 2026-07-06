import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart(prev =>
      prev.some(item => item._id === product._id)
        ? prev.map(item =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }]
    );
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(item => item._id !== productId));
  }

  function updateQuantity(productId, newQuantity) {
    setCart(prev => prev.map(item =>
      item._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}