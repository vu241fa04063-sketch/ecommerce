import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data.data);
      } catch {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return null;

  return (
    <div className="page-container">
      <button className="btn btn-outline mb-4" onClick={() => navigate(-1)}>← Back</button>
      <div className="product-detail">
        <div className="product-detail-image">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.name}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=No+Image'; }}
          />
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >−</button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >+</button>
              </div>
            </div>
          )}

          <div className="detail-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
