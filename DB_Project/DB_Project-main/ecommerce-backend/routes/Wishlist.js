const express = require('express');
const router = express.Router();
const WishlistController = require('../controllers/Wishlist');
const { authenticateToken } = require('../middleware/auth');

router.post('/add', authenticateToken, WishlistController.addToWishlist);

router.post('/remove', authenticateToken, WishlistController.removeFromWishlist);

router.get('/', authenticateToken, WishlistController.getWishlist);

module.exports = router;
