/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from "react";
import {
  FaShoppingCart,
  FaUser,
  FaBox,
  FaSearch,
  FaCheckCircle,
  FaTimes,
  FaMinus,
  FaPlus,
  FaMoneyBillWave,
  FaCreditCard,
  FaExchangeAlt,
  FaPaypal,
  FaMobileAlt,
  FaReceipt,
  FaSpinner,
  FaSignOutAlt,
  FaCube,
  FaEnvelope,
  FaPhone,
  FaExclamationTriangle,
  FaPrint,
  FaTag,
} from "react-icons/fa";
import "../../styles/SalesRecord.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: FaMoneyBillWave, color: "emerald" },
  { id: "credit", label: "Credit", icon: FaCreditCard, color: "blue" },
  { id: "debit", label: "Debit", icon: FaCreditCard, color: "violet" },
  { id: "transfer", label: "Transfer", icon: FaExchangeAlt, color: "amber" },
  { id: "paypal", label: "PayPal", icon: FaPaypal, color: "blue" },
  { id: "pos", label: "POS", icon: FaMobileAlt, color: "violet" },
];

const SalesRecord = ({ onLogout }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customers`);
      if (!res.ok) throw new Error("Unable to load customers");
      const data = await res.json();
      setCustomers(data?.data || data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error("Unable to load products");
      const data = await res.json();
      setProducts(data?.data || data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    Promise.all([loadCustomers(), loadProducts()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // ── Filtered lists ──
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers.slice(0, 8);
    const q = customerSearch.toLowerCase();
    return customers
      .filter(
        (c) =>
          c.firstName?.toLowerCase().includes(q) ||
          c.lastName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q)
      )
      .slice(0, 8);
  }, [customers, customerSearch]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products.slice(0, 8);
    const q = productSearch.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [products, productSearch]);

  // ── Derived values ──
  const stockAvailable = selectedProduct
    ? selectedProduct.quantity || selectedProduct.stockQuantity || 0
    : 0;

  const unitPrice = selectedProduct?.price || 0;
  const subtotal = unitPrice * quantity;
  const tax = 0; // Add tax logic if needed
  const total = subtotal + tax;

  const canSubmit =
    selectedCustomer &&
    selectedProduct &&
    quantity > 0 &&
    quantity <= stockAvailable &&
    !isSubmitting;

  const isStockLow = stockAvailable > 0 && stockAvailable <= 10;
  const isOutOfStock = stockAvailable === 0;

  // ── Helpers ──
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const getInitials = (customer) => {
    if (!customer) return "U";
    const f = customer.firstName || "";
    const l = customer.lastName || "";
    if (f && l) return (f[0] + l[0]).toUpperCase();
    if (f) return f[0].toUpperCase();
    return "U";
  };

  const getCustomerName = (customer) => {
    if (!customer) return "";
    return `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
  };

  const getAvatarGradient = (id) => {
    const gradients = [
      "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      "linear-gradient(135deg, #10b981, #14b8a6)",
      "linear-gradient(135deg, #f59e0b, #ef4444)",
      "linear-gradient(135deg, #ec4899, #8b5cf6)",
      "linear-gradient(135deg, #06b6d4, #3b82f6)",
      "linear-gradient(135deg, #84cc16, #10b981)",
    ];
    const str = id?.toString() || "0";
    const hash = str
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const incrementQty = () => {
    if (quantity < stockAvailable) setQuantity(quantity + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQtyChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    if (val >= 0 && val <= stockAvailable) setQuantity(val);
  };

  const handleReset = () => {
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setQuantity(1);
    setPaymentMethod("cash");
    setCustomerSearch("");
    setProductSearch("");
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!canSubmit) {
      setError("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomer._id,
          productId: selectedProduct._id,
          quantitySold: Number(quantity),
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Failed to record sale");
      }

      const result = await res.json();

      // Build receipt data
      setReceiptData({
        customer: selectedCustomer,
        product: selectedProduct,
        quantity,
        paymentMethod,
        unitPrice,
        subtotal,
        tax,
        total,
        timestamp: new Date(),
        transactionId: result.data?._id || result._id || `TXN-${Date.now()}`,
      });

      setMessage(result.message || "Sale recorded successfully!");
      setShowReceipt(true);

      // Refresh products to update stock
      await loadProducts();

      // Reset form after showing receipt
      setTimeout(() => {
        handleReset();
      }, 500);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setTimeout(() => setReceiptData(null), 300);
  };

  const printReceipt = () => {
    window.print();
  };

  const selectedPaymentMethod = PAYMENT_METHODS.find(
    (p) => p.id === paymentMethod
  );

  if (loading) {
    return (
      <div className="sr-wrapper">
        <div className="sr-loading">
          <FaSpinner className="sr-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sr-wrapper">
      {/* ── Top Bar ── */}
      <header className="sr-topbar">
        <div className="sr-topbar-left">
          <h1 className="sr-title">
            <span className="sr-title-icon">
              <FaShoppingCart />
            </span>
            New Sale
          </h1>
          <p className="sr-subtitle">
            Record a transaction and generate receipt
          </p>
        </div>
        {onLogout && (
          <button className="sr-logout" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        )}
      </header>

      {/* Error banner */}
      {error && (
        <div className="sr-alert sr-alert--error">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <FaTimes />
          </button>
        </div>
      )}

      <div className="sr-layout">
        {/* ── Main form ── */}
        <div className="sr-main">
          {/* STEP 1: Customer */}
          <div className="sr-step">
            <div className="sr-step-header">
              <div className="sr-step-number">1</div>
              <div>
                <h3>Select Customer</h3>
                <p>Choose who is making this purchase</p>
              </div>
              {selectedCustomer && (
                <div className="sr-step-check">
                  <FaCheckCircle />
                </div>
              )}
            </div>

            {selectedCustomer ? (
              <div className="sr-selected-customer">
                <div
                  className="sr-selected-avatar"
                  style={{ background: getAvatarGradient(selectedCustomer._id) }}
                >
                  {getInitials(selectedCustomer)}
                </div>
                <div className="sr-selected-info">
                  <div className="sr-selected-name">
                    {getCustomerName(selectedCustomer)}
                  </div>
                  <div className="sr-selected-meta">
                    {selectedCustomer.email && (
                      <span>
                        <FaEnvelope /> {selectedCustomer.email}
                      </span>
                    )}
                    {selectedCustomer.phone && (
                      <span>
                        <FaPhone /> {selectedCustomer.phone}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="sr-change-btn"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setShowCustomerList(true);
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="sr-picker">
                <div className="sr-picker-search">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search customers by name, email, or phone..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerList(true);
                    }}
                    onFocus={() => setShowCustomerList(true)}
                  />
                </div>

                {(showCustomerList || customerSearch) && (
                  <div className="sr-picker-list">
                    {filteredCustomers.length === 0 ? (
                      <div className="sr-picker-empty">
                        No customers found
                      </div>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <button
                          key={customer._id}
                          className="sr-picker-item"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCustomerList(false);
                            setCustomerSearch("");
                          }}
                        >
                          <div
                            className="sr-picker-avatar"
                            style={{
                              background: getAvatarGradient(customer._id),
                            }}
                          >
                            {getInitials(customer)}
                          </div>
                          <div className="sr-picker-info">
                            <div className="sr-picker-name">
                              {getCustomerName(customer)}
                            </div>
                            <div className="sr-picker-sub">
                              {customer.email || customer.phone || "—"}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: Product */}
          <div className={`sr-step ${!selectedCustomer ? "sr-step--disabled" : ""}`}>
            <div className="sr-step-header">
              <div className="sr-step-number">2</div>
              <div>
                <h3>Choose Product</h3>
                <p>Select the item being sold</p>
              </div>
              {selectedProduct && (
                <div className="sr-step-check">
                  <FaCheckCircle />
                </div>
              )}
            </div>

            {selectedProduct ? (
              <div className="sr-selected-product">
                <div className="sr-selected-product-image">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                    />
                  ) : (
                    <FaCube />
                  )}
                </div>
                <div className="sr-selected-info">
                  <div className="sr-selected-name">{selectedProduct.name}</div>
                  <div className="sr-selected-meta">
                    {selectedProduct.category && (
                      <span>
                        <FaTag /> {selectedProduct.category}
                      </span>
                    )}
                    {selectedProduct.sku && (
                      <span>SKU: {selectedProduct.sku}</span>
                    )}
                  </div>
                  <div className="sr-selected-price">
                    {formatCurrency(unitPrice)}
                    <span
                      className={`sr-stock-pill ${
                        isOutOfStock
                          ? "sr-stock--out"
                          : isStockLow
                          ? "sr-stock--low"
                          : "sr-stock--in"
                      }`}
                    >
                      {stockAvailable} in stock
                    </span>
                  </div>
                </div>
                <button
                  className="sr-change-btn"
                  onClick={() => {
                    setSelectedProduct(null);
                    setQuantity(1);
                    setShowProductList(true);
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="sr-picker">
                <div className="sr-picker-search">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search products by name, SKU, or category..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductList(true);
                    }}
                    onFocus={() => setShowProductList(true)}
                    disabled={!selectedCustomer}
                  />
                </div>

                {(showProductList || productSearch) && selectedCustomer && (
                  <div className="sr-picker-list sr-picker-list--products">
                    {filteredProducts.length === 0 ? (
                      <div className="sr-picker-empty">
                        No products found
                      </div>
                    ) : (
                      filteredProducts.map((product) => {
                        const stock =
                          product.quantity || product.stockQuantity || 0;
                        return (
                          <button
                            key={product._id}
                            className="sr-picker-item sr-picker-item--product"
                            disabled={stock === 0}
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowProductList(false);
                              setProductSearch("");
                              setQuantity(1);
                            }}
                          >
                            <div className="sr-picker-product-image">
                              {product.image ? (
                                <img src={product.image} alt={product.name} />
                              ) : (
                                <FaCube />
                              )}
                            </div>
                            <div className="sr-picker-info">
                              <div className="sr-picker-name">
                                {product.name}
                              </div>
                              <div className="sr-picker-sub">
                                {product.category || "Uncategorized"} ·{" "}
                                {formatCurrency(product.price)}
                              </div>
                            </div>
                            <span
                              className={`sr-stock-pill sr-stock-pill--sm ${
                                stock === 0
                                  ? "sr-stock--out"
                                  : stock <= 10
                                  ? "sr-stock--low"
                                  : "sr-stock--in"
                              }`}
                            >
                              {stock === 0 ? "Out" : `${stock} left`}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 3: Quantity */}
          {selectedProduct && (
            <div className="sr-step">
              <div className="sr-step-header">
                <div className="sr-step-number">3</div>
                <div>
                  <h3>Quantity</h3>
                  <p>How many units are being purchased?</p>
                </div>
              </div>

              <div className="sr-qty-control">
                <button
                  type="button"
                  className="sr-qty-btn"
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  className="sr-qty-input"
                  value={quantity}
                  onChange={handleQtyChange}
                  min="1"
                  max={stockAvailable}
                />
                <button
                  type="button"
                  className="sr-qty-btn"
                  onClick={incrementQty}
                  disabled={quantity >= stockAvailable}
                >
                  <FaPlus />
                </button>

                <div className="sr-qty-quick">
                  {[1, 5, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`sr-qty-quick-btn ${
                        quantity === n ? "active" : ""
                      }`}
                      onClick={() => setQuantity(Math.min(n, stockAvailable))}
                      disabled={n > stockAvailable}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {isStockLow && (
                <div className="sr-warning">
                  <FaExclamationTriangle />
                  Only {stockAvailable} units left in stock
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Payment */}
          <div className="sr-step">
            <div className="sr-step-header">
              <div className="sr-step-number">4</div>
              <div>
                <h3>Payment Method</h3>
                <p>How will the customer pay?</p>
              </div>
            </div>

            <div className="sr-payment-grid">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    className={`sr-payment-btn ${
                      paymentMethod === method.id ? "active" : ""
                    } sr-payment--${method.color}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <Icon />
                    <span>{method.label}</span>
                    {paymentMethod === method.id && (
                      <div className="sr-payment-check">
                        <FaCheckCircle />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Order Summary Sidebar ── */}
        <aside className="sr-summary">
          <div className="sr-summary-head">
            <h3>
              <FaReceipt />
              Order Summary
            </h3>
          </div>

          <div className="sr-summary-body">
            {/* Customer */}
            <div className="sr-summary-section">
              <div className="sr-summary-label">Customer</div>
              {selectedCustomer ? (
                <div className="sr-summary-value">
                  {getCustomerName(selectedCustomer)}
                </div>
              ) : (
                <div className="sr-summary-empty">Not selected</div>
              )}
            </div>

            {/* Product */}
            <div className="sr-summary-section">
              <div className="sr-summary-label">Product</div>
              {selectedProduct ? (
                <div className="sr-summary-product">
                  <div className="sr-summary-product-image">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                      />
                    ) : (
                      <FaCube />
                    )}
                  </div>
                  <div className="sr-summary-product-info">
                    <div className="sr-summary-product-name">
                      {selectedProduct.name}
                    </div>
                    <div className="sr-summary-product-price">
                      {formatCurrency(unitPrice)} × {quantity}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sr-summary-empty">Not selected</div>
              )}
            </div>

            {/* Totals */}
            <div className="sr-summary-totals">
              <div className="sr-summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="sr-summary-row">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="sr-summary-row sr-summary-row--total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment */}
            {selectedPaymentMethod && (
              <div className="sr-summary-payment">
                <selectedPaymentMethod.icon />
                <span>Paying with {selectedPaymentMethod.label}</span>
              </div>
            )}
          </div>

          <div className="sr-summary-actions">
            <button
              type="button"
              className="sr-btn-secondary"
              onClick={handleReset}
              disabled={!selectedCustomer && !selectedProduct}
            >
              Clear
            </button>
            <button
              type="submit"
              className="sr-btn-primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="sr-spinner" /> Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Complete Sale
                </>
              )}
            </button>
          </div>
        </aside>
      </div>

      {/* ── Receipt Modal ── */}
      {showReceipt && receiptData && (
        <div className="sr-modal-overlay" onClick={closeReceipt}>
          <div
            className="sr-receipt"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="sr-receipt-success">
              <div className="sr-receipt-success-icon">
                <FaCheckCircle />
              </div>
              <h2>Sale Completed!</h2>
              <p>Transaction has been recorded successfully</p>
            </div>

            <div className="sr-receipt-body">
              <div className="sr-receipt-meta">
                <div>
                  <span className="sr-receipt-meta-label">Transaction ID</span>
                  <span className="sr-receipt-meta-value">
                    #{receiptData.transactionId.toString().slice(-8).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="sr-receipt-meta-label">Date</span>
                  <span className="sr-receipt-meta-value">
                    {receiptData.timestamp.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="sr-receipt-divider" />

              <div className="sr-receipt-section">
                <h4>Customer</h4>
                <div className="sr-receipt-line">
                  <span>{getCustomerName(receiptData.customer)}</span>
                </div>
                {receiptData.customer.email && (
                  <div className="sr-receipt-sub">
                    {receiptData.customer.email}
                  </div>
                )}
              </div>

              <div className="sr-receipt-divider" />

              <div className="sr-receipt-section">
                <h4>Items</h4>
                <div className="sr-receipt-item">
                  <div className="sr-receipt-item-info">
                    <div className="sr-receipt-item-name">
                      {receiptData.product.name}
                    </div>
                    <div className="sr-receipt-item-meta">
                      {receiptData.quantity} × {formatCurrency(receiptData.unitPrice)}
                    </div>
                  </div>
                  <div className="sr-receipt-item-total">
                    {formatCurrency(receiptData.subtotal)}
                  </div>
                </div>
              </div>

              <div className="sr-receipt-divider" />

              <div className="sr-receipt-totals">
                <div className="sr-receipt-total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(receiptData.subtotal)}</span>
                </div>
                <div className="sr-receipt-total-row">
                  <span>Tax</span>
                  <span>{formatCurrency(receiptData.tax)}</span>
                </div>
                <div className="sr-receipt-total-row sr-receipt-total-row--grand">
                  <span>Total Paid</span>
                  <span>{formatCurrency(receiptData.total)}</span>
                </div>
              </div>

              <div className="sr-receipt-payment">
                {(() => {
                  const method = PAYMENT_METHODS.find(
                    (p) => p.id === receiptData.paymentMethod
                  );
                  const Icon = method?.icon || FaCreditCard;
                  return (
                    <>
                      <Icon /> Paid via {method?.label || receiptData.paymentMethod}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="sr-receipt-actions">
              <button className="sr-btn-secondary" onClick={printReceipt}>
                <FaPrint /> Print
              </button>
              <button className="sr-btn-primary" onClick={closeReceipt}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesRecord;