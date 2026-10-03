"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Tag,
} from "lucide-react";

type BrandSubItem = {
  name: string;
  href: string;
};

type SubItem = {
  name: string;
  href: string;
  brands?: BrandSubItem[];
};

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: SubItem[];
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: Package,
    subItems: [
      { name: 'Refrigeration Equipment', href: '/admin/orders/refrigeration-equipment' },
      { name: 'Walk-in Cooler & Freezer', href: '/admin/orders/walk-in-cooler-freezer' },
    ],
  },
  { name: 'Quote Requests', href: '/admin/quotes', icon: FileText },
  { name: 'General Enquiry', href: '/admin/enquiries', icon: MessageSquare },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    subItems: [
      { name: 'Refrigeration Equipment', href: '/admin/products/refrigeration-equipment' },
      {
        name: 'Walk-in Cooler & Freezer',
        href: '/admin/products/walk-in-cooler-freezer',
        brands: [
          { name: 'Astra', href: '/admin/products/walk-in-cooler-freezer/brand/astra' },
          { name: 'Amerikooler', href: '/admin/products/walk-in-cooler-freezer/brand/amerikooler' },
          { name: 'Icemanz', href: '/admin/products/walk-in-cooler-freezer/brand/icemanz' },
        ],
      },
    ],
  },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(true);
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(true);
  // Track which sub-items with brands are expanded (keyed by subItem name)
  const [expandedSubItems, setExpandedSubItems] = useState<Record<string, boolean>>({
    'Walk-in Cooler & Freezer': true,
  });

  const toggleSubItem = (name: string) => {
    setExpandedSubItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Do not render the admin wrapper on the login page
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#f8fafc]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0b1120] text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-slate-800`}
      >
        {/* Logo */}
        <div className="flex items-center h-20 px-8 bg-[#0f172a] border-b border-slate-800 shrink-0 justify-between">
          <Link href="/admin/dashboard" className="flex items-center">
            <img
              src="/logo.png"
              alt="ICEMANZ Logo"
              className="h-11 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu</p>

          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const hasSubItems = item.subItems && item.subItems.length > 0;

            if (hasSubItems) {
              const isProducts = item.name === 'Products';
              const isOrders = item.name === 'Orders';
              const isDropdownOpen = isProducts ? productsDropdownOpen : ordersDropdownOpen;
              const setDropdownOpen = isProducts ? setProductsDropdownOpen : setOrdersDropdownOpen;

              return (
                <div key={item.name}>
                  {/* Top-level dropdown button */}
                  <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                      {item.name}
                    </div>
                    {isDropdownOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>

                  {isDropdownOpen && (
                    <div className="mt-1 ml-4 space-y-1 border-l border-slate-700 pl-4">
                      {item.subItems?.map((subItem) => {
                        const isSubActive =
                          pathname === subItem.href ||
                          (subItem.href.includes('?') &&
                            pathname === subItem.href.split('?')[0]) ||
                          (isOrders &&
                            pathname === '/admin/orders' &&
                            subItem.name === 'Refrigeration Equipment');

                        const hasBrands = subItem.brands && subItem.brands.length > 0;
                        const isBrandExpanded = expandedSubItems[subItem.name] ?? false;

                        if (hasBrands) {
                          return (
                            <div key={subItem.name}>
                              {/* Sub-item with brands — clickable toggle */}
                              <button
                                onClick={() => toggleSubItem(subItem.name)}
                                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                  isSubActive
                                    ? 'text-blue-400 bg-slate-800/50 font-medium'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                                }`}
                              >
                                <span>{subItem.name}</span>
                                {isBrandExpanded ? (
                                  <ChevronDown size={14} />
                                ) : (
                                  <ChevronRight size={14} />
                                )}
                              </button>

                              {/* Brand level — 3rd level */}
                              {isBrandExpanded && (
                                <div className="mt-1 ml-3 space-y-1 border-l border-slate-700/60 pl-3">
                                  {subItem.brands?.map((brand) => {
                                    const isBrandActive = pathname === brand.href;
                                    return (
                                      <Link
                                        key={brand.name}
                                        href={brand.href}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                                          isBrandActive
                                            ? 'text-blue-400 bg-slate-800/50 font-medium'
                                            : 'text-slate-600 hover:text-slate-300 hover:bg-slate-800/30'
                                        }`}
                                      >
                                        <Tag size={12} className="shrink-0" />
                                        {brand.name}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Regular sub-item (no brands)
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isSubActive
                                ? 'text-blue-400 bg-slate-800/50 font-medium'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular nav item (no sub-items)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout Bottom */}
        <div className="p-4 border-t border-slate-800">
          <form
            action="/admin/login"
            method="GET"
            onSubmit={async (e) => {
              e.preventDefault();
              const { logout } = await import('@/app/admin/login/actions');
              await logout();
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-full text-slate-500 w-64 focus-within:w-80 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none w-full text-sm text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">admin@icemanz.com</p>
              </div>
              <div className="size-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Wrapper */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
