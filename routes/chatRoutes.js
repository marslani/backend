// 💬 Chat Routes
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyJWT, isAdmin, optionalAuth } = require('../middleware/auth');

// ✓ Send message
router.post('/send', optionalAuth, chatController.sendMessage);

// ✓ Get conversation
router.get('/conversation/:conversationId', chatController.getConversation);

// ADMIN ROUTES
// ✓ Get all conversations
router.get('/admin/conversations', verifyJWT, isAdmin, chatController.getAllConversations);

// ✓ Mark message as read
router.put('/:messageId/read', verifyJWT, isAdmin, chatController.markAsRead);

// ✓ Delete message
router.delete('/:messageId', verifyJWT, isAdmin, chatController.deleteMessage);

module.exports = router;
