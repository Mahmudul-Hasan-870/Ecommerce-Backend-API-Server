const express = require('express')
const { body } = require('express-validator')
const OrderController = require('../controllers/orderController')
const { auth, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get all orders with pagination and filters
router.get('/', auth, OrderController.getAllOrders)

// Get single order
router.get('/:id', auth, OrderController.getOrder)

// Create order
router.post('/', auth, requireRole(['admin', 'manager']), [
  body('userName').trim().notEmpty().withMessage('User name is required'),
  body('userEmail').isEmail().withMessage('Valid email is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').notEmpty().withMessage('Product name is required'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required')
], OrderController.createOrder)

// Update order status
router.put('/:id/status', auth, requireRole(['admin', 'manager']), [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
], OrderController.updateOrderStatus)

// Update payment status
router.put('/:id/paymentStatus', auth, requireRole(['admin', 'manager']), [
  body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded', 'partially_refunded'])
], OrderController.updatePaymentStatus)

// Delete order
router.delete('/:id', auth, requireRole(['admin']), OrderController.deleteOrder)

// Get order statistics
router.get('/stats/overview', auth, OrderController.getOrderStats)

module.exports = router 