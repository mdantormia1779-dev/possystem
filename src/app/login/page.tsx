"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // GSAP Animation for Background Floating Orbs
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        x: "+=50",
        y: "-=30",
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        x: "-=40",
        y: "+=40",
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    }

    if (orb3Ref.current) {
      gsap.to(orb3Ref.current, {
        scale: 1.15,
        x: "+=30",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  // Framer Motion Variants with strict typing
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-[#bcd9f8] select-none">
      {/* Background Ambient Orbs (GSAP) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={orb1Ref}
          className="absolute -top-[10%] -left-[10%] w-[550px] h-[550px] rounded-full bg-[#527ef9] blur-[110px] opacity-75"
        />
        <div
          ref={orb2Ref}
          className="absolute -bottom-[15%] -left-[5%] w-[600px] h-[600px] rounded-full bg-[#7565fc] blur-[130px] opacity-70"
        />
        <div
          ref={orb3Ref}
          className="absolute top-[5%] -right-[10%] w-[550px] h-[550px] rounded-full bg-[#dcf1ff] blur-[100px] opacity-90"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        
        {/* Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full bg-white/95 backdrop-blur-md rounded-[32px] shadow-[0_20px_60px_rgba(50,80,180,0.18)] px-8 py-10 sm:px-11 border border-white/70"
        >
          {/* Headings */}
          <motion.div variants={itemVariants} className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Welcome Back!
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              We missed you! Please enter your details.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-gray-800 placeholder-gray-300 transition-all duration-200"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-gray-800 placeholder-gray-300 transition-all duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Checkbox & Forgot Password */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between pt-0.5"
            >
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400 cursor-pointer"
                />
                <span className="text-[11px] text-gray-500 font-medium">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-[11px] text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors"
              >
                Forgot password?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                className="w-full py-2.5 px-4 bg-[#4f6bf2] hover:bg-[#435ee3] text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200/50 transition-colors"
              >
                Sign in
              </motion.button>
            </motion.div>

            {/* Google Sign In Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.015, backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.985 }}
                type="button"
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white text-gray-700 text-xs font-medium border border-gray-200 rounded-xl transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with google</span>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-[11px] text-gray-500 mt-8"
          >
            Don&apos;t have an account?{" "}
            <a
              href="signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign up
            </a>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}