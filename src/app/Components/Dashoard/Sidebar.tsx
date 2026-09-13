import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  hasSubmenu?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'user-management', label: 'User Management', icon: Users, hasSubmenu: true },
  { id: 'contacts', label: 'Contacts', icon: BookUser, hasSubmenu: true },
  { id: 'products', label: 'Products', icon: Package, hasSubmenu: true },
  { id: 'purchases', label: 'Purchases', icon: ArrowDownToLine, hasSubmenu: true },
  { id: 'sell', label: 'Sell', icon: ArrowUpFromLine, hasSubmenu: true },
  { id: 'stock-adjustment', label: 'Stock Adjustment', icon: Database, hasSubmenu: true },
  { id: 'expenses', label: 'Expenses', icon: Receipt, hasSubmenu: true },
  { id: 'payment-accounts', label: 'Payment Accounts', icon: CreditCard, hasSubmenu: true },
  { id: 'reports', label: 'Reports', icon: FileClock, hasSubmenu: true },
  { id: 'notification-templates', label: 'Notification Templates', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings, hasSubmenu: true },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState<string>('home');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col select-none">
      {/* Top Header/Brand Bar */}
      <div className="bg-[#0042b3] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm tracking-wide">
            RANGPUR BIKE PARLOUR
          </span>
          <span className="w-2.5 h-2.5 bg-[#00e676] rounded-full inline-block shrink-0 shadow-sm" />
        </div>
      </div>

      {/* Navigation Menu List */}
      <div className="flex-1 py-3 px-3 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const isExpanded = !!expandedItems[item.id];

          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setActiveItem(item.id);
                  if (item.hasSubmenu) {
                    toggleSubmenu(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#e9edf5] text-[#0042b3] font-semibold'
                    : 'text-[#334155] hover:bg-slate-50 hover:text-[#0042b3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? 'text-[#0042b3]' : 'text-[#475569]'}
                  />
                  <span>{item.label}</span>
                </div>

                {item.hasSubmenu && (
                  <span className="text-slate-400">
                    {isExpanded ? (
                      <ChevronDown size={14} strokeWidth={2.5} />
                    ) : (
                      <ChevronLeft size={14} strokeWidth={2.5} />
                    )}
                  </span>
                )}
              </button>

              {/* Submenu Dropdown Items (Placeholder Demo) */}
              {item.hasSubmenu && isExpanded && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  <div className="text-xs text-slate-500 hover:text-[#0042b3] py-1 cursor-pointer">
                    List {item.label}
                  </div>
                  <div className="text-xs text-slate-500 hover:text-[#0042b3] py-1 cursor-pointer">
                    Add {item.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}