const express = require('express');
const router = express.Router();
const orderController = require('../controllers/Order');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/place', authenticateToken,orderController.placeOrder);
router.put('/update-status', authenticateToken, authorizeRole('admin'), orderController.updateOrderStatus);
router.put('/cancel', authenticateToken,orderController.cancelOrder);
router.get('/getAllOrders',authenticateToken, authorizeRole('admin'),orderController.getAllOrders);
router.get('/getMyOrders', authenticateToken,orderController.getMyOrders);

module.exports = router;
