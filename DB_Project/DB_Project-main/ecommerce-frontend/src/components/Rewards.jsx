import React, { useState } from "react";
import {
  Card,
  Button,
  CircularProgress,
  Fade,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "./../components-css/Rewards.css";

const rewardItems = [
  {
    id: 1,
    name: "Premium Gaming Mouse",
    points: 5000,
    image:
      "https://www.czone.com.pk/Images/Thumbnails/39-czone.com.pk-1540-11261-160321092931.jpg",
    description: "High-performance gaming mouse with RGB lighting",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    points: 8000,
    image:
      "https://www.czone.com.pk/Images/Thumbnails/33-czone.com.pk-1540-17107-171024100520.jpg",
    description: "RGB mechanical keyboard with Cherry MX switches",
  },
  {
    id: 3,
    name: "Gaming Headset",
    points: 6000,
    image:
      "https://www.czone.com.pk/Images/Thumbnails/61-czone.com.pk-1540-15730-140224112713.jpg",
    description: "7.1 surround sound gaming headset",
  },
];

const Rewards = () => {
  const [redeemingId, setRedeemingId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [points, setPoints] = useState(10000);

  const handleRedeem = async (item) => {
    if (points < item.points) {
      setNotification({
        show: true,
        message: "Not enough points!",
        type: "error",
      });
      return;
    }

    setRedeemingId(item.id);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPoints((prev) => prev - item.points);
      setNotification({
        show: true,
        message: `Successfully redeemed ${item.name}!`,
        type: "success",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to redeem item",
        type: "error",
      });
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="rewards-container">
      <div className="rewards-header">
        <h1>Rewards Program</h1>
        <div className="points-display">
          <span className="points-label">Your Points</span>
          <span className="points-value">{points.toLocaleString()}</span>
        </div>
      </div>

      <div className="rewards-grid">
        {rewardItems.map((item) => (
          <div key={item.id} className="reward-card">
            <div className="reward-image">
              <img src={item.image} alt={item.name} />
              <div className="points-badge">
                {item.points.toLocaleString()} Points
              </div>
            </div>
            <div className="reward-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <button
                className={`redeem-btn ${
                  points < item.points ? "disabled" : ""
                }`}
                onClick={() => handleRedeem(item.id)}
                disabled={points < item.points || redeemingId === item.id}
              >
                {redeemingId === item.id ? (
                  <span className="loading">Redeeming...</span>
                ) : points < item.points ? (
                  "Not Enough Points"
                ) : (
                  "Redeem Reward"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Snackbar
        open={notification.show}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, show: false })}
      >
        <Alert severity={notification.type} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Rewards;
