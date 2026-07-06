import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function OrderCard({ order, onReorder, onReview }) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'fas fa-check-circle';
      case 'shipped': return 'fas fa-truck';
      case 'processing': return 'fas fa-clock';
      case 'cancelled': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-main-info">
          <div className="order-id-section">
            <h4>Order #{order.id}</h4>
            <span className="order-date">{formatDate(order.date)}</span>
          </div>
          <div className="order-status-section">
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              <i className={getStatusIcon(order.status)}></i>
              {order.status}
            </div>
            <div className="order-total">${order.total.toFixed(2)}</div>
          </div>
        </div>
        
        <button 
          className="toggle-details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'}`}></i>
        </button>
      </div>

      <div className="order-items-preview">
        <div className="items-images">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="item-image">
              <img src={item.imageUrl} alt={item.name} />
              {item.quantity > 1 && (
                <span className="quantity-badge">{item.quantity}</span>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="more-items">
              +{order.items.length - 3}
            </div>
          )}
        </div>
        
        <div className="items-summary">
          <span className="items-count">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </span>
          {order.trackingNumber && (
            <div className="tracking-info">
              <i className="fas fa-truck"></i>
              <span>Tracking: {order.trackingNumber}</span>
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="order-details">
          <div className="order-timeline">
            <div className="timeline-item completed">
              <div className="timeline-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="timeline-content">
                <h5>Order Placed</h5>
                <span>{formatDate(order.date)}</span>
              </div>
            </div>
            
            <div className={`timeline-item ${['shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'completed' : ''}`}>
              <div className="timeline-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="timeline-content">
                <h5>Shipped</h5>
                <span>{order.status === 'Shipped' || order.status === 'Delivered' ? 'In transit' : 'Pending'}</span>
              </div>
            </div>
            
            <div className={`timeline-item ${order.status.toLowerCase() === 'delivered' ? 'completed' : ''}`}>
              <div className="timeline-icon">
                <i className="fas fa-home"></i>
              </div>
              <div className="timeline-content">
                <h5>Delivered</h5>
                <span>{order.status === 'Delivered' ? 'Package delivered' : 'Estimated delivery'}</span>
              </div>
            </div>
          </div>

          <div className="order-items-detailed">
            <h5>Items in this order:</h5>
            {order.items.map((item, index) => (
              <div key={index} className="detailed-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-info">
                  <h6>{item.name}</h6>
                  <span className="item-price">
                    ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <Link to={`/product/${item.id}`} className="view-product-btn">
                  <i className="fas fa-eye"></i>
                </Link>
              </div>
            ))}
          </div>

          <div className="shipping-info">
            <h5>Shipping Address:</h5>
            <p>{order.shippingAddress}</p>
          </div>
        </div>
      )}

      <div className="order-actions">
        <button onClick={() => onReorder(order)} className="action-btn secondary">
          <i className="fas fa-redo"></i>
          Reorder
        </button>
        
        {order.trackingNumber && (
          <button className="action-btn secondary">
            <i className="fas fa-truck"></i>
            Track Package
          </button>
        )}
        
        {order.status === 'Delivered' && (
          <button onClick={() => onReview(order)} className="action-btn primary">
            <i className="fas fa-star"></i>
            Write Review
          </button>
        )}
        
        <button className="action-btn secondary">
          <i className="fas fa-download"></i>
          Invoice
        </button>
      </div>

      <style jsx>{`
        .order-card {
          background: white;
          border-radius: 1rem;
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .order-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .order-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-main-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
        }

        .order-id-section h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .order-date {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .order-status-section {
          text-align: right;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .order-total {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .toggle-details-btn {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: 1rem;
        }

        .toggle-details-btn:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .order-items-preview {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-secondary);
        }

        .items-images {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .item-image {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 2px solid white;
          box-shadow: var(--shadow-sm);
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .quantity-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .more-items {
          width: 50px;
          height: 50px;
          border-radius: 0.5rem;
          background: var(--text-secondary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .items-summary {
          text-align: right;
        }

        .items-count {
          display: block;
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .tracking-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-color);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .order-details {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          background: #fafbfc;
        }

        .order-timeline {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          position: relative;
        }

        .order-timeline::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: var(--border-color);
          z-index: 1;
        }

        .timeline-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .timeline-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          transition: all 0.3s ease;
        }

        .timeline-item.completed .timeline-icon {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .timeline-content h5 {
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .timeline-content span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .order-items-detailed h5 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .detailed-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: white;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
          border: 1px solid var(--border-color);
        }

        .detailed-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        .item-info {
          flex: 1;
        }

        .item-info h6 {
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .item-price {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .view-product-btn {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 0.375rem;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s;
        }

        .view-product-btn:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .shipping-info {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        .shipping-info h5 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .shipping-info p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .order-actions {
          padding: 1rem 1.5rem;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-btn {
          background: white;
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          text-decoration: none;
          color: var(--text-primary);
        }

        .action-btn:hover {
          background: var(--bg-secondary);
          transform: translateY(-1px);
        }

        .action-btn.primary {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .action-btn.primary:hover {
          background: var(--primary-dark);
        }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .order-main-info {
            width: 100%;
          }

          .order-items-preview {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .order-timeline {
            flex-direction: column;
            gap: 1rem;
          }

          .order-timeline::before {
            display: none;
          }

          .timeline-item {
            flex-direction: row;
            text-align: left;
          }

          .timeline-icon {
            margin-bottom: 0;
            margin-right: 1rem;
          }

          .order-actions {
            flex-direction: column;
          }

          .action-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default OrderCard;
