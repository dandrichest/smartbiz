import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaChartLine,
    FaCog,
    FaSignOutAlt,
    FaHistory,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Sidebar.css";

const Sidebar = () => {
    const { sidebarOpen, setSidebarOpen } = useAppContext();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: "/dashboard", icon: FaHome, label: "Dashboard" },
        { path: "/inventory", icon: FaBox, label: "Inventory" },
        { path: "/products", icon: FaShoppingCart, label: "Products" },
        { path: "/customers", icon: FaUsers, label: "Customers" },
        { path: "/sales", icon: FaShoppingCart, label: "New Sale" },
        { path: "/sales-history", icon: FaHistory, label: "Sales History" },
        { path: "/analytics", icon: FaChartLine, label: "Analytics" },
        { path: "/settings", icon: FaCog, label: "Settings" }, // Settings link added
    ];

    const handleLogout = () => {
        logout();
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Close sidebar on mobile when a link is clicked
    const handleLinkClick = () => {
        if (window.innerWidth <= 992) {
            setSidebarOpen(false);
        }
    };

    // Close sidebar
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Get user display name
    const getUserName = () => {
        if (!user || !user.name) return "User";
        return user.name;
    };

    return (
        <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="sidebar-overlay active" 
                    onClick={closeSidebar}
                    style={{
                        backdropFilter: 'none',
                        WebkitBackdropFilter: 'none',
                        filter: 'none'
                    }}
                />
            )}
            
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-content">
                    <div className="sidebar-brand">
                        <div className="brand-icon">SB</div>
                        <div className={`brand-text ${sidebarOpen ? '' : 'hidden'}`}>
                            <h1>SmartBiz</h1>
                            <p>{getUserName()}</p>
                        </div>
                        {/* Close button - visible on mobile */}
                        <button 
                            className="sidebar-close-btn"
                            onClick={closeSidebar}
                            aria-label="Close sidebar"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Sidebar Toggle Button - Desktop Only */}
                    <button 
                        className="sidebar-toggle-btn"
                        onClick={toggleSidebar}
                        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
                    </button>

                    <nav className="sidebar-nav">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={handleLinkClick}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <item.icon className="sidebar-icon" />
                                <span className={`sidebar-label ${sidebarOpen ? '' : 'hidden'}`}>
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="sidebar-bottom">
                        <button onClick={handleLogout} className="sidebar-link">
                            <FaSignOutAlt className="sidebar-icon" />
                            <span className={`sidebar-label ${sidebarOpen ? '' : 'hidden'}`}>
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;