import express from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    addProduct,
    editProduct
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ All routes require authentication - THIS MUST COME FIRST
router.use(auth);

// ✅ Main CRUD routes
router.use(auth);

// Product routes
router.post("/", addProduct);
router.put("/:id", editProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);  // Use createProduct (full featured)
router.put('/:id', updateProduct); // Use updateProduct (full featured)
router.delete('/:id', deleteProduct);

// ✅ Compatibility routes (from develop branch)
router.post('/add', addProduct);
router.put('/edit/:id', editProduct);

export default router;