import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { cartItems, getCartItemsCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartItemCount = getCartItemsCount();

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu') && !event.target.closest('.mobile-menu')) {
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header>
      <div className="header-content">
        <h1>
          <Link to="/">
            <i className="fas fa-leaf"></i>
            EcoCommerce
          </Link>
        </h1>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/search" className="nav-link">
            <i className="fas fa-search"></i>
            <span>Search</span>
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <i className="fas fa-shopping-cart"></i>
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
          <Link to="/admin" className="nav-link admin-link">
            <i className="fas fa-cog"></i>
            <span>Admin</span>
          </Link>
          {user ? (
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <i className="fas fa-user"></i>
                <span>{user.name}</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                    <i className="fas fa-user-circle"></i>
                    Profile
                  </Link>
                  <Link to="/wishlist" onClick={() => setShowUserMenu(false)}>
                    <i className="fas fa-heart"></i>
                    Wishlist
                  </Link>
                  <Link to="/orders" onClick={() => setShowUserMenu(false)}>
                    <i className="fas fa-box"></i>
                    Orders
                  </Link>
                  <button onClick={() => { logout(); setShowUserMenu(false); }}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              <i className="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link
              to="/search"
              className="mobile-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <i className="fas fa-search"></i>
              Search
            </Link>
            <Link
              to="/cart"
              className="mobile-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <i className="fas fa-shopping-cart"></i>
              Cart
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            <Link
              to="/admin"
              className="mobile-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <i className="fas fa-cog"></i>
              Admin
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-user-circle"></i>
                  Profile
                </Link>
                <Link
                  to="/wishlist"
                  className="mobile-nav-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-heart"></i>
                  Wishlist
                </Link>
                <Link
                  to="/orders"
                  className="mobile-nav-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-box"></i>
                  Orders
                </Link>
                <button
                  className="mobile-nav-link logout-btn"
                  onClick={() => { logout(); setShowMobileMenu(false); }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="fas fa-sign-in-alt"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        header {
          position: relative;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .desktop-nav {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-link span {
          display: block;
        }

        .cart-link {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 10;
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .user-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
          padding: 0.75rem;
          min-width: 220px;
          z-index: 1000;
          margin-top: 0.5rem;
          border: 1px solid var(--border-color);
        }

        .user-dropdown a,
        .user-dropdown button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #374151;
          text-decoration: none;
          border-radius: 0.5rem;
          transition: all 0.2s;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .user-dropdown a:hover,
        .user-dropdown button:hover {
          background: var(--bg-secondary);
          color: var(--primary-color);
        }

        .admin-link {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.375rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .admin-link:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .mobile-menu-btn {
          display: none;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1.25rem;
          transition: all 0.2s;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid var(--border-color);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          z-index: 1000;
        }

        .mobile-menu-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: 0.5rem;
          transition: all 0.2s;
          font-weight: 500;
          position: relative;
        }

        .mobile-nav-link:hover {
          background: var(--bg-secondary);
          color: var(--primary-color);
        }

        .mobile-nav-link.logout-btn {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 1rem;
        }

        .mobile-nav-link i {
          width: 20px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .nav-link span {
            display: none;
          }

          .header-content {
            padding: 0 1rem;
          }

          header h1 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .nav-link span {
            display: none;
          }

          .user-button span {
            display: none;
          }

          .desktop-nav {
            gap: 1rem;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;