import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts & Protected Routes (Keep statically imported for performance)
import { DashboardLayout } from './layouts/DashboardLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy-loaded Pages
const LandingPage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const MissionPage = React.lazy(() => import('./pages/MissionPage').then(module => ({ default: module.MissionPage })));
const HowItWorksPage = React.lazy(() => import('./pages/HowItWorksPage').then(module => ({ default: module.HowItWorksPage })));
const SuppliersPage = React.lazy(() => import('./pages/SuppliersPage').then(module => ({ default: module.SuppliersPage })));
const BuyersPage = React.lazy(() => import('./pages/BuyersPage').then(module => ({ default: module.BuyersPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const MarketplacePage = React.lazy(() => import('./pages/MarketplacePage').then(module => ({ default: module.MarketplacePage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = React.lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })));

const DashboardOverview = React.lazy(() => import('./pages/seller/DashboardOverview').then(module => ({ default: module.DashboardOverview })));
const MyListings = React.lazy(() => import('./pages/seller/MyListings').then(module => ({ default: module.MyListings })));
const Requests = React.lazy(() => import('./pages/seller/Requests').then(module => ({ default: module.Requests })));
const SellerAnalytics = React.lazy(() => import('./pages/seller/Analytics').then(module => ({ default: module.Analytics })));
const SellerProfile = React.lazy(() => import('./pages/seller/Profile').then(module => ({ default: module.Profile })));

const BuyerDashboard = React.lazy(() => import('./pages/buyer/DashboardOverview').then(module => ({ default: module.DashboardOverview })));
const BuyerRequests = React.lazy(() => import('./pages/buyer/Requests').then(module => ({ default: module.Requests })));
const BuyerSavedListings = React.lazy(() => import('./pages/buyer/SavedListings').then(module => ({ default: module.SavedListings })));
const BuyerAnalytics = React.lazy(() => import('./pages/buyer/Analytics').then(module => ({ default: module.Analytics })));
const BuyerProfile = React.lazy(() => import('./pages/buyer/Profile').then(module => ({ default: module.Profile })));

// Fallback loader
const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Initialize Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/mission" element={<MissionPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                  <Route path="/buyers" element={<BuyersPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Route>

                <Route
                  path="/seller"
                  element={
                    <ProtectedRoute allowedRole="supplier">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<DashboardOverview />} />
                  <Route path="listings" element={<MyListings />} />
                  <Route path="orders" element={<Requests />} />
                  <Route path="analytics" element={<SellerAnalytics />} />
                  <Route path="profile" element={<SellerProfile />} />
                </Route>

                <Route
                  path="/buyer"
                  element={
                    <ProtectedRoute allowedRole="buyer">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<BuyerDashboard />} />
                  <Route path="orders" element={<BuyerRequests />} />
                  <Route path="saved-listings" element={<BuyerSavedListings />} />
                  <Route path="analytics" element={<BuyerAnalytics />} />
                  <Route path="profile" element={<BuyerProfile />} />
                </Route>

                {/* Fallback Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
