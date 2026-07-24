/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaDollarSign,
  FaTimes,
  FaThLarge,
  FaList,
  FaEye,
  FaUsers,
  FaCrown,
  FaChartLine,
  FaEllipsisV,
  FaSort,
  FaCalendarAlt,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import api from "../../api";
import toast from "react-hot-toast";
import "../../styles/CustomerManagement.css";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const { setLoading } = useAppContext();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/customers");
      console.log("📋 Customers fetched:", response.data);
      const customerData = response.data?.data || response.data || [];
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ── Filter & sort customers ──
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.firstName?.toLowerCase().includes(q) ||
          c.lastName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q) ||
          c.address?.toLowerCase().includes(q)
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        (a.firstName || "").localeCompare(b.firstName || "")
      );
    } else if (sort === "spent-high") {
      result.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
    } else if (sort === "spent-low") {
      result.sort((a, b) => (a.totalSpent || 0) - (b.totalSpent || 0));
    } else if (sort === "purchases") {
      result.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
    } else if (sort === "recent") {
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [customers, searchTerm, sort]);

  // ── Stats ──
  const stats = useMemo(() => {
    const total = customers.length;
    const totalRevenue = customers.reduce(
      (sum, c) => sum + (c.totalSpent || 0),
      0
    );
    const totalPurchases = customers.reduce(
      (sum, c) => sum + (c.purchaseCount || 0),
      0
    );
    const vips = customers.filter((c) => (c.totalSpent || 0) >= 1000).length;
    return { total, totalRevenue, totalPurchases, vips };
  }, [customers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || formData.firstName.trim() === "") {
      toast.error("First name is required");
      return;
    }
    if (!formData.lastName || formData.lastName.trim() === "") {
      toast.error("Last name is required");
      return;
    }
    if (!formData.email || formData.email.trim() === "") {
      toast.error("Email is required");
      return;
    }
    if (!formData.phone || formData.phone.trim() === "") {
      toast.error("Phone number is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const customerData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address ? formData.address.trim() : "",
      };

      console.log("📤 Sending customer data:", customerData);

      if (editingCustomer) {
        const response = await api.put(
          `/customers/${editingCustomer._id}`,
          customerData
        );
        console.log("📥 Update response:", response.data);

        const updatedCustomer =
          response.data?.customer || response.data?.data || response.data;

        if (updatedCustomer && updatedCustomer._id) {
          setCustomers(
            customers.map((c) =>
              c._id === editingCustomer._id ? updatedCustomer : c
            )
          );
          toast.success("Customer updated successfully!");
        } else {
          await fetchCustomers();
          toast.success("Customer updated successfully!");
        }
      } else {
        const response = await api.post("/customers", customerData);
        console.log("📥 Response:", response.data);

        const newCustomer =
          response.data?.customer || response.data?.data || response.data;

        if (newCustomer && newCustomer._id) {
          setCustomers([newCustomer, ...customers]);
          toast.success("Customer added successfully!");
        } else {
          console.log("⚠️ No valid customer in response, refetching...");
          await fetchCustomers();
          toast.success("Customer added successfully!");
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error saving customer:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save customer. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      setLoading(true);
      await api.delete(`/customers/${id}`);
      setCustomers(customers.filter((c) => c._id !== id));
      toast.success("Customer deleted successfully");
      setActiveMenu(null);
      if (selectedCustomer?._id === id) closeDetail();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error(error.response?.data?.message || "Failed to delete customer");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });
    setShowForm(true);
    setActiveMenu(null);
    setShowDetail(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    });
    setIsSubmitting(false);
  };

  const openDetail = (customer) => {
    setSelectedCustomer(customer);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setTimeout(() => setSelectedCustomer(null), 200);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const getInitials = (customer) => {
    if (!customer) return "U";
    const firstName = customer.firstName || "";
    const lastName = customer.lastName || "";
    if (firstName && lastName)
      return (firstName[0] + lastName[0]).toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    return "U";
  };

  const getDisplayName = (customer) => {
    if (!customer) return "Unnamed";
    return (
      `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
      "Unnamed"
    );
  };

  const getAvatarGradient = (id) => {
    const gradients = [
      "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      "linear-gradient(135deg, #10b981, #14b8a6)",
      "linear-gradient(135deg, #f59e0b, #ef4444)",
      "linear-gradient(135deg, #ec4899, #8b5cf6)",
      "linear-gradient(135deg, #06b6d4, #3b82f6)",
      "linear-gradient(135deg, #84cc16, #10b981)",
      "linear-gradient(135deg, #f97316, #ec4899)",
      "linear-gradient(135deg, #6366f1, #a855f7)",
    ];
    const str = id?.toString() || "0";
    const hash = str
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const getTier = (spent) => {
    if (spent >= 5000)
      return { label: "Platinum", variant: "platinum", icon: "💎" };
    if (spent >= 1000) return { label: "VIP", variant: "vip", icon: "👑" };
    if (spent >= 500) return { label: "Gold", variant: "gold", icon: "⭐" };
    return null;
  };

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="cm-wrapper">
      {/* ── Top Bar ── */}
      <header className="cm-topbar">
        <div className="cm-topbar-left">
          <h1 className="cm-title">
            <span className="cm-title-icon">
              <FaUsers />
            </span>
            Customers
          </h1>
          <p className="cm-subtitle">
            Manage your customer relationships and track engagement
          </p>
        </div>

        <button
          className="cm-add-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <FaPlus />
          <span>Add Customer</span>
        </button>
      </header>

      {/* ── Stats Row ── */}
      <section className="cm-stats-row" aria-label="Customer statistics">
        <div className="cm-stat cm-stat--blue">
          <div className="cm-stat-icon">
            <FaUsers />
          </div>
          <div className="cm-stat-body">
            <div className="cm-stat-value">{stats.total}</div>
            <div className="cm-stat-label">Total Customers</div>
          </div>
        </div>

        <div className="cm-stat cm-stat--emerald">
          <div className="cm-stat-icon">
            <FaDollarSign />
          </div>
          <div className="cm-stat-body">
            <div className="cm-stat-value">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="cm-stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="cm-stat cm-stat--violet">
          <div className="cm-stat-icon">
            <FaShoppingBag />
          </div>
          <div className="cm-stat-body">
            <div className="cm-stat-value">{stats.totalPurchases}</div>
            <div className="cm-stat-label">Total Purchases</div>
          </div>
        </div>

        <div className="cm-stat cm-stat--amber">
          <div className="cm-stat-icon">
            <FaCrown />
          </div>
          <div className="cm-stat-body">
            <div className="cm-stat-value">{stats.vips}</div>
            <div className="cm-stat-label">VIP Customers</div>
          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="cm-toolbar" aria-label="Search and filter">
        <div className="cm-search-box">
          <FaSearch className="cm-search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cm-search-input"
          />
          {searchTerm && (
            <button
              className="cm-search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="cm-filters">
          <div className="cm-select-wrap">
            <FaSort className="cm-select-icon" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cm-select"
            >
              <option value="">Sort by</option>
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="spent-high">Highest Spender</option>
              <option value="spent-low">Lowest Spender</option>
              <option value="purchases">Most Purchases</option>
            </select>
          </div>

          <div className="cm-view-toggle">
            <button
              className={`cm-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <FaThLarge />
            </button>
            <button
              className={`cm-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <FaList />
            </button>
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <div className="cm-results-bar">
        <span className="cm-results-count">
          <strong>{filteredCustomers.length}</strong> of{" "}
          <strong>{customers.length}</strong> customers
        </span>
        {searchTerm && (
          <button className="cm-clear-filters" onClick={clearSearch}>
            Clear search
          </button>
        )}
      </div>

      {/* ── Customer Display ── */}
      {filteredCustomers.length === 0 ? (
        <div className="cm-empty">
          <div className="cm-empty-icon">👥</div>
          <h3>No customers found</h3>
          <p>
            {searchTerm
              ? "Try adjusting your search"
              : "Add your first customer to get started"}
          </p>
          {!searchTerm && (
            <button
              className="cm-empty-action"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <FaPlus /> Add Your First Customer
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <section className="cm-grid" aria-label="Customers grid">
          {filteredCustomers.map((customer, i) => {
            const tier = getTier(customer.totalSpent || 0);
            return (
              <article
                key={customer._id}
                className="cm-card"
                onClick={() => openDetail(customer)}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {tier && (
                  <div className={`cm-tier-badge cm-tier--${tier.variant}`}>
                    <span>{tier.icon}</span> {tier.label}
                  </div>
                )}

                <div className="cm-card-menu">
                  <button
                    className="cm-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(
                        activeMenu === customer._id ? null : customer._id
                      );
                    }}
                    aria-label="More actions"
                  >
                    <FaEllipsisV />
                  </button>
                  {activeMenu === customer._id && (
                    <div
                      className="cm-menu-dropdown"
                      onMouseLeave={() => setActiveMenu(null)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(customer);
                          setActiveMenu(null);
                        }}
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(customer);
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(customer._id);
                        }}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="cm-card-header">
                  <div
                    className="cm-avatar"
                    style={{ background: getAvatarGradient(customer._id) }}
                  >
                    {getInitials(customer)}
                  </div>
                  <h3 className="cm-card-name" title={getDisplayName(customer)}>
                    {getDisplayName(customer)}
                  </h3>
                  <span className="cm-card-id">
                    #{customer._id?.toString().slice(-6) || "N/A"}
                  </span>
                </div>

                <div className="cm-card-contact">
                  {customer.email && (
                    <div className="cm-contact-item">
                      <FaEnvelope />
                      <span title={customer.email}>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="cm-contact-item">
                      <FaPhone />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>

                <div className="cm-card-stats">
                  <div className="cm-card-stat">
                    <span className="cm-card-stat-label">
                      <FaShoppingBag /> Purchases
                    </span>
                    <span className="cm-card-stat-value">
                      {customer.purchaseCount || 0}
                    </span>
                  </div>
                  <div className="cm-card-stat">
                    <span className="cm-card-stat-label">
                      <FaDollarSign /> Total Spent
                    </span>
                    <span className="cm-card-stat-value cm-stat-money">
                      {formatCurrency(customer.totalSpent || 0)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="cm-list" aria-label="Customers list">
          {filteredCustomers.map((customer, i) => {
            const tier = getTier(customer.totalSpent || 0);
            return (
              <div
                key={customer._id}
                className="cm-list-row"
                onClick={() => openDetail(customer)}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div
                  className="cm-list-avatar"
                  style={{ background: getAvatarGradient(customer._id) }}
                >
                  {getInitials(customer)}
                </div>

                <div className="cm-list-info">
                  <div className="cm-list-top">
                    <h3 className="cm-list-name">{getDisplayName(customer)}</h3>
                    {tier && (
                      <span className={`cm-tier-pill cm-tier--${tier.variant}`}>
                        <span>{tier.icon}</span> {tier.label}
                      </span>
                    )}
                  </div>
                  <div className="cm-list-meta">
                    {customer.email && (
                      <span className="cm-list-meta-item">
                        <FaEnvelope /> {customer.email}
                      </span>
                    )}
                    {customer.phone && (
                      <span className="cm-list-meta-item">
                        <FaPhone /> {customer.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="cm-list-metrics">
                  <div className="cm-list-metric">
                    <span className="cm-metric-label">Purchases</span>
                    <span className="cm-metric-value">
                      {customer.purchaseCount || 0}
                    </span>
                  </div>
                  <div className="cm-list-metric">
                    <span className="cm-metric-label">Total Spent</span>
                    <span className="cm-metric-value cm-money">
                      {formatCurrency(customer.totalSpent || 0)}
                    </span>
                  </div>
                </div>

                <div className="cm-list-actions">
                  <button
                    className="cm-icon-btn edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(customer);
                    }}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="cm-icon-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(customer._id);
                    }}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* ── Add/Edit Form Modal ── */}
      {showForm && (
        <div className="cm-modal-overlay" onClick={resetForm}>
          <div
            className="cm-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="cm-modal-head">
              <div className="cm-modal-head-left">
                <div className="cm-modal-head-icon">
                  {editingCustomer ? <FaEdit /> : <FaPlus />}
                </div>
                <div>
                  <h2>
                    {editingCustomer ? "Edit Customer" : "Add New Customer"}
                  </h2>
                  <p>
                    {editingCustomer
                      ? "Update customer information"
                      : "Add a new customer to your database"}
                  </p>
                </div>
              </div>
              <button
                className="cm-modal-close"
                onClick={resetForm}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="cm-modal-form">
              <div className="cm-form-row">
                <div className="cm-form-group">
                  <label>
                    <FaUser /> First Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="cm-form-group">
                  <label>
                    <FaUser /> Last Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="cm-form-group">
                <label>
                  <FaEnvelope /> Email <span className="req">*</span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="cm-form-group">
                <label>
                  <FaPhone /> Phone <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="cm-form-group">
                <label>
                  <FaMapMarkerAlt /> Address
                </label>
                <textarea
                  placeholder="Enter customer address..."
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div className="cm-modal-actions">
                <button
                  type="button"
                  className="cm-btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cm-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : editingCustomer ? (
                    <>
                      <FaEdit /> Update Customer
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Customer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {showDetail && selectedCustomer && (
        <div
          className="cm-modal-overlay"
          onClick={closeDetail}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="cm-modal cm-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cm-detail-hero">
              <div
                className="cm-detail-hero-bg"
                style={{ background: getAvatarGradient(selectedCustomer._id) }}
              />
              <button
                className="cm-modal-close cm-detail-close"
                onClick={closeDetail}
              >
                <FaTimes />
              </button>

              <div
                className="cm-detail-avatar"
                style={{ background: getAvatarGradient(selectedCustomer._id) }}
              >
                {getInitials(selectedCustomer)}
              </div>

              <h2 className="cm-detail-name">
                {getDisplayName(selectedCustomer)}
              </h2>
              <span className="cm-detail-id">
                #{selectedCustomer._id?.toString().slice(-6)}
              </span>

              {(() => {
                const tier = getTier(selectedCustomer.totalSpent || 0);
                return tier ? (
                  <span className={`cm-detail-tier cm-tier--${tier.variant}`}>
                    <span>{tier.icon}</span> {tier.label} Customer
                  </span>
                ) : null;
              })()}
            </div>

            <div className="cm-detail-body">
              {/* Metrics */}
              <div className="cm-detail-metrics">
                <div className="cm-detail-metric">
                  <div className="cm-detail-metric-icon cm-metric--emerald">
                    <FaDollarSign />
                  </div>
                  <div>
                    <span className="cm-detail-metric-label">Total Spent</span>
                    <span className="cm-detail-metric-value">
                      {formatCurrency(selectedCustomer.totalSpent || 0)}
                    </span>
                  </div>
                </div>
                <div className="cm-detail-metric">
                  <div className="cm-detail-metric-icon cm-metric--blue">
                    <FaShoppingBag />
                  </div>
                  <div>
                    <span className="cm-detail-metric-label">Purchases</span>
                    <span className="cm-detail-metric-value">
                      {selectedCustomer.purchaseCount || 0}
                    </span>
                  </div>
                </div>
                <div className="cm-detail-metric">
                  <div className="cm-detail-metric-icon cm-metric--violet">
                    <FaChartLine />
                  </div>
                  <div>
                    <span className="cm-detail-metric-label">Avg Order</span>
                    <span className="cm-detail-metric-value">
                      {formatCurrency(
                        (selectedCustomer.totalSpent || 0) /
                          Math.max(selectedCustomer.purchaseCount || 1, 1)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="cm-detail-section">
                <h3>Contact Information</h3>
                <div className="cm-detail-info-grid">
                  <div className="cm-detail-info-item">
                    <div className="cm-info-icon">
                      <FaEnvelope />
                    </div>
                    <div>
                      <span className="cm-info-label">Email</span>
                      <span className="cm-info-value">
                        {selectedCustomer.email || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="cm-detail-info-item">
                    <div className="cm-info-icon">
                      <FaPhone />
                    </div>
                    <div>
                      <span className="cm-info-label">Phone</span>
                      <span className="cm-info-value">
                        {selectedCustomer.phone || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="cm-detail-info-item cm-info-full">
                    <div className="cm-info-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <span className="cm-info-label">Address</span>
                      <span className="cm-info-value">
                        {selectedCustomer.address || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta */}
              {selectedCustomer.createdAt && (
                <div className="cm-detail-meta">
                  <div className="cm-meta-item">
                    <FaCalendarAlt />
                    <span>
                      Customer since{" "}
                      {new Date(selectedCustomer.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="cm-modal-actions">
              <button
                className="cm-btn-secondary"
                onClick={() => handleDelete(selectedCustomer._id)}
              >
                <FaTrash /> Delete
              </button>
              <button
                className="cm-btn-primary"
                onClick={() => handleEdit(selectedCustomer)}
              >
                <FaEdit /> Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;