/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaHistory,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaCashRegister,
  FaChevronDown,
  FaBell,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import "../../styles/Sidebar.css";

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [notifications, setNotifications] = useState([]);

  // Track window size for responsive overlay behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch real-time notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        const data = response.data?.data || response.data || [];
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        // Silent fail - notifications are non-critical
        console.warn("Notifications endpoint not available");
        setNotifications([]);
      }
    };

    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const notificationCount = notifications.length;

  const menuSections = [
    {
      title: "Overview",
      items: [
        { path: "/dashboard", icon: FaHome, label: "Dashboard" },
        { path: "/analytics", icon: FaChartLine, label: "Analytics" },
      ],
    },
    {
      title: "Catalog",
      items: [
        { path: "/inventory", icon: FaBox, label: "Inventory" },
        { path: "/products", icon: FaSearch, label: "Product Search" },
      ],
    },
    {
      title: "Sales",
      items: [
        {
          path: "/sales",
          icon: FaCashRegister,
          label: "New Sale",
          badge: "POS",
        },
        { path: "/sales-history", icon: FaHistory, label: "Sales History" },
      ],
    },
    {
      title: "Contacts",
      items: [{ path: "/customers", icon: FaUsers, label: "Customers" }],
    },
    {
      title: "Configuration",
      items: [{ path: "/settings", icon: FaCog, label: "Settings" }],
    },
  ];

  // Flatten items for stagger index
  let itemIndex = 0;

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    setShowUserMenu(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getUserName = () => {
    if (!user || !user.name) return "User";
    return user.name;
  };

  const getUserRole = () => {
    return user?.role || "Business Owner";
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const isCollapsed = !sidebarOpen;

  return (
    <>
      {/* Overlay for mobile ONLY */}
      {sidebarOpen && isMobile && (
        <div className="sb-overlay" onClick={closeSidebar} />
      )}

      <aside className={`sb ${sidebarOpen ? "sb--open" : "sb--closed"}`}>
        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-brand-icon">
            <FaBox className="sb-brand-logo" />
            <div className="sb-brand-glow" />
          </div>
          <div className="sb-brand-text">
            <h1>SmartBiz</h1>
            <p>Business Suite</p>
          </div>

          {/* Mobile close button */}
          <button
            className="sb-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Desktop toggle button */}
        <button
          className="sb-toggle"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse" : "Expand"}
        >
          <span className="sb-toggle-icon">
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </span>
        </button>

        {/* Navigation */}
        <nav className="sb-nav">
          {menuSections.map((section, sectionIdx) => (
            <div
              key={section.title}
              className="sb-section"
              style={{ animationDelay: `${sectionIdx * 60}ms` }}
            >
              <div className="sb-section-title">{section.title}</div>
              <div className="sb-section-divider" />

              {section.items.map((item) => {
                const Icon = item.icon;
                const currentIdx = itemIndex++;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `sb-link ${isActive ? "sb-link--active" : ""}`
                    }
                    data-tooltip={item.label}
                    style={{ animationDelay: `${currentIdx * 40 + 100}ms` }}
                  >
                    <div className="sb-link-icon">
                      <Icon />
                    </div>
                    <span className="sb-link-label">{item.label}</span>
                    {item.badge && (
                      <span className="sb-link-badge">{item.badge}</span>
                    )}
                    {item.badge && <span className="sb-link-dot" />}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile Block */}
        <div className="sb-user-block">
          <button
            className={`sb-user-card ${
              showUserMenu ? "sb-user-card--active" : ""
            }`}
            onClick={() => setShowUserMenu(!showUserMenu)}
            data-tooltip={getUserName()}
          >
            <div className="sb-avatar">
              {getInitials()}
              <div className="sb-avatar-status" />
            </div>
            <div className="sb-user-info">
              <div className="sb-user-name">{getUserName()}</div>
              <div className="sb-user-role">{getUserRole()}</div>
            </div>
            <FaChevronDown
              className={`sb-user-chevron ${
                showUserMenu ? "sb-user-chevron--open" : ""
              }`}
            />
          </button>

          {isCollapsed && !isMobile && (
            <button
              className="sb-logout-btn"
              onClick={handleLogout}
              title="Sign out"
              data-tooltip="Sign out"
            >
              <FaSignOutAlt />
            </button>
          )}

          {showUserMenu && !isCollapsed && (
            <div className="sb-user-menu">
              <button className="sb-menu-item">
                <FaBell />
                Notifications
                {notificationCount > 0 && (
                  <span className="sb-menu-badge">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </button>
              <button
                className="sb-menu-item sb-menu-item--danger"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;