const { validationResult } = require('express-validator')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { createNewOrderNotification } = require('../utils/notificationHelper')

class OrderController {
  // Get all orders with pagination and filters
  static async getAllOrders(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        date,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      const query = {}

      // Search filter
      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } },
          { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
        ]
      }

      // Status filter
      if (status) {
        query.status = status
      }

      // Date filter
      if (date) {
        const startDate = new Date(date)
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 1)
        query.createdAt = { $gte: startDate, $lt: endDate }
      }

      const sort = {}
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1

      const orders = await Order.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const total = await Order.countDocuments(query)

      res.json({
        orders,
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

  // Get single order
  static async getOrder(req, res) {
    try {
      const order = await Order.findById(req.params.id)
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }
      
      res.json(order)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Create order
  static async createOrder(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const { userName, userEmail, items, shippingAddress, notes, shippingCharge = 0 } = req.body

      // Validate items and calculate totals
      let total = 0
      const orderItems = []

      for (const item of items) {
        // Use the item data directly as it comes from the client
        const itemTotal = (item.price || item.cost || 0) * (item.quantity || item.qty || 1)
        total += itemTotal

        orderItems.push({
          ...item,
          total: itemTotal
        })
      }

      const subtotal = total
      total += shippingCharge

      const order = new Order({
        userName,
        userEmail,
        items: orderItems,
        shippingAddress,
        notes,
        subtotal,
        shippingCharge,
        total,
        status: 'pending'
      })

      await order.save()

      // Create notification for new order
      await createNewOrderNotification(order, req.user.id)

      res.status(201).json(order)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update order status
  static async updateOrderStatus(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const { status } = req.body
      const order = await Order.findById(req.params.id)

      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }

      // Check if status is valid
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' })
      }

      // Store old status for logging
      const oldStatus = order.status
      
      // Update status
      order.status = status
      order.updatedAt = new Date()
      
      // Note: Product stock management removed as items don't reference products
      // You can implement custom stock logic here if needed

      await order.save()

      res.json({
        success: true,
        message: `Order status updated to ${status}`,
        order: order
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update payment status
  static async updatePaymentStatus(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const { paymentStatus } = req.body
      const order = await Order.findById(req.params.id)

      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }

      // Check if payment status is valid
      const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded']
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status value' })
      }

      // Store old payment status for logging
      const oldPaymentStatus = order.paymentStatus
      
      // Update payment status
      order.paymentStatus = paymentStatus
      order.updatedAt = new Date()

      await order.save()

      res.json({
        success: true,
        message: `Payment status updated to ${paymentStatus}`,
        order: order
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Delete order
  static async deleteOrder(req, res) {
    try {
      const order = await Order.findById(req.params.id)
      if (!order) {
        return res.status(404).json({ message: 'Order not found' })
      }

      // Note: Product stock management removed as items don't reference products

      await Order.findByIdAndDelete(req.params.id)
      res.json({ message: 'Order deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get order statistics
  static async getOrderStats(req, res) {
    try {
      const stats = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ])

      const dailyStats = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ])

      res.json({
        overview: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0
        },
        dailyStats
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = OrderController 