/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
    FaBox, 
    FaShoppingCart, 
    FaUsers, 
    FaDollarSign, 
    FaDownload, 
    FaCalendarAlt,
    FaArrowUp,
    FaArrowDown,
    FaTrophy,
    FaChartLine,
    FaTag,
    FaUserPlus,
    FaPercentage,
    FaClock,
    FaSync,
    FaTimes
} from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import api from '../../api';
import toast from 'react-hot-toast';
import '../../styles/AnalyticsDashboard.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

const getDefaultDateRange = () => {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
        start: start.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    };
};

const AnalyticsDashboard = () => {
    const [dateRange, setDateRange] = useState(getDefaultDateRange());
    const [loading, setLoadingState] = useState(false);
    const [analytics, setAnalytics] = useState({
        sales: [],
        revenue: [],
        products: [],
        customers: [],
        categories: [],
        summary: {
            totalSales: 0,
            totalRevenue: 0,
            totalCustomers: 0,
            averageOrderValue: 0,
            topProduct: '',
            topCategory: ''
        }
    });
    const { setLoading } = useAppContext();
    const intervalRef = useRef(null);

    const fetchAnalytics = useCallback(async (showToast = false) => {
        try {
            setLoadingState(true);
            setLoading(true);
            
            const response = await api.get('/analytics', { params: dateRange });
            console.log('📊 Analytics data:', response.data);
            
            if (response.data?.success && response.data?.data) {
                const data = response.data.data;
                setAnalytics({
                    sales: data.sales || [],
                    revenue: data.revenue || [],
                    products: data.products || [],
                    customers: data.customers || [],
                    categories: data.categories || [],
                    summary: data.summary || {
                        totalSales: 0,
                        totalRevenue: 0,
                        totalCustomers: 0,
                        averageOrderValue: 0,
                        topProduct: '',
                        topCategory: ''
                    }
                });
                if (showToast) {
                    toast.success('📊 Analytics updated successfully!');
                }
            } else {
                setAnalytics({
                    sales: [],
                    revenue: [],
                    products: [],
                    customers: [],
                    categories: [],
                    summary: {
                        totalSales: 0,
                        totalRevenue: 0,
                        totalCustomers: 0,
                        averageOrderValue: 0,
                        topProduct: '',
                        topCategory: ''
                    }
                });
                if (showToast) {
                    toast.info('No analytics data available');
                }
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            
            if (error.response?.status === 404) {
                toast.error('Analytics endpoint not found. Please check your backend.');
            } else if (error.code === 'ERR_NETWORK') {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch analytics data');
            }
            
            setAnalytics({
                sales: [],
                revenue: [],
                products: [],
                customers: [],
                categories: [],
                summary: {
                    totalSales: 0,
                    totalRevenue: 0,
                    totalCustomers: 0,
                    averageOrderValue: 0,
                    topProduct: '',
                    topCategory: ''
                }
            });
        } finally {
            setLoadingState(false);
            setLoading(false);
        }
    }, [dateRange, setLoading]);

    // Initial fetch
    useEffect(() => {
        fetchAnalytics(false);
    }, [fetchAnalytics]);

    // Setup real-time updates (every 30 seconds)
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        intervalRef.current = setInterval(() => {
            console.log('🔄 Refreshing analytics data...');
            fetchAnalytics(false);
        }, 30000);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [fetchAnalytics]);

    const handleManualRefresh = () => {
        fetchAnalytics(true);
    };

    const exportData = () => {
        try {
            const headers = ['Metric', 'Value'];
            const rows = [
                ['Total Sales', analytics.summary.totalSales],
                ['Total Revenue', analytics.summary.totalRevenue],
                ['Total Customers', analytics.summary.totalCustomers],
                ['Average Order Value', analytics.summary.averageOrderValue],
                ['Top Product', analytics.summary.topProduct || 'N/A'],
                ['Top Category', analytics.summary.topCategory || 'N/A']
            ];
            
            analytics.products.forEach(p => {
                rows.push([`Product: ${p.name}`, `${p.unitsSold} units, $${p.revenue}`]);
            });
            
            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Export successful');
        } catch {
            toast.error('Failed to export data');
        }
    };

    // Chart configurations
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: { size: 12, family: 'Segoe UI' },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 14,
                cornerRadius: 10,
                titleFont: { size: 13, weight: '600' },
                bodyFont: { size: 12 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: { font: { size: 11 } },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } },
            },
        },
    };

    const salesChartData = {
        labels: analytics.sales.map(item => item.date || ''),
        datasets: [{
            label: 'Sales',
            data: analytics.sales.map(item => item.total || 0),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3B82F6',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
        }],
    };

    const revenueChartData = {
        labels: analytics.revenue.map(item => item.date || ''),
        datasets: [{
            label: 'Revenue',
            data: analytics.revenue.map(item => item.revenue || 0),
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: '#10B981',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
        }],
    };

    const productChartData = {
        labels: analytics.products.map(item => 
            item.name?.length > 12 ? item.name.slice(0, 12) + '...' : item.name || 'Unknown'
        ),
        datasets: [{
            label: 'Revenue ($)',
            data: analytics.products.map(item => item.revenue || 0),
            backgroundColor: analytics.products.map((_, i) => 
                ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(139, 92, 246, 0.8)'][i % 5]
            ),
            borderColor: analytics.products.map((_, i) => 
                ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
            ),
            borderWidth: 2,
            borderRadius: 6,
        }],
    };

    const categoryChartData = {
        labels: analytics.categories.map(item => item.category || 'Uncategorized'),
        datasets: [{
            data: analytics.categories.map(item => item.count || 0),
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
            borderColor: ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED'],
            borderWidth: 2,
        }],
    };

    const customerChartData = {
        labels: analytics.customers.map(item => item.name || 'Unknown'),
        datasets: [{
            label: 'Total Spent ($)',
            data: analytics.customers.map(item => item.totalSpent || 0),
            backgroundColor: 'rgba(139, 92, 246, 0.7)',
            borderColor: '#8B5CF6',
            borderWidth: 2,
            borderRadius: 6,
        }],
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    const hasData = analytics.sales.length > 0 || 
                    analytics.revenue.length > 0 || 
                    analytics.products.length > 0 ||
                    analytics.summary.totalSales > 0;

    if (loading) {
        return (
            <div className="analytics-container">
                <div className="analytics-loading">
                    <div className="analytics-spinner"></div>
                    <p>Loading analytics data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1>Analytics Dashboard</h1>
                    <p>Track your business performance with real-time insights</p>
                </div>
                <div className="analytics-controls">
                    <div className="date-range">
                        <FaCalendarAlt className="date-icon" />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                        <button onClick={handleManualRefresh} className="update-btn">
                            <FaSync /> Update
                        </button>
                    </div>
                    <button onClick={exportData} className="export-btn">
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            {/* No Data State */}
            {!hasData ? (
                <div className="no-data-state">
                    <div className="no-data-icon">📊</div>
                    <h3>No Analytics Data Available</h3>
                    <p>Start making sales to see your analytics data here.</p>
                    <p className="no-data-hint">Try adjusting your date range or check back later.</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="summary-grid">
                        <div className="summary-card blue">
                            <div className="summary-card-content">
                                <div className="summary-left">
                                    <span className="summary-label">Total Sales</span>
                                    <span className="summary-value">{analytics.summary.totalSales}</span>
                                </div>
                                <div className="summary-icon blue">
                                    <FaShoppingCart />
                                </div>
                            </div>
                        </div>

                        <div className="summary-card green">
                            <div className="summary-card-content">
                                <div className="summary-left">
                                    <span className="summary-label">Revenue</span>
                                    <span className="summary-value">{formatCurrency(analytics.summary.totalRevenue)}</span>
                                </div>
                                <div className="summary-icon green">
                                    <FaDollarSign />
                                </div>
                            </div>
                        </div>

                        <div className="summary-card purple">
                            <div className="summary-card-content">
                                <div className="summary-left">
                                    <span className="summary-label">Customers</span>
                                    <span className="summary-value">{analytics.summary.totalCustomers}</span>
                                </div>
                                <div className="summary-icon purple">
                                    <FaUsers />
                                </div>
                            </div>
                        </div>

                        <div className="summary-card yellow">
                            <div className="summary-card-content">
                                <div className="summary-left">
                                    <span className="summary-label">Avg Order Value</span>
                                    <span className="summary-value">{formatCurrency(analytics.summary.averageOrderValue)}</span>
                                </div>
                                <div className="summary-icon yellow">
                                    <FaBox />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="charts-row">
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <h3><FaChartLine className="chart-icon blue" /> Sales Trend</h3>
                                <span className="chart-period">Last {analytics.sales.length} days</span>
                            </div>
                            <div className="chart-container">
                                <Line data={salesChartData} options={chartOptions} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <h3><FaChartLine className="chart-icon green" /> Revenue Trend</h3>
                                <span className="chart-period">Last {analytics.revenue.length} days</span>
                            </div>
                            <div className="chart-container">
                                <Line data={revenueChartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="charts-row">
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <h3><FaTrophy className="chart-icon yellow" /> Top Products</h3>
                                <span className="chart-period">By revenue</span>
                            </div>
                            <div className="chart-container">
                                <Bar data={productChartData} options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        legend: { display: false }
                                    }
                                }} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <h3><FaTag className="chart-icon purple" /> Category Distribution</h3>
                                <span className="chart-period">By product count</span>
                            </div>
                            <div className="chart-container" style={{ maxHeight: '280px' }}>
                                <Doughnut data={categoryChartData} options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        legend: { position: 'right' }
                                    }
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 3 */}
                    <div className="charts-row">
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <h3><FaUserPlus className="chart-icon purple" /> Top Customers</h3>
                                <span className="chart-period">By total spent</span>
                            </div>
                            <div className="chart-container">
                                <Bar data={customerChartData} options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        legend: { display: false }
                                    }
                                }} />
                            </div>
                        </div>
                        <div className="chart-card insights-card">
                            <div className="chart-card-header">
                                <h3><FaClock className="chart-icon blue" /> Key Insights</h3>
                                <span className="chart-period">Quick overview</span>
                            </div>
                            <div className="insights-grid">
                                <div className="insight-item">
                                    <div className="insight-icon">🏆</div>
                                    <div className="insight-content">
                                        <span className="insight-label">Top Product</span>
                                        <span className="insight-value">{analytics.summary.topProduct || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="insight-item">
                                    <div className="insight-icon">📊</div>
                                    <div className="insight-content">
                                        <span className="insight-label">Best Category</span>
                                        <span className="insight-value">{analytics.summary.topCategory || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="insight-item">
                                    <div className="insight-icon">📈</div>
                                    <div className="insight-content">
                                        <span className="insight-label">Total Products</span>
                                        <span className="insight-value">{analytics.products.length}</span>
                                    </div>
                                </div>
                                <div className="insight-item">
                                    <div className="insight-icon">🔄</div>
                                    <div className="insight-content">
                                        <span className="insight-label">Total Categories</span>
                                        <span className="insight-value">{analytics.categories.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsDashboard;