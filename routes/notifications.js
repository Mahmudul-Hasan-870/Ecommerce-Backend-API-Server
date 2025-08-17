const express = require('express')
const NotificationController = require('../controllers/notificationController')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Get all notifications with pagination and filters
router.get('/', auth, NotificationController.getAllNotifications)

// Get unread notifications count
router.get('/unread/count', auth, NotificationController.getUnreadCount)

// Mark notification as read
router.put('/:id/read', auth, NotificationController.markAsRead)

// Mark all notifications as read
router.put('/read/all', auth, NotificationController.markAllAsRead)

// Delete notification
router.delete('/:id', auth, NotificationController.deleteNotification)

// Delete all notifications
router.delete('/', auth, NotificationController.deleteAllNotifications)

// Get notification statistics
router.get('/stats/overview', auth, NotificationController.getNotificationStats)

module.exports = router 