const express = require('express')
const { body } = require('express-validator')
const AuthController = require('../controllers/authController')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], AuthController.login)

// Register (admin only)
router.post('/register', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'manager', 'staff'])
], auth, AuthController.register)

// Get current user
router.get('/me', auth, AuthController.getCurrentUser)

// Update profile
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim()
], AuthController.updateProfile)

// Change password
router.put('/password', auth, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], AuthController.changePassword)

// Get user count
router.get('/count', auth, AuthController.getUserCount)

module.exports = router 