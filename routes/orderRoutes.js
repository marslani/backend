// 📦 Order Routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyJWT, isAdmin, optionalAuth } = require('../middleware/auth');
const { validateOrder, handleValidationErrors } = require('../middleware/validation');

// ADMIN ROUTES (place before dynamic routes)
// ✓ Get all orders
router.get('/admin/all', verifyJWT, isAdmin, orderController.getAllOrders);

// ✓ Create order
router.post('/', optionalAuth, validateOrder, handleValidationErrors, orderController.createOrder);

// ✓ Get order by ID
router.get('/:id', orderController.getOrderById);

// ✓ Get user orders
router.get('/user/:userId', orderController.getUserOrders);

// ✓ Update order status
router.put('/:id/status', verifyJWT, isAdmin, orderController.updateOrderStatus);

module.exports = router;
