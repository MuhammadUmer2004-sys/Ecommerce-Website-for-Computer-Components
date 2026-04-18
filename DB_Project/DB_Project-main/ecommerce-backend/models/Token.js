const pool = require("../config/db");

const blacklistToken = async (token, expiresAt) => {
    try {
        await pool.query('BEGIN');
        const query = `
            INSERT INTO BlacklistedTokens (token, expires_at)
            VALUES ($1, to_timestamp($2))
            ON CONFLICT (token) DO NOTHING
        `;
        await pool.query(query, [token, expiresAt]);
        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error blacklisting token:", error);
        throw error;
    }
};

const isTokenBlacklisted = async (token) => {
    try {
        const query = `
            SELECT 1 FROM BlacklistedTokens
            WHERE token = $1 AND expires_at > now()
        `;
        const result = await pool.query(query, [token]);
        return result.rows.length > 0;
    } catch (error) {
        console.error("Error checking blacklisted token:", error);
        throw error;
    }
};


const cleanupExpiredTokens = async () => {
    try {
        await pool.query('BEGIN');
        const query = `DELETE FROM blacklistedTokens WHERE expires_at < NOW();`;
        await pool.query(query);
        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error cleaning up expired tokens:", error);
        throw error;
    }
};

module.exports = { blacklistToken, isTokenBlacklisted, cleanupExpiredTokens };
