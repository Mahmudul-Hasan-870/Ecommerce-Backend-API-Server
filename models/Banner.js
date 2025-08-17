const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['regular', 'promotional'],
    default: 'regular'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Index for search
bannerSchema.index({ title: 'text' })

// Index for sorting and filtering
bannerSchema.index({ type: 1, status: 1, createdAt: -1 })

module.exports = mongoose.model('Banner', bannerSchema) 