import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'buyer' | 'supplier' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login but save the original route requested
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Authenticated but incorrect role. Redirect to matching dashboard.
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : user.role === 'supplier' ? '/seller/dashboard' : '/buyer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
