import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Notifications from "./Notifications";
import "../../styles/Header.css";

const Header = () => {
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const userMenuRef = useRef(null);

  // Track window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("header-search-input");
        if (searchInput) searchInput.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const navigateTo = (path) => {
    setShowUserMenu(false);
    navigate(path);
  };

  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    const nameParts = user.name.split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const getUserName = () => {
    if (!user || !user.name) return "User";
    return user.name;
  };

  const getUserEmail = () => {
    if (!user || !user.email) return "";
    return user.email;
  };

  const getUserRole = () => {
    return user?.role || "Business Owner";
  };

  return (
    <header className="hd">
      {/* Left Section */}
      <div className="hd-left">
        <button
          className="hd-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <FaBars />
        </button>

        {/* Search */}
        <form className="hd-search" onSubmit={handleSearchSubmit}>
          <FaSearch className="hd-search-icon" />
          <input
            id="header-search-input"
            type="text"
            placeholder="Search products, customers, sales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hd-search-input"
          />
          {searchQuery ? (
            <button
              type="button"
              className="hd-search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          ) : (
            !isMobile && (
              <div className="hd-search-shortcut">
                <kbd>⌘</kbd>
                <kbd>K</kbd>
              </div>
            )
          )}
        </form>
      </div>

      {/* Right Section */}
      <div className="hd-right">
        {/* Notifications */}
        <div className="hd-notif-wrap">
          <Notifications />
        </div>

        {/* Divider */}
        <div className="hd-divider" />

        {/* User Profile Dropdown */}
        <div className="hd-user-wrap" ref={userMenuRef}>
          <button
            className={`hd-user-btn ${showUserMenu ? "hd-user-btn--active" : ""}`}
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <div className="hd-avatar">
              {getUserInitials()}
              <div className="hd-avatar-status" />
            </div>
            <div className="hd-user-info">
              <span className="hd-user-name">{getUserName()}</span>
              <span className="hd-user-role">{getUserRole()}</span>
            </div>
            <FaChevronDown
              className={`hd-user-chevron ${
                showUserMenu ? "hd-user-chevron--open" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="hd-dropdown">
              {/* User info header */}
              <div className="hd-dropdown-header">
                <div className="hd-dropdown-avatar">
                  {getUserInitials()}
                  <div className="hd-avatar-status" />
                </div>
                <div className="hd-dropdown-info">
                  <div className="hd-dropdown-name">{getUserName()}</div>
                  {getUserEmail() && (
                    <div className="hd-dropdown-email">{getUserEmail()}</div>
                  )}
                  <div className="hd-dropdown-role-badge">{getUserRole()}</div>
                </div>
              </div>

              {/* Menu items */}
              <div className="hd-dropdown-menu">
                <button
                  className="hd-dropdown-item"
                  onClick={() => navigateTo("/settings")}
                >
                  <FaUser />
                  <span>My Profile</span>
                </button>
                <button
                  className="hd-dropdown-item"
                  onClick={() => navigateTo("/settings")}
                >
                  <FaCog />
                  <span>Settings</span>
                </button>
                <button
                  className="hd-dropdown-item"
                  onClick={() => window.open("/help", "_blank")}
                >
                  <FaQuestionCircle />
                  <span>Help & Support</span>
                </button>
              </div>

              <div className="hd-dropdown-divider" />

              <div className="hd-dropdown-menu">
                <button
                  className="hd-dropdown-item hd-dropdown-item--danger"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;