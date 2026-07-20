import "./ProductSearch.css";

function ProductSearch({
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort
}) {

    return (

        <div className="product-search">

            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Office">Office</option>
            </select>

            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
            >
                <option value="">Sort By</option>
                <option value="name">Name (A-Z)</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
            </select>

        </div>

    );

}

export default ProductSearch;