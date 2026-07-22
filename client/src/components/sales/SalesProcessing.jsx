/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { 
    FaPlus, 
    FaMinus, 
    FaTrash, 
    FaReceipt, 
    FaUser, 
    FaSearch,
    FaShoppingCart,
    FaWallet
} from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import api from '../../api';
import toast from 'react-hot-toast';
import '../../styles/SalesProcessing.css';

const SalesProcessing = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [customer, setCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [searchTerm, setSearchTerm] = useState('');
    const { setLoading } = useAppContext();

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data || response.data || []);
            setFilteredProducts(response.data.data || response.data || []);
        } catch {
            toast.error('Failed to fetch products');
            setProducts(getDemoProducts());
            setFilteredProducts(getDemoProducts());
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            setCustomers(response.data.data || response.data || []);
        } catch {
            // Silent fail - customers are optional
        }
    };

    const getDemoProducts = () => {
        return [
            { _id: 1, name: 'Premium Cotton Fabric', price: 15.99, stockQuantity: 45, category: 'Fabrics' },
            { _id: 2, name: 'Silk Blend Fabric', price: 29.99, stockQuantity: 12, category: 'Fabrics' },
            { _id: 3, name: 'Leather Wallet', price: 24.99, stockQuantity: 8, category: 'Accessories' },
            { _id: 4, name: 'Cotton Thread', price: 4.99, stockQuantity: 150, category: 'Supplies' },
            { _id: 5, name: 'Sewing Machine', price: 199.99, stockQuantity: 3, category: 'Equipment' },
            { _id: 6, name: 'Sewing Kit', price: 12.99, stockQuantity: 25, category: 'Supplies' },
            { _id: 7, name: 'Fabric Scissors', price: 18.99, stockQuantity: 15, category: 'Equipment' },
            { _id: 8, name: 'Measuring Tape', price: 5.99, stockQuantity: 30, category: 'Supplies' },
        ];
    };

    const filterProducts = () => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.category?.toLowerCase().includes(term) ||
            p.sku?.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
    };

    const addToCart = () => {
        if (!selectedProduct) {
            toast.error('Please select a product');
            return;
        }

        const product = products.find(p => p._id === selectedProduct._id);
        if (!product) {
            toast.error('Product not found');
            return;
        }

        if (product.stockQuantity < quantity) {
            toast.error(`Not enough stock. Available: ${product.stockQuantity}`);
            return;
        }

        const existingItem = cart.find(item => item.product._id === selectedProduct._id);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stockQuantity) {
                toast.error(`Not enough stock. Available: ${product.stockQuantity}`);
                return;
            }
            setCart(cart.map(item =>
                item.product._id === selectedProduct._id
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity }]);
        }

        toast.success(`Added ${product.name} to cart`);
        setSelectedProduct(null);
        setQuantity(1);
        setSearchTerm('');
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        const item = cart.find(i => i.product._id === productId);
        if (newQuantity > item.product.stockQuantity) {
            toast.error(`Not enough stock. Available: ${item.product.stockQuantity}`);
            return;
        }
        setCart(cart.map(item =>
            item.product._id === productId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const calculateSubtotal = () => {
        return calculateTotal();
    };

    const calculateTax = () => {
        return calculateTotal() * 0.07;
    };

    const calculateGrandTotal = () => {
        return calculateTotal() + calculateTax();
    };

    const processSale = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        const saleData = {
            items: cart.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            customerId: customer?._id || null,
            paymentMethod: paymentMethod,
            total: calculateGrandTotal(),
        };

        try {
            setLoading(true);
            const response = await api.post('/sales', saleData);
            toast.success('Sale processed successfully!');

            const receipt = await api.get(`/sales/${response.data._id}/receipt`);
            showReceipt(receipt.data);

            setCart([]);
            setCustomer(null);
            setSelectedProduct(null);
            setQuantity(1);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to process sale');
        } finally {
            setLoading(false);
        }
    };

    const showReceipt = (receipt) => {
        const receiptWindow = window.open('', '_blank', 'width=400,height=600');
        if (!receiptWindow) {
            toast.error('Please allow popups to view receipt');
            return;
        }

        const itemsHtml = receipt.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${item.total.toFixed(2)}</td>
            </tr>
        `).join('');

        receiptWindow.document.write(`
            <html>
                <head>
                    <title>Receipt #${receipt.receiptNumber}</title>
                    <style>
                        body { font-family: 'Courier New', monospace; padding: 20px; max-width: 350px; margin: 0 auto; }
                        .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; }
                        .store-name { font-size: 24px; font-weight: bold; }
                        .receipt-info { margin: 10px 0; }
                        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        th, td { padding: 5px; text-align: left; }
                        .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
                        .footer { text-align: center; border-top: 2px dashed #333; padding-top: 10px; margin-top: 10px; }
                        .thank-you { font-size: 16px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="store-name">SmartBiz</div>
                        <div>123 Business St, City</div>
                        <div>Tel: (555) 123-4567</div>
                    </div>
                    
                    <div class="receipt-info">
                        <div>Receipt #: ${receipt.receiptNumber}</div>
                        <div>Date: ${new Date(receipt.date).toLocaleString()}</div>
                        <div>Customer: ${receipt.customer?.name || 'Walk-in'}</div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div style="text-align: right;">
                        <div>Subtotal: $${receipt.total.toFixed(2)}</div>
                        <div>Tax (7%): $${(receipt.total * 0.07).toFixed(2)}</div>
                        <div class="total">Grand Total: $${(receipt.total * 1.07).toFixed(2)}</div>
                        <div>Payment: ${receipt.paymentMethod}</div>
                    </div>

                    <div class="footer">
                        <div class="thank-you">Thank you for your business!</div>
                        <div style="margin-top: 5px; font-size: 12px;">Visit us again!</div>
                    </div>
                    
                    <script>
                        window.print();
                    <\/script>
                </body>
            </html>
        `);
        receiptWindow.document.close();
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return 'out-of-stock';
        if (stock <= 5) return 'low-stock';
        return 'in-stock';
    };

    const quickAddProduct = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        // Add directly
        const productToAdd = products.find(p => p._id === product._id);
        if (productToAdd && productToAdd.stockQuantity >= 1) {
            const existingItem = cart.find(item => item.product._id === product._id);
            if (existingItem) {
                if (existingItem.quantity + 1 > productToAdd.stockQuantity) {
                    toast.error(`Not enough stock. Available: ${productToAdd.stockQuantity}`);
                    return;
                }
                setCart(cart.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            } else {
                setCart([...cart, { product: productToAdd, quantity: 1 }]);
            }
            toast.success(`Added ${product.name} to cart`);
        } else {
            toast.error('Product out of stock');
        }
    };

    return (
        <div className="sales-processing">
            {/* Header */}
            <div className="sales-processing-header">
                <h1>New Sale</h1>
            </div>

            <div className="sales-grid">
                {/* Left Panel */}
                <div className="sales-left-panel">
                    {/* Product Selection */}
                    <div className="product-selection">
                        <h2>
                            <FaSearch className="icon" />
                            Select Products
                        </h2>

                        <div className="product-search-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search products by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="product-search-input"
                            />
                        </div>

                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product._id}
                                    onClick={() => quickAddProduct(product)}
                                    className="product-card"
                                >
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-category">{product.category || 'Uncategorized'}</div>
                                    <div className="product-bottom">
                                        <span className="product-price">${product.price.toFixed(2)}</span>
                                        <span className={`product-stock ${getStockStatus(product.stockQuantity)}`}>
                                            {product.stockQuantity} in stock
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="no-products">
                                <div className="empty-icon">📦</div>
                                <p>No products found</p>
                            </div>
                        )}

                        <div className="product-selector">
                            <label>Or select from dropdown:</label>
                            <div className="product-selector-row">
                                <select
                                    value={selectedProduct?._id || ''}
                                    onChange={(e) => {
                                        const product = products.find(p => p._id === parseInt(e.target.value));
                                        setSelectedProduct(product);
                                    }}
                                >
                                    <option value="">Choose a product...</option>
                                    {products.map(product => (
                                        <option key={product._id} value={product._id}>
                                            {product.name} - ${product.price} (Stock: {product.stockQuantity})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                                <button onClick={addToCart} className="btn-add-product">
                                    <FaPlus /> Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Customer Section */}
                    <div className="customer-section">
                        <h2>
                            <FaUser className="icon" />
                            Customer Information
                        </h2>
                        <div className="customer-row">
                            <select
                                value={customer?._id || ''}
                                onChange={(e) => {
                                    const selected = customers.find(c => c._id === parseInt(e.target.value));
                                    setCustomer(selected);
                                }}
                            >
                                <option value="">Walk-in Customer</option>
                                {customers.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.name || `${c.firstName} ${c.lastName}`} - {c.phone || c.email}
                                    </option>
                                ))}
                            </select>
                            {customer && (
                                <button
                                    onClick={() => setCustomer(null)}
                                    className="btn-clear-customer"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="payment-section">
                        <h2>
                            <FaWallet className="icon" />
                            Payment Method
                        </h2>
                        <div className="payment-methods">
                            {['cash', 'card', 'transfer'].map((method) => (
                                <div key={method}>
                                    <input
                                        type="radio"
                                        id={method}
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor={method}>
                                        {method.charAt(0).toUpperCase() + method.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Cart */}
                <div className="cart-section">
                    <div className="cart-header">
                        <h2>
                            <FaShoppingCart className="icon" />
                            Cart
                        </h2>
                        <span className="cart-count">{cart.length} items</span>
                    </div>

                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <div className="empty-icon">🛒</div>
                            <p>Cart is empty</p>
                            <p className="empty-sub">Add products to get started</p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map((item) => (
                                    <div key={item.product._id} className="cart-item">
                                        <div className="item-info">
                                            <div className="item-name">{item.product.name}</div>
                                            <div className="item-detail">
                                                ${item.product.price} x {item.quantity}
                                            </div>
                                        </div>
                                        <div className="item-total">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                        <div className="item-actions">
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                className="btn-qty"
                                            >
                                                <FaMinus />
                                            </button>
                                            <span className="qty-display">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                className="btn-qty"
                                            >
                                                <FaPlus />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="btn-remove"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <div className="summary-row">
                                    <span className="label">Subtotal:</span>
                                    <span className="value">${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="label">Tax (7%):</span>
                                    <span className="value">${calculateTax().toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span className="label">Total:</span>
                                    <span className="value">${calculateGrandTotal().toFixed(2)}</span>
                                </div>

                                {customer && (
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                                        Customer: {customer.name || `${customer.firstName} ${customer.lastName}`}
                                    </div>
                                )}

                                <button
                                    onClick={processSale}
                                    className="btn-process-sale"
                                >
                                    <FaReceipt /> Process Sale
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesProcessing;