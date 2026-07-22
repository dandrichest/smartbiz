/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingBag, FaDollarSign } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import api from '../../api';
import toast from 'react-hot-toast';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const { setLoading } = useAppContext();

    const getDemoCustomers = useCallback(() => {
        return [
            { _id: 1, name: 'John Doe', email: 'john@email.com', phone: '+1234567890', address: '123 Main St, NY', purchaseCount: 12, totalSpent: 850 },
            { _id: 2, name: 'Jane Smith', email: 'jane@email.com', phone: '+0987654321', address: '456 Oak Ave, LA', purchaseCount: 8, totalSpent: 620 },
            { _id: 3, name: 'Mike Johnson', email: 'mike@email.com', phone: '+1122334455', address: '789 Pine Rd, SF', purchaseCount: 6, totalSpent: 450 },
            { _id: 4, name: 'Sarah Wilson', email: 'sarah@email.com', phone: '+5544332211', address: '321 Elm St, CHI', purchaseCount: 5, totalSpent: 380 },
            { _id: 5, name: 'David Brown', email: 'david@email.com', phone: '+9988776655', address: '654 Maple Dr, TX', purchaseCount: 4, totalSpent: 290 },
        ];
    }, []);

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/customers');
            setCustomers(response.data.data || response.data || []);
            setFilteredCustomers(response.data.data || response.data || []);
        } catch {
            toast.error('Failed to fetch customers');
            const demoData = getDemoCustomers();
            setCustomers(demoData);
            setFilteredCustomers(demoData);
        } finally {
            setLoading(false);
        }
    }, [setLoading, getDemoCustomers]);

    const filterCustomers = useCallback(() => {
        if (!searchTerm.trim()) {
            setFilteredCustomers(customers);
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = customers.filter(c =>
            c.name?.toLowerCase().includes(term) ||
            c.email?.toLowerCase().includes(term) ||
            c.phone?.includes(term) ||
            c.address?.toLowerCase().includes(term)
        );
        setFilteredCustomers(filtered);
    }, [customers, searchTerm]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    useEffect(() => {
        filterCustomers();
    }, [filterCustomers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingCustomer) {
                const response = await api.put(`/customers/${editingCustomer._id}`, formData);
                const updatedCustomer = response.data.data || response.data;
                setCustomers(customers.map(c => c._id === editingCustomer._id ? updatedCustomer : c));
                toast.success('Customer updated successfully');
            } else {
                const response = await api.post('/customers', formData);
                const newCustomer = response.data.data || response.data;
                setCustomers([...customers, newCustomer]);
                toast.success('Customer added successfully');
            }
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        try {
            setLoading(true);
            await api.delete(`/customers/${id}`);
            setCustomers(customers.filter(c => c._id !== id));
            toast.success('Customer deleted successfully');
        } catch {
            toast.error('Failed to delete customer');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingCustomer(null);
        setFormData({ name: '', email: '', phone: '', address: '' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                    <FaPlus />
                    <span>Add Customer</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers by name, email, phone, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    Found {filteredCustomers.length} customers
                </div>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FaUser className="inline mr-1" /> Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter customer name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FaEnvelope className="inline mr-1" /> Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FaPhone className="inline mr-1" /> Phone
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FaMapMarkerAlt className="inline mr-1" /> Address
                            </label>
                            <input
                                type="text"
                                placeholder="Enter address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2 flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {editingCustomer ? 'Update Customer' : 'Add Customer'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Customer List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredCustomers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No customers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Activity
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FaUser className="text-blue-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: #{customer._id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {customer.email || '-'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {customer.phone || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500">
                                                {customer.address || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaShoppingBag className="mr-1" />
                                                    {customer.purchaseCount || 0}
                                                </div>
                                                <div className="flex items-center text-sm text-green-600 font-medium">
                                                    <FaDollarSign className="mr-1" />
                                                    ${(customer.totalSpent || 0).toFixed(2)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(customer)}
                                                className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                                            >
                                                <FaEdit className="inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer._id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                <FaTrash className="inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerManagement;