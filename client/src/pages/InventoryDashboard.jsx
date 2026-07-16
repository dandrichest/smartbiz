import '../styles/InventoryDashboard.css';
import { useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import InventoryChart from '../components/InventoryChart';
import RecentProducts from '../components/RecentProducts';
import LowStockProducts from '../components/LowStockProducts';
import ProductSearch from '../components/ProductSearch';

function InventoryDashboard() {

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("");
    return (
        <div className="dashboard">
            <h1>Inventory Dashboard</h1>

            <div className="cards">
                <DashboardCard
                    title="Total Products"
                    value="350" />

                <DashboardCard
                    title="In Stock"
                    value="318" />


                <DashboardCard
                    title="Low Stock"
                    value="22" />

                <DashboardCard
                    title="Out of Stock"
                    value="10" />
            </div>

            <ProductSearch
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort} />

            <div className="charts">
                <InventoryChart />
                <InventoryChart />
            </div>

            <RecentProducts />
            <LowStockProducts />
        </div>
    )
}

export default InventoryDashboard;