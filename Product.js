const pool = require('../config/db');

class Product {
    static async create({ product_name, product_price, product_desc, stock_quantity, category_id }) {
        try {
            await pool.query('BEGIN');
            const result = await pool.query(
                'INSERT INTO Product (category_id, product_name, product_price, stock_quantity, product_desc) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [category_id, product_name, product_price, stock_quantity, product_desc]
            );
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async findById(product_id) {
        try {
            const result = await pool.query('SELECT * FROM Product WHERE product_id = $1', [product_id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding product by ID:', error);
            throw error;
        }
    }

    static async findAll(filter = {}) {
        try {
            let query = 'SELECT * FROM Product';
            const values = [];
            if (filter.category) {
                query += ' WHERE category_id = $1';
                values.push(filter.category);
            }
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error finding all products:', error);
            throw error;
        }
    }

    static async searchByKeyword(keyword) {
        try {
            const result = await pool.query(
                `SELECT product_id, product_name, product_price, product_desc, stock_quantity 
                 FROM Product 
                 WHERE product_name ILIKE $1 OR product_desc ILIKE $1`,
                [`%${keyword}%`]
            );
            return result.rows;
        } catch (error) {
            console.error('Error searching products by keyword:', error);
            throw error;
        }
    }

    static async filterProducts({ category_id, min_price, max_price, availability }) {
        try {
            let query = `
                SELECT product_id, product_name, product_price, product_desc, stock_quantity 
                FROM Product WHERE 1=1
            `;
            const params = [];
        
            if (category_id) {
                params.push(category_id);
                query += ` AND category_id = $${params.length}`;
            }
        
            if (min_price) {
                params.push(min_price);
                query += ` AND product_price >= $${params.length}`;
            }
        
            if (max_price) {
                params.push(max_price);
                query += ` AND product_price <= $${params.length}`;
            }
        
            if (availability === 'in_stock') {
                query += ` AND stock_quantity > 0`;
            } else if (availability === 'out_of_stock') {
                query += ` AND stock_quantity = 0`;
            }
        
            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Error filtering products:', error);
            throw error;
        }
    }

    static async update(product_id, updates) {
        try {
            await pool.query('BEGIN');
            const { product_name, product_price, product_desc, stock_quantity, category_id } = updates;
            const result = await pool.query(
                'UPDATE Product SET product_name = $1, product_price = $2, product_desc = $3, stock_quantity = $4, category_id = $5 WHERE product_id = $6 RETURNING *',
                [product_name, product_price, product_desc, stock_quantity, category_id, product_id]
            );
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async delete(product_id) {
        try {
            await pool.query('BEGIN');
            const result = await pool.query('DELETE FROM Product WHERE product_id = $1 RETURNING *', [product_id]);
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    static async addProductImage(product_id, image_url) {
        try {
            await pool.query('BEGIN');
            const result = await pool.query(
                'INSERT INTO Product_Image (product_id, image_url) VALUES ($1, $2) RETURNING *',
                [product_id, image_url]
            );
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error adding product image:', error);
            throw error;
        }
    }

    static async bulkInsertProductImages(images) {
        try {
            await pool.query('BEGIN');
            const queries = images.map(({ product_id, image_url }) => 
                pool.query('INSERT INTO Product_Image (product_id, image_url) VALUES ($1, $2)', [product_id, image_url])
            );
            const results = await Promise.all(queries);
            await pool.query('COMMIT');
            return results.map(result => result.rows[0]);
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error bulk inserting product images:', error);
            throw error;
        }
    }

    static async getProductImages(product_id) {
        try {
            const result = await pool.query('SELECT * FROM Product_Image WHERE product_id = $1', [product_id]);
            return result.rows;
        } catch (error) {
            console.error('Error getting product images:', error);
            throw error;
        }
    }

    static async updateProductImage(image_id, image_url) {
        try {
            await pool.query('BEGIN');
            const result = await pool.query(
                'UPDATE Product_Image SET image_url = $1 WHERE image_id = $2 RETURNING *',
                [image_url, image_id]
            );
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error updating product image:', error);
            throw error;
        }
    }

    static async deleteProductImage(image_id) {
        try {
            await pool.query('BEGIN');
            const result = await pool.query(
                'DELETE FROM Product_Image WHERE image_id = $1 RETURNING *',
                [image_id]
            );
            await pool.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error deleting product image:', error);
            throw error;
        }
    }

    static async bulkInsertProducts(products) {
        try {
            await pool.query('BEGIN');
            const queries = products.map(({ category_id, product_name, product_price, stock_quantity, product_desc }) =>
                pool.query(
                    'INSERT INTO Product (category_id, product_name, product_price, stock_quantity, product_desc) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [category_id, product_name, product_price, stock_quantity, product_desc]
                )
            );
            const results = await Promise.all(queries);
            await pool.query('COMMIT');
            return results.map(result => result.rows[0]);
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Error bulk inserting products:', error);
            throw error;
        }
    }
}

module.exports = Product;
