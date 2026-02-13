
/**
 * BazaarNow - Local Grocery Marketplace Clone
 * Rebuilt as a production-ready React application.
 * 
 * Architecture Summary:
 * - Routing: React Router HashRouter for sandbox compatibility.
 * - State: React Context (AppProvider) manages Auth, Cart, and Orders.
 * - Styling: Tailwind CSS for responsive, modern UI.
 * - Persistence: LocalStorage for persistent session data.
 * - Features: Multi-role support, Product Search, Store Browsing, Checkout simulation.
 */


import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import StorePage from './pages/StorePage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import MyOrdersPage from './pages/MyOrdersPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LoginPage from './pages/LoginPage';
import VendorLoginPage from './pages/VendorLoginPage';
import VendorSignupPage from './pages/VendorSignupPage';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/shop" element={<MainLayout><ShopPage /></MainLayout>} />
      <Route path="/store/:storeId" element={<MainLayout><StorePage /></MainLayout>} />
      <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
      <Route path="/privacy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
      <Route path="/terms" element={<MainLayout><TermsOfService /></MainLayout>} />

      {/* Customer Auth */}
      <Route path="/login" element={<LoginPage role="customer" />} />
      <Route path="/signup" element={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="bg-white p-12 rounded-3xl shadow-xl text-center space-y-4"> <h1 className="text-2xl font-bold">Join BazaarNow</h1> <p className="text-gray-500">Sign up feature is simulated. Use <span className="font-bold">user@bazaarnow.com</span> / <span className="font-bold">customer123</span> to login.</p> <Link to="/login" className="text-green-600 font-bold block">Go to Login</Link> </div></div>} />

      {/* Protected Customer Routes */}
      <Route path="/checkout" element={<ProtectedRoute requiredRole="customer"><MainLayout><CheckoutPage /></MainLayout></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute requiredRole="customer"><MainLayout><PaymentPage /></MainLayout></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute requiredRole="customer"><MainLayout><MyOrdersPage /></MainLayout></ProtectedRoute>} />

      {/* Admin Routes - Now Wrapped in MainLayout */}
      <Route path="/admin/login" element={<LoginPage role="admin" />} />
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><MainLayout><AdminDashboard /></MainLayout></ProtectedRoute>} />

      {/* Vendor Routes (Specialized) - Now Wrapped in MainLayout */}
      <Route path="/vendor/login" element={<VendorLoginPage />} />
      <Route path="/vendor/signup" element={<VendorSignupPage />} />
      <Route path="/vendor" element={<ProtectedRoute requiredRole="vendor"><MainLayout><VendorDashboard /></MainLayout></ProtectedRoute>} />

      {/* Delivery Routes - Now Wrapped in MainLayout */}
      <Route path="/delivery/login" element={<LoginPage role="delivery" />} />
      <Route path="/delivery" element={<ProtectedRoute requiredRole="delivery"><MainLayout><DeliveryDashboard /></MainLayout></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
