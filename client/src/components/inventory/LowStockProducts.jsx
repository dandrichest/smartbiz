import { FaExclamationTriangle, FaBox, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/LowStockProducts.css';

const LowStockProducts = ({ products = [], loading = false }) => {
    const navigate = useNavigate();

    // Get products with stock <= 10
    const lowStockProducts = products
        .filter(product => (product.stockQuantity || 0) <= 10)
        .sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0))
        .slice(0, 10);

    const getStockLevel = (stock) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 5) return 'Critical';
        return 'Low Stock';
    };

    const getStockColor = (stock) => {
        if (stock === 0) return 'danger';
        if (stock <= 5) return 'critical';
        return 'warning';
    };

    const handleViewAll = () => {
        navigate('/inventory');
    };

    if (loading) {
        return (
            <div className="low-stock-card">
                <div className="low-stock-header">
                    <h2>
                        <FaExclamationTriangle className="header-icon" />
                        Low Stock Alert
                    </h2>
                    <span className="low-stock-badge all-good">Loading...</span>
                </div>
                <div className="low-stock-loading">
                    <div className="low-stock-spinner"></div>
                    <p>Checking stock levels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="low-stock-card">
            <div className="low-stock-header">
                <h2>
                    <FaExclamationTriangle className="header-icon" />
                    Low Stock Alert
                </h2>
                <span className={`low-stock-badge ${lowStockProducts.length > 0 ? 'has-items' : 'all-good'}`}>
                    {lowStockProducts.length} items
                </span>
            </div>

            {lowStockProducts.length === 0 ? (
                <div className="low-stock-empty">
                    <p>✅ All products have sufficient stock</p>
                </div>
            ) : (
                <div className="low-stock-list">
                    {lowStockProducts.map((product) => (
                        <div
                            key={product._id}
                            className={`low-stock-item ${getStockColor(product.stockQuantity || 0)}`}
                        >
                            <div className="low-stock-item-left">
                                <div className="low-stock-icon-wrapper">
                                    <FaBox className="low-stock-icon" />
                                </div>
                                <div className="low-stock-item-info">
                                    <p className="low-stock-item-name">
                                        {product.name}
                                    </p>
                                    <p className="low-stock-item-category">
                                        {product.category || 'Uncategorized'}
                                    </p>
                                </div>
                            </div>
                            <div className="low-stock-item-right">
                                <span className={`low-stock-quantity ${product.stockQuantity === 0 ? 'danger' : 'warning'}`}>
                                    {product.stockQuantity || 0} units
                                </span>
                                <span className={`low-stock-level ${getStockColor(product.stockQuantity || 0)}`}>
                                    {getStockLevel(product.stockQuantity || 0)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {lowStockProducts.length > 0 && (
                <div className="low-stock-footer">
                    <button className="low-stock-view-all" onClick={handleViewAll}>
                        View All Low Stock Items <FaArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default LowStockProducts;