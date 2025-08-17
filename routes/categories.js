const express = require('express')
const { body } = require('express-validator')
const CategoryController = require('../controllers/categoryController')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Validation middleware
const validateCategory = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional(),
  body('parent').optional().custom((value) => {
    if (value === null || value === '') return true
    return require('mongoose').Types.ObjectId.isValid(value)
  }).withMessage('Invalid parent category ID'),
  body('image').optional().if(body('image').notEmpty()).isURL().withMessage('Invalid image URL'),
  body('metaTitle').optional(),
  body('metaDescription').optional(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
]

// Get all categories
router.get('/', CategoryController.getAllCategories)

// Get category tree
router.get('/tree', CategoryController.getCategoryTree)

// Get category statistics
router.get('/stats', CategoryController.getCategoryStats)

// Get single category
router.get('/:id', CategoryController.getCategory)

// Create category (admin only)
router.post('/', auth, validateCategory, CategoryController.createCategory)

// Update category (admin only)
router.put('/:id', auth, validateCategory, CategoryController.updateCategory)

// Delete category (admin only)
router.delete('/:id', auth, CategoryController.deleteCategory)

// Bulk operations (admin only)
router.post('/bulk', auth, [
  body('ids').isArray().withMessage('IDs must be an array'),
  body('action').isIn(['activate', 'deactivate', 'update']).withMessage('Invalid action'),
  body('data').optional()
], CategoryController.bulkUpdate)

module.exports = router 