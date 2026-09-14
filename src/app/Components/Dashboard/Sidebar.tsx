'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  BookUser,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Database,
  Receipt,
  CreditCard,
  FileClock,
  Mail,
  Settings,
  ChevronLeft,
  ChevronDown,
  X,
  Sparkles
} from 'lucide-react';

interface SubmenuItem {
  id: string;
  label: string;
  href?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href?: string;
  submenus?: SubmenuItem[];
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/dashboard' },
  { 
    id: 'user-management', 
    label: 'User Management', 
    icon: Users, 
    submenus: [
      { id: 'users', label: 'Users', href: '/dashboard/users' },
      { id: 'roles', label: 'Roles', href: '/dashboard/rules' },
      { id: 'sales-commission', label: 'Sales Commission Agents', href: '/dashboard/sales-commission-agents' },
    ] 
  },
  { 
    id: 'contacts', 
    label: 'Contacts', 
    icon: BookUser, 
    submenus: [
      { id: 'suppliers', label: 'Suppliers', href: '/dashboard/suppliers' },
      { id: 'customers', label: 'Customers', href: '/dashboard/customers' },
      { id: 'customer-groups', label: 'Customer Groups', href: '/dashboard/customer-groups' },
      { id: 'import-contacts', label: 'Import Contacts', href: '/dashboard/import-contacts' },
    ] 
  },
  { 
    id: 'products', 
    label: 'Products', 
    icon: Package, 
    submenus: [
      { id: 'all-products', label: 'List Products', href: '/dashboard/products' },
      { id: 'add-product', label: 'Add Product', href: '/dashboard/products/create' },
      { id: 'update-price', label: 'Update Price', href: '/dashboard/products/update-price' },
      { id: 'print-labels', label: 'Print Labels', href: '/dashboard/products/print-labels' },
      { id: 'variations', label: 'Variations', href: '/dashboard/products/variations' },
      { id: 'import-products', label: 'Import Products', href: '/dashboard/products/import' },
      { id: 'import-opening-stock', label: 'Import Opening Stock', href: '/dashboard/products/import-opening-stock' },
      { id: 'selling-price-group', label: 'Selling Price Group', href: '/dashboard/products/selling-price-group' },
      { id: 'units', label: 'Units', href: '/dashboard/products/units' },
      { id: 'categories', label: 'Categories', href: '/dashboard/products/categories' },
      { id: 'brands', label: 'Brands', href: '/dashboard/products/brands' },
      { id: 'warranties', label: 'Warranties', href: '/dashboard/products/warranties' },
    ] 
  },
  { 
    id: 'purchases', 
    label: 'Purchases', 
    icon: ArrowDownToLine, 
    submenus: [
      { id: 'all-purchases', label: 'List Purchases', href: '/dashboard/purchases' },
      { id: 'add-purchase', label: 'Add Purchase', href: '/dashboard/purchases/add' },
      { id: 'purchase-returns', label: 'Purchase Return', href: '/dashboard/purchases/returns' },
    ] 
  },
  { 
    id: 'sell', 
    label: 'Sell', 
    icon: ArrowUpFromLine, 
    submenus: [
      { id: 'all-sales', label: 'All Sales' },
      { id: 'add-sale', label: 'Add Sale' },
      { id: 'pos-list', label: 'POS Terminal' },
      { id: 'drafts', label: 'Drafts' },
      { id: 'quotations', label: 'Quotations' },
    ] 
  },
  { 
    id: 'stock-adjustment', 
    label: 'Stock Adjustment', 
    icon: Database, 
    submenus: [
      { id: 'all-adjustments', label: 'List Stock Adjustments' },
      { id: 'add-adjustment', label: 'Add Stock Adjustment' },
    ] 
  },
  { 
    id: 'expenses', 
    label: 'Expenses', 
    icon: Receipt, 
    submenus: [
      { id: 'all-expenses', label: 'List Expenses' },
      { id: 'add-expense', label: 'Add Expense' },
      { id: 'expense-categories', label: 'Expense Categories' },
    ] 
  },
  { 
    id: 'payment-accounts', 
    label: 'Payment Accounts', 
    icon: CreditCard, 
    submenus: [
      { id: 'list-accounts', label: 'List Accounts' },
      { id: 'balance-sheet', label: 'Balance Sheet' },
      { id: 'trial-balance', label: 'Trial Balance' },
      { id: 'cash-flow', label: 'Cash Flow' },
    ] 
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: FileClock, 
    submenus: [
      { id: 'profit-loss', label: 'Profit / Loss Report' },
      { id: 'purchase-sale', label: 'Purchase & Sale' },
      { id: 'stock-report', label: 'Stock Report' },
      { id: 'trending-products', label: 'Trending Products' },
    ] 
  },
  { id: 'notification-templates', label: 'Notification Templates', icon: Mail },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    submenus: [
      { id: 'business-settings', label: 'Business Settings' },
      { id: 'business-locations', label: 'Business Locations' },
      { id: 'invoice-settings', label: 'Invoice Settings' },
      { id: 'barcode-settings', label: 'Barcode Settings' },
      { id: 'printers', label: 'Printers' },
      { id: 'tax-rates', label: 'Tax Rates' },
    ] 
  },
];

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobileMenu?: () => void;
  activeItem?: string;
  onSelectItem?: (id: string) => void;
}

export default function Sidebar({
  isMobile = false,
  onCloseMobileMenu,
  activeItem = 'home',
  onSelectItem,
}: SidebarProps) {
  const pathname = usePathname();

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'user-management': true,
    products: false,
    sell: false,
  });

  useEffect(() => {
    if (
      pathname?.startsWith('/dashboard/users') ||
      pathname?.startsWith('/dashboard/rules') ||
      pathname?.startsWith('/dashboard/sales-commission-agents')
    ) {
      setExpandedItems((prev) => ({ ...prev, 'user-management': true }));
    }
    if (
      pathname?.startsWith('/dashboard/suppliers') || 
      pathname?.startsWith('/dashboard/customers') ||
      pathname?.startsWith('/dashboard/customer-groups') ||
      pathname?.startsWith('/dashboard/import-contacts')
    ) {
      setExpandedItems((prev) => ({ ...prev, contacts: true }));
    }
    if (pathname?.startsWith('/dashboard/products')) {
      setExpandedItems((prev) => ({ ...prev, products: true }));
    }
    if (pathname?.startsWith('/dashboard/purchases')) {
      setExpandedItems((prev) => ({ ...prev, purchases: true }));
    }
  }, [pathname]);

  const toggleSubmenu = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="flex flex-col h-[100dvh] w-full max-w-full bg-[#0c0827] text-slate-300 select-none border-r border-white/10 overflow-hidden">
      {/* Sidebar Header / Brand */}
      <div className="h-16 px-3.5 sm:px-4 flex items-center justify-between shrink-0 border-b border-white/10 bg-[#0c0827]">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2.5 outline-none group min-w-0"
          onClick={() => isMobile && onCloseMobileMenu && onCloseMobileMenu()}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform shrink-0">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="4"
                transform="rotate(45 12 12)"
              />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-extrabold tracking-wider text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 truncate">
              RANGPUR BIKE
            </span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block shrink-0 shadow-[0_0_8px_#34d399]" />
          </div>
        </Link>

        {isMobile && onCloseMobileMenu && (
          <button
            type="button"
            onClick={onCloseMobileMenu}
            className="text-slate-300 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors active:scale-95 shrink-0 ml-2 cursor-pointer"
            title="Close Sidebar"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Menu List */}
      <nav 
        aria-label="Main Navigation"
        className="flex-1 py-2.5 sm:py-3 px-2.5 sm:px-3 overflow-y-auto space-y-1 overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSubmenu = Boolean(item.submenus && item.submenus.length > 0);
          const isExpanded = Boolean(expandedItems[item.id]);

          // Check if item is active
          const isItemActive = item.href
            ? pathname === item.href
            : item.id === 'user-management'
            ? pathname?.startsWith('/dashboard/users') ||
              pathname?.startsWith('/dashboard/rules') ||
              pathname?.startsWith('/dashboard/sales-commission-agents')
            : item.id === 'contacts'
            ? pathname?.startsWith('/dashboard/suppliers') || 
              pathname?.startsWith('/dashboard/customers') ||
              pathname?.startsWith('/dashboard/customer-groups') ||
              pathname?.startsWith('/dashboard/import-contacts')
            : item.id === 'products'
            ? pathname?.startsWith('/dashboard/products')
            : item.id === 'purchases'
            ? pathname?.startsWith('/dashboard/purchases')
            : activeItem === item.id;

          const itemClass = `w-full flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-150 cursor-pointer ${
            isItemActive
              ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-500/15 text-white border border-indigo-500/40 shadow-[0_0_18px_rgba(99,102,241,0.2)] font-semibold'
              : 'text-slate-400 hover:bg-white/[0.05] hover:text-white border border-transparent'
          }`;

          return (
            <div key={item.id} className="rounded-xl">
              {item.href && !hasSubmenu ? (
                <Link
                  href={item.href}
                  onClick={() => {
                    if (onSelectItem) onSelectItem(item.id);
                    if (isMobile && onCloseMobileMenu) onCloseMobileMenu();
                  }}
                  className={itemClass}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <Icon
                      size={18}
                      className={isItemActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] shrink-0' : 'text-slate-400 shrink-0'}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectItem) onSelectItem(item.id);
                    if (hasSubmenu) {
                      toggleSubmenu(item.id);
                    } else if (isMobile && onCloseMobileMenu) {
                      onCloseMobileMenu();
                    }
                  }}
                  className={itemClass}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <Icon
                      size={18}
                      className={isItemActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] shrink-0' : 'text-slate-400 shrink-0'}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {hasSubmenu && (
                    <span className="text-slate-500 transition-transform duration-200 shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronDown size={14} strokeWidth={2.5} />
                      ) : (
                        <ChevronLeft size={14} strokeWidth={2.5} />
                      )}
                    </span>
                  )}
                </button>
              )}

              {/* Submenu Accordion */}
              {hasSubmenu && isExpanded && (
                <div className="mt-1 mb-2 ml-3.5 sm:ml-4 pl-2.5 sm:pl-3 border-l border-indigo-500/30 space-y-1">
                  {item.submenus!.map((sub) => {
                    const hasMoreSpecificSibling = item.submenus?.some(
                      (sibling) =>
                        sibling.href &&
                        sibling.href !== sub.href &&
                        sibling.href.startsWith(sub.href + '/') &&
                        (pathname === sibling.href || pathname?.startsWith(sibling.href + '/'))
                    );

                    const isSubActive = sub.href
                      ? pathname === sub.href ||
                        (sub.href !== '/dashboard' &&
                          pathname?.startsWith(sub.href + '/') &&
                          !hasMoreSpecificSibling)
                      : false;

                    if (sub.href) {
                      return (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          onClick={() => {
                            if (isMobile && onCloseMobileMenu) onCloseMobileMenu();
                          }}
                          className={`w-full text-left text-[11px] sm:text-xs py-2 px-2.5 rounded-lg font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSubActive
                              ? 'bg-indigo-600/30 text-cyan-300 border border-indigo-500/40 font-semibold shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                              : 'text-slate-400 hover:text-indigo-200 hover:bg-white/[0.05]'
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {isSubActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] shrink-0" />
                          )}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          if (isMobile && onCloseMobileMenu) onCloseMobileMenu();
                        }}
                        className="w-full text-left text-[11px] sm:text-xs text-slate-400 hover:text-indigo-200 hover:bg-white/[0.05] py-2 px-2.5 rounded-lg font-medium transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer Card */}
      <div className="p-2.5 sm:p-3 border-t border-white/10 bg-white/[0.02] shrink-0">
        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/50 to-purple-950/40 border border-indigo-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
              <Sparkles size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white tracking-wide truncate">POS Enterprise</p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
                Online
              </p>
            </div>
          </div>
          <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-400/30 shrink-0">
            v1.0.0
          </span>
        </div>
      </div>
    </aside>
  );
}