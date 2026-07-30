// server/src/routes/auth.js
import express from 'express';
import {
    register,
    login,
    getCurrentUser,
    logout,
    updateProfile,
    updateSecurity,
    updateAppearance
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', auth, getCurrentUser);
router.post('/logout', auth, logout);
router.put('/profile', auth, updateProfile);
router.put('/security', auth, updateSecurity);
router.put('/appearance', auth, updateAppearance);

export default router;