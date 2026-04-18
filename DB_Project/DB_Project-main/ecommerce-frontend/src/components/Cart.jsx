import React, { useState } from "react";
import { IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./../components-css/Cart.css";
import img1 from "./../images/product-images/product1-image/22-czone.com.pk-1540-15686-010224084552.jpg";
import { useNavigate } from "react-router-dom";
import { useCart } from "./../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [showError, setShowError] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="cart-container">
      {showError && (
        <div className="cart-error-banner">
          <i className="fas fa-exclamation-circle"></i>
          Cannot proceed to checkout with an empty cart
        </div>
      )}
      <h1>Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <i className="fas fa-shopping-cart"></i>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything to your cart yet.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <div className="cart-item-price">Rs. {item.price}</div>
                  <div className="cart-quantity-controls">
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="cart-remove-icon"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <span>{item.quantity}</span>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="cart-add-icon"
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                  <div className="cart-item-total">
                    Rs. {(parseInt(item.price.replace(/,/g, "")) * item.quantity).toLocaleString()}
                  </div>
                  <IconButton
                    size="small"
                    className="cart-remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="cart-summary-item">
            <span>Total</span>
            <span>Rs. {cartTotal}</span>
          </div>
          <button className="cart-checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
