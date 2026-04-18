const pool = require('../config/db');

// Add a new review
const createReview = async (user_id, product_id, rating, review_desc) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `INSERT INTO Review (user_id, product_id, rating, review_desc, review_date) VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [user_id, product_id, rating, review_desc]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating review:', error);
        throw error;
    }
};

// Get all reviews for a product
const getReviewsByProduct = async (product_id) => {
    try {
        const result = await pool.query(
            `SELECT r.*, u.first_name, u.last_name 
             FROM Review r
             JOIN Users u ON r.user_id = u.user_id
             WHERE r.product_id = $1`,
            [product_id]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching reviews for product:', error);
        throw error;
    }
};

// Delete a review by ID
const deleteReview = async (review_id) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `DELETE FROM Review WHERE review_id = $1 RETURNING *`,
            [review_id]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error deleting review:', error);
        throw error;
    }
};

// Delete review by user and product ID
const deleteMyReview = async (user_id, product_id) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `DELETE FROM Review WHERE user_id = $1 AND product_id = $2 RETURNING *`,
            [user_id, product_id]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error deleting review by user and product:', error);
        throw error;
    }
};

// Update a review by review ID
const updateReview = async (review_id, rating, review_desc) => {
    if (rating === null && review_desc === null) {
        throw new Error('No updates provided for the review.');
    }
    try {
        await pool.query('BEGIN');
        let query = `UPDATE Review SET `;
        const values = [];
        let counter = 1;

        if (review_desc !== null) {
            query += `review_desc = $${counter++}, `;
            values.push(review_desc);
        }
        if (rating !== null) {
            query += `rating = $${counter++}, `;
            values.push(rating);
        }

        query = query.slice(0, -2) + ` WHERE review_id = $${counter} RETURNING *`;
        values.push(review_id);

        const result = await pool.query(query, values);
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating review:', error);
        throw error;
    }
};

// Update review by user and product ID
const updateMyReview = async (user_id, product_id, rating, review_desc) => {
    if (rating === null && review_desc === null) {
        throw new Error('No updates provided for the review.');
    }
    try {
        await pool.query('BEGIN');
        let query = `UPDATE Review SET `;
        const values = [];
        let counter = 1;

        if (review_desc !== null) {
            query += `review_desc = $${counter++}, `;
            values.push(review_desc);
        }
        if (rating !== null) {
            query += `rating = $${counter++}, `;
            values.push(rating);
        }

        query = query.slice(0, -2) + ` WHERE user_id = $${counter++} AND product_id = $${counter} RETURNING *`;
        values.push(user_id, product_id);

        const result = await pool.query(query, values);
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating review by user and product:', error);
        throw error;
    }
};

// Get a review by user ID and product ID
const getReviewByUserAndProduct = async (user_id, product_id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM Review WHERE user_id = $1 AND product_id = $2`,
            [user_id, product_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching review by user and product:', error);
        throw error;
    }
};

module.exports = {
    createReview,
    getReviewsByProduct,
    deleteReview,
    deleteMyReview,
    updateReview,
    updateMyReview,
    getReviewByUserAndProduct,
};
