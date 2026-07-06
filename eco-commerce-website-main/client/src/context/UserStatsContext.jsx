import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const UserStatsContext = createContext();

export function UserStatsProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    loyaltyPoints: 0,
    ecoImpact: {
      co2Saved: 12.5,
      ecoProducts: 8,
      treesPlanted: 3
    }
  });

  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.97,
      items: [
        { 
          name: 'Eco-Friendly Water Bottle', 
          quantity: 2, 
          price: 29.99,
          imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100'
        },
        { 
          name: 'Organic Cotton T-Shirt', 
          quantity: 1, 
          price: 24.99,
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100'
        }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      date: '2024-01-08',
      status: 'Shipped',
      total: 49.99,
      items: [
        { 
          name: 'Solar Power Bank', 
          quantity: 1, 
          price: 49.99,
          imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100'
        }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-003',
      date: '2024-01-01',
      status: 'Processing',
      total: 32.98,
      items: [
        { 
          name: 'Bamboo Phone Case', 
          quantity: 1, 
          price: 19.99,
          imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100'
        },
        { 
          name: 'Recycled Notebook', 
          quantity: 1, 
          price: 12.99,
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'
        }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: null
    }
  ]);

  // Calculate stats from orders
  useEffect(() => {
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const loyaltyPoints = Math.floor(totalSpent); // 1 point per dollar

    setUserStats(prev => ({
      ...prev,
      totalSpent,
      totalOrders,
      loyaltyPoints
    }));
  }, [orders]);

  const addOrder = (newOrder) => {
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      ...newOrder,
      trackingNumber: null
    };
    
    setOrders(prev => [order, ...prev]);
    
    // Update eco impact based on eco-friendly products
    const ecoItems = newOrder.items.filter(item => item.isEcoFriendly);
    if (ecoItems.length > 0) {
      setUserStats(prev => ({
        ...prev,
        ecoImpact: {
          ...prev.ecoImpact,
          co2Saved: prev.ecoImpact.co2Saved + (ecoItems.length * 2.5),
          ecoProducts: prev.ecoImpact.ecoProducts + ecoItems.length,
          treesPlanted: prev.ecoImpact.treesPlanted + Math.floor(ecoItems.length / 3)
        }
      }));
    }
  };

  const updateOrderStatus = (orderId, newStatus, trackingNumber = null) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, trackingNumber }
        : order
    ));
  };

  const redeemReward = (pointsCost) => {
    setUserStats(prev => ({
      ...prev,
      loyaltyPoints: Math.max(0, prev.loyaltyPoints - pointsCost)
    }));
  };

  return (
    <UserStatsContext.Provider value={{ 
      userStats, 
      orders, 
      addOrder, 
      updateOrderStatus,
      redeemReward,
      setUserStats
    }}>
      {children}
    </UserStatsContext.Provider>
  );
}
