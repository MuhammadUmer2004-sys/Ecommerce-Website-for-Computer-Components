const User = require('../models/User');
const bcrypt = require('bcrypt');
const UserAddress = require('../models/Address');
const Order = require('../models/Order');

const viewProfile = async (req, res) => {
    try {
        const user_id = req.user.user_id; // Assuming `id` is added to the token payload
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if(user.user_address_id === undefined){
            user.user_address_id = 0;
        }
        const address = await UserAddress.getUserAddress(user.user_address_id);
        const { password, ...WithoutPassword } = user;
        res.status(200).json({ success: true, data: {WithoutPassword, address}});
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve profile', error: err.message });
    }
};

const viewLoyaltyPoints = async (req, res) => {
    const user_id = req.user.user_id; 
    try {
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const result = await User.getLoyaltyPoints(user_id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send response with the loyalty points
        res.status(200).json({
            success: true,
            data: { user_id, loyalty_points: result.loyalty_points }
        });

    } catch (error) {
        console.error('Error fetching loyalty points', error);
        res.status(500).json({ success: false, message: 'Failed to fetch loyalty points', error: error.message });
    }
};

const viewPurchaseHistory = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const orders = await Order.getPurchaseHistory(user_id);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No purchase history found' });
        }

        res.status(200).json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve purchase history', error: err.message });
    }
};

const updateName = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { first_name, last_name } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({ success: false, message: 'Both first_name and last_name are required' });
        }

        const user = await User.updateName(user_id, first_name, last_name);
        const { password, ...updatedUser } = user;
        res.status(200).json({ success: true, message: 'Name updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update name', error: err.message });
    }
};

const updateEmail = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.updateEmail(user_id, email);
        const { password, ...updatedUser } = user;
        res.status(200).json({ success: true, message: 'Email updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update email', error: err.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({ success: false, message: 'Both current_password and new_password are required' });
        }

        const user = await User.findById(user_id);

        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        await User.updatePassword(user_id, hashedPassword);

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update password', error: err.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const user_id = req.user.user_id; // Assuming authentication middleware sets this
        const { street, city, zip } = req.body;

        if (!street || !city || !zip) {
            return res.status(400).json({ success: false, message: 'All address fields are required' });
        }

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.user_address_id === null) {
            // Address ID is null, insert new address
            const newAddress = await UserAddress.createUserAddress(street, city, zip);
            // Update user table with the new address ID
            await User.updateAddressId(user_id, newAddress.address_id);

            return res.status(200).json({ success: true, message: 'Address added successfully', address: newAddress });
        } else {
            const updatedAddress = await UserAddress.updateUserAddress(user.user_address_id, street, city, zip);

            return res.status(200).json({ success: true, message: 'Address updated successfully', address: updatedAddress });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update address', error: err.message });
    }
};

module.exports = {viewProfile, viewLoyaltyPoints, viewPurchaseHistory, updateName, updateEmail, updatePassword, updateAddress};