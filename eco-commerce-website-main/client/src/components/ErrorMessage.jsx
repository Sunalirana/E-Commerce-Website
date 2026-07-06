import React from 'react';

function ErrorMessage({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred. Please try again.', 
  onRetry = null,
  type = 'error' // 'error', 'warning', 'info'
}) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-exclamation-circle';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'error';
    }
  };

  return (
    <div className={`error-container ${getColorClass()}`}>
      <div className="error-content">
        <div className="error-icon">
          <i className={getIcon()}></i>
        </div>
        <div className="error-text">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          <i className="fas fa-redo"></i>
          Try Again
        </button>
      )}

      <style jsx>{`
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border-radius: 1rem;
          border: 2px solid;
          background: white;
          text-align: center;
          max-width: 500px;
          margin: 2rem auto;
        }

        .error-container.error {
          border-color: #fecaca;
          background: #fef2f2;
        }

        .error-container.warning {
          border-color: #fed7aa;
          background: #fffbeb;
        }

        .error-container.info {
          border-color: #bfdbfe;
          background: #eff6ff;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .error-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .error-container.error .error-icon {
          color: #dc2626;
        }

        .error-container.warning .error-icon {
          color: #d97706;
        }

        .error-container.info .error-icon {
          color: #2563eb;
        }

        .error-text {
          text-align: left;
        }

        .error-text h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .error-container.error .error-text h3 {
          color: #991b1b;
        }

        .error-container.warning .error-text h3 {
          color: #92400e;
        }

        .error-container.info .error-text h3 {
          color: #1e40af;
        }

        .error-text p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .retry-button {
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

        .retry-button:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .error-content {
            flex-direction: column;
            text-align: center;
          }

          .error-text {
            text-align: center;
          }

          .error-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ErrorMessage;
