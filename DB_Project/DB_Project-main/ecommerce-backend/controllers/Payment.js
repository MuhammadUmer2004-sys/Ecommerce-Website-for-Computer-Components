const pool = require('../config/db');

class Payment {
    static createPayment = async (order_id, amount, status = 'Pending', payment_method, payment_note = null) => {
        try {
            await pool.query('BEGIN');
            const query = `
                INSERT INTO Payment (order_id, amount, payment_status, payment_method, payment_note)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [order_id, amount, status, payment_method, payment_note];
            const result = await pool.query(query, values);
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error creating payment:', error);
            throw error;
        }
    };

    static updatePaymentStatus = async (payment_id, status, payment_note = null) => {
        try {
            await pool.query('BEGIN');
            const query = `
                UPDATE Payment
                SET payment_status = $1,
                    payment_time = CURRENT_TIMESTAMP,
                    payment_note = $2
                WHERE payment_id = $3
                RETURNING *;
            `;
            const values = [status, payment_note, payment_id];
            const result = await pool.query(query, values);
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error updating payment status:', error);
            throw error;
        }
    };

    static getPaymentById = async (payment_id) => {
        try {
            const query = `
                SELECT * FROM Payment
                WHERE payment_id = $1;
            `;
            const result = await pool.query(query, [payment_id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching payment by ID:', error);
            throw error;
        }
    };

    static getPaymentsByOrderId = async (order_id) => {
        try {
            const query = `
                SELECT * FROM Payment
                WHERE order_id = $1;
            `;
            const result = await pool.query(query, [order_id]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching payments by order ID:', error);
            throw error;
        }
    };
}

module.exports = Payment;
