const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

class AuthController {
  // Login
  static async login(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' })
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      res.json({
        token,
        user: user.toJSON()
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Register (admin only)
  static async register(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const { name, email, password, role } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const user = new User({
        name,
        email,
        password,
        role
      })

      await user.save()

      res.status(201).json({
        message: 'User created successfully',
        user: user.toJSON()
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get current user
  static async getCurrentUser(req, res) {
    try {
      res.json(req.user)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update profile
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const { name, email, phone } = req.body
      const updates = {}

      if (name) updates.name = name
      if (email) updates.email = email
      if (phone) updates.phone = phone

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      )

      res.json(user)
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

      const isMatch = await req.user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      req.user.password = newPassword
      await req.user.save()

      res.json({ message: 'Password updated successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get user count
  static async getUserCount(req, res) {
    try {
      const userCount = await User.countDocuments({ isActive: true })
      res.json({ count: userCount })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = AuthController 