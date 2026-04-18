const { password, database } = require("pg/lib/defaults");

const Pool = require("pg").Pool

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.user}:${process.env.password}@${process.env.host}:${process.env.port}/${process.env.database}`,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;
