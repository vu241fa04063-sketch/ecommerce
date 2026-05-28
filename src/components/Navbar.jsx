import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🛍️ ShopHub
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>

          {user?.role === 'admin' && (
            <>
              <Link to="/admin/products" className="nav-link admin-link">Products</Link>
              <Link to="/admin/orders" className="nav-link admin-link">Orders</Link>
            </>
          )}

          {user && (
            <Link to="/orders" className="nav-link">My Orders</Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">
                {user.role === 'admin' && <span className="admin-badge">Admin</span>}
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
