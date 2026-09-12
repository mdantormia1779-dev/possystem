"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Play, Sparkles, CreditCard } from "lucide-react";

const floatVariant = (delay = 0, yOffset = 10): Variants => ({
  initial: { y: 0 },
  animate: {
    y: [-yOffset, yOffset, -yOffset],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    },
  },
});

export default function HeroSection() {
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[920px] bg-[#0c0827] overflow-hidden px-6 lg:px-20 pt-36 pb-24 flex items-center"
    >
      <div className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-[#40169d] blur-[160px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[700px] h-[700px] rounded-full bg-[#271578] blur-[170px] opacity-75 pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-[#5b21b6] blur-[180px] opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Top Choice For 5,600+ Websites Worldwide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.12] tracking-tight mb-5">
            Our Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-white">POS</span> <br />
            Software Solutions
          </h1>

          <p className="text-sm sm:text-base text-gray-300/80 leading-relaxed max-w-md mb-8">
            Our state-of-the-art POS software is designed to best streamline your business operations, optimize checkout, and enhance customer satisfaction seamlessly.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              onClick={scrollToPricing}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-white text-gray-950 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-white/20 transition-all cursor-pointer"
            >
              <span>GET STARTED NOW</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>

            <motion.button
              onClick={scrollToFeatures}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-full text-white/90 hover:text-white font-medium text-xs tracking-wide bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
              </div>
              <span>Play Video</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Right POS Mockup */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[500px]">
          <div className="absolute w-[360px] sm:w-[420px] h-[520px] rounded-t-full border border-indigo-400/25 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-64 sm:w-72 h-80 rounded-3xl bg-gradient-to-b from-[#2a3754] to-[#172036] border-2 border-indigo-300/30 p-3 shadow-2xl shadow-indigo-950/80 flex flex-col items-center">
              <div className="w-full h-36 bg-[#131a29] rounded-2xl p-3 border border-white/10 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                  <span>PeppoPay POS</span>
                  <span className="text-emerald-400">● Online</span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-400">Total Due</span>
                  <div className="text-xl font-bold text-white">$124.50</div>
                </div>
                <div className="text-[9px] text-center text-indigo-300">
                  Please Tap or Insert Card
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full mt-4 px-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "X", 0, "OK"].map((k, i) => (
                  <div
                    key={i}
                    className="h-6 rounded-md bg-slate-800/80 text-gray-300 flex items-center justify-center text-[11px] font-semibold border border-white/5"
                  >
                    {k}
                  </div>
                ))}
              </div>

              <motion.div
                animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-16 w-32 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl shadow-xl p-2.5 flex flex-col justify-between border border-white/30"
              >
                <div className="w-5 h-4 bg-yellow-300/80 rounded-sm" />
                <div className="text-[9px] text-white tracking-widest font-mono">•••• 8824</div>
              </motion.div>
            </div>
          </div>

          {/* Floating Profit Badge */}
          <motion.div
            variants={floatVariant(0, 12)}
            initial="initial"
            animate="animate"
            className="absolute -top-4 left-0 sm:left-4 z-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl text-white w-44"
          >
            <div className="text-[10px] text-gray-300 font-medium">Profit Last Year</div>
            <div className="text-lg font-bold text-white mt-0.5">$482.5</div>
            <div className="text-[9px] text-emerald-300 font-semibold mb-2">↑ From 1.5bps</div>
            <div className="h-6 w-full flex items-end gap-1">
              {[40, 55, 35, 60, 45, 80, 70, 95].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-gradient-to-t from-indigo-400 to-cyan-300 rounded-t-sm opacity-80"
                />
              ))}
            </div>
          </motion.div>

          {/* Floating Quick Transfer */}
          <motion.div
            variants={floatVariant(1, 10)}
            initial="initial"
            animate="animate"
            className="absolute top-2 right-0 sm:right-2 z-20 bg-[#161233]/90 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-2xl text-white w-48"
          >
            <div className="flex justify-between items-center text-[10px] text-gray-300 font-medium pb-2 border-b border-white/10">
              <span>Quick Transfer</span>
              <span className="text-[9px] text-indigo-300">Activity &gt;</span>
            </div>
            <div className="mt-2 text-[10px] text-gray-400">Enter Amount</div>
            <div className="text-xs font-bold text-white mt-0.5">$1.2k</div>
            <button className="w-full mt-2.5 py-1 bg-indigo-600 text-[9px] font-bold rounded-lg text-white tracking-wider uppercase">
              TRANSFER
            </button>
          </motion.div>

          {/* Floating Bottom Card */}
          <motion.div
            variants={floatVariant(2, 14)}
            initial="initial"
            animate="animate"
            className="absolute -bottom-8 right-2 sm:right-6 z-20 space-y-2 w-52"
          >
            {[
              { amount: "$12.43 Today", name: "Received from Michael V." },
              { amount: "$45.00 Today", name: "Received from Sarah K." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2.5 flex items-center gap-2.5 shadow-lg"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {item.name[14]}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[9px] font-bold text-emerald-300">{item.amount}</div>
                  <div className="text-[10px] text-gray-200">{item.name}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="absolute -bottom-6 left-6 z-10 w-28 h-28 rounded-full border border-indigo-400/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-indigo-900/80 border border-indigo-300/40 flex items-center justify-center text-white">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}