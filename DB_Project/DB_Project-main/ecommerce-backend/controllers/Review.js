const Review = require('../models/Review');

const createReview = async (req, res) => {
    try {
        const { product_id, rating, review_desc } = req.body;
        const result = await Review.createReview(req.user.user_id, product_id, rating, review_desc);
        res.status(201).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getReviewsByProduct = async (req, res) => {
    try {
        const result = await Review.getReviewsByProduct(req.params.product_id);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateReview = async (req, res) => {
    try {
        const { rating, review_desc, product_id } = req.body;
        const review_id = req.params.review_id;
        let result;
        if (review_id) {
            result = await Review.updateReview(review_id, rating, review_desc);
        } else {
            result = await Review.updateMyReview(req.user.user_id, product_id, rating, review_desc);
        }
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteReview = async (req, res) => {
    try {
        const review_id = req.params.review_id;
        const product_id = req.body.product_id;
        let result;
        if (review_id) {
            result = await Review.deleteReview(review_id);
        } else {
            result = await Review.deleteMyReview(req.user.user_id, product_id);
        }
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { createReview, getReviewsByProduct, updateReview, deleteReview };
