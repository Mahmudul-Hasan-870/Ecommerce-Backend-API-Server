const { validationResult } = require('express-validator')
const User = require('../models/User')

class UserController {
  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password')
      res.json(users)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get single user
  static async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-password')
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Create new user
  static async createUser(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const { email } = req.body
      
      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' })
      }

      // Set default permissions based on role
      const defaultPermissions = getDefaultPermissions(req.body.role)
      
      const user = new User({
        ...req.body,
        permissions: { ...defaultPermissions, ...req.body.permissions }
      })
      
      await user.save()
      
      // Remove password from response
      const userResponse = user.toJSON()
      res.status(201).json(userResponse)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Update user data
      Object.assign(user, req.body)
      
      // Update permissions if role changed
      if (req.body.role && req.body.role !== user.role) {
        const defaultPermissions = getDefaultPermissions(req.body.role)
        user.permissions = { ...defaultPermissions, ...req.body.permissions }
      }
      
      await user.save()
      
      // Remove password from response
      const userResponse = user.toJSON()
      res.json(userResponse)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Prevent deleting the last admin
      if (user.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' })
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'Cannot delete the last admin user' })
        }
      }

      await User.findByIdAndDelete(req.params.id)
      res.json({ message: 'User deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const user = await User.findById(req.user.userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Only allow updating name and phone
      if (req.body.name) user.name = req.body.name
      if (req.body.phone) user.phone = req.body.phone

      await user.save()
      
      const userResponse = user.toJSON()
      res.json(userResponse)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const { currentPassword, newPassword } = req.body
      const user = await User.findById(req.user.userId)
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword)
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      // Update password
      user.password = newPassword
      await user.save()
      
      res.json({ message: 'Password updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
}

// Helper function to get default permissions based on role
function getDefaultPermissions(role) {
  const permissions = {
    dashboard: true,
    products: true,
    orders: true,
    customers: true,
    categories: true,
    settings: false,
    notifications: true,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canView: true
  }

  switch (role) {
    case 'admin':
      return {
        ...permissions,
        settings: true,
        canDelete: true
      }
    case 'manager':
      return {
        ...permissions,
        canDelete: true
      }
    case 'editor':
      return {
        ...permissions,
        settings: false,
        canDelete: false
      }
    case 'viewer':
      return {
        dashboard: true,
        products: true,
        orders: true,
        customers: true,
        categories: true,
        settings: false,
        notifications: true,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true
      }
    case 'staff':
      return {
        dashboard: true,
        products: true,
        orders: true,
        customers: false,
        categories: false,
        settings: false,
        notifications: true,
        canCreate: false,
        canEdit: true,
        canDelete: false,
        canView: true
      }
    default:
      return permissions
  }
}

module.exports = UserController 