const pool = require('../config/db');

const getUserAddress = async (address_id) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `SELECT * from User_Address where address_id = $1`,
            [address_id]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error fetching user address:', error);
        throw error; // Re-throw the error for the caller to handle
    }
};

const createUserAddress = async (street, city, zip) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `INSERT INTO User_Address (street, city, zip) VALUES ($1, $2, $3) RETURNING *`,
            [street, city, zip]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating user address:', error);
        throw error;
    }
};

const updateUserAddress = async (address_id, street, city, zip) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `UPDATE User_Address SET street = $1, city = $2, zip = $3 WHERE address_id = $4 RETURNING *`,
            [street, city, zip, address_id]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating user address:', error);
        throw error;
    }
};

// Shipping Address
const getShippingAddress = async (address_id) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `SELECT * from Shipping_Address where address_id = $1`,
            [address_id]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error fetching shipping address:', error);
        throw error;
    }
};

const createShippingAddress = async (street, city, zip) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `INSERT INTO Shipping_Address (street, city, zip) VALUES ($1, $2, $3) RETURNING *`,
            [street, city, zip]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating shipping address:', error);
        throw error;
    }
};

const updateShippingAddress = async (address_id, street, city, zip) => {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(
            `UPDATE Shipping_Address SET street = $1, city = $2, zip = $3 WHERE address_id = $4 RETURNING *`,
            [street, city, zip, address_id]
        );
        await pool.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating shipping address:', error);
        throw error;
    }
};


module.exports = {getUserAddress, createUserAddress, updateUserAddress, getShippingAddress, createShippingAddress, updateShippingAddress};
