const pool = require('../config/db.js');

class Category {
    static async create({ category_name, category_desc }) {
        try {
            await pool.query('BEGIN');
            const result = await pool.query(
                'INSERT INTO Category (category_name, category_desc) VALUES ($1, $2) RETURNING *',
                [category_name, category_desc]
            );
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error creating category:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query('SELECT * FROM Category WHERE category_id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding category by ID:', error);
            throw error;
        }
    }

    static async findAll() {
        try {
            const result = await pool.query('SELECT * FROM Category');
            return result.rows;
        } catch (error) {
            console.error('Error finding all categories:', error);
            throw error;
        }
    }

    static async update(id, updates) {
        try {
            await pool.query('BEGIN');
            const { category_name, category_desc } = updates;
            const result = await pool.query(
                'UPDATE Category SET category_name = $1, category_desc = $2 WHERE category_id = $3 RETURNING *',
                [category_name, category_desc, id]
            );
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error updating category:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('BEGIN');
            const result = await pool.query(
                'DELETE FROM Category WHERE category_id = $1 RETURNING *',
                [id]
            );
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}

module.exports = Category;
