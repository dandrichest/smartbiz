const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create a new sale
router.post('/', saleController.createSale);

// Get all sales (with filters)
router.get('/', saleController.getSales);

// Get single sale by ID
router.get('/:id', saleController.getSaleById);

// Generate receipt for a sale
router.get('/:id/receipt', saleController.generateReceipt);

// Export sales
router.get('/export/csv', saleController.exportSales);

module.exports = router;