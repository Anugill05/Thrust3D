const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  phone:    { type: String, trim: true },
  address:  { street: String, city: String, state: String, pincode: String, country: { type: String, default: 'India' } },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function(candidate) { return require('bcryptjs').compare(candidate, this.password); };
userSchema.methods.toJSON = function() { const o = this.toObject(); delete o.password; delete o.__v; return o; };

module.exports = mongoose.model('User', userSchema);
