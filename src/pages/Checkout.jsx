import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: address,
      };
      const { data } = await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-layout">
        {/* Shipping Form */}
        <div className="checkout-form-section">
          <h2>Shipping Address</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="123 Main St"
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="payment-notice">
              <h3>💳 Payment</h3>
              <p>This is a demo store. Payment is simulated automatically.</p>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order — $${cartTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item._id} className="checkout-item">
                <span className="checkout-item-name">{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
