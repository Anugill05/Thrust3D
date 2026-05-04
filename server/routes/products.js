const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// Get all products with filters/pagination
router.get('/', async (req, res) => {
  try {
    const { category, material, featured, search, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (material && material !== 'All') query.material = material;
    if (featured === 'true') query.featured = true;
    if (search) query.$text = { $search: search };
    const skip = (Number(page) - 1) * Number(limit);
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort(sort).skip(skip).limit(Number(limit)).lean()
    ]);
    res.json({ success: true, products, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch products.' }); }
});

// Featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, inStock: true }).limit(8).lean();
    res.json({ success: true, products });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch.' }); }
});

// Single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch product.' }); }
});

// Create (admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created!', product });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// Update (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product updated.', product });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// Delete (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Product deleted.' });
  } catch { res.status(500).json({ success: false, message: 'Delete failed.' }); }
});

module.exports = router;
