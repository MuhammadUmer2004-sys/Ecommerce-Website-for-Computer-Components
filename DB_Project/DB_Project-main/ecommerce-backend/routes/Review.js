const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/Review');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/', authenticateToken, reviewController.createReview);

router.get('/:product_id', reviewController.getReviewsByProduct);

router.put('/:review_id', authenticateToken, authorizeRole('admin'),reviewController.updateReview);

router.delete('/:review_id', authenticateToken, authorizeRole('admin'), reviewController.deleteReview);

router.put('/', authenticateToken, reviewController.updateReview);

router.delete('/', authenticateToken, reviewController.deleteReview);

module.exports = router;
