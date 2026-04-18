const CartItem = require('../models/CartItem');

const addToCart = async (req, res) => {
    const {product_id, quantity } = req.body;
    try {
        if(!product_id || !quantity){
            res.status(400).json({ success: false, message: 'Product ID and quantity required'});
        }
        const cartItem = await CartItem.addItem(req.user.user_id, product_id, quantity);
        res.status(200).json({ success: true, data: cartItem });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add item to cart', error: err.message });
    }
};

const getCart = async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const cartItems = await CartItem.getCartItems(user_id);
        res.status(200).json({ success: true, data: cartItems });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch cart items', error: err.message });
    }
};

const removeFromCart = async (req, res) => {
    const {product_id } = req.body;
    try {
        if(!product_id){
            res.status(400).json({ success: false, message: 'Product ID required'});
        }
        await CartItem.removeItem(req.user.user_id, product_id);
        res.status(200).json({ success: true, message: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to remove item from cart', error: err.message });
    }
};

module.exports = {addToCart, getCart, removeFromCart};