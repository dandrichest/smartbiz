import express from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js'; // ✅ Add this import
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a review
router.post('/', auth, async (req, res) => {
    try {
        console.log('📝 Creating review for user:', req.userId);
        console.log('📦 Review data:', req.body);

        const { productId, rating, comment } = req.body;

        // Validate
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        if (!comment || comment.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment is required'
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            productId,
            userId: req.userId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // ✅ Get user name - FIXED: User is now imported
        const user = await User.findById(req.userId);
        const userName = user ? user.name : 'Anonymous';

        const review = new Review({
            productId,
            userId: req.userId,
            userName,
            rating: Number(rating),
            comment: comment.trim()
        });

        await review.save();

        console.log('✅ Review created successfully:', review._id);

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    } catch (error) {
        console.error('❌ Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: error.message
        });
    }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ 
            productId: req.params.productId 
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        console.error('❌ Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
});

// Get user's reviews
router.get('/my-reviews', auth, async (req, res) => {
    try {
        const reviews = await Review.find({ 
            userId: req.userId 
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        console.error('❌ Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
});

export default router;