const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const OrderItem = require('../models/OrderItem');

const placeOrder = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { shipping_address_id } = req.body;

        // 1. Get Cart Items
        const cartItems = await CartItem.getCartItems(user_id);
        if(!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // 2. Calculate Total
        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += parseFloat(item.product_price) * item.quantity;
        });

        // 3. Create Order
        const order = await Order.placeOrder(user_id, totalAmount, shipping_address_id || 1);

        // 4. Move items to OrderItem
        for(const item of cartItems) {
            await OrderItem.addOrderItem(order.order_id, item.product_id, item.quantity);
        }

        // 5. Clear Cart
        for(const item of cartItems) {
            await CartItem.removeItem(user_id, item.product_id);
        }

        res.status(201).json({ success: true, order });
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
