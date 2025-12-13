import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, RefreshCw, TrendingDown, Package, LayoutDashboard, Grid3x3 } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Swap', path: '/swap', icon: RefreshCw },
    { name: 'Liquidation', path: '/liquidation', icon: TrendingDown },
    { name: 'Wanted', path: '/wanted', icon: Package },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-border shadow-2xl">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${active
                ? 'text-[#10B981] bg-[#10B981]/10'
                : 'text-muted-foreground active:bg-gray-100'
                }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
              {active && (
                <div className="absolute bottom-0 w-12 h-1 bg-[#10B981] rounded-t-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}