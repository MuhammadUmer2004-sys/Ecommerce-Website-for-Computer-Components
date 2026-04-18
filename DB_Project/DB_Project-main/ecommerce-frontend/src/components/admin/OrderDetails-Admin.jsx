// src/components/admin/OrderDetails-Admin.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Pending as ProcessingIcon,
  ConfirmationNumber as ConfirmedIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import "./../../components-css/OrderDetails-Admin.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({
    id: "ORD-001",
    customerName: "John Doe",
    email: "john@example.com",
    phone: "+92 300 1234567",
    address: "123 Main St, Karachi, Pakistan",
    date: "2024-03-20",
    status: "processing",
    items: [
      {
        id: 1,
        name: "Macbook Pro M3 Chip",
        price: "744,900",
        quantity: 1,
      },
    ],
    total: "744,900",
    statusHistory: [
      { status: "confirmed", date: "2024-03-20 10:00 AM" },
      { status: "processing", date: "2024-03-20 02:30 PM" },
    ],
  });

  const statusConfig = {
    confirmed: {
      color: "#2196f3",
      icon: <ConfirmedIcon />,
      label: "Confirmed",
    },
    processing: {
      color: "#ff9800",
      icon: <ProcessingIcon />,
      label: "Processing",
    },
    shipped: { color: "#4caf50", icon: <ShippingIcon />, label: "Shipped" },
    delivered: {
      color: "#8bc34a",
      icon: <DeliveredIcon />,
      label: "Delivered",
    },
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrder((prev) => ({
        ...prev,
        status: newStatus,
        statusHistory: [
          ...prev.statusHistory,
          { status: newStatus, date: new Date().toLocaleString() },
        ],
      }));
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-order-details">
      <div className="admin-order-content-wrapper">
        <Box className="admin-order-header">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/orders")}
            className="admin-order-back-btn"
          >
            Back to Orders
          </Button>
          <Typography variant="h4" className="admin-order-title">
            Order #{orderId}
          </Typography>
        </Box>

        <Box className="admin-order-grid">
          <Paper className="admin-order-info-section">
            <Typography variant="h6" className="admin-order-section-title">
              Order Information
            </Typography>
            <Box className="admin-order-status-group">
              <FormControl className="admin-order-status-select">
                <Select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={loading}
                  className="status-select"
                >
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <MenuItem key={status} value={status}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {config.icon}
                        {config.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleStatusChange}
                disabled={loading}
                className="admin-order-status-btn"
              >
                {loading ? <CircularProgress size={24} /> : "Update Status"}
              </Button>
            </Box>
            <Divider className="admin-order-divider" />
            <Box className="admin-order-customer-info">
              <Typography variant="h6">Customer Information</Typography>
              <Box className="info-grid">
                <div>
                  <Typography variant="subtitle2">Name</Typography>
                  <Typography>{order.customerName}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>{order.email}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography>{order.phone}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">Address</Typography>
                  <Typography>{order.address}</Typography>
                </div>
              </Box>
            </Box>
          </Paper>

          <Paper className="admin-order-items-section-details">
            <Typography variant="h6" className="admin-order-section-title">
              Order Items
            </Typography>
            <Divider className="admin-order-divider" />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        fontWeight: 600
                      }}
                    >
                      Item
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        fontWeight: 600
                      }}
                    >
                      Price (Rs.)
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        fontWeight: 600
                      }}
                    >
                      Quantity
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        fontWeight: 600
                      }}
                    >
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow 
                      key={item.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)'
                        }
                      }}
                    >
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {item.name}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {item.price}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {item.quantity}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {(parseInt(item.price.replace(/,/g, '')) * item.quantity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper className="admin-order-history-section">
            <Typography variant="h6" className="admin-order-section-title">
              Status History
            </Typography>
            <Divider className="admin-order-divider" />
            <Box className="admin-order-status-timeline">
              {order.statusHistory.map((history, index) => (
                <Box key={index} className="status-history-item">
                  <Chip
                    label={statusConfig[history.status].label}
                    icon={statusConfig[history.status].icon}
                    style={{
                      backgroundColor: statusConfig[history.status].color,
                      color: "#fff",
                    }}
                  />
                  <Typography variant="body2" className="status-date">
                    {history.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

// import { orderService } from '../../services/orderService';

// const OrderDetailsAdmin = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const data = await orderService.getAllOrders();
//         setOrders(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       await orderService.updateOrderStatus(orderId, newStatus);
//       // Refresh orders
//       const updatedOrders = await orderService.getAllOrders();
//       setOrders(updatedOrders);
//     } catch (err) {
//       setError(err.message);
//     }
//   };
// };

export default OrderDetails;
