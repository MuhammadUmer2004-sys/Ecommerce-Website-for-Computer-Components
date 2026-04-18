import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Pending as ProcessingIcon,
  ConfirmationNumber as ConfirmedIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as ExpandIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./../components-css/OrderDetails-Customer.css";

const OrderDetails = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      total: "744,900",
      date: "2024-03-20",
      status: "processing",
      items: [
        {
          id: 1,
          name: "Macbook Pro M3",
          price: "744,900",
          quantity: 1,
        },
      ],
      shippingAddress: "123 Main St, Karachi, Pakistan",
      paymentMethod: "COD",
    },
    {
      id: "ORD-002",
      total: "39,999",
      date: "2024-03-15",
      status: "delivered",
      items: [
        {
          id: 2,
          name: "ViewSonic Monitor",
          price: "39,999",
          quantity: 1,
        },
      ],
      shippingAddress: "456 Park Road, Lahore, Pakistan",
      paymentMethod: "Credit Card",
    },
    {
      id: "ORD-003",
      total: "206,998",
      date: "2024-03-10",
      status: "shipped",
      items: [
        {
          id: 3,
          name: "HP Victus Laptop",
          price: "199,999",
          quantity: 1,
        },
        {
          id: 4,
          name: "Razer Mouse",
          price: "6,999",
          quantity: 1,
        },
      ],
      shippingAddress: "789 Tech Street, Islamabad, Pakistan",
      paymentMethod: "COD",
    },
  ]);

  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();
  const [reviewedItems] = useState(() => {
    const saved = localStorage.getItem("reviewedItems");
    return saved ? JSON.parse(saved) : [];
  });

  const handleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleReviewClick = (item, orderId, orderDate) => {
    navigate(`/review/${item.id}`, {
      state: {
        productName: item.name,
        productImage: item.images?.[0]?.url || item.image,
        orderId,
        orderDate,
      },
    });
  };

  const statusConfig = {
    confirmed: {
      icon: <ConfirmedIcon />,
      color: "#2196f3",
      label: "Confirmed",
    },
    processing: {
      icon: <ProcessingIcon />,
      color: "#ff9800",
      label: "Processing",
    },
    shipped: {
      icon: <ShippingIcon />,
      color: "#4caf50",
      label: "Shipped",
    },
    delivered: {
      icon: <DeliveredIcon />,
      color: "#8bc34a",
      label: "Delivered",
    },
  };

  return (
    <div className="customer-orders">
      <Box className="customer-orders__wrapper">
        <Typography variant="h4" className="customer-orders__title">
          My Orders
        </Typography>

        <div className="customer-orders__list">
          {orders.map((order) => (
            <Paper
              key={order.id}
              className={`customer-orders__card ${
                expandedOrder === order.id ? "expanded" : ""
              }`}
            >
              <div
                className="customer-orders__summary"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="customer-orders__info">
                  <div className="customer-orders__header">
                    <Typography variant="h6">Order #{order.id}</Typography>
                    <Chip
                      icon={statusConfig[order.status].icon}
                      label={statusConfig[order.status].label}
                      className={`customer-orders__status-chip ${order.status}`}
                    />
                  </div>
                  <Typography variant="body2" className="customer-orders__date">
                    Ordered on {new Date(order.date).toLocaleDateString()}
                  </Typography>
                </div>
                <div className="customer-orders__total">
                  <Typography variant="h6">Rs. {order.total}</Typography>
                  <IconButton
                    className={expandedOrder === order.id ? "expanded" : ""}
                  >
                    <ExpandIcon />
                  </IconButton>
                </div>
              </div>

              <Collapse in={expandedOrder === order.id}>
                <div className="customer-orders__details">
                  <div className="customer-orders__items">
                    <Typography
                      variant="subtitle1"
                      className="customer-orders__section-title"
                    >
                      Order Items
                    </Typography>
                    {order.items.map((item) => (
                      <div key={item.id} className="customer-orders__item">
                        <div className="customer-orders__item-info">
                          <Typography variant="body1">{item.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Quantity: {item.quantity}
                          </Typography>
                          <div className="customer-orders__item-actions">
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={reviewedItems.includes(item.id)}
                              onClick={() =>
                                handleReviewClick(item, order.id, order.date)
                              }
                              className={`customer-orders__review-btn ${
                                reviewedItems.includes(item.id)
                                  ? "reviewed"
                                  : ""
                              }`}
                            >
                              {reviewedItems.includes(item.id)
                                ? "Reviewed"
                                : "Write Review"}
                            </Button>
                          </div>
                        </div>
                        <Typography
                          variant="body1"
                          className="customer-orders__item-price"
                        >
                          Rs. {item.price}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  <div className="customer-orders__meta">
                    <div className="customer-orders__meta-section">
                      <Typography variant="subtitle2">
                        Shipping Address
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingAddress}
                      </Typography>
                    </div>
                    <div className="customer-orders__meta-section">
                      <Typography variant="subtitle2">
                        Payment Method
                      </Typography>
                      <Typography variant="body2">
                        {order.paymentMethod}
                      </Typography>
                    </div>
                  </div>
                </div>
              </Collapse>
            </Paper>
          ))}
        </div>
      </Box>
    </div>
  );
};

// import { orderService } from "../services/orderService";

// const OrderDetails = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const data = await orderService.getMyOrders();
//         setOrders(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleCancelOrder = async (orderId) => {
//     try {
//       await orderService.cancelOrder(orderId);
//       // Refresh orders
//       const updatedOrders = await orderService.getMyOrders();
//       setOrders(updatedOrders);
//     } catch (err) {
//       setError(err.message);
//     }
//   };
// };

export default OrderDetails;
