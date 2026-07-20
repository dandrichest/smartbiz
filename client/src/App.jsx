import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/common/Layout";
import PrivateRoute from "./components/common/PrivateRoute";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Dashboard from "./components/dashboard/Dashboard";
import InventoryDashboard from "./components/inventory/InventoryDashboard";
import ProductSearch from "./components/products/ProductSearch";
import CustomerManagement from "./components/customers/CustomerManagement";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import SalesProcessing from "./components/sales/SalesProcessing";
import SalesHistory from "./components/sales/SalesHistory";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<SignUpForm />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="inventory" element={<InventoryDashboard />} />
                <Route path="products" element={<ProductSearch />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="sales" element={<SalesProcessing />} />
                <Route path="sales-history" element={<SalesHistory />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;