const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'editor', 'viewer', 'staff'],
    default: 'admin'
  },
  permissions: {
    dashboard: { type: Boolean, default: true },
    products: { type: Boolean, default: true },
    orders: { type: Boolean, default: true },
    customers: { type: Boolean, default: true },
    categories: { type: Boolean, default: true },
    banners: { type: Boolean, default: true },

    settings: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    canCreate: { type: Boolean, default: true },
    canEdit: { type: Boolean, default: true },
    canDelete: { type: Boolean, default: true },
    canView: { type: Boolean, default: true }
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model('User', userSchema) 