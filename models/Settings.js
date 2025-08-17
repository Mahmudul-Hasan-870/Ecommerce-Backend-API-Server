const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Admin Panel'
  },
  siteDescription: {
    type: String,
    default: 'Modern admin panel for e-commerce'
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'TRY', 'BRL', 'MXN', 'ZAR', 'AED', 'SAR', 'THB', 'MYR', 'IDR', 'PHP', 'VND'],
    default: 'USD'
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  dateFormat: {
    type: String,
    enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
    default: 'MM/DD/YYYY'
  },
  timeFormat: {
    type: String,
    enum: ['12h', '24h'],
    default: '12h'
  },
  itemsPerPage: {
    type: Number,
    min: 5,
    max: 100,
    default: 10
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  theme: {
    primaryColor: {
      type: String,
      default: '#00473E'
    },
    secondaryColor: {
      type: String,
      default: '#6B7280'
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },

}, {
  timestamps: true
})

module.exports = mongoose.model('Settings', settingsSchema) 