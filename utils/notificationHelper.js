const Notification = require('../models/Notification')

// Create notification for low stock product
const createLowStockNotification = async (product, userId) => {
  try {
    const existingNotification = await Notification.findOne({
      userId,
      type: 'low_stock',
      relatedId: product._id,
      isRead: false
    })

    if (!existingNotification) {
      const notification = new Notification({
        userId,
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: `${product.name} is running low on stock (${product.stock} remaining)`,
        priority: 'high',
        relatedId: product._id,
        relatedModel: 'Product'
      })
      
      await notification.save()
    }
      } catch (error) {
      // Handle error silently
    }
}

// Create notification for new order
const createNewOrderNotification = async (order, userId) => {
  try {
    const notification = new Notification({
      userId,
      type: 'new_order',
      title: 'New Order',
      message: `Order #${order.orderNumber.slice(-8)} received for $${order.total.toFixed(2)}`,
      priority: 'medium',
      relatedId: order._id,
      relatedModel: 'Order'
    })
    
    await notification.save()
      } catch (error) {
      // Handle error silently
    }
}

// Check and create low stock notifications for all products
const checkLowStockNotifications = async (userId) => {
  try {
    const Product = require('../models/Product')
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
    
    for (const product of lowStockProducts) {
      await createLowStockNotification(product, userId)
    }
      } catch (error) {
      // Handle error silently
    }
}

module.exports = {
  createLowStockNotification,
  createNewOrderNotification,
  checkLowStockNotifications
} 