import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import Customer from '../models/Customer.js';

// Get dashboard stats for the current user
export const getStats = async (req, res) => {
    try {
        console.log('📊 Fetching dashboard stats for user:', req.userId);

        const totalProducts = await Product.countDocuments({ createdBy: req.userId });
        const totalCustomers = await Customer.countDocuments({ createdBy: req.userId });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todaySales = await Sale.countDocuments({
            createdBy: req.userId,
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        const sales = await Sale.find({ createdBy: req.userId });
        const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);

        const response = {
            totalProducts: totalProducts || 0,
            totalSales: todaySales || 0,
            totalCustomers: totalCustomers || 0,
            totalRevenue: totalRevenue || 0,
            revenueGrowth: 0,
            salesGrowth: 0,
            customersGrowth: 0,
            productsGrowth: 0
        };

        console.log('📊 Stats response:', response);
        res.json(response);
    } catch (error) {
        console.error("Error getting stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get stats",
            error: error.message
        });
    }
};

// Get recent activity for the current user
export const getRecentActivity = async (req, res) => {
    try {
        console.log('📋 Fetching recent activity for user:', req.userId);

        const recentSales = await Sale.find({ createdBy: req.userId })
            .populate("customer", "name")
            .populate("items.product", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        const activities = recentSales.map((sale) => ({
            id: sale._id,
            type: "sale",
            message: `New sale #${sale.receiptNumber || "INV-" + sale._id} by ${sale.customer?.name || "Walk-in"}`,
            time: getTimeAgo(sale.createdAt),
            icon: "🛒"
        }));

        console.log('📋 Activities found:', activities.length);
        res.json(activities);
    } catch (error) {
        console.error("Error getting recent activity:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get recent activity",
            error: error.message
        });
    }
};

// Get top products for the current user
export const getTopProducts = async (req, res) => {
    try {
        console.log('🏆 Fetching top products for user:', req.userId);

        const sales = await Sale.find({ createdBy: req.userId }).populate("items.product");
        
        const productSales = {};
        sales.forEach((sale) => {
            sale.items.forEach((item) => {
                if (item.product) {
                    const productId = item.product._id.toString();
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            name: item.product.name,
                            sales: 0,
                            revenue: 0
                        };
                    }
                    productSales[productId].sales += item.quantity;
                    productSales[productId].revenue += item.quantity * item.price;
                }
            });
        });
        
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        console.log('🏆 Top products found:', topProducts.length);
        res.json(topProducts);
    } catch (error) {
        console.error("Error getting top products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get top products",
            error: error.message
        });
    }
};

function getTimeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 60000);
    
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
}