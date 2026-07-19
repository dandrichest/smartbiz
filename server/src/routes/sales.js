import express from 'express';
import { body } from 'express-validator';
import authenticate from '../middleware/auth.js';
import { getSalesHistory, recordSale } from '../controllers/saleController.js';

const router = express.Router();

router.get('/history', authenticate, getSalesHistory);
router.post(
  '/',
  authenticate,
  [
    body('customerId').notEmpty().withMessage('Customer ID is required'),
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantitySold').isInt({ min: 1 }).withMessage('Quantity sold must be at least 1'),
    body('paymentMethod').optional().isString(),
  ],
  recordSale,
);

export default router;
