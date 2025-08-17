const express = require('express')
const { body } = require('express-validator')
const ProductController = require('../controllers/productController')
const { auth, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get all products with pagination and filters
router.get('/', auth, ProductController.getAllProducts)

// Get single product
router.get('/:id', auth, ProductController.getProduct)

// Create product
router.post('/', auth, requireRole(['admin', 'manager']), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('subCategory').trim().notEmpty().withMessage('Sub category is required'),
  body('status').optional().isIn(['active', 'inactive']),
  body('images').optional().isArray(),
  body('variants').optional().isArray(),
  body('variants.*.color').optional().trim(),
  body('variants.*.size').optional().trim(),
  body('variants.*.price').optional().isFloat({ min: 0 }),
  body('variants.*.stock').optional().isInt({ min: 0 })
], ProductController.createProduct)

// Update product
router.put('/:id', auth, requireRole(['admin', 'manager']), [
  body('name').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().trim().notEmpty(),
  body('subCategory').optional().trim().notEmpty().withMessage('Sub category is required'),
  body('status').optional().isIn(['active', 'inactive']),
  body('variants').optional().isArray(),
  body('variants.*.color').optional().trim(),
  body('variants.*.size').optional().trim(),
  body('variants.*.price').optional().isFloat({ min: 0 }),
  body('variants.*.stock').optional().isInt({ min: 0 })
], ProductController.updateProduct)

// Delete product
router.delete('/:id', auth, requireRole(['admin']), ProductController.deleteProduct)

// Bulk operations
router.post('/bulk', auth, requireRole(['admin', 'manager']), ProductController.bulkOperations)

// Get product statistics
router.get('/stats/overview', auth, ProductController.getProductStats)

module.exports = router 