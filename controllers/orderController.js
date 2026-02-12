// Order Controller (MongoDB)
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
});

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, couponCode, discountAmount, shippingAddress, customerEmail, customerPhone, paymentMethod } = req.body;
    if (!items || !totalPrice || !shippingAddress || !paymentMethod) return res.status(400).json({ error: 'Missing required fields' });

    const validMethods = ['COD', 'EASYPAISA', 'JAZZCASH'];
    if (!validMethods.includes(paymentMethod)) return res.status(400).json({ error: 'Invalid payment method' });

    const finalPrice = parseFloat(totalPrice) - (discountAmount || 0);
    const order = await Order.create({ userId: userId || 'guest', items, totalPrice: parseFloat(totalPrice), discountAmount: discountAmount || 0, finalPrice, couponCode: couponCode || null, shippingAddress, customerEmail, customerPhone, paymentMethod, status: 'Pending', trackingNumber: `GN-${Date.now()}-${Math.random().toString(36).substr(2,9)}` });

    // Send confirmation email (best-effort)
    try { await sendOrderConfirmationEmail(customerEmail, order, order._id); } catch (e) { console.error('Email error:', e.message); }

    // Clear cart
    if (userId) {
      await Cart.findOneAndUpdate({ userId }, { items: [], total: 0, updatedAt: new Date() }, { upsert: true });
    }

    res.status(201).json({ success: true, message: 'Order created successfully', orderId: order._id, order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.uid || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, orders, total: orders.length });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status required' });
    const validStatuses = ['Pending','Confirmed','Shipped','Delivered','Cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() });
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order', message: error.message });
  }
};

async function sendOrderConfirmationEmail(customerEmail, orderData, orderId) {
  if (!customerEmail) return;
  const emailContent = `<div><h1>Order Confirmed</h1><p>Order ID: ${orderId}</p><p>Status: ${orderData.status}</p><p>Total: ${orderData.finalPrice}</p></div>`;
  await transporter.sendMail({ from: `GN SONS <${process.env.EMAIL_USER}>`, to: customerEmail, subject: `Order Confirmed - GN SONS | Order #${orderId}`, html: emailContent });
}

module.exports = {
  createOrder: exports.createOrder,
  getUserOrders: exports.getUserOrders,
  getOrderById: exports.getOrderById,
  getAllOrders: exports.getAllOrders,
  updateOrderStatus: exports.updateOrderStatus
};
