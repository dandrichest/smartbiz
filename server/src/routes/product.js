import { deleteProduct } from "../controllers/productController.js";
import express from 'express';
const router = express.Router();

router.delete("/:id", deleteProduct )

export default router