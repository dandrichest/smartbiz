/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaSearch, FaSort, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import '../../styles/Dashboard.css';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('revenue');

    const fetchAllProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/dashboard/top-products');
            setProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'revenue') return b.revenue - a.revenue;
        if (sortBy === 'sales') return b.sales - a.sales;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    const filteredProducts = sortedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearSearch = () => setSearchTerm('');

    return (
        <div className="page-wrapper">
            {/* Page Header */}
            <div className="page-header-modern">
                <Link to="/dashboard" className="back-link">
                    <FaArrowLeft /> Back to Dashboard
                </Link>
                <h1>All Products</h1>
                <span className="page-count">{filteredProducts.length} products</span>
            </div>

            {/* Controls */}
            <div className="page-controls-modern">
                <div className="search-box-modern">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={clearSearch}>
                            <FaTimes />
                        </button>
                    )}
                </div>
                <div className="sort-box">
                    <FaSort className="sort-icon" />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="revenue">Sort by Revenue</option>
                        <option value="sales">Sort by Sales</option>
                        <option value="name">Sort by Name</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="product-card-skeleton" />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-state-modern">
                    <div className="empty-icon">📦</div>
                    <h3>No products found</h3>
                    <p>Products will appear here once you make sales</p>
                </div>
            ) : (
                <div className="products-grid-modern">
                    {filteredProducts.map((product, index) => (
                        <div key={index} className="product-card-modern">
                            <div className="product-rank-modern">
                                <span className={`rank-number ${index < 3 ? 'top' : ''}`}>
                                    #{index + 1}
                                </span>
                            </div>
                            <div className="product-details-modern">
                                <h3>{product.name}</h3>
                                <div className="product-stats-modern">
                                    <span className="stat-sales">
                                        📊 {product.sales || 0} sales
                                    </span>
                                    <span className="stat-revenue">
                                        💰 ${(product.revenue || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllProducts;