import { deleteProduct, addProduct, editProduct } from "../controllers/productController.js";
import express from 'express';
import { 
    getProducts, 
    getProductById, 
    addProduct,
    editProduct,   
    deleteProduct 
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/", addProduct);
router.put("/:id", editProduct);
router.delete("/:id", deleteProduct);
// All routes require authentication
router.use(auth);

// Product routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

export default router;