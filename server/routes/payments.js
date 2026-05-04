const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

let razorpay = null;
try {
  const Razorpay = require('razorpay');
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_ID.includes('xxxx')) {
    razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  }
} catch(e) { console.warn('Razorpay not available, using mock mode.'); }

// Create payment order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Access denied.' });
    if (order.payment.status === 'paid')
      return res.status(400).json({ success: false, message: 'Already paid.' });

    if (!razorpay) {
      const mockId = 'order_mock_' + Date.now();
      order.payment.razorpayOrderId = mockId;
      order.payment.status = 'processing';
      await order.save();
      return res.json({ success: true, mock: true,
        razorpayOrder: { id: mockId, amount: Math.round(order.pricing.total * 100), currency: 'INR' }, key: 'rzp_test_mock' });
    }

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.pricing.total * 100), currency: 'INR', receipt: order.orderNumber,
      notes: { orderId: order._id.toString() }
    });
    order.payment.razorpayOrderId = rzpOrder.id;
    order.payment.status = 'processing';
    await order.save();
    res.json({ success: true, razorpayOrder: rzpOrder, key: process.env.RAZORPAY_KEY_ID,
      orderDetails: { orderId: order._id, orderNumber: order.orderNumber, amount: order.pricing.total } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Payment init failed.' }); }
});

// Verify payment
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (razorpay_order_id?.startsWith('order_mock_')) {
      order.payment.status = 'paid';
      order.payment.razorpayPaymentId = razorpay_payment_id || 'pay_mock_' + Date.now();
      order.payment.paidAt = new Date();
      order.orderStatus = 'confirmed';
      order.statusHistory.push({ status: 'confirmed', note: 'Payment verified (mock mode)' });
      await order.save();
      return res.json({ success: true, message: 'Payment successful!', order });
    }

    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');
    if (expected !== razorpay_signature) {
      order.payment.status = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Signature mismatch. Payment failed.' });
    }
    order.payment.status = 'paid';
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.paidAt = new Date();
    order.orderStatus = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment verified' });
    await order.save();
    res.json({ success: true, message: 'Payment verified!', order });
  } catch (err) { res.status(500).json({ success: false, message: 'Verification failed.' }); }
});

module.exports = router;
