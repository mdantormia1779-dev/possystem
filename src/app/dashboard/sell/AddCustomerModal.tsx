"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Users,
  Smartphone,
  Phone,
  Mail,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Building
} from 'lucide-react';

export interface NewCustomerContactData {
  id?: string;
  contactType: 'Individual' | 'Business';
  businessName?: string;
  contactId: string;
  customerGroup: string;
  name: string;
  mobile: string;
  alternateNumber: string;
  landline: string;
  email: string;
  assignedTo: string;
  taxNumber?: string;
  openingBalance?: number;
  payTermNumber?: string;
  payTermType?: 'Days' | 'Months';
  addressLine1?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  shippingAddress?: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: NewCustomerContactData) => void;
}

export default function AddCustomerModal({ isOpen, onClose, onSave }: AddCustomerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [contactType, setContactType] = useState<'Individual' | 'Business'>('Individual');
  const [businessName, setBusinessName] = useState('');
  const [contactId, setContactId] = useState('');
  const [customerGroup, setCustomerGroup] = useState('None');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [landline, setLandline] = useState('');
  const [email, setEmail] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // More Informations state
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [taxNumber, setTaxNumber] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [payTermNumber, setPayTermNumber] = useState('');
  const [payTermType, setPayTermType] = useState<'Days' | 'Months'>('Days');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      alert('Mobile number is required');
      return;
    }

    const generatedId = contactId.trim() || `CO${Math.floor(1000 + Math.random() * 9000)}`;
    const displayName =
      contactType === 'Business' && businessName.trim()
        ? businessName.trim()
        : name.trim() || `Customer (${mobile.trim()})`;

    const newContact: NewCustomerContactData = {
      id: String(Date.now()),
      contactType,
      businessName: contactType === 'Business' ? businessName.trim() : undefined,
      contactId: generatedId,
      customerGroup,
      name: displayName,
      mobile: mobile.trim(),
      alternateNumber: alternateNumber.trim(),
      landline: landline.trim(),
      email: email.trim(),
      assignedTo: assignedTo.trim(),
      taxNumber: taxNumber.trim(),
      openingBalance: openingBalance ? parseFloat(openingBalance) : 0,
      payTermNumber: payTermNumber.trim(),
      payTermType,
      addressLine1: addressLine1.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      zipCode: zipCode.trim(),
      shippingAddress: shippingAddress.trim()
    };

    onSave(newContact);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-xs pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 shrink-0 bg-[#0c0827]/70 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-600/30 text-violet-300 border border-violet-500/30">
              <User size={18} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Add a new contact
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body matching Screenshot 4 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/15 text-xs text-slate-300">
          
          {/* Row 1: Individual/Business radio, Contact ID, Customer Group */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            
            {/* Radio buttons */}
            <div className="md:col-span-4 flex items-center gap-5 pt-3">
              <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-slate-200">
                <input
                  type="radio"
                  name="customerContactType"
                  value="Individual"
                  checked={contactType === 'Individual'}
                  onChange={() => setContactType('Individual')}
                  className="w-4 h-4 accent-violet-600 cursor-pointer"
                />
                <span>Individual</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-slate-200">
                <input
                  type="radio"
                  name="customerContactType"
                  value="Business"
                  checked={contactType === 'Business'}
                  onChange={() => setContactType('Business')}
                  className="w-4 h-4 accent-violet-600 cursor-pointer"
                />
                <span>Business</span>
              </label>
            </div>

            {/* Contact ID */}
            <div className="md:col-span-4">
              <label className="block font-semibold text-slate-300 mb-1.5">
                Contact ID:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <CreditCard size={15} />
                </span>
                <input
                  type="text"
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  placeholder="Contact ID"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Leave empty to autogenerate</p>
            </div>

            {/* Customer Group */}
            <div className="md:col-span-4">
              <label className="block font-semibold text-slate-300 mb-1.5">
                Customer Group:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Users size={15} />
                </span>
                <select
                  value={customerGroup}
                  onChange={(e) => setCustomerGroup(e.target.value)}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-white focus:outline-none focus:border-indigo-500/60 shadow-inner appearance-none cursor-pointer"
                >
                  <option value="None" className="bg-[#0c0827]">None</option>
                  <option value="Retail Customers" className="bg-[#0c0827]">Retail Customers</option>
                  <option value="Wholesale Customers" className="bg-[#0c0827]">Wholesale Customers</option>
                  <option value="VIP Members" className="bg-[#0c0827]">VIP Members</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Business Name if Business selected */}
          {contactType === 'Business' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Business Name:<span className="text-rose-400 ml-0.5">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Building size={15} />
                </span>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Business Name"
                  required
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Row of 4 inputs: Mobile:*, Alternate contact number, Landline, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mobile:* */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Mobile:<span className="text-rose-400 ml-0.5">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Smartphone size={15} />
                </span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile"
                  required
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
                />
              </div>
            </div>

            {/* Alternate contact number */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Alternate contact number:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Phone size={15} />
                </span>
                <input
                  type="tel"
                  value={alternateNumber}
                  onChange={(e) => setAlternateNumber(e.target.value)}
                  placeholder="Alternate contact nur"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
                />
              </div>
            </div>

            {/* Landline */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Landline:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Phone size={15} />
                </span>
                <input
                  type="tel"
                  value={landline}
                  onChange={(e) => setLandline(e.target.value)}
                  placeholder="Landline"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Email:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Assigned to: */}
          <div className="max-w-md">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Assigned to:
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                <User size={15} />
              </span>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Assigned to"
                className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
              />
            </div>
          </div>

          {/* More Informations Dropdown Pill Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="px-5 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span>More Informations</span>
              {showMoreInfo ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          {/* Collapsible Section for More Information */}
          {showMoreInfo && (
            <div className="p-5 rounded-2xl bg-[#0c0827]/70 border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Tax number:</label>
                  <input
                    type="text"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    placeholder="Tax number"
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Opening Balance:</label>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Pay term:</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={payTermNumber}
                      onChange={(e) => setPayTermNumber(e.target.value)}
                      placeholder="Salary / Term"
                      className="w-1/2 bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                    />
                    <select
                      value={payTermType}
                      onChange={(e) => setPayTermType(e.target.value as 'Days' | 'Months')}
                      className="w-1/2 bg-[#08051e] border border-white/15 rounded-xl px-2 py-2 text-white focus:border-indigo-500/60"
                    >
                      <option value="Days" className="bg-[#0c0827]">Days</option>
                      <option value="Months" className="bg-[#0c0827]">Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Address Line 1:</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Address line 1"
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">City:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">State:</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Country:</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Zip Code:</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Zip code"
                    className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Shipping Address:</label>
                <textarea
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Shipping address"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:border-indigo-500/60"
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer active:scale-95"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer active:scale-95"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
