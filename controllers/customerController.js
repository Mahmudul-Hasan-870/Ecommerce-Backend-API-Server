const { validationResult } = require('express-validator')
const Customer = require('../models/Customer')
const Order = require('../models/Order')
const { sendCreateSuccess, sendUpdateSuccess, sendDeleteSuccess, sendActionFailed } = require('../utils/toastHelper')

class CustomerController {
  // Get all customers with pagination and filters
  static async getAllCustomers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      const query = {}

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      }

      // Status filter
      if (status) {
        query.status = status
      }

      const sort = {}
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1

      // Get customers with pagination
      const customers = await Customer.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit * 1)

      const total = await Customer.countDocuments(query)

      res.json({
        success: true,
        customers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  }

  // Get single customer with order history
  static async getCustomer(req, res) {
    try {
      const { id } = req.params

      const customer = await Customer.findById(id)
      
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' })
      }

      // Get customer's orders
      const orders = await Order.find({ userEmail: customer.email })
        .sort({ createdAt: -1 })

      res.json({
        success: true,
        customer,
        orders
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  }

  // Create new customer
  static async createCustomer(req, res) {
    try {
      const customerData = req.body
      
      // Check if customer with email already exists
      const existingCustomer = await Customer.findOne({ email: customerData.email })
      if (existingCustomer) {
        return res.status(400).json({ 
          success: false, 
          message: 'Customer with this email already exists' 
        })
      }

      const customer = new Customer(customerData)
      await customer.save()

      sendCreateSuccess(res, 'Customer', { customer })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  }

  // Update customer
  static async updateCustomer(req, res) {
    try {
      const { id } = req.params
      const updateData = req.body

      const customer = await Customer.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )

      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' })
      }

      sendUpdateSuccess(res, 'Customer', { customer })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  }

  // Delete customer
  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params

      const customer = await Customer.findByIdAndDelete(id)

      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' })
      }

      sendDeleteSuccess(res, 'Customer')
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  }

  // Get customer statistics
  static async getCustomerStats(req, res) {
    try {
      const totalCustomers = await Customer.countDocuments()
      const activeCustomers = await Customer.countDocuments({ status: 'active' })
      const inactiveCustomers = await Customer.countDocuments({ status: 'inactive' })

      // Get customers with highest spending
      const topCustomers = await Customer.find()
        .sort({ totalSpent: -1 })
        .limit(10)

      // Get recent customers
      const recentCustomers = await Customer.find()
        .sort({ createdAt: -1 })
        .limit(5)

      res.json({
        success: true,
        stats: {
          totalCustomers,
          activeCustomers,
          inactiveCustomers
        },
        topCustomers,
        recentCustomers
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  }
}

module.exports = CustomerController 