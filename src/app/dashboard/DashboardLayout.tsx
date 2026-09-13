'use client';

import React, { useState } from 'react';
import Header from '../Components/Dashboard/Header';
import Sidebar from '../Components/Dashboard/Sidebar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('home');

  return (
    <div className="flex h-screen w-full bg-[#f4f6f9] overflow-hidden font-sans antialiased text-slate-800">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:block border-r border-slate-200 shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0 border-r-0'
        }`}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          activeItem={activeItem}
          onSelectItem={(id) => setActiveItem(id)}
        />
      </aside>

      {/* Mobile Drawer (Inside Sidebar component via fixed overlay) */}
      <div className="lg:hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          activeItem={activeItem}
          onSelectItem={(id) => setActiveItem(id)}
        />
      </div>

      {/* Main Column Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar / Header */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
