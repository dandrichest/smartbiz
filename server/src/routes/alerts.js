import express from 'express';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET low stock products
router.get('/low-stock', auth, async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 10;
        const userId = req.userId;

        console.log('🔔 Low stock check for user:', userId);
        console.log('📊 Threshold:', threshold);

        const products = await Product.getLowStockProducts(userId, threshold);

        res.json({
            success: true,
            data: products,
            count: products.length,
            threshold: threshold
        });
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch low stock products',
            error: error.message
        });
    }
});

// GET out of stock products
router.get('/out-of-stock', auth, async (req, res) => {
    try {
        const userId = req.userId;

        console.log('🔔 Out of stock check for user:', userId);

        const products = await Product.getOutOfStockProducts(userId);

        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        console.error('Error fetching out of stock products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch out of stock products',
            error: error.message
        });
    }
});

// GET stock summary
router.get('/summary', auth, async (req, res) => {
    try {
        const userId = req.userId;

        console.log('📊 Stock summary for user:', userId);

        const summary = await Product.getStockSummary(userId);

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error fetching stock summary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stock summary',
            error: error.message
        });
    }
});

// Update stock threshold for a product
router.put('/threshold/:id', auth, async (req, res) => {
    try {
        const { threshold } = req.body;
        const userId = req.userId;

        console.log('🔔 Updating threshold for product:', req.params.id);
        console.log('📊 New threshold:', threshold);

        if (!threshold || threshold < 0) {
            return res.status(400).json({
                success: false,
                message: 'Threshold must be a positive number'
            });
        }

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, createdBy: userId },
            { 
                minStock: threshold,
                lowStockAlertSent: false // Reset alert flag when threshold changes
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Stock threshold updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error updating stock threshold:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update stock threshold',
            error: error.message
        });
    }
});

// Update stock quantity
router.put('/stock/:id', auth, async (req, res) => {
    try {
        const { stockQuantity } = req.body;
        const userId = req.userId;

        console.log('📦 Updating stock for product:', req.params.id);
        console.log('📊 New stock quantity:', stockQuantity);

        if (stockQuantity === undefined || stockQuantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock quantity must be a positive number'
            });
        }

        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, createdBy: userId },
            { 
                stockQuantity: stockQuantity,
                lowStockAlertSent: false // Reset alert flag when stock is updated
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Stock quantity updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error updating stock quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update stock quantity',
            error: error.message
        });
    }
});

// Get single product with stock info
router.get('/product/:id', auth, async (req, res) => {
    try {
        const userId = req.userId;

        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: userId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: {
                ...product.toJSON(),
                stockStatus: product.stockStatus,
                needsRestock: product.needsRestock(),
                profitMargin: product.profitMargin,
                totalValue: product.totalValue
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
});

export default router;