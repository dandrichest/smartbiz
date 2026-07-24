// server/src/routes/testimonials.js
import express from 'express';
import Testimonial from '../models/Testimonial.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get recent testimonials (public)
router.get('/recent', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        const testimonials = await Testimonial.find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        
        // Calculate average rating
        const avgResult = await Testimonial.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]);
        
        const totalReviews = await Testimonial.countDocuments({ status: 'approved' });
        
        res.json({
            success: true,
            data: testimonials,
            stats: {
                averageRating: avgResult[0]?.avg || 0,
                totalReviews
            }
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials',
            error: error.message
        });
    }
});

// Get all testimonials with pagination (admin)
router.get('/all', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const query = {};
        if (status) query.status = status;
        
        const testimonials = await Testimonial.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Testimonial.countDocuments(query);
        
        res.json({
            success: true,
            data: testimonials,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonials',
            error: error.message
        });
    }
});

// Get testimonial stats
router.get('/stats', async (req, res) => {
    try {
        const stats = await Testimonial.aggregate([
            { $match: { status: 'approved' } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    ratingCounts: {
                        $push: '$rating'
                    }
                }
            }
        ]);
        
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (stats[0]?.ratingCounts) {
            stats[0].ratingCounts.forEach(r => {
                if (ratingCounts[r] !== undefined) ratingCounts[r]++;
            });
        }
        
        res.json({
            success: true,
            data: {
                averageRating: stats[0]?.avg || 0,
                totalReviews: stats[0]?.totalReviews || 0,
                ratingDistribution: ratingCounts
            }
        });
    } catch (error) {
        console.error('Error fetching testimonial stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch testimonial stats',
            error: error.message
        });
    }
});

// ✅ CREATE a new testimonial (saves to database)
router.post('/', async (req, res) => {
    try {
        const { customerName, customerEmail, rating, comment, productName, productId } = req.body;
        
        // Validate required fields
        if (!customerName || !customerEmail || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }
        
        // Create new testimonial
        const testimonial = new Testimonial({
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim().toLowerCase(),
            rating: parseInt(rating),
            comment: comment.trim(),
            productName: productName ? productName.trim() : '',
            productId: productId || null,
            status: 'approved', // Auto-approve
            isVerified: false,
            isFeatured: false
        });
        
        // Save to database
        await testimonial.save();
        
        console.log('✅ New testimonial saved:', testimonial._id);
        
        res.status(201).json({
            success: true,
            message: 'Testimonial created successfully',
            data: testimonial
        });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create testimonial',
            error: error.message
        });
    }
});

// ✅ DELETE a testimonial (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const testimonial = await Testimonial.findById(id);
        
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }
        
        await Testimonial.findByIdAndDelete(id);
        
        console.log('✅ Testimonial deleted:', id);
        
        res.json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete testimonial',
            error: error.message
        });
    }
});

// ✅ UPDATE a testimonial (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, isFeatured, customerName, customerEmail, rating, comment, productName } = req.body;
        
        const updateData = {
            updatedAt: Date.now()
        };
        
        if (status !== undefined) updateData.status = status;
        if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
        if (customerName !== undefined) updateData.customerName = customerName.trim();
        if (customerEmail !== undefined) updateData.customerEmail = customerEmail.trim().toLowerCase();
        if (rating !== undefined) updateData.rating = parseInt(rating);
        if (comment !== undefined) updateData.comment = comment.trim();
        if (productName !== undefined) updateData.productName = productName.trim();
        
        const testimonial = await Testimonial.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        
        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }
        
        console.log('✅ Testimonial updated:', id);
        
        res.json({
            success: true,
            message: 'Testimonial updated successfully',
            data: testimonial
        });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update testimonial',
            error: error.message
        });
    }
});

export default router;