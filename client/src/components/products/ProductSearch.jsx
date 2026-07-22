import { FaSearch, FaFilter, FaSort, FaTimes } from 'react-icons/fa';
import '../../styles/ProductSearch.css';

const ProductSearch = ({ search, setSearch, category, setCategory, sort, setSort, products = [] }) => {
    // Get unique categories from products
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Clear all filters
    const clearFilters = () => {
        setSearch('');
        setCategory('All');
        setSort('');
    };

    // Check if any filters are active
    const hasActiveFilters = search !== '' || category !== 'All' || sort !== '';

    return (
        <div className="product-search">
            <div className="product-search-row">
                <div className="product-search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products by name, description, or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="product-search-input"
                    />
                </div>
                
                <div className="product-search-filters">
                    <div className="product-search-filter-group">
                        <FaFilter className="filter-icon" />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="product-search-select"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="product-search-filter-group">
                        <FaSort className="filter-icon" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="product-search-select"
                        >
                            <option value="">Sort by</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="stock-low">Stock: Low to High</option>
                            <option value="stock-high">Stock: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results count and clear filters */}
            <div className="product-search-results">
                <span className="results-count">
                    Found <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''}
                </span>
                {hasActiveFilters && (
                    <button className="product-search-clear" onClick={clearFilters}>
                        <FaTimes style={{ marginRight: '4px' }} />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductSearch;