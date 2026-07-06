import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SearchAndFilter from '../components/SearchAndFilter';
import AIChatbot from '../components/AIChatbot';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    happyCustomers: 2500,
    co2Saved: 1250,
    treesPlanted: 500
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('featured'); // 'featured' or 'orders'

  useEffect(() => {
    fetchProducts();
    fetchSoldProducts();
  }, []);

  // Helper functions
  const getCategoryIcon = (category) => {
    const iconMap = {
      'eco-friendly': 'fas fa-leaf',
      'bamboo': 'fas fa-seedling',
      'organic': 'fas fa-spa',
      'solar': 'fas fa-sun',
      'recycled': 'fas fa-recycle',
      'cotton': 'fas fa-tshirt',
      'traditional': 'fas fa-om',
      'handloom': 'fas fa-hand-holding-heart'
    };
    return iconMap[category] || 'fas fa-tag';
  };

  const getProductCountByCategory = (category) => {
    return products.filter(product => product.tags && product.tags.includes(category)).length;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
      
      // Set featured products (first 6 products)
      setFeaturedProducts(response.data.slice(0, 6));
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.flatMap(product => product.tags || []))];
      setCategories(uniqueCategories.slice(0, 8)); // Top 8 categories
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalProducts: response.data.length
      }));
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else if (err.response?.status === 404) {
        setError('Products API endpoint not found. Please check the server configuration.');
      } else if (err.response?.status >= 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(`Failed to load products: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSoldProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/orders/sold-products`);
      setSoldProducts(response.data);
    } catch (err) {
      console.error('Error fetching sold products:', err);
      // Don't show error for sold products as it's not critical
    }
  };

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Loading amazing products...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 1rem;
          }
          .loading-spinner {
            font-size: 2rem;
            color: var(--primary-color);
          }
        `}</style>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-btn">
            <i className="fas fa-redo"></i>
            Try Again
          </button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 1rem;
            text-align: center;
          }
          .error-icon {
            font-size: 3rem;
            color: #ef4444;
          }
          .retry-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main>
      {/* Modern Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span className="gradient-text">🌱 EcoStore</span>
              <br />Sustainable Living Made Simple
            </h1>
            <p>
              Discover India's largest collection of eco-friendly products. 
              From traditional crafts to modern sustainable alternatives - 
              everything you need for a greener lifestyle.
            </p>
            
            <div className="hero-actions">
              <Link to="/products" className="cta-primary">
                <i className="fas fa-shopping-bag"></i>
                Shop Now
              </Link>
              <button className="cta-secondary" onClick={() => document.querySelector('.featured-section')?.scrollIntoView({ behavior: 'smooth' })}>
                <i className="fas fa-play"></i>
                Explore Products
              </button>
            </div>
            
            <div className="hero-features">
              <div className="feature">
                <i className="fas fa-shipping-fast"></i>
                <span>Free Shipping ₹4000+</span>
              </div>
              <div className="feature">
                <i className="fas fa-leaf"></i>
                <span>100% Eco-Friendly</span>
              </div>
              <div className="feature">
                <i className="fas fa-award"></i>
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="product-showcase">
              {featuredProducts.slice(0, 3).map((product, index) => (
                <div key={product._id} className={`showcase-item item-${index + 1}`}>
                  <img src={product.imageUrl} alt={product.name} />
                  <div className="item-info">
                    <h4>{product.name}</h4>
                    <span className="price">{formatCurrency(product.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalProducts}+</h3>
              <p>Eco Products</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.happyCustomers.toLocaleString()}+</h3>
              <p>Happy Customers</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.co2Saved}kg</h3>
              <p>CO₂ Saved</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-tree"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.treesPlanted}+</h3>
              <p>Trees Planted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Explore our diverse range of sustainable products</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category} className="category-card">
              <div className="category-icon">
                <i className={getCategoryIcon(category)}></i>
              </div>
              <h3>{category}</h3>
              <p>{getProductCountByCategory(category)} products</p>
              <button className="category-btn">
                Explore <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked sustainable products for conscious consumers</p>
        </div>
        
        <div className="featured-grid">
          {featuredProducts.map(product => (
            <ProductCard key={`featured-${product._id}`} product={product} />
          ))}
        </div>
        
        <div className="view-all-container">
          <Link to="/products" className="view-all-btn">
            <span>View All {products.length} Products</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Orders Section - Previously Sold Products */}
      <section className="orders-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-shopping-bag"></i>
            Previously Sold Products
          </h2>
          <p>Popular items that have been purchased by our customers</p>
        </div>

        {soldProducts.length > 0 ? (
          <>
            <div className="orders-grid">
              {soldProducts.slice(0, 6).map(product => (
                <div key={`sold-${product._id}`} className="sold-product-card">
                  <ProductCard product={product} />
                  <div className="sold-badge">
                    <i className="fas fa-check-circle"></i>
                    <span>Sold {product.soldQuantity || 1} times</span>
                  </div>
                </div>
              ))}
            </div>

            {soldProducts.length > 6 && (
              <div className="view-all-container">
                <button
                  onClick={() => setActiveSection('orders')}
                  className="view-all-btn"
                >
                  <span>View All {soldProducts.length} Sold Products</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-orders">
            <i className="fas fa-shopping-cart"></i>
            <p>No products have been sold yet</p>
          </div>
        )}
      </section>

      {/* Search and Browse Section */}
      <section className="browse-section">
        <div className="section-header">
          <h2>Browse All Products</h2>
          <p>Find exactly what you're looking for with our advanced search and filters</p>
        </div>
        
        <SearchAndFilter
          products={[...products, ...soldProducts]}
          onFilteredProducts={setFilteredProducts}
        />

        <div className="products-section">
          <div className="section-header">
            <h2>
              {filteredProducts.length === products.length
                ? 'All Products'
                : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
              }
            </h2>
            <span className="product-count">
              {filteredProducts.length} of {products.length} products
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="product-list">
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Chatbot */}
      <AIChatbot />

      <style jsx>{`
        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .hero-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          left: 10%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          left: 50%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text h1 {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: white;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-text p {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .cta-primary, .cta-secondary {
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .cta-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
        }

        .cta-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }

        .hero-features {
          display: flex;
          gap: 2rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .feature i {
          color: #fbbf24;
        }

        .product-showcase {
          position: relative;
          height: 500px;
        }

        .showcase-item {
          position: absolute;
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          width: 200px;
        }

        .showcase-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .item-1 {
          top: 0;
          right: 0;
          animation: float 6s ease-in-out infinite;
        }

        .item-2 {
          top: 50%;
          left: 0;
          animation: float 6s ease-in-out infinite 2s;
        }

        .item-3 {
          bottom: 0;
          right: 50px;
          animation: float 6s ease-in-out infinite 4s;
        }

        .showcase-item img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .item-info h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          color: var(--text-primary);
        }

        .item-info .price {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        /* Stats Section */
        .stats-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .stat-item {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
          color: white;
          font-size: 2rem;
        }

        .stat-content h3 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .stat-content p {
          font-size: 1.125rem;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }

        /* Categories Section */
        .categories-section {
          padding: 4rem 2rem;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-header h2 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .section-header p {
          font-size: 1.25rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }

        .categories-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .category-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border-color: #2563eb;
        }

        .category-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
          color: white;
          font-size: 2rem;
        }

        .category-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          text-transform: capitalize;
        }

        .category-card p {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
          font-size: 1rem;
        }

        .category-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 auto;
        }

        .category-btn:hover {
          background: #1d4ed8;
          transform: translateX(5px);
        }

        /* Featured Section */
        .featured-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .featured-grid {
          max-width: 1200px;
          margin: 0 auto 3rem auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .view-all-container {
          text-align: center;
        }

        .view-all-btn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.125rem;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
        }

        .view-all-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
        }

        /* Browse Section */
        .browse-section {
          padding: 4rem 2rem;
          background: white;
        }

        .products-section {
          max-width: 1200px;
          margin: 2rem auto 0 auto;
        }

        .product-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .no-products {
          text-align: center;
          padding: 4rem 2rem;
        }

        .no-products-icon {
          font-size: 4rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .no-products h3 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .no-products p {
          color: #6b7280;
          margin: 0;
        }

        .product-count {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Orders Section */
        .orders-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .sold-product-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .sold-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .sold-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .sold-badge i {
          font-size: 0.75rem;
        }

        .no-orders {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .no-orders i {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-orders p {
          font-size: 1.125rem;
          margin: 0;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .hero-text h1 {
            font-size: 2.5rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-features {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }

          .product-showcase {
            height: 300px;
          }

          .showcase-item {
            width: 150px;
          }

          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .featured-grid {
            grid-template-columns: 1fr;
          }

          .orders-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .product-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

export default Home;
