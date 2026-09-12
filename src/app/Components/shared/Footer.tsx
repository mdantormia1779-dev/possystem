"use client";

import React from "react";

export default function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#0c0827] text-gray-400 pt-16 pb-12 px-6 lg:px-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
        <div className="md:col-span-5 text-left space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="text-white font-extrabold text-base tracking-wider">
              PEPPO<span className="text-indigo-400">POS</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            Simplifying point of sale, receipts, card terminals, and cloud analytics for progressive merchants worldwide.
          </p>
        </div>

        <div className="md:col-span-2 text-left space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Navigation</h4>
          {["home", "features", "solutions", "pricing", "contact"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={(e) => handleScroll(e, item)}
              className="block text-xs hover:text-white capitalize transition-colors cursor-pointer"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="md:col-span-2 text-left space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Legal</h4>
          <a href="#" className="block text-xs hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="block text-xs hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="block text-xs hover:text-white transition-colors">PCI-DSS Security</a>
        </div>

        <div className="md:col-span-3 text-left space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Newsletter</h4>
          <p className="text-[11px] text-gray-400">Get POS release updates and retail insights.</p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 text-xs bg-white/10 border border-white/15 rounded-lg text-white outline-none placeholder-gray-500 focus:border-indigo-400"
            />
            <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
        <div>&copy; {new Date().getFullYear()} PEPPO POS Systems Inc. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-300">Twitter</a>
          <a href="#" className="hover:text-gray-300">LinkedIn</a>
          <a href="#" className="hover:text-gray-300">GitHub</a>
        </div>
      </div>
    </footer>
  );
}