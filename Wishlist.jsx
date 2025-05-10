import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Favorite as HeartIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useWishlist } from "./../context/WishListContext";
import "./../components-css/Wishlist.css";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (item) => {
    setLoading(true);
    await addToCart(item);
    setLoading(false);
  };

  return (
    <div className="wishlist-container">
      <Box className="content-wrapper">
        <Typography variant="h4" className="page-title">
          My Wishlist
        </Typography>
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <HeartIcon sx={{ fontSize: 60, color: "#1e3c72" }} />
            <Typography variant="h6">Your wishlist is empty</Typography>
          </div>
        ) : (
          <Grid container spacing={3}>
            {wishlistItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Paper className="wishlist-item">
                  <div className="item-image-container">
                    <img
                      src={item.images?.[0]?.url || item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "path/to/fallback/image.jpg";
                      }}
                    />
                  </div>
                  <div className="item-content">
                    <Typography variant="h6" className="item-name">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" className="item-brand">
                      {item.brand}
                    </Typography>
                    <Typography variant="h6" className="item-price">
                      Rs. {item.price}
                    </Typography>
                    <div className="item-actions">
                      <IconButton
                        onClick={() => handleAddToCart(item)}
                        className="cart-btn"
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CartIcon />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => removeFromWishlist(item.id)}
                        className="remove-btn"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default Wishlist;
