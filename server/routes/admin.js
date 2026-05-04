const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, pendingOrders, recentOrders, newContacts, revenueAgg, monthlyRevenue, ordersByStatus] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),
      Contact.countDocuments({ status: 'new' }),
      Order.aggregate([{ $match: { 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
      Order.aggregate([
        { $match: { 'payment.status': 'paid', createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$pricing.total' }, orders: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }])
    ]);
    res.json({ success: true,
      stats: { totalUsers, totalProducts, totalOrders, pendingOrders, totalRevenue: revenueAgg[0]?.total || 0, newContacts },
      recentOrders, monthlyRevenue, ordersByStatus });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Dashboard error.' }); }
});

// All users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'user' };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
    res.json({ success: true, users, pagination: { page: Number(page), total, pages: Math.ceil(total / Number(limit)) } });
  } catch { res.status(500).json({ success: false, message: 'Failed.' }); }
});

// Toggle user active
router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, user });
  } catch { res.status(500).json({ success: false, message: 'Failed.' }); }
});

// Contacts
router.get('/contacts', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort('-createdAt').skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
    res.json({ success: true, contacts, pagination: { page: Number(page), total, pages: Math.ceil(total / Number(limit)) } });
  } catch { res.status(500).json({ success: false, message: 'Failed.' }); }
});

router.put('/contacts/:id', async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const update = { status };
    if (adminReply) { update.adminReply = adminReply; update.repliedAt = new Date(); }
    const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, contact });
  } catch { res.status(500).json({ success: false, message: 'Failed.' }); }
});

module.exports = router;
