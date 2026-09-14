"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';

export default function EditUserPage() {
  const params = useParams();
  const userId = params?.id || '1';
  
  // Checkbox and toggle states matching the screenshots
  const [isActive, setIsActive] = useState<boolean>(true);
  const [enableServiceStaffPin, setEnableServiceStaffPin] = useState<boolean>(false);
  const [allowLogin, setAllowLogin] = useState<boolean>(true);
  const [allLocations, setAllLocations] = useState<boolean>(true);
  const [branchLocation, setBranchLocation] = useState<boolean>(false);
  const [allowSelectedContacts, setAllowSelectedContacts] = useState<boolean>(false);

  // Form states initialized with screenshot values (Admin, admin@gmail.com, 0.00, etc.)
  const [formData, setFormData] = useState({
    prefix: '',
    firstName: 'Admin',
    lastName: '',
    email: 'admin@gmail.com',
    password: '',
    confirmPassword: '',
    role: 'Admin',
    salesCommission: '0.00',
    maxSalesDiscount: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    bloodGroup: '',
    mobileNumber: '',
    alternateContactNumber: '',
    familyContactNumber: '',
    facebookLink: '',
    twitterLink: '',
    socialMedia1: '',
    socialMedia2: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    guardianName: '',
    idProofName: '',
    idProofNumber: '',
    permanentAddress: '',
    currentAddress: '',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    bankIdentifierCode: '',
    branch: '',
    taxPayerId: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update submission logic
    alert(`User ${formData.firstName} updated successfully!`);
  };

  return (
    <div className="w-full font-sans select-none flex flex-col justify-between min-h-[calc(100vh-8rem)] text-slate-200">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/users"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Back to users"
            >
              <FiArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
                Edit user
              </h1>
              <p className="text-xs text-indigo-300/70">Update user profile, permissions and details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: Basic Information (From Picture 1) */}
          <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Prefix:
                </label>
                <input
                  type="text"
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleChange}
                  placeholder="Mr / Mrs / Miss"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  First Name:*
                </label>
                <input
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Email:*
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 md:pt-5">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20 cursor-pointer accent-indigo-500"
                />
                <label htmlFor="is_active" className="text-xs font-medium text-slate-200 cursor-pointer">
                  Is active ?
                </label>
                <FiHelpCircle className="w-3.5 h-3.5 text-cyan-400 cursor-pointer" title="User active status" />
              </div>

              <div className="flex items-center gap-2 md:pt-5">
                <input
                  type="checkbox"
                  id="service_staff_pin"
                  checked={enableServiceStaffPin}
                  onChange={(e) => setEnableServiceStaffPin(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20 cursor-pointer accent-indigo-500"
                />
                <label htmlFor="service_staff_pin" className="text-xs font-medium text-slate-200 cursor-pointer">
                  Enable service staff pin
                </label>
                <FiHelpCircle className="w-3.5 h-3.5 text-cyan-400 cursor-pointer" title="Service staff pin access" />
              </div>
            </div>
          </div>

          {/* Card 2: Roles and Permissions (From Picture 1) */}
          <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6 space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight pb-2 border-b border-white/10">
              Roles and Permissions
            </h2>

            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="allow_login"
                checked={allowLogin}
                onChange={(e) => setAllowLogin(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20 cursor-pointer accent-indigo-500"
              />
              <label htmlFor="allow_login" className="text-xs font-semibold text-white cursor-pointer">
                Allow login
              </label>
            </div>

            {allowLogin && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Password:
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Leave password field blank if you don&apos;t want to update password
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Confirm Password:
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-xs font-semibold text-slate-200">Role:*</label>
                      <FiHelpCircle className="w-3 h-3 text-cyan-400 cursor-pointer" />
                    </div>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full appearance-none bg-[#0c0827]/80 px-3.5 py-2 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 cursor-pointer pr-8"
                      >
                        <option value="Admin" className="bg-[#0c0827] text-white">Admin</option>
                        <option value="Cashier" className="bg-[#0c0827] text-white">Cashier</option>
                      </select>
                      <FiChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs font-semibold text-slate-200">Access locations</span>
                    <FiHelpCircle className="w-3 h-3 text-cyan-400 cursor-pointer" />
                  </div>
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="all_locations"
                        checked={allLocations}
                        onChange={(e) => setAllLocations(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20 cursor-pointer accent-indigo-500"
                      />
                      <label htmlFor="all_locations" className="text-xs font-medium text-slate-200 cursor-pointer">
                        All Locations
                      </label>
                      <FiHelpCircle className="w-3 h-3 text-cyan-400 cursor-pointer" />
                    </div>

                    <div className="flex items-center gap-2 pl-5">
                      <input
                        type="checkbox"
                        id="branch_location"
                        checked={branchLocation}
                        onChange={(e) => setBranchLocation(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20 cursor-pointer accent-indigo-500"
                      />
                      <label htmlFor="branch_location" className="text-xs font-medium text-slate-300 cursor-pointer">
                        RANGPUR BIKE PARLOUR (BL0001)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Sales (From Picture 2) */}
          <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6 space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight pb-2 border-b border-white/10">
              Sales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    Sales Commission Percentage (%):
                  </label>
                  <FiHelpCircle className="w-3 h-3 text-cyan-400 cursor-pointer" />
                </div>
                <input
                  type="text"
                  name="salesCommission"
                  value={formData.salesCommission}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-xs font-semibold text-slate-200">
                    Max sales discount percent:
                  </label>
                  <FiHelpCircle className="w-3 h-3 text-cyan-400 cursor-pointer" />
                </div>
                <input
                  type="text"
                  name="maxSalesDiscount"
                  value={formData.maxSalesDiscount}
                  onChange={handleChange}
                  placeholder="Max sales discount percent"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="allow_selected_contacts"
                checked={allowSelectedContacts}
                onChange={(e) => setAllowSelectedContacts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20 cursor-pointer accent-indigo-500"
              />
              <label htmlFor="allow_selected_contacts" className="text-xs font-medium text-slate-200 cursor-pointer">
                Allow Selected Contacts
              </label>
              <FiHelpCircle className="w-3 h-3 text-cyan-400 cursor-pointer" />
            </div>
          </div>

          {/* Card 4: More Informations (From Picture 2) */}
          <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6 space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight pb-2 border-b border-white/10">
              More Informations
            </h2>

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Date of birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Gender:</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full appearance-none bg-[#0c0827]/80 px-3.5 py-2 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 cursor-pointer pr-8"
                  >
                    <option value="" className="bg-[#0c0827] text-white">Please Select</option>
                    <option value="Male" className="bg-[#0c0827] text-white">Male</option>
                    <option value="Female" className="bg-[#0c0827] text-white">Female</option>
                    <option value="Other" className="bg-[#0c0827] text-white">Other</option>
                  </select>
                  <FiChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Marital Status:</label>
                <div className="relative">
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full appearance-none bg-[#0c0827]/80 px-3.5 py-2 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 cursor-pointer pr-8"
                  >
                    <option value="" className="bg-[#0c0827] text-white">Marital Status</option>
                    <option value="Single" className="bg-[#0c0827] text-white">Single</option>
                    <option value="Married" className="bg-[#0c0827] text-white">Married</option>
                  </select>
                  <FiChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Blood Group:</label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  placeholder="Blood Group"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Mobile Number:</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Alternate contact number:</label>
                <input
                  type="text"
                  name="alternateContactNumber"
                  value={formData.alternateContactNumber}
                  onChange={handleChange}
                  placeholder="Alternate contact number"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Family contact number:</label>
                <input
                  type="text"
                  name="familyContactNumber"
                  value={formData.familyContactNumber}
                  onChange={handleChange}
                  placeholder="Family contact number"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Facebook Link:</label>
                <input
                  type="text"
                  name="facebookLink"
                  value={formData.facebookLink}
                  onChange={handleChange}
                  placeholder="Facebook Link"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Twitter Link:</label>
                <input
                  type="text"
                  name="twitterLink"
                  value={formData.twitterLink}
                  onChange={handleChange}
                  placeholder="Twitter Link"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Social Media 1:</label>
                <input
                  type="text"
                  name="socialMedia1"
                  value={formData.socialMedia1}
                  onChange={handleChange}
                  placeholder="Social Media 1"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Social Media 2:</label>
                <input
                  type="text"
                  name="socialMedia2"
                  value={formData.socialMedia2}
                  onChange={handleChange}
                  placeholder="Social Media 2"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Custom field 1:</label>
                <input
                  type="text"
                  name="customField1"
                  value={formData.customField1}
                  onChange={handleChange}
                  placeholder="Custom field 1"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Custom field 2:</label>
                <input
                  type="text"
                  name="customField2"
                  value={formData.customField2}
                  onChange={handleChange}
                  placeholder="Custom field 2"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Custom field 3:</label>
                <input
                  type="text"
                  name="customField3"
                  value={formData.customField3}
                  onChange={handleChange}
                  placeholder="Custom field 3"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Custom field 4:</label>
                <input
                  type="text"
                  name="customField4"
                  value={formData.customField4}
                  onChange={handleChange}
                  placeholder="Custom field 4"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Guardian Name:</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Guardian Name"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Row 5: ID Proof */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">ID proof name:</label>
                <input
                  type="text"
                  name="idProofName"
                  value={formData.idProofName}
                  onChange={handleChange}
                  placeholder="ID proof name"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">ID proof number:</label>
                <input
                  type="text"
                  name="idProofNumber"
                  value={formData.idProofNumber}
                  onChange={handleChange}
                  placeholder="ID proof number"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Textarea: Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Permanent Address:</label>
                <textarea
                  rows={3}
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="Permanent Address"
                  className="w-full p-3 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Current Address:</label>
                <textarea
                  rows={3}
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  placeholder="Current Address"
                  className="w-full p-3 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors resize-y"
                />
              </div>
            </div>
          </div>

          {/* Card 5: Bank Details (From Picture 2) */}
          <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6 space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight pb-2 border-b border-white/10">
              Bank Details:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Account Holder&apos;s Name:</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  placeholder="Account Holder's Name"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Account Number:</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Account Number"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Bank Name:</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-xs font-semibold text-slate-200">Bank Identifier Code:</label>
                  <FiHelpCircle className="w-3 h-3 text-cyan-400 cursor-pointer" />
                </div>
                <input
                  type="text"
                  name="bankIdentifierCode"
                  value={formData.bankIdentifierCode}
                  onChange={handleChange}
                  placeholder="Bank Identifier Code"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Branch:</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Branch"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-xs font-semibold text-slate-200">Tax Payer ID:</label>
                  <FiHelpCircle className="w-3 h-3 text-cyan-400 cursor-pointer" />
                </div>
                <input
                  type="text"
                  name="taxPayerId"
                  value={formData.taxPayerId}
                  onChange={handleChange}
                  placeholder="Tax Payer ID"
                  className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Update Action Button (Centered from Picture 2) */}
          <div className="flex items-center justify-center gap-3 pt-4 pb-6">
            <Link
              href="/dashboard/users"
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs sm:text-sm border border-white/10 transition-all cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-10 py-2.5 rounded-xl bg-[#5046e6] hover:bg-[#4338ca] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* Page Footer and Scroll to Top (From Picture 2) */}
      <footer className="mt-8 text-xs text-slate-500 flex items-center justify-between max-w-7xl mx-auto w-full">
        <span>DATABYTE - V6.5 | Copyright © 2026 All rights reserved.</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
          title="Scroll to top"
        >
          <FiChevronUp className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
