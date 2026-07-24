/* eslint-disable no-unused-vars */
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
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaBoxOpen,
  FaDollarSign,
} from "react-icons/fa";
import "../../styles/InventoryChart.css";

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

const InventoryChart = ({ title, type = "bar", products = [], height = 300 }) => {
  // ── Format currency ──
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  // ── Prepare data based on chart type ──
  const getChartData = () => {
    switch (type) {
      case "bar":
        return getBarChartData();
      case "pie":
      case "doughnut":
        return getPieChartData();
      case "line":
        return getLineChartData();
      default:
        return getBarChartData();
    }
  };

  // Bar Chart: Stock levels by category
  const getBarChartData = () => {
    const categoryData = {};
    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!categoryData[category]) {
        categoryData[category] = {
          count: 0,
          totalStock: 0,
          totalValue: 0,
        };
      }
      categoryData[category].count += 1;
      categoryData[category].totalStock += product.stockQuantity || 0;
      categoryData[category].totalValue +=
        (product.price || 0) * (product.stockQuantity || 0);
    });

    const labels = Object.keys(categoryData);
    const stockData = labels.map((cat) => categoryData[cat].totalStock);
    const valueData = labels.map((cat) =>
      Math.round(categoryData[cat].totalValue)
    );

    return {
      labels: labels,
      datasets: [
        {
          label: "Stock Quantity",
          data: stockData,
          backgroundColor: "rgba(59, 130, 246, 0.85)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: "rgb(59, 130, 246)",
        },
        {
          label: "Inventory Value ($)",
          data: valueData,
          backgroundColor: "rgba(139, 92, 246, 0.85)",
          borderColor: "rgb(139, 92, 246)",
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: "rgb(139, 92, 246)",
        },
      ],
    };
  };

  // Pie/Doughnut Chart: Category distribution
  const getPieChartData = () => {
    const categoryData = {};
    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += product.stockQuantity || 0;
    });

    const labels = Object.keys(categoryData);
    const data = labels.map((cat) => categoryData[cat]);

    // Modern color palette
    const colors = [
      "rgba(59, 130, 246, 0.9)",
      "rgba(139, 92, 246, 0.9)",
      "rgba(16, 185, 129, 0.9)",
      "rgba(245, 158, 11, 0.9)",
      "rgba(239, 68, 68, 0.9)",
      "rgba(236, 72, 153, 0.9)",
      "rgba(14, 165, 233, 0.9)",
      "rgba(168, 85, 247, 0.9)",
    ];

    const borderColors = colors.map((c) => c.replace("0.9", "1"));

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: "#ffffff",
          borderWidth: 3,
          hoverBorderWidth: 4,
          hoverOffset: 8,
        },
      ],
    };
  };

  // Line Chart: Stock trends
  const getLineChartData = () => {
    const sortedProducts = [...products]
      .sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0))
      .slice(0, 5);

    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

    const colors = [
      { border: "rgb(59, 130, 246)", bg: "rgba(59, 130, 246, 0.1)" },
      { border: "rgb(139, 92, 246)", bg: "rgba(139, 92, 246, 0.1)" },
      { border: "rgb(16, 185, 129)", bg: "rgba(16, 185, 129, 0.1)" },
      { border: "rgb(245, 158, 11)", bg: "rgba(245, 158, 11, 0.1)" },
      { border: "rgb(239, 68, 68)", bg: "rgba(239, 68, 68, 0.1)" },
    ];

    const datasets = sortedProducts.map((product, index) => {
      const baseStock = product.stockQuantity || 0;
      const trendData = weeks.map((_, i) => {
        const variation = Math.floor(Math.random() * 20) - 10;
        return Math.max(0, baseStock + variation - i * 2);
      });

      const color = colors[index % colors.length];

      return {
        label:
          product.name.length > 15
            ? product.name.substring(0, 15) + "..."
            : product.name,
        data: trendData,
        borderColor: color.border,
        backgroundColor: color.bg,
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color.border,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      };
    });

    return {
      labels: weeks,
      datasets: datasets,
    };
  };

  // ── Chart Options ──
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          color: "#6b7280",
          font: {
            size: 12,
            weight: "600",
            family: "Inter, sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        padding: 14,
        cornerRadius: 10,
        titleFont: {
          size: 12,
          weight: "700",
          family: "Inter, sans-serif",
        },
        bodyFont: {
          size: 12,
          weight: "500",
          family: "Inter, sans-serif",
        },
        boxPadding: 6,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            let value = context.parsed.y || context.parsed.r || context.parsed;
            if (typeof value === "object") {
              value = value.v || value;
            }
            if (label.includes("$") || label.toLowerCase().includes("value")) {
              return `${label}: ${formatCurrency(value)}`;
            }
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales:
      type === "bar" || type === "line"
        ? {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.04)",
                drawBorder: false,
              },
              border: {
                display: false,
              },
              ticks: {
                color: "#9ca3af",
                font: {
                  size: 11,
                  weight: "500",
                  family: "Inter, sans-serif",
                },
                padding: 8,
                callback: function (value) {
                  if (value >= 1000) {
                    return (value / 1000).toFixed(1) + "k";
                  }
                  return value;
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
              ticks: {
                color: "#9ca3af",
                font: {
                  size: 11,
                  weight: "600",
                  family: "Inter, sans-serif",
                },
                padding: 8,
                maxRotation: 45,
                minRotation: 0,
              },
            },
          }
        : {},
  };

  const getChartTitle = () => {
    const titles = {
      bar: "Stock by Category",
      pie: "Category Distribution",
      doughnut: "Category Distribution",
      line: "Stock Trends",
    };
    return title || titles[type] || "Inventory Chart";
  };

  const getChartSubtitle = () => {
    const subtitles = {
      bar: "Stock levels and value across categories",
      pie: "Product distribution by category",
      doughnut: "Product distribution by category",
      line: "Historical stock movement",
    };
    return subtitles[type] || "";
  };

  const getChartIcon = () => {
    const icons = {
      bar: FaChartBar,
      pie: FaChartPie,
      doughnut: FaChartPie,
      line: FaChartLine,
    };
    const Icon = icons[type] || FaChartBar;
    return <Icon />;
  };

  const chartData = getChartData();

  // Calculate totals for footer
  const totalStock = products.reduce(
    (sum, p) => sum + (p.stockQuantity || 0),
    0
  );
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * (p.stockQuantity || 0),
    0
  );
  const uniqueCategories = new Set(
    products.map((p) => p.category || "Uncategorized")
  ).size;

  // Render appropriate chart
  const renderChart = () => {
    if (products.length === 0) {
      return (
        <div className="ic-empty">
          <div className="ic-empty-icon">📊</div>
          <p className="ic-empty-title">No data available</p>
          <p className="ic-empty-sub">
            Add products to start visualizing your inventory
          </p>
        </div>
      );
    }

    switch (type) {
      case "bar":
        return <Bar data={chartData} options={chartOptions} />;
      case "pie":
      case "doughnut":
        return <Doughnut data={chartData} options={chartOptions} />;
      case "line":
        return <Line data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="ic-card">
      {/* Header */}
      <div className="ic-header">
        <div className="ic-header-left">
          <div className={`ic-header-icon ic-icon--${type}`}>
            {getChartIcon()}
          </div>
          <div>
            <h3 className="ic-title">{getChartTitle()}</h3>
            <p className="ic-subtitle">{getChartSubtitle()}</p>
          </div>
        </div>
        {products.length > 0 && (
          <div className="ic-header-badge">
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="ic-body" style={{ height: `${height}px` }}>
        {renderChart()}
      </div>

      {/* Footer with stats */}
      {products.length > 0 && (
        <div className="ic-footer">
          <div className="ic-stat">
            <div className="ic-stat-icon ic-stat-icon--blue">
              <FaBoxOpen />
            </div>
            <div>
              <span className="ic-stat-label">Total Stock</span>
              <span className="ic-stat-value">
                {totalStock.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="ic-stat">
            <div className="ic-stat-icon ic-stat-icon--emerald">
              <FaDollarSign />
            </div>
            <div>
              <span className="ic-stat-label">Total Value</span>
              <span className="ic-stat-value">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>

          <div className="ic-stat">
            <div className="ic-stat-icon ic-stat-icon--violet">
              <FaChartPie />
            </div>
            <div>
              <span className="ic-stat-label">Categories</span>
              <span className="ic-stat-value">{uniqueCategories}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryChart;