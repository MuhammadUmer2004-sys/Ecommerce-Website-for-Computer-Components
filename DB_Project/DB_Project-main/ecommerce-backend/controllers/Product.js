const Product = require('../models/Product');

const createProduct = async (req, res) => {
    try {
        const result = await Product.create(req.body);
        res.status(201).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const addProductImage = async (req, res) => {
    try {
        const { product_id, image_url } = req.body;
        const result = await Product.addProductImage(product_id, image_url);
        res.status(201).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const addProductImages = async (req, res) => {
    try {
        const result = await Product.bulkInsertProductImages(req.body.images);
        res.status(201).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const bulkAddProductsFromCSV = async (req, res) => {
    try {
        const result = await Product.bulkInsertProducts(req.body.products || []);
        res.status(201).json({ message: "Imported" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const searchProducts = async (req, res) => {
    try {
        const result = await Product.searchByKeyword(req.query.q || '');
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const filterProducts = async (req, res) => {
    try {
        const result = await Product.filterProducts(req.query);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getProducts = async (req, res) => {
    try {
        const result = await Product.findAll(req.query);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getProduct = async (req, res) => {
    try {
        const result = await Product.findById(req.params.product_id);
        if (!result) return res.status(404).json({ message: "Not found" });
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getProductImages = async (req, res) => {
    try {
        const result = await Product.getProductImages(req.params.product_id);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateProductImage = async (req, res) => {
    try {
        const result = await Product.updateProductImage(req.params.image_id, req.body.image_url);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateProduct = async (req, res) => {
    try {
        const result = await Product.update(req.params.id, req.body);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteProductImage = async (req, res) => {
    try {
        const result = await Product.deleteProductImage(req.params.image_id);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteProduct = async (req, res) => {
    try {
        const result = await Product.delete(req.params.id);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = {
    createProduct,
    addProductImage,
    addProductImages,
    bulkAddProductsFromCSV,
    searchProducts,
    filterProducts,
    getProducts,
    getProduct,
    getProductImages,
    updateProductImage,
    updateProduct,
    deleteProductImage,
    deleteProduct
};
