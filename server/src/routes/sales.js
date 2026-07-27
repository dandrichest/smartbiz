import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import { 
    getSales, 
    getSalesHistory, 
    recordSale, 
    createSale,
    getSaleById,
    generateReceipt,
    getSalesSummary,
    deleteSale
} from '../controllers/saleController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get sales history
router.get('/history', getSalesHistory);

// Get all sales with filters
router.get('/', getSales);

// Get sales summary
router.get('/summary', getSalesSummary);

// Get single sale by ID
router.get('/:id', getSaleById);

// Generate receipt for a sale
router.get('/:id/receipt', generateReceipt);

// Create a new sale with validation
router.post(
    '/',
    [
        body('customerId').optional().isString(),
        body('items').isArray().withMessage('Items must be an array'),
        body('items.*.productId').notEmpty().withMessage('Product ID is required'),
        body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
        body('paymentMethod').optional().isString(),
        body('total').optional().isFloat({ min: 0 }),
    ],
    createSale
);

// Record sale (alias)
router.post('/record', recordSale);

// Delete a sale
router.delete('/:id', deleteSale);

export default router;