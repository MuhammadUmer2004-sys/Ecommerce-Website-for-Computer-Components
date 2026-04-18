const pool = require('../config/db');

class OrderItem {
    static async addOrderItem(order_id, product_id, quantity) {
        try {
            await pool.query('BEGIN');
            const query = `
                INSERT INTO OrderItem (order_id, product_id, quantity)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const result = await pool.query(query, [order_id, product_id, quantity]);
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error adding order item:', error);
            throw error;
        }
    }

    static async getItemsByOrderId(order_id) {
        try {
            const query = `SELECT * FROM OrderItem WHERE order_id = $1;`;
            const result = await pool.query(query, [order_id]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching items by order ID:', error);
            throw error;
        }
    }
}

module.exports = OrderItem;
