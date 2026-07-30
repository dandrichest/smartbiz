/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaUserPlus,
  FaClock,
  FaShoppingBag,
  FaChartLine,
  FaTrophy,
  FaChevronRight,
  FaCalendarAlt,
  FaLightbulb,
  FaMedal,
  FaRobot,
  FaChevronLeft,
  FaPause,
  FaPlay,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import toast from "react-hot-toast";
import LowStockProducts from "../inventory/LowStockProducts";
import "../../styles/Dashboard.css";

// ============================================================
// Constants
// ============================================================
const INITIAL_STATS = {
  totalProducts: 0,
  totalSales: 0,
  totalCustomers: 0,
  totalRevenue: 0,
  revenueGrowth: 0,
  salesGrowth: 0,
  customersGrowth: 0,
  productsGrowth: 0,
};

const MEDAL_EMOJIS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

const QUICK_ACTIONS = [
  {
    to: "/inventory",
    icon: FaPlus,
    label: "Add Product",
    description: "Create new inventory item",
    gradient: "gradient-blue",
  },
  {
    to: "/sales",
    icon: FaShoppingCart,
    label: "New Sale",
    description: "Record a transaction",
    gradient: "gradient-emerald",
  },
  {
    to: "/customers",
    icon: FaUserPlus,
    label: "Add Customer",
    description: "Register new customer",
    gradient: "gradient-violet",
  },
  {
    to: "/analytics",
    icon: FaChartLine,
    label: "Analytics",
    description: "View detailed reports",
    gradient: "gradient-amber",
  },
];

// Static business tips pool
const BUSINESS_TIPS = [
  "Bundle your top 3 products to increase average order value by up to 30%.",
  "Follow up with customers 3 days after purchase — it boosts repeat rate by 25%.",
  "Restock your best-sellers on Mondays to prep for weekly demand spikes.",
  "Adding product photos can increase conversions by up to 40%.",
  "Loyal customers spend 67% more than new ones — reward them.",
  "Send abandoned cart reminders within 1 hour for the best recovery rates.",
  "Offering free shipping over a threshold increases average order size.",
  "Post your top product on social media — visual content drives 3x engagement.",
];

const INSIGHT_ROTATION_MS = 8000;

// ============================================================
// Utilities
// ============================================================
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const formatNumber = (num) =>
  new Intl.NumberFormat("en-US").format(num ?? 0);

const getFirstName = (user) => {
  if (!user?.name) return "there";
  return user.name.trim().split(" ")[0];
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// ============================================================
// Insight Generator - Smart AI-style summaries + Tips + Milestones
// ============================================================
const generateInsights = (stats, topProducts) => {
  const insights = [];

  // ── AI-STYLE SUMMARIES (data-driven) ──
  if (stats.revenueGrowth > 0) {
    insights.push({
      type: "summary",
      icon: FaRobot,
      label: "AI Summary",
      accent: "violet",
      title: "Revenue is trending up",
      text: `Your revenue grew by ${stats.revenueGrowth}% compared to last period. ${
        stats.salesGrowth > 0
          ? `Sales volume is also up ${stats.salesGrowth}% — great momentum!`
          : "Focus on volume next to compound gains."
      }`,
    });
  } else if (stats.revenueGrowth < 0) {
    insights.push({
      type: "summary",
      icon: FaRobot,
      label: "AI Summary",
      accent: "amber",
      title: "Revenue needs attention",
      text: `Revenue dipped ${Math.abs(
        stats.revenueGrowth
      )}%. Consider running a promotion on your top products or reaching out to inactive customers.`,
    });
  }

  if (topProducts.length > 0 && topProducts[0]?.name) {
    insights.push({
      type: "summary",
      icon: FaRobot,
      label: "AI Insight",
      accent: "blue",
      title: "Your best performer",
      text: `"${topProducts[0].name}" is leading with ${formatCurrency(
        topProducts[0].revenue ?? 0
      )} in revenue. Consider featuring it prominently or bundling it with slower movers.`,
    });
  }

  if (stats.customersGrowth > 0) {
    insights.push({
      type: "summary",
      icon: FaRobot,
      label: "AI Insight",
      accent: "emerald",
      title: "Customer base is growing",
      text: `You gained ${stats.customersGrowth}% more customers recently. Now's a perfect time to build a welcome email flow to convert them into repeat buyers.`,
    });
  }

  // ── MILESTONES ──
  if (stats.totalRevenue >= 10000) {
    insights.push({
      type: "milestone",
      icon: FaMedal,
      label: "Milestone Unlocked",
      accent: "amber",
      title: "💰 $10K Revenue Club!",
      text: `Congrats! You've crossed ${formatCurrency(
        stats.totalRevenue
      )} in total revenue. Only 3% of businesses reach this level.`,
    });
  } else if (stats.totalRevenue >= 5000) {
    insights.push({
      type: "milestone",
      icon: FaMedal,
      label: "Milestone",
      accent: "amber",
      title: "🎯 Halfway to $10K",
      text: `You've earned ${formatCurrency(
        stats.totalRevenue
      )} — you're building real traction. Keep pushing!`,
    });
  } else if (stats.totalRevenue >= 1000) {
    insights.push({
      type: "milestone",
      icon: FaMedal,
      label: "Milestone",
      accent: "emerald",
      title: "🚀 First $1K Achieved",
      text: `You've hit ${formatCurrency(
        stats.totalRevenue
      )} in revenue. The hardest part is behind you.`,
    });
  }

  if (stats.totalCustomers >= 100) {
    insights.push({
      type: "milestone",
      icon: FaMedal,
      label: "Milestone",
      accent: "violet",
      title: "👥 100+ Customers",
      text: `${formatNumber(
        stats.totalCustomers
      )} customers trust your business. Consider launching a loyalty program.`,
    });
  }

  if (stats.totalSales >= 50 && stats.totalSales < 100) {
    insights.push({
      type: "milestone",
      icon: FaMedal,
      label: "Milestone",
      accent: "blue",
      title: "📦 50+ Orders Fulfilled",
      text: `Your operations are scaling. Time to review your fulfillment process for efficiency.`,
    });
  }

  if (stats.totalProducts >= 50) {
    insights.push({
      type: "milestone",
      icon: FaMedal,
      label: "Milestone",
      accent: "blue",
      title: "🏪 Rich Catalog",
      text: `${formatNumber(
        stats.totalProducts
      )} products in your inventory — you're offering real variety.`,
    });
  }

  // ── TIPS (always available as fallback) ──
  const randomTip =
    BUSINESS_TIPS[Math.floor(Math.random() * BUSINESS_TIPS.length)];
  insights.push({
    type: "tip",
    icon: FaLightbulb,
    label: "Pro Tip",
    accent: "emerald",
    title: "Grow smarter",
    text: randomTip,
  });

  // Add another random tip for variety
  const anotherTip =
    BUSINESS_TIPS[Math.floor(Math.random() * BUSINESS_TIPS.length)];
  if (anotherTip !== randomTip) {
    insights.push({
      type: "tip",
      icon: FaLightbulb,
      label: "Pro Tip",
      accent: "blue",
      title: "Try this today",
      text: anotherTip,
    });
  }

  // ── ONBOARDING / EMPTY STATE ──
  if (stats.totalSales === 0 && stats.totalProducts === 0) {
    insights.unshift({
      type: "tip",
      icon: FaLightbulb,
      label: "Getting Started",
      accent: "violet",
      title: "Welcome aboard!",
      text: "Start by adding your first product. Then record a sale to see your dashboard come alive with insights.",
    });
  } else if (stats.totalSales === 0 && stats.totalProducts > 0) {
    insights.unshift({
      type: "tip",
      icon: FaLightbulb,
      label: "Next Step",
      accent: "emerald",
      title: "You're ready to sell",
      text: `You have ${stats.totalProducts} product${
        stats.totalProducts > 1 ? "s" : ""
      } listed. Record your first sale to unlock analytics and insights.`,
    });
  }

  return insights;
};

// ============================================================
// Sub Components
// ============================================================
const LoadingSkeleton = ({ firstName }) => (
  <div className="db-wrapper">
    <div className="db-topbar">
      <div className="db-topbar-left">
        <div className="skeleton-text skeleton-w200 skeleton-h28" />
        <div className="skeleton-text skeleton-w300 skeleton-h16" />
      </div>
    </div>
    <div className="db-stats-row">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="db-stat-card skeleton-card">
          <div className="skeleton-circle" />
          <div className="skeleton-text skeleton-w80 skeleton-h14" />
          <div className="skeleton-text skeleton-w120 skeleton-h32" />
          <div className="skeleton-text skeleton-w100 skeleton-h14" />
        </div>
      ))}
    </div>
    <div className="db-content-grid">
      <div className="db-panel skeleton-panel">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton-row" />
        ))}
      </div>
      <div className="db-panel skeleton-panel">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton-row" />
        ))}
      </div>
    </div>
  </div>
);

const EmptyState = ({ icon, title, subtitle, actionLabel, actionTo }) => (
  <div className="db-empty" role="status">
    <div className="db-empty-icon">{icon}</div>
    <p className="db-empty-title">{title}</p>
    <span className="db-empty-sub">{subtitle}</span>
    {actionTo && (
      <Link to={actionTo} className="db-empty-action">
        {actionLabel} <FaChevronRight />
      </Link>
    )}
  </div>
);

// ── Smart Insight Card with Rotation ──
const SmartInsightCard = ({ insights }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isPaused || insights.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % insights.length);
        setIsTransitioning(false);
      }, 250);
    }, INSIGHT_ROTATION_MS);

    return () => clearInterval(interval);
  }, [isPaused, insights.length]);

  const goToPrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + insights.length) % insights.length
      );
      setIsTransitioning(false);
    }, 200);
  };

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
      setIsTransitioning(false);
    }, 200);
  };

  if (insights.length === 0) return null;

  const insight = insights[currentIndex];
  const Icon = insight.icon;

  return (
    <div
      className={`db-insight-card db-insight--${insight.accent}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`db-insight-icon db-insight-icon--${insight.accent}`}>
        <Icon />
      </div>

      <div
        className={`db-insight-body ${
          isTransitioning ? "db-insight-body--exit" : "db-insight-body--enter"
        }`}
      >
        <div className="db-insight-header">
          <span className={`db-insight-label db-insight-label--${insight.accent}`}>
            {insight.label}
          </span>
          <span className="db-insight-title">{insight.title}</span>
        </div>
        <p className="db-insight-text">{insight.text}</p>
      </div>

      {insights.length > 1 && (
        <div className="db-insight-controls">
          <button
            className="db-insight-btn"
            onClick={goToPrev}
            aria-label="Previous insight"
          >
            <FaChevronLeft />
          </button>
          <div className="db-insight-dots">
            {insights.map((_, i) => (
              <button
                key={i}
                className={`db-insight-dot ${
                  i === currentIndex ? "db-insight-dot--active" : ""
                }`}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(i);
                    setIsTransitioning(false);
                  }, 200);
                }}
                aria-label={`Go to insight ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="db-insight-btn"
            onClick={goToNext}
            aria-label="Next insight"
          >
            <FaChevronRight />
          </button>
          <button
            className="db-insight-btn db-insight-btn--play"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Play rotation" : "Pause rotation"}
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
        </div>
      )}

      {!isPaused && insights.length > 1 && (
        <div className="db-insight-progress">
          <div
            key={currentIndex}
            className={`db-insight-progress-fill db-insight-progress--${insight.accent}`}
          />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ stat, index }) => {
  const isPositive = stat.growth > 0;
  const isNegative = stat.growth < 0;

  return (
    <div
      className={`db-stat-card db-stat-card--${stat.variant}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="db-stat-top">
        <div className={`db-stat-icon-wrap db-stat-icon--${stat.variant}`}>
          <stat.icon />
        </div>
        <div
          className={`db-stat-badge ${
            isPositive ? "badge-up" : isNegative ? "badge-down" : "badge-flat"
          }`}
        >
          {isPositive && <FaArrowUp />}
          {isNegative && <FaArrowDown />}
          <span>
            {stat.growth === 0 ? "0%" : `${Math.abs(stat.growth)}%`}
          </span>
        </div>
      </div>

      <div className="db-stat-value">{stat.value}</div>
      <div className="db-stat-label">{stat.title}</div>

      <div className="db-stat-bar">
        <div
          className={`db-stat-bar-fill db-bar--${stat.variant}`}
          style={{ width: `${stat.progress}%` }}
        />
      </div>
      <div className="db-stat-hint">{stat.subtitle}</div>
    </div>
  );
};

const ActivityItem = ({ activity, index }) => (
  <div
    className="db-activity-row"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <div className="db-activity-dot" />
    <div className="db-activity-body">
      <span className="db-activity-msg">{activity.message}</span>
      <span className="db-activity-time">
        <FaClock /> {activity.time}
      </span>
    </div>
    <div className="db-activity-icon-wrap">{activity.icon}</div>
  </div>
);

const TopProductItem = ({ product, index, maxRevenue }) => {
  const pct =
    maxRevenue > 0 ? Math.min((product.revenue / maxRevenue) * 100, 100) : 0;
  const medal = MEDAL_EMOJIS[index] || `#${index + 1}`;

  return (
    <div
      className="db-product-row"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="db-product-rank">
        <span className={`db-rank ${index < 3 ? "db-rank--top" : ""}`}>
          {medal}
        </span>
      </div>
      <div className="db-product-body">
        <div className="db-product-name">{product.name}</div>
        <div className="db-product-meta">
          <span className="db-product-sales">
            {formatNumber(product.sales ?? 0)} sold
          </span>
          <span className="db-product-rev">
            {formatCurrency(product.revenue ?? 0)}
          </span>
        </div>
        <div className="db-product-bar">
          <div
            className="db-product-bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ action, index }) => {
  const Icon = action.icon;
  return (
    <Link
      to={action.to}
      className={`db-action-card ${action.gradient}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="db-action-icon-wrap">
        <Icon />
      </div>
      <div className="db-action-text">
        <span className="db-action-label">{action.label}</span>
        <span className="db-action-desc">{action.description}</span>
      </div>
      <FaChevronRight className="db-action-arrow" />
    </Link>
  );
};

// ============================================================
// Main Dashboard
// ============================================================
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const { setLoading: setGlobalLoading } = useAppContext();
  const { user } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setGlobalLoading(true);

      const [statsRes, activityRes, productsRes, allProductsRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/recent-activity"),
        api.get("/dashboard/top-products"),
        api.get("/products").catch(() => ({ data: { data: [] } })),
      ]);

      const statsData = statsRes?.data?.data || statsRes?.data || {};
      const activityData =
        activityRes?.data?.data || activityRes?.data || [];
      const productsData =
        productsRes?.data?.data || productsRes?.data || [];
      const allProductsData =
        allProductsRes?.data?.data || allProductsRes?.data || [];

      setStats({ ...INITIAL_STATS, ...statsData });
      setRecentActivities(Array.isArray(activityData) ? activityData : []);
      setTopProducts(Array.isArray(productsData) ? productsData : []);
      setAllProducts(Array.isArray(allProductsData) ? allProductsData : []);
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statsCards = useMemo(
    () => [
      {
        title: "Total Products",
        value: formatNumber(stats.totalProducts),
        icon: FaBox,
        variant: "blue",
        growth: stats.productsGrowth ?? 0,
        subtitle: "Items in inventory",
        progress: Math.min((stats.totalProducts / 100) * 100, 100),
      },
      {
        title: "Today's Sales",
        value: formatNumber(stats.totalSales),
        icon: FaShoppingCart,
        variant: "emerald",
        growth: stats.salesGrowth ?? 0,
        subtitle: "Orders today",
        progress: Math.min((stats.totalSales / 50) * 100, 100),
      },
      {
        title: "Customers",
        value: formatNumber(stats.totalCustomers),
        icon: FaUsers,
        variant: "violet",
        growth: stats.customersGrowth ?? 0,
        subtitle: "Active accounts",
        progress: Math.min((stats.totalCustomers / 500) * 100, 100),
      },
      {
        title: "Revenue",
        value: formatCurrency(stats.totalRevenue),
        icon: FaDollarSign,
        variant: "amber",
        growth: stats.revenueGrowth ?? 0,
        subtitle: "This month",
        progress: Math.min((stats.totalRevenue / 10000) * 100, 100),
      },
    ],
    [stats]
  );

  const insights = useMemo(
    () => generateInsights(stats, topProducts),
    [stats, topProducts]
  );

  const maxRevenue = useMemo(
    () => Math.max(...topProducts.map((p) => p.revenue ?? 0), 0),
    [topProducts]
  );

  const firstName = getFirstName(user);
  const greeting = getGreeting();
  const dateStr = getCurrentDate();

  if (loading && stats.totalProducts === 0 && stats.totalSales === 0) {
    return <LoadingSkeleton firstName={firstName} />;
  }

  return (
    <div className="db-wrapper">
      {/* ── Top Bar with Smart Insight ── */}
      <header className="db-topbar">
        <div className="db-topbar-left">
          <h1 className="db-greeting">
            {greeting}, <span className="db-name">{firstName}</span> 👋
          </h1>
          <p className="db-date">
            <FaCalendarAlt /> {dateStr}
          </p>
        </div>

        <SmartInsightCard insights={insights} />
      </header>

      {/* ── Stat Cards ── */}
      <section className="db-stats-row" aria-label="Key metrics">
        {statsCards.map((stat, i) => (
          <StatCard key={stat.title} stat={stat} index={i} />
        ))}
      </section>

      {/* ── Low Stock Alert Widget ── */}
      <section className="db-low-stock-section" aria-label="Low stock alerts">
        <LowStockProducts products={allProducts} loading={loading} />
      </section>

      {/* ── Quick Actions ── */}
      <section className="db-actions-section" aria-label="Quick actions">
        <div className="db-section-head">
          <h2>
            <FaShoppingBag className="db-section-icon" />
            Quick Actions
          </h2>
        </div>
        <div className="db-actions-grid">
          {QUICK_ACTIONS.map((action, i) => (
            <QuickActionCard key={action.to} action={action} index={i} />
          ))}
        </div>
      </section>

      {/* ── Content Grid ── */}
      <div className="db-content-grid">
        <section className="db-panel" aria-label="Recent activity">
          <div className="db-panel-head">
            <h2>
              <FaClock className="db-section-icon" />
              Recent Activity
            </h2>
            <Link to="/activities" className="db-view-link">
              View all <FaChevronRight />
            </Link>
          </div>
          <div className="db-activity-list">
            {recentActivities.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No recent activity"
                subtitle="Activities will appear here as you make sales"
                actionLabel="Record a sale"
                actionTo="/sales"
              />
            ) : (
              recentActivities.map((activity, i) => (
                <ActivityItem
                  key={activity.id || i}
                  activity={activity}
                  index={i}
                />
              ))
            )}
          </div>
        </section>

        <section className="db-panel" aria-label="Top products">
          <div className="db-panel-head">
            <h2>
              <FaTrophy className="db-section-icon" />
              Top Products
            </h2>
            <Link to="/products-list" className="db-view-link">
              View all <FaChevronRight />
            </Link>
          </div>
          <div className="db-products-list">
            {topProducts.length === 0 ? (
              <EmptyState
                icon="🏆"
                title="No products yet"
                subtitle="Your best sellers will show up here"
                actionLabel="Add product"
                actionTo="/inventory"
              />
            ) : (
              topProducts.map((product, i) => (
                <TopProductItem
                  key={product.id || i}
                  product={product}
                  index={i}
                  maxRevenue={maxRevenue}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;