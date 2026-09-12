"use client";

import React from "react";
import { Store, UtensilsCrossed, ShoppingBag, Building2, ArrowUpRight } from "lucide-react";

export default function SolutionsSection() {
  const solutions = [
    {
      icon: <Store className="w-6 h-6 text-cyan-400" />,
      title: "Retail & Boutiques",
      desc: "Barcode generation, matrix inventory by size/color, customer loyalty rewards.",
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6 text-indigo-400" />,
      title: "Restaurants & Cafes",
      desc: "Kitchen display system (KDS), table management, bill split, and recipe cost tracking.",
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-purple-400" />,
      title: "Grocery & Supermarkets",
      desc: "Integrated weighing scale, fast SKU search, batch expiry notifications.",
    },
    {
      icon: <Building2 className="w-6 h-6 text-emerald-400" />,
      title: "Multi-Chain Brands",
      desc: "Centralized warehouse stock movement, unified sales analytics, role-based access.",
    },
  ];

  return (
    <section id="solutions" className="scroll-mt-24 relative w-full py-24 px-6 lg:px-20 bg-slate-900 text-white overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold tracking-wider uppercase mb-4">
            Tailored For Your Industry
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            One System, Infinite Solutions
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-3 leading-relaxed">
            Designed dynamically to adapt to restaurants, retail stores, super shops, and multi-chain enterprises without friction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((sol, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.08] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                  {sol.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{sol.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{sol.desc}</p>
              </div>
              <div
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-6 flex items-center gap-1.5 text-indigo-400 text-xs font-semibold cursor-pointer group"
              >
                <span>Learn more</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}