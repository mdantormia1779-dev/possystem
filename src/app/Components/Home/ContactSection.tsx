"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="scroll-mt-24 relative w-full py-24 px-6 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Details */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-4">
              Get In Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Ready to elevate your retail checkout?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
              Speak directly with our technical team for custom hardware setup, onboarding assistance, or a live software demonstration.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Call Us</div>
                  <div className="font-bold">+1 (800) 245-PEPPO</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Email Support</div>
                  <div className="font-bold">support@peppopos.com</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Headquarters</div>
                  <div className="font-bold">Silicon Valley Financial Tech Park, CA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg text-left">
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Message Received!</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Thank you for contacting Peppo POS. Our technical specialist will reach out within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">First Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Last Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Business Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@business.com"
                      className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Business Type</label>
                    <select className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700">
                      <option>Retail Store / Fashion Boutique</option>
                      <option>Restaurant / Coffee Shop</option>
                      <option>Supermarket / Grocery</option>
                      <option>Multi-Chain Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell us about your requirements..."
                      className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND INQUIRY</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}