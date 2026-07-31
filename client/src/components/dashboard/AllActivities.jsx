/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const AllActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchAllActivities = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/dashboard/recent-activity');
            setActivities(response.data || []);
        } catch (error) {
            console.error('Error fetching activities:', error);
            toast.error('Failed to load activities');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllActivities();
    }, [fetchAllActivities]);

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || activity.type === filter;
        return matchesSearch && matchesFilter;
    });

    const clearSearch = () => setSearchTerm('');

    return (
        <div className="page-wrapper">
            {/* Page Header */}
            <div className="page-header-modern">
                <Link to="/dashboard" className="back-link">
                    <FaArrowLeft /> Back to Dashboard
                </Link>
                <h1>All Activities</h1>
                <span className="page-count">{filteredActivities.length} activities</span>
            </div>

            {/* Controls */}
            <div className="page-controls-modern">
                <div className="search-box-modern">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={clearSearch}>
                            <FaTimes />
                        </button>
                    )}
                </div>
                <div className="filter-box">
                    <FaFilter className="filter-icon" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Types</option>
                        <option value="sale">🛒 Sales</option>
                        <option value="product">📦 Products</option>
                        <option value="customer">👤 Customers</option>
                        <option value="alert">⚠️ Alerts</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="activity-card-skeleton" />
                    ))}
                </div>
            ) : filteredActivities.length === 0 ? (
                <div className="empty-state-modern">
                    <div className="empty-icon">📭</div>
                    <h3>No activities found</h3>
                    <p>Try adjusting your search or filter</p>
                </div>
            ) : (
                <div className="activities-grid-modern">
                    {filteredActivities.map((activity) => (
                        <div key={activity.id} className="activity-card-modern">
                            <div className="activity-icon-modern">{activity.icon}</div>
                            <div className="activity-content-modern">
                                <div className="activity-message-modern">{activity.message}</div>
                                <div className="activity-meta-modern">
                                    <span className={`activity-badge ${activity.type}`}>
                                        {activity.type || 'info'}
                                    </span>
                                    <span className="activity-time-modern">{activity.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllActivities;