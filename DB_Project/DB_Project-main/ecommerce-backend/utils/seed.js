const pool = require('../config/db');

const seedData = async (req, res) => {
    try {
        await pool.query('BEGIN');

        // 1. CREATE TABLES (Total Database Rebuild)
        const schema = `
            CREATE TABLE IF NOT EXISTS category (
                category_id SERIAL PRIMARY KEY,
                category_name VARCHAR(100),
                category_desc TEXT
            );

            CREATE TABLE IF NOT EXISTS product (
                product_id SERIAL PRIMARY KEY,
                category_id INT REFERENCES category(category_id),
                product_name TEXT,
                product_price NUMERIC(10, 2),
                stock_quantity INT,
                product_desc TEXT
            );

            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(100),
                role VARCHAR(20) DEFAULT 'customer',
                loyalty_points INT DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS orders (
                order_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id),
                order_status VARCHAR(50) DEFAULT 'Pending',
                order_amount NUMERIC(10, 2),
                order_date TIMESTAMP DEFAULT NOW(),
                shipping_address_id INT
            );

            CREATE TABLE IF NOT EXISTS orderitem (
                orderitem_id SERIAL PRIMARY KEY,
                order_id INT REFERENCES orders(order_id),
                product_id INT REFERENCES product(product_id),
                quantity INT
            );

            CREATE TABLE IF NOT EXISTS cartitem (
                cartitem_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id),
                product_id INT REFERENCES product(product_id),
                quantity INT,
                UNIQUE(user_id, product_id)
            );

            CREATE TABLE IF NOT EXISTS shipping_address (
                address_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id),
                street TEXT,
                city VARCHAR(100),
                zip VARCHAR(20)
            );

            CREATE TABLE IF NOT EXISTS wishlist (
                wishlist_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id),
                product_id INT REFERENCES product(product_id),
                UNIQUE(user_id, product_id)
            );

            CREATE TABLE IF NOT EXISTS review (
                review_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id),
                product_id INT REFERENCES product(product_id),
                rating INT CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;
        
        await pool.query(schema);

        // 2. Seed Categories
        const categories = [
            [1, 'Laptops', 'Portable computers'],
            [2, 'Monitors', 'High resolution screens'],
            [3, 'Processors', 'CPUs for every build'],
            [4, 'Graphics Cards', 'GPUs for gaming and work'],
            [5, 'Memory', 'RAM modules'],
            [6, 'Storage Devices', 'SSDs and HDDs'],
            [7, 'Motherboards', 'The base of your PC'],
            [8, 'PC Cases', 'Stylish enclosures'],
            [9, 'Keyboards', 'Mechanical and gaming keyboards'],
            [10, 'Desktop PCs', 'Pre-built systems']
        ];

        for (const cat of categories) {
            await pool.query(
                'INSERT INTO category (category_id, category_name, category_desc) VALUES ($1, $2, $3) ON CONFLICT (category_id) DO NOTHING',
                cat
            );
        }

        // 3. Seed some Products
        const products = [
            [1, 'Macbook Pro M3', 744900, 5, 'Apple M3 chip, 16GB RAM, 512GB SSD'],
            [1, 'HP Victus 15', 199999, 10, 'AMD Ryzen 7, RTX 4050, 16GB RAM'],
            [6, 'Samsung 990 Pro 1TB', 45000, 20, 'NVMe Gen4 SSD, fast speeds'],
            [6, 'Seagate BarraCuda 2TB', 15000, 50, 'Reliable HDD storage'],
            [4, 'ASUS ROG RTX 4090', 580000, 2, 'Monster GPU for 4K gaming'],
            [2, 'ViewSonic 27" 180Hz', 39999, 15, 'IPS 1440p gaming monitor']
        ];

        for (const prod of products) {
            await pool.query(
                'INSERT INTO product (category_id, product_name, product_price, stock_quantity, product_desc) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                prod
            );
        }

        await pool.query('COMMIT');
        res.status(200).json({ success: true, message: "Database built and seeded successfully!" });
    } catch (error) {
        if(pool) await pool.query('ROLLBACK').catch(e => {});
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { seedData };
