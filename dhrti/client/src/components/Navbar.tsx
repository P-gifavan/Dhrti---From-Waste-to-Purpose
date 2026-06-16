import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Recycle, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/mission', label: 'Mission' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/contact', label: 'Contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/';
    return user.role === 'supplier' ? '/seller/dashboard' : '/buyer/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
              <Recycle className="h-6 w-6 text-primary animate-spin-slow" />
              <span>Dhrti</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <ThemeToggle />
              
              {loading ? (
                <div className="h-9 w-24 animate-pulse rounded-lg bg-muted"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg border border-border bg-background hover:bg-accent hover:text-foreground text-muted-foreground transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-medium px-3.5 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-medium px-3.5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Action Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="space-y-1 px-4 py-3 pb-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block py-2.5 px-3 rounded-lg text-base font-medium transition-colors hover:bg-accent ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="border-t border-border mt-3 pt-3 space-y-2">
                {loading ? (
                  <div className="h-10 w-full animate-pulse rounded-lg bg-muted"></div>
                ) : user ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4 text-primary" />
                      <span>Role: <strong className="capitalize text-foreground">{user.role}</strong></span>
                    </div>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-base font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center rounded-lg border border-border py-2.5 text-base font-medium text-muted-foreground hover:bg-accent"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center rounded-lg bg-primary py-2.5 text-base font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
