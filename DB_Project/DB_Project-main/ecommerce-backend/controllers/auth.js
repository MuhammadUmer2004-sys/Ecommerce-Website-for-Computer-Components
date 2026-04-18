const pool = require("../config/db");

const createUser = async (first_name, last_name, role, email, password) => {
    try{
        await pool.query('BEGIN');
        const newUser = await pool.query("INSERT INTO Users (first_name, last_name, role, email, password, user_address_id) VALUES ($1, $2, $3, $4, $5, $6)"
                        ,[first_name,last_name,role,email,password,null]);
        await pool.query('COMMIT');
        return newUser;
    }
    catch(error){
        await pool.query('ROLLBACK');
        console.error('Error creating user', error);
        throw error;
    }
};

const getUserbyEmail = async (email) => {
    const UserResult =  await pool.query("SELECT user_id, email, password, role from Users where email = ($1)", [email]);

    return UserResult;
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { first_name, last_name, role, email, password } = req.body;
        const exists = await getUserbyEmail(email);
        if (exists.rowCount > 0) return res.status(400).json({ error: "Email exists" });
        const hashed = await bcrypt.hash(password, 10);
        await createUser(first_name, last_name, role || 'customer', email, hashed);
        res.status(201).json({ message: "Registered successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await getUserbyEmail(email);
        if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid password" });
        
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role, email: user.email }, 
            process.env.JWT_KEY || 'Ecommerce123', 
            { expiresIn: '2h' }
        );
        res.status(200).json({ token, role: user.role });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const logout = async (req, res) => {
    res.status(200).json({ message: "Logged out" });
};

const refreshToken = async (req, res) => {
    res.status(200).json({ message: "Not required" });
};

module.exports = { createUser, getUserbyEmail, register, login, logout, refreshToken };


