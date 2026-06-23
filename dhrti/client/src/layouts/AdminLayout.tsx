import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Users, ShieldCheck, LogOut, Box, ShoppingCart, CreditCard, Star, Activity } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/admin/analytics', icon: <Activity className="w-5 h-5" />, label: 'Analytics' },
    { to: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
    { to: '/admin/verifications', icon: <ShieldCheck className="w-5 h-5" />, label: 'Verifications' },
    { to: '/admin/listings', icon: <Box className="w-5 h-5" />, label: 'Listings' },
    { to: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders' },
    { to: '/admin/payments', icon: <CreditCard className="w-5 h-5" />, label: 'Payments' },
    { to: '/admin/reviews', icon: <Star className="w-5 h-5" />, label: 'Reviews' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col transition-transform duration-300">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <NavLink to="/admin/dashboard" className="text-xl font-bold tracking-tight text-primary">
            Dhrti <span className="text-foreground">Admin</span>
          </NavLink>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
