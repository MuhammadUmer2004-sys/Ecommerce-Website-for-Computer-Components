const express = require('express');
const router = express.Router();
const productController = require('../controllers/Product');
const { check } = require('express-validator');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/csvFile');

// Input validation rules
const productValidationRules = [
    check('category_id').notEmpty().withMessage('Category is required'),
    check('product_name').notEmpty().withMessage('Name is required'),
    check('product_price').isNumeric().withMessage('Price must be a number'),
    check('stock_quantity').isInt().withMessage('Stock Quantity must be an integer'),
    check('product_desc').isString().withMessage('Description is required')
];

// CRUD Routes
router.post('/',
    authenticateToken, authorizeRole('admin'),
    productValidationRules,
    productController.createProduct
);
router.post('/image',
    authenticateToken, authorizeRole('admin'),
    productController.addProductImage
);

router.post(
    '/images', //Bulk Upload
    authenticateToken, authorizeRole('admin'),
    productController.addProductImages
);

router.post(
    '/bulk-add',
    authenticateToken,
    authorizeRole('admin'),
    productValidationRules,
    upload.single('file'), // Handle single file upload
    productController.bulkAddProductsFromCSV
);

router.get('/search', productController.searchProducts);
router.get('/filter', productController.filterProducts);
router.get('/', productController.getProducts); // List all or filter by category
router.get('/:product_id', productController.getProduct); // Get single product details
router.get('/:product_id/images', productController.getProductImages);

router.put('/image/:image_id',
    authenticateToken, authorizeRole('admin'),
    productController.updateProductImage
);
router.put('/:id',
    authenticateToken, authorizeRole('admin'),
    productValidationRules,
    productController.updateProduct
);

router.delete('/image/:image_id',
    authenticateToken, authorizeRole('admin'),
    productController.deleteProductImage
);
router.delete('/:id',
    authenticateToken, authorizeRole('admin'),
    productController.deleteProduct
);
module.exports = router;
