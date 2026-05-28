import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <button className="btn btn-outline btn-sm" onClick={clearCart}>Clear Cart</button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'}
                alt={item.name}
                className="cart-item-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
              </div>
              <div className="quantity-control">
                <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                <span className="qty-value">{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item._id)}
                title="Remove"
              >✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-full" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/" className="btn btn-outline btn-full mt-2">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
