'use client';

import React, { useState, useEffect } from 'react';
import Header from '../Components/Dashboard/Header';
import Sidebar from '../Components/Dashboard/Sidebar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('home');

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-screen w-full bg-[#0a0620] overflow-hidden font-sans antialiased text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:block border-r border-white/10 shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0 border-r-0'
        }`}
      >
        <div className="w-64 h-full">
          <Sidebar
            isMobile={false}
            activeItem={activeItem}
            onSelectItem={(id) => setActiveItem(id)}
          />
        </div>
      </aside>

      {/* 2. Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Off-Canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 max-w-[85vw] shadow-2xl lg:hidden transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          isMobile={true}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          activeItem={activeItem}
          onSelectItem={(id) => {
            setActiveItem(id);
            setMobileMenuOpen(false);
          }}
        />
      </div>

      {/* 4. Main View Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Ambient Cosmic Background Glows */}
        <div className="absolute -top-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#40169d]/20 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-80 sm:w-[450px] h-80 sm:h-[450px] rounded-full bg-[#271578]/25 blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#5b21b6]/15 blur-[140px] pointer-events-none" />

        {/* Top Navbar / Header */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Page Content with Responsive Padding */}
        <main className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-6 lg:p-8 relative z-10 scrollbar-thin min-w-0 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
