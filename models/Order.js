const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest' },
  items: { type: [orderItemSchema], default: [] },
  totalPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  couponCode: { type: String, default: null },
  shippingAddress: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  paymentMethod: { type: String, enum: ['COD', 'EASYPAISA', 'JAZZCASH'] },
  status: { type: String, default: 'Pending' },
  trackingNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
