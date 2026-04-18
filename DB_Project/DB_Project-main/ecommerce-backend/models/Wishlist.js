const pool = require('../config/db');

const addToWishlist = async (user_id, product_id) => {
    try {
        await pool.query('BEGIN');
        
        const result = await pool.query(
            `INSERT INTO WishListItem (user_id, product_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, product_id)
             DO NOTHING
             RETURNING *`,
            [user_id, product_id]
        );
        
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK'); 
        console.error('Error adding to wishlist:', error);
        throw error;
    }
};

const removeFromWishlist = async (user_id, product_id) => {
    try {
        await pool.query('BEGIN'); 
        
        const result = await pool.query(
            `DELETE FROM WishListItem 
             WHERE user_id = $1 AND product_id = $2 
             RETURNING *`,
            [user_id, product_id]
        );
        
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK'); 
        console.error('Error removing from wishlist:', error);
        throw error;
    }
};

const getWishlist = async (user_id) => {
    try {
        const result = await pool.query(
            `SELECT w.product_id, p.product_name, p.product_price, p.stock_quantity 
             FROM WishListItem w
             INNER JOIN Product p ON w.product_id = p.product_id
             WHERE w.user_id = $1`,
            [user_id]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
