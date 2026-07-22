import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

const ProductSearch = ({ search, setSearch, category, setCategory, sort, setSort, products = [] }) => {
    // Get unique categories from products
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name, description, or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                        <FaFilter className="text-gray-400" />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FaSort className="text-gray-400" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Sort by</option>
                            <option value="name">Name</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="stock">Stock</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="mt-3 text-sm text-gray-500">
                Found {products.length} products
            </div>
        </div>
    );
};

export default ProductSearch;