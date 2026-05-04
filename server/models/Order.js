const mongoose = require('mongoose');

// ✅ ADD THIS (Counter model - required for atomic increment)
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    image: String,
    material: String,
    quantity: { type: Number, required: true, min: 1 },
    pricePerUnit: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    _id: false
  }],

  uploadedFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number
  },

  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },

  pricing: {
    subtotal: Number,
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: Number
  },

  payment: {
    method: { type: String, default: 'razorpay' },
    status: {
      type: String,
      enum: ['pending','processing','paid','failed','refunded'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date
  },

  orderStatus: {
    type: String,
    enum: ['pending','confirmed','printing','quality_check','shipped','delivered','cancelled'],
    default: 'pending'
  },

  statusHistory: [{
    status: String,
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],

  specialInstructions: String,
  trackingNumber: String

}, { timestamps: true });


// ✅ FIXED: Atomic order number generation
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'order' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    this.orderNumber = 'P3D' + String(counter.value).padStart(6, '0');
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, 'payment.status': 1 });

module.exports = mongoose.model('Order', orderSchema);