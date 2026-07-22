import express from 'express';
import { getStats, getRecentActivity, getTopProducts } from '../controllers/dashboardController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/stats', getStats);
router.get('/recent-activity', getRecentActivity);
router.get('/top-products', getTopProducts);

export default router;
