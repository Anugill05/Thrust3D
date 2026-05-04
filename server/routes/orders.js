const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// Create order (auth)
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, specialInstructions, uploadedFile } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items in order.' });

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      if (!product.inStock) return res.status(400).json({ success: false, message: `${product.title} is out of stock.` });
      let pricePerUnit = product.price;
      if (product.bulkPricing?.length && item.quantity > 1) {
        const tier = product.bulkPricing.filter(t => item.quantity >= t.minQty).sort((a, b) => b.minQty - a.minQty)[0];
        if (tier) pricePerUnit = tier.pricePerUnit;
      }
      const totalPrice = pricePerUnit * item.quantity;
      subtotal += totalPrice;
      orderItems.push({ product: product._id, title: product.title, image: product.images?.[0] || '', material: item.material || product.material, quantity: item.quantity, pricePerUnit, totalPrice });
    }
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    const order = await Order.create({ user: req.user._id, items: orderItems, shippingAddress, specialInstructions, uploadedFile, pricing: { subtotal, shipping, tax, total }, statusHistory: [{ status: 'pending', note: 'Order placed' }] });
    res.status(201).json({ success: true, message: 'Order placed!', order });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Failed to place order.' }); }
});

// My orders
router.get('/my', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt').skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).lean();
    res.json({ success: true, orders, pagination: { page: Number(page), total, pages: Math.ceil(total / Number(limit)) } });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch orders.' }); }
});

// All orders (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).populate('user', 'name email phone').sort('-createdAt').skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
    res.json({ success: true, orders, pagination: { page: Number(page), total, pages: Math.ceil(total / Number(limit)) } });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch orders.' }); }
});

// Single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Access denied.' });
    res.json({ success: true, order });
  } catch { res.status(500).json({ success: false, message: 'Failed.' }); }
});

// Update order status (admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Not found.' });
    order.orderStatus = orderStatus;
    order.statusHistory.push({ status: orderStatus, note: note || `Updated to ${orderStatus}` });
    await order.save();
    res.json({ success: true, message: 'Status updated.', order });
  } catch { res.status(500).json({ success: false, message: 'Update failed.' }); }
});

module.exports = router;
