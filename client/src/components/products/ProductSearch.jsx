/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaTimes,
  FaEye,
  FaEdit,
  FaThLarge,
  FaList,
  FaTag,
  FaCube,
  FaDollarSign,
  FaBoxOpen,
  FaCalendarAlt,
  FaChevronRight,
  FaArrowLeft,
  FaShareAlt,
  FaStar,
  FaComment,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";
import ReviewForm from "../reviews/ReviewForm";
import { useAppContext } from "../../context/AppContext";
import "../../styles/ProductSearch.css";

const ProductSearch = () => {
  const navigate = useNavigate();
  const { cachedProducts, fetchProducts: fetchCachedProducts } = useAppContext();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data;
      // Use cached products if available
      if (cachedProducts.length > 0) {
        data = cachedProducts;
      } else {
        data = await fetchCachedProducts();
      }
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      const reviewData = response.data?.data || response.data || [];
      setReviews(reviewData);
      
      // Calculate average rating
      if (reviewData.length > 0) {
        const avg = reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length;
        setAverageRating(Math.round(avg * 10) / 10);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setAverageRating(0);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price-low") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price-high") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "stock-low") {
      result.sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0));
    } else if (sort === "stock-high") {
      result.sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0));
    }

    return result;
  }, [products, searchTerm, category, sort]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => (p.stockQuantity || 0) > 10).length;
    const low = products.filter(
      (p) => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) <= 10
    ).length;
    const out = products.filter((p) => (p.stockQuantity || 0) === 0).length;
    return { total, inStock, low, out };
  }, [products]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setSort("");
  };

  const hasActiveFilters =
    searchTerm !== "" || category !== "All" || sort !== "";

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
    setShowReviews(false);
    fetchReviews(product._id);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setShowReviewModal(false);
    setShowReviews(false);
    setTimeout(() => setSelectedProduct(null), 200);
  };

  const handleEditClick = () => {
    if (selectedProduct) {
      closeDetailModal();
      navigate("/inventory", {
        state: {
          editProduct: selectedProduct,
          openEdit: true,
        },
      });
    }
  };

  const handleOpenReviewForm = () => {
    setShowReviewModal(true);
  };

  const handleReviewSuccess = (newReview) => {
    setReviews([newReview, ...reviews]);
    const allReviews = [newReview, ...reviews];
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    setAverageRating(Math.round(avg * 10) / 10);
    toast.success("Review added successfully!");
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const getStockStatus = (quantity) => {
    if (quantity > 10)
      return { label: "In Stock", variant: "in", icon: "✅" };
    if (quantity > 0)
      return { label: "Low Stock", variant: "low", icon: "⚠️" };
    return { label: "Out of Stock", variant: "out", icon: "❌" };
  };

  const calculateProfitMargin = (price, cost) => {
    if (!price || !cost) return 0;
    return (((price - cost) / price) * 100).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star-half" />);
      } else {
        stars.push(<FaStar key={i} className="star-empty" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="ps-wrapper">
        <div className="ps-topbar">
          <div className="ps-topbar-left">
            <div className="ps-skeleton ps-skel-title" />
            <div className="ps-skeleton ps-skel-sub" />
          </div>
        </div>
        <div className="ps-stats-row">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="ps-skeleton ps-skel-stat" />
          ))}
        </div>
        <div className="ps-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="ps-skeleton ps-skel-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ps-wrapper">
      {/* ── Top Bar ── */}
      <header className="ps-topbar">
        <div className="ps-topbar-left">
          <button
            className="ps-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="ps-title">
              <span className="ps-title-icon">
                <FaSearch />
              </span>
              Product Search
            </h1>
            <p className="ps-subtitle">
              Discover and explore your product catalog
            </p>
          </div>
        </div>
      </header>

      {/* ── Stats Row ── */}
      <section className="ps-stats-row" aria-label="Product statistics">
        <div className="ps-stat">
          <div className="ps-stat-icon ps-stat-icon--blue">
            <FaBoxOpen />
          </div>
          <div>
            <div className="ps-stat-value">{stats.total}</div>
            <div className="ps-stat-label">Total Products</div>
          </div>
        </div>
        <div className="ps-stat">
          <div className="ps-stat-icon ps-stat-icon--emerald">
            <FaCube />
          </div>
          <div>
            <div className="ps-stat-value">{stats.inStock}</div>
            <div className="ps-stat-label">In Stock</div>
          </div>
        </div>
        <div className="ps-stat">
          <div className="ps-stat-icon ps-stat-icon--amber">
            <FaTag />
          </div>
          <div>
            <div className="ps-stat-value">{stats.low}</div>
            <div className="ps-stat-label">Low Stock</div>
          </div>
        </div>
        <div className="ps-stat">
          <div className="ps-stat-icon ps-stat-icon--red">
            <FaTimes />
          </div>
          <div>
            <div className="ps-stat-value">{stats.out}</div>
            <div className="ps-stat-label">Out of Stock</div>
          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="ps-toolbar" aria-label="Search and filter">
        <div className="ps-search-box">
          <FaSearch className="ps-search-icon" />
          <input
            type="text"
            placeholder="Search by name, SKU, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-search-input"
          />
          {searchTerm && (
            <button
              className="ps-search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="ps-filters">
          <div className="ps-select-wrap">
            <FaFilter className="ps-select-icon" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="ps-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="ps-select-wrap">
            <FaSort className="ps-select-icon" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ps-select"
            >
              <option value="">Sort by</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="stock-low">Stock: Low → High</option>
              <option value="stock-high">Stock: High → Low</option>
            </select>
          </div>

          <div className="ps-view-toggle" role="group">
            <button
              className={`ps-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <FaThLarge />
            </button>
            <button
              className={`ps-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <FaList />
            </button>
          </div>
        </div>
      </section>

      {/* ── Results Bar ── */}
      <div className="ps-results-bar">
        <div className="ps-results-info">
          <span className="ps-results-count">
            <strong>{filteredProducts.length}</strong> product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </span>
          {hasActiveFilters && (
            <div className="ps-active-filters">
              {searchTerm && (
                <span className="ps-filter-chip">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {category !== "All" && (
                <span className="ps-filter-chip">
                  Category: {category}
                  <button onClick={() => setCategory("All")}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {sort && (
                <span className="ps-filter-chip">
                  Sorted
                  <button onClick={() => setSort("")}>
                    <FaTimes />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        {hasActiveFilters && (
          <button className="ps-clear-all" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>

      {/* ── Products Display ── */}
      {filteredProducts.length === 0 ? (
        <div className="ps-empty">
          <div className="ps-empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>
            {hasActiveFilters
              ? "Try adjusting your search or filters"
              : "No products available in your catalog"}
          </p>
          {hasActiveFilters && (
            <button className="ps-empty-action" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <section className="ps-grid" aria-label="Products grid">
          {filteredProducts.map((product, i) => {
            const status = getStockStatus(product.stockQuantity || 0);
            return (
              <article
                key={product._id}
                className="ps-card"
                onClick={() => handleProductClick(product)}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="ps-card-media">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="ps-card-placeholder">
                      <FaCube />
                    </div>
                  )}
                  <div className={`ps-card-badge ps-badge--${status.variant}`}>
                    <span className="ps-badge-dot" />
                    {status.label}
                  </div>
                  <div className="ps-card-overlay">
                    <button className="ps-quick-view">
                      <FaEye /> Quick View
                    </button>
                  </div>
                </div>

                <div className="ps-card-body">
                  <div className="ps-card-cat">
                    <FaTag />
                    <span>{product.category || "Uncategorized"}</span>
                  </div>
                  <h3 className="ps-card-name" title={product.name}>
                    {product.name}
                  </h3>
                  {product.sku && (
                    <div className="ps-card-sku">{product.sku}</div>
                  )}

                  <div className="ps-card-footer">
                    <div className="ps-card-price">
                      {formatCurrency(product.price)}
                    </div>
                    <div
                      className={`ps-card-stock ps-stock--${status.variant}`}
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
        <section className="ps-list" aria-label="Products list">
          {filteredProducts.map((product, i) => {
            const status = getStockStatus(product.stockQuantity || 0);
            return (
              <div
                key={product._id}
                className="ps-list-row"
                onClick={() => handleProductClick(product)}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="ps-list-thumb">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <FaCube />
                  )}
                </div>

                <div className="ps-list-info">
                  <div className="ps-list-top">
                    <h3 className="ps-list-name">{product.name}</h3>
                    <span
                      className={`ps-status-pill ps-status--${status.variant}`}
                    >
                      <span className="ps-status-dot" />
                      {status.label}
                    </span>
                  </div>
                  <div className="ps-list-meta">
                    <span className="ps-list-cat">
                      <FaTag /> {product.category || "Uncategorized"}
                    </span>
                    {product.sku && (
                      <span className="ps-list-sku">SKU: {product.sku}</span>
                    )}
                    {product.description && (
                      <span className="ps-list-desc">
                        {product.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ps-list-metrics">
                  <div className="ps-list-metric">
                    <span className="ps-metric-label">Price</span>
                    <span className="ps-metric-value ps-metric-value--price">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <div className="ps-list-metric">
                    <span className="ps-metric-label">Stock</span>
                    <span
                      className={`ps-metric-value ps-stock-num ps-stock--${status.variant}`}
                    >
                      {product.stockQuantity || 0}
                    </span>
                  </div>
                </div>

                <FaChevronRight className="ps-list-chevron" />
              </div>
            );
          })}
        </section>
      )}

      {/* ── Product Detail Modal ── */}
      {showDetailModal && selectedProduct && (
        <div
          className="ps-modal-overlay"
          onClick={closeDetailModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="ps-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="ps-modal-head">
              <div className="ps-modal-head-left">
                <span
                  className={`ps-modal-badge ps-badge--${
                    getStockStatus(selectedProduct.stockQuantity).variant
                  }`}
                >
                  <span className="ps-badge-dot" />
                  {getStockStatus(selectedProduct.stockQuantity).label}
                </span>
                <h2>Product Details</h2>
              </div>
              <div className="ps-modal-head-right">
                <button
                  className="ps-modal-action"
                  title="Share"
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <FaShareAlt />
                </button>
                <button
                  className="ps-modal-close"
                  onClick={closeDetailModal}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="ps-modal-body">
              <div className="ps-detail-image">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                  />
                ) : (
                  <div className="ps-detail-placeholder">
                    <FaCube />
                    <span>No image available</span>
                  </div>
                )}
              </div>

              <div className="ps-detail-info">
                <div className="ps-detail-cat">
                  <FaTag />
                  {selectedProduct.category || "Uncategorized"}
                </div>
                <h3 className="ps-detail-name">{selectedProduct.name}</h3>
                {selectedProduct.sku && (
                  <div className="ps-detail-sku">
                    SKU: <span>{selectedProduct.sku}</span>
                  </div>
                )}

                <div className="ps-detail-price-box">
                  <div className="ps-detail-price">
                    {formatCurrency(selectedProduct.price)}
                  </div>
                  {selectedProduct.costPrice > 0 && (
                    <div className="ps-detail-price-meta">
                      <span>
                        Cost: {formatCurrency(selectedProduct.costPrice)}
                      </span>
                      <span className="ps-margin-badge">
                        {calculateProfitMargin(
                          selectedProduct.price,
                          selectedProduct.costPrice
                        )}
                        % margin
                      </span>
                    </div>
                  )}
                </div>

                <div className="ps-detail-metrics">
                  <div className="ps-detail-metric">
                    <div className="ps-detail-metric-icon">
                      <FaCube />
                    </div>
                    <div>
                      <span className="ps-detail-metric-label">
                        In Stock
                      </span>
                      <span className="ps-detail-metric-value">
                        {selectedProduct.stockQuantity || 0} units
                      </span>
                    </div>
                  </div>
                  <div className="ps-detail-metric">
                    <div className="ps-detail-metric-icon">
                      <FaTag />
                    </div>
                    <div>
                      <span className="ps-detail-metric-label">
                        Min Stock
                      </span>
                      <span className="ps-detail-metric-value">
                        {selectedProduct.minStock || 10} units
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="ps-detail-reviews">
                  <div className="ps-reviews-header">
                    <button
                      className="ps-reviews-toggle"
                      onClick={() => setShowReviews(!showReviews)}
                    >
                      <FaComment /> Reviews ({reviews.length})
                      {averageRating > 0 && (
                        <span className="ps-average-rating">
                          {renderStars(averageRating)} {averageRating}
                        </span>
                      )}
                    </button>
                    <button
                      className="ps-write-review-btn"
                      onClick={handleOpenReviewForm}
                    >
                      <FaStar /> Write Review
                    </button>
                  </div>

                  {showReviews && (
                    <div className="ps-reviews-list">
                      {reviews.length === 0 ? (
                        <p className="ps-no-reviews">No reviews yet. Be the first to review!</p>
                      ) : (
                        reviews.slice(0, 5).map((review) => (
                          <div key={review._id} className="ps-review-item">
                            <div className="ps-review-header">
                              <span className="ps-review-user">{review.userName || 'Anonymous'}</span>
                              <span className="ps-review-rating">
                                {renderStars(review.rating)}
                              </span>
                            </div>
                            <p className="ps-review-comment">{review.comment}</p>
                            <span className="ps-review-date">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        ))
                      )}
                      {reviews.length > 5 && (
                        <button className="ps-view-all-reviews">
                          View all {reviews.length} reviews
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {selectedProduct.description && (
                  <div className="ps-detail-desc">
                    <h4>Description</h4>
                    <p>{selectedProduct.description}</p>
                  </div>
                )}

                <div className="ps-detail-meta">
                  <div className="ps-detail-meta-item">
                    <FaCalendarAlt />
                    <span>
                      Created{" "}
                      {new Date(
                        selectedProduct.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="ps-detail-meta-item">
                    <FaCalendarAlt />
                    <span>
                      Updated{" "}
                      {new Date(
                        selectedProduct.updatedAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="ps-modal-actions">
              <button
                className="ps-btn-secondary"
                onClick={closeDetailModal}
              >
                Close
              </button>
              <button className="ps-btn-primary" onClick={handleEditClick}>
                <FaEdit /> Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Review Form Modal ── */}
      {showReviewModal && selectedProduct && (
        <div
          className="ps-modal-overlay"
          onClick={() => setShowReviewModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="ps-modal ps-review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ps-modal-head">
              <div className="ps-modal-head-left">
                <h2>Review Product</h2>
                <p className="ps-review-product-name">{selectedProduct.name}</p>
              </div>
              <button
                className="ps-modal-close"
                onClick={() => setShowReviewModal(false)}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <ReviewForm
              productId={selectedProduct._id}
              onSuccess={handleReviewSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;