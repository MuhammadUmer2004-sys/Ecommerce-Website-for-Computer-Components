const pool = require('../config/db');

const seedData = async (req, res) => {
    try {
        await pool.query('BEGIN');

        // 1. Seed Categories
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
                'INSERT INTO Category (category_id, category_name, category_desc) VALUES ($1, $2, $3) ON CONFLICT (category_id) DO NOTHING',
                cat
            );
        }

        // 2. Seed some Products
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
                'INSERT INTO Product (category_id, product_name, product_price, stock_quantity, product_desc) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                prod
            );
        }

        await pool.query('COMMIT');
        res.status(200).json({ success: true, message: "Database seeded successfully!" });
    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { seedData };
