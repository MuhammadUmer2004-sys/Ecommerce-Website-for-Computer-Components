import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./../context/CartContext";
import "./../components-css/ProductCard.css";
import Modal from "./Modal";
import { useAuth } from "./../context/AuthContext";

const ProductCard = ({ id, image, name, price, description, brand }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      addToCart({
        id,
        name,
        price,
        image,
        brand,
        description,
        quantity: 1,
      });
    }
  };

  return (
    <>
      <div className="product-card" onClick={handleClick}>
        <div className="product-image">
          <img src={image} alt={name} />
          <div className="product-overlay">
            <button className="cart-btn" onClick={handleAddToCart}>
              <i className="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
        <div className="product-info">
          <h4 className="product-name">{name}</h4>
          <p className="product-brand">{brand}</p>
          <div className="product-rating">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star-half-alt"></i>
            <span>(4.5)</span>
          </div>
          <div className="product-price">
            <span className="currency">Rs.</span>
            <span className="amount">{price}</span>
          </div>
        </div>
      </div>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <h3>Please Login First</h3>
        <p>You need to be logged in to add items to your cart.</p>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;
