const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String },
  recipientId: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  attachments: { type: [String], default: [] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
