import { FaBars, FaBell } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Header.css";

const Header = () => {
    const { sidebarOpen, setSidebarOpen } = useAppContext();
    const { user } = useAuth();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Get user initials from name
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

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <FaBars size={20} />
                </button>
                <div className="header-search">
                    <input type="text" placeholder="Search products..." />
                </div>
            </div>
            <div className="header-right">
                <button className="notification-btn">
                    <FaBell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <div className="user-profile">
                    <div className="user-avatar">{getUserInitials()}</div>
                    <span className="user-name">{getUserName()}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;