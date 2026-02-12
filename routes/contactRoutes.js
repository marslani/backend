// 📧 Contact Routes
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyJWT, isAdmin } = require('../middleware/auth');
const { validateContact, handleValidationErrors } = require('../middleware/validation');

// ✓ Submit contact form
router.post('/', validateContact, handleValidationErrors, contactController.submitContactForm);

// ADMIN ROUTES
// ✓ Get all contacts
router.get('/admin/all', verifyJWT, isAdmin, contactController.getAllContacts);

// ✓ Update contact status
router.put('/:id/status', verifyJWT, isAdmin, contactController.updateContactStatus);

module.exports = router;
