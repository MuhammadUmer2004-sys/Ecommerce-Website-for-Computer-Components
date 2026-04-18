const express = require('express');
const router = express.Router();
const {
    login, 
    register,
    logout,
    refreshToken
} = require("../controllers/auth.js");
const { authenticateToken } = require('../middleware/auth.js');

// Registration Route
router.post('/register', register);

// Login Route
router.post('/login', login);

router.post('/logout',authenticateToken, logout);

router.post("/refresh", refreshToken);

module.exports = router;