import express from 'express';
import { 
    addProduct,
    editProduct,
    getProducts, 
    getProductById,
    deleteProduct
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// Product routes
router.post("/", addProduct);
router.put("/:id", editProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

export default router;