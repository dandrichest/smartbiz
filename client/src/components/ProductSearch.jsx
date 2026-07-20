/* eslint-disable no-unused-vars */
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

const ProductSearch = ({ search, setSearch, category, setCategory, sort, setSort, products = [] }) => {
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <div className="inventory-search">
            <div className="search-row">
                <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products by name, description, or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="search-filters">
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">Sort by</option>
                        <option value="name">Name</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="stock">Stock</option>
                    </select>
                </div>
            </div>
            <div className="search-results">
                Found {products.length} products
            </div>
        </div>
    );
};

export default ProductSearch;