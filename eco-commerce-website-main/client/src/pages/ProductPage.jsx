import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import ProductReviews from '../components/ProductReviews';
import { formatCurrency } from '../utils/currency';
import axios from 'axios';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext) || { addToCart: () => {} };
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext) || {
    wishlistItems: [],
    addToWishlist: () => {},
    removeFromWishlist: () => {},
    isInWishlist: () => false
  };

  const productInWishlist = product && isInWishlist ? isInWishlist(product._id) : false;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (productInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>Loading product details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="product-page">
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={product.imageUrl || '/placeholder-image.jpg'}
              alt={product.name || 'Product'}
            />
            <button
              className={`wishlist-btn ${productInWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              title={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <i className={productInWishlist ? 'fas fa-heart' : 'far fa-heart'}></i>
            </button>
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1>{product.name || 'Product Name'}</h1>
            <div className="product-rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <span className="rating-text">(4.5) • 127 reviews</span>
            </div>
          </div>

          <div className="price-section">
            <div className="current-price">{formatCurrency(product.price || 0)}</div>
            <div className="price-note">Free shipping on orders over ₹4000</div>
          </div>

          {product.isEcoFriendly && (
            <div className="eco-badge">
              <i className="fas fa-leaf"></i>
              <span>Eco-Friendly Product</span>
              <div className="eco-description">
                This product is made with sustainable materials and eco-friendly processes.
              </div>
            </div>
          )}

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available for this product.'}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              <h3>Features</h3>
              <div className="tags-list">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="purchase-section">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="quantity-input"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={handleAddToCart} className="add-to-cart-btn">
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
              <button className="buy-now-btn">
                <i className="fas fa-bolt"></i>
                Buy Now
              </button>
            </div>
          </div>

          <div className="product-features">
            <div className="feature">
              <i className="fas fa-truck"></i>
              <div>
                <strong>Free Shipping</strong>
                <span>On orders over $50</span>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-undo"></i>
              <div>
                <strong>30-Day Returns</strong>
                <span>Easy returns & exchanges</span>
              </div>
            </div>
            <div className="feature">
              <i className="fas fa-shield-alt"></i>
              <div>
                <strong>2-Year Warranty</strong>
                <span>Full manufacturer warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} />

      <style jsx>{`
        .product-page {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .product-gallery {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .main-image {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .main-image img {
          width: 100%;
          height: 500px;
          object-fit: cover;
        }

        .wishlist-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.25rem;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }

        .wishlist-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
        }

        .wishlist-btn.active {
          color: #ef4444;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .product-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stars {
          display: flex;
          gap: 0.25rem;
          color: #fbbf24;
          font-size: 1.125rem;
        }

        .rating-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .price-section {
          padding: 1.5rem 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .current-price {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .price-note {
          color: var(--secondary-color);
          font-weight: 500;
        }

        .eco-badge {
          background: linear-gradient(135deg, var(--secondary-color), #059669);
          color: white;
          padding: 1.5rem;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .eco-badge > span {
          font-weight: 600;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .eco-description {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .product-description h3,
        .product-tags h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .product-description p {
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .tag {
          background: var(--bg-secondary);
          color: var(--text-primary);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid var(--border-color);
        }

        .purchase-section {
          background: var(--bg-secondary);
          padding: 2rem;
          border-radius: 1rem;
          border: 1px solid var(--border-color);
        }

        .quantity-selector {
          margin-bottom: 2rem;
        }

        .quantity-selector label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-btn {
          background: white;
          border: 2px solid var(--border-color);
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quantity-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .quantity-input {
          width: 80px;
          height: 40px;
          text-align: center;
          border: 2px solid var(--border-color);
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
        }

        .quantity-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .add-to-cart-btn,
        .buy-now-btn {
          flex: 1;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .add-to-cart-btn {
          background: var(--primary-color);
          color: white;
          border: none;
        }

        .add-to-cart-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .buy-now-btn {
          background: var(--accent-color);
          color: white;
          border: none;
        }

        .buy-now-btn:hover {
          background: #d97706;
          transform: translateY(-1px);
        }

        .product-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
        }

        .feature i {
          font-size: 1.5rem;
          color: var(--primary-color);
          width: 24px;
          text-align: center;
        }

        .feature div {
          display: flex;
          flex-direction: column;
        }

        .feature strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        .feature span {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          gap: 1rem;
        }

        .loading-spinner,
        .error-icon {
          font-size: 3rem;
          color: var(--primary-color);
        }

        .error-icon {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .product-page {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 1rem;
          }

          .product-header h1 {
            font-size: 2rem;
          }

          .current-price {
            font-size: 2rem;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

export default ProductPage;
