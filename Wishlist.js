const Wishlist = require('../models/Wishlist');

const addToWishlist = async (req, res) => {
    const { product_id } = req.body;

    try {
        const item = await Wishlist.addToWishlist(req.user.user_id, product_id);

        if (!item) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist',
            });
        }

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist',
            item,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to add product to wishlist',
            error: err.message,
        });
    }
};

const removeFromWishlist = async (req, res) => {
    const { product_id } = req.body;

    try {
        const item = await Wishlist.removeFromWishlist(req.user.user_id, product_id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in wishlist',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            item,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove product from wishlist',
            error: err.message,
        });
    }
};

const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.getWishlist(req.user.user_id);

        res.status(200).json({
            success: true,
            wishlist,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve wishlist',
            error: err.message,
        });
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
