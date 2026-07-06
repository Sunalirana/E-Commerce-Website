import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  function addToWishlist(product) {
    setWishlist(prev => {
      if (prev.some(item => item._id === product._id)) {
        return prev; // Already in wishlist
      }
      return [...prev, product];
    });
  }

  function removeFromWishlist(productId) {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  }

  function clearWishlist() {
    setWishlist([]);
  }

  function isInWishlist(productId) {
    return wishlist.some(item => item._id === productId);
  }

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      addToWishlist, 
      removeFromWishlist, 
      clearWishlist,
      isInWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}
