import { useEffect, useState } from 'react';
import '../styles/CustomerManagement.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const emptyCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
};

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyCustomer);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      if (!response.ok) throw new Error('Failed to load customers');
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const resetForm = () => {
    setForm(emptyCustomer);
    setEditingId(null);
    setError('');
    setMessage('');
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
      resetForm();
      await loadCustomers();
    } catch (err) {
      setError(err.message);
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
  };

  const removeCustomer = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-management">
      <section className="customer-panel">
        <h1>Customer Management</h1>

        <form className="customer-form" onSubmit={submitCustomer}>
          <div className="form-row">
            <label>
              First Name
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label>
              Last Name
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
          </div>

          <div className="form-row">
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
          </div>

          <label className="full-width">
            Address
            <input name="address" value={form.address} onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button type="submit">{editingId ? 'Update Customer' : 'Add Customer'}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          {message && <p className="message success">{message}</p>}
          {error && <p className="message error">{error}</p>}
        </form>
      </section>

      <section className="customer-list">
        <h2>Existing Customers</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="5">No customers yet.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.firstName} {customer.lastName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address || '—'}</td>
                    <td>
                      <button type="button" onClick={() => editCustomer(customer)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => removeCustomer(customer._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CustomerManagement;
