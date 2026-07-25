import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

// Create a new sale
export const createSale = async (req, res) => {
    try {
        const { items, customerId, paymentMethod, total } = req.body;

        console.log('📝 Creating sale for user:', req.userId);
        console.log('📦 Sale data:', req.body);

        // Check stock for each item
        for (const item of items) {
            const product = await Product.findOne({ 
                _id: item.productId, 
                createdBy: req.userId 
            });
            if (!product) {
                return res.status(404).json({ 
                    success: false,
                    message: `Product not found: ${item.productId}` 
                });
            }
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ 
                    success: false,
                    message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}` 
                });
            }
        }

        // Calculate total if not provided
        const calculatedTotal = total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create sale
        const sale = new Sale({
            receiptNumber: `INV-${Date.now()}`,
            items: items.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            customer: customerId || null,
            total: calculatedTotal,
            paymentMethod: paymentMethod || 'cash',
            status: 'completed',
            createdBy: req.userId
        });

        await sale.save();

        // Update product stock
        for (const item of items) {
            await Product.findOneAndUpdate(
                { _id: item.productId, createdBy: req.userId },
                { $inc: { stockQuantity: -item.quantity } }
            );
        }

        // Update customer stats
        if (customerId) {
            await Customer.findOneAndUpdate(
                { _id: customerId, createdBy: req.userId },
                { $inc: { purchaseCount: 1, totalSpent: calculatedTotal } }
            );
        }

        const populatedSale = await Sale.findById(sale._id)
            .populate('customer', 'name email phone')
            .populate('items.product', 'name price sku');

        res.status(201).json({
            success: true,
            message: 'Sale created successfully',
            data: populatedSale
        });
    } catch (error) {
        console.error('❌ Error creating sale:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create sale',
            error: error.message
        });
    }
};

// Record sale (alias for createSale)
export const recordSale = createSale;

// Get all sales with filters
export const getSales = async (req, res) => {
    try {
        console.log('📋 Fetching sales for user:', req.userId);
        console.log('📦 Query params:', req.query);

        const { startDate, endDate, paymentMethod, customerId, search } = req.query;
        const filter = { createdBy: req.userId };

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        
        // Payment method filter
        if (paymentMethod) filter.paymentMethod = paymentMethod;
        
        // Customer filter
        if (customerId) filter.customer = customerId;

        let salesQuery = Sale.find(filter)
            .populate('customer', 'name email phone')
            .populate('items.product', 'name price sku')
            .sort({ createdAt: -1 });

        // Search filter (receipt number or customer name)
        if (search && search.trim()) {
            const searchLower = search.toLowerCase();
            const sales = await salesQuery;
            
            const filteredSales = sales.filter(sale => {
                const customerName = sale.customer 
                    ? (sale.customer.name || '').toLowerCase()
                    : 'walk-in customer';
                const receiptMatch = sale.receiptNumber?.toLowerCase().includes(searchLower);
                const customerMatch = customerName.includes(searchLower);
                return receiptMatch || customerMatch;
            });
            
            console.log(`✅ Found ${filteredSales.length} sales (with search)`);
            
            return res.json({
                success: true,
                count: filteredSales.length,
                data: filteredSales
            });
        }

        const sales = await salesQuery;
        console.log(`✅ Found ${sales.length} sales`);

        res.json({
            success: true,
            count: sales.length,
            data: sales
        });
    } catch (error) {
        console.error('❌ Error fetching sales:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sales',
            error: error.message
        });
    }
};

// Get sales history - alias for getSales
export const getSalesHistory = getSales;

// Get single sale by ID
export const getSaleById = async (req, res) => {
    try {
        console.log('📋 Fetching sale by ID:', req.params.id);

        const sale = await Sale.findOne({ 
            _id: req.params.id, 
            createdBy: req.userId 
        })
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
        console.error('❌ Error fetching sale:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sale',
            error: error.message
        });
    }
};

// Generate receipt for a sale
export const generateReceipt = async (req, res) => {
    try {
        console.log('📋 Generating receipt for sale:', req.params.id);

        const sale = await Sale.findOne({ 
            _id: req.params.id, 
            createdBy: req.userId 
        })
            .populate('customer', 'name email phone address')
            .populate('items.product', 'name price sku');

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found'
            });
        }

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
            paymentMethod: sale.paymentMethod,
            status: sale.status
        };

        res.json({
            success: true,
            data: receipt
        });
    } catch (error) {
        console.error('❌ Error generating receipt:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate receipt',
            error: error.message
        });
    }
};

// Get sales summary
export const getSalesSummary = async (req, res) => {
    try {
        const userId = req.userId;
        
        const summary = await Sale.aggregate([
            { $match: { createdBy: userId } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                    averageOrderValue: { $avg: '$total' }
                }
            }
        ]);

        // Get today's sales
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaySales = await Sale.find({
            createdBy: userId,
            createdAt: { $gte: today, $lt: tomorrow }
        });

        res.json({
            success: true,
            data: {
                totalSales: summary[0]?.totalSales || 0,
                totalRevenue: summary[0]?.totalRevenue || 0,
                averageOrderValue: summary[0]?.averageOrderValue || 0,
                todaySales: todaySales.length
            }
        });
    } catch (error) {
        console.error('❌ Error fetching sales summary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sales summary',
            error: error.message
        });
    }
};

// Delete a sale
export const deleteSale = async (req, res) => {
    try {
        console.log('🗑️ Deleting sale:', req.params.id);

        const sale = await Sale.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.userId
        });

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found'
            });
        }

        // Restore product stock
        for (const item of sale.items) {
            await Product.findOneAndUpdate(
                { _id: item.productId, createdBy: req.userId },
                { $inc: { stockQuantity: item.quantity } }
            );
        }

        res.json({
            success: true,
            message: 'Sale deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting sale:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete sale',
            error: error.message
        });
    }
};