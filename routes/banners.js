const express = require('express')
const { body } = require('express-validator')
const BannerController = require('../controllers/bannerController')
const { auth, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get all banners with pagination and filters
router.get('/', auth, BannerController.getAllBanners)

// Get banner statistics
router.get('/stats/overview', auth, BannerController.getBannerStats)

// Get active banners by type (public endpoint)
router.get('/active/:type', BannerController.getActiveBannersByType)

// Get single banner
router.get('/:id', auth, BannerController.getBanner)

// Create banner
router.post('/', auth, requireRole(['admin', 'manager']), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('image').trim().notEmpty().withMessage('Image is required'),
  body('type').optional().isIn(['regular', 'promotional']).withMessage('Type must be regular or promotional'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  body('productId').optional().isMongoId().withMessage('Product ID must be a valid MongoDB ID')
], BannerController.createBanner)

// Update banner
router.put('/:id', auth, requireRole(['admin', 'manager']), [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('image').optional().trim().notEmpty().withMessage('Image cannot be empty'),
  body('type').optional().isIn(['regular', 'promotional']).withMessage('Type must be regular or promotional'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  body('productId').optional().isMongoId().withMessage('Product ID must be a valid MongoDB ID')
], BannerController.updateBanner)

// Delete banner
router.delete('/:id', auth, requireRole(['admin']), BannerController.deleteBanner)

// Bulk operations
router.post('/bulk', auth, requireRole(['admin', 'manager']), [
  body('operation').isIn(['delete', 'activate', 'deactivate']).withMessage('Invalid operation'),
  body('bannerIds').isArray({ min: 1 }).withMessage('Banner IDs are required')
], BannerController.bulkOperations)

module.exports = router 