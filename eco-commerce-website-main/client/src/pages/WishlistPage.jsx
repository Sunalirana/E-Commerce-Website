import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useContext(WishlistContext) || {
    wishlistItems: [],
    removeFromWishlist: () => {},
    clearWishlist: () => {}
  };
  const { addToCart } = useContext(CartContext) || { addToCart: () => {} };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product._id);
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <main>
        <div className="empty-wishlist">
          <div className="empty-icon">
            <i className="far fa-heart"></i>
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to your wishlist and shop them later</p>
          <Link to="/" className="shop-now-btn">
            <i className="fas fa-shopping-bag"></i>
            Start Shopping
          </Link>
        </div>

        <style jsx>{`
          .empty-wishlist {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
            padding: 2rem;
          }

          .empty-icon {
            font-size: 4rem;
            color: #d1d5db;
            margin-bottom: 1.5rem;
          }

          .empty-wishlist h2 {
            font-size: 1.75rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 0.5rem 0;
          }

          .empty-wishlist p {
            color: var(--text-secondary);
            margin: 0 0 2rem 0;
            font-size: 1.125rem;
          }

          .shop-now-btn {
            background: var(--primary-color);
            color: white;
            text-decoration: none;
            padding: 0.875rem 2rem;
            border-radius: 0.5rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s;
          }

          .shop-now-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
          }
        `}</style>
      </main>
    );
  }

  return (
    <main>
      <div className="wishlist-header">
        <h1>
          <i className="fas fa-heart"></i>
          My Wishlist
        </h1>
        <div className="wishlist-actions">
          <span className="item-count">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
          <button onClick={clearWishlist} className="clear-btn">
            <i className="fas fa-trash"></i>
            Clear All
          </button>
        </div>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map(product => (
          <div key={product._id || product.id} className="wishlist-item">
            <div className="product-image">
              <img src={product.imageUrl || '/placeholder-image.jpg'} alt={product.name || 'Product'} />
              <button
                className="remove-btn"
                onClick={() => removeFromWishlist(product._id || product.id)}
                title="Remove from wishlist"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="product-info">
              <h3>{product.name || 'Product Name'}</h3>
              <p className="product-description">
                {product.description ? `${product.description.substring(0, 100)}...` : 'No description available'}
              </p>
              
              <div className="product-tags">
                {product.tags?.slice(0, 2).map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              
              {product.isEcoFriendly && (
                <div className="eco-badge">
                  <i className="fas fa-leaf"></i>
                  Eco-Friendly
                </div>
              )}
              
              <div className="price">{formatCurrency(product.price || 0)}</div>

              <div className="item-actions">
                <Link to={`/product/${product._id || product.id}`} className="view-btn">
                  <i className="fas fa-eye"></i>
                  View Details
                </Link>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="add-to-cart-btn"
                >
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border-color);
        }

        .wishlist-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .wishlist-header h1 i {
          color: #ef4444;
        }

        .wishlist-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .item-count {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .clear-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: #dc2626;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .wishlist-item {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .wishlist-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .product-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .wishlist-item:hover .product-image img {
          transform: scale(1.05);
        }

        .remove-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-info h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .product-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }

        .product-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
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

        .eco-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--secondary-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }

        .item-actions {
          display: flex;
          gap: 0.75rem;
        }

        .view-btn {
          flex: 1;
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 0.75rem;
          border-radius: 0.5rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .view-btn:hover {
          background: var(--border-color);
        }

        .add-to-cart-btn {
          flex: 1.5;
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .add-to-cart-btn:hover {
          background: var(--primary-dark);
        }

        @media (max-width: 768px) {
          .wishlist-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .wishlist-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

export default WishlistPage;
