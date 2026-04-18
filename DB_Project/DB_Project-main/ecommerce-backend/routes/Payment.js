const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/Payment');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Route to update a payment (status, time, note)
router.put('/', authenticateToken, authorizeRole('admin', 'delivery-partners'),paymentController.updatePayment);

// Route to get all payments for a specific order
router.get('/orders/', authenticateToken, paymentController.getPaymentsByOrderId);

// Route to get a specific payment by ID
router.get('/', authenticateToken, authorizeRole('admin', 'delivery-partners'), paymentController.getPaymentById);


module.exports = router;
