import React from 'react';

function LoadingSpinner({ size = 'medium', message = 'Loading...', fullScreen = false }) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const Container = fullScreen ? 'div' : React.Fragment;
  const containerProps = fullScreen ? { className: 'fullscreen-loader' } : {};

  return (
    <Container {...containerProps}>
      <div className="loading-container">
        <div className={`spinner ${sizeClasses[size]}`}>
          <div className="spinner-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        {message && <p className="loading-message">{message}</p>}
      </div>

      <style jsx>{`
        .fullscreen-loader {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
        }

        .spinner {
          display: inline-block;
          position: relative;
        }

        .spinner-small {
          width: 24px;
          height: 24px;
        }

        .spinner-medium {
          width: 40px;
          height: 40px;
        }

        .spinner-large {
          width: 64px;
          height: 64px;
        }

        .spinner-ring {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .spinner-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid var(--primary-color);
          border-radius: 50%;
          animation: spinner-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: var(--primary-color) transparent transparent transparent;
        }

        .spinner-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }

        .spinner-ring div:nth-child(2) {
          animation-delay: -0.3s;
        }

        .spinner-ring div:nth-child(3) {
          animation-delay: -0.15s;
        }

        @keyframes spinner-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-message {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
          text-align: center;
        }

        /* Pulse animation for skeleton loading */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </Container>
  );
}

export default LoadingSpinner;
