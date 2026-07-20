/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaEdit, 
    FaTrash, 
    FaPlus, 
    FaSearch,
    FaUserPlus,
    FaUsers,
    FaTimes,
    FaCheck,
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa';
import '../styles/CustomerManagement.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const emptyCustomer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
};

const CustomerManagement = ({ onLogout }) => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [form, setForm] = useState(emptyCustomer);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const loadCustomers = async () => {
        try {
            const response = await fetch(`${API_URL}/customers`);
            if (!response.ok) throw new Error('Failed to load customers');
            const data = await response.json();
            setCustomers(data);
            setFilteredCustomers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredCustomers(customers);
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = customers.filter(c => 
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(term) ||
            c.email?.toLowerCase().includes(term) ||
            c.phone?.includes(term) ||
            c.address?.toLowerCase().includes(term)
        );
        setFilteredCustomers(filtered);
        setCurrentPage(1);
    }, [searchTerm, customers]);

    const resetForm = () => {
        setForm(emptyCustomer);
        setEditingId(null);
        setError('');
        setMessage('');
        setIsFormVisible(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const submitCustomer = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_URL}/customers/${editingId}` : `${API_URL}/customers`;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.message || 'Unable to save customer');
            }

            const result = await response.json();
            setMessage(result.message || 'Customer saved successfully');
            await loadCustomers();
            resetForm();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const editCustomer = (customer) => {
        setForm({
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
        });
        setEditingId(customer._id);
        setMessage('');
        setError('');
        setIsFormVisible(true);
    };

    const removeCustomer = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.message || 'Unable to delete customer');
            }
            const result = await response.json();
            setMessage(result.message || 'Customer deleted successfully');
            await loadCustomers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const getInitials = (firstName, lastName) => {
        return `${(firstName || '')[0]}${(lastName || '')[0]}`.toUpperCase() || 'U';
    };

    const getRandomColor = (id) => {
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
        return colors[(id || 0) % colors.length];
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    return (
        <div className="customer-management-container">
            {/* Header */}
            <div className="customer-header">
                <div className="header-left">
                    <div className="header-icon">
                        <FaUsers />
                    </div>
                    <div>
                        <h1>Customer Management</h1>
                        <p>Manage your customer relationships</p>
                    </div>
                </div>
                <div className="header-right">
                    <button 
                        className={`btn-add ${isFormVisible ? 'active' : ''}`}
                        onClick={() => setIsFormVisible(!isFormVisible)}
                    >
                        {isFormVisible ? <FaTimes /> : <FaUserPlus />}
                        {isFormVisible ? 'Close Form' : 'Add Customer'}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search customers by name, email, phone, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="search-clear" onClick={() => setSearchTerm('')}>
                            <FaTimes />
                        </button>
                    )}
                </div>
                <span className="search-count">
                    {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-item">
                    <span className="stat-label">Total Customers</span>
                    <span className="stat-value">{customers.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Active</span>
                    <span className="stat-value">{customers.filter(c => c.email).length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">With Phone</span>
                    <span className="stat-value">{customers.filter(c => c.phone).length}</span>
                </div>
            </div>

            {/* Form */}
            {isFormVisible && (
                <div className="form-overlay">
                    <div className="form-card">
                        <div className="form-header-section">
                            <h2>
                                <FaUserPlus className="form-icon" />
                                {editingId ? 'Edit Customer' : 'Add New Customer'}
                            </h2>
                            <button className="form-close" onClick={resetForm}>
                                <FaTimes />
                            </button>
                        </div>

                        <form className="customer-form" onSubmit={submitCustomer}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        <FaUser className="input-icon" />
                                        First Name *
                                    </label>
                                    <input 
                                        name="firstName" 
                                        value={form.firstName} 
                                        onChange={handleChange} 
                                        placeholder="Enter first name"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <FaUser className="input-icon" />
                                        Last Name *
                                    </label>
                                    <input 
                                        name="lastName" 
                                        value={form.lastName} 
                                        onChange={handleChange} 
                                        placeholder="Enter last name"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        <FaEnvelope className="input-icon" />
                                        Email *
                                    </label>
                                    <input 
                                        name="email" 
                                        type="email" 
                                        value={form.email} 
                                        onChange={handleChange} 
                                        placeholder="customer@email.com"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <FaPhone className="input-icon" />
                                        Phone *
                                    </label>
                                    <input 
                                        name="phone" 
                                        value={form.phone} 
                                        onChange={handleChange} 
                                        placeholder="+1 234 567 890"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>
                                    <FaMapMarkerAlt className="input-icon" />
                                    Address
                                </label>
                                <input 
                                    name="address" 
                                    value={form.address} 
                                    onChange={handleChange} 
                                    placeholder="123 Main St, City, State, ZIP"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-submit">
                                    {editingId ? (
                                        <>
                                            <FaCheck /> Update Customer
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus /> Add Customer
                                        </>
                                    )}
                                </button>
                                <button type="button" className="btn-cancel" onClick={resetForm}>
                                    <FaTimes /> Cancel
                                </button>
                            </div>

                            {message && <div className="message success">{message}</div>}
                            {error && <div className="message error">{error}</div>}
                        </form>
                    </div>
                </div>
            )}

            {/* Customer List */}
            <div className="customer-list-container">
                <div className="list-header">
                    <h2>
                        <FaUsers className="list-icon" />
                        Customer List
                    </h2>
                </div>

                {filteredCustomers.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No customers yet</h3>
                        <p>Start adding customers to build your database</p>
                        <button className="btn-empty-add" onClick={() => setIsFormVisible(true)}>
                            <FaPlus /> Add Your First Customer
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="customer-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th className="actions-header">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((customer) => (
                                        <tr key={customer._id} className="customer-row">
                                            <td>
                                                <div className="customer-info">
                                                    <div 
                                                        className="customer-avatar"
                                                        style={{ background: getRandomColor(customer._id) }}
                                                    >
                                                        {getInitials(customer.firstName, customer.lastName)}
                                                    </div>
                                                    <div className="customer-name">
                                                        <span className="name">
                                                            {customer.firstName} {customer.lastName}
                                                        </span>
                                                        <span className="customer-id">ID: {customer._id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-email">
                                                    <FaEnvelope className="cell-icon" />
                                                    {customer.email}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-phone">
                                                    <FaPhone className="cell-icon" />
                                                    {customer.phone}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-address">
                                                    <FaMapMarkerAlt className="cell-icon" />
                                                    {customer.address || '—'}
                                                </div>
                                            </td>
                                            <td className="actions-cell">
                                                <button 
                                                    className="btn-edit" 
                                                    onClick={() => editCustomer(customer)}
                                                    title="Edit customer"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    className="btn-delete" 
                                                    onClick={() => removeCustomer(customer._id)}
                                                    title="Delete customer"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button 
                                    className="page-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                >
                                    <FaArrowLeft />
                                </button>
                                <span className="page-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button 
                                    className="page-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerManagement;