import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Rating,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import "./../components-css/ProductReview.css";

const ProductReview = () => {
  const { productId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageError = () => {
    console.error("Failed to load product image");
    setImageError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const reviewedItems = JSON.parse(
        localStorage.getItem("reviewedItems") || "[]"
      );
      reviewedItems.push(productId);
      localStorage.setItem("reviewedItems", JSON.stringify(reviewedItems));

      navigate(-1);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-page">
      <Paper className="review-page__container">
        <div className="review-page__header">
          <Typography variant="h3" className="review-page__title">
            Write a Review
          </Typography>
          <Typography variant="subtitle1" className="review-page__order-info">
            Order #{state.orderId} •{" "}
            {new Date(state.orderDate).toLocaleDateString()}
          </Typography>
        </div>

        <div className="review-page__product">
          <div className="review-page__image-container">
            {!imageError && state?.productImage ? (
              <img
                src={state.productImage}
                alt={state.productName}
                className="review-page__image"
                onError={handleImageError}
              />
            ) : (
              <div className="review-page__no-image">
                <Typography variant="body1">No image available</Typography>
              </div>
            )}
          </div>
          <Typography variant="h4" className="review-page__product-name">
            {state?.productName || "Product"}
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="review-page__form">
          <div className="review-page__rating-section">
            <Typography
              variant="h6"
              component="legend"
              className="review-page__rating-title"
            >
              Overall Rating
            </Typography>
            <Rating
              value={rating}
              onChange={(_, value) => setRating(value)}
              size="large"
              required
              className="review-page__rating-stars"
            />
          </div>

          <div className="review-page__review-section">
            <Typography variant="h6" className="review-page__review-title">
              Your Review
            </Typography>
            <TextField
              multiline
              rows={6}
              variant="outlined"
              placeholder="Share your experience with this product..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              fullWidth
              className="review-page__review-input"
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            disabled={!rating || !review.trim() || isSubmitting}
            className="review-page__submit-btn"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default ProductReview;
