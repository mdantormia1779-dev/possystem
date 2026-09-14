"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiPlus, 
  FiFileText, 
  FiPrinter, 
  FiColumns, 
  FiChevronDown, 
  FiEdit, 
  FiEye, 
  FiTrash2 
} from 'react-icons/fi';
import { 
  BsFileEarmarkSpreadsheet, 
  BsFileEarmarkPdf, 
  BsArrowDownUp 
} from 'react-icons/bs';
import DeleteUserModal from './DeleteUserModal';

interface UserItem {
  id: string;
  username: string;
  name: string;
  role: string;
  email: string;
}

const initialUsers: UserItem[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Admin',
    role: 'Admin',
    email: 'admin@gmail.com',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full font-sans select-none flex flex-col justify-between min-h-[calc(100vh-8rem)] text-slate-200">
      <div className="space-y-4">
        {/* Page Header Title */}
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            Users
          </h1>
          <span className="text-xs sm:text-sm text-indigo-300/70 font-normal">
            Manage users
          </span>
        </div>

        {/* Main Card Container */}
        <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6">
          {/* Card Header and + Add Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              All users
            </h2>
            <Link
              href="/dashboard/users/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <FiPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
            </Link>
          </div>

          {/* Control Bar (Show Entries, Export Buttons & Search) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            {/* Left: Entries & Export Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Show Entries */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300">
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

            {/* Right: Search Input */}
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

          {/* Data Table */}
          <div className="w-full overflow-x-auto border border-white/10 rounded-xl bg-[#0c0827]/60">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                    <div className="flex items-center justify-between">
                      <span>Username</span>
                      <BsArrowDownUp className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                    <div className="flex items-center justify-between">
                      <span>Name</span>
                      <BsArrowDownUp className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                    <div className="flex items-center justify-between">
                      <span>Role</span>
                      <BsArrowDownUp className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10">
                    <div className="flex items-center justify-between">
                      <span>Email</span>
                      <BsArrowDownUp className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm text-slate-300">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 border-r border-white/10 font-medium text-white">
                        {item.username}
                      </td>
                      <td className="px-4 py-3 border-r border-white/10">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 border-r border-white/10">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-white/10 text-slate-300">
                        {item.email}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Edit Button */}
                          <Link
                            href={`/dashboard/users/${item.id}/edit`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <FiEdit className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>

                          {/* View Button */}
                          <Link
                            href={`/dashboard/users/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <FiEye className="w-3 h-3" />
                            <span>View</span>
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setUserToDelete(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400 text-xs">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination and Entry Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 text-xs text-slate-400">
            <div>
              Showing 1 to {filteredUsers.length} of {users.length} entries
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
                className="px-3 py-1.5 bg-indigo-600 text-white font-medium cursor-pointer"
              >
                1
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
      </div>

      {/* Page Footer */}
      <footer className="mt-8 text-xs text-slate-500 text-left">
        DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
      </footer>

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={Boolean(userToDelete)}
        userName={userToDelete?.name}
        userEmail={userToDelete?.email}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}