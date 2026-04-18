const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/Category.js');
const { check } = require('express-validator');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Validation rules for category inputs
const categoryValidationRules = [
    check('category_name').notEmpty().withMessage('Category name is required'),
    check('category_desc').isString().withMessage('Description must be a string')
];

router.post('/',
    authenticateToken, authorizeRole('admin'),
    categoryValidationRules,
    categoryController.createCategory
);

router.get('/', categoryController.getCategories); // List all categories
router.get('/:id', categoryController.getCategory); // Get single category details
router.put('/:id',
    authenticateToken, authorizeRole('admin'),
    categoryValidationRules,
    categoryController.updateCategory
);

router.delete('/:id',
    authenticateToken, authorizeRole('admin'),
    categoryController.deleteCategory
);

module.exports = router;
