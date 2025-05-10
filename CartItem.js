const pool = require('../config/db');

class CartItem {
    static async addItem(user_id, product_id, quantity) {
        try {
            await pool.query('BEGIN');
            const query = `
                INSERT INTO CartItem (user_id, product_id, quantity)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id, product_id)
                DO UPDATE SET quantity = CartItem.quantity + EXCLUDED.quantity
                RETURNING *;
            `;
            const values = [user_id, product_id, quantity];
            const result = await pool.query(query, values);
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error adding item:', error);
            throw error;
        }
    }

    static async getCartItems(user_id) {
        try {
            const query = `SELECT * FROM CartItem WHERE user_id = $1;`;
            const result = await pool.query(query, [user_id]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    }

    static async removeItem(user_id, product_id) {
        try {
            await pool.query('BEGIN');
            const query = `DELETE FROM CartItem WHERE user_id = $1 AND product_id = $2;`;
            await pool.query(query, [user_id, product_id]);
            await pool.query('COMMIT');
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error removing item:', error);
            throw error;
        }
    }

    static async clearCart(user_id) {
        try {
            await pool.query('BEGIN');
            const query = `DELETE FROM CartItem WHERE user_id = $1;`;
            await pool.query(query, [user_id]);
            await pool.query('COMMIT');
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
}

module.exports = CartItem;
