import { NavLink } from 'react-router-dom';
import { Tag } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  Store,
  Settings,
  LogOut,
  ShoppingBag,
  Calendar,
  Users,
  Image as ImageIcon,
  ImagePlus,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Offers', path: '/offers', icon: Tag },
  { label: 'Store Locations', path: '/stores', icon: Store },
  { label: 'Orders', path: '/orders', icon: ShoppingBag },
  { label: 'Appointments', path: '/appointments', icon: Calendar },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Banners', path: '/banners', icon: ImageIcon },
  { label: 'Product Banners', path: '/product-banners', icon: ImagePlus },
  { label: 'Master Data', path: '/master-data', icon: Database },
];

const settingsNavItems: NavItem[] = [
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ onLogout }: { onLogout: () => void }) {

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center px-6 py-8 border-b border-sidebar-border">
        <img
          src="https://claritone.inspitetech.com/assets/logo.png"
          alt="Claritone Logo"
          className="h-10 w-auto dark:invert dark:brightness-200"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Overview Section */}
        <div className="mb-6">
          <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Overview
          </p>
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Section */}
        <div>
          <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Settings
          </p>
          <ul className="space-y-1">
            {settingsNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mt-2 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
