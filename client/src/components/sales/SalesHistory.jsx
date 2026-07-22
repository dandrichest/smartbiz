/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useRef } from 'react';
import { FaDownload, FaEye, FaFilter, FaCalendar, FaWallet } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import api from '../../api';
import toast from 'react-hot-toast';
import '../../styles/SalesHistory.css';

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [filter, setFilter] = useState({
        startDate: '',
        endDate: '',
        paymentMethod: '',
    });
    const [loading, setLoading] = useState(false);
    const { setLoading: setGlobalLoading } = useAppContext();
    const errorShownRef = useRef(false);

    useEffect(() => {
        fetchSales();
        // Reset error flag on unmount
        return () => {
            errorShownRef.current = false;
        };
    }, []);

    const fetchSales = async () => {
        try {
            setLoading(true);
            setGlobalLoading(true);
            
            try {
                const response = await api.get('/sales', { params: filter });
                // Handle different response formats
                let salesData = [];
                if (response.data) {
                    if (Array.isArray(response.data)) {
                        salesData = response.data;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        salesData = response.data.data;
                    } else if (response.data.sales && Array.isArray(response.data.sales)) {
                        salesData = response.data.sales;
                    } else {
                        // If it's an object with sales data, try to extract
                        salesData = Object.values(response.data).filter(item => typeof item === 'object');
                    }
                }
                setSales(salesData);
                // Reset error flag on success
                errorShownRef.current = false;
            } catch (apiError) {
                // Silent fail for 404 - backend not running
                if (apiError.response?.status === 404) {
                    // Only show once
                    if (!errorShownRef.current) {
                        errorShownRef.current = true;
                        console.warn('📋 Sales endpoint not found. Using demo data.');
                    }
                    setSales(getDemoSales());
                    return;
                }
                
                // Handle other errors
                console.error('API Error:', apiError);
                setSales(getDemoSales());
                if (!errorShownRef.current) {
                    errorShownRef.current = true;
                    toast.error('Failed to fetch sales history. Using demo data.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setSales(getDemoSales());
            if (!errorShownRef.current) {
                errorShownRef.current = true;
                toast.error('Failed to fetch sales history. Using demo data.');
            }
        } finally {
            setLoading(false);
            setGlobalLoading(false);
        }
    };

    const getDemoSales = () => {
        return [
            {
                _id: '1',
                receiptNumber: 'INV-001',
                createdAt: new Date().toISOString(),
                customer: { name: 'John Doe' },
                items: [{ name: 'Product 1' }, { name: 'Product 2' }],
                total: 45.99,
                paymentMethod: 'cash'
            },
            {
                _id: '2',
                receiptNumber: 'INV-002',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                customer: { name: 'Jane Smith' },
                items: [{ name: 'Product 3' }],
                total: 29.99,
                paymentMethod: 'card'
            },
            {
                _id: '3',
                receiptNumber: 'INV-003',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                customer: null,
                items: [{ name: 'Product 4' }, { name: 'Product 5' }, { name: 'Product 6' }],
                total: 89.97,
                paymentMethod: 'transfer'
            },
            {
                _id: '4',
                receiptNumber: 'INV-004',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                customer: { name: 'Alice Johnson' },
                items: [{ name: 'Product 7' }, { name: 'Product 8' }],
                total: 67.50,
                paymentMethod: 'paypal'
            },
            {
                _id: '5',
                receiptNumber: 'INV-005',
                createdAt: new Date(Date.now() - 345600000).toISOString(),
                customer: { name: 'Bob Williams' },
                items: [{ name: 'Product 9' }],
                total: 12.99,
                paymentMethod: 'pos'
            }
        ];
    };

    const exportSales = async () => {
        try {
            const response = await api.get('/sales/export', { 
                params: filter, 
                responseType: 'blob' 
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Export started');
        } catch {
            // If export fails, generate a simple CSV from current data
            generateCSV();
        }
    };

    const generateCSV = () => {
        if (sales.length === 0) {
            toast.error('No data to export');
            return;
        }
        
        const headers = ['Receipt #', 'Date', 'Customer', 'Items', 'Total', 'Payment'];
        const rows = sales.map(sale => [
            sale.receiptNumber || sale._id,
            new Date(sale.createdAt).toLocaleDateString(),
            sale.customer?.name || 'Walk-in',
            sale.items?.length || 0,
            (sale.total || 0).toFixed(2),
            sale.paymentMethod || 'N/A'
        ]);
        
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Export successful');
    };

    const viewReceipt = (saleId) => {
        toast.info(`Viewing receipt #${saleId}`);
    };

    const getPaymentBadgeClass = (method) => {
        if (!method) return '';
        const classes = {
            'cash': 'cash',
            'card': 'card',
            'transfer': 'transfer',
            'paypal': 'paypal',
            'pos': 'pos',
        };
        return classes[method.toLowerCase()] || '';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const getCustomerName = (customer) => {
        if (!customer) return 'Walk-in';
        if (customer.name) return customer.name;
        if (customer.firstName && customer.lastName) {
            return `${customer.firstName} ${customer.lastName}`;
        }
        return 'Walk-in';
    };

    // Make sure sales is always an array
    const safeSales = Array.isArray(sales) ? sales : [];

    return (
        <div className="sales-history">
            {/* Header */}
            <div className="sales-history-header">
                <h1>Sales History</h1>
                <button onClick={exportSales} className="btn-export">
                    <FaDownload /> Export Report
                </button>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>
                            <FaCalendar style={{ marginRight: '4px', color: '#94a3b8' }} />
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={filter.startDate}
                            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label>
                            <FaCalendar style={{ marginRight: '4px', color: '#94a3b8' }} />
                            End Date
                        </label>
                        <input
                            type="date"
                            value={filter.endDate}
                            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label>
                            <FaWallet style={{ marginRight: '4px', color: '#94a3b8' }} />
                            Payment Method
                        </label>
                        <select
                            value={filter.paymentMethod}
                            onChange={(e) => setFilter({ ...filter, paymentMethod: e.target.value })}
                            className="filter-select"
                        >
                            <option value="">All Payments</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="transfer">Transfer</option>
                            <option value="paypal">PayPal</option>
                            <option value="pos">POS</option>
                        </select>
                    </div>
                    <button onClick={fetchSales} className="btn-apply-filters">
                        <FaFilter style={{ marginRight: '6px' }} />
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <div className="table-responsive">
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th>Receipt #</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7">
                                        <div className="table-loading">
                                            <div className="spinner"></div>
                                            <p>Loading sales...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : safeSales.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        <div className="table-empty">
                                            <div className="empty-icon">📋</div>
                                            <h3>No sales found</h3>
                                            <p>Try adjusting your filters or make your first sale</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                safeSales.map((sale) => (
                                    <tr key={sale._id || Math.random().toString()}>
                                        <td className="receipt-number">
                                            #{sale.receiptNumber || sale._id?.slice(-6) || 'N/A'}
                                        </td>
                                        <td>{formatDate(sale.createdAt)}</td>
                                        <td>{getCustomerName(sale.customer)}</td>
                                        <td>{sale.items?.length || 0}</td>
                                        <td className="total-amount">
                                            ${(sale.total || 0).toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={`payment-badge ${getPaymentBadgeClass(sale.paymentMethod)}`}>
                                                {sale.paymentMethod || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button 
                                                className="btn-view" 
                                                onClick={() => viewReceipt(sale._id || sale.receiptNumber)}
                                            >
                                                <FaEye /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesHistory;