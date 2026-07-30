/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaExclamationTriangle, 
    FaTimes, 
    FaBox, 
    FaEye,
    FaEdit,
    FaShoppingCart,
    FaSync,
    FaCheckCircle
} from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import api from '../../api';
import toast from 'react-hot-toast';
import '../../styles/LowStockAlert.css';

const LowStockAlert = () => {
    const navigate = useNavigate();
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);
    const { setLoading: setGlobalLoading } = useAppContext();
    const intervalRef = useRef(null);

    const fetchLowStockData = useCallback(async () => {
        try {
            setIsLoading(true);
            setGlobalLoading(true);
            setError(null);
            
            const [lowStockRes, outOfStockRes] = await Promise.all([
                api.get('/alerts/low-stock?threshold=10'),
                api.get('/alerts/out-of-stock')
            ]);

            setLowStockProducts(lowStockRes.data.data || []);
            setOutOfStockProducts(outOfStockRes.data.data || []);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching low stock data:', error);
            setError('Failed to load stock alerts');
            // Only show toast for manual refresh, not auto-refresh
        } finally {
            setIsLoading(false);
            setGlobalLoading(false);
        }
    }, [setGlobalLoading]);

    const handleRefresh = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const [lowStockRes, outOfStockRes] = await Promise.all([
                api.get('/alerts/low-stock?threshold=10'),
                api.get('/alerts/out-of-stock')
            ]);

            setLowStockProducts(lowStockRes.data.data || []);
            setOutOfStockProducts(outOfStockRes.data.data || []);
            setLastUpdated(new Date());
            toast.success('Stock alerts refreshed!');
        } catch (error) {
            console.error('Error refreshing stock data:', error);
            setError('Failed to refresh stock alerts');
            toast.error('Failed to refresh stock alerts');
        } finally {
            setIsLoading(false);
        }
    }, []);

   
    useEffect(() => {
        fetchLowStockData();
    }, [fetchLowStockData]);

    
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        // Set up new interval
        intervalRef.current = setInterval(() => {
            fetchLowStockData();
        }, 30000);
        
        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [fetchLowStockData]); 

    
    const handleViewProduct = (productId) => {
        navigate(`/products?view=${productId}`);
    };

    const handleEditProduct = (productId) => {
        navigate(`/inventory?edit=${productId}`);
    };

  
    const handleReorder = async (productId, productName) => {
        try {
            // You can implement reorder logic here
            toast.success(`🔄 Reorder initiated for ${productName}`);
            // Optionally, you could open a modal or navigate to purchase order page
        } catch (error) {
            console.error('Error reordering:', error);
            toast.error('Failed to reorder product');
        }
    };

    // ✅ Handle close alerts
    const handleCloseAlerts = () => {
        setShowAlert(false);
        // Optionally, you could save this preference to localStorage
        localStorage.setItem('lowStockAlertDismissed', 'true');
    };

    // ✅ Handle show alerts again (if needed)
    const handleShowAlerts = () => {
        setShowAlert(true);
        localStorage.removeItem('lowStockAlertDismissed');
    };

    const totalAlerts = lowStockProducts.length + outOfStockProducts.length;

    // ✅ Check if alerts were dismissed previously
    useEffect(() => {
        const dismissed = localStorage.getItem('lowStockAlertDismissed');
        if (dismissed === 'true') {
            setShowAlert(false);
        }
    }, []);

    // ✅ If there are no alerts and we're not loading, show empty state
    if (totalAlerts === 0 && !isLoading) {
        return (
            <div className="low-stock-alert-container low-stock-empty-state">
                <div className="alert-header">
                    <div className="alert-title">
                        <FaCheckCircle className="alert-icon success" />
                        <h3>All Stock Levels Healthy</h3>
                    </div>
                    <div className="alert-actions">
                        {lastUpdated && (
                            <span className="alert-timestamp">
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                        <button 
                            className="alert-refresh" 
                            onClick={handleRefresh}
                            disabled={isLoading}
                            title="Refresh alerts"
                        >
                            <FaSync className={isLoading ? 'spinning' : ''} />
                        </button>
                    </div>
                </div>
                <div className="alert-body">
                    <div className="empty-state-content">
                        <div className="empty-icon">✅</div>
                        <p className="empty-title">All products have sufficient stock</p>
                        <p className="empty-subtitle">Your inventory levels are looking great!</p>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ If alerts are dismissed but there are alerts, show a collapsed state
    if (!showAlert && totalAlerts > 0) {
        return (
            <div className="low-stock-alert-container low-stock-collapsed">
                <div className="alert-header">
                    <div className="alert-title">
                        <FaExclamationTriangle className="alert-icon" />
                        <h3>Stock Alerts</h3>
                        <span className="alert-badge">{totalAlerts}</span>
                    </div>
                    <div className="alert-actions">
                        <button 
                            className="alert-show" 
                            onClick={handleShowAlerts}
                            title="Show alerts"
                        >
                            Show Alerts
                        </button>
                        <button 
                            className="alert-refresh" 
                            onClick={handleRefresh}
                            disabled={isLoading}
                            title="Refresh alerts"
                        >
                            <FaSync className={isLoading ? 'spinning' : ''} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Show loading state
    if (isLoading && totalAlerts === 0) {
        return (
            <div className="low-stock-alert-container">
                <div className="alert-header">
                    <div className="alert-title">
                        <FaExclamationTriangle className="alert-icon" />
                        <h3>Stock Alerts</h3>
                        <span className="alert-badge">Loading...</span>
                    </div>
                </div>
                <div className="alert-body">
                    <div className="loading-state-content">
                        <div className="loading-spinner"></div>
                        <p>Checking stock levels...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="low-stock-alert-container">
            <div className="alert-header">
                <div className="alert-title">
                    <FaExclamationTriangle className="alert-icon" />
                    <h3>Stock Alerts</h3>
                    <span className="alert-badge">{totalAlerts}</span>
                </div>
                <div className="alert-actions">
                    {lastUpdated && (
                        <span className="alert-timestamp">
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button 
                        className="alert-refresh" 
                        onClick={handleRefresh}
                        disabled={isLoading}
                        title="Refresh alerts"
                    >
                        <FaSync className={isLoading ? 'spinning' : ''} />
                    </button>
                    <button 
                        className="alert-close" 
                        onClick={handleCloseAlerts}
                        aria-label="Close alerts"
                        title="Close alerts"
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="alert-error">
                    <span>⚠️ {error}</span>
                    <button onClick={handleRefresh}>Retry</button>
                </div>
            )}

            <div className="alert-body">
                {/* Out of Stock - Critical */}
                {outOfStockProducts.length > 0 && (
                    <div className="alert-section critical">
                        <div className="section-header">
                            <span className="critical-dot">●</span>
                            <span className="section-title">Out of Stock</span>
                            <span className="section-count">{outOfStockProducts.length}</span>
                        </div>
                        <div className="product-list">
                            {outOfStockProducts.map(product => (
                                <div key={product._id} className="product-item critical">
                                    <div className="product-info">
                                        <FaBox className="product-icon" />
                                        <div className="product-details">
                                            <span className="product-name">{product.name}</span>
                                            <span className="product-sku">SKU: {product.sku || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="product-actions">
                                        <button 
                                            className="action-btn view" 
                                            title="View Product"
                                            onClick={() => handleViewProduct(product._id)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button 
                                            className="action-btn edit" 
                                            title="Edit Product"
                                            onClick={() => handleEditProduct(product._id)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="action-btn order" 
                                            title="Reorder"
                                            onClick={() => handleReorder(product._id, product.name)}
                                        >
                                            <FaShoppingCart />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Low Stock - Warning */}
                {lowStockProducts.length > 0 && (
                    <div className="alert-section warning">
                        <div className="section-header">
                            <span className="warning-dot">●</span>
                            <span className="section-title">Low Stock</span>
                            <span className="section-count">{lowStockProducts.length}</span>
                        </div>
                        <div className="product-list">
                            {lowStockProducts.map(product => (
                                <div key={product._id} className="product-item warning">
                                    <div className="product-info">
                                        <FaBox className="product-icon" />
                                        <div className="product-details">
                                            <span className="product-name">{product.name}</span>
                                            <span className="stock-count">
                                                {product.stockQuantity} units left
                                            </span>
                                        </div>
                                    </div>
                                    <div className="product-actions">
                                        <button 
                                            className="action-btn view" 
                                            title="View Product"
                                            onClick={() => handleViewProduct(product._id)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button 
                                            className="action-btn edit" 
                                            title="Edit Product"
                                            onClick={() => handleEditProduct(product._id)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="action-btn order" 
                                            title="Reorder"
                                            onClick={() => handleReorder(product._id, product.name)}
                                        >
                                            <FaShoppingCart />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LowStockAlert;