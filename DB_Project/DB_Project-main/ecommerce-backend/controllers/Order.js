const Order = require('../models/Order');

const placeOrder = async (req, res) => {
    try {
        const { totalAmount, shippingAddressId } = req.body;
        const user_id = req.user.user_id;
        const result = await Order.placeOrder(user_id, totalAmount, shippingAddressId);
        res.status(201).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { order_id, status } = req.body;
        const result = await Order.updateOrderStatus(order_id, status);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const cancelOrder = async (req, res) => {
    try {
        const { order_id } = req.body;
        const result = await Order.updateOrderStatus(order_id, 'Cancelled');
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getAllOrders = async (req, res) => {
    try {
        const result = await Order.getAllOrders();
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getMyOrders = async (req, res) => {
    try {
        const result = await Order.getOrderByUserId(req.user.user_id);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { placeOrder, updateOrderStatus, cancelOrder, getAllOrders, getMyOrders };
