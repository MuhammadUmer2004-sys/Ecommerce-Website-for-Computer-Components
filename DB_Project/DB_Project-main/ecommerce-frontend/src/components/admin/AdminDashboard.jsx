import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import {
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
} from "@mui/icons-material";
import "./../../components-css/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuCards = [
    {
      title: "Product Management",
      icon: <ProductsIcon sx={{ fontSize: 40 }} />,
      path: "/admin/products",
      color: "#2E7D32",
      description: "Add, edit or remove products from inventory",
    },
    {
      title: "Order Management",
      icon: <OrdersIcon sx={{ fontSize: 40 }} />,
      path: "/admin/orders",
      color: "#1565C0",
      description: "View and manage customer orders",
    },
  ];

  return (
    <Box className="admin-dashboard">
      <Container maxWidth="lg">
        <Box className="dashboard-header">
          <Typography variant="h3" className="dashboard-title">
            Admin Dashboard
          </Typography>
        </Box>
        <Grid container spacing={4} className="dashboard-grid">
          {menuCards.map((card, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                className="dashboard-card"
                onClick={() => navigate(card.path)}
                sx={{
                  backgroundColor: card.color,
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)",
                  },
                  "&:hover .icon-wrapper": {
                    transform: "translateY(-5px)",
                  },
                  "&:hover .icon-wrapper svg": {
                    transform: "scale(1.15)",
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  },
                }}
              >
                <Box className="card-content">
                  <Box className="icon-wrapper">{card.icon}</Box>
                  <Typography variant="h4" className="card-title">
                    {card.title}
                  </Typography>
                  <Typography variant="subtitle1" className="card-description">
                    {card.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
