const express = require('express');
const router = express.Router();
const cartController = require('../controllers/Cart');
const { authenticateToken } = require('../middleware/auth');

router.post('/add', authenticateToken,cartController.addToCart);
router.get('/', authenticateToken,cartController.getCart);
router.delete('/remove', authenticateToken,cartController.removeFromCart);

module.exports = router;
