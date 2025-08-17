const express = require('express')
const { body } = require('express-validator')
const UserController = require('../controllers/userController')
const { auth, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get all users (admin only)
router.get('/', auth, requireRole(['admin']), UserController.getAllUsers)

// Get single user (admin only)
router.get('/:id', auth, requireRole(['admin']), UserController.getUser)

// Create new user (admin only)
router.post('/', auth, requireRole(['admin']), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'manager', 'editor', 'viewer', 'staff']).withMessage('Valid role is required'),
  body('phone').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('permissions').optional().isObject()
], UserController.createUser)

// Update user (admin only)
router.put('/:id', auth, requireRole(['admin']), [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'manager', 'editor', 'viewer', 'staff']),
  body('phone').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('permissions').optional().isObject()
], UserController.updateUser)

// Delete user (admin only)
router.delete('/:id', auth, requireRole(['admin']), UserController.deleteUser)

// Update user profile (user can update their own profile)
router.put('/profile/update', auth, [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().trim()
], UserController.updateProfile)

// Change password (user can change their own password)
router.put('/profile/password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], UserController.changePassword)

module.exports = router 