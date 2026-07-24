/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FaArrowRight, FaCheckCircle, FaGithub, FaTwitter, FaLinkedin,
    FaBox, FaShoppingCart, FaUsers, FaChartLine, FaShieldAlt,
    FaBars, FaTimes, FaStar, FaStarHalfAlt, FaRegStar, FaBarcode,
    FaTruck, FaFileInvoice, FaSyncAlt, FaPlug, FaQuoteLeft, FaPlus,
    FaChevronDown, FaChevronRight, FaMobileAlt, FaCloud, FaRocket,
    FaClock, FaTrophy, FaPlay, FaDollarSign, FaHeadset,
} from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import '../styles/HomePage.css';

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'Why SmartBiz', href: '#why-smartbiz' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Customers', href: '#testimonials' },
];

const FEATURE_GROUPS = [
    {
        tag: 'Inventory Control',
        title: 'Stay on top of every item in your stock',
        description: 'Monitor stock levels, set reorder points, and automate purchase orders before you run out.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&crop=center',
        items: ['Real-time stock tracking', 'Batch & serial number tracking', 'Automated reorder alerts', 'Stock valuation reports', 'Barcode scanning support'],
        icon: FaBox, color: '#6366f1', link: '/inventory',
    },
    {
        tag: 'Order Management',
        title: 'Manage sales and purchase orders end-to-end',
        description: 'Create, confirm, and fulfill orders with built-in approval workflows, invoice generation, and shipment tracking.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center',
        items: ['Sales & purchase orders', 'Backorder management', 'Automated invoicing', 'Shipment tracking', 'Return & refund processing'],
        icon: FaShoppingCart, color: '#10b981', link: '/orders',
    },
    {
        tag: 'Sales Processing',
        title: 'Process sales quickly and accurately',
        description: 'Fast checkout system with support for multiple payment methods, digital receipts, and customer history tracking.',
        image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=600&h=400&fit=crop&crop=center',
        items: ['Multiple payment methods', 'Digital receipt generation', 'Customer purchase history', 'Quick checkout interface', 'Return & refund processing'],
        icon: FaShoppingCart, color: '#f59e0b', link: '/sales',
    },
    {
        tag: 'Customer Management',
        title: 'Build lasting relationships with your customers',
        description: 'Detailed customer profiles, purchase history, engagement tracking, and insights to help you grow.',
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=400&fit=crop&crop=center',
        items: ['Customer profiles & history', 'Purchase behavior insights', 'Engagement tracking', 'Customer segmentation', 'Loyalty program support'],
        icon: FaUsers, color: '#ec4899', link: '/customers',
    },
];

const WHY_SMARTBIZ = [
    { icon: FaClock, title: 'Save Time', description: 'Automate manual tasks like stock updates, reordering, and invoicing.', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { icon: FaDollarSign, title: 'Reduce Costs', description: 'Eliminate stockouts and overstocking with smart inventory predictions.', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
    { icon: FaChartLine, title: 'Grow Revenue', description: 'Make data-driven decisions with real-time analytics.', gradient: 'linear-gradient(135deg,#f59e0b,#f97316)' },
    { icon: FaHeadset, title: '24/7 Support', description: 'Our dedicated support team is always available to assist you.', gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)' },
    { icon: FaShieldAlt, title: 'Bank-grade Security', description: 'AES-256 encryption, daily backups, and enterprise-grade protocols.', gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
    { icon: FaMobileAlt, title: 'Access Anywhere', description: 'Mobile apps for iOS and Android with full functionality.', gradient: 'linear-gradient(135deg,#14b8a6,#06b6d4)' },
];

const FEATURE_CARDS = [
    { icon: FaBarcode, label: 'Barcode Scanning', color: '#6366f1', bg: '#eef2ff' },
    { icon: FaTruck, label: 'Shipping Integration', color: '#10b981', bg: '#ecfdf5' },
    { icon: FaFileInvoice, label: 'Invoice Generation', color: '#f59e0b', bg: '#fffbeb' },
    { icon: FaSyncAlt, label: 'Auto Reordering', color: '#ec4899', bg: '#fdf2f8' },
    { icon: FaPlug, label: 'Third-party Integrations', color: '#3b82f6', bg: '#eff6ff' },
    { icon: FaCloud, label: 'Cloud Sync', color: '#14b8a6', bg: '#f0fdfa' },
];

const STATS = [
    { value: '10,000+', label: 'Businesses worldwide', icon: '🌍', color: '#6366f1' },
    { value: '50M+', label: 'Items tracked daily', icon: '📦', color: '#10b981' },
    { value: '99.9%', label: 'Uptime guarantee', icon: '⚡', color: '#f59e0b' },
    { value: '4.8★', label: 'Average rating', icon: '⭐', color: '#ec4899' },
];

const PRICING_PLANS = [
    {
        name: 'Starter', price: '$0', period: '/ month',
        description: 'Perfect for small businesses just getting started.',
        features: ['Up to 50 items', '2 users', 'Basic reports', 'Email support'],
        cta: 'Start Free', highlight: false, link: '/register', badge: null,
    },
    {
        name: 'Professional', price: '$49', period: '/ month',
        description: 'For growing businesses that need more power.',
        features: ['Unlimited items', '10 users', 'Advanced reports', 'Barcode scanning', 'Priority support'],
        cta: 'Start 14-Day Trial', highlight: true, link: '/register', badge: 'Most Popular',
    },
    {
        name: 'Enterprise', price: 'Custom', period: '',
        description: 'Tailored solutions for large-scale operations.',
        features: ['Unlimited items & users', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'],
        cta: 'Contact Sales', highlight: false, link: '/contact', badge: null,
    },
];

const FAQ_ITEMS = [
    { q: 'Can I import existing inventory data?', a: 'Absolutely. SmartBiz supports bulk CSV import for products, customers, and orders.' },
    { q: 'Is there a mobile app?', a: 'Yes. iOS and Android apps are available with barcode scanning and order processing.' },
    { q: 'What integrations are supported?', a: 'SmartBiz integrates with Shopify, WooCommerce, Amazon, QuickBooks, Xero, Stripe, and more.' },
    { q: 'How secure is my data?', a: 'We use AES-256 encryption at rest and TLS 1.3 in transit. Daily backups across multiple regions.' },
];

const RenderStars = ({ rating }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <div className="star-row">
            {[...Array(full)].map((_, i) => <FaStar key={`f${i}`} className="star filled" />)}
            {half && <FaStarHalfAlt className="star half" />}
            {[...Array(empty)].map((_, i) => <FaRegStar key={`e${i}`} className="star empty" />)}
        </div>
    );
};

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item${open ? ' open' : ''}`}>
            <button className="faq-q" onClick={() => setOpen(o => !o)} type="button">
                <span>{q}</span>
                <span className={`faq-chevron${open ? ' rotated' : ''}`}><FaChevronDown /></span>
            </button>
            <div className={`faq-body${open ? ' open' : ''}`}>
                <p>{a}</p>
            </div>
        </div>
    );
};

const HomePage = () => {
    const { setLoading: setGlobalLoading } = useAppContext();
    const { isAuthenticated } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [visible, setVisible] = useState({ stats: false, why: false, testimonials: false });

    // ✅ State for database testimonials
    const [testimonials, setTestimonials] = useState([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ 
        customerName: '', 
        customerEmail: '', 
        rating: 5, 
        comment: '',
        productName: '' 
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitOk, setSubmitOk] = useState(false);

    const statsRef = useRef(null);
    const whyRef = useRef(null);
    const testiRef = useRef(null);

    // ✅ Fetch testimonials from database
    const fetchTestimonials = async () => {
        try {
            setLoadingTestimonials(true);
            const response = await api.get('/testimonials/recent?limit=3');
            
            if (response.data.success) {
                const data = response.data.data || [];
                setTestimonials(data);
            } else {
                throw new Error('Failed to fetch testimonials');
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            // Set empty array on error
            setTestimonials([]);
        } finally {
            setLoadingTestimonials(false);
        }
    };

    // ✅ Submit testimonial to database
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        const err = {};
        if (!formData.customerName.trim()) err.customerName = 'Name is required';
        if (!formData.customerEmail.trim()) err.customerEmail = 'Email is required';
        if (formData.comment.trim().length < 10) err.comment = 'At least 10 characters';
        if (Object.keys(err).length) {
            setFormErrors(err);
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/testimonials', {
                customerName: formData.customerName.trim(),
                customerEmail: formData.customerEmail.trim(),
                rating: formData.rating,
                comment: formData.comment.trim(),
                productName: formData.productName.trim() || ''
            });

            if (response.data.success) {
                toast.success('Thank you for your review!');
                setSubmitOk(true);
                setFormData({ customerName: '', customerEmail: '', rating: 5, comment: '', productName: '' });
                setFormErrors({});
                
                // Refresh testimonials
                await fetchTestimonials();
                
                setTimeout(() => {
                    setSubmitOk(false);
                    setShowForm(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        setFormErrors(p => ({ ...p, [name]: '' }));
    };

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
            [
                [statsRef, 'stats'],
                [whyRef, 'why'],
                [testiRef, 'testimonials'],
            ].forEach(([ref, key]) => {
                if (ref.current && ref.current.getBoundingClientRect().top < window.innerHeight - 80)
                    setVisible(p => ({ ...p, [key]: true }));
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        
        // Load testimonials on mount
        fetchTestimonials();
        
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleNavClick = (e, href) => {
        closeMenu();
        if (href.startsWith('#')) {
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    };

    // Get avatar URL for customer
    const getAvatar = (name) => {
        return `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70) + 1}`;
    };

    return (
        <div className="hp">

            {/* ═══ NAVBAR ═══ */}
            <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
                <div className="nav-bar">
                    <div className="nav-left">
                        <button
                            className={`hamburger${menuOpen ? ' is-open' : ''}`}
                            onClick={toggleMenu}
                            type="button"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                        >
                            <span className="ham-line" />
                            <span className="ham-line" />
                            <span className="ham-line" />
                        </button>

                        <Link to="/" className="nav-logo" onClick={closeMenu}>
                            <span className="nav-logo-icon"><FaBox /></span>
                            <span className="nav-logo-text">SmartBiz</span>
                        </Link>
                    </div>

                    <div className="nav-center">
                        {NAV_LINKS.map(l => (
                            <a key={l.label} href={l.href} className="nav-link"
                                onClick={e => handleNavClick(e, l.href)}>
                                {l.label}
                            </a>
                        ))}
                    </div>

                    <div className="nav-right">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-nav-fill">Dashboard <FaChevronRight /></Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-nav-ghost">Sign In</Link>
                                <Link to="/register" className="btn-nav-fill">Start Free Trial</Link>
                            </>
                        )}
                    </div>
                </div>

                <div
                    className={`mobile-overlay${menuOpen ? ' visible' : ''}`}
                    onClick={closeMenu}
                />

                <aside className={`mobile-drawer${menuOpen ? ' open' : ''}`}>
                    <div className="drawer-header">
                        <Link to="/" className="nav-logo" onClick={closeMenu}>
                            <span className="nav-logo-icon"><FaBox /></span>
                            <span className="nav-logo-text dark">SmartBiz</span>
                        </Link>
                        <button className="drawer-close" onClick={closeMenu} type="button" aria-label="Close menu">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="drawer-body">
                        {NAV_LINKS.map(l => (
                            <a key={l.label} href={l.href} className="drawer-link"
                                onClick={e => handleNavClick(e, l.href)}>
                                {l.label}
                                <FaChevronRight className="drawer-link-arrow" />
                            </a>
                        ))}
                    </div>

                    <div className="drawer-footer">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn-drawer-fill" onClick={closeMenu}>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-drawer-outline" onClick={closeMenu}>Sign In</Link>
                                <Link to="/register" className="btn-drawer-fill" onClick={closeMenu}>Start Free Trial</Link>
                            </>
                        )}
                    </div>
                </aside>
            </nav>

            {/* ═══ HERO ═══ */}
            <section className="hero">
                <div className="hero-orb hero-orb-a" />
                <div className="hero-orb hero-orb-b" />
                <div className="hero-orb hero-orb-c" />
                <div className="hero-grid-bg" />

                <div className="hero-inner">
                    <div className="hero-copy">
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            Inventory &amp; Sales Management Platform
                        </div>
                        <h1 className="hero-h1">
                            Control your stock.<br />
                            <span className="hero-gradient">Scale your business.</span>
                        </h1>
                        <p className="hero-sub">
                            SmartBiz gives teams real-time visibility into inventory, orders, and customers —
                            eliminating spreadsheets and unlocking growth.
                        </p>
                        <div className="hero-btns">
                            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn-hero-fill">
                                {isAuthenticated ? 'Go to Dashboard' : "Get Started — It's Free"}
                                <FaArrowRight />
                            </Link>
                            <a href="#features" className="btn-hero-outline" onClick={e => handleNavClick(e, '#features')}>
                                <span className="play-circle"><FaPlay /></span>
                                See how it works
                            </a>
                        </div>
                        <div className="hero-proof">
                            <div className="proof-avatars">
                                {[11, 12, 13, 14].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/32?img=${i}`} alt="" />
                                ))}
                            </div>
                            <p><strong>10,000+</strong> businesses trust SmartBiz</p>
                        </div>
                    </div>

                    <div className="hero-mockup">
                        <div className="mockup-shell">
                            <div className="mockup-chrome">
                                <div className="chrome-dots">
                                    <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                                </div>
                                <span className="chrome-url">app.smartbiz.io</span>
                                <span className="chrome-live"><span className="live-dot" />Live</span>
                            </div>

                            <div className="mockup-body">
                                <aside className="mockup-sidebar">
                                    <div className="ms-logo"><FaBox /><span>SmartBiz</span></div>
                                    {['Dashboard', 'Inventory', 'Orders', 'Customers', 'Analytics'].map(item => (
                                        <div key={item} className={`ms-item${item === 'Inventory' ? ' active' : ''}`}>
                                            <span className="ms-dot" />{item}
                                        </div>
                                    ))}
                                </aside>

                                <div className="mockup-main">
                                    <div className="kpi-row">
                                        {[
                                            { label: 'Total Items', value: '4,821', delta: '+12%', up: true, color: '#6366f1' },
                                            { label: 'Orders Today', value: '38', delta: '+8', up: true, color: '#10b981' },
                                            { label: 'Low Stock', value: '12', delta: '-3', up: false, color: '#f59e0b' },
                                            { label: 'Customers', value: '1,247', delta: '+24', up: true, color: '#ec4899' },
                                        ].map(k => (
                                            <div key={k.label} className="kpi">
                                                <span className="kpi-val" style={{ color: k.color }}>{k.value}</span>
                                                <span className="kpi-lbl">{k.label}</span>
                                                <span className={`kpi-delta${k.up ? ' up' : ' dn'}`}>{k.delta}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mini-chart">
                                        <div className="mc-title">Stock Movement — Last 7 Days</div>
                                        <div className="mc-bars">
                                            {[65, 78, 52, 89, 74, 91, 83].map((h, i) => (
                                                <div key={i} className="mc-bar-wrap">
                                                    <div className="mc-bar" style={{ height: `${h}%` }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="recent-tbl">
                                        <div className="rt-title">Recent Movements</div>
                                        {[
                                            { name: 'Cotton Fabric', qty: '+200', type: 'in' },
                                            { name: 'Leather Wallet', qty: '-15', type: 'out' },
                                            { name: 'Silk Thread', qty: '+500', type: 'in' },
                                        ].map((r, i) => (
                                            <div key={i} className="rt-row">
                                                <span className="rt-name">{r.name}</span>
                                                <span className={`rt-qty ${r.type}`}>{r.qty}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="float-badge float-top">
                            <span className="fb-icon green">✓</span>
                            <div><strong>Stock Updated</strong><span>Cotton Fabric +200 units</span></div>
                        </div>
                        <div className="float-badge float-bottom">
                            <span className="fb-icon amber">⚠</span>
                            <div><strong>Low Stock Alert</strong><span>Leather Wallet — 8 left</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ LOGOS ═══ */}
            <section className="logos-strip">
                <div className="container">
                    <p className="logos-label">Trusted by teams at</p>
                    <div className="logos-row">
                        {[
                            { name: 'Shopify', color: '#96bf48' }, { name: 'Amazon', color: '#ff9900' },
                            { name: 'QuickBooks', color: '#2ca01c' }, { name: 'Stripe', color: '#635bff' },
                            { name: 'FedEx', color: '#4d148c' }, { name: 'WooCommerce', color: '#96588a' },
                            { name: 'Xero', color: '#13b5ea' }, { name: 'UPS', color: '#8b4513' },
                        ].map(b => (
                            <div key={b.name} className="logo-chip">
                                <span className="lc-dot" style={{ background: b.color }} />
                                {b.name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ STATS ═══ */}
            <section className="stats-sec" ref={statsRef}>
                <div className="container">
                    <div className="stats-grid">
                        {STATS.map((s, i) => (
                            <div key={i} className={`stat-card${visible.stats ? ' in' : ''}`}
                                style={{ transitionDelay: `${i * 0.1}s` }}>
                                <span className="sc-icon">{s.icon}</span>
                                <span className="sc-val" style={{ color: s.color }}>{s.value}</span>
                                <span className="sc-lbl">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES ═══ */}
            <section className="features-sec" id="features">
                <div className="container">
                    <div className="sec-hdr">
                        <span className="eyebrow">Features</span>
                        <h2>Everything your team needs</h2>
                        <p>From a single storefront to a multi-warehouse operation, SmartBiz scales with you.</p>
                    </div>

                    <div className="feat-tabs">
                        {FEATURE_GROUPS.map((g, i) => (
                            <button key={i}
                                className={`feat-tab${activeTab === i ? ' active' : ''}`}
                                style={activeTab === i ? { borderColor: g.color, color: g.color } : {}}
                                onClick={() => setActiveTab(i)}
                                type="button">
                                <g.icon />{g.tag}
                            </button>
                        ))}
                    </div>

                    {FEATURE_GROUPS.map((g, i) => (
                        <div key={i} className={`feat-panel${activeTab === i ? ' active' : ''}${i % 2 === 1 ? ' rev' : ''}`}>
                            <div className="fp-text">
                                <span className="fp-tag" style={{ color: g.color, background: `${g.color}18` }}>
                                    <g.icon />{g.tag}
                                </span>
                                <h3>{g.title}</h3>
                                <p>{g.description}</p>
                                <ul className="fp-list">
                                    {g.items.map(item => (
                                        <li key={item}>
                                            <span className="fp-check" style={{ background: `${g.color}18`, color: g.color }}>
                                                <FaCheckCircle />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link to={g.link} className="fp-cta" style={{ color: g.color }}>
                                    Explore {g.tag} <FaArrowRight />
                                </Link>
                            </div>
                            <div className="fp-img">
                                <img src={g.image} alt={g.tag} loading="lazy" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ WHY SMARTBIZ ═══ */}
            <section className="why-sec" id="why-smartbiz" ref={whyRef}>
                <div className="container">
                    <div className="sec-hdr">
                        <span className="eyebrow">Why SmartBiz</span>
                        <h2>Built to help you succeed</h2>
                        <p>All the tools you need to manage inventory, sales, and customers in one place.</p>
                    </div>
                    <div className="why-grid">
                        {WHY_SMARTBIZ.map((w, i) => (
                            <div key={i} className={`why-card${visible.why ? ' in' : ''}`}
                                style={{ transitionDelay: `${i * 0.08}s` }}>
                                <div className="why-icon" style={{ background: w.gradient }}>
                                    <w.icon />
                                </div>
                                <h3>{w.title}</h3>
                                <p>{w.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CAPABILITIES ═══ */}
            <section className="caps-sec">
                <div className="container">
                    <div className="sec-hdr">
                        <span className="eyebrow">More Capabilities</span>
                        <h2>Built for modern businesses</h2>
                    </div>
                    <div className="caps-grid">
                        {FEATURE_CARDS.map((c, i) => (
                            <div key={i} className="cap-card">
                                <div className="cap-icon" style={{ background: c.bg, color: c.color }}><c.icon /></div>
                                <span>{c.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TESTIMONIALS ═══ */}
            <section className="testi-sec" id="testimonials" ref={testiRef}>
                <div className="container">
                    <div className="sec-hdr">
                        <span className="eyebrow">Customer Stories</span>
                        <h2>Loved by businesses worldwide</h2>
                        <p>Real feedback from real businesses using SmartBiz every day.</p>
                    </div>

                    {loadingTestimonials ? (
                        <div className="testi-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading testimonials...</p>
                        </div>
                    ) : (
                        <div className="testi-grid">
                            {testimonials.length > 0 ? (
                                testimonials.map((t, i) => (
                                    <div key={t._id || i} className={`tcard${visible.testimonials ? ' in' : ''}`}
                                        style={{ transitionDelay: `${i * 0.12}s` }}>
                                        <div className="tcard-top">
                                            <RenderStars rating={t.rating || 5} />
                                            <FaQuoteLeft className="tcard-ql" />
                                        </div>
                                        <p className="tcard-quote">"{t.comment}"</p>
                                        <div className="tcard-author">
                                            <img src={getAvatar(t.customerName)} alt={t.customerName} />
                                            <div>
                                                <strong>{t.customerName}</strong>
                                                <span>{t.productName || 'Satisfied Customer'}</span>
                                                <em className="verified">✓ Verified</em>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="testi-empty">
                                    <p>No testimonials yet. Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="testi-action">
                        <button className="btn-add-review" type="button"
                            onClick={() => { setShowForm(o => !o); setSubmitOk(false); }}>
                            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Share your experience</>}
                        </button>
                    </div>

                    {showForm && (
                        <div className="review-wrap">
                            {submitOk ? (
                                <div className="review-success">
                                    <div className="rs-icon">✓</div>
                                    <h3>Thank you!</h3>
                                    <p>Your testimonial has been added.</p>
                                </div>
                            ) : (
                                <form className="review-form" onSubmit={handleSubmit} noValidate>
                                    <h3>Share your experience</h3>
                                    <div className="rf-row">
                                        <div className="rf-field">
                                            <label>Full Name <span className="req">*</span></label>
                                            <input 
                                                name="customerName" 
                                                value={formData.customerName} 
                                                onChange={handleChange}
                                                placeholder="Jane Smith" 
                                                className={formErrors.customerName ? 'err' : ''} 
                                            />
                                            {formErrors.customerName && <span className="rf-err">{formErrors.customerName}</span>}
                                        </div>
                                        <div className="rf-field">
                                            <label>Email <span className="req">*</span></label>
                                            <input 
                                                type="email" 
                                                name="customerEmail" 
                                                value={formData.customerEmail} 
                                                onChange={handleChange}
                                                placeholder="jane@example.com" 
                                                className={formErrors.customerEmail ? 'err' : ''} 
                                            />
                                            {formErrors.customerEmail && <span className="rf-err">{formErrors.customerEmail}</span>}
                                        </div>
                                    </div>
                                    <div className="rf-field">
                                        <label>Product Name (Optional)</label>
                                        <input 
                                            name="productName" 
                                            value={formData.productName} 
                                            onChange={handleChange}
                                            placeholder="What product are you reviewing?" 
                                        />
                                    </div>
                                    <div className="rf-field">
                                        <label>Rating</label>
                                        <div className="rf-stars">
                                            {[1, 2, 3, 4, 5].map(v => (
                                                <button key={v} type="button"
                                                    className={`star-btn${formData.rating >= v ? ' on' : ''}`}
                                                    onClick={() => setFormData(p => ({ ...p, rating: v }))}>
                                                    <FaStar />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rf-field">
                                        <label>Your review <span className="req">*</span></label>
                                        <textarea 
                                            name="comment" 
                                            rows={4} 
                                            value={formData.comment} 
                                            onChange={handleChange}
                                            placeholder="Tell others about your experience…"
                                            className={formErrors.comment ? 'err' : ''} 
                                        />
                                        {formErrors.comment && <span className="rf-err">{formErrors.comment}</span>}
                                        <span className="rf-count">{formData.comment.length} / 500</span>
                                    </div>
                                    <div className="rf-actions">
                                        <button type="submit" className="btn-rf-submit" disabled={submitting}>
                                            {submitting ? <><span className="spin" />Submitting…</> : 'Submit Review'}
                                        </button>
                                        <button type="button" className="btn-rf-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ PRICING ═══ */}
            <section className="pricing-sec" id="pricing">
                <div className="container">
                    <div className="sec-hdr">
                        <span className="eyebrow">Pricing</span>
                        <h2>Simple, transparent pricing</h2>
                        <p>Start free. Scale as you grow. No hidden fees.</p>
                    </div>
                    <div className="pricing-grid">
                        {PRICING_PLANS.map((plan, i) => (
                            <div key={i} className={`pcard${plan.highlight ? ' featured' : ''}`}>
                                {plan.badge && <div className="pcard-badge">{plan.badge}</div>}
                                <div className="pcard-top">
                                    <h3>{plan.name}</h3>
                                    <div className="pcard-price">
                                        <span className="pp-amount">{plan.price}</span>
                                        {plan.period && <span className="pp-period">{plan.period}</span>}
                                    </div>
                                    <p>{plan.description}</p>
                                </div>
                                <ul className="pcard-feats">
                                    {plan.features.map(f => (
                                        <li key={f}><FaCheckCircle className="pf-check" />{f}</li>
                                    ))}
                                </ul>
                                <Link to={plan.link} className={plan.highlight ? 'btn-plan-fill' : 'btn-plan-outline'}>
                                    {plan.cta} <FaArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FAQ ═══ */}
            <section className="faq-sec">
                <div className="container">
                    <div className="sec-hdr">
                        <span className="eyebrow">FAQ</span>
                        <h2>Common questions</h2>
                    </div>
                    <div className="faq-list">
                        {FAQ_ITEMS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="cta-sec">
                <div className="cta-orb cta-orb-a" /><div className="cta-orb cta-orb-b" />
                <div className="container">
                    <div className="cta-box">
                        <span className="eyebrow light">Get Started Today</span>
                        <h2>Ready to transform your business?</h2>
                        <p>Join 10,000+ businesses. Start your free 14-day trial — no credit card required.</p>
                        <div className="cta-btns">
                            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn-cta-fill">
                                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'} <FaArrowRight />
                            </Link>
                            <a href="mailto:sales@smartbiz.io" className="btn-cta-outline">Talk to Sales</a>
                        </div>
                        <div className="cta-badges">
                            <span><FaShieldAlt />Bank-grade security</span>
                            <span><FaClock />24/7 support</span>
                            <span><FaRocket />Setup in minutes</span>
                            <span><FaTrophy />Trusted by 10K+</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <span className="footer-logo-icon"><FaBox /></span>
                                <span>SmartBiz</span>
                            </div>
                            <p>Inventory and sales management for modern businesses.</p>
                            <div className="footer-socials">
                                <a href="#" aria-label="GitHub"><FaGithub /></a>
                                <a href="#" aria-label="Twitter"><FaTwitter /></a>
                                <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                            </div>
                        </div>
                        <div className="footer-cols">
                            {[
                                { head: 'Product', links: [{ l: 'Dashboard', to: '/dashboard' }, { l: 'Inventory', to: '/inventory' }, { l: 'Orders', to: '/orders' }, { l: 'Sales', to: '/sales' }] },
                                { head: 'Solutions', links: [{ l: 'Retail' }, { l: 'E-commerce' }, { l: 'Manufacturing' }, { l: 'Distribution' }] },
                                { head: 'Company', links: [{ l: 'About', to: '/about' }, { l: 'Contact', to: '/contact' }, { l: 'Blog' }, { l: 'Careers' }] },
                                { head: 'Support', links: [{ l: 'Help Center' }, { l: 'Docs' }, { l: 'Privacy', to: '/privacy' }, { l: 'Terms', to: '/terms' }] },
                            ].map(col => (
                                <div key={col.head} className="footer-col">
                                    <h4>{col.head}</h4>
                                    {col.links.map(lk => lk.to
                                        ? <Link key={lk.l} to={lk.to}>{lk.l}</Link>
                                        : <a key={lk.l} href="#">{lk.l}</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 SmartBiz, Inc. All rights reserved.</p>
                        <div className="footer-btm-links">
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/terms">Terms</Link>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;