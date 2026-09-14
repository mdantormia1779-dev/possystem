"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Smartphone, 
  Phone, 
  Mail, 
  CreditCard, 
  Info, 
  DollarSign, 
  MapPin, 
  Globe, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export interface SupplierFormData {
  id?: string;
  contactType: string;
  isBusiness: boolean;
  businessName: string;
  contactId: string;
  name: string;
  mobile: string;
  alternateNumber: string;
  landline: string;
  email: string;
  assignedTo: string;
  taxNumber: string;
  openingBalance: number;
  advanceBalance: number;
  payTermNumber: string;
  payTermType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  customField1: string;
  customField2: string;
  customField3: string;
  customField4: string;
  customField5: string;
  customField6: string;
  customField7: string;
  customField8: string;
  customField9: string;
  customField10: string;
  shippingAddress: string;
  totalPurchaseDue: number;
  totalPurchaseReturnDue: number;
  addedOn?: string;
  status?: 'active' | 'inactive';
}

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SupplierFormData) => void;
  initialData?: SupplierFormData | null;
}

export default function AddSupplierModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddSupplierModalProps) {
  const [mounted, setMounted] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const [formData, setFormData] = useState<SupplierFormData>({
    contactType: 'Suppliers',
    isBusiness: false,
    businessName: '',
    contactId: '',
    name: '',
    mobile: '',
    alternateNumber: '',
    landline: '',
    email: '',
    assignedTo: '',
    taxNumber: '',
    openingBalance: 0,
    advanceBalance: 0,
    payTermNumber: '',
    payTermType: 'Days',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    customField5: '',
    customField6: '',
    customField7: '',
    customField8: '',
    customField9: '',
    customField10: '',
    shippingAddress: '',
    totalPurchaseDue: 0,
    totalPurchaseReturnDue: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (
        initialData.taxNumber ||
        initialData.addressLine1 ||
        initialData.city ||
        initialData.customField1 ||
        initialData.shippingAddress
      ) {
        setShowMoreInfo(true);
      }
    } else {
      setFormData({
        contactType: 'Suppliers',
        isBusiness: false,
        businessName: '',
        contactId: '',
        name: '',
        mobile: '',
        alternateNumber: '',
        landline: '',
        email: '',
        assignedTo: '',
        taxNumber: '',
        openingBalance: 0,
        advanceBalance: 0,
        payTermNumber: '',
        payTermType: 'Days',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        customField1: '',
        customField2: '',
        customField3: '',
        customField4: '',
        customField5: '',
        customField6: '',
        customField7: '',
        customField8: '',
        customField9: '',
        customField10: '',
        shippingAddress: '',
        totalPurchaseDue: 0,
        totalPurchaseReturnDue: 0,
      });
      setShowMoreInfo(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobile.trim()) {
      alert('Mobile number is required');
      return;
    }
    const finalName = formData.name.trim() || formData.businessName.trim() || formData.contactId.trim() || 'Supplier';
    onSave({
      ...formData,
      name: finalName,
      contactId: formData.contactId.trim() || `CO${String(Math.floor(1000 + Math.random() * 9000))}`,
      addedOn: formData.addedOn || new Date().toLocaleDateString('en-GB'),
      status: formData.status || 'active',
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-xs pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 shrink-0 bg-[#0c0827]/70 backdrop-blur-sm">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            {initialData ? 'Edit contact' : 'Add a new contact'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/15">
          {/* Row 1: Contact type, Individual/Business radio, Contact ID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Contact Type */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact type:<span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <User size={15} />
                </span>
                <select
                  name="contactType"
                  value={formData.contactType}
                  onChange={handleChange}
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/70 cursor-pointer shadow-inner"
                >
                  <option value="Suppliers">Suppliers</option>
                  <option value="Customers">Customers</option>
                  <option value="Both">Both (Supplier & Customer)</option>
                </select>
              </div>
            </div>

            {/* Radio options: Individual vs Business */}
            <div className="md:col-span-4 flex items-center gap-5 pt-6">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="customerType"
                  checked={!formData.isBusiness}
                  onChange={() => setFormData((p) => ({ ...p, isBusiness: false }))}
                  className="w-4 h-4 text-violet-600 bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
                />
                <span>Individual</span>
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="customerType"
                  checked={formData.isBusiness}
                  onChange={() => setFormData((p) => ({ ...p, isBusiness: true }))}
                  className="w-4 h-4 text-violet-600 bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
                />
                <span>Business</span>
              </label>
            </div>

            {/* Contact ID */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact ID:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <CreditCard size={15} />
                </span>
                <input
                  type="text"
                  name="contactId"
                  value={formData.contactId}
                  onChange={handleChange}
                  placeholder="Contact ID"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Leave empty to autogenerate</p>
            </div>
          </div>

          {/* Conditional Business Name row */}
          {formData.isBusiness && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Business name:<span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Business name"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Supplier Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contact person name"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
            </div>
          )}

          {!formData.isBusiness && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Name:<span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full bg-[#0a0620] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
              />
            </div>
          )}

          {/* Row 2: Mobile, Alternate contact number, Landline, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mobile:<span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <Smartphone size={15} />
                </span>
                <input
                  type="text"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alternate contact number:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <Phone size={15} />
                </span>
                <input
                  type="text"
                  name="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleChange}
                  placeholder="Alternate contact number"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Landline:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <Phone size={15} />
                </span>
                <input
                  type="text"
                  name="landline"
                  value={formData.landline}
                  onChange={handleChange}
                  placeholder="Landline"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email:
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Assigned to */}
          <div className="max-w-md">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assigned to:
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 pointer-events-none">
                <User size={15} />
              </span>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Assigned to"
                className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
              />
            </div>
          </div>

          {/* Toggle More Informations Button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>More Informations</span>
              {showMoreInfo ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          {/* Collapsible More Information Section */}
          {showMoreInfo && (
            <div className="space-y-6 pt-4 animate-in fade-in duration-200">
              <hr className="border-white/10" />

              {/* Tax number, Opening Balance, Pay term */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tax number:
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                      <Info size={15} />
                    </span>
                    <input
                      type="text"
                      name="taxNumber"
                      value={formData.taxNumber}
                      onChange={handleChange}
                      placeholder="Tax number"
                      className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Opening Balance:
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                      <DollarSign size={15} />
                    </span>
                    <input
                      type="number"
                      name="openingBalance"
                      step="any"
                      value={formData.openingBalance}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Pay term:</span>
                    <span title="Payments terms condition" className="cursor-help text-cyan-400">
                      <Info size={12} />
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="payTermNumber"
                      value={formData.payTermNumber}
                      onChange={handleChange}
                      placeholder="Pay term"
                      className="w-1/2 bg-[#0a0620] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                    />
                    <select
                      name="payTermType"
                      value={formData.payTermType}
                      onChange={handleChange}
                      className="w-1/2 bg-[#0a0620] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/70 cursor-pointer shadow-inner"
                    >
                      <option value="Please Select">Please Select</option>
                      <option value="Days">Days</option>
                      <option value="Months">Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Address Line 1 & Line 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Address line 1:
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Address line 1"
                    className="w-full bg-[#0a0620] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Address line 2:
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Address line 2"
                    className="w-full bg-[#0a0620] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                  />
                </div>
              </div>

              {/* City, State, Country, Zip Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    City:
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                      <MapPin size={15} />
                    </span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    State:
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                      <MapPin size={15} />
                    </span>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Country:
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                      <Globe size={15} />
                    </span>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Zip Code:
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                      <MapPin size={15} />
                    </span>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="Zip/Postal Code"
                      className="w-full bg-[#0a0620] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Custom Fields 1 through 10 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const fieldKey = `customField${num}` as keyof SupplierFormData;
                  return (
                    <div key={num}>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Custom Field {num}:
                      </label>
                      <input
                        type="text"
                        name={fieldKey}
                        value={(formData[fieldKey] as string) || ''}
                        onChange={handleChange}
                        placeholder={`Custom Field ${num}`}
                        className="w-full bg-[#0a0620] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                      />
                    </div>
                  );
                })}
              </div>

              <hr className="border-white/10" />

              {/* Shipping Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Shipping Address
                </label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="Search address"
                  className="w-full bg-[#0a0620] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/70 shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#1e1b4b] hover:bg-[#25215c] text-slate-300 hover:text-white border border-white/15 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
