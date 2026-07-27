import { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import '../../styles/Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState(() => {
        // Initialize from localStorage during render
        try {
            const saved = localStorage.getItem('notifications');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch {
            // Ignore parse errors
        }
        return [];
    });
    const [showDropdown, setShowDropdown] = useState(false);

    // Calculate unread count from notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    // Save to localStorage whenever notifications change
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const getIcon = (type) => {
        switch(type) {
            case 'success': return <FaCheckCircle className="notif-icon success" />;
            case 'warning': return <FaExclamationTriangle className="notif-icon warning" />;
            default: return <FaInfoCircle className="notif-icon info" />;
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="notification-wrapper">
            <button 
                className="notification-btn"
                onClick={toggleDropdown}
                aria-label="Notifications"
            >
                <FaBell />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button className="mark-all-read" onClick={markAllRead}>
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                                    {getIcon(notif.type)}
                                    <div className="notification-content">
                                        <p>{notif.message}</p>
                                        <span>{notif.time}</span>
                                    </div>
                                    <button 
                                        className="remove-notif"
                                        onClick={() => removeNotification(notif.id)}
                                        aria-label="Remove notification"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;