import {
    FaBox, FaShoppingCart, FaUsers, FaChartLine,
    FaCloud, FaDatabase, FaSync, FaBell,
    FaFileInvoice, FaTags, FaStore, FaHeadset,
} from 'react-icons/fa';

export const HERO_SLIDES = [
    {
        id: 'slide-inventory',
        title: 'Smart Inventory Management',
        subtitle: 'Track stock, manage products, and automate reordering',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&crop=center',
        cta: 'Explore Inventory',
        link: '/inventory',
        color: '#4f46e5',
    },
    {
        id: 'slide-sales',
        title: 'Seamless Sales Processing',
        subtitle: 'Process sales quickly with our intuitive POS system',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&crop=center',
        cta: 'Start Selling',
        link: '/sales',
        color: '#10b981',
    },
    {
        id: 'slide-analytics',
        title: 'Powerful Analytics',
        subtitle: 'Make data-driven decisions with real-time insights',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&crop=center',
        cta: 'View Analytics',
        link: '/analytics',
        color: '#8b5cf6',
    },
];

export const FEATURES = [
    {
        id: 'feature-inventory',
        icon: FaBox,
        title: 'Inventory Management',
        description: 'Real-time stock tracking, automated reordering, and multi-warehouse support',
        color: '#4f46e5',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&crop=center',
        link: '/features/inventory',
    },
    {
        id: 'feature-sales',
        icon: FaShoppingCart,
        title: 'Sales Processing',
        description: 'Fast checkout, multiple payment methods, and digital receipts',
        color: '#10b981',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center',
        link: '/features/sales',
    },
    {
        id: 'feature-customers',
        icon: FaUsers,
        title: 'Customer Management',
        description: '360° customer view with purchase history and engagement tracking',
        color: '#8b5cf6',
        image: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=400&h=300&fit=crop&crop=center',
        link: '/features/customers',
    },
    {
        id: 'feature-analytics',
        icon: FaChartLine,
        title: 'Advanced Analytics',
        description: 'Real-time dashboards, predictive insights, and custom reports',
        color: '#f59e0b',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center',
        link: '/features/analytics',
    },
];

export const INTEGRATIONS = [
    { id: 'int-cloud',    icon: FaCloud,       name: 'Cloud Sync',   color: '#4f46e5' },
    { id: 'int-db',       icon: FaDatabase,    name: 'Data Backup',  color: '#10b981' },
    { id: 'int-sync',     icon: FaSync,        name: 'Real-time Sync', color: '#8b5cf6' },
    { id: 'int-alerts',   icon: FaBell,        name: 'Smart Alerts', color: '#f59e0b' },
    { id: 'int-invoice',  icon: FaFileInvoice, name: 'Invoicing',    color: '#ef4444' },
    { id: 'int-tags',     icon: FaTags,        name: 'Smart Tags',   color: '#3b82f6' },
];

export const STATS = [
    { id: 'stat-businesses', icon: FaStore,       value: '10K+', label: 'Active Businesses' },
    { id: 'stat-sales',      icon: FaShoppingCart, value: '50K+', label: 'Sales Processed'   },
    { id: 'stat-satisfaction', icon: FaUsers,     value: '98%',  label: 'Satisfaction Rate'  },
    { id: 'stat-support',    icon: FaHeadset,     value: '24/7', label: 'Support Available'  },
];

export const INITIAL_TESTIMONIALS = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'CEO, Fabrics & More',
        quote: 'SmartBiz transformed our inventory management. We reduced stockouts by 60% in just three months!',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Operations Manager, TechWear',
        quote: 'The analytics dashboard gives us real-time insights that help us make better business decisions every day.',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Owner, Artisan Crafts',
        quote: 'Processing sales is now effortless. Our team loves the intuitive interface and quick checkout process.',
        rating: 4,
        avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
        id: 4,
        name: 'David Kim',
        role: 'Founder, TechStart',
        quote: 'The best decision we made for our business. SmartBiz has streamlined everything from inventory to customer management.',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
        id: 5,
        name: 'Lisa Thompson',
        role: 'Operations Director, GreenLeaf',
        quote: 'Real-time analytics and insights have helped us scale our business faster than ever before.',
        rating: 5,
        avatar: 'https://i.pravatar.cc/150?img=5',
    },
];

// Validation constraints — single source of truth
export const FORM_CONSTRAINTS = {
    name:  { min: 2,  max: 60  },
    role:  { min: 2,  max: 80  },
    quote: { min: 10, max: 500 },
};

export const CAROUSEL_INTERVAL_MS    = 5000;
export const TESTIMONIAL_INTERVAL_MS = 6000;
export const ANIMATION_DURATION_MS   = 500;