import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

function ProductCard({ product }) {
  // All hooks must be called before any conditional returns
  const { addToCart } = useContext(CartContext) || { addToCart: () => {} };
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext) || {
    wishlistItems: [],
    addToWishlist: () => {},
    removeFromWishlist: () => {},
    isInWishlist: () => false
  };
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Safety check for product (after all hooks)
  if (!product || !product._id) {
    return null;
  }

  const productInWishlist = isInWishlist ? isInWishlist(product._id) : false;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    addToCart(product);

    // Simulate loading for better UX
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  const handleWishlistToggle = () => {
    if (productInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star" style={{ color: '#fbbf24' }}></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt" style={{ color: '#fbbf24' }}></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star" style={{ color: '#d1d5db' }}></i>);
    }

    return stars;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.imageUrl || '/placeholder-image.jpg'} alt={product.name || 'Product'} />
        <button
          className={`wishlist-btn ${productInWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i className={productInWishlist ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
        {product.isEcoFriendly && (
          <div className="eco-badge">
            <i className="fas fa-leaf"></i>
            Eco-Friendly
          </div>
        )}
      </div>

      <div className="product-info">
        <h2>{product.name || 'Product Name'}</h2>

        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="rating-text">({product.rating || 4.5})</span>
        </div>

        <p className="product-description">
          {product.description ? `${product.description.substring(0, 80)}...` : 'No description available'}
        </p>

        <div className="product-tags">
          {product.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="price">{formatCurrency(product.price || 0)}</div>

        <div className="card-actions">
          <Link to={`/product/${product._id}`} className="btn-secondary">
            <i className="fas fa-eye"></i>
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="btn-primary"
          >
            {isAddingToCart ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Adding...
              </>
            ) : (
              <>
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-image-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .wishlist-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
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
          text-align: left;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .rating-text {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .product-description {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0.75rem 0;
          line-height: 1.5;
        }

        .product-tags {
          display: flex;
          gap: 0.5rem;
          margin: 0.75rem 0;
          flex-wrap: wrap;
        }

        .tag {
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .btn-primary {
          background: var(--primary-color);
          flex: 1.5;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

export default ProductCard;
