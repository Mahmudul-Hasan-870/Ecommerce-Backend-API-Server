const { validationResult } = require('express-validator')
const Settings = require('../models/Settings')

class SettingsController {
  // Get all settings
  static async getAllSettings(req, res) {
    try {
      let settings = await Settings.findOne()
      
      if (!settings) {
        // Create default settings if none exist
        settings = new Settings()
        await settings.save()
      }
      
      res.json(settings)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update settings
  static async updateSettings(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      let settings = await Settings.findOne()
      
      if (!settings) {
        settings = new Settings(req.body)
      } else {
        Object.assign(settings, req.body)
      }

      await settings.save()
      res.json(settings)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get specific setting
  static async getSetting(req, res) {
    try {
      const { key } = req.params
      let settings = await Settings.findOne()
      
      if (!settings) {
        settings = new Settings()
        await settings.save()
      }
      
      if (!settings[key]) {
        return res.status(404).json({ message: 'Setting not found' })
      }

      res.json({ [key]: settings[key] })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update specific setting
  static async updateSetting(req, res) {
    try {
      const { key } = req.params
      const { value } = req.body

      if (!value) {
        return res.status(400).json({ message: 'Value is required' })
      }

      let settings = await Settings.findOne()
      
      if (!settings) {
        settings = new Settings({ [key]: value })
      } else {
        settings[key] = value
      }

      await settings.save()
      res.json({ [key]: settings[key] })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Reset settings to default
  static async resetSettings(req, res) {
    try {
      const defaultSettings = {
        siteName: 'Admin Panel',
        siteDescription: 'Modern admin panel for e-commerce',
        currency: 'USD',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        itemsPerPage: 10,
        notifications: {
          email: true,
          push: true
        },
        theme: {
          primaryColor: '#3B82F6',
          secondaryColor: '#6B7280',
          darkMode: false
        },

      }

      let settings = await Settings.findOne()
      
      if (!settings) {
        settings = new Settings(defaultSettings)
      } else {
        Object.assign(settings, defaultSettings)
      }

      await settings.save()
      res.json(settings)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = SettingsController 