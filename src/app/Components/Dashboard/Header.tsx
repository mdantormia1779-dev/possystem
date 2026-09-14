'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PanelLeftClose, 
  PanelLeft,
  PlusCircle, 
  Calculator, 
  LayoutGrid, 
  Banknote, 
  Bell, 
  UserCircle2,
  Menu,
  Calendar
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
    <header className="h-16 bg-[#0c0827]/95 backdrop-blur-xl border-b border-white/10 text-white px-3 sm:px-5 lg:px-6 flex items-center justify-between shrink-0 select-none z-30 sticky top-0 shadow-[0_4px_24px_rgba(0,0,0,0.35)] w-full">
      {/* Left side: Toggles & Brand */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Toggle Button (Touch Friendly) */}
        <button 
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-slate-200 transition-all active:scale-95 shrink-0"
          title="Open Menu"
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        {/* Desktop Toggle Button */}
        <button 
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95 shrink-0"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={18} strokeWidth={1.8} />
          ) : (
            <PanelLeft size={18} strokeWidth={1.8} />
          )}
        </button>

        {/* Brand Name & Logo (Visible on mobile, or when desktop sidebar is collapsed) */}
        <div className={`items-center gap-2 sm:gap-2.5 min-w-0 ${sidebarOpen ? 'lg:hidden flex' : 'flex'}`}>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
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
            <span className="font-extrabold tracking-wider text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 truncate max-w-[110px] xs:max-w-[160px] sm:max-w-none">
              RANGPUR BIKE
            </span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block shrink-0 shadow-[0_0_8px_#34d399]" />
          </div>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Quick Add Button (Desktop / Tablet) */}
        <button 
          type="button" 
          className="hidden sm:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
          title="Quick Add Product/Customer"
        >
          <PlusCircle size={18} strokeWidth={1.8} />
        </button>

        {/* Calculator Button (Tablet / Desktop) */}
        <button 
          type="button" 
          className="hidden md:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
          title="Calculator"
        >
          <Calculator size={18} strokeWidth={1.8} />
        </button>

        {/* POS Button (Always prominent on all screens) */}
        <button 
          type="button" 
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-300 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 border border-indigo-300/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          title="Open POS Terminal"
        >
          <LayoutGrid size={15} strokeWidth={2.4} />
          <span>POS</span>
        </button>

        {/* Cash Register / Drawer (Desktop / Tablet) */}
        <button 
          type="button" 
          className="hidden sm:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
          title="Cash Register & Accounts"
        >
          <Banknote size={18} strokeWidth={1.8} />
        </button>

        {/* Date Display (Large Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-xs font-semibold text-indigo-300 tracking-wider">
          <Calendar size={13} className="text-indigo-400" />
          <span>{currentDate || '13/09/2026'}</span>
        </div>

        {/* Notifications */}
        <button 
          type="button" 
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all relative"
          title="Notifications"
        >
          <Bell size={18} strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0c0827] shadow-[0_0_6px_#f43f5e]" />
        </button>

        {/* Admin Profile */}
        <button 
          type="button" 
          className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold shadow-xs shrink-0">
            A
          </div>
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
}
