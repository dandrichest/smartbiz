/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaDollarSign,
    FaArrowUp,
    FaArrowDown,
    FaPlus,
    FaUserPlus,
    FaClock,
    FaBell,
    FaStar,
    FaShoppingBag,
    FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
// Make sure this import path is correct
import "../../styles/Dashboard.css";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const { setLoading: setGlobalLoading } = useAppContext();
    const { user } = useAuth();

    // Get user initials
    const getUserInitials = () => {
        if (!user || !user.name) return "U";
        const nameParts = user.name.split(" ");
        if (nameParts.length >= 2) {
            return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        }
        return nameParts[0][0].toUpperCase();
    };

    // Get user display name
    const getUserName = () => {
        if (!user || !user.name) return "User";
        return user.name;
    };

    // Demo data
    const stats = {
        totalProducts: 156,
        totalSales: 43,
        totalCustomers: 89,
        totalRevenue: 12450,
        revenueGrowth: 12.5,
        salesGrowth: 8.3,
        customersGrowth: 5.7,
        productsGrowth: 3.2,
    };

    const recentActivities = [
        {
            id: 1,
            type: "sale",
            message: "New sale #INV-001 by John Doe",
            time: "2 minutes ago",
            icon: "🛒",
        },
        {
            id: 2,
            type: "product",
            message: 'Product "Silk Fabric" added to inventory',
            time: "15 minutes ago",
            icon: "📦",
        },
        {
            id: 3,
            type: "customer",
            message: "New customer Jane Smith registered",
            time: "1 hour ago",
            icon: "👤",
        },
        {
            id: 4,
            type: "sale",
            message: "Sale #INV-002 completed for $245.50",
            time: "3 hours ago",
            icon: "💰",
        },
        {
            id: 5,
            type: "alert",
            message: "Low stock alert: Cotton Thread (5 units left)",
            time: "5 hours ago",
            icon: "⚠️",
        },
    ];

    const topProducts = [
        { name: "Premium Cotton Fabric", sales: 45, revenue: 720 },
        { name: "Silk Blend Fabric", sales: 30, revenue: 900 },
        { name: "Leather Wallet", sales: 25, revenue: 625 },
        { name: "Sewing Machine", sales: 10, revenue: 2000 },
        { name: "Cotton Thread", sales: 60, revenue: 300 },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const statsData = [
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: FaBox,
            color: "blue",
            growth: stats.productsGrowth,
            subtitle: "Available items",
        },
        {
            title: "Today's Sales",
            value: stats.totalSales,
            icon: FaShoppingCart,
            color: "green",
            growth: stats.salesGrowth,
            subtitle: "Today's orders",
        },
        {
            title: "Total Customers",
            value: stats.totalCustomers,
            icon: FaUsers,
            color: "purple",
            growth: stats.customersGrowth,
            subtitle: "Active users",
        },
        {
            title: "Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: FaDollarSign,
            color: "gold",
            growth: stats.revenueGrowth,
            subtitle: "This month",
        },
    ];

    if (loading) {
        return (
            <div className="dashboard-wrapper">
                <div className="stats-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="stat-card loading-skeleton"
                            style={{ height: "120px" }}
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            {/* Header - Remove duplicate user profile */}
            <div className="dashboard-header">
                <div className="greeting">
                    <h1>👋 Welcome back, {getUserName()}!</h1>
                    <p>Here's what's happening with your business today</p>
                </div>
                {/* Remove this duplicate section - the user profile is already in the main header */}
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {statsData.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-top">
                            <div>
                                <div className="stat-title">{stat.title}</div>
                                <div className="stat-value">{stat.value}</div>
                            </div>
                            <div className={`stat-icon-wrap ${stat.color}`}>
                                <stat.icon />
                            </div>
                        </div>
                        <div className="stat-bottom">
                            <span
                                className={`stat-trend ${stat.growth >= 0 ? "up" : "down"}`}
                            >
                                {stat.growth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                {Math.abs(stat.growth)}%
                            </span>
                            <span className="stat-sub">{stat.subtitle}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Activity & Products */}
            <div className="dashboard-grid">
                {/* Recent Activity */}
                <div className="card">
                    <div className="card-header">
                        <h3>
                            <FaClock color="#4f46e5" /> Recent Activity
                        </h3>
                        <button className="view-all">View All →</button>
                    </div>
                    <div className="activity-list">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-icon">{activity.icon}</div>
                                <div className="activity-content">
                                    <div className="message">{activity.message}</div>
                                    <div className="time">{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="card">
                    <div className="card-header">
                        <h3>
                            <FaStar color="#f59e0b" /> Top Products
                        </h3>
                        <button className="view-all">View All →</button>
                    </div>
                    <div className="products-list">
                        {topProducts.map((product, index) => {
                            const maxRevenue = Math.max(
                                ...topProducts.map((p) => p.revenue || 0),
                            );
                            const percentage =
                                maxRevenue > 0 ? (product.revenue / maxRevenue) * 100 : 0;
                            const colors = [
                                "#4f46e5",
                                "#059669",
                                "#d97706",
                                "#7c3aed",
                                "#dc2626",
                            ];

                            return (
                                <div key={index} className="product-item">
                                    <div className="product-row">
                                        <span className="product-name">{product.name}</span>
                                        <div className="product-meta">
                                            <span>{product.sales || 0} sales</span>
                                            <span className="revenue">
                                                {formatCurrency(product.revenue || 0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="product-bar">
                                        <div
                                            className="product-bar-fill"
                                            style={{
                                                width: `${Math.min(percentage, 100)}%`,
                                                background: colors[index % colors.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card quick-actions-card">
                <div className="card-header">
                    <h3>
                        <FaShoppingBag color="#4f46e5" /> Quick Actions
                    </h3>
                </div>
                <div className="quick-actions">
                    <Link to="/inventory" className="quick-action">
                        <div className="quick-action-icon blue">
                            <FaPlus />
                        </div>
                        <span className="quick-action-label">Add Product</span>
                    </Link>
                    <Link to="/sales" className="quick-action">
                        <div className="quick-action-icon green">
                            <FaShoppingCart />
                        </div>
                        <span className="quick-action-label">New Sale</span>
                    </Link>
                    <Link to="/customers" className="quick-action">
                        <div className="quick-action-icon purple">
                            <FaUserPlus />
                        </div>
                        <span className="quick-action-label">Add Customer</span>
                    </Link>
                    <Link to="/analytics" className="quick-action">
                        <div className="quick-action-icon gold">
                            <FaChartLine />
                        </div>
                        <span className="quick-action-label">Analytics</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;