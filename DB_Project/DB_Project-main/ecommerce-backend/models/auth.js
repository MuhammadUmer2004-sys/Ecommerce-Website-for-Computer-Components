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
module.exports = { createUser, getUserbyEmail};


