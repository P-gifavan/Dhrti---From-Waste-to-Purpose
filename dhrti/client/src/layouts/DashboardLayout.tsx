import React, { useState } from 'react';
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  Recycle, 
  LayoutDashboard, 
  LogOut, 
  Home, 
  Menu, 
  X,
  Settings,
  Inbox,
  BarChart3,
  Bookmark,
  Package,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VerificationBadge } from '../components/VerificationBadge';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isSupplier = user?.role === 'supplier';

  const navItems = isSupplier ? [
    { to: '/seller/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/seller/listings', label: 'My Listings', icon: Package },
    { to: '/seller/orders', label: 'Orders', icon: Inbox },
    { to: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/seller/profile', label: 'Profile Settings', icon: Settings },
  ] : [
    { to: '/buyer/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/buyer/orders', label: 'My Orders', icon: Inbox },
    { to: '/buyer/saved-listings', label: 'Saved Listings', icon: Bookmark },
    { to: '/buyer/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/buyer/profile', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center px-6 border-b border-border gap-2">
          <Recycle className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">Dhrti Panel</span>
        </div>
        <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
            ))}
          </nav>

          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-3 px-3 py-2 mb-3 bg-secondary rounded-lg">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate capitalize">{user?.role} Portal</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="relative z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-card border-r border-border"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Recycle className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">Dhrti Mobile</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-muted-foreground hover:bg-accent'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                  ))}
                </nav>
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-3 px-3 py-2 mb-3 bg-secondary rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-foreground capitalize">{user?.role} Portal</p>
                      <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Viewport Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar Placeholder */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground md:block hidden">
                Welcome back, <span className="text-foreground font-bold">{user?.fullName}</span>
              </span>
              {user?.verificationStatus && (
                <div className="hidden md:block">
                  <VerificationBadge status={user.verificationStatus} showText={false} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Go Public Site</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};
