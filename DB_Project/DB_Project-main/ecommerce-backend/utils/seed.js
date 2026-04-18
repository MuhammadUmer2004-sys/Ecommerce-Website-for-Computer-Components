const pool = require('../config/db');

const seedData = async (req, res) => {
    try {
        await pool.query('BEGIN');

        // 1. CREATE TABLES (Total Database Rebuild)
        const schema = `
            DROP TABLE IF EXISTS cartitem CASCADE;
            DROP TABLE IF EXISTS orderitem CASCADE;
            DROP TABLE IF EXISTS orders CASCADE;
            DROP TABLE IF EXISTS product_image CASCADE;
            DROP TABLE IF EXISTS product CASCADE;
            DROP TABLE IF EXISTS category CASCADE;

            CREATE TABLE category (
                category_id SERIAL PRIMARY KEY,
                category_name VARCHAR(100),
                category_desc TEXT
            );

            CREATE TABLE product (
                product_id SERIAL PRIMARY KEY,
                category_id INT REFERENCES category(category_id),
                product_name TEXT,
                product_price NUMERIC(10, 2),
                stock_quantity INT,
                product_desc TEXT
            );

            CREATE TABLE product_image (
                image_id SERIAL PRIMARY KEY,
                product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
                image_url TEXT,
                is_primary BOOLEAN DEFAULT FALSE
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
        `;
        
        await pool.query(schema);

        // 2. Seed Categories
        const categories = [
            [1, 'Laptops', 'Premium gaming and work machines'],
            [2, 'Monitors', 'Ultra-sharp displays'],
            [3, 'Processors', 'CPUs for every build'],
            [4, 'Graphics Cards', 'High-end GPUs'],
            [5, 'Memory', 'High-speed RAM'],
            [6, 'Storage Devices', 'SSDs and HDDs'],
            [10, 'Desktop PCs', 'Pre-built systems']
        ];

        for (const cat of categories) {
            await pool.query(
                'INSERT INTO category (category_id, category_name, category_desc) VALUES ($1, $2, $3)',
                cat
            );
        }

        // 3. Seed some Products with Images
        const productsWithImages = [
            { id: 1, cat: 1, name: 'Apple Macbook Pro M3', price: 744900, stock: 5, desc: 'Apple M3 chip\\16GB RAM, 512GB SSD\\High-res display\\The ultimate creative tool', img: 'https://images.unsplash.com/photo-1517336712462-8360dec82354?auto=format&fit=crop&q=80&w=300' },
            { id: 2, cat: 1, name: 'HP Victus 15 Gaming Laptop', price: 199999, stock: 10, desc: 'AMD Ryzen 7\\RTX 4050, 16GB RAM\\144Hz Screen\\Performance gaming', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=300' },
            { id: 3, cat: 6, name: 'Samsung 990 Pro 1TB SSD', price: 45000, stock: 20, desc: 'NVMe Gen4\\7450 MB/s speed\\Reliable Storage\\Fastest loading times', img: 'https://images.unsplash.com/photo-1597872200349-016042c13059?auto=format&fit=crop&q=80&w=300' },
            { id: 4, cat: 4, name: 'ASUS ROG RTX 4090 GPU', price: 580000, stock: 2, desc: 'Nvidia RTX 4090\\24GB VRAM\\Ray Tracing\\Monster performance', img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300' },
            { id: 5, cat: 2, name: 'ViewSonic 27" 180Hz Monitor', price: 39999, stock: 15, desc: '2K QHD Resolution\\180hz Refresh Rate\\IPS Panel\\Vibrant gaming', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300' }
        ];

        for (const p of productsWithImages) {
            await pool.query(
                'INSERT INTO product (product_id, category_id, product_name, product_price, stock_quantity, product_desc) VALUES ($1, $2, $3, $4, $5, $6)',
                [p.id, p.cat, p.name, p.price, p.stock, p.desc]
            );
            await pool.query(
                'INSERT INTO product_image (product_id, image_url, is_primary) VALUES ($1, $2, TRUE)',
                [p.id, p.img]
            );
        }

        await pool.query('COMMIT');
        res.status(200).json({ success: true, message: "Clean store built with images successfully!" });
    } catch (error) {
        if(pool) await pool.query('ROLLBACK').catch(e => {});
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { seedData };
