const express = require('express')
const DashboardController = require('../controllers/dashboardController')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Get dashboard statistics
router.get('/stats', auth, DashboardController.getDashboardStats)

// Health check
router.get('/health', DashboardController.healthCheck)

module.exports = router 