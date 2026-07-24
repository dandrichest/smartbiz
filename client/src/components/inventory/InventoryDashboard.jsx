/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPlus,
  FaBox,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUpload,
  FaImage,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaSort,
  FaThLarge,
  FaList,
  FaEllipsisV,
  FaBoxOpen,
  FaTag,
  FaDollarSign,
  FaCube,
} from "react-icons/fa";
import api from "../../api";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import "../../styles/InventoryDashboard.css";

const InventoryDashboard = () => {
  const location = useLocation();
  const { setLoading, refreshProducts } = useAppContext();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    costPrice: "",
    minStock: "",
    category: "",
    sku: "",
    image: "",
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      const productData = response.data?.data || response.data || [];
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Check if we came from ProductSearch with edit intent
  useEffect(() => {
    if (location.state?.editProduct && location.state?.openEdit) {
      const product = location.state.editProduct;
      openEditForm(product);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
        setIsUploading(false);
        toast.success("Image uploaded successfully!");
      };
      reader.onerror = () => {
        toast.error("Failed to read image");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleDownloadImage = async () => {
    const url = formData.image;
    if (!url) {
      toast.error("Please enter an image URL first");
      return;
    }
    setIsUploading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
        setIsUploading(false);
        toast.success("Image downloaded successfully!");
      };
      reader.onerror = () => {
        toast.error("Failed to convert image");
        setIsUploading(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. Please check the URL.");
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      costPrice: "",
      minStock: "",
      category: "",
      sku: "",
      image: "",
    });
    setImagePreview("");
    setEditingProduct(null);
    setShowForm(false);
    setIsSubmitting(false);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stockQuantity: product.stockQuantity || "",
      costPrice: product.costPrice || "",
      minStock: product.minStock || "",
      category: product.category || "",
      sku: product.sku || "",
      image: product.image || "",
    });
    setImagePreview(product.image || "");
    setShowForm(true);
    setActiveMenu(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        toast.error("Product name is required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error("Please enter a valid price");
        setIsSubmitting(false);
        return;
      }
      if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
        toast.error("Please enter a valid stock quantity");
        setIsSubmitting(false);
        return;
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        costPrice:
          parseFloat(formData.costPrice) || parseFloat(formData.price) * 0.7,
        minStock: parseInt(formData.minStock) || 10,
        category: formData.category?.trim() || "Uncategorized",
        sku: formData.sku?.trim() || "",
        image: formData.image || "",
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
        toast.success("Product updated successfully!");
      } else {
        await api.post("/products", productData);
        toast.success("Product added successfully!");
      }

      // ✅ Refresh cache and fetch products
      await refreshProducts();
      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to save product";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setLoading(true);
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully!");
      
      // ✅ Refresh cache and fetch products
      await refreshProducts();
      await fetchProducts();
      setActiveMenu(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // ─── Stats ───
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => (p.stockQuantity || 0) > 10).length;
    const low = products.filter(
      (p) => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) <= 10
    ).length;
    const out = products.filter((p) => (p.stockQuantity || 0) === 0).length;
    return { total, inStock, low, out };
  }, [products]);

  const statsData = [
    {
      title: "Total Products",
      value: stats.total,
      icon: FaBox,
      variant: "blue",
      subtitle: "In catalog",
    },
    {
      title: "In Stock",
      value: stats.inStock,
      icon: FaCheckCircle,
      variant: "emerald",
      subtitle: "Ready to sell",
    },
    {
      title: "Low Stock",
      value: stats.low,
      icon: FaExclamationTriangle,
      variant: "amber",
      subtitle: "Needs restock",
    },
    {
      title: "Out of Stock",
      value: stats.out,
      icon: FaTimesCircle,
      variant: "red",
      subtitle: "Unavailable",
    },
  ];

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = search.toLowerCase();
        const matchesSearch =
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          false;
        const matchesCategory = category === "All" || p.category === category;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === "name") return a.name?.localeCompare(b.name || "") || 0;
        if (sort === "price-low") return (a.price || 0) - (b.price || 0);
        if (sort === "price-high") return (b.price || 0) - (a.price || 0);
        if (sort === "stock-low")
          return (a.stockQuantity || 0) - (b.stockQuantity || 0);
        if (sort === "stock-high")
          return (b.stockQuantity || 0) - (a.stockQuantity || 0);
        return 0;
      });
  }, [products, search, category, sort]);

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: "Out of Stock", variant: "out", icon: "❌" };
    if (qty <= 10) return { label: "Low Stock", variant: "low", icon: "⚠️" };
    return { label: "In Stock", variant: "in", icon: "✅" };
  };

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt || 0);

  const clearSearch = () => setSearch("");

  return (
    <div className="inv-wrapper">
      {/* ── Top Header ── */}
      <header className="inv-topbar">
        <div className="inv-topbar-left">
          <h1 className="inv-title">
            <span className="inv-title-icon">
              <FaBoxOpen />
            </span>
            Inventory
          </h1>
          <p className="inv-subtitle">
            Manage your product catalog and stock levels
          </p>
        </div>

        <button className="inv-add-btn" onClick={openAddForm}>
          <FaPlus />
          <span>Add Product</span>
        </button>
      </header>

      {/* ── Stats Row ── */}
      <section className="inv-stats-row" aria-label="Inventory statistics">
        {statsData.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`inv-stat-card inv-stat-card--${stat.variant}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`inv-stat-icon inv-stat-icon--${stat.variant}`}>
                <Icon />
              </div>
              <div className="inv-stat-body">
                <div className="inv-stat-value">{stat.value}</div>
                <div className="inv-stat-label">{stat.title}</div>
                <div className="inv-stat-sub">{stat.subtitle}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Toolbar (Search / Filters / View) ── */}
      <section className="inv-toolbar" aria-label="Search and filter">
        <div className="inv-toolbar-search">
          <FaSearch className="inv-search-icon" />
          <input
            type="text"
            placeholder="Search by name, SKU, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="inv-search-input"
          />
          {search && (
            <button
              className="inv-search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="inv-toolbar-filters">
          <div className="inv-select-wrap">
            <FaFilter className="inv-select-icon" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="inv-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="inv-select-wrap">
            <FaSort className="inv-select-icon" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="inv-select"
            >
              <option value="">Sort by</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="stock-low">Stock: Low → High</option>
              <option value="stock-high">Stock: High → Low</option>
            </select>
          </div>

          <div className="inv-view-toggle" role="group">
            <button
              className={`inv-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              title="Grid view"
            >
              <FaThLarge />
            </button>
            <button
              className={`inv-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
              title="List view"
            >
              <FaList />
            </button>
          </div>
        </div>
      </section>

      {/* ── Result count ── */}
      <div className="inv-results-bar">
        <span className="inv-results-count">
          <strong>{filteredProducts.length}</strong> of{" "}
          <strong>{products.length}</strong> products
        </span>
        {(search || category !== "All" || sort) && (
          <button
            className="inv-clear-filters"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setSort("");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Product Display ── */}
      {filteredProducts.length === 0 ? (
        <div className="inv-empty">
          <div className="inv-empty-icon">📦</div>
          <h3>No products found</h3>
          <p>
            {search || category !== "All"
              ? "Try adjusting your search or filters"
              : 'Click "Add Product" to get started'}
          </p>
          {!search && category === "All" && (
            <button className="inv-empty-action" onClick={openAddForm}>
              <FaPlus /> Add Your First Product
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <section className="inv-grid" aria-label="Products grid">
          {filteredProducts.map((product, i) => {
            const status = getStockStatus(product.stockQuantity || 0);
            return (
              <article
                key={product._id}
                className="inv-card"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="inv-card-media">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="inv-card-placeholder">
                      <FaCube />
                    </div>
                  )}
                  <div className={`inv-card-status inv-status--${status.variant}`}>
                    <span className="inv-status-dot" />
                    {status.label}
                  </div>

                  <div className="inv-card-menu">
                    <button
                      className="inv-menu-btn"
                      onClick={() =>
                        setActiveMenu(activeMenu === product._id ? null : product._id)
                      }
                      aria-label="More actions"
                    >
                      <FaEllipsisV />
                    </button>
                    {activeMenu === product._id && (
                      <div
                        className="inv-menu-dropdown"
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        <button onClick={() => openEditForm(product)}>
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="danger"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="inv-card-body">
                  <div className="inv-card-cat">
                    <FaTag /> {product.category || "Uncategorized"}
                  </div>
                  <h3 className="inv-card-name" title={product.name}>
                    {product.name}
                  </h3>
                  {product.sku && (
                    <div className="inv-card-sku">SKU: {product.sku}</div>
                  )}

                  <div className="inv-card-footer">
                    <div className="inv-card-price">
                      {formatCurrency(product.price)}
                    </div>
                    <div
                      className={`inv-card-stock inv-stock--${status.variant}`}
                    >
                      <FaCube />
                      <span>{product.stockQuantity || 0}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="inv-list" aria-label="Products list">
          <div className="inv-list-head">
            <div>Product</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Status</div>
            <div className="inv-list-actions-head">Actions</div>
          </div>
          {filteredProducts.map((product, i) => {
            const status = getStockStatus(product.stockQuantity || 0);
            return (
              <div
                key={product._id}
                className="inv-list-row"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="inv-list-cell inv-list-cell--product">
                  <div className="inv-list-thumb">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <FaCube />
                    )}
                  </div>
                  <div className="inv-list-info">
                    <div className="inv-list-name">{product.name}</div>
                    <div className="inv-list-sku">
                      SKU: {product.sku || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="inv-list-cell" data-label="Category">
                  <span className="inv-cat-chip">
                    {product.category || "Uncategorized"}
                  </span>
                </div>

                <div
                  className="inv-list-cell inv-list-price"
                  data-label="Price"
                >
                  {formatCurrency(product.price)}
                </div>

                <div className="inv-list-cell" data-label="Stock">
                  <span className={`inv-stock-pill inv-stock--${status.variant}`}>
                    {product.stockQuantity || 0}
                  </span>
                </div>

                <div className="inv-list-cell" data-label="Status">
                  <span className={`inv-status-pill inv-status--${status.variant}`}>
                    <span className="inv-status-dot" />
                    {status.label}
                  </span>
                </div>

                <div className="inv-list-cell inv-list-actions">
                  <button
                    className="inv-icon-btn edit"
                    onClick={() => openEditForm(product)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="inv-icon-btn delete"
                    onClick={() => handleDelete(product._id)}
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

      {/* ── Modal ── */}
      {showForm && (
        <div className="inv-modal-overlay" onClick={resetForm}>
          <div
            className="inv-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="inv-modal-head">
              <div className="inv-modal-head-left">
                <div className="inv-modal-head-icon">
                  {editingProduct ? <FaEdit /> : <FaPlus />}
                </div>
                <div>
                  <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                  <p>
                    {editingProduct
                      ? "Update product information"
                      : "Fill in the details to add a new product"}
                  </p>
                </div>
              </div>
              <button
                className="inv-modal-close"
                onClick={resetForm}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="inv-modal-form">
              {/* Image upload */}
              <div className="inv-form-group">
                <label>Product Image</label>
                <div className="inv-image-upload">
                  <div className="inv-image-preview">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" />
                    ) : (
                      <div className="inv-image-placeholder">
                        <FaImage />
                        <span>No image</span>
                      </div>
                    )}
                  </div>

                  <div className="inv-image-controls">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="inv-upload-btn">
                      <FaUpload /> Upload Image
                    </label>
                    <div className="inv-url-row">
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleImageUrlChange}
                        placeholder="Or paste image URL..."
                        className="inv-url-input"
                      />
                      <button
                        type="button"
                        className="inv-url-btn"
                        onClick={handleDownloadImage}
                        disabled={!formData.image || isUploading}
                      >
                        {isUploading ? (
                          <FaSpinner className="inv-spinner" />
                        ) : (
                          "Fetch"
                        )}
                      </button>
                    </div>
                    <p className="inv-hint">Max 5MB · JPG, PNG, WebP</p>
                  </div>
                </div>
              </div>

              <div className="inv-form-divider" />

              <div className="inv-form-group">
                <label>
                  Product Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </div>

              <div className="inv-form-row">
                <div className="inv-form-group">
                  <label>
                    Price <span className="req">*</span>
                  </label>
                  <div className="inv-input-icon">
                    <FaDollarSign />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="inv-form-group">
                  <label>
                    Stock Quantity <span className="req">*</span>
                  </label>
                  <div className="inv-input-icon">
                    <FaCube />
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="inv-form-row">
                <div className="inv-form-group">
                  <label>Cost Price</label>
                  <div className="inv-input-icon">
                    <FaDollarSign />
                    <input
                      type="number"
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="inv-form-group">
                  <label>Min Stock Alert</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="0"
                  />
                </div>
              </div>

              <div className="inv-form-row">
                <div className="inv-form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Electronics"
                  />
                </div>
                <div className="inv-form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="e.g. WH-001"
                  />
                </div>
              </div>

              <div className="inv-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief product description..."
                  rows="3"
                />
              </div>

              <div className="inv-modal-actions">
                <button
                  type="button"
                  className="inv-btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inv-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="inv-spinner" /> Saving...
                    </>
                  ) : editingProduct ? (
                    <>
                      <FaEdit /> Update Product
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;