"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiPlus, 
  FiFileText, 
  FiPrinter, 
  FiColumns, 
  FiChevronDown, 
  FiTrash2 
} from 'react-icons/fi';
import { 
  BsFileEarmarkSpreadsheet, 
  BsFileEarmarkPdf, 
  BsArrowDownUp 
} from 'react-icons/bs';
import { 
  FaUser, 
  FaPaperclip, 
  FaListAlt 
} from 'react-icons/fa';
import AddNoteModal, { NoteItem } from './AddNoteModal';

interface ActivityItem {
  id: string;
  date: string;
  action: 'Login' | 'Logout';
  by: string;
  note?: string;
}

const initialActivities: ActivityItem[] = [
  { id: '1', date: '14/09/2026 10:48 AM', action: 'Login', by: 'Admin' },
  { id: '2', date: '13/09/2026 02:14 PM', action: 'Login', by: 'Admin' },
  { id: '3', date: '13/09/2026 01:57 PM', action: 'Login', by: 'Admin' },
  { id: '4', date: '13/09/2026 04:54 AM', action: 'Login', by: 'Admin' },
  { id: '5', date: '13/09/2026 04:53 AM', action: 'Logout', by: 'Admin' },
  { id: '6', date: '13/09/2026 04:52 AM', action: 'Login', by: 'Admin' },
  { id: '7', date: '12/09/2026 10:04 PM', action: 'Login', by: 'Admin' },
  { id: '8', date: '12/09/2026 09:21 PM', action: 'Logout', by: 'Admin' },
  { id: '9', date: '12/09/2026 09:18 PM', action: 'Login', by: 'Admin' },
  { id: '10', date: '12/09/2026 08:45 PM', action: 'Logout', by: 'Admin' },
  { id: '11', date: '12/09/2026 05:58 PM', action: 'Login', by: 'Admin' },
  { id: '12', date: '12/09/2026 02:38 PM', action: 'Login', by: 'Admin' },
  { id: '13', date: '12/09/2026 02:19 PM', action: 'Login', by: 'Admin' },
  { id: '14', date: '12/09/2026 09:34 AM', action: 'Login', by: 'Admin' },
  { id: '15', date: '16/08/2026 03:22 PM', action: 'Login', by: 'Admin' },
  { id: '16', date: '14/08/2026 08:48 PM', action: 'Login', by: 'Admin' },
];

export default function ViewUserPage() {
  const params = useParams();
  const userId = params?.id || '1';

  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'activities'>('info');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSaveNote = (newNoteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt' | 'addedBy'>) => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newNote: NoteItem = {
      id: String(Date.now()),
      heading: newNoteData.heading,
      description: newNoteData.description,
      fileName: newNoteData.fileName,
      isPrivate: newNoteData.isPrivate,
      addedBy: 'Admin',
      createdAt: dateStr,
      updatedAt: dateStr,
    };

    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter((n) =>
    n.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.addedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full font-sans select-none flex flex-col justify-between min-h-[calc(100vh-8rem)] text-slate-200">
      <div className="max-w-7xl mx-auto w-full space-y-5">
        {/* Page Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                View User
              </h1>
              <p className="text-xs text-indigo-300/70">Inspect user profile, documents and recent activities</p>
            </div>
          </div>

          {/* User Select Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              className="w-full appearance-none bg-[#0c0827]/80 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-400 cursor-pointer pr-8"
              defaultValue="Admin"
            >
              <option value="Admin" className="bg-[#0c0827] text-white">Admin</option>
            </select>
            <FiChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: User Profile Card (Picture 1) */}
          <div className="lg:col-span-3">
            <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-5 flex flex-col items-center">
              {/* Avatar Initial Circle */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/30 to-cyan-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 shadow-[0_0_24px_rgba(99,102,241,0.25)] mb-3">
                AD
              </div>

              <h2 className="text-base font-bold text-white tracking-wide">Admin</h2>
              <p className="text-xs text-indigo-300/70 mb-4">Admin</p>

              {/* Profile Table List */}
              <div className="w-full divide-y divide-white/10 text-xs border-y border-white/10 mb-5">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Username</span>
                  <span className="text-cyan-400 font-medium">admin</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Email</span>
                  <span className="text-indigo-300 font-medium truncate max-w-[140px]" title="admin@gmail.com">
                    admin@gmail.com
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Is active ?</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <Link
                href={`/dashboard/users/${userId}/edit`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <FiEdit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Tabs and Tab Panels */}
          <div className="lg:col-span-9 space-y-4">
            {/* Tabs Header Navigation */}
            <div className="flex items-center border-b border-white/10 bg-[#120e34]/60 backdrop-blur-xl rounded-t-2xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'info'
                    ? 'bg-gradient-to-r from-indigo-600/40 to-indigo-500/20 text-white border border-indigo-500/40 shadow-[0_0_16px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <FaUser className={activeTab === 'info' ? 'text-cyan-400' : 'text-slate-400'} />
                <span>User Information</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'documents'
                    ? 'bg-gradient-to-r from-indigo-600/40 to-indigo-500/20 text-white border border-indigo-500/40 shadow-[0_0_16px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <FaPaperclip className={activeTab === 'documents' ? 'text-cyan-400' : 'text-slate-400'} />
                <span>Documents &amp; Note</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'activities'
                    ? 'bg-gradient-to-r from-indigo-600/40 to-indigo-500/20 text-white border border-indigo-500/40 shadow-[0_0_16px_rgba(99,102,241,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <FaListAlt className={activeTab === 'activities' ? 'text-cyan-400' : 'text-slate-400'} />
                <span>Activities</span>
              </button>
            </div>

            {/* TAB 1: User Information Panel (Picture 1) */}
            {activeTab === 'info' && (
              <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-b-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
                {/* Top Commission & Contact Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10 text-xs">
                  <p>
                    <span className="font-semibold text-slate-300">Sales Commission Percentage (%): </span>
                    <span className="text-cyan-400 font-bold">0.00%</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-300">Allowed Contacts: </span>
                    <span className="text-indigo-300 font-semibold">All</span>
                  </p>
                </div>

                {/* More Informations Grid */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight mb-3">
                    More Informations
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2.5 gap-x-6 text-xs">
                    {/* Column 1 */}
                    <div className="space-y-2">
                      <p><span className="font-semibold text-slate-300">Date of birth:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Gender:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Marital Status:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Blood Group:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Mobile Number:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Alternate contact number:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Family contact number:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">ID proof name:</span> <span className="text-slate-400">--</span></p>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-2">
                      <p><span className="font-semibold text-slate-300">Facebook Link:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Twitter Link:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Social Media 1:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Social Media 2:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">ID proof number:</span> <span className="text-slate-400">--</span></p>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-2">
                      <p><span className="font-semibold text-slate-300">Custom field 1:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Custom field 2:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Custom field 3:</span> <span className="text-slate-400">--</span></p>
                      <p><span className="font-semibold text-slate-300">Custom field 4:</span> <span className="text-slate-400">--</span></p>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300">Permanent Address: </span>
                    <span className="text-slate-400">--</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Current Address: </span>
                    <span className="text-slate-400">--</span>
                  </div>
                </div>

                {/* Bank Details Section */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Bank Details:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs">
                    <p><span className="font-semibold text-slate-300">Account Holder&apos;s Name:</span> <span className="text-slate-400">--</span></p>
                    <p><span className="font-semibold text-slate-300">Account Number:</span> <span className="text-slate-400">--</span></p>
                    <p><span className="font-semibold text-slate-300">Bank Name:</span> <span className="text-slate-400">--</span></p>
                    <p><span className="font-semibold text-slate-300">Bank Identifier Code:</span> <span className="text-slate-400">--</span></p>
                    <p><span className="font-semibold text-slate-300">Branch:</span> <span className="text-slate-400">--</span></p>
                    <p><span className="font-semibold text-slate-300">Tax Payer ID:</span> <span className="text-slate-400">--</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Documents & Note Panel (Picture 2 & Picture 4) */}
            {activeTab === 'documents' && (
              <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-b-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
                {/* Add + Button on top right */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Add</span>
                    <FiPlus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Control Bar: Entries, Export Buttons & Search */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Show Entries Selector */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span>Show</span>
                      <div className="relative">
                        <select
                          value={entriesCount}
                          onChange={(e) => setEntriesCount(Number(e.target.value))}
                          className="appearance-none bg-[#0c0827]/80 border border-white/15 rounded-xl px-3 py-1.5 pr-7 text-xs text-slate-200 focus:outline-none focus:border-indigo-400 cursor-pointer"
                        >
                          <option value={10} className="bg-[#0c0827] text-white">10</option>
                          <option value={25} className="bg-[#0c0827] text-white">25</option>
                          <option value={50} className="bg-[#0c0827] text-white">50</option>
                          <option value={100} className="bg-[#0c0827] text-white">100</option>
                        </select>
                        <FiChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <span>entries</span>
                    </div>

                    {/* Export Toolbar */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium text-slate-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <FiFileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium text-slate-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <BsFileEarmarkSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Export Excel</span>
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium text-slate-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <FiPrinter className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Print</span>
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium text-slate-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <FiColumns className="w-3.5 h-3.5 text-slate-300" />
                        <span>Column visibility</span>
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] sm:text-xs font-medium text-slate-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <BsFileEarmarkPdf className="w-3.5 h-3.5 text-rose-400" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-56 px-3.5 py-1.5 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto border border-white/10 rounded-xl bg-[#0c0827]/60">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                          Action
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                          <div className="flex items-center justify-between">
                            <span>Heading</span>
                            <BsArrowDownUp className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                          <div className="flex items-center justify-between">
                            <span>Added By</span>
                            <BsArrowDownUp className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                          Created At
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300">
                          <div className="flex items-center justify-between">
                            <span>Updated At</span>
                            <BsArrowDownUp className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                          <tr key={note.id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="px-4 py-3 border-r border-white/10">
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                              >
                                <FiTrash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </td>
                            <td className="px-4 py-3 border-r border-white/10 font-medium text-white">
                              <div>
                                <p>{note.heading}</p>
                                {note.description && (
                                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                    {note.description}
                                  </p>
                                )}
                                {note.fileName && (
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
                                    📎 {note.fileName}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-white/10">
                              {note.addedBy}
                            </td>
                            <td className="px-4 py-3 border-r border-white/10 text-slate-400">
                              {note.createdAt}
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              {note.updatedAt}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-xs text-slate-400">
                            No data available in table
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 text-xs text-slate-400">
                  <div>
                    Showing {filteredNotes.length > 0 ? 1 : 0} to {filteredNotes.length} of {notes.length} entries
                  </div>
                  <div className="inline-flex items-center -space-x-px rounded-xl border border-white/10 overflow-hidden bg-white/5">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-slate-400 hover:bg-white/10 border-r border-white/10 cursor-pointer disabled:opacity-40"
                      disabled
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-slate-400 hover:bg-white/10 border-l border-white/10 cursor-pointer disabled:opacity-40"
                      disabled
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Activities Panel (Picture 3) */}
            {activeTab === 'activities' && (
              <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-b-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
                <div className="w-full overflow-x-auto border border-white/10 rounded-xl bg-[#0c0827]/60">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                          Date
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                          Action
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                          By
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-300">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {initialActivities.map((act) => (
                        <tr key={act.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-4 py-2.5 border-r border-white/10 font-mono text-slate-300">
                            {act.date}
                          </td>
                          <td className="px-4 py-2.5 border-r border-white/10 font-medium">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                                act.action === 'Login'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {act.action}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 border-r border-white/10 text-white font-medium">
                            {act.by}
                          </td>
                          <td className="px-4 py-2.5 text-slate-500 italic">
                            {act.note || '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="mt-8 text-xs text-slate-500 text-left max-w-7xl mx-auto w-full">
        DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
      </footer>

      {/* Add Note Modal (Picture 4) */}
      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}
