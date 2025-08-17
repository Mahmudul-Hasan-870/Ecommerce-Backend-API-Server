const express = require('express')
const CustomerController = require('../controllers/customerController')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Get all customers with pagination and filters
router.get('/', auth, CustomerController.getAllCustomers)

// Get customer statistics
router.get('/stats/overview', auth, CustomerController.getCustomerStats)

// Create new customer
router.post('/', auth, CustomerController.createCustomer)

// Get single customer with order history
router.get('/:id', auth, CustomerController.getCustomer)

// Update customer
router.put('/:id', auth, CustomerController.updateCustomer)

// Delete customer
router.delete('/:id', auth, CustomerController.deleteCustomer)

module.exports = router 