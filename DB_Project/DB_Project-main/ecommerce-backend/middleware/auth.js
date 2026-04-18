const jwt = require("jsonwebtoken")

async function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json({ success: false, message: "Token is invalidated." });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

function authorizeRole(...allowedRole) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRole.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

module.exports = {authenticateToken, authorizeRole};