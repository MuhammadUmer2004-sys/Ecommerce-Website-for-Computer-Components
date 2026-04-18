import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  ButtonGroup,
  Button,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import "./../../components-css/OrderManagement.css";

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customerName: "John Doe",
      date: "2024-03-20",
      items: 2,
      total: "744,900",
      status: "delivered",
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      date: "2024-03-19",
      items: 1,
      total: "39,999",
      status: "processing",
    },
  ]);

  //   const [orders, setOrders] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

  //   useEffect(() => {
  //     const fetchOrders = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/orders`);
  //         setOrders(response.data);
  //       } catch (err) {
  //         setError('Failed to fetch orders');
  //         console.error('Error fetching orders:', err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchOrders();
  //   }, []);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const statusColors = {
    confirmed: "#2196f3",
    processing: "#ff9800",
    shipped: "#4caf50",
    delivered: "#8bc34a",
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filteredOrders = orders
    .filter((order) =>
      statusFilter === "all" ? true : order.status === statusFilter
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <Box className="order-management">
      <Typography variant="h4" className="page-title-admin-order">
        Order Management
      </Typography>

      <Box className="filters-section">
        <ButtonGroup variant="outlined" className="status-filters">
          <Button
            onClick={() => handleStatusChange("all")}
            variant={statusFilter === "all" ? "contained" : "outlined"}
          >
            All Orders
          </Button>
          {Object.keys(statusColors).map((status) => (
            <Button
              key={status}
              onClick={() => handleStatusChange(status)}
              variant={statusFilter === status ? "contained" : "outlined"}
              sx={{
                color: statusFilter === status ? "white" : statusColors[status],
                backgroundColor:
                  statusFilter === status
                    ? statusColors[status]
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    statusFilter === status
                      ? statusColors[status]
                      : `${statusColors[status]}22`,
                },
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </ButtonGroup>

        <Tooltip title="Sort by Date">
          <Button
            onClick={toggleSortDirection}
            variant="outlined"
            startIcon={
              sortDirection === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />
            }
            className="sort-button"
          >
            Order Date
          </Button>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total (Rs.)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                      }
                      sx={{
                        backgroundColor: `${statusColors[order.status]}22`,
                        color: statusColors[order.status],
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewOrder(order.id)}
                        sx={{
                          color: "white",
                          "&:hover": {
                            background: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default OrderManagement;
