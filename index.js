const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const User = require('./models/User')
const Settings = require('./models/Settings')
require('dotenv').config()

// Import routes
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const customerRoutes = require('./routes/customers')
const categoryRoutes = require('./routes/categories')
const bannerRoutes = require('./routes/banners')
const notificationRoutes = require('./routes/notifications')
const settingsRoutes = require('./routes/settings')
const dashboardRoutes = require('./routes/dashboard')
const userRoutes = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://new_users_00:59jD2CZ5gRvVeR8A@cluster0.0cos2.mongodb.net/e-commerce-panel?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log(`✅ MongoDB connected successfully on port ${process.env.PORT || 5001}`)
  console.log(`📊 Database: e-commerce-panel`)
  
  // Initialize default admin user
  try {
    const existingAdmin = await User.findOne({ email: 'admin@admin.com' })
    
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Marketo',
        email: 'admin@admin.com',
        password: 'admin123', // Will be hashed by the pre-save hook
        role: 'admin',
        isActive: true,
        permissions: {
          dashboard: true,
          products: true,
          orders: true,
          customers: true,
          categories: true,
          banners: true,
          settings: true,
          notifications: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canView: true
        }
      })
      
      await adminUser.save()
      console.log('👤 Admin user created successfully')
    } else {
      console.log('👤 Admin user already exists')
    }
  } catch (error) {
    console.log('❌ Error creating admin user')
  }
  
  // Initialize default settings
  try {
    const existingSettings = await Settings.findOne()
    
    if (!existingSettings) {
      const defaultSettings = new Settings({
        siteName: 'Marketo',
        siteDescription: 'Modern admin panel for e-commerce',
        currency: 'USD',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        itemsPerPage: 10,
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        theme: {
          primaryColor: '#3B82F6',
          secondaryColor: '#6B7280',
          darkMode: false
        }
      })
      
      await defaultSettings.save()
      console.log('⚙️ Default settings created successfully')
    } else {
      console.log('⚙️ Settings already exist')
    }
  } catch (error) {
    console.log('❌ Error creating default settings')
  }
})
.catch(err => {
  console.log('❌ MongoDB connection failed')
})

// Root route - API status
app.get('/', (req, res) => {
  res.json({
    message: '🎉 API is working perfectly!',
    status: 'success',
    server: 'Ecommerce Admin Panel API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/users', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started successfully!`)
  console.log(`🌐 Server running on port: ${PORT}`)
  console.log(`🔗 API available at: http://localhost:${PORT}`)
  console.log(`🔐 Default admin: admin@admin.com / admin123`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}) 