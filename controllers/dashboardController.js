const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')
const Customer = require('../models/Customer')

class DashboardController {
  // Get dashboard statistics
  static async getDashboardStats(req, res) {
    try {
      // Get order stats
      const orderStats = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            avgOrderValue: { $avg: '$total' }
          }
        }
      ])

      // Get product stats
      const productStats = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            lowStockProducts: {
              $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] }
            }
          }
        }
      ])

      // Get customer stats
      const customerStats = await Customer.aggregate([
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            activeCustomers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            totalCustomerSpending: { $sum: '$totalSpent' },
            avgCustomerSpending: { $avg: '$totalSpent' }
          }
        }
      ])

      const customerCount = customerStats[0]?.activeCustomers || 0

      // Get recent orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)

      // Get low stock products
      const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
        .limit(6)
        .select('name stock image')

      // Get recent customers
      const recentCustomers = await Customer.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email phone avatar totalOrders totalSpent createdAt')

      const responseData = {
        stats: {
          totalOrders: orderStats[0]?.totalOrders || 0,
          totalRevenue: orderStats[0]?.totalRevenue || 0,
          totalProducts: productStats[0]?.totalProducts || 0,
          totalUsers: customerCount,
          lowStockProducts: productStats[0]?.lowStockProducts || 0,
          totalCustomers: customerStats[0]?.totalCustomers || 0,
          activeCustomers: customerStats[0]?.activeCustomers || 0,
          totalCustomerSpending: customerStats[0]?.totalCustomerSpending || 0,
          avgCustomerSpending: customerStats[0]?.avgCustomerSpending || 0
        },
        recentOrders,
        lowStockProducts,
        recentCustomers
      }
      
      res.json(responseData)
    } catch (error) {
      res.status(500).json({ 
        message: 'Server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      })
    }
  }

  // Health check
  static async healthCheck(req, res) {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  }
}

module.exports = DashboardController 