/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import '../../styles/SalesRecord.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const SalesRecord = ({ onLogout }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customerId: '',
    productId: '',
    quantitySold: 1,
    paymentMethod: 'cash',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customers`);
      if (!res.ok) throw new Error('Unable to load customers');
      setCustomers(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Unable to load products');
      setProducts(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: form.customerId,
          productId: form.productId,
          quantitySold: Number(form.quantitySold),
          paymentMethod: form.paymentMethod,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to record sale');
      }

      const result = await res.json();
      setMessage(result.message || 'Sale recorded successfully');
      setForm({ customerId: '', productId: '', quantitySold: 1, paymentMethod: 'cash' });
      
      // Auto clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="sales-record">
      <div className="sales-header">
        <h1>Record Sale</h1>
        {onLogout && (
          <button type="button" className="logout" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>

      <form className="sales-form" onSubmit={handleSubmit}>
        <label>
          Customer
          <select name="customerId" value={form.customerId} onChange={handleChange} required>
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Product
          <select name="productId" value={form.productId} onChange={handleChange} required>
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} — {product.quantity || product.stockQuantity || 0} in stock
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity
          <input
            name="quantitySold"
            type="number"
            min="1"
            value={form.quantitySold}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Payment Method
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="transfer">Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="pos">POS</option>
          </select>
        </label>

        <button type="submit">Record Sale</button>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
      </form>
    </div>
  );
};

export default SalesRecord;