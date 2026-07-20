const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// Create a new sale
exports.createSale = async (req, res) => {
    try {
        const { items, customerId, paymentMethod, total } = req.body;

        // Validate items and update stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
        }

        // Create sale
        const sale = new Sale({
            items: items.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            customer: customerId || null,
            paymentMethod: paymentMethod || 'cash',
            total: total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            receiptNumber: `INV-${Date.now()}`
        });

        // Save sale
        await sale.save();

        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stockQuantity: -item.quantity }
            });
        }

        // Update customer purchase history
        if (customerId) {
            await Customer.findByIdAndUpdate(customerId, {
                $inc: { purchaseCount: 1, totalSpent: sale.total }
            });
        }

        res.status(201).json({
            success: true,
            message: 'Sale created successfully',
            data: sale
        });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create sale',
            error: error.message
        });
    }
};

// Get all sales with filters
exports.getSales = async (req, res) => {
    try {
        const { startDate, endDate, paymentMethod, customerId } = req.query;
        const filter = {};

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        if (paymentMethod) filter.paymentMethod = paymentMethod;
        if (customerId) filter.customer = customerId;

        const sales = await Sale.find(filter)
            .populate('customer', 'name email phone')
            .populate('items.product', 'name price sku')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: sales.length,
            data: sales
        });
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sales',
            error: error.message
        });
    }
};

// Get single sale by ID
exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('items.product', 'name price sku category');

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found'
            });
        }

        res.json({
            success: true,
            data: sale
        });
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sale',
            error: error.message
        });
    }
};

// Generate receipt for a sale
exports.generateReceipt = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('items.product', 'name price sku');

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found'
            });
        }

        // Format receipt
        const receipt = {
            receiptNumber: sale.receiptNumber,
            date: sale.createdAt,
            customer: sale.customer || { name: 'Walk-in Customer' },
            items: sale.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price
            })),
            total: sale.total,
            paymentMethod: sale.paymentMethod
        };

        res.json({
            success: true,
            data: receipt
        });
    } catch (error) {
        console.error('Error generating receipt:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate receipt',
            error: error.message
        });
    }
};

// Export sales to CSV
exports.exportSales = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = {};

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const sales = await Sale.find(filter)
            .populate('customer', 'name email')
            .populate('items.product', 'name');

        // Format data for CSV
        const csvData = sales.map(sale => ({
            'Receipt #': sale.receiptNumber,
            'Date': sale.createdAt.toISOString().split('T')[0],
            'Customer': sale.customer?.name || 'Walk-in',
            'Items': sale.items.length,
            'Total': sale.total.toFixed(2),
            'Payment': sale.paymentMethod
        }));

        res.json({
            success: true,
            data: csvData
        });
    } catch (error) {
        console.error('Error exporting sales:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export sales',
            error: error.message
        });
    }
};