import '../styles/InventoryDashboard.css';

import DashboardCard from '../components/DashboardCard';
import InventoryChart from '../components/InventoryChart';
import RecentProducts from '../components/RecentProducts';
import LowStockProducts from '../components/LowStockProducts';

function InventoryDashboard() {
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