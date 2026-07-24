import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET analytics data
router.get('/', auth, async (req, res) => {
    try {
        const { start, end } = req.query;
        const userId = req.userId;

        console.log('📊 Analytics request for user:', userId);
        console.log('📅 Date range:', start, 'to', end);

        // Return empty data structure
        res.json({
            success: true,
            data: {
                sales: [],
                revenue: [],
                products: [],
                customers: [],
                categories: [],
                summary: {
                    totalSales: 0,
                    totalRevenue: 0,
                    totalCustomers: 0,
                    averageOrderValue: 0,
                    topProduct: '',
                    topCategory: ''
                }
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics data',
            error: error.message
        });
    }
});

export default router;