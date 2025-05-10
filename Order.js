const pool = require('../config/db');

class Order {
    static async placeOrder(user_id, totalAmount, shippingAddressId) {
        try {
            await pool.query('BEGIN');
            console.log(totalAmount);
            const query = `
                INSERT INTO Orders (user_id, order_status, order_amount, order_date, shipping_address_id)
                VALUES ($1, 'Pending', $2, NOW(), $3)
                RETURNING *;
            `;
            const result = await pool.query(query, [user_id, totalAmount, shippingAddressId]);
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error placing order:', error);
            throw error;
        }
    }

    static async updateOrderStatus(order_id, status) {
        try {
            await pool.query('BEGIN');
            const query = `UPDATE Orders SET order_status = $1 WHERE order_id = $2 RETURNING *;`;
            const result = await pool.query(query, [status, order_id]);
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error updating order status:', error);
            throw error;
        }
    }

    static async getOrders() {
        try {
            const query = `SELECT * FROM Orders;`;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    static async getOrderById(order_id) {
        try {
            const query = `SELECT * FROM Orders WHERE order_id = $1;`;
            const result = await pool.query(query, [order_id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            throw error;
        }
    }

    static async getOrderByUserId(user_id) {
        try {
            const query = `SELECT * FROM Orders WHERE user_id = $1;`;
            const result = await pool.query(query, [user_id]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching orders by user ID:', error);
            throw error;
        }
    }

    static async getAllOrders() {
        try {
            const query = `
                SELECT 
                    o.order_id, 
                    o.user_id, 
                    u.first_name || ' ' || u.last_name AS user_name, 
                    o.order_status, 
                    o.order_amount, 
                    o.order_date, 
                    sa.street || ', ' || sa.city || ', ' || sa.zip AS shipping_address 
                FROM Orders o
                JOIN Users u ON o.user_id = u.user_id
                JOIN Shipping_Address sa ON o.shipping_address_id = sa.address_id
                ORDER BY o.order_date DESC;
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching all orders for admin:', error);
            throw error;
        }
    }

    static async getPurchaseHistory(user_id) {
        try {
            const query = `
                SELECT o.order_id, o.order_date, o.order_amount, oi.product_id, oi.quantity, p.product_name, p.product_price
                FROM Orders o
                JOIN OrderItem oi ON o.order_id = oi.order_id
                JOIN Product p ON oi.product_id = p.product_id
                WHERE o.user_id = $1;
            `;
            const result = await pool.query(query, [user_id]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching purchase history:', error);
            throw error;
        }
    }
}

module.exports = Order;
