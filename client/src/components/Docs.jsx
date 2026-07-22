/* eslint-disable no-unused-vars */
import { 
    FaBook, 
    FaSearch, 
    FaArrowRight, 
    FaBox, 
    FaShoppingCart, 
    FaUsers, 
    FaChartLine,
    FaCog,
    FaUserCog,
    FaShieldAlt,
    FaFileExport,
    FaFileImport,
    FaQuestionCircle,
    FaVideo,
    FaDownload,
    FaExternalLinkAlt,
    FaCheckCircle,
    FaRocket,
    FaStore,
    FaReceipt,
    FaWallet,
    FaDatabase
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Docs.css';

const Docs = () => {
    const currentYear = new Date().getFullYear();

    const docCategories = [
        {
            icon: FaRocket,
            title: "Getting Started",
            description: "Learn the basics of SmartBiz",
            items: [
                { title: "Create Your Account", link: "/docs/getting-started/account" },
                { title: "Set Up Your Profile", link: "/docs/getting-started/profile" },
                { title: "First Login Guide", link: "/docs/getting-started/login" },
                { title: "Dashboard Overview", link: "/docs/getting-started/dashboard" },
            ]
        },
        {
            icon: FaBox,
            title: "Inventory Management",
            description: "Manage your products and stock",
            items: [
                { title: "Add New Products", link: "/docs/inventory/add-product" },
                { title: "Manage Stock Levels", link: "/docs/inventory/stock" },
                { title: "Product Categories", link: "/docs/inventory/categories" },
                { title: "Bulk Import/Export", link: "/docs/inventory/bulk" },
            ]
        },
        {
            icon: FaShoppingCart,
            title: "Sales Management",
            description: "Process sales and orders",
            items: [
                { title: "Create a New Sale", link: "/docs/sales/create" },
                { title: "Manage Cart", link: "/docs/sales/cart" },
                { title: "Payment Methods", link: "/docs/sales/payment" },
                { title: "Sales History", link: "/docs/sales/history" },
            ]
        },
        {
            icon: FaUsers,
            title: "Customer Management",
            description: "Manage customer relationships",
            items: [
                { title: "Add Customers", link: "/docs/customers/add" },
                { title: "Customer Profiles", link: "/docs/customers/profiles" },
                { title: "Purchase History", link: "/docs/customers/history" },
                { title: "Customer Analytics", link: "/docs/customers/analytics" },
            ]
        },
        {
            icon: FaChartLine,
            title: "Analytics & Reports",
            description: "Track business performance",
            items: [
                { title: "Sales Analytics", link: "/docs/analytics/sales" },
                { title: "Revenue Reports", link: "/docs/analytics/revenue" },
                { title: "Customer Insights", link: "/docs/analytics/customers" },
                { title: "Export Reports", link: "/docs/analytics/export" },
            ]
        },
        {
            icon: FaCog,
            title: "Settings & Preferences",
            description: "Customize your experience",
            items: [
                { title: "Profile Settings", link: "/docs/settings/profile" },
                { title: "Notification Preferences", link: "/docs/settings/notifications" },
                { title: "Security Settings", link: "/docs/settings/security" },
                { title: "Appearance Settings", link: "/docs/settings/appearance" },
            ]
        },
    ];

    const quickLinks = [
        { icon: FaQuestionCircle, label: "FAQ", link: "/faq", color: "#4f46e5" },
        { icon: FaVideo, label: "Video Tutorials", link: "/videos", color: "#10b981" },
        { icon: FaDownload, label: "API Documentation", link: "/docs/api", color: "#f59e0b" },
        { icon: FaExternalLinkAlt, label: "Community Forum", link: "/community", color: "#8b5cf6" },
    ];

    return (
        <div className="docs-container">
            <div className="docs-card">
                <div className="docs-header">
                    <div className="docs-header-icon">
                        <FaBook />
                    </div>
                    <h1>Documentation</h1>
                    <p>Everything you need to know about SmartBiz</p>
                </div>

                {/* Search Bar */}
                <div className="docs-search">
                    <div className="docs-search-wrapper">
                        <FaSearch className="docs-search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search documentation..."
                            className="docs-search-input"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="docs-quick-links">
                    {quickLinks.map((link, index) => (
                        <Link key={index} to={link.link} className="docs-quick-link">
                            <div className="quick-link-icon" style={{ background: link.color + '20', color: link.color }}>
                                <link.icon />
                            </div>
                            <span>{link.label}</span>
                            <FaArrowRight className="quick-link-arrow" />
                        </Link>
                    ))}
                </div>

                {/* Categories */}
                <div className="docs-categories">
                    {docCategories.map((category, index) => (
                        <div key={index} className="docs-category">
                            <div className="docs-category-header">
                                <div className="docs-category-icon">
                                    <category.icon />
                                </div>
                                <div>
                                    <h2>{category.title}</h2>
                                    <p>{category.description}</p>
                                </div>
                            </div>
                            <ul className="docs-category-list">
                                {category.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <Link to={item.link}>
                                            <FaCheckCircle className="item-check" />
                                            {item.title}
                                            <FaArrowRight className="item-arrow" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="docs-help-section">
                    <div className="docs-help-content">
                        <div className="docs-help-icon">
                            <FaQuestionCircle />
                        </div>
                        <div>
                            <h3>Still need help?</h3>
                            <p>Can't find what you're looking for? Contact our support team.</p>
                        </div>
                        <Link to="/support" className="docs-help-btn">
                            Contact Support →
                        </Link>
                    </div>
                </div>

                <div className="docs-footer">
                    <p>© {currentYear} SmartBiz Documentation. All rights reserved.</p>
                    <div className="docs-footer-links">
                        <Link to="/privacy">Privacy</Link>
                        <span>|</span>
                        <Link to="/terms">Terms</Link>
                        <span>|</span>
                        <Link to="/support">Support</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Docs;