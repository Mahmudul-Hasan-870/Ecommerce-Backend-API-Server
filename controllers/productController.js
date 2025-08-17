const { validationResult } = require('express-validator')
const Product = require('../models/Product')
const { createLowStockNotification } = require('../utils/notificationHelper')

class ProductController {
  // Get all products with pagination and filters
  static async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      const query = {}

      // Search filter: search by name (case-insensitive)
      if (search) {
        query.name = { $regex: search, $options: 'i' }
      }

      // Status filter
      if (status) {
        query.status = status
      }

      const sort = {}
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1

      const products = await Product.find(query)
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const total = await Product.countDocuments(query)

      res.json({
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get single product
  static async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category', 'name')
        .populate('subCategory', 'name')
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }
      res.json(product)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Create product
  static async createProduct(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const product = new Product(req.body)
      await product.save()

      // Populate category and subCategory before sending response
      await product.populate('category', 'name')
      await product.populate('subCategory', 'name')
      res.status(201).json(product)
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Product with this SKU already exists' })
      }
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update product
  static async updateProduct(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('category', 'name').populate('subCategory', 'name')

      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      // Check if stock is low and create notification
      if (product.stock < 10) {
        await createLowStockNotification(product, req.user.id)
      }

      res.json(product)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Delete product
  static async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id)
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }
      res.json({ message: 'Product deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Bulk operations
  static async bulkOperations(req, res) {
    try {
      const { action, productIds, data } = req.body

      if (!['update', 'delete'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' })
      }

      if (action === 'update') {
        const result = await Product.updateMany(
          { _id: { $in: productIds } },
          data
        )
        res.json({ message: `${result.modifiedCount} products updated` })
      } else if (action === 'delete') {
        const result = await Product.deleteMany({ _id: { $in: productIds } })
        res.json({ message: `${result.deletedCount} products deleted` })
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get product statistics
  static async getProductStats(req, res) {
    try {
      const stats = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            lowStockProducts: {
              $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] }
            },
            totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
          }
        }
      ])

      res.json({
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          lowStockProducts: 0,
          totalValue: 0
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = ProductController 