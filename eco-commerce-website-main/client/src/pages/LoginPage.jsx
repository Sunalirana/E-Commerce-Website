import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

function LoginPage() {
  const [showModal, setShowModal] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <main>
      <AuthModal 
        isOpen={showModal} 
        onClose={handleCloseModal}
        initialMode="login"
      />
      
      <div className="login-page-content">
        <div className="hero-section">
          <h1>Join EcoCommerce</h1>
          <p>Sign in to access your account and start shopping sustainably</p>
          
          <div className="features">
            <div className="feature">
              <i className="fas fa-heart"></i>
              <h3>Save Favorites</h3>
              <p>Create wishlists of your favorite eco-friendly products</p>
            </div>
            <div className="feature">
              <i className="fas fa-star"></i>
              <h3>Earn Points</h3>
              <p>Get loyalty points with every purchase</p>
            </div>
            <div className="feature">
              <i className="fas fa-truck"></i>
              <h3>Track Orders</h3>
              <p>Monitor your order status and delivery</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .hero-section {
          text-align: center;
          padding: 4rem 0;
        }

        .hero-section h1 {
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .hero-section p {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin: 0 0 3rem 0;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .feature {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
        }

        .feature i {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .feature h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .feature p {
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem;
          }
          
          .features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

export default LoginPage;
