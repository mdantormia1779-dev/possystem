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
  ChevronUp,
  Building2,
  Users
} from 'lucide-react';

export interface CustomerFormData {
  id?: string;
  contactType: string;
  contactId: string;
  customerGroup: string;
  isBusiness: boolean;
  businessName: string;
  prefix?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  name: string;
  mobile: string;
  alternateNumber?: string;
  landline?: string;
  email?: string;
  assignedTo?: string;
  taxNumber?: string;
  openingBalance: number;
  advanceBalance: number;
  payTermNumber?: string;
  payTermType?: string;
  creditLimit?: number | string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  customField1?: string;
  customField2?: string;
  customField3?: string;
  customField4?: string;
  customField5?: string;
  customField6?: string;
  customField7?: string;
  customField8?: string;
  customField9?: string;
  customField10?: string;
  shippingAddress?: string;
  totalSaleDue?: number;
  totalSellReturnDue?: number;
  addedOn?: string;
  status?: 'active' | 'inactive';
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CustomerFormData) => void;
  initialData?: CustomerFormData | null;
}

export default function AddCustomerModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddCustomerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const [formData, setFormData] = useState<CustomerFormData>({
    contactType: 'Customers',
    contactId: '',
    customerGroup: 'None',
    isBusiness: false,
    businessName: '',
    prefix: '',
    firstName: '',
    middleName: '',
    lastName: '',
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
    creditLimit: '',
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
    totalSaleDue: 0,
    totalSellReturnDue: 0,
    status: 'active',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        prefix: initialData.prefix || '',
        firstName: initialData.firstName || initialData.name || '',
        middleName: initialData.middleName || '',
        lastName: initialData.lastName || '',
        creditLimit: initialData.creditLimit !== undefined ? initialData.creditLimit : '',
        customerGroup: initialData.customerGroup || 'None',
      });
      setShowMoreInfo(true);
    } else {
      setFormData({
        contactType: 'Customers',
        contactId: '',
        customerGroup: 'None',
        isBusiness: false,
        businessName: '',
        prefix: '',
        firstName: '',
        middleName: '',
        lastName: '',
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
        creditLimit: '',
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
        totalSaleDue: 0,
        totalSellReturnDue: 0,
        status: 'active',
      });
      setShowMoreInfo(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = formData.isBusiness && formData.businessName
      ? formData.businessName
      : [formData.prefix, formData.firstName, formData.middleName, formData.lastName]
          .filter(Boolean)
          .join(' ') || formData.name || 'Customer';

    const cleanContactId = formData.contactId.trim() || `CO${Math.floor(1000 + Math.random() * 9000)}`;

    onSave({
      ...formData,
      contactId: cleanContactId,
      name: fullName,
      openingBalance: Number(formData.openingBalance) || 0,
      advanceBalance: Number(formData.advanceBalance) || 0,
      creditLimit: formData.creditLimit !== '' ? Number(formData.creditLimit) : 0,
      totalSaleDue: formData.totalSaleDue ?? 0,
      totalSellReturnDue: formData.totalSellReturnDue ?? 0,
      addedOn: formData.addedOn || new Date().toLocaleDateString('en-GB'),
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#0e0a2b] border border-white/15 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#120e34]">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {initialData ? 'Edit contact' : 'Add a new contact'}
            </h2>
            <div className="text-slate-400 hover:text-slate-200 cursor-pointer" title="Contact Information">
              <Info size={16} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs select-none [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
          
          {/* Top Row: Contact type, Contact ID, Customer Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Contact type:<span className="text-rose-400 ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  name="contactType"
                  value={formData.contactType}
                  onChange={handleChange}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer appearance-none pr-8"
                >
                  <option value="Customers">Customers</option>
                  <option value="Suppliers">Suppliers</option>
                  <option value="Both">Both (Supplier & Customer)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Contact ID:
              </label>
              <input
                type="text"
                name="contactId"
                value={formData.contactId}
                onChange={handleChange}
                placeholder="Contact ID"
                className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Leave empty to autogenerate
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Customer Group:
              </label>
              <div className="relative">
                <select
                  name="customerGroup"
                  value={formData.customerGroup}
                  onChange={handleChange}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer appearance-none pr-8"
                >
                  <option value="None">None</option>
                  <option value="Retail">Retail Customers</option>
                  <option value="Wholesale">Wholesale Customers</option>
                  <option value="VIP">VIP Club</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Individual vs Business Radio */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="radio"
                name="businessRadio"
                checked={!formData.isBusiness}
                onChange={() => setFormData((prev) => ({ ...prev, isBusiness: false }))}
                className="accent-violet-500 cursor-pointer"
              />
              <span className="font-semibold">Individual</span>
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="radio"
                name="businessRadio"
                checked={formData.isBusiness}
                onChange={() => setFormData((prev) => ({ ...prev, isBusiness: true }))}
                className="accent-violet-500 cursor-pointer"
              />
              <span className="font-semibold">Business</span>
            </label>
          </div>

          {/* If Business: Show Business Name */}
          {formData.isBusiness ? (
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Business Name:<span className="text-rose-400 ml-0.5">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Business Name"
                  required={formData.isBusiness}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          ) : (
            /* If Individual: Prefix, First Name, Middle Name, Last Name */
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Prefix:
                </label>
                <input
                  type="text"
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleChange}
                  placeholder="Mr / Mrs / Miss"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-slate-300 font-semibold mb-1.5">
                  First Name:<span className="text-rose-400 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required={!formData.isBusiness}
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Middle Name:
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Middle Name"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          )}

          {/* Contact Details Row: Mobile, Alternate, Landline, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Mobile:<span className="text-rose-400 ml-0.5">*</span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile"
                  required
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Alternate contact number:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleChange}
                  placeholder="Alternate contact number"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Landline:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="landline"
                  value={formData.landline}
                  onChange={handleChange}
                  placeholder="Landline"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Email:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Assigned To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Assigned to:
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="Assigned to"
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* More Informations Toggle Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 hover:text-white font-semibold transition-all cursor-pointer"
            >
              <span>More Informations</span>
              {showMoreInfo ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          {/* Collapsible Section: More Informations */}
          {showMoreInfo && (
            <div className="space-y-5 pt-3 border-t border-white/10 animate-in fade-in duration-200">
              
              {/* Financial & Tax Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Tax number:
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="taxNumber"
                      value={formData.taxNumber}
                      onChange={handleChange}
                      placeholder="Tax number"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Opening Balance:
                  </label>
                  <div className="relative">
                    <span className="text-slate-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">৳</span>
                    <input
                      type="number"
                      step="any"
                      name="openingBalance"
                      value={formData.openingBalance}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Pay term:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="payTermNumber"
                      value={formData.payTermNumber}
                      onChange={handleChange}
                      placeholder="Salary"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl px-2.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-xs"
                    />
                    <select
                      name="payTermType"
                      value={formData.payTermType}
                      onChange={handleChange}
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer text-xs"
                    >
                      <option value="Please Select">Please Select</option>
                      <option value="Days">Days</option>
                      <option value="Months">Months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Credit Limit:
                  </label>
                  <div className="relative">
                    <span className="text-slate-400 font-bold absolute left-3 top-1/2 -translate-y-1/2">৳</span>
                    <input
                      type="number"
                      step="any"
                      name="creditLimit"
                      value={formData.creditLimit}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Keep blank for no limit
                  </span>
                </div>
              </div>

              {/* Address Header */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-3">
                  <MapPin size={15} className="text-cyan-400" />
                  <span>Address Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Address line 1:
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Address line 1"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Address line 2:
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Address line 2"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      City:
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      State:
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Country:
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Zip Code:
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="Zip Code"
                      className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Fields 1 - 10 */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-3">
                  <Globe size={15} className="text-violet-400" />
                  <span>Custom Fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const fieldKey = `customField${num}` as keyof CustomerFormData;
                    return (
                      <div key={num}>
                        <label className="block text-slate-400 font-semibold mb-1">
                          Custom Field {num}:
                        </label>
                        <input
                          type="text"
                          name={fieldKey}
                          value={(formData[fieldKey] as string) || ''}
                          onChange={handleChange}
                          placeholder={`Custom Field ${num}`}
                          className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 text-xs"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Shipping Address:
                </label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Search or enter shipping address..."
                  className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-violet-500/25 active:scale-95 cursor-pointer"
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
