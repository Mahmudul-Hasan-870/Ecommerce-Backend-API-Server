const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    image: String,
    sku: String
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: String
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCharge: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    default: 'credit_card'
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date
}, {
  timestamps: true
})

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    this.orderNumber = `ORD-${year}${month}${day}-${random}`
  }
  next()
})

// Index for better performance
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ userEmail: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Order', orderSchema) 