import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="product-image"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
        />
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description.substring(0, 80)}...</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <div className="product-stock-cart">
            {product.stock === 0 ? (
              <span className="out-of-stock">Out of Stock</span>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
