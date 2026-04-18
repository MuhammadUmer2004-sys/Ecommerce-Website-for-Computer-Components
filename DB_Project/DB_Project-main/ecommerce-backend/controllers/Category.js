const Category = require('../models/Category');

const createCategory = async (req, res) => {
    try {
        const { category_name, category_desc } = req.body;
        const result = await Category.create({ category_name, category_desc });
        res.status(201).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getCategories = async (req, res) => {
    try {
        const result = await Category.findAll();
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getCategory = async (req, res) => {
    try {
        const result = await Category.findById(req.params.id);
        if (!result) return res.status(404).json({ message: "Not found" });
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateCategory = async (req, res) => {
    try {
        const result = await Category.update(req.params.id, req.body);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteCategory = async (req, res) => {
    try {
        const result = await Category.delete(req.params.id);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
