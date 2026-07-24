/* eslint-disable no-useless-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useRef, useMemo } from "react";
import {
  FaDownload,
  FaEye,
  FaFilter,
  FaCalendar,
  FaWallet,
  FaTimes,
  FaSearch,
  FaMoneyBillWave,
  FaCreditCard,
  FaExchangeAlt,
  FaPaypal,
  FaMobileAlt,
  FaChartLine,
  FaReceipt,
  FaShoppingCart,
  FaDollarSign,
  FaBoxOpen,
  FaChevronRight,
  FaPrint,
  FaUser,
  FaClock,
  FaSpinner,
  FaFileCsv,
  FaCheckCircle,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import api from "../../api";
import toast from "react-hot-toast";
import "../../styles/SalesHistory.css";

const PAYMENT_ICONS = {
  cash: FaMoneyBillWave,
  card: FaCreditCard,
  transfer: FaExchangeAlt,
  paypal: FaPaypal,
  pos: FaMobileAlt,
};

const DATE_PRESETS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "week", label: "Last 7 days" },
  { id: "month", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    paymentMethod: "",
    search: "",
  });
  const [activePreset, setActivePreset] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { setLoading: setGlobalLoading } = useAppContext();
  const errorShownRef = useRef(false);

  useEffect(() => {
    fetchSales();
    return () => {
      errorShownRef.current = false;
    };
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setGlobalLoading(true);

      try {
        const response = await api.get("/sales", { params: filter });
        let salesData = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            salesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            salesData = response.data.data;
          } else if (
            response.data.sales &&
            Array.isArray(response.data.sales)
          ) {
            salesData = response.data.sales;
          } else {
            salesData = Object.values(response.data).filter(
              (item) => typeof item === "object"
            );
          }
        }
        setSales(salesData);
        errorShownRef.current = false;
      } catch (apiError) {
        if (apiError.response?.status === 404) {
          if (!errorShownRef.current) {
            errorShownRef.current = true;
            console.warn("📋 Sales endpoint not found. Using demo data.");
          }
          setSales(getDemoSales());
          return;
        }
        console.error("API Error:", apiError);
        setSales(getDemoSales());
        if (!errorShownRef.current) {
          errorShownRef.current = true;
          toast.error("Failed to fetch sales history. Using demo data.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setSales(getDemoSales());
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const getDemoSales = () => [
    {
      _id: "1",
      receiptNumber: "INV-001",
      createdAt: new Date().toISOString(),
      customer: { firstName: "John", lastName: "Doe", email: "john@example.com" },
      items: [
        { name: "Premium Cotton Fabric", quantity: 2, price: 15.99, total: 31.98 },
        { name: "Cotton Thread", quantity: 3, price: 4.99, total: 14.97 },
      ],
      total: 45.99,
      subtotal: 42.99,
      tax: 3.0,
      paymentMethod: "cash",
    },
    {
      _id: "2",
      receiptNumber: "INV-002",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      customer: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
      items: [{ name: "Silk Blend Fabric", quantity: 1, price: 29.99, total: 29.99 }],
      total: 29.99,
      subtotal: 28.03,
      tax: 1.96,
      paymentMethod: "card",
    },
    {
      _id: "3",
      receiptNumber: "INV-003",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      customer: null,
      items: [
        { name: "Leather Wallet", quantity: 1, price: 24.99, total: 24.99 },
        { name: "Sewing Kit", quantity: 2, price: 12.99, total: 25.98 },
        { name: "Fabric Scissors", quantity: 2, price: 18.99, total: 37.98 },
      ],
      total: 89.97,
      subtotal: 84.08,
      tax: 5.89,
      paymentMethod: "transfer",
    },
    {
      _id: "4",
      receiptNumber: "INV-004",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      customer: { firstName: "Alice", lastName: "Johnson", email: "alice@example.com" },
      items: [
        { name: "Sewing Machine", quantity: 1, price: 199.99, total: 199.99 },
      ],
      total: 67.5,
      subtotal: 63.08,
      tax: 4.42,
      paymentMethod: "paypal",
    },
    {
      _id: "5",
      receiptNumber: "INV-005",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      customer: { firstName: "Bob", lastName: "Williams", email: "bob@example.com" },
      items: [{ name: "Measuring Tape", quantity: 2, price: 5.99, total: 11.98 }],
      total: 12.99,
      subtotal: 12.14,
      tax: 0.85,
      paymentMethod: "pos",
    },
  ];

  // ── Date preset handler ──
  const applyDatePreset = (preset) => {
    setActivePreset(preset);
    const today = new Date();
    const startDate = new Date();
    let start = "";
    let end = today.toISOString().split("T")[0];

    switch (preset) {
      case "today":
        start = today.toISOString().split("T")[0];
        break;
      case "yesterday":
        startDate.setDate(today.getDate() - 1);
        start = startDate.toISOString().split("T")[0];
        end = start;
        break;
      case "week":
        startDate.setDate(today.getDate() - 7);
        start = startDate.toISOString().split("T")[0];
        break;
      case "month":
        startDate.setDate(today.getDate() - 30);
        start = startDate.toISOString().split("T")[0];
        break;
      case "all":
      default:
        start = "";
        end = "";
    }

    setFilter({ ...filter, startDate: start, endDate: end });
  };

  // ── Filtered sales (client-side search + payment) ──
  const filteredSales = useMemo(() => {
    let result = Array.isArray(sales) ? [...sales] : [];

    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.receiptNumber?.toLowerCase().includes(q) ||
          s._id?.toLowerCase().includes(q) ||
          getCustomerName(s.customer).toLowerCase().includes(q)
      );
    }

    if (filter.paymentMethod) {
      result = result.filter((s) => s.paymentMethod === filter.paymentMethod);
    }

    // Sort by date descending
    result.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    return result;
  }, [sales, filter.search, filter.paymentMethod]);

  // ── Stats ──
  const stats = useMemo(() => {
    const list = Array.isArray(sales) ? sales : [];
    const totalRevenue = list.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalTransactions = list.length;
    const totalItems = list.reduce(
      (sum, s) => sum + (s.items?.length || 0),
      0
    );
    const avgSale = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    return { totalRevenue, totalTransactions, totalItems, avgSale };
  }, [sales]);

  // ── Payment method breakdown ──
  const paymentBreakdown = useMemo(() => {
    const list = Array.isArray(sales) ? sales : [];
    const totals = {};
    list.forEach((s) => {
      const method = s.paymentMethod || "other";
      totals[method] = (totals[method] || 0) + (s.total || 0);
    });
    return totals;
  }, [sales]);

  const exportSales = async () => {
    setIsExporting(true);
    try {
      const response = await api.get("/sales/export", {
        params: filter,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sales_report_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export started");
    } catch {
      generateCSV();
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = () => {
    if (filteredSales.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Receipt #", "Date", "Customer", "Items", "Total", "Payment"];
    const rows = filteredSales.map((sale) => [
      sale.receiptNumber || sale._id,
      new Date(sale.createdAt).toLocaleDateString(),
      getCustomerName(sale.customer),
      sale.items?.length || 0,
      (sale.total || 0).toFixed(2),
      sale.paymentMethod || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((v) => `"${v}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Exported successfully");
  };

  const viewReceipt = (sale) => {
    setSelectedSale(sale);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setTimeout(() => setSelectedSale(null), 200);
  };

  const clearAllFilters = () => {
    setFilter({ startDate: "", endDate: "", paymentMethod: "", search: "" });
    setActivePreset("all");
  };

  const hasActiveFilters =
    filter.startDate || filter.endDate || filter.paymentMethod || filter.search;

  // ── Helpers ──
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amt || 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  function getCustomerName(customer) {
    if (!customer) return "Walk-in Customer";
    if (customer.name) return customer.name;
    if (customer.firstName || customer.lastName) {
      return `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
    }
    return "Walk-in Customer";
  }

  const getInitials = (customer) => {
    const name = getCustomerName(customer);
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0]?.toUpperCase() || "W";
  };

  const getAvatarGradient = (id) => {
    const gradients = [
      "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      "linear-gradient(135deg, #10b981, #14b8a6)",
      "linear-gradient(135deg, #f59e0b, #ef4444)",
      "linear-gradient(135deg, #ec4899, #8b5cf6)",
      "linear-gradient(135deg, #06b6d4, #3b82f6)",
    ];
    const str = id?.toString() || "0";
    const hash = str
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  return (
    <div className="sh-wrapper">
      {/* ── Top Bar ── */}
      <header className="sh-topbar">
        <div className="sh-topbar-left">
          <h1 className="sh-title">
            <span className="sh-title-icon">
              <FaChartLine />
            </span>
            Sales History
          </h1>
          <p className="sh-subtitle">
            View all transactions and export reports
          </p>
        </div>

        <button
          className="sh-export-btn"
          onClick={exportSales}
          disabled={isExporting || filteredSales.length === 0}
        >
          {isExporting ? (
            <>
              <FaSpinner className="sh-spinner" /> Exporting...
            </>
          ) : (
            <>
              <FaFileCsv /> Export CSV
            </>
          )}
        </button>
      </header>

      {/* ── Stats Row ── */}
      <section className="sh-stats-row">
        <div className="sh-stat sh-stat--emerald">
          <div className="sh-stat-icon">
            <FaDollarSign />
          </div>
          <div className="sh-stat-body">
            <div className="sh-stat-value">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="sh-stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="sh-stat sh-stat--blue">
          <div className="sh-stat-icon">
            <FaReceipt />
          </div>
          <div className="sh-stat-body">
            <div className="sh-stat-value">{stats.totalTransactions}</div>
            <div className="sh-stat-label">Transactions</div>
          </div>
        </div>

        <div className="sh-stat sh-stat--violet">
          <div className="sh-stat-icon">
            <FaBoxOpen />
          </div>
          <div className="sh-stat-body">
            <div className="sh-stat-value">{stats.totalItems}</div>
            <div className="sh-stat-label">Items Sold</div>
          </div>
        </div>

        <div className="sh-stat sh-stat--amber">
          <div className="sh-stat-icon">
            <FaChartLine />
          </div>
          <div className="sh-stat-body">
            <div className="sh-stat-value">{formatCurrency(stats.avgSale)}</div>
            <div className="sh-stat-label">Avg Sale</div>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="sh-filters-card">
        {/* Search bar */}
        <div className="sh-search-box">
          <FaSearch className="sh-search-icon" />
          <input
            type="text"
            placeholder="Search by receipt number or customer name..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="sh-search-input"
          />
          {filter.search && (
            <button
              className="sh-search-clear"
              onClick={() => setFilter({ ...filter, search: "" })}
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Date presets */}
        <div className="sh-preset-row">
          <span className="sh-preset-label">
            <FaCalendar /> Quick range:
          </span>
          <div className="sh-preset-tabs">
            {DATE_PRESETS.map((p) => (
              <button
                key={p.id}
                className={`sh-preset-btn ${
                  activePreset === p.id ? "active" : ""
                }`}
                onClick={() => applyDatePreset(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced filters */}
        <div className="sh-adv-filters">
          <div className="sh-filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => {
                setFilter({ ...filter, startDate: e.target.value });
                setActivePreset("");
              }}
              className="sh-input"
            />
          </div>

          <div className="sh-filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) => {
                setFilter({ ...filter, endDate: e.target.value });
                setActivePreset("");
              }}
              className="sh-input"
            />
          </div>

          <div className="sh-filter-group">
            <label>Payment Method</label>
            <select
              value={filter.paymentMethod}
              onChange={(e) =>
                setFilter({ ...filter, paymentMethod: e.target.value })
              }
              className="sh-select"
            >
              <option value="">All Methods</option>
              <option value="cash">💵 Cash</option>
              <option value="card">💳 Card</option>
              <option value="transfer">🔄 Transfer</option>
              <option value="paypal">🅿️ PayPal</option>
              <option value="pos">📱 POS</option>
            </select>
          </div>

          <button className="sh-apply-btn" onClick={fetchSales}>
            <FaFilter /> Apply Filters
          </button>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="sh-active-filters">
            <span className="sh-active-label">Active:</span>
            {filter.startDate && (
              <span className="sh-chip">
                From {formatDate(filter.startDate)}
                <button
                  onClick={() => setFilter({ ...filter, startDate: "" })}
                >
                  <FaTimes />
                </button>
              </span>
            )}
            {filter.endDate && (
              <span className="sh-chip">
                To {formatDate(filter.endDate)}
                <button onClick={() => setFilter({ ...filter, endDate: "" })}>
                  <FaTimes />
                </button>
              </span>
            )}
            {filter.paymentMethod && (
              <span className="sh-chip">
                {filter.paymentMethod}
                <button
                  onClick={() => setFilter({ ...filter, paymentMethod: "" })}
                >
                  <FaTimes />
                </button>
              </span>
            )}
            {filter.search && (
              <span className="sh-chip">
                "{filter.search}"
                <button onClick={() => setFilter({ ...filter, search: "" })}>
                  <FaTimes />
                </button>
              </span>
            )}
            <button className="sh-clear-all" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* ── Payment Method Breakdown ── */}
      {Object.keys(paymentBreakdown).length > 0 && !loading && (
        <section className="sh-payment-breakdown">
          <div className="sh-breakdown-head">
            <FaWallet />
            <span>Revenue by Payment Method</span>
          </div>
          <div className="sh-breakdown-grid">
            {Object.entries(paymentBreakdown).map(([method, amount]) => {
              const Icon = PAYMENT_ICONS[method] || FaCreditCard;
              const percentage =
                stats.totalRevenue > 0
                  ? (amount / stats.totalRevenue) * 100
                  : 0;
              return (
                <div
                  key={method}
                  className={`sh-breakdown-item sh-payment-${method}`}
                >
                  <div className="sh-breakdown-header">
                    <div className="sh-breakdown-icon">
                      <Icon />
                    </div>
                    <span className="sh-breakdown-label">{method}</span>
                  </div>
                  <div className="sh-breakdown-value">
                    {formatCurrency(amount)}
                  </div>
                  <div className="sh-breakdown-bar">
                    <div
                      className="sh-breakdown-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="sh-breakdown-pct">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Results header ── */}
      <div className="sh-results-bar">
        <span className="sh-results-count">
          <strong>{filteredSales.length}</strong>{" "}
          {filteredSales.length === 1 ? "transaction" : "transactions"}
        </span>
      </div>

      {/* ── Sales Table / Cards ── */}
      {loading ? (
        <div className="sh-loading-card">
          <FaSpinner className="sh-spinner" />
          <p>Loading transactions...</p>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="sh-empty">
          <div className="sh-empty-icon">📋</div>
          <h3>No transactions found</h3>
          <p>
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Sales will appear here once you make transactions"}
          </p>
          {hasActiveFilters && (
            <button className="sh-empty-action" onClick={clearAllFilters}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="sh-list">
          {filteredSales.map((sale, i) => {
            const Icon = PAYMENT_ICONS[sale.paymentMethod] || FaCreditCard;
            return (
              <article
                key={sale._id || i}
                className="sh-row"
                onClick={() => viewReceipt(sale)}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="sh-row-left">
                  <div
                    className="sh-row-avatar"
                    style={{ background: getAvatarGradient(sale._id) }}
                  >
                    {getInitials(sale.customer)}
                  </div>
                </div>

                <div className="sh-row-info">
                  <div className="sh-row-top">
                    <span className="sh-row-receipt">
                      #{sale.receiptNumber || sale._id?.slice(-6) || "N/A"}
                    </span>
                    <span className="sh-row-date">
                      <FaClock /> {formatDateTime(sale.createdAt)}
                    </span>
                  </div>
                  <div className="sh-row-mid">
                    <span className="sh-row-customer">
                      <FaUser />
                      {getCustomerName(sale.customer)}
                    </span>
                    <span className="sh-row-items">
                      <FaBoxOpen /> {sale.items?.length || 0}{" "}
                      {(sale.items?.length || 0) === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>

                <div className="sh-row-payment">
                  <span
                    className={`sh-pay-badge sh-payment-${sale.paymentMethod}`}
                  >
                    <Icon />
                    {sale.paymentMethod || "N/A"}
                  </span>
                </div>

                <div className="sh-row-amount">
                  {formatCurrency(sale.total)}
                </div>

                <button
                  className="sh-row-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    viewReceipt(sale);
                  }}
                  aria-label="View details"
                >
                  <FaChevronRight />
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {showDetail && selectedSale && (
        <div
          className="sh-modal-overlay"
          onClick={closeDetail}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="sh-modal sh-receipt"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sh-receipt-hero">
              <div className="sh-receipt-check">
                <FaCheckCircle />
              </div>
              <h2>Transaction Details</h2>
              <p>
                Receipt #{selectedSale.receiptNumber || selectedSale._id?.slice(-6)}
              </p>
            </div>

            <div className="sh-receipt-body">
              <div className="sh-receipt-meta">
                <div>
                  <span className="sh-receipt-label">Transaction ID</span>
                  <span className="sh-receipt-value">
                    {selectedSale.receiptNumber ||
                      selectedSale._id?.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="sh-receipt-label">Date & Time</span>
                  <span className="sh-receipt-value">
                    {formatDateTime(selectedSale.createdAt)}
                  </span>
                </div>
              </div>

              <div className="sh-receipt-divider" />

              <div className="sh-receipt-section">
                <h4>Customer</h4>
                <div className="sh-receipt-customer">
                  <div
                    className="sh-receipt-avatar"
                    style={{ background: getAvatarGradient(selectedSale._id) }}
                  >
                    {getInitials(selectedSale.customer)}
                  </div>
                  <div>
                    <div className="sh-receipt-customer-name">
                      {getCustomerName(selectedSale.customer)}
                    </div>
                    {selectedSale.customer?.email && (
                      <div className="sh-receipt-customer-meta">
                        {selectedSale.customer.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sh-receipt-divider" />

              <div className="sh-receipt-section">
                <h4>Items ({selectedSale.items?.length || 0})</h4>
                <div className="sh-receipt-items">
                  {(selectedSale.items || []).map((item, i) => (
                    <div key={i} className="sh-receipt-item">
                      <div className="sh-receipt-item-info">
                        <div className="sh-receipt-item-name">
                          {item.name || "Unknown"}
                        </div>
                        <div className="sh-receipt-item-meta">
                          {item.quantity || 1} ×{" "}
                          {formatCurrency(item.price || 0)}
                        </div>
                      </div>
                      <div className="sh-receipt-item-total">
                        {formatCurrency(
                          item.total || (item.price || 0) * (item.quantity || 1)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sh-receipt-divider" />

              <div className="sh-receipt-totals">
                {selectedSale.subtotal !== undefined && (
                  <div className="sh-receipt-total-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedSale.subtotal)}</span>
                  </div>
                )}
                {selectedSale.tax !== undefined && (
                  <div className="sh-receipt-total-row">
                    <span>Tax</span>
                    <span>{formatCurrency(selectedSale.tax)}</span>
                  </div>
                )}
                <div className="sh-receipt-total-row sh-receipt-grand">
                  <span>Total Paid</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>

              <div className="sh-receipt-payment">
                {(() => {
                  const Icon =
                    PAYMENT_ICONS[selectedSale.paymentMethod] || FaCreditCard;
                  return (
                    <>
                      <Icon /> Paid via{" "}
                      {selectedSale.paymentMethod?.toUpperCase() || "N/A"}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="sh-receipt-actions">
              <button className="sh-btn-secondary" onClick={() => window.print()}>
                <FaPrint /> Print
              </button>
              <button className="sh-btn-primary" onClick={closeDetail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;