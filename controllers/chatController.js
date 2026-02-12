// Chat Controller (MongoDB)
const Message = require('../models/Message');

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, senderName, message, recipientId, attachments } = req.body;
    if (!senderId || !message || !recipientId) return res.status(400).json({ error: 'Missing required fields' });

    const convId = conversationId || `${senderId}-${recipientId}`;

    const msg = await Message.create({
      conversationId: convId,
      senderId,
      senderName: senderName || 'Customer',
      recipientId,
      message,
      attachments: attachments || []
    });

    res.status(201).json({ success: true, message: 'Message sent successfully', messageId: msg._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message', message: error.message });
  }
};

// Get Conversation
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 }).lean();
    res.json({ success: true, conversationId, messageCount: messages.length, messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation', message: error.message });
  }
};

// Get All Conversations (Admin)
exports.getAllConversations = async (req, res) => {
  try {
    const docs = await Message.find().sort({ timestamp: -1 }).lean();
    const convMap = new Map();
    for (const d of docs) {
      const conv = convMap.get(d.conversationId) || { conversationId: d.conversationId, customerId: d.senderId === 'admin' ? d.recipientId : d.senderId, customerName: d.senderName, lastMessage: d.message, lastMessageTime: d.timestamp, unreadCount: d.isRead ? 0 : 1, messages: [] };
      conv.messages.push(d);
      if (!d.isRead && d.recipientId === 'admin') conv.unreadCount++;
      convMap.set(d.conversationId, conv);
    }
    const conversations = Array.from(convMap.values()).sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    res.json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations', message: error.message });
  }
};

// Mark as Read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { isRead: true, readAt: new Date() });
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read', message: error.message });
  }
};

// Delete Message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message', message: error.message });
  }
};
