const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');
const { authenticateToken } = require('../middleware/auth');

// User profile routes
router.get('/', authenticateToken, userController.viewProfile);

// Separate update routes
router.put('/name', authenticateToken, userController.updateName); // Update first and last name
router.put('/email', authenticateToken, userController.updateEmail); // Update email
router.put('/password', authenticateToken, userController.updatePassword); // Update password
router.put('/address', authenticateToken, userController.updateAddress); // Update address

router.get('/purchase-history', authenticateToken, userController.viewPurchaseHistory);
router.get('/loyalty', authenticateToken, userController.viewLoyaltyPoints);
module.exports = router;
