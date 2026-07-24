/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaReceipt,
  FaUser,
  FaSearch,
  FaShoppingCart,
  FaWallet,
  FaTimes,
  FaCube,
  FaCheckCircle,
  FaMoneyBillWave,
  FaCreditCard,
  FaExchangeAlt,
  FaMobileAlt,
  FaPaypal,
  FaTag,
  FaSpinner,
  FaExclamationTriangle,
  FaPrint,
  FaTh,
  FaBoxOpen,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import api from "../../api";
import toast from "react-hot-toast";
import "../../styles/SalesProcessing.css";

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: FaMoneyBillWave, color: "emerald" },
  { id: "card", label: "Card", icon: FaCreditCard, color: "blue" },
  { id: "transfer", label: "Transfer", icon: FaExchangeAlt, color: "violet" },
  { id: "pos", label: "POS", icon: FaMobileAlt, color: "amber" },
  { id: "paypal", label: "PayPal", icon: FaPaypal, color: "blue" },
];

const TAX_RATE = 0.07;

const SalesProcessing = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const { setLoading } = useAppContext();

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      const data = response.data?.data || response.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch products");
      setProducts(getDemoProducts());
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      const data = response.data?.data || response.data || [];
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      // Silent fail
    }
  };

  const getDemoProducts = () => [
    { _id: 1, name: "Premium Cotton Fabric", price: 15.99, stockQuantity: 45, category: "Fabrics" },
    { _id: 2, name: "Silk Blend Fabric", price: 29.99, stockQuantity: 12, category: "Fabrics" },
    { _id: 3, name: "Leather Wallet", price: 24.99, stockQuantity: 8, category: "Accessories" },
    { _id: 4, name: "Cotton Thread", price: 4.99, stockQuantity: 150, category: "Supplies" },
    { _id: 5, name: "Sewing Machine", price: 199.99, stockQuantity: 3, category: "Equipment" },
    { _id: 6, name: "Sewing Kit", price: 12.99, stockQuantity: 25, category: "Supplies" },
    { _id: 7, name: "Fabric Scissors", price: 18.99, stockQuantity: 15, category: "Equipment" },
    { _id: 8, name: "Measuring Tape", price: 5.99, stockQuantity: 30, category: "Supplies" },
  ];

  // Categories
  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, searchTerm, selectedCategory]);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers.slice(0, 10);
    const q = customerSearch.toLowerCase();
    return customers
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.firstName?.toLowerCase().includes(q) ||
          c.lastName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q)
      )
      .slice(0, 10);
  }, [customers, customerSearch]);

  // ── Cart calculations ──
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // ── Cart operations ──
  const addToCart = (product) => {
    const stock = product.stockQuantity || 0;
    if (stock === 0) {
      toast.error("Product out of stock");
      return;
    }

    const existing = cart.find((item) => item.product._id === product._id);
    if (existing) {
      if (existing.quantity + 1 > stock) {
        toast.error(`Only ${stock} in stock`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast.success(`${product.name} added`, { duration: 1500 });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find((i) => i.product._id === productId);
    if (!item) return;

    if (newQuantity > item.product.stockQuantity) {
      toast.error(`Only ${item.product.stockQuantity} in stock`);
      return;
    }

    setCart(
      cart.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm("Clear all items from cart?")) {
      setCart([]);
      toast.success("Cart cleared");
    }
  };

  const processSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const saleData = {
      items: cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      customerId: customer?._id || null,
      paymentMethod,
      total,
    };

    setIsProcessing(true);
    try {
      const response = await api.post("/sales", saleData);

      // Build receipt from local data (works even without backend receipt endpoint)
      const receipt = {
        receiptNumber:
          response.data?._id?.toString().slice(-8).toUpperCase() ||
          `TXN-${Date.now().toString().slice(-8)}`,
        date: new Date(),
        customer: customer,
        items: cart.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        subtotal,
        tax,
        total,
        paymentMethod,
      };

      setReceiptData(receipt);
      setShowReceipt(true);
      toast.success("Sale completed successfully!");

      // Reset
      setCart([]);
      setCustomer(null);
      fetchProducts(); // Refresh stock
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process sale");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Helpers ──
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amt || 0);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out", variant: "out" };
    if (stock <= 5) return { label: "Low", variant: "low" };
    return { label: "In Stock", variant: "in" };
  };

  const getCustomerName = (c) => {
    if (!c) return "";
    return c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim();
  };

  const getInitials = (c) => {
    if (!c) return "?";
    if (c.name) {
      const parts = c.name.trim().split(" ");
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0][0].toUpperCase();
    }
    const f = c.firstName || "";
    const l = c.lastName || "";
    if (f && l) return (f[0] + l[0]).toUpperCase();
    return f[0]?.toUpperCase() || "?";
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

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="sp-wrapper">
      {/* ── Top Bar ── */}
      <header className="sp-topbar">
        <div className="sp-topbar-left">
          <h1 className="sp-title">
            <span className="sp-title-icon">
              <FaShoppingCart />
            </span>
            Point of Sale
          </h1>
          <p className="sp-subtitle">
            Add products to cart and complete transactions
          </p>
        </div>

        <div className="sp-topbar-right">
          <div className="sp-quick-stat">
            <FaBoxOpen />
            <span>{products.length} products</span>
          </div>
          <div className="sp-quick-stat sp-quick-stat--accent">
            <FaShoppingCart />
            <span>{cartCount} in cart</span>
          </div>
        </div>
      </header>

      <div className="sp-layout">
        {/* ── LEFT: Products ── */}
        <div className="sp-products-panel">
          {/* Search */}
          <div className="sp-search-bar">
            <div className="sp-search-input-wrap">
              <FaSearch className="sp-search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sp-search-input"
              />
              {searchTerm && (
                <button
                  className="sp-search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          {categories.length > 1 && (
            <div className="sp-category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`sp-cat-tab ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "All" && <FaTh />}
                  <span>{cat}</span>
                  {cat !== "All" && (
                    <span className="sp-cat-count">
                      {products.filter((p) => p.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className="sp-empty">
              <div className="sp-empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="sp-products-grid">
              {filteredProducts.map((product, i) => {
                const stock = product.stockQuantity || 0;
                const status = getStockStatus(stock);
                const inCart = cart.find(
                  (item) => item.product._id === product._id
                );
                return (
                  <button
                    key={product._id}
                    className={`sp-product-card ${
                      stock === 0 ? "sp-product-card--disabled" : ""
                    } ${inCart ? "sp-product-card--in-cart" : ""}`}
                    onClick={() => addToCart(product)}
                    disabled={stock === 0}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="sp-product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <FaCube />
                      )}
                      <div className={`sp-product-badge sp-badge--${status.variant}`}>
                        {stock === 0 ? "Out" : stock}
                      </div>
                      {inCart && (
                        <div className="sp-in-cart-badge">
                          <FaCheckCircle /> {inCart.quantity}
                        </div>
                      )}
                    </div>
                    <div className="sp-product-body">
                      <div className="sp-product-cat">
                        <FaTag />
                        {product.category || "General"}
                      </div>
                      <div className="sp-product-name" title={product.name}>
                        {product.name}
                      </div>
                      <div className="sp-product-price">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                    <div className="sp-add-overlay">
                      <FaPlus />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT: Cart ── */}
        <aside className="sp-cart-panel">
          {/* Customer picker */}
          <div className="sp-customer-block">
            {customer ? (
              <div className="sp-customer-selected">
                <div
                  className="sp-customer-avatar"
                  style={{ background: getAvatarGradient(customer._id) }}
                >
                  {getInitials(customer)}
                </div>
                <div className="sp-customer-info">
                  <div className="sp-customer-name">
                    {getCustomerName(customer)}
                  </div>
                  <div className="sp-customer-meta">
                    {customer.phone || customer.email || "Customer"}
                  </div>
                </div>
                <button
                  className="sp-customer-remove"
                  onClick={() => setCustomer(null)}
                  aria-label="Remove customer"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <button
                className="sp-customer-add"
                onClick={() => setShowCustomerPicker(true)}
              >
                <FaUser />
                <span>Add Customer</span>
                <span className="sp-customer-optional">Optional</span>
              </button>
            )}
          </div>

          {/* Cart header */}
          <div className="sp-cart-head">
            <h3>
              <FaShoppingCart /> Cart
            </h3>
            <div className="sp-cart-head-right">
              <span className="sp-cart-count">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
              {cart.length > 0 && (
                <button className="sp-clear-cart" onClick={clearCart}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Cart items */}
          <div className="sp-cart-items">
            {cart.length === 0 ? (
              <div className="sp-cart-empty">
                <div className="sp-cart-empty-icon">🛒</div>
                <h4>Your cart is empty</h4>
                <p>Click on any product to add it</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product._id} className="sp-cart-item">
                  <div className="sp-cart-item-image">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                      />
                    ) : (
                      <FaCube />
                    )}
                  </div>

                  <div className="sp-cart-item-info">
                    <div className="sp-cart-item-name" title={item.product.name}>
                      {item.product.name}
                    </div>
                    <div className="sp-cart-item-price">
                      {formatCurrency(item.product.price)} each
                    </div>

                    <div className="sp-cart-item-controls">
                      <div className="sp-qty-group">
                        <button
                          className="sp-qty-btn"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                        >
                          <FaMinus />
                        </button>
                        <span className="sp-qty-val">{item.quantity}</span>
                        <button
                          className="sp-qty-btn"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <button
                        className="sp-cart-remove"
                        onClick={() => removeFromCart(item.product._id)}
                        aria-label="Remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="sp-cart-item-total">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment methods */}
          {cart.length > 0 && (
            <div className="sp-payment-block">
              <div className="sp-payment-label">
                <FaWallet /> Payment Method
              </div>
              <div className="sp-payment-grid">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      className={`sp-pay-btn ${
                        paymentMethod === method.id ? "active" : ""
                      } sp-pay-btn--${method.color}`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <Icon />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Totals & Submit */}
          {cart.length > 0 && (
            <div className="sp-checkout">
              <div className="sp-totals">
                <div className="sp-total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="sp-total-row">
                  <span>Tax (7%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="sp-total-row sp-total-row--grand">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                className="sp-checkout-btn"
                onClick={processSale}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="sp-spinner" /> Processing...
                  </>
                ) : (
                  <>
                    <FaReceipt /> Complete Sale · {formatCurrency(total)}
                  </>
                )}
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* ── Customer Picker Modal ── */}
      {showCustomerPicker && (
        <div
          className="sp-modal-overlay"
          onClick={() => setShowCustomerPicker(false)}
        >
          <div
            className="sp-modal sp-customer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sp-modal-head">
              <h2>
                <FaUser /> Select Customer
              </h2>
              <button
                className="sp-modal-close"
                onClick={() => setShowCustomerPicker(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="sp-modal-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="sp-customer-list">
              <button
                className="sp-customer-list-item sp-customer-walkin"
                onClick={() => {
                  setCustomer(null);
                  setShowCustomerPicker(false);
                  setCustomerSearch("");
                }}
              >
                <div className="sp-walkin-icon">
                  <FaUser />
                </div>
                <div className="sp-customer-list-info">
                  <div className="sp-customer-list-name">Walk-in Customer</div>
                  <div className="sp-customer-list-meta">
                    No customer information
                  </div>
                </div>
              </button>

              {filteredCustomers.length === 0 ? (
                <div className="sp-picker-empty">No customers found</div>
              ) : (
                filteredCustomers.map((c) => (
                  <button
                    key={c._id}
                    className="sp-customer-list-item"
                    onClick={() => {
                      setCustomer(c);
                      setShowCustomerPicker(false);
                      setCustomerSearch("");
                    }}
                  >
                    <div
                      className="sp-customer-list-avatar"
                      style={{ background: getAvatarGradient(c._id) }}
                    >
                      {getInitials(c)}
                    </div>
                    <div className="sp-customer-list-info">
                      <div className="sp-customer-list-name">
                        {getCustomerName(c)}
                      </div>
                      <div className="sp-customer-list-meta">
                        {c.email || c.phone || "—"}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Receipt Modal ── */}
      {showReceipt && receiptData && (
        <div className="sp-modal-overlay" onClick={() => setShowReceipt(false)}>
          <div
            className="sp-modal sp-receipt"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sp-receipt-hero">
              <div className="sp-receipt-check">
                <FaCheckCircle />
              </div>
              <h2>Sale Complete!</h2>
              <p>Transaction recorded successfully</p>
            </div>

            <div className="sp-receipt-body">
              <div className="sp-receipt-meta">
                <div>
                  <span className="sp-receipt-label">Receipt #</span>
                  <span className="sp-receipt-value">
                    {receiptData.receiptNumber}
                  </span>
                </div>
                <div>
                  <span className="sp-receipt-label">Date</span>
                  <span className="sp-receipt-value">
                    {receiptData.date.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="sp-receipt-divider" />

              <div className="sp-receipt-section">
                <h4>Customer</h4>
                <p>{getCustomerName(receiptData.customer) || "Walk-in Customer"}</p>
              </div>

              <div className="sp-receipt-divider" />

              <div className="sp-receipt-section">
                <h4>Items ({receiptData.items.length})</h4>
                <div className="sp-receipt-items">
                  {receiptData.items.map((item, i) => (
                    <div key={i} className="sp-receipt-item">
                      <div className="sp-receipt-item-info">
                        <div className="sp-receipt-item-name">{item.name}</div>
                        <div className="sp-receipt-item-meta">
                          {item.quantity} × {formatCurrency(item.price)}
                        </div>
                      </div>
                      <div className="sp-receipt-item-total">
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sp-receipt-divider" />

              <div className="sp-receipt-totals">
                <div className="sp-receipt-total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(receiptData.subtotal)}</span>
                </div>
                <div className="sp-receipt-total-row">
                  <span>Tax (7%)</span>
                  <span>{formatCurrency(receiptData.tax)}</span>
                </div>
                <div className="sp-receipt-total-row sp-receipt-grand">
                  <span>Total Paid</span>
                  <span>{formatCurrency(receiptData.total)}</span>
                </div>
              </div>

              <div className="sp-receipt-payment">
                {(() => {
                  const m = PAYMENT_METHODS.find(
                    (p) => p.id === receiptData.paymentMethod
                  );
                  const Icon = m?.icon || FaCreditCard;
                  return (
                    <>
                      <Icon />
                      Paid via {m?.label || receiptData.paymentMethod}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="sp-receipt-actions">
              <button className="sp-btn-secondary" onClick={printReceipt}>
                <FaPrint /> Print
              </button>
              <button
                className="sp-btn-primary"
                onClick={() => setShowReceipt(false)}
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesProcessing;