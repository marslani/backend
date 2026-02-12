// 📦 Product Routes
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyJWT, isAdmin } = require('../middleware/auth');

// PUBLIC ROUTES
// ✓ Get categories (MUST be before /:id route)
router.get('/list/categories', productController.getCategories);

// ✓ Get all products (with filters)
router.get('/', productController.getAllProducts);

// ✓ Get product by ID
router.get('/:id', productController.getProductById);

// ✓ Add product - PUBLIC (NO AUTH)
router.post('/', productController.addProduct);

// ✓ Update product
router.put('/:id', verifyJWT, isAdmin, productController.updateProduct);

// ✓ Delete product
router.delete('/:id', verifyJWT, isAdmin, productController.deleteProduct);

module.exports = router;
