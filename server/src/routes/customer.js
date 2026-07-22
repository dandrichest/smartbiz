import express from 'express';
import { 
    getCustomers, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    getCustomerPurchaseHistory
} from '../controllers/customerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Customer routes
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.get('/:id/purchases', getCustomerPurchaseHistory);

export default router;