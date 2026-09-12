"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, BarChart3, Zap, ShieldCheck, Smartphone } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 relative w-full py-24 px-6 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-4">
          Quip POS Software
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight max-w-2xl mx-auto leading-tight mb-16">
          Business With Our Cutting <br /> Edge Quip POS Software
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Panel Left */}
          <div className="relative flex flex-col items-center p-6 sm:p-8 bg-slate-50/70 rounded-3xl border border-slate-100">
            <div className="absolute top-1/4 left-10 w-48 h-48 rounded-full bg-indigo-200/50 blur-3xl pointer-events-none" />

            <motion.div
              whileHover={{ y: -4 }}
              className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 mb-6 text-left"
            >
              <div className="text-xs font-bold text-gray-800 mb-2">How Was Investor Experience?</div>
              <div className="flex items-center gap-3 text-xl">
                <span>😊</span>
                <span>😍</span>
                <span>🤩</span>
                <span>🔥</span>
              </div>
            </motion.div>

            <div className="w-full max-w-sm flex items-center justify-between bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 mb-6">
              <div>
                <div className="text-[11px] text-gray-400 font-medium">BTC / USD</div>
                <div className="text-base font-bold text-gray-900">$55,435.362</div>
                <div className="text-[10px] text-emerald-600 font-semibold">+1.7%</div>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg border border-gray-100 text-left">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-3">
                <span className="text-xs font-bold text-gray-800">Analytics Overview</span>
                <BarChart3 className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="h-28 w-full flex items-end justify-between gap-2 pt-4 px-2">
                {[35, 65, 45, 85, 55, 95, 75, 40].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      style={{ height: `${val}%` }}
                      className={`w-full rounded-t-md ${i % 2 === 0 ? "bg-indigo-500" : "bg-cyan-400"}`}
                    />
                    <span className="text-[8px] text-gray-400">D{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Right */}
          <div className="relative flex flex-col items-center lg:items-start text-left">
            <div className="space-y-3 mb-6 w-full max-w-sm">
              {["Smooth Payment", "Fast Checkout", "Less Waiting's"].map((feat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white shadow-sm border border-gray-100 text-xs font-semibold text-gray-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </motion.div>
              ))}
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-36 h-48 bg-slate-900 rounded-2xl p-2.5 flex flex-col justify-between border border-slate-700 shadow-md">
                <div className="w-full h-16 bg-slate-800 rounded-lg p-2 text-center text-[10px] text-emerald-400 font-mono">
                  SUCCESSFUL <br />
                  $1,240.00
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-4 bg-slate-800 rounded text-[9px] text-white flex items-center justify-center">
                      {n}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 text-left space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quick Transfer</span>
                <div className="text-xl font-extrabold text-gray-900">$1,240.00</div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Instant POS receipts & synced multi-store inventory updates in real time.
                </p>
                <button
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  GET STARTED NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-6 h-6 text-indigo-500" />,
              title: "Ultra Fast Checkout",
              desc: "Reduce queue times by 70% with barcode scanning, instant contactless tap, and quick key actions.",
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
              title: "Bank-Grade Encryption",
              desc: "Every transaction is tokenized and end-to-end encrypted with PCI-DSS compliance standards.",
            },
            {
              icon: <Smartphone className="w-6 h-6 text-indigo-500" />,
              title: "Cloud & Mobile Sync",
              desc: "Monitor your multi-outlet sales, staff shifts, and stock inventories from any phone or browser.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left transition-all hover:shadow-xl hover:bg-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}