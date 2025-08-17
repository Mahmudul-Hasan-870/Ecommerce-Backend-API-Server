const express = require('express')
const { body } = require('express-validator')
const SettingsController = require('../controllers/settingsController')
const { auth, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get all settings
router.get('/', auth, SettingsController.getAllSettings)

// Update settings
router.put('/', auth, requireRole(['admin']), [
  body('siteName').optional().trim().notEmpty(),
  body('siteDescription').optional().trim(),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'BDT', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'TRY', 'BRL', 'MXN', 'ZAR', 'AED', 'SAR', 'THB', 'MYR', 'IDR', 'PHP', 'VND']),
  body('timezone').optional().trim(),
  body('dateFormat').optional().trim(),
  body('timeFormat').optional().isIn(['12h', '24h']),
  body('itemsPerPage').optional().isInt({ min: 5, max: 100 }),
  body('notifications.email').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  body('notifications.sms').optional().isBoolean(),
  body('theme.primaryColor').optional().trim(),
  body('theme.secondaryColor').optional().trim(),
  body('theme.darkMode').optional().isBoolean(),

], SettingsController.updateSettings)

// Get specific setting
router.get('/:key', auth, SettingsController.getSetting)

// Update specific setting
router.put('/:key', auth, requireRole(['admin']), SettingsController.updateSetting)

// Reset settings to default
router.post('/reset', auth, requireRole(['admin']), SettingsController.resetSettings)

module.exports = router 