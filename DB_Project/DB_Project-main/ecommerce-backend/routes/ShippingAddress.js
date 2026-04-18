const express = require('express');
const router = express.Router();
const shippingAddressController = require('../controllers/ShippingAddress');
const { authenticateToken } = require('../middleware/auth');

// Get a shipping address by ID
router.get('/', authenticateToken, shippingAddressController.getShippingAddress);

// Create a new shipping address
router.post('/', authenticateToken, shippingAddressController.createShippingAddress);

// Update an existing shipping address
router.put('/', authenticateToken, shippingAddressController.updateShippingAddress);

module.exports = router;
