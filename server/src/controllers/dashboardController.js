import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import Customer from "../models/Customer.js";

export const getStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await Customer.countDocuments();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todaySales = await Sale.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        const sales = await Sale.find({});
        const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
        
        res.json({
            totalProducts,
            totalSales: todaySales,
            totalCustomers,
            totalRevenue,
            revenueGrowth: 12.5,
            salesGrowth: 8.3,
            customersGrowth: 5.7,
            productsGrowth: 3.2
        });
    } catch (error) {
        console.error("Error getting stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get stats",
            error: error.message
        });
    }
};

export const getRecentActivity = async (req, res) => {
    try {
        const recentSales = await Sale.find()
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
        
        if (activities.length === 0) {
            activities.push({
                id: 1,
                type: "info",
                message: "No recent sales. Start making sales!",
                time: "Just now",
                icon: "📢"
            });
        }
        
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

export const getTopProducts = async (req, res) => {
    try {
        const sales = await Sale.find().populate("items.product");
        
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
        
        if (topProducts.length === 0) {
            res.json([
                { name: "Sample Product 1", sales: 10, revenue: 100 },
                { name: "Sample Product 2", sales: 8, revenue: 80 },
                { name: "Sample Product 3", sales: 5, revenue: 50 }
            ]);
        } else {
            res.json(topProducts);
        }
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