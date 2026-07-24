// server/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Missing authorization header' 
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        
        // Set both user and userId for compatibility
        req.user = payload;
        req.userId = payload.id || payload.userId;
        
        console.log('✅ Auth successful for user:', req.userId);
        next();
    } catch (err) {
        console.error('❌ Auth failed:', err.message);
        return res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token' 
        });
    }
};

export default auth;