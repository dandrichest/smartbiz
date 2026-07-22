import { deleteProduct, addProduct, editProduct } from "../controllers/productController.js";
import express from 'express';
const router = express.Router();

router.post("/", addProduct);
router.put("/:id", editProduct);
router.delete("/:id", deleteProduct);

export default router;