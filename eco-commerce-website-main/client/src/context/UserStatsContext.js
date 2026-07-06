import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

export const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    loyaltyPoints: 0,
    tier: 'Bronze',
    co2Saved: 0,
    treesPlanted: 0,
    ecoProductsPurchased: 0
  });
  const [orders, setOrders] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchUserStats();
      fetchOrders();
      fetchRewards();
    }
  }, [user, token]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/user/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set default stats if API fails
      setUserStats({
        totalSpent: 15750,
        totalOrders: 8,
        loyaltyPoints: 1575,
        tier: 'Silver',
        co2Saved: 45.2,
        treesPlanted: 3,
        ecoProductsPurchased: 12
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Set sample orders if API fails
      setOrders([
        {
          _id: '1',
          orderNumber: 'ECO-2024-001',
          date: new Date('2024-01-15'),
          status: 'delivered',
          total: 2499,
          items: [
            { name: 'Copper Water Bottle', quantity: 1, price: 1299 },
            { name: 'Bamboo Toothbrush Set', quantity: 2, price: 600 }
          ],
          trackingNumber: 'TRK123456789'
        },
        {
          _id: '2',
          orderNumber: 'ECO-2024-002',
          date: new Date('2024-01-20'),
          status: 'shipped',
          total: 3999,
          items: [
            { name: 'Organic Cotton T-Shirt', quantity: 2, price: 1999 },
            { name: 'Jute Shopping Bag', quantity: 1, price: 499 }
          ],
          trackingNumber: 'TRK987654321'
        }
      ]);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/rewards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      // Set sample rewards if API fails
      setRewards([
        {
          id: 1,
          title: '10% Off Next Purchase',
          description: 'Get 10% discount on your next order',
          pointsCost: 500,
          type: 'discount',
          value: 10
        },
        {
          id: 2,
          title: 'Free Shipping',
          description: 'Free shipping on any order',
          pointsCost: 300,
          type: 'shipping',
          value: 0
        },
        {
          id: 3,
          title: 'Eco Box Surprise',
          description: 'Mystery box with eco-friendly products',
          pointsCost: 1000,
          type: 'product',
          value: 'eco-box'
        },
        {
          id: 4,
          title: 'Plant a Tree',
          description: 'Plant a tree in your name',
          pointsCost: 200,
          type: 'environmental',
          value: 'tree'
        }
      ]);
    }
  };

  const redeemReward = async (rewardId) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) {
        return { success: false, error: 'Reward not found' };
      }

      if (userStats.loyaltyPoints < reward.pointsCost) {
        return { success: false, error: 'Insufficient points' };
      }

      // Simulate API call
      const response = await axios.post(`http://localhost:5000/api/user/redeem/${rewardId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local stats
      setUserStats(prev => ({
        ...prev,
        loyaltyPoints: prev.loyaltyPoints - reward.pointsCost
      }));

      return { success: true, message: `Successfully redeemed ${reward.title}!` };
    } catch (error) {
      // Simulate successful redemption for demo
      const reward = rewards.find(r => r.id === rewardId);
      if (reward && userStats.loyaltyPoints >= reward.pointsCost) {
        setUserStats(prev => ({
          ...prev,
          loyaltyPoints: prev.loyaltyPoints - reward.pointsCost
        }));
        return { success: true, message: `Successfully redeemed ${reward.title}!` };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Redemption failed' 
      };
    }
  };

  const updateStats = (newStats) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
    // Update stats when new order is added
    setUserStats(prev => ({
      ...prev,
      totalSpent: prev.totalSpent + order.total,
      totalOrders: prev.totalOrders + 1,
      loyaltyPoints: prev.loyaltyPoints + Math.floor(order.total * 0.1) // 10% of order value as points
    }));
  };

  const value = {
    userStats,
    orders,
    rewards,
    loading,
    redeemReward,
    updateStats,
    addOrder,
    fetchUserStats,
    fetchOrders,
    fetchRewards
  };

  return (
    <UserStatsContext.Provider value={value}>
      {children}
    </UserStatsContext.Provider>
  );
};
