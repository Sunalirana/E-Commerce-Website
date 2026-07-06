import React, { useState } from 'react';

function RewardCard({ reward, userPoints, onRedeem }) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const canRedeem = userPoints >= reward.cost;

  const handleRedeem = async () => {
    if (!canRedeem) return;
    
    setIsRedeeming(true);
    try {
      await onRedeem(reward);
    } finally {
      setIsRedeeming(false);
    }
  };

  const getRewardTypeColor = (type) => {
    switch (type) {
      case 'discount': return '#3b82f6';
      case 'shipping': return '#10b981';
      case 'product': return '#f59e0b';
      case 'eco': return '#059669';
      default: return '#6b7280';
    }
  };

  const getRewardTypeIcon = (type) => {
    switch (type) {
      case 'discount': return 'fas fa-percentage';
      case 'shipping': return 'fas fa-shipping-fast';
      case 'product': return 'fas fa-gift';
      case 'eco': return 'fas fa-tree';
      default: return 'fas fa-star';
    }
  };

  return (
    <div className={`reward-card ${!canRedeem ? 'disabled' : ''}`}>
      <div className="reward-header">
        <div 
          className="reward-icon"
          style={{ backgroundColor: getRewardTypeColor(reward.type) }}
        >
          <i className={getRewardTypeIcon(reward.type)}></i>
        </div>
        {reward.popular && (
          <div className="popular-badge">
            <i className="fas fa-fire"></i>
            Popular
          </div>
        )}
      </div>

      <div className="reward-content">
        <h4>{reward.title}</h4>
        <p>{reward.description}</p>
        
        {reward.features && (
          <ul className="reward-features">
            {reward.features.map((feature, index) => (
              <li key={index}>
                <i className="fas fa-check"></i>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="reward-value">
          {reward.value && (
            <span className="value-text">Value: {reward.value}</span>
          )}
          {reward.savings && (
            <span className="savings-text">Save up to {reward.savings}</span>
          )}
        </div>
      </div>

      <div className="reward-footer">
        <div className="reward-cost">
          <span className="cost-amount">{reward.cost}</span>
          <span className="cost-label">points</span>
        </div>
        
        <button 
          onClick={handleRedeem}
          disabled={!canRedeem || isRedeeming}
          className={`redeem-btn ${canRedeem ? 'available' : 'unavailable'}`}
        >
          {isRedeeming ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Redeeming...
            </>
          ) : !canRedeem ? (
            <>
              <i className="fas fa-lock"></i>
              Need {reward.cost - userPoints} more
            </>
          ) : (
            <>
              <i className="fas fa-gift"></i>
              Redeem Now
            </>
          )}
        </button>
      </div>

      {reward.expiresAt && (
        <div className="reward-expiry">
          <i className="fas fa-clock"></i>
          Expires {new Date(reward.expiresAt).toLocaleDateString()}
        </div>
      )}

      <style jsx>{`
        .reward-card {
          background: white;
          border-radius: 1rem;
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .reward-card:hover:not(.disabled) {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-color);
        }

        .reward-card.disabled {
          opacity: 0.6;
          background: #f9fafb;
        }

        .reward-header {
          padding: 1.5rem 1.5rem 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .reward-icon {
          width: 60px;
          height: 60px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .popular-badge {
          background: linear-gradient(135deg, #ff6b6b, #ff8e53);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .reward-content {
          padding: 1.5rem;
        }

        .reward-content h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .reward-content p {
          margin: 0 0 1rem 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .reward-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem 0;
        }

        .reward-features li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .reward-features i {
          color: var(--secondary-color);
          font-size: 0.75rem;
        }

        .reward-value {
          background: var(--bg-secondary);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .value-text {
          display: block;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .savings-text {
          display: block;
          color: var(--secondary-color);
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .reward-footer {
          padding: 0 1.5rem 1.5rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .reward-cost {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .cost-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1;
        }

        .cost-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .redeem-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          min-width: 140px;
          justify-content: center;
        }

        .redeem-btn:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .redeem-btn.unavailable {
          background: var(--text-secondary);
          cursor: not-allowed;
        }

        .redeem-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .reward-expiry {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fef3c7;
          color: #92400e;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .reward-header {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            text-align: center;
          }

          .reward-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .reward-cost {
            align-items: center;
            text-align: center;
          }

          .redeem-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default RewardCard;
