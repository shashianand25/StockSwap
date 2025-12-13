import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, Menu, X, User, LogOut, LayoutDashboard, ShoppingBag, TrendingDown, Package, Zap, Home, Grid3x3, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getCurrentUser } from '../lib/auth';
import { signOutUser } from '../lib/supabaseAuth';
import { toast } from 'sonner@2.0.3';

import logo from '../assets/logo.png';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Update user state on location change
  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  // Listen to auth state changes (handles sign in/out from Supabase)
  useEffect(() => {
    const updateUser = () => {
      setUser(getCurrentUser());
    };

    // Listen to storage events for cross-tab synchronization
    window.addEventListener('storage', updateUser);

    return () => {
      window.removeEventListener('storage', updateUser);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home, badge: undefined },
    { name: 'Swap', path: '/swap', icon: RefreshCw, badge: undefined },
    { name: 'Sell', path: '/liquidation', icon: TrendingDown, badge: undefined },
    { name: 'Wanted', path: '/wanted', icon: Package, badge: undefined },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Supabase logout failed, clearing local storage anyway:', error);
    }
    // Always clear local state
    setUser(null);
    setDropdownOpen(false);
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'stockswap_user',
      oldValue: localStorage.getItem('stockswap_user'),
      newValue: null,
    }));
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
            <img src={logo} alt="StockSwap" className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-2xl text-[#0F172A] font-semibold">StockSwap</span>
              <p className="text-xs text-[#10B981] -mt-1">Smart B2B Trading</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative group px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 ${active
                    ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-md'
                    : 'text-muted-foreground hover:bg-gray-100 hover:text-[#0F172A] border-2 border-gray-200 hover:border-[#10B981]/30'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="font-medium">{link.name}</span>
                  {link.badge && (
                    <Badge className={`text-xs px-2 py-0 ${active ? 'bg-white text-[#10B981]' : 'bg-[#10B981] text-white'}`}>
                      {link.badge}
                    </Badge>
                  )}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/add-goods">
                  <Button className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-md hover:shadow-lg transition-all rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goods
                  </Button>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-[#10B981] transition-all bg-gradient-to-r from-gray-50 to-white hover:shadow-md"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white font-semibold shadow-md">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#0F172A]">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.shopName}</p>
                    </div>
                    {user.verified && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                        Verified
                      </Badge>
                    )}
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-50 animate-slide-down overflow-hidden">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#10B981]/10 hover:to-[#059669]/10 transition-all border-b border-gray-100"
                        >
                          <User className="w-4 h-4 text-[#10B981]" />
                          <span className="text-sm font-medium">Profile & Analytics</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#10B981]/10 hover:to-[#059669]/10 transition-all border-b border-gray-100"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#10B981]" />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <Link
                          to="/add-goods"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#10B981]/10 hover:to-[#059669]/10 transition-all border-b border-gray-100"
                        >
                          <Plus className="w-4 h-4 text-[#10B981]" />
                          <span className="text-sm font-medium">Add Goods</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all w-full text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-gray-100 rounded-xl">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-md hover:shadow-lg transition-all rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-[#0F172A]'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                    {link.badge && (
                      <Badge className={`text-xs ml-auto ${active ? 'bg-white text-[#10B981]' : 'bg-[#10B981] text-white'}`}>
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}

              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-200 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.shopName}</p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile & Analytics
                      </Button>
                    </Link>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/add-goods" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Goods
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-[#10B981] to-[#059669]">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}