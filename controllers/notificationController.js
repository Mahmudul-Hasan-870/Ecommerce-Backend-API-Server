const { validationResult } = require('express-validator')
const Notification = require('../models/Notification')

class NotificationController {
  // Get all notifications with pagination and filters
  static async getAllNotifications(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      const query = { userId: req.user.id }

      // Type filter
      if (type) {
        query.type = type
      }

      // Status filter
      if (status) {
        query.status = status
      }

      const sort = {}
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1

      const notifications = await Notification.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const total = await Notification.countDocuments(query)

      res.json({
        notifications,
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

  // Get unread notifications count
  static async getUnreadCount(req, res) {
    try {
      const count = await Notification.countDocuments({
        userId: req.user.id,
        status: 'unread'
      })

      res.json({ count })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { id } = req.params

      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { status: 'read' },
        { new: true }
      )

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' })
      }

      res.json(notification)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req, res) {
    try {
      const result = await Notification.updateMany(
        { userId: req.user.id, status: 'unread' },
        { status: 'read' }
      )

      res.json({ message: `${result.modifiedCount} notifications marked as read` })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Delete notification
  static async deleteNotification(req, res) {
    try {
      const { id } = req.params

      const notification = await Notification.findOneAndDelete({
        _id: id,
        userId: req.user.id
      })

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' })
      }

      res.json({ message: 'Notification deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Delete all notifications
  static async deleteAllNotifications(req, res) {
    try {
      const result = await Notification.deleteMany({ userId: req.user.id })

      res.json({ message: `${result.deletedCount} notifications deleted` })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get notification statistics
  static async getNotificationStats(req, res) {
    try {
      const stats = await Notification.aggregate([
        { $match: { userId: req.user.id } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: { $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] } },
            read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } }
          }
        }
      ])

      const typeStats = await Notification.aggregate([
        { $match: { userId: req.user.id } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])

      res.json({
        overview: stats[0] || {
          total: 0,
          unread: 0,
          read: 0
        },
        byType: typeStats
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = NotificationController 