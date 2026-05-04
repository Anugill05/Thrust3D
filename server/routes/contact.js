const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('subject').trim().notEmpty().withMessage('Subject required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message too short')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
  try {
    const { name, email, phone, subject, message } = req.body;
    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: "Message sent! We'll respond within 24 hours." });
  } catch { res.status(500).json({ success: false, message: 'Failed to send.' }); }
});

module.exports = router;
