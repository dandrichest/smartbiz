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
import CustomerManagement from "./components/CustomerManagement";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import SalesProcessing from "./components/sales/SalesProcessing";
import SalesHistory from "./components/sales/SalesHistory";
import Settings from "./components/settings/Settings";
import Privacy from "./components/Privacy";
import Terms from './components/Terms';
import Support from "./components/Support";
import Docs from "./components/Docs";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
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
             <Route path="/privacy" element={<Privacy />} />
             <Route path="/terms" element={<Terms />} />
              <Route path="/support" element={<Support />} />
               <Route path="/docs" element={<Docs />} />
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<InventoryDashboard />} />
              <Route path="products" element={<ProductSearch />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="sales" element={<SalesProcessing />} />
              <Route path="sales-history" element={<SalesHistory />} />
              <Route path="settings" element={<Settings />} /> {/* Add this route */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;