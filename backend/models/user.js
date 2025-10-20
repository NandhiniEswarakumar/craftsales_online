const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false }, // Add seller role
  emailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  loginHistory: [{
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date },
    ipAddress: { type: String },
    sessionDuration: { type: Number }
  }],
  // Seller-specific fields
  storeName: { type: String }, // For sellers
  storeDescription: { type: String }, // For sellers
  // ... existing fields
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);