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
            DROP TABLE IF EXISTS users CASCADE;

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
                loyalty_points INT DEFAULT 0,
                user_address_id INT
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

        // 3. Seed some Products with Images for EVERY category
        const productsWithImages = [
            // Laptops (1)
            { id: 1, cat: 1, name: 'Apple Macbook Pro M3', price: 744900, stock: 5, desc: 'Apple M3 chip\\16GB RAM, 512GB SSD\\High-res display\\The ultimate creative tool', img: 'https://images.unsplash.com/photo-1517336712462-8360dec82354?auto=format&fit=crop&q=80&w=300' },
            { id: 2, cat: 1, name: 'HP Victus 15 Gaming Laptop', price: 199999, stock: 10, desc: 'AMD Ryzen 7\\RTX 4050, 16GB RAM\\144Hz Screen\\Performance gaming', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=300' },
            
            // Monitors (2)
            { id: 3, cat: 2, name: 'ViewSonic 27" 180Hz Monitor', price: 39999, stock: 15, desc: '2K QHD Resolution\\180hz Refresh Rate\\IPS Panel\\Vibrant gaming', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300' },
            { id: 4, cat: 2, name: 'Dell UltraSharp 32" 4K', price: 145000, stock: 8, desc: 'IPS Black Technology\\98% DCI-P3\\USB-C Hub\\Professional monitor', img: 'https://images.unsplash.com/photo-1541140532154-b024d715b909?auto=format&fit=crop&q=80&w=300' },

            // Processors (3)
            { id: 5, cat: 3, name: 'Intel Core i9-14900K', price: 185000, stock: 12, desc: '24 Cores / 32 Threads\\Up to 6.0 GHz\\LGA 1700 Socket\\Elite gaming power', img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=300' },

            // GPUs (4)
            { id: 6, cat: 4, name: 'ASUS ROG RTX 4090 GPU', price: 580000, stock: 2, desc: 'Nvidia RTX 4090\\24GB VRAM\\Ray Tracing\\Monster performance', img: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=300' },

            // RAM (5)
            { id: 7, cat: 5, name: 'Corsair Vengeance 32GB DDR5', price: 35000, stock: 25, desc: '6000MHz Speed\\CL36 Latency\\RGB Lighting\\High-speed memory', img: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=300' },

            // Storage (6)
            { id: 8, cat: 6, name: 'Samsung 990 Pro 1TB SSD', price: 45000, stock: 20, desc: 'NVMe Gen4\\7450 MB/s speed\\Reliable Storage\\Fastest loading times', img: 'https://images.unsplash.com/photo-1597872200349-016042c13059?auto=format&fit=crop&q=80&w=300' },

            // Motherboards (7)
            { id: 9, cat: 7, name: 'MSI Z790 Tomahawk WiFi', price: 85000, stock: 10, desc: 'LGA 1700 Socket\\DDR5 Support\\PCIe 5.0\\Military grade durability', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300' },

            // PC Cases (8)
            { id: 10, cat: 8, name: 'Lian Li O11 Dynamic', price: 55000, stock: 5, desc: 'Dual Chamber Design\\Tempered Glass\\Black Edition\\Premium airflow case', img: 'https://images.unsplash.com/photo-1587202372775-e239fcc43063?auto=format&fit=crop&q=80&w=300' },

            // Keyboards (9)
            { id: 11, cat: 9, name: 'Razer BlackWidow V4 Pro', price: 65000, stock: 15, desc: 'Mechanical Switches\\Green Switches\\RGB Chroma\\Ultimate gaming keyboard', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=300' },

            // Desktops (10)
            { id: 12, cat: 10, name: 'Ultimate Gaming Build v1', price: 1250000, stock: 1, desc: 'RTX 4090 + i9-14900K\\64GB DDR5\\4TB NVMe\\Liquid Cooled Beast', img: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=300' }
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
        res.status(200).json({ success: true, message: "Full Inventory Stocked Successfully!" });
    } catch (error) {
        if(pool) await pool.query('ROLLBACK').catch(e => {});
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { seedData };
