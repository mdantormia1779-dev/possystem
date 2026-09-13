'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ShieldCheck
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
      { id: 'users', label: 'Users' },
      { id: 'roles', label: 'Roles' },
      { id: 'sales-commission', label: 'Sales Commission Agents' },
    ] 
  },
  { 
    id: 'contacts', 
    label: 'Contacts', 
    icon: BookUser, 
    submenus: [
      { id: 'suppliers', label: 'Suppliers' },
      { id: 'customers', label: 'Customers' },
      { id: 'customer-groups', label: 'Customer Groups' },
    ] 
  },
  { 
    id: 'products', 
    label: 'Products', 
    icon: Package, 
    submenus: [
      { id: 'all-products', label: 'List Products' },
      { id: 'add-product', label: 'Add Product' },
      { id: 'print-labels', label: 'Print Labels' },
      { id: 'categories', label: 'Categories' },
      { id: 'brands', label: 'Brands' },
      { id: 'units', label: 'Units' },
    ] 
  },
  { 
    id: 'purchases', 
    label: 'Purchases', 
    icon: ArrowDownToLine, 
    submenus: [
      { id: 'all-purchases', label: 'List Purchases' },
      { id: 'add-purchase', label: 'Add Purchase' },
      { id: 'purchase-returns', label: 'Purchase Return' },
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
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  activeItem?: string;
  onSelectItem?: (id: string) => void;
}

export default function Sidebar({
  mobileMenuOpen,
  onCloseMobileMenu,
  activeItem = 'home',
  onSelectItem,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    products: false,
    sell: false,
  });

  const toggleSubmenu = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full bg-white select-none text-slate-700">
      {/* Sidebar Header / Brand */}
      <div className="h-14 bg-[#0042b3] px-4 flex items-center justify-between shrink-0 border-b border-blue-700/40">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 outline-none group"
          onClick={() => isMobile && onCloseMobileMenu()}
        >
          <span className="text-white font-bold text-sm tracking-wider uppercase group-hover:text-white/90 transition-colors">
            RANGPUR BIKE PARLOUR
          </span>
          <span className="w-2.5 h-2.5 bg-[#00e676] rounded-full inline-block shrink-0 shadow-[0_0_8px_#00e676]" />
        </Link>
        {isMobile && (
          <button
            type="button"
            onClick={onCloseMobileMenu}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            title="Close Sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Menu List */}
      <div className="flex-1 py-3 px-3 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const hasSubmenu = Boolean(item.submenus && item.submenus.length > 0);
          const isExpanded = Boolean(expandedItems[item.id]);

          return (
            <div key={item.id} className="rounded-lg">
              <button
                type="button"
                onClick={() => {
                  if (onSelectItem) onSelectItem(item.id);
                  if (hasSubmenu) {
                    toggleSubmenu(item.id);
                  } else if (isMobile) {
                    onCloseMobileMenu();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#e9edf5] text-[#0042b3] font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-[#0042b3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? 'text-[#0042b3]' : 'text-slate-500'}
                  />
                  <span>{item.label}</span>
                </div>

                {hasSubmenu && (
                  <span className="text-slate-400 transition-transform duration-200">
                    {isExpanded ? (
                      <ChevronDown size={15} strokeWidth={2.5} />
                    ) : (
                      <ChevronLeft size={15} strokeWidth={2.5} />
                    )}
                  </span>
                )}
              </button>

              {/* Submenu Accordion */}
              {hasSubmenu && isExpanded && (
                <div className="mt-1 mb-1.5 ml-4 pl-4 border-l-2 border-slate-200/80 space-y-1">
                  {item.submenus!.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        if (isMobile) onCloseMobileMenu();
                      }}
                      className="w-full text-left text-xs text-slate-500 hover:text-[#0042b3] hover:bg-blue-50/60 py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-between"
                    >
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 shrink-0 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-600">
          <ShieldCheck size={15} className="text-emerald-500" />
          <span className="font-semibold">POS v1.0.0</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Enterprise</span>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* 2. Mobile Drawer Off-Canvas Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderContent(true)}
      </div>

      {/* 3. Desktop Sidebar Content */}
      <div className="h-full w-64">
        {renderContent(false)}
      </div>
    </>
  );
}
