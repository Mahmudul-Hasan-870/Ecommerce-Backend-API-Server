const { validationResult } = require('express-validator')
const Banner = require('../models/Banner')

class BannerController {
  // Get all banners with pagination and filters
  static async getAllBanners(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        type,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      const query = {}

      // Search filter
      if (search) {
        query.$text = { $search: search }
      }

      // Status filter
      if (status) {
        query.status = status
      }

      // Type filter
      if (type) {
        query.type = type
      }

      const sort = {}
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1

      const banners = await Banner.find(query)
        .populate('createdBy', 'name email')
        .populate('productId', 'name price image')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const total = await Banner.countDocuments(query)

      res.json({
        banners,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get single banner
  static async getBanner(req, res) {
    try {
      const banner = await Banner.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('productId', 'name price image')
      
      if (!banner) {
        return res.status(404).json({ message: 'Banner not found' })
      }
      res.json(banner)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Create banner
  static async createBanner(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const bannerData = {
        ...req.body,
        createdBy: req.user.id
      }

      const banner = new Banner(bannerData)
      await banner.save()

      await banner.populate('createdBy', 'name email')
      await banner.populate('productId', 'name price image')
      res.status(201).json(banner)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Update banner
  static async updateBanner(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', errors: errors.array() })
      }

      const banner = await Banner.findById(req.params.id)
      if (!banner) {
        return res.status(404).json({ message: 'Banner not found' })
      }

      Object.assign(banner, req.body)
      await banner.save()

      await banner.populate('createdBy', 'name email')
      await banner.populate('productId', 'name price image')
      res.json(banner)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Delete banner
  static async deleteBanner(req, res) {
    try {
      const banner = await Banner.findById(req.params.id)
      if (!banner) {
        return res.status(404).json({ message: 'Banner not found' })
      }

      await Banner.findByIdAndDelete(req.params.id)
      res.json({ message: 'Banner deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get active banners by type
  static async getActiveBannersByType(req, res) {
    try {
      const { type = 'regular' } = req.params

      const query = {
        status: 'active',
        type: type
      }

      const banners = await Banner.find(query)
        .sort({ createdAt: -1 })
        .limit(10)

      res.json(banners)
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Bulk operations
  static async bulkOperations(req, res) {
    try {
      const { operation, bannerIds } = req.body

      if (!Array.isArray(bannerIds) || bannerIds.length === 0) {
        return res.status(400).json({ message: 'Banner IDs are required' })
      }

      switch (operation) {
        case 'delete':
          await Banner.deleteMany({ _id: { $in: bannerIds } })
          break
        case 'activate':
          await Banner.updateMany(
            { _id: { $in: bannerIds } },
            { $set: { status: 'active' } }
          )
          break
        case 'deactivate':
          await Banner.updateMany(
            { _id: { $in: bannerIds } },
            { $set: { status: 'inactive' } }
          )
          break
        default:
          return res.status(400).json({ message: 'Invalid operation' })
      }

      res.json({ message: `${operation} operation completed successfully` })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }

  // Get banner statistics
  static async getBannerStats(req, res) {
    try {
      const totalBanners = await Banner.countDocuments()
      const activeBanners = await Banner.countDocuments({ status: 'active' })
      const inactiveBanners = await Banner.countDocuments({ status: 'inactive' })
      const regularBanners = await Banner.countDocuments({ type: 'regular' })
      const promotionalBanners = await Banner.countDocuments({ type: 'promotional' })

      res.json({
        totalBanners,
        activeBanners,
        inactiveBanners,
        regularBanners,
        promotionalBanners
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = BannerController 