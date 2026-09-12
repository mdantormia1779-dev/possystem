"use client";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

interface HeaderProps {
  onNavigate?: (id: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { title: "Home", id: "home" },
    { title: "Features", id: "features" },
    { title: "Solutions", id: "solutions" },
    { title: "Pricing", id: "pricing" },
    { title: "Contact", id: "contact" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 lg:px-16 pt-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-full bg-[#110d33]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleScroll(e, "home")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <svg
              className="w-4 h-4 text-white"
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
          <span className="text-white font-extrabold text-base tracking-wider">
            <span className="text-indigo-400">POS</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScroll(e, link.id)}
              className="text-xs font-medium text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-gray-300 hover:text-white px-4 py-2 transition-colors"
          >
            Sign In
          </Link>
          <motion.a
            href="#pricing"
            onClick={(e) => handleScroll(e, "pricing")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 bg-white text-gray-950 px-4 py-2 rounded-full font-bold text-xs shadow-md hover:bg-gray-100 transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </motion.a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-gray-300 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 p-6 rounded-3xl bg-[#130f3a] border border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 text-center"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleScroll(e, link.id)}
                className="text-sm font-medium text-gray-300 hover:text-white py-1"
              >
                {link.title}
              </a>
            ))}
            <div className="h-px bg-white/10 my-1" />
            <a
              href="#pricing"
              onClick={(e) => handleScroll(e, "pricing")}
              className="flex items-center justify-center gap-1.5 bg-white text-gray-950 py-2.5 rounded-full font-bold text-xs"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
