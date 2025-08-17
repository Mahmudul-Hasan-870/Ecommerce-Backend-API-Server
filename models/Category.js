const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Index for better performance
categorySchema.index({ parent: 1, isActive: 1 })
categorySchema.index({ slug: 1 })

// Virtual for children
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
})

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
})

// Ensure virtuals are included in JSON
categorySchema.set('toJSON', { virtuals: true })
categorySchema.set('toObject', { virtuals: true })

// Remove legacy fields from JSON response
categorySchema.methods.toJSON = function() {
  const category = this.toObject()
  delete category.nameBn
  delete category.descriptionBn
  delete category.icon
  delete category.sortOrder
  return category
}



// Method to get full path
categorySchema.methods.getFullPath = async function() {
  const path = [this.name]
  let current = this
  
  while (current.parent) {
    current = await this.constructor.findById(current.parent)
    if (current) {
      path.unshift(current.name)
    } else {
      break
    }
  }
  
  return path.join(' > ')
}

// Method to get all children recursively
categorySchema.methods.getAllChildren = async function() {
  const children = await this.constructor.find({ parent: this._id, isActive: true })
  let allChildren = [...children]
  
  for (const child of children) {
    const grandChildren = await child.getAllChildren()
    allChildren = allChildren.concat(grandChildren)
  }
  
  return allChildren
}

module.exports = mongoose.model('Category', categorySchema) 