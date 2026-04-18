const pool = require('../config/db');

const findById = async (user_id) => {
    try {
        const result = await pool.query('SELECT * FROM Users WHERE user_id = $1', [user_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

const updateName = async (user_id, first_name, last_name) => {
    try {
        await pool.query('BEGIN'); 
        
        const result = await pool.query(
            `UPDATE Users SET first_name = $1, last_name = $2 WHERE user_id = $3 RETURNING *`,
            [first_name, last_name, user_id]
        );
        
        await pool.query('COMMIT'); 
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK'); 
        console.error('Error updating name:', error);
        throw error;
    }
};

const updateEmail = async (user_id, email) => {
    try {
        await pool.query('BEGIN'); 
        const result = await pool.query(
            `UPDATE Users SET email = $1 WHERE user_id = $2 RETURNING *`,
            [email, user_id]
        );
        
        await pool.query('COMMIT'); 
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK'); 
        console.error('Error updating email:', error);
        throw error;
    }
};

const updatePassword = async (user_id, password) => {
    try {
        await pool.query('BEGIN');
        
        await pool.query(
            `UPDATE Users SET password = $1 WHERE user_id = $2`,
            [password, user_id]
        );
        
        await pool.query('COMMIT'); 
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating password:', error);
        throw error;
    }
};

const updateAddressId = async (user_id, address_id) => {
    try {
        await pool.query('BEGIN'); 
        
        await pool.query(
            `UPDATE Users SET user_address_id = $1 WHERE user_id = $2`,
            [address_id, user_id]
        );
        
        await pool.query('COMMIT'); 
    } catch (error) {
        await pool.query('ROLLBACK'); 
        console.error('Error updating address ID:', error);
        throw error;
    }
};

const getLoyaltyPoints = async(user_id) => {
    try {
        const result = await pool.query('SELECT loyalty_points FROM Users WHERE user_id = $1', [user_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching loyalty points', error);
        throw error;
    }
}

const updateLoyaltyPoints = async (user_id, loyalty_points) => {
    try {
        await pool.query('BEGIN'); 
        const result = await pool.query(
            'UPDATE Users SET loyalty_points = $2 WHERE user_id = $1 RETURNING *',
            [user_id, loyalty_points]
        );

        await pool.query('COMMIT'); 
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating loyalty points', error);
        throw error;
    }
};


module.exports = { findById, updateName, updateEmail, updatePassword, updateAddressId, getLoyaltyPoints, updateLoyaltyPoints };
