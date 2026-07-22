/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
    FaUser,
    FaBell,
    FaLock,
    FaPalette,
    FaGlobe,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaSave,
    FaTimes,
    FaShieldAlt,
    FaDatabase,
    FaFileExport,
    FaFileImport,
    FaTrash,
    FaToggleOn,
    FaToggleOff,
    FaCheckCircle,
    FaExclamationTriangle,
    FaMoon,
    FaSun,
    FaDesktop,
    FaMobile,
    FaBuilding,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Fixed import - from AuthContext not AppContext
import toast from 'react-hot-toast';
import '../../styles/Settings.css';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        company: user?.company || '',
    });
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sales: true,
        inventory: true,
        marketing: false,
    });
    const [security, setSecurity] = useState({
        twoFactor: false,
        sessionTimeout: '30',
    });
    const [appearance, setAppearance] = useState({
        theme: 'dark',
        fontSize: 'medium',
        sidebarCollapsed: false,
    });

    // Handle profile update
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success('Profile updated successfully!');
            setLoading(false);
        }, 1000);
    };

    // Handle notifications update
    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${!notifications[key] ? 'enabled' : 'disabled'}`);
    };

    // Handle security update
    const handleSecurityUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success('Security settings updated!');
            setLoading(false);
        }, 1000);
    };

    // Handle appearance update
    const handleAppearanceUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success('Appearance settings updated!');
            setLoading(false);
        }, 1000);
    };

    // Handle data actions
    const handleExportData = () => {
        toast.success('Data export started. You will receive an email shortly.');
    };

    const handleImportData = () => {
        toast.info('Import functionality will be available soon.');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            toast.error('Account deletion request submitted. Please contact support.');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'security', label: 'Security', icon: FaLock },
        { id: 'appearance', label: 'Appearance', icon: FaPalette },
        { id: 'data', label: 'Data Management', icon: FaDatabase },
    ];

    return (
        <div className="settings-container">
            {/* Header */}
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account preferences and application settings</p>
            </div>

            <div className="settings-layout">
                {/* Sidebar */}
                <div className="settings-sidebar">
                    <div className="settings-user-card">
                        <div className="settings-user-avatar">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="settings-user-info">
                            <h3>{user?.name || 'User'}</h3>
                            <p>{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <nav className="settings-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="settings-content">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>
                                    <FaUser className="card-icon" />
                                    Profile Settings
                                </h2>
                                <p>Update your personal information and contact details</p>
                            </div>
                            <form onSubmit={handleProfileUpdate} className="settings-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <div className="input-wrapper">
                                            <FaUser className="input-icon" />
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <div className="input-wrapper">
                                            <FaEnvelope className="input-icon" />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <div className="input-wrapper">
                                            <FaPhone className="input-icon" />
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <div className="input-wrapper">
                                            <FaBuilding className="input-icon" />
                                            <input
                                                type="text"
                                                value={profileData.company}
                                                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                                placeholder="Enter your company name"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Address</label>
                                        <div className="input-wrapper">
                                            <FaMapMarkerAlt className="input-icon" />
                                            <input
                                                type="text"
                                                value={profileData.address}
                                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                placeholder="Enter your address"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="reset" className="btn-secondary">
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>
                                    <FaBell className="card-icon" />
                                    Notification Preferences
                                </h2>
                                <p>Choose what notifications you want to receive</p>
                            </div>
                            <div className="notification-list">
                                <div className="notification-item">
                                    <div className="notification-info">
                                        <h4>Email Notifications</h4>
                                        <p>Receive notifications via email</p>
                                    </div>
                                    <button
                                        className={`toggle-btn ${notifications.email ? 'active' : ''}`}
                                        onClick={() => handleNotificationToggle('email')}
                                    >
                                        {notifications.email ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                </div>
                                <div className="notification-item">
                                    <div className="notification-info">
                                        <h4>Push Notifications</h4>
                                        <p>Receive notifications in your browser</p>
                                    </div>
                                    <button
                                        className={`toggle-btn ${notifications.push ? 'active' : ''}`}
                                        onClick={() => handleNotificationToggle('push')}
                                    >
                                        {notifications.push ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                </div>
                                <div className="notification-item">
                                    <div className="notification-info">
                                        <h4>Sales Updates</h4>
                                        <p>Get notified about new sales and orders</p>
                                    </div>
                                    <button
                                        className={`toggle-btn ${notifications.sales ? 'active' : ''}`}
                                        onClick={() => handleNotificationToggle('sales')}
                                    >
                                        {notifications.sales ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                </div>
                                <div className="notification-item">
                                    <div className="notification-info">
                                        <h4>Inventory Alerts</h4>
                                        <p>Get notified about low stock levels</p>
                                    </div>
                                    <button
                                        className={`toggle-btn ${notifications.inventory ? 'active' : ''}`}
                                        onClick={() => handleNotificationToggle('inventory')}
                                    >
                                        {notifications.inventory ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                </div>
                                <div className="notification-item">
                                    <div className="notification-info">
                                        <h4>Marketing Updates</h4>
                                        <p>Receive promotions and product updates</p>
                                    </div>
                                    <button
                                        className={`toggle-btn ${notifications.marketing ? 'active' : ''}`}
                                        onClick={() => handleNotificationToggle('marketing')}
                                    >
                                        {notifications.marketing ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>
                                    <FaLock className="card-icon" />
                                    Security Settings
                                </h2>
                                <p>Manage your account security preferences</p>
                            </div>
                            <form onSubmit={handleSecurityUpdate} className="settings-form">
                                <div className="security-section">
                                    <h3>Password</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Current Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter current password"
                                                className="security-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter new password"
                                                className="security-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Confirm New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                className="security-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="security-section">
                                    <h3>Two-Factor Authentication</h3>
                                    <div className="two-factor-option">
                                        <div className="two-factor-info">
                                            <p>Add an extra layer of security to your account</p>
                                            <span className="status-badge">
                                                {security.twoFactor ? (
                                                    <><FaCheckCircle /> Enabled</>
                                                ) : (
                                                    <><FaExclamationTriangle /> Disabled</>
                                                )}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className={`toggle-btn ${security.twoFactor ? 'active' : ''}`}
                                            onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                                        >
                                            {security.twoFactor ? <FaToggleOn /> : <FaToggleOff />}
                                        </button>
                                    </div>
                                </div>
                                <div className="security-section">
                                    <h3>Session Timeout</h3>
                                    <div className="form-group">
                                        <label>Automatically log out after inactivity</label>
                                        <select
                                            value={security.sessionTimeout}
                                            onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                                            className="security-select"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                            <option value="0">Never</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>
                                    <FaPalette className="card-icon" />
                                    Appearance Settings
                                </h2>
                                <p>Customize the look and feel of your dashboard</p>
                            </div>
                            <form onSubmit={handleAppearanceUpdate} className="settings-form">
                                <div className="appearance-section">
                                    <h3>Theme</h3>
                                    <div className="theme-options">
                                        <button
                                            type="button"
                                            className={`theme-option ${appearance.theme === 'light' ? 'active' : ''}`}
                                            onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                                        >
                                            <FaSun /> Light
                                        </button>
                                        <button
                                            type="button"
                                            className={`theme-option ${appearance.theme === 'dark' ? 'active' : ''}`}
                                            onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                                        >
                                            <FaMoon /> Dark
                                        </button>
                                        <button
                                            type="button"
                                            className={`theme-option ${appearance.theme === 'system' ? 'active' : ''}`}
                                            onClick={() => setAppearance({ ...appearance, theme: 'system' })}
                                        >
                                            <FaDesktop /> System
                                        </button>
                                    </div>
                                </div>
                                <div className="appearance-section">
                                    <h3>Font Size</h3>
                                    <div className="font-options">
                                        <button
                                            type="button"
                                            className={`font-option ${appearance.fontSize === 'small' ? 'active' : ''}`}
                                            onClick={() => setAppearance({ ...appearance, fontSize: 'small' })}
                                        >
                                            Small
                                        </button>
                                        <button
                                            type="button"
                                            className={`font-option ${appearance.fontSize === 'medium' ? 'active' : ''}`}
                                            onClick={() => setAppearance({ ...appearance, fontSize: 'medium' })}
                                        >
                                            Medium
                                        </button>
                                        <button
                                            type="button"
                                            className={`font-option ${appearance.fontSize === 'large' ? 'active' : ''}`}
                                            onClick={() => setAppearance({ ...appearance, fontSize: 'large' })}
                                        >
                                            Large
                                        </button>
                                    </div>
                                </div>
                                <div className="appearance-section">
                                    <h3>Sidebar</h3>
                                    <div className="form-group">
                                        <label>Default sidebar state</label>
                                        <select
                                            value={appearance.sidebarCollapsed ? 'collapsed' : 'expanded'}
                                            onChange={(e) => setAppearance({ ...appearance, sidebarCollapsed: e.target.value === 'collapsed' })}
                                            className="appearance-select"
                                        >
                                            <option value="expanded">Expanded</option>
                                            <option value="collapsed">Collapsed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Data Management Tab */}
                    {activeTab === 'data' && (
                        <div className="settings-card">
                            <div className="settings-card-header">
                                <h2>
                                    <FaDatabase className="card-icon" />
                                    Data Management
                                </h2>
                                <p>Manage your data and export/import options</p>
                            </div>
                            <div className="data-section">
                                <div className="data-option">
                                    <div className="data-option-info">
                                        <FaFileExport className="data-icon" />
                                        <div>
                                            <h4>Export Data</h4>
                                            <p>Export all your data as a CSV file</p>
                                        </div>
                                    </div>
                                    <button onClick={handleExportData} className="btn-export-data">
                                        <FaFileExport /> Export
                                    </button>
                                </div>
                                <div className="data-option">
                                    <div className="data-option-info">
                                        <FaFileImport className="data-icon" />
                                        <div>
                                            <h4>Import Data</h4>
                                            <p>Import data from a CSV file</p>
                                        </div>
                                    </div>
                                    <button onClick={handleImportData} className="btn-import-data">
                                        <FaFileImport /> Import
                                    </button>
                                </div>
                                <div className="data-option danger">
                                    <div className="data-option-info">
                                        <FaTrash className="data-icon" />
                                        <div>
                                            <h4>Delete Account</h4>
                                            <p>Permanently delete your account and all data</p>
                                        </div>
                                    </div>
                                    <button onClick={handleDeleteAccount} className="btn-delete-account">
                                        <FaTrash /> Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;