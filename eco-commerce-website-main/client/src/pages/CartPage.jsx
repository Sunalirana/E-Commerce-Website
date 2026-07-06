import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { UserStatsContext } from '../context/UserStatsContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/currency';
import axios from 'axios';

function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateQuantity, getCartTotal } = useContext(CartContext) || {
    cartItems: [],
    removeFromCart: () => {},
    clearCart: () => {},
    updateQuantity: () => {},
    getCartTotal: () => 0
  };
  const { token, user } = useContext(AuthContext) || { token: null, user: null };
  const { addOrder } = useContext(UserStatsContext) || { addOrder: () => {} };
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const subtotal = cartItems && cartItems.length > 0
    ? cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
    : 0;
  const shipping = subtotal > 4000 ? 0 : 99; // Free shipping over ₹4000, otherwise ₹99
  const tax = subtotal * 0.18; // 18% GST in India
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handlePromoCode = () => {
    const validCodes = {
      'SAVE10': 0.1,
      'WELCOME': 0.15,
      'ECO20': 0.2
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(subtotal * validCodes[promoCode.toUpperCase()]);
    } else {
      alert('Invalid promo code');
    }
  };

  async function handleCheckout() {
    if (!user) {
      alert('Please login to checkout');
      return;
    }

    setLoading(true);
    try {
      // Create order object
      const orderData = {
        items: cartItems.map(item => ({
          ...item,
          id: item._id
        })),
        total: total,
        shippingAddress: '123 Main St, City, State 12345' // This would come from user profile
      };

      // Simulate API call
      await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add order to user stats context
      addOrder(orderData);

      clearCart();
      setDiscount(0);
      setPromoCode('');

      // Show success message with points earned
      const pointsEarned = Math.floor(total);
      alert(`Order placed successfully! You earned ${pointsEarned} loyalty points.`);
    } catch (err) {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner size="large" message="Processing your order..." fullScreen />;
  }

  return (
    <main>
      <div className="cart-container">
        <div className="cart-header">
          <h1>
            <i className="fas fa-shopping-cart"></i>
            Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="clear-cart-btn">
              <i className="fas fa-trash"></i>
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet</p>
            <Link to="/" className="continue-shopping-btn">
              <i className="fas fa-arrow-left"></i>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="items-header">
                <h3>Items in your cart ({cartItems.length})</h3>
              </div>

              <div className="items-list">
                {cartItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="item-image">
                      <img src={item.imageUrl || '/placeholder-image.jpg'} alt={item.name || 'Product'} />
                    </div>

                    <div className="item-details">
                      <h4 className="item-name">{item.name || 'Product Name'}</h4>
                      <p className="item-description">
                        {item.description ? `${item.description.substring(0, 100)}...` : 'No description available'}
                      </p>

                      {item.isEcoFriendly && (
                        <div className="eco-badge">
                          <i className="fas fa-leaf"></i>
                          Eco-Friendly
                        </div>
                      )}

                      <div className="item-tags">
                        {item.tags?.slice(0, 2).map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="item-price">
                      <div className="price-per-unit">{formatCurrency(item.price || 0)}</div>
                      <div className="price-label">per item</div>
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>

                    <div className="item-total">
                      <div className="total-price">{formatCurrency((item.price || 0) * (item.quantity || 0))}</div>
                    </div>

                    <div className="item-actions">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="remove-btn"
                        title="Remove from cart"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <Link
                        to={`/product/${item._id}`}
                        className="view-btn"
                        title="View product details"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>

                <div className="summary-line">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="summary-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>

                <div className="summary-line">
                  <span>Tax (GST 18%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                {discount > 0 && (
                  <div className="summary-line discount">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="summary-line total">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {shipping > 0 && subtotal < 4000 && (
                  <div className="shipping-notice">
                    <i className="fas fa-info-circle"></i>
                    Add {formatCurrency(4000 - subtotal)} more for free shipping
                  </div>
                )}

                <div className="promo-section">
                  <h4>Promo Code</h4>
                  <div className="promo-input">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                    />
                    <button onClick={handlePromoCode} className="apply-btn">
                      Apply
                    </button>
                  </div>
                  <div className="promo-suggestions">
                    <small>Try: SAVE10, WELCOME, ECO20</small>
                  </div>
                </div>

                <div className="checkout-section">
                  {user ? (
                    <button
                      onClick={handleCheckout}
                      className="checkout-btn"
                      disabled={cartItems.length === 0}
                    >
                      <i className="fas fa-credit-card"></i>
                      Proceed to Checkout
                    </button>
                  ) : (
                    <div className="login-prompt">
                      <p>Please login to checkout</p>
                      <Link to="/login" className="login-btn">
                        <i className="fas fa-sign-in-alt"></i>
                        Login
                      </Link>
                    </div>
                  )}

                  <Link to="/" className="continue-shopping">
                    <i className="fas fa-arrow-left"></i>
                    Continue Shopping
                  </Link>
                </div>

                <div className="security-badges">
                  <div className="security-badge">
                    <i className="fas fa-shield-alt"></i>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="security-badge">
                    <i className="fas fa-undo"></i>
                    <span>30-Day Returns</span>
                  </div>
                  <div className="security-badge">
                    <i className="fas fa-truck"></i>
                    <span>Fast Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border-color);
        }

        .cart-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .clear-cart-btn {
          background: #ef4444;
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

        .clear-cart-btn:hover {
          background: #dc2626;
        }

        .empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          gap: 1.5rem;
        }

        .empty-cart-icon {
          font-size: 4rem;
          color: var(--text-secondary);
          opacity: 0.5;
        }

        .empty-cart h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .empty-cart p {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1.125rem;
        }

        .continue-shopping-btn {
          background: var(--primary-color);
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .continue-shopping-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 3rem;
        }

        .cart-items {
          background: white;
          border-radius: 1rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .items-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .items-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .items-list {
          padding: 1rem;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto auto auto auto;
          gap: 1.5rem;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          transition: all 0.2s;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item:hover {
          background: var(--bg-secondary);
        }

        .item-image {
          width: 100px;
          height: 100px;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          min-width: 0;
        }

        .item-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .item-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
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
          margin-bottom: 0.5rem;
        }

        .item-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tag {
          background: var(--bg-secondary);
          color: var(--text-primary);
          padding: 0.125rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .item-price {
          text-align: center;
        }

        .price-per-unit {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1;
        }

        .price-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-secondary);
          border-radius: 0.5rem;
          padding: 0.25rem;
        }

        .quantity-btn {
          background: white;
          border: 1px solid var(--border-color);
          width: 32px;
          height: 32px;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .quantity-btn:hover:not(:disabled) {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-total {
          text-align: center;
        }

        .total-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .item-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .remove-btn, .view-btn {
          background: none;
          border: 1px solid var(--border-color);
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          color: var(--text-secondary);
        }

        .remove-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .view-btn:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .cart-summary {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .summary-card {
          background: white;
          border-radius: 1rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          padding: 2rem;
        }

        .summary-card h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .summary-line:last-of-type {
          border-bottom: none;
        }

        .summary-line.discount {
          color: var(--secondary-color);
          font-weight: 500;
        }

        .summary-line.total {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          border-top: 2px solid var(--border-color);
          margin-top: 1rem;
          padding-top: 1rem;
        }

        .shipping-notice {
          background: #fffbeb;
          color: #92400e;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          margin: 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .promo-section {
          margin: 2rem 0;
          padding: 1.5rem 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .promo-section h4 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .promo-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .promo-input input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid var(--border-color);
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .promo-input input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .apply-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .apply-btn:hover {
          background: var(--primary-dark);
        }

        .promo-suggestions {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .checkout-section {
          margin-top: 2rem;
        }

        .checkout-btn {
          width: 100%;
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.2s;
          margin-bottom: 1rem;
        }

        .checkout-btn:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .checkout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-prompt {
          text-align: center;
          margin-bottom: 1rem;
        }

        .login-prompt p {
          margin: 0 0 1rem 0;
          color: var(--text-secondary);
        }

        .login-btn {
          background: var(--primary-color);
          color: white;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .login-btn:hover {
          background: var(--primary-dark);
        }

        .continue-shopping {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }

        .continue-shopping:hover {
          color: var(--primary-color);
        }

        .security-badges {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .security-badge i {
          color: var(--secondary-color);
          width: 16px;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .cart-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .cart-summary {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .cart-container {
            padding: 1rem;
          }

          .cart-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .cart-item {
            grid-template-columns: 80px 1fr;
            gap: 1rem;
          }

          .item-image {
            width: 80px;
            height: 80px;
          }

          .item-price,
          .quantity-controls,
          .item-total,
          .item-actions {
            grid-column: 1 / -1;
            justify-self: start;
            margin-top: 1rem;
          }

          .quantity-controls {
            justify-self: start;
          }

          .item-actions {
            flex-direction: row;
          }

          .summary-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </main>
  );
}

export default CartPage;