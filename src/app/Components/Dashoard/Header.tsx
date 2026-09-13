'use client';

import React, { useState, useEffect } from 'react';
import { 
  PanelLeftClose, 
  PanelLeft,
  PlusCircle, 
  Calculator, 
  LayoutGrid, 
  Banknote, 
  Bell, 
  UserCircle2,
  Menu
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  onOpenMobileMenu,
}: HeaderProps) {
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  }, []);

  return (
    <header className="h-14 bg-[#0042b3] text-white px-3 sm:px-4 flex items-center justify-between shrink-0 shadow-sm select-none z-20 sticky top-0">
      {/* Left side: Toggles & Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Toggle Button */}
        <button 
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors text-white"
          title="Open Menu"
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        {/* Desktop Toggle Button */}
        <button 
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1.5 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors text-white"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={19} strokeWidth={1.8} />
          ) : (
            <PanelLeft size={19} strokeWidth={1.8} />
          )}
        </button>

        {/* Brand Name (Visible on mobile, or when desktop sidebar is collapsed) */}
        <div className={`flex items-center gap-2 ${sidebarOpen ? 'lg:hidden' : 'flex'}`}>
          <span className="font-bold tracking-wide text-xs sm:text-sm md:text-base text-white truncate max-w-[160px] sm:max-w-none">
            RANGPUR BIKE PARLOUR
          </span>
          <span className="w-2.5 h-2.5 bg-[#00e676] rounded-full inline-block shrink-0 shadow-[0_0_8px_#00e676]" />
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Add Button */}
        <button 
          type="button" 
          className="p-1.5 sm:p-2 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors"
          title="Quick Add"
        >
          <PlusCircle size={18} strokeWidth={1.8} />
        </button>

        {/* Calculator Button */}
        <button 
          type="button" 
          className="hidden sm:flex p-1.5 sm:p-2 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors"
          title="Calculator"
        >
          <Calculator size={18} strokeWidth={1.8} />
        </button>

        {/* POS Button (Highlighted) */}
        <button 
          type="button" 
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400/40 rounded-lg font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
          title="Open POS Terminal"
        >
          <LayoutGrid size={16} strokeWidth={2.2} />
          <span>POS</span>
        </button>

        {/* Cash Register / Drawer */}
        <button 
          type="button" 
          className="p-1.5 sm:p-2 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors"
          title="Cash / Register"
        >
          <Banknote size={18} strokeWidth={1.8} />
        </button>

        {/* Date Display */}
        <div className="hidden md:flex px-2.5 py-1.5 border border-white/20 rounded-lg text-xs font-semibold tracking-wider bg-white/10 text-white">
          {currentDate || '13/09/2026'}
        </div>

        {/* Notifications */}
        <button 
          type="button" 
          className="p-1.5 sm:p-2 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors relative"
          title="Notifications"
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0042b3]" />
        </button>

        {/* Admin Profile */}
        <button 
          type="button" 
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 font-medium text-xs sm:text-sm transition-colors"
        >
          <span className="hidden sm:inline">Admin</span>
          <UserCircle2 size={18} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
