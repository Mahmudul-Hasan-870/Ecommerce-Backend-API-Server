# 🚀 E-commerce Backend API Server

A robust, scalable backend API server for e-commerce applications built with **Node.js**, **Express.js**, and **MongoDB**. This server provides comprehensive RESTful APIs for managing products, orders, customers, and business operations.

## ✨ Features

### 🎯 Core Functionality
- **📊 Dashboard Analytics** - Business insights and performance metrics APIs
- **🛍️ Product Management** - Complete CRUD operations for products with categories
- **📦 Order Management** - Track and manage customer orders with status updates
- **👥 Customer Management** - Comprehensive customer database and profile APIs
- **🏷️ Category Management** - Organize products with flexible categorization
- **🎨 Banner Management** - Manage promotional banners and marketing content
- **⚙️ Settings Management** - Customizable business settings and preferences
- **🔔 Notification System** - Real-time alerts and system notifications

### 🚀 Advanced Features
- **🔐 JWT Authentication** - Secure user authentication and authorization
- **📊 Data Validation** - Input validation and sanitization
- **🔍 Search & Filter** - Advanced search capabilities across all modules
- **📄 Pagination** - Efficient data handling for large datasets
- **🔄 Real-time Updates** - Live data synchronization capabilities
- **📝 Logging** - Comprehensive request and error logging

## 🛠️ Technology Stack

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling tool
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing library
- **express-validator** - Input validation middleware
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers middleware

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the API server**
   - API Base URL: `http://localhost:5000`
   - API Documentation: `http://localhost:5000/api-docs`

## 🔑 Default Login Credentials

Upon first startup, the system automatically creates a default admin user:

- **Email**: `admin@admin.com`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials immediately after first login for security purposes.

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User authentication |
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update user profile |
| `PUT` | `/api/auth/password` | Change user password |

### Product Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Retrieve all products |
| `POST` | `/api/products` | Create new product |
| `GET` | `/api/products/:id` | Get product by ID |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |

### Order Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Retrieve all orders |
| `GET` | `/api/orders/:id` | Get order by ID |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `PUT` | `/api/orders/:id` | Update order details |

### Customer Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/customers` | Retrieve all customers |
| `POST` | `/api/customers` | Create new customer |
| `GET` | `/api/customers/:id` | Get customer by ID |
| `PUT` | `/api/customers/:id` | Update customer |
| `DELETE` | `/api/customers/:id` | Delete customer |

### Category Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | Retrieve all categories |
| `POST` | `/api/categories` | Create new category |
| `PUT` | `/api/categories/:id` | Update category |
| `DELETE` | `/api/categories/:id` | Delete category |

### Banner Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/banners` | Retrieve all banners |
| `POST` | `/api/banners` | Create new banner |
| `PUT` | `/api/banners/:id` | Update banner |
| `DELETE` | `/api/banners/:id` | Delete banner |

### Settings Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings` | Retrieve all settings |
| `PUT` | `/api/settings` | Update settings |
| `POST` | `/api/settings/reset` | Reset to default settings |

### Dashboard Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/stats` | Get dashboard statistics |
| `GET` | `/api/dashboard/revenue` | Get revenue analytics |
| `GET` | `/api/dashboard/orders` | Get order analytics |
| `GET` | `/api/dashboard/products` | Get product analytics |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Get all notifications |
| `POST` | `/api/notifications` | Create notification |
| `PUT` | `/api/notifications/:id` | Update notification |
| `DELETE` | `/api/notifications/:id` | Delete notification |
| `PATCH` | `/api/notifications/:id/read` | Mark as read |

## 🏗️ Project Structure

```
ecommerce-backend/
├── 📁 controllers/          # Business logic controllers
│   ├── authController.js    # Authentication logic
│   ├── bannerController.js  # Banner management
│   ├── categoryController.js # Category operations
│   ├── customerController.js # Customer management
│   ├── dashboardController.js # Dashboard analytics
│   ├── notificationController.js # Notification system
│   ├── orderController.js   # Order processing
│   ├── productController.js # Product operations
│   ├── settingsController.js # System settings
│   └── userController.js    # User management
├── 📁 middleware/           # Custom middleware
│   └── auth.js             # Authentication middleware
├── 📁 models/              # Database models
│   ├── Banner.js           # Banner schema
│   ├── Category.js         # Category schema
│   ├── Customer.js         # Customer schema
│   ├── Notification.js     # Notification schema
│   ├── Order.js            # Order schema
│   ├── Product.js          # Product schema
│   ├── Settings.js         # Settings schema
│   └── User.js             # User schema
├── 📁 routes/              # API route definitions
│   ├── auth.js             # Authentication routes
│   ├── banners.js          # Banner routes
│   ├── categories.js       # Category routes
│   ├── customers.js        # Customer routes
│   ├── dashboard.js        # Dashboard routes
│   ├── notifications.js    # Notification routes
│   ├── orders.js           # Order routes
│   ├── products.js         # Product routes
│   ├── settings.js         # Settings routes
│   └── users.js            # User routes
├── 📁 utils/               # Utility functions
│   ├── notificationHelper.js # Notification utilities
│   └── toastHelper.js      # Toast message helpers
├── 📄 index.js             # Server entry point
├── 📄 package.json         # Dependencies and scripts
└── 📄 README.md            # Project documentation
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce-admin
MONGODB_URI_PROD=mongodb://your-production-db-url

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_ORIGIN_PROD=https://your-frontend-domain.com

# Optional: Email Configuration (if implementing email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379
```

### Default System Settings

The application initializes with these default settings:

| Setting | Default Value | Description |
|---------|---------------|-------------|
| **Site Name** | Admin Panel | Display name for the application |
| **Site Description** | Modern admin panel for e-commerce | Meta description |
| **Currency** | USD | Default currency for transactions |
| **Timezone** | UTC | System timezone |
| **Date Format** | MM/DD/YYYY | Date display format |
| **Time Format** | 12h | Time display format (12/24 hour) |
| **Items Per Page** | 10 | Pagination limit |
| **Theme** | Light | Default UI theme |

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run server       # Start server only

# Database
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Production
npm run build        # Build for production
npm run start:prod   # Start production server
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Database Management**
   ```bash
   # Connect to MongoDB
   mongosh
   use ecommerce-admin
   
   # View collections
   show collections
   
   # View documents
   db.products.find()
   ```

3. **API Testing**
   ```bash
   # Test with curl
   curl -X GET http://localhost:5000/api/products
   
   # Test with Postman
   # Import the API collection
   ```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

## 📦 Deployment

### Production Build
```bash
# Set environment
NODE_ENV=production

# Install production dependencies
npm ci --only=production

# Start production server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ecommerce-admin
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **Input Validation** - express-validator for data sanitization
- **CORS Protection** - Configurable cross-origin resource sharing
- **Rate Limiting** - API request throttling
- **Helmet.js** - Security headers middleware
- **SQL Injection Protection** - MongoDB parameterized queries
- **XSS Protection** - Input sanitization and validation

## 📊 Performance Optimization

- **Database Indexing** - Optimized MongoDB queries
- **Pagination** - Efficient data handling for large datasets
- **Caching** - Redis integration (optional)
- **Compression** - gzip compression middleware
- **Connection Pooling** - MongoDB connection optimization
- **Async Operations** - Non-blocking I/O operations

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/user),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: ObjectId (ref: Category),
  stock: Number,
  images: [String],
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  customer: ObjectId (ref: Customer),
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (pending/processing/completed/cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details",
  "statusCode": 400
}
```

## 📝 Logging

### Log Levels
- **ERROR** - Application errors and exceptions
- **WARN** - Warning messages
- **INFO** - General information
- **DEBUG** - Debug information

### Log Format
```javascript
{
  timestamp: "2024-01-01T00:00:00.000Z",
  level: "INFO",
  message: "Request processed successfully",
  method: "GET",
  url: "/api/products",
  statusCode: 200,
  responseTime: "15ms",
  userAgent: "Mozilla/5.0...",
  ip: "127.0.0.1"
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Use conventional commit messages
- Follow RESTful API design principles

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access and firewall settings

2. **JWT Token Issues**
   - Check JWT_SECRET in environment
   - Verify token expiration settings
   - Check token format in requests

3. **Port Conflicts**
   - Change PORT in `.env` file
   - Kill processes using the port: `lsof -ti:5000 | xargs kill -9`
   - Use different ports for different services

4. **CORS Issues**
   - Verify CORS_ORIGIN in environment
   - Check frontend URL configuration
   - Ensure proper CORS middleware setup

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Verbose logging
NODE_ENV=development LOG_LEVEL=debug npm run dev

# MongoDB debug
DEBUG=mongoose:* npm run dev
```

## 📝 Changelog

### Version 1.0.0
- Initial release
- Core CRUD operations for all entities
- JWT authentication system
- Dashboard analytics APIs
- Comprehensive validation and error handling

### Version 1.1.0 (Planned)
- Rate limiting implementation
- Advanced search and filtering
- Bulk operations support
- Enhanced security features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Express.js Team** - For the robust web framework
- **MongoDB Team** - For the flexible NoSQL database
- **Node.js Community** - For the amazing ecosystem
- **Open Source Contributors** - For various packages and tools

## 📞 Support

- **Documentation**: [API Documentation](api-docs-link)
- **Issues**: [GitHub Issues](issues-link)
- **Discussions**: [GitHub Discussions](discussions-link)
- **Email**: mahmudulhasan7780@gmail.com
- **Slack**: [Join our workspace](slack-link)

---

**⭐ Star this repository if you find it helpful!**

**🔄 Keep updated with the latest releases and features.**

**🚀 Ready to power your e-commerce application!** 