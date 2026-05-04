const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');

const designStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/designs')),
  filename: (req, file, cb) => cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`)
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/products')),
  filename: (req, file, cb) => cb(null, `product_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});

const designFilter = (req, file, cb) => {
  const allowed = ['.stl', '.obj', '.3mf', '.step', '.iges', '.sat'];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext) ? cb(null, true) : cb(new Error('Invalid file type. Allowed: ' + allowed.join(', ')));
};

const imageFilter = (req, file, cb) => {
  file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only images allowed.'));
};

const uploadDesign = multer({ storage: designStorage, fileFilter: designFilter, limits: { fileSize: 100 * 1024 * 1024 } });
const uploadImage = multer({ storage: productStorage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/design', protect, (req, res) => {
  uploadDesign.single('file')(req, res, err => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    res.json({ success: true, message: 'Design uploaded!',
      file: { filename: req.file.filename, originalName: req.file.originalname,
        path: `/uploads/designs/${req.file.filename}`, size: req.file.size } });
  });
});

router.post('/product-images', protect, (req, res) => {
  uploadImage.array('images', 5)(req, res, err => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No images uploaded.' });
    const images = req.files.map(f => `/uploads/products/${f.filename}`);
    res.json({ success: true, images });
  });
});

module.exports = router;
