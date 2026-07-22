/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaBox, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import api from '../../api';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import '../../styles/InventoryDashboard.css';

const InventoryDashboard = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('');
    const { setLoading } = useAppContext();

    const getDemoProducts = useCallback(() => {
        return [
            { _id: 1, name: 'Premium Cotton Fabric', price: 15.99, stockQuantity: 45, category: 'Fabrics', createdAt: new Date().toISOString() },
            { _id: 2, name: 'Silk Blend Fabric', price: 29.99, stockQuantity: 12, category: 'Fabrics', createdAt: new Date(Date.now() - 86400000).toISOString() },
            { _id: 3, name: 'Leather Wallet', price: 24.99, stockQuantity: 8, category: 'Accessories', createdAt: new Date(Date.now() - 172800000).toISOString() },
            { _id: 4, name: 'Cotton Thread', price: 4.99, stockQuantity: 150, category: 'Supplies', createdAt: new Date(Date.now() - 259200000).toISOString() },
            { _id: 5, name: 'Sewing Machine', price: 199.99, stockQuantity: 3, category: 'Equipment', createdAt: new Date(Date.now() - 345600000).toISOString() },
        ];
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.data || response.data || []);
        } catch {
            toast.error('Failed to fetch products');
            setProducts(getDemoProducts());
        } finally {
            setLoading(false);
        }
    }, [setLoading, getDemoProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Calculate stats
    const totalProducts = products.length;
    const inStock = products.filter(p => (p.stockQuantity || 0) > 10).length;
    const lowStock = products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) <= 10).length;
    const outOfStock = products.filter(p => (p.stockQuantity || 0) === 0).length;

    const statsData = [
        { title: 'Total Products', value: totalProducts, icon: FaBox, color: 'blue' },
        { title: 'In Stock', value: inStock, icon: FaCheckCircle, color: 'green' },
        { title: 'Low Stock', value: lowStock, icon: FaExclamationTriangle, color: 'yellow' },
        { title: 'Out of Stock', value: outOfStock, icon: FaTimesCircle, color: 'red' },
    ];

    // Get unique categories
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filter and sort products
    const filteredProducts = products
        .filter(p => {
            const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || false;
            const matchesCategory = category === 'All' || p.category === category;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sort === 'name') return a.name?.localeCompare(b.name || '') || 0;
            if (sort === 'price-low') return (a.price || 0) - (b.price || 0);
            if (sort === 'price-high') return (b.price || 0) - (a.price || 0);
            if (sort === 'stock-low') return (a.stockQuantity || 0) - (b.stockQuantity || 0);
            if (sort === 'stock-high') return (b.stockQuantity || 0) - (a.stockQuantity || 0);
            return 0;
        });

    return (
        <div className="inventory-dashboard">
            {/* Header */}
            <div className="inventory-header">
                <h1>
                    📦 <span className="highlight">Inventory</span> Management
                </h1>
                <button className="add-product-btn">
                    <FaPlus />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="inventory-stats-grid">
                {statsData.map((stat, index) => (
                    <div key={index} className="inventory-stat-card">
                        <div className="inventory-stat-info">
                            <div className="inventory-stat-title">{stat.title}</div>
                            <div className="inventory-stat-value">{stat.value}</div>
                        </div>
                        <div className={`inventory-stat-icon ${stat.color}`}>
                            <stat.icon />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Section */}
            <div className="inventory-search-section">
                <div className="inventory-search-row">
                    <input
                        type="text"
                        className="inventory-search-input"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="inventory-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        className="inventory-select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Sort by...</option>
                        <option value="name">Name</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="stock-low">Stock: Low to High</option>
                        <option value="stock-high">Stock: High to Low</option>
                    </select>
                </div>

                {/* Results count */}
                <div style={{ marginTop: '12px', color: '#64748b', fontSize: '14px' }}>
                    Showing {filteredProducts.length} of {products.length} products
                </div>
            </div>

            {/* Charts Grid */}
            <div className="inventory-charts-grid">
                <div className="inventory-stat-card" style={{ padding: '24px' }}>
                    <div style={{ width: '100%' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                            📊 Stock Distribution
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>In Stock (&gt;10)</span>
                                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{inStock}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{ width: `${totalProducts > 0 ? (inStock / totalProducts) * 100 : 0}%`, height: '100%', background: '#10b981', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>Low Stock (1-10)</span>
                                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{lowStock}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{ width: `${totalProducts > 0 ? (lowStock / totalProducts) * 100 : 0}%`, height: '100%', background: '#f59e0b', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px' }}>Out of Stock (0)</span>
                                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{outOfStock}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{ width: `${totalProducts > 0 ? (outOfStock / totalProducts) * 100 : 0}%`, height: '100%', background: '#ef4444', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inventory-stat-card" style={{ padding: '24px' }}>
                    <div style={{ width: '100%' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                            🏷️ Category Distribution
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {categories.filter(c => c !== 'All').map((cat, index) => {
                                const count = products.filter(p => p.category === cat).length;
                                const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                                return (
                                    <div key={cat}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ color: '#64748b', fontSize: '14px' }}>{cat}</span>
                                            <span style={{ color: '#0f172a', fontWeight: 600 }}>{count}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                            <div style={{ 
                                                width: `${totalProducts > 0 ? (count / totalProducts) * 100 : 0}%`, 
                                                height: '100%', 
                                                background: colors[index % colors.length], 
                                                borderRadius: '8px' 
                                            }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Products & Low Stock */}
            <div className="inventory-bottom-grid">
                {/* Recent Products */}
                <div className="inventory-stat-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                        🆕 Recent Products
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {products.slice(0, 5).map((product) => (
                            <div key={product._id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '10px 14px',
                                background: '#f8fafc',
                                borderRadius: '10px'
                            }}>
                                <span style={{ color: '#0f172a', fontWeight: 500 }}>{product.name}</span>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>
                                    ${(product.price || 0).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
                                No products found
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Products */}
                <div className="inventory-stat-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                        ⚠️ Low Stock Items
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {products
                            .filter(p => (p.stockQuantity || 0) <= 10 && (p.stockQuantity || 0) > 0)
                            .slice(0, 5)
                            .map((product) => (
                                <div key={product._id} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '10px 14px',
                                    background: '#fef2f2',
                                    borderRadius: '10px',
                                    border: '1px solid #fecaca'
                                }}>
                                    <span style={{ color: '#0f172a', fontWeight: 500 }}>{product.name}</span>
                                    <span style={{ color: '#ef4444', fontWeight: 600 }}>
                                        {product.stockQuantity} left
                                    </span>
                                </div>
                            ))}
                        {products.filter(p => (p.stockQuantity || 0) <= 10 && (p.stockQuantity || 0) > 0).length === 0 && (
                            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
                                ✅ All products are well stocked
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryDashboard;