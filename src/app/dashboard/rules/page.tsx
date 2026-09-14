"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiPlus, 
  FiChevronDown, 
  FiEdit, 
  FiTrash2 
} from 'react-icons/fi';
import { BsArrowDownUp } from 'react-icons/bs';

interface RoleItem {
  id: string;
  name: string;
  canEdit: boolean;
  canDelete: boolean;
}

const initialRoles: RoleItem[] = [
  { id: '1', name: 'Admin', canEdit: false, canDelete: false },
  { id: '2', name: 'Cashier', canEdit: true, canDelete: true },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>(initialRoles);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full font-sans select-none flex flex-col justify-between min-h-[calc(100vh-8rem)] text-slate-200">
      <div className="space-y-4 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            Roles
          </h1>
          <span className="text-xs sm:text-sm text-indigo-300/70 font-normal">
            Manage roles
          </span>
        </div>

        {/* Main Card */}
        <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6">
          {/* Card Header & + Add Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              All roles
            </h2>
            <Link
              href="/dashboard/rules/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <FiPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
            </Link>
          </div>

          {/* Table Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
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

            {/* Search Input */}
            <div className="flex items-center">
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
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10 w-1/2">
                    <div className="flex items-center justify-between">
                      <span>Roles</span>
                      <BsArrowDownUp className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-300 w-1/2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm text-slate-300">
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 border-r border-white/10 font-medium text-white">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                          {item.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.canEdit || item.canDelete ? (
                          <div className="flex items-center gap-2">
                            {item.canEdit && (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
                              >
                                <FiEdit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            )}
                            {item.canDelete && (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                              >
                                <FiTrash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs italic">Default system role</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-slate-400 text-xs">
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
              Showing 1 to {filteredRoles.length} of {roles.length} entries
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
      <footer className="mt-8 text-xs text-slate-500 text-left max-w-7xl mx-auto w-full">
        DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
      </footer>
    </div>
  );
}