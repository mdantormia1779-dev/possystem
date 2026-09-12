"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function PricingSection() {
  const [pricingCycle, setPricingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Starter",
      price: pricingCycle === "monthly" ? "$29" : "$23",
      desc: "Ideal for small single-counter shops & pop-up stores.",
      features: ["1 POS Register", "Up to 1,000 Products", "Basic Daily Sales Analytics", "Email Support", "Digital Receipts"],
      popular: false,
    },
    {
      name: "Professional",
      price: pricingCycle === "monthly" ? "$79" : "$63",
      desc: "Perfect for busy restaurants & medium retail stores.",
      features: ["3 POS Registers", "Unlimited Products & SKU", "Inventory Low Stock Alerts", "Employee Shifts & Commission", "Priority 24/7 Support", "Barcode & Label Printing"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: pricingCycle === "monthly" ? "$199" : "$159",
      desc: "Built for multi-branch chains & franchises.",
      features: ["Unlimited Registers", "Multi-branch Centralized Sync", "Dedicated Database & API", "Custom ERP Integration", "Dedicated Account Manager", "Custom Receipt & Logo Branding"],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="scroll-mt-24 relative w-full py-24 px-6 lg:px-20 bg-slate-50">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-4">
          Transparent Pricing
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Flexible Plans For Every Stage
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mb-8">
          Choose a plan that fits your current operational scale. Upgrade or cancel anytime without hidden costs.
        </p>

        {/* Switcher */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <span className={`text-xs font-bold ${pricingCycle === "monthly" ? "text-gray-900" : "text-gray-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setPricingCycle(pricingCycle === "monthly" ? "yearly" : "monthly")}
            className="w-12 h-6 rounded-full bg-indigo-600 p-1 flex items-center transition-all cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                pricingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-bold ${pricingCycle === "yearly" ? "text-gray-900" : "text-gray-400"}`}>
            Yearly <span className="text-indigo-600 text-[10px] font-extrabold bg-indigo-100 px-2 py-0.5 rounded-full ml-1">SAVE 20%</span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all ${
                plan.popular
                  ? "bg-[#110d33] text-white shadow-2xl scale-105 border-2 border-indigo-400"
                  : "bg-white text-gray-900 border border-gray-200 shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-[10px] font-extrabold uppercase tracking-widest">
                  MOST POPULAR
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className={`text-xs mb-6 ${plan.popular ? "text-gray-300" : "text-gray-500"}`}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={`text-xs ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>/month</span>
                </div>
                <div className="h-px bg-gray-200/20 mb-6" />
                <ul className="space-y-3 mb-8 text-xs">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.popular ? "text-cyan-400" : "text-indigo-600"}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className={`w-full py-3 rounded-xl text-xs font-bold tracking-wider text-center block transition-all cursor-pointer ${
                  plan.popular
                    ? "bg-white text-gray-950 hover:bg-gray-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                CHOOSE {plan.name.toUpperCase()}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}