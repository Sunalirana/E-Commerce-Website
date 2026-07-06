import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserStatsContext } from '../context/UserStatsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ImageUpload from '../components/ImageUpload';
import OrderCard from '../components/OrderCard';
import RewardCard from '../components/RewardCard';
import axios from 'axios';

function ProfilePage() {
  const { token, user, logout } = useContext(AuthContext) || { token: null, user: null, logout: () => {} };
  const { userStats, orders, redeemReward } = useContext(UserStatsContext) || {
    userStats: {
      totalSpent: 0,
      totalOrders: 0,
      loyaltyPoints: 0,
      tier: 'Bronze',
      co2Saved: 0,
      treesPlanted: 0,
      ecoProductsPurchased: 0
    },
    orders: [],
    redeemReward: () => {}
  };
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    preferences: {
      newsletter: true,
      notifications: true,
      ecoTips: true
    }
  });

  // Available rewards
  const availableRewards = [
    {
      id: 1,
      title: '10% Off Next Order',
      description: 'Get 10% discount on your next purchase of any amount',
      cost: 100,
      type: 'discount',
      value: '$10+ savings',
      popular: true,
      features: ['Valid for 30 days', 'Stackable with sales', 'No minimum purchase']
    },
    {
      id: 2,
      title: 'Free Shipping',
      description: 'Get free shipping on any order, regardless of amount',
      cost: 50,
      type: 'shipping',
      value: '$9.99 value',
      features: ['Valid for 60 days', 'Any order size', 'Express shipping available']
    },
    {
      id: 3,
      title: 'Mystery Eco Box',
      description: 'Receive a curated box of sustainable products worth $50+',
      cost: 500,
      type: 'product',
      value: '$50+ value',
      savings: '$25',
      features: ['3-5 eco products', 'Surprise items', 'Limited edition items']
    },
    {
      id: 4,
      title: 'Plant a Tree',
      description: 'We\'ll plant a tree in your name to offset carbon emissions',
      cost: 200,
      type: 'eco',
      value: 'Environmental impact',
      features: ['Certificate included', 'GPS coordinates', 'Annual updates']
    }
  ];

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('Please login to view your profile');
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setProfileImage(response.data.profileImage || null);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        preferences: response.data.preferences || {
          newsletter: true,
          notifications: true,
          ecoTips: true
        }
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      setProfile({ ...profile, ...formData, profileImage });
      setEditMode(false);
      // Show success message
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleImageChange = (newImage) => {
    setProfileImage(newImage);
    // Simulate saving to profile
    setProfile(prev => ({ ...prev, profileImage: newImage }));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };



  const getLoyaltyLevel = (points) => {
    if (points >= 1000) return { level: 'Platinum', color: '#8b5cf6', next: null };
    if (points >= 500) return { level: 'Gold', color: '#f59e0b', next: 1000 };
    if (points >= 200) return { level: 'Silver', color: '#6b7280', next: 500 };
    return { level: 'Bronze', color: '#92400e', next: 200 };
  };

  const handleReorder = (order) => {
    // Implement reorder functionality
    console.log('Reordering:', order);
  };

  const handleReview = (order) => {
    // Implement review functionality
    console.log('Writing review for:', order);
  };

  const handleRedeemReward = async (reward) => {
    try {
      await redeemReward(reward.cost);
      alert(`Successfully redeemed: ${reward.title}`);
    } catch (error) {
      alert('Failed to redeem reward');
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading your profile..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage title="Profile Error" message={error} onRetry={fetchProfile} />;
  }

  if (!profile) {
    return (
      <main>
        <div className="auth-required">
          <div className="auth-icon">
            <i className="fas fa-user-lock"></i>
          </div>
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile</p>
          <button onClick={() => window.location.href = '/login'} className="login-btn">
            <i className="fas fa-sign-in-alt"></i>
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  const loyaltyInfo = getLoyaltyLevel(userStats.loyaltyPoints || 0);

  return (
    <main>
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {profileImage ? (
                <img src={profileImage} alt={profile.name} />
              ) : (
                <div className="avatar-initials">
                  {getInitials(profile.name)}
                </div>
              )}
            </div>
            <button
              className="edit-avatar-btn"
              onClick={() => setShowImageUpload(true)}
              title="Change profile picture"
            >
              <i className="fas fa-camera"></i>
            </button>
          </div>
          <div className="profile-info">
            <h1>Welcome back, {profile.name}!</h1>
            <p className="profile-email">{profile.email}</p>
            <div className="loyalty-badge" style={{ backgroundColor: loyaltyInfo.color }}>
              <i className="fas fa-crown"></i>
              {loyaltyInfo.level} Member
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <div className="stat-value">{userStats?.loyaltyPoints || 0}</div>
              <div className="stat-label">Loyalty Points</div>
            </div>
            <div className="stat">
              <div className="stat-value">{userStats?.totalOrders || 0}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat">
              <div className="stat-value">₹{(userStats?.totalSpent || 0).toFixed(2)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Loyalty Progress */}
        {loyaltyInfo.next && (
          <div className="loyalty-progress">
            <div className="progress-header">
              <span>Progress to {loyaltyInfo.next === 1000 ? 'Platinum' : loyaltyInfo.next === 500 ? 'Gold' : 'Silver'}</span>
              <span>{userStats?.loyaltyPoints || 0} / {loyaltyInfo.next} points</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((userStats?.loyaltyPoints || 0) / loyaltyInfo.next) * 100}%`,
                  backgroundColor: loyaltyInfo.color
                }}
              ></div>
            </div>
            <p className="progress-text">
              Earn {loyaltyInfo.next - (userStats?.loyaltyPoints || 0)} more points to reach the next level!
            </p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-line"></i>
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-box"></i>
            Order History
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i>
            Account Settings
          </button>
          <button
            className={`tab ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            <i className="fas fa-gift"></i>
            Rewards
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-grid">
                <div className="overview-card">
                  <div className="card-header">
                    <h3>
                      <i className="fas fa-leaf"></i>
                      Eco Impact
                    </h3>
                  </div>
                  <div className="eco-stats">
                    <div className="eco-stat">
                      <div className="eco-value">{userStats?.co2Saved || 0} kg</div>
                      <div className="eco-label">CO₂ Saved</div>
                    </div>
                    <div className="eco-stat">
                      <div className="eco-value">{userStats?.ecoProductsPurchased || 0}</div>
                      <div className="eco-label">Eco Products</div>
                    </div>
                    <div className="eco-stat">
                      <div className="eco-value">{userStats?.treesPlanted || 0}</div>
                      <div className="eco-label">Trees Planted</div>
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="card-header">
                    <h3>
                      <i className="fas fa-clock"></i>
                      Recent Activity
                    </h3>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <i className="fas fa-shopping-cart activity-icon"></i>
                      <div>
                        <div className="activity-text">Ordered Solar Power Bank</div>
                        <div className="activity-date">2 days ago</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <i className="fas fa-heart activity-icon"></i>
                      <div>
                        <div className="activity-text">Added Bamboo Toothbrush to wishlist</div>
                        <div className="activity-date">1 week ago</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <i className="fas fa-star activity-icon"></i>
                      <div>
                        <div className="activity-text">Reviewed Organic Cotton T-Shirt</div>
                        <div className="activity-date">2 weeks ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="card-header">
                    <h3>
                      <i className="fas fa-trophy"></i>
                      Achievements
                    </h3>
                  </div>
                  <div className="achievements">
                    <div className="achievement earned">
                      <i className="fas fa-seedling"></i>
                      <span>Eco Warrior</span>
                    </div>
                    <div className="achievement earned">
                      <i className="fas fa-shopping-bag"></i>
                      <span>First Purchase</span>
                    </div>
                    <div className="achievement">
                      <i className="fas fa-users"></i>
                      <span>Referral Master</span>
                    </div>
                    <div className="achievement">
                      <i className="fas fa-calendar"></i>
                      <span>Monthly Shopper</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-content">
              <div className="orders-header">
                <h3>Order History</h3>
                <div className="order-filters">
                  <select className="filter-select">
                    <option value="all">All Orders</option>
                    <option value="delivered">Delivered</option>
                    <option value="shipped">Shipped</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
              </div>

              <div className="orders-list">
                {orders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onReorder={handleReorder}
                    onReview={handleReview}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-content">
              <div className="settings-header">
                <h3>Account Settings</h3>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`edit-btn ${editMode ? 'active' : ''}`}
                >
                  <i className={`fas ${editMode ? 'fa-times' : 'fa-edit'}`}></i>
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="settings-form">
                <div className="form-section">
                  <h4>Profile Picture</h4>
                  <div className="profile-picture-section">
                    <div className="current-picture">
                      <div className="picture-preview">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" />
                        ) : (
                          <div className="picture-placeholder">
                            {getInitials(profile.name)}
                          </div>
                        )}
                      </div>
                      <div className="picture-info">
                        <p>Your profile picture is visible to other users</p>
                        <button
                          onClick={() => setShowImageUpload(true)}
                          className="change-picture-btn"
                        >
                          <i className="fas fa-camera"></i>
                          Change Picture
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Personal Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Shipping Address</h4>
                  <div className="form-group">
                    <label htmlFor="address.street">Street Address</label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="address.city">City</label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address.state">State</label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address.zipCode">ZIP Code</label>
                      <input
                        type="text"
                        id="address.zipCode"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Preferences</h4>
                  <div className="preferences-grid">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="preferences.newsletter"
                        checked={formData.preferences.newsletter}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                      <span className="checkmark"></span>
                      <div>
                        <strong>Newsletter</strong>
                        <p>Receive updates about new eco-friendly products</p>
                      </div>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="preferences.notifications"
                        checked={formData.preferences.notifications}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                      <span className="checkmark"></span>
                      <div>
                        <strong>Order Notifications</strong>
                        <p>Get notified about order status updates</p>
                      </div>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="preferences.ecoTips"
                        checked={formData.preferences.ecoTips}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                      <span className="checkmark"></span>
                      <div>
                        <strong>Eco Tips</strong>
                        <p>Receive sustainability tips and advice</p>
                      </div>
                    </label>
                  </div>
                </div>

                {editMode && (
                  <div className="form-actions">
                    <button onClick={() => setEditMode(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button onClick={handleSaveProfile} className="btn-primary">
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="rewards-content">
              <div className="rewards-header">
                <h3>Loyalty Rewards</h3>
                <div className="points-balance">
                  <span className="points-value">{userStats?.loyaltyPoints || 0}</span>
                  <span className="points-label">Available Points</span>
                </div>
              </div>

              <div className="rewards-grid">
                {availableRewards.map(reward => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    userPoints={userStats?.loyaltyPoints || 0}
                    onRedeem={handleRedeemReward}
                  />
                ))}
              </div>

              <div className="earn-points">
                <h4>How to Earn More Points</h4>
                <div className="earn-methods">
                  <div className="earn-method">
                    <i className="fas fa-shopping-cart"></i>
                    <div>
                      <strong>Make Purchases</strong>
                      <p>Earn 1 point for every $1 spent</p>
                    </div>
                  </div>
                  <div className="earn-method">
                    <i className="fas fa-star"></i>
                    <div>
                      <strong>Write Reviews</strong>
                      <p>Get 10 points for each product review</p>
                    </div>
                  </div>
                  <div className="earn-method">
                    <i className="fas fa-users"></i>
                    <div>
                      <strong>Refer Friends</strong>
                      <p>Earn 50 points for each successful referral</p>
                    </div>
                  </div>
                  <div className="earn-method">
                    <i className="fas fa-birthday-cake"></i>
                    <div>
                      <strong>Birthday Bonus</strong>
                      <p>Get 100 points on your birthday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="profile-footer">
          <button onClick={logout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Sign Out
          </button>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          currentImage={profileImage}
          onImageChange={handleImageChange}
          onClose={() => setShowImageUpload(false)}
        />
      )}

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .auth-required {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          gap: 1.5rem;
        }

        .auth-icon {
          font-size: 4rem;
          color: var(--text-secondary);
        }

        .login-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .profile-header {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          color: white;
          padding: 2rem;
          border-radius: 1rem;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 2rem;
          align-items: center;
          margin-bottom: 2rem;
        }

        .profile-avatar-container {
          position: relative;
          display: inline-block;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-initials {
          background: rgba(255, 255, 255, 0.2);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .edit-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: var(--primary-color);
          color: white;
          border: 2px solid white;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .edit-avatar-btn:hover {
          background: var(--primary-dark);
          transform: scale(1.1);
        }

        .profile-avatar-container:hover .profile-avatar {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .profile-info h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .profile-email {
          opacity: 0.9;
          margin: 0 0 1rem 0;
        }

        .loyalty-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .profile-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
          margin-top: 0.25rem;
        }

        .loyalty-progress {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          margin-bottom: 2rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .progress-bar {
          height: 8px;
          background: var(--bg-secondary);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0;
        }

        .profile-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: white;
          padding: 0.5rem;
          border-radius: 1rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          padding: 1rem;
          border-radius: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .tab:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .tab.active {
          background: var(--primary-color);
          color: white;
        }

        .tab-content {
          background: white;
          border-radius: 1rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 2rem;
        }

        .overview-card {
          background: var(--bg-secondary);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .card-header {
          margin-bottom: 1.5rem;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .eco-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .eco-stat {
          text-align: center;
        }

        .eco-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          line-height: 1;
        }

        .eco-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-text {
          font-weight: 500;
          color: var(--text-primary);
        }

        .activity-date {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .achievements {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .achievement {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 2px solid var(--border-color);
          opacity: 0.5;
          transition: all 0.2s;
        }

        .achievement.earned {
          opacity: 1;
          background: linear-gradient(135deg, var(--secondary-color), #059669);
          color: white;
          border-color: var(--secondary-color);
        }

        .achievement i {
          font-size: 1.25rem;
        }

        @media (max-width: 768px) {
          .profile-header {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1.5rem;
          }

          .profile-avatar-container {
            align-self: center;
            justify-self: center;
          }

          .profile-avatar {
            width: 120px;
            height: 120px;
          }

          .edit-avatar-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .profile-stats {
            justify-content: center;
          }

          .profile-tabs {
            flex-direction: column;
          }

          .overview-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .current-picture {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
        }

        /* Profile Picture Section Styles */
        .profile-picture-section {
          margin-bottom: 2rem;
        }

        .current-picture {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem;
          background: var(--bg-secondary);
          border-radius: 1rem;
          border: 1px solid var(--border-color);
        }

        .picture-preview {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--border-color);
          flex-shrink: 0;
        }

        .picture-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .picture-placeholder {
          width: 100%;
          height: 100%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
        }

        .picture-info {
          flex: 1;
        }

        .picture-info p {
          margin: 0 0 1rem 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .change-picture-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .change-picture-btn:hover {
          background: var(--primary-dark);
        }
      `}</style>
    </main>
  );
}

export default ProfilePage;