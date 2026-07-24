import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './DB/connection.js';
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/product.js';
import salesRoutes from './src/routes/sales.js';
import customerRoutes from './src/routes/customer.js';
import dashboardRoutes from './src/routes/dashboard.js';
import analyticsRoutes from './src/routes/analytics.js';
import notificationsRoutes from './src/routes/notifications.js';
import alertRoutes from './src/routes/alerts.js';
import reviewRoutes from './src/routes/reviews.js';
import testimonialRoutes from './src/routes/testimonials.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/alerts', alertRoutes); 
app.use('/api/reviews', reviewRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler for undefined routes
app.use((req, res) => {
    console.log(`❌ Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        message: `Route ${req.url} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
    
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Image is too large. Please use an image under 5MB.'
        });
    }
    
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Connect to DB and then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📡 API: http://localhost:${PORT}/api`);
        console.log('✅ Routes registered:');
        console.log('  - /api/auth');
        console.log('  - /api/products');
        console.log('  - /api/sales');
        console.log('  - /api/customers');
        console.log('  - /api/dashboard');
        console.log('  - /api/analytics');
        console.log('  - /api/notifications');
        console.log('  - /api/alerts');
    });
}).catch(err => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
});