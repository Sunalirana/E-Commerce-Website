import React, { useState, useEffect } from 'react';

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-check-circle';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
        return 'toast-info';
      default:
        return 'toast-success';
    }
  };

  return (
    <div className={`toast ${getColorClass()} ${isVisible ? 'toast-visible' : 'toast-hidden'}`}>
      <div className="toast-content">
        <i className={getIcon()}></i>
        <span>{message}</span>
      </div>
      <button onClick={() => setIsVisible(false)} className="toast-close">
        <i className="fas fa-times"></i>
      </button>

      <style jsx>{`
        .toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          min-width: 300px;
          max-width: 500px;
          z-index: 10000;
          border-left: 4px solid;
          transition: all 0.3s ease;
        }

        .toast-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .toast-hidden {
          opacity: 0;
          transform: translateX(100%);
        }

        .toast-success {
          border-left-color: #10b981;
        }

        .toast-error {
          border-left-color: #ef4444;
        }

        .toast-warning {
          border-left-color: #f59e0b;
        }

        .toast-info {
          border-left-color: #3b82f6;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .toast-success .toast-content i {
          color: #10b981;
        }

        .toast-error .toast-content i {
          color: #ef4444;
        }

        .toast-warning .toast-content i {
          color: #f59e0b;
        }

        .toast-info .toast-content i {
          color: #3b82f6;
        }

        .toast-content span {
          color: var(--text-primary);
          font-weight: 500;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .toast-close:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .toast {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default Toast;
