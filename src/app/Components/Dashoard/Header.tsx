import React from 'react';
import { 
  PanelLeftClose, 
  PlusCircle, 
  Calculator, 
  LayoutGrid, 
  Banknote, 
  Bell, 
  UserCircle2 
} from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-[#0042b3] text-white px-4 py-2.5 flex items-center justify-between select-none shadow-sm">
      {/* বাম পাশ: Brand ও Sidebar toggle */}
      <div className="flex items-center gap-4">
        {/* ব্র্যান্ড নাম এবং স্ট্যাটাস ডট */}
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide text-base sm:text-lg">
            RANGPUR BIKE PARLOUR
          </span>
          <span className="w-3 h-3 bg-emerald-400 rounded-full inline-block" />
        </div>

        {/* সাইডবার টগল বাটন */}
        <button 
          type="button"
          className="p-1.5 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors text-white"
          title="Toggle Sidebar"
        >
          <PanelLeftClose size={20} strokeWidth={1.8} />
        </button>
      </div>

      {/* ডান পাশ: অ্যাকশন বাটনসমূহ */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* অ্যাড বাটন */}
        <button 
          type="button" 
          className="p-2 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors"
          title="Add New"
        >
          <PlusCircle size={20} strokeWidth={1.8} />
        </button>

        {/* ক্যালকুলেটর বাটন */}
        <button 
          type="button" 
          className="p-2 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors"
          title="Calculator"
        >
          <Calculator size={20} strokeWidth={1.8} />
        </button>

        {/* POS বাটন */}
        <button 
          type="button" 
          className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 font-medium text-sm transition-colors"
        >
          <LayoutGrid size={18} strokeWidth={2} />
          <span>POS</span>
        </button>

        {/* ক্যাশ / ব্যাংক ড্রয়ার */}
        <button 
          type="button" 
          className="p-2 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors"
          title="Cash / Register"
        >
          <Banknote size={20} strokeWidth={1.8} />
        </button>

        {/* তারিখ ব্যাজ */}
        <div className="px-3 py-1.5 border border-white/20 rounded-lg text-sm font-medium tracking-wider bg-white/5">
          13/09/2026
        </div>

        {/* নোটিফিকেশন */}
        <button 
          type="button" 
          className="p-2 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 transition-colors relative"
          title="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />
        </button>

        {/* অ্যাডমিন প্রোফাইল */}
        <button 
          type="button" 
          className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 hover:border-white/40 rounded-lg hover:bg-white/10 font-medium text-sm transition-colors"
        >
          <span>Admin</span>
          <UserCircle2 size={20} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}