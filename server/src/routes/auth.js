import express from 'express';
import { register, login, getCurrentUser, logout, updateProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (require authentication)
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);

export default router;