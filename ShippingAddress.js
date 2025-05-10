const ShippingAddress = require('../models/Address');

// Get a shipping address by ID
const getShippingAddress = async (req, res) => {
    const { address_id } = req.body;
    try {
        const address = await ShippingAddress.getShippingAddress(address_id);
        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        res.status(200).json({ success: true, data: address });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch address', error: err.message });
    }
};

// Create a new shipping address
const createShippingAddress = async (req, res) => {
    const { street, city, zip } = req.body;
    try {
        const newAddress = await ShippingAddress.createShippingAddress(street, city, zip);
        res.status(201).json({ success: true, data: newAddress });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create address', error: err.message });
    }
};

// Update an existing shipping address
const updateShippingAddress = async (req, res) => {
    const { address_id } = req.body;
    const { street, city, zip } = req.body;
    try {
        const updatedAddress = await ShippingAddress.updateShippingAddress(address_id, street, city, zip);
        if (!updatedAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        res.status(200).json({ success: true, data: updatedAddress });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update address', error: err.message });
    }
};

module.exports = {
    getShippingAddress,
    createShippingAddress,
    updateShippingAddress,
};
