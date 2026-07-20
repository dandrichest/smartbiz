import express from 'express';
import { 
    createSale, 
    getSales, 
    getSaleById, 
    generateReceipt, 
    exportSales 
} from '../controllers/saleController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Sales routes
router.post('/', createSale);
router.get('/', getSales);
router.get('/:id', getSaleById);
router.get('/:id/receipt', generateReceipt);
router.get('/export/csv', exportSales);

export default router;