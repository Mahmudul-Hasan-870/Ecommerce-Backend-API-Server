const { validationResult } = require('express-validator')
const Category = require('../models/Category')
const Product = require('../models/Product')

class CategoryController {
  // Get all categories with hierarchy
  static async getAllCategories(req, res) {
    try {
      const { status, parent } = req.query
      
      let query = {}
      
      if (status) {
        query.isActive = status === 'active'
      }
      
      if (parent !== undefined) {
        if (parent === 'null' || parent === '') {
          query.parent = null
        } else {
          query.parent = parent
        }
      }
      
      const categories = await Category.find(query)
        .populate('parent', 'name')
        .populate('children', 'name isActive')
        .sort({ name: 1 })
      
      res.json(categories)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get category tree (hierarchical structure)
  static async getCategoryTree(req, res) {
    try {
      const { status } = req.query
      
      let query = { parent: null }
      if (status) {
        query.isActive = status === 'active'
      }
      
      const categories = await Category.find(query)
        .populate({
          path: 'children',
          match: status ? { isActive: status === 'active' } : {},
          populate: {
            path: 'children',
            match: status ? { isActive: status === 'active' } : {}
          }
        })
        .sort({ name: 1 })
      
      res.json(categories)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get single category
  static async getCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id)
        .populate('parent', 'name')
        .populate('children', 'name isActive')
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' })
      }
      
      res.json(category)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Create category
  static async createCategory(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const {
        name,
        description,
        parent,
        image,
        metaTitle,
        metaDescription
      } = req.body

      // Generate slug from name
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if slug already exists
      const existingCategory = await Category.findOne({ slug })
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' })
      }

      // Calculate level
      let level = 0
      if (parent) {
        const parentCategory = await Category.findById(parent)
        if (parentCategory) {
          level = parentCategory.level + 1
        }
      }

      const category = new Category({
        name,
        slug,
        description,
        parent: parent || null,
        level,
        image,
        metaTitle,
        metaDescription
      })

      await category.save()
      
      const savedCategory = await Category.findById(category._id)
        .populate('parent', 'name')
      
      res.status(201).json(savedCategory)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update category
  static async updateCategory(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const category = await Category.findById(req.params.id)
      if (!category) {
        return res.status(404).json({ message: 'Category not found' })
      }

      const {
        name,
        description,
        parent,
        image,
        metaTitle,
        metaDescription,
        isActive
      } = req.body

      // Generate new slug if name changed
      let slug = category.slug
      if (name && name !== category.name) {
        slug = name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        
        // Check if new slug already exists
        const existingCategory = await Category.findOne({ slug, _id: { $ne: req.params.id } })
        if (existingCategory) {
          return res.status(400).json({ message: 'Category with this name already exists' })
        }
      }

      // Calculate new level if parent changed
      let level = category.level
      if (parent !== undefined && parent !== category.parent?.toString()) {
        if (parent) {
          const parentCategory = await Category.findById(parent)
          if (parentCategory) {
            level = parentCategory.level + 1
          }
        } else {
          level = 0
        }
      }

      // Update category
      category.name = name || category.name
      category.slug = slug
      category.description = description !== undefined ? description : category.description
      category.parent = parent !== undefined ? (parent || null) : category.parent
      category.level = level
      category.image = image !== undefined ? image : category.image
      category.metaTitle = metaTitle !== undefined ? metaTitle : category.metaTitle
      category.metaDescription = metaDescription !== undefined ? metaDescription : category.metaDescription
      category.isActive = isActive !== undefined ? isActive : category.isActive

      await category.save()
      
      const updatedCategory = await Category.findById(category._id)
        .populate('parent', 'name')
        .populate('children', 'name isActive')
      
      res.json(updatedCategory)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Delete category
  static async deleteCategory(req, res) {
    try {
      const category = await Category.findById(req.params.id)
      if (!category) {
        return res.status(404).json({ message: 'Category not found' })
      }

      // Check if category has children
      const children = await Category.find({ parent: req.params.id })
      if (children.length > 0) {
        return res.status(400).json({ message: 'Cannot delete category with subcategories' })
      }

      // Check if category has products
      const products = await Product.find({ category: req.params.id })
      if (products.length > 0) {
        return res.status(400).json({ message: 'Cannot delete category with products' })
      }

      await Category.findByIdAndDelete(req.params.id)
      res.json({ message: 'Category deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Bulk operations
  static async bulkUpdate(req, res) {
    try {
      const { ids, action, data } = req.body

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid category IDs' })
      }

      let updateData = {}
      
      switch (action) {
        case 'activate':
          updateData = { isActive: true }
          break
        case 'deactivate':
          updateData = { isActive: false }
          break
        case 'update':
          updateData = data
          break
        default:
          return res.status(400).json({ message: 'Invalid action' })
      }

      await Category.updateMany(
        { _id: { $in: ids } },
        updateData
      )

      res.json({ message: 'Categories updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get category statistics
  static async getCategoryStats(req, res) {
    try {
      const totalCategories = await Category.countDocuments()
      const activeCategories = await Category.countDocuments({ isActive: true })
      const inactiveCategories = await Category.countDocuments({ isActive: false })
      const parentCategories = await Category.countDocuments({ parent: null })
      const subCategories = await Category.countDocuments({ parent: { $ne: null } })

      res.json({
        total: totalCategories,
        active: activeCategories,
        inactive: inactiveCategories,
        parent: parentCategories,
        sub: subCategories
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = CategoryController 