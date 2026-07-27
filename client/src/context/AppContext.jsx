/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Check if it's mobile on initial load
    const isMobile = () => window.innerWidth <= 992;
    
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile());
    const [loading, setLoading] = useState(false);
    
    // ✅ Product caching state
    const [cachedProducts, setCachedProducts] = useState([]);
    const [productsLoaded, setProductsLoaded] = useState(false);
    const [productsLoading, setProductsLoading] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ Fetch and cache products
    const fetchProducts = async (forceRefresh = false) => {
        // Return cached products if available and not forcing refresh
        if (productsLoaded && !forceRefresh && cachedProducts.length > 0) {
            return cachedProducts;
        }

        setProductsLoading(true);
        try {
            const response = await api.get('/products');
            const data = response.data?.data || response.data || [];
            setCachedProducts(data);
            setProductsLoaded(true);
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
            return [];
        } finally {
            setProductsLoading(false);
        }
    };

    // ✅ Refresh products (force new fetch)
    const refreshProducts = async () => {
        setProductsLoaded(false);
        return await fetchProducts(true);
    };

    // ✅ Clear cached products
    const clearProductsCache = () => {
        setCachedProducts([]);
        setProductsLoaded(false);
    };

    const value = {
        sidebarOpen,
        setSidebarOpen,
        loading,
        setLoading,
        // Product caching
        cachedProducts,
        productsLoaded,
        productsLoading,
        fetchProducts,
        refreshProducts,
        clearProductsCache,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppProvider");
    }
    return context;
};