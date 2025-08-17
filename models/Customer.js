const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastOrderDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Index for better query performance
customerSchema.index({ email: 1 })
customerSchema.index({ name: 1 })
customerSchema.index({ status: 1 })
customerSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Customer', customerSchema) 