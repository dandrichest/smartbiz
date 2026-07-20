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
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FaChartBar, FaChartPie, FaChartLine } from 'react-icons/fa';

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

const InventoryChart = ({ title, type = 'bar', products = [], height = 300 }) => {
    // Prepare data based on chart type
    const getChartData = () => {
        switch (type) {
            case 'bar':
                return getBarChartData();
            case 'pie':
            case 'doughnut':
                return getPieChartData();
            case 'line':
                return getLineChartData();
            default:
                return getBarChartData();
        }
    };

    // Bar Chart: Stock levels by category or individual products
    const getBarChartData = () => {
        // Group products by category
        const categoryData = {};
        products.forEach(product => {
            const category = product.category || 'Uncategorized';
            if (!categoryData[category]) {
                categoryData[category] = {
                    count: 0,
                    totalStock: 0,
                    totalValue: 0
                };
            }
            categoryData[category].count += 1;
            categoryData[category].totalStock += product.stockQuantity || 0;
            categoryData[category].totalValue += (product.price || 0) * (product.stockQuantity || 0);
        });

        const labels = Object.keys(categoryData);
        const stockData = labels.map(cat => categoryData[cat].totalStock);
        const valueData = labels.map(cat => Math.round(categoryData[cat].totalValue));

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Stock Quantity',
                    data: stockData,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                    borderRadius: 4,
                },
                {
                    label: 'Inventory Value ($)',
                    data: valueData,
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 2,
                    borderRadius: 4,
                }
            ],
        };
    };

    // Pie/Doughnut Chart: Category distribution
    const getPieChartData = () => {
        const categoryData = {};
        products.forEach(product => {
            const category = product.category || 'Uncategorized';
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += product.stockQuantity || 0;
        });

        const labels = Object.keys(categoryData);
        const data = labels.map(cat => categoryData[cat]);

        const colors = [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(14, 165, 233, 0.7)',
            'rgba(168, 85, 247, 0.7)',
        ];

        const borderColors = colors.map(c => c.replace('0.7', '1'));

        return {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: borderColors.slice(0, labels.length),
                    borderWidth: 2,
                },
            ],
        };
    };

    // Line Chart: Stock trends (mock data since real trends would require historical data)
    const getLineChartData = () => {
        // For demo, show stock levels of top 5 products
        const sortedProducts = [...products]
            .sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0))
            .slice(0, 5);

        // Mock weeks
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        
        const datasets = sortedProducts.map((product, index) => {
            const colors = [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)',
                'rgb(139, 92, 246)',
            ];
            
            // Generate mock trend data
            const baseStock = product.stockQuantity || 0;
            const trendData = weeks.map((_, i) => {
                const variation = Math.floor(Math.random() * 20) - 10;
                return Math.max(0, baseStock + variation - (i * 2));
            });

            return {
                label: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
                data: trendData,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '33',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            };
        });

        return {
            labels: weeks,
            datasets: datasets,
        };
    };

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
                    font: {
                        size: 11,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        let value = context.parsed.y || context.parsed.r || context.parsed;
                        if (typeof value === 'object') {
                            value = value.v || value;
                        }
                        return `${label}: ${value}`;
                    }
                }
            },
        },
        scales: type === 'bar' || type === 'line' ? {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
        } : {},
    };

    const getChartTitle = () => {
        const titles = {
            bar: 'Stock by Category',
            pie: 'Category Distribution',
            doughnut: 'Category Distribution',
            line: 'Stock Trends',
        };
        return title || titles[type] || 'Inventory Chart';
    };

    const getChartIcon = () => {
        const icons = {
            bar: <FaChartBar className="mr-2" />,
            pie: <FaChartPie className="mr-2" />,
            doughnut: <FaChartPie className="mr-2" />,
            line: <FaChartLine className="mr-2" />,
        };
        return icons[type] || <FaChartBar className="mr-2" />;
    };

    const chartData = getChartData();

    // Render appropriate chart
    const renderChart = () => {
        if (products.length === 0) {
            return (
                <div className="flex items-center justify-center h-full text-gray-400">
                    No data available
                </div>
            );
        }

        switch (type) {
            case 'bar':
                return <Bar data={chartData} options={chartOptions} />;
            case 'pie':
            case 'doughnut':
                return <Doughnut data={chartData} options={chartOptions} />;
            case 'line':
                return <Line data={chartData} options={chartOptions} />;
            default:
                return <Bar data={chartData} options={chartOptions} />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    {getChartIcon()}
                    {getChartTitle()}
                </h3>
                <span className="text-xs text-gray-500">
                    {products.length} products
                </span>
            </div>
            <div style={{ height: `${height}px` }}>
                {renderChart()}
            </div>
            {products.length > 0 && type === 'bar' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Total Stock: {products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0)}</span>
                        <span>Total Value: ${products.reduce((sum, p) => sum + ((p.price || 0) * (p.stockQuantity || 0)), 0).toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryChart;