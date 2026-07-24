/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useState, useContext, useEffect, useRef } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const errorShownRef = useRef(false);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setUser(null);
                return;
            }
            
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (e) {
                    // Invalid JSON, ignore
                }
            }
            
            try {
                const response = await api.get('/auth/me');
                if (response.data && response.data.data) {
                    const userData = response.data.data;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            } catch (error) {
                // Silent fail for 404 - backend not running
                if (error.response?.status === 404) {
                    // Only show once
                    if (!errorShownRef.current) {
                        errorShownRef.current = true;
                        console.warn('🔧 Auth endpoint not found. Using demo mode.');
                    }
                    // If we have a stored user, keep it
                    if (!storedUser) {
                        const demoUser = { 
                            name: 'Demo User', 
                            email: 'demo@smartbiz.com',
                            _id: 'demo123',
                            phone: '',
                            address: '',
                            company: ''
                        };
                        setUser(demoUser);
                        localStorage.setItem('user', JSON.stringify(demoUser));
                    }
                    return;
                }
                
                // If 401, token is invalid
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete api.defaults.headers.common['Authorization'];
                    setUser(null);
                    if (!loading) {
                        toast.error('Session expired. Please login again.');
                    }
                }
            }
        } catch (error) {
            console.error('Error in fetchUser:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            toast.success('Welcome back!');
            return { success: true };
        } catch (error) {
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                toast.warning('Backend not available. Using demo mode.');
                const demoUser = { 
                    name: email.split('@')[0] || 'Demo User', 
                    email: email,
                    _id: 'demo123',
                    phone: '',
                    address: '',
                    company: ''
                };
                setUser(demoUser);
                localStorage.setItem('user', JSON.stringify(demoUser));
                localStorage.setItem('token', 'demo-token-123');
                return { success: true };
            }
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            toast.success(response.data.message || 'Registration successful! Please login.');
            return { success: true };
        } catch (error) {
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                toast.warning('Backend not available. Using demo mode.');
                return { success: true };
            }
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        toast.success('Logged out successfully');
        window.location.href = '/login';
    };

    // ✅ ADD THIS: Update user function
    const updateUser = (userData) => {
        console.log('🔄 Updating user in context:', userData);
        
        const updatedUser = { 
            ...user, 
            ...userData,
            // Ensure we keep the id
            id: user?.id || userData?.id || userData?._id || 'demo123'
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        console.log('✅ User updated in context:', updatedUser);
        return updatedUser;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser, 
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};