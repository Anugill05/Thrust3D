const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:            { type: String, required: true, trim: true, maxlength: 100 },
  slug:             { type: String, unique: true, lowercase: true },
  description:      { type: String, required: true, maxlength: 3000 },
  shortDescription: { type: String, maxlength: 200 },
  images:           [String],
  material:         { type: String, required: true, enum: ['PLA','ABS','PETG','TPU','Nylon','Resin (SLA)','Other'] },
  category:         { type: String, required: true, enum: ['Home Decor','Toys & Figurines','Functional Parts','Prototypes','Industrial Parts','Custom Orders','Art & Design'] },
  price:            { type: Number, required: true, min: 0 },
  bulkPricing:      [{ minQty: Number, maxQty: Number, pricePerUnit: Number, _id: false }],
  colors:           [String],
  finishes:         [String],
  tags:             [String],
  inStock:          { type: Boolean, default: true },
  featured:         { type: Boolean, default: false },
  customizable:     { type: Boolean, default: false },
  minimumOrderQty:  { type: Number, default: 1 },
  rating:           { average: { type: Number, default: 0, min: 0, max: 5 }, count: { type: Number, default: 0 } },
  dimensions:       { length: Number, width: Number, height: Number, unit: { type: String, default: 'mm' } },
  weight:           { value: Number, unit: { type: String, default: 'g' } }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();
  }
  next();
});

productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, material: 1, featured: 1 });

module.exports = mongoose.model('Product', productSchema);
