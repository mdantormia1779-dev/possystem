"use client";

import React, { useState } from 'react';
import { 
  FiPlus, 
  FiChevronDown 
} from 'react-icons/fi';
import { BsArrowDownUp } from 'react-icons/bs';
import AddSalesCommissionAgentModal, { AgentFormData } from './AddSalesCommissionAgentModal';
import ExportToolbar, { ColumnOption } from '@/app/Components/Dashboard/ExportToolbar';
import { exportToCSV, exportToExcel, printTable, exportToPDF } from '@/app/utils/tableExport';

interface AgentItem {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  commissionPercentage: string;
}

export default function SalesCommissionAgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [entriesCount, setEntriesCount] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Column Visibility State
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: 'name', label: 'Name', visible: true },
    { id: 'email', label: 'Email', visible: true },
    { id: 'contactNumber', label: 'Contact Number', visible: true },
    { id: 'address', label: 'Address', visible: true },
    { id: 'commissionPercentage', label: 'Sales Commission Percentage (%)', visible: true },
    { id: 'action', label: 'Action', visible: true },
  ]);

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const isColVisible = (id: string) => Boolean(columns.find((c) => c.id === id)?.visible);

  const handleSaveAgent = (data: AgentFormData) => {
    const newAgent: AgentItem = {
      id: String(Date.now()),
      name: `${data.prefix ? data.prefix + ' ' : ''}${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      contactNumber: data.contactNumber,
      address: data.address,
      commissionPercentage: data.commissionPercentage,
    };
    setAgents((prev) => [...prev, newAgent]);
  };

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.contactNumber.includes(searchQuery)
  );

  // Export Columns (excluding Action, filtered by visibility)
  const exportColumns = [
    { id: 'name', label: 'Name', accessor: (item: AgentItem) => item.name },
    { id: 'email', label: 'Email', accessor: (item: AgentItem) => item.email },
    { id: 'contactNumber', label: 'Contact Number', accessor: (item: AgentItem) => item.contactNumber },
    { id: 'address', label: 'Address', accessor: (item: AgentItem) => item.address },
    { id: 'commissionPercentage', label: 'Commission (%)', accessor: (item: AgentItem) => `${item.commissionPercentage}%` },
  ].filter((c) => isColVisible(c.id));

  const handleExportCSV = () => {
    exportToCSV('Sales_Commission_Agents', exportColumns, filteredAgents);
  };

  const handleExportExcel = () => {
    exportToExcel('Sales_Commission_Agents', exportColumns, filteredAgents);
  };

  const handlePrint = () => {
    printTable('Sales Commission Agents', exportColumns, filteredAgents);
  };

  const handleExportPDF = () => {
    exportToPDF('Sales Commission Agents', exportColumns, filteredAgents);
  };

  const visibleColCount = columns.filter((c) => c.visible).length;

  return (
    <div className="w-full font-sans select-none flex flex-col justify-between min-h-[calc(100vh-8rem)] text-slate-200">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        {/* Page Header */}
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            Sales Commission Agents
          </h1>
          <span className="text-xs sm:text-sm text-indigo-300/70 font-normal">
            Manage agents
          </span>
        </div>

        {/* Main Card */}
        <div className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6">
          {/* Card Top Right + Add Button */}
          <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-5">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              All Sales Commission Agents
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <FiPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
            </button>
          </div>

          {/* Control Bar (Show Entries, Export Buttons & Search) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Show Entries Selector */}
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

              {/* Working Export Toolbar */}
              <ExportToolbar
                columns={columns}
                onToggleColumn={toggleColumn}
                onExportCSV={handleExportCSV}
                onExportExcel={handleExportExcel}
                onPrint={handlePrint}
                onExportPDF={handleExportPDF}
              />
            </div>

            {/* Search Box */}
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
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  {isColVisible('name') && (
                    <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10 whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span>Name</span>
                        <BsArrowDownUp className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    </th>
                  )}
                  {isColVisible('email') && (
                    <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10 whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span>Email</span>
                        <BsArrowDownUp className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    </th>
                  )}
                  {isColVisible('contactNumber') && (
                    <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10 whitespace-nowrap">
                      <span>Contact Number</span>
                    </th>
                  )}
                  {isColVisible('address') && (
                    <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10 whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span>Address</span>
                        <BsArrowDownUp className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    </th>
                  )}
                  {isColVisible('commissionPercentage') && (
                    <th className="px-4 py-3 text-xs font-semibold text-slate-300 border-r border-white/10 whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span>Sales Commission Percentage (%)</span>
                        <BsArrowDownUp className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    </th>
                  )}
                  {isColVisible('action') && (
                    <th className="px-4 py-3 text-xs font-semibold text-slate-300 whitespace-nowrap">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-white/[0.03] text-xs text-slate-300 transition-colors">
                      {isColVisible('name') && (
                        <td className="px-4 py-3 border-r border-white/10 font-medium text-white">{agent.name}</td>
                      )}
                      {isColVisible('email') && (
                        <td className="px-4 py-3 border-r border-white/10">{agent.email}</td>
                      )}
                      {isColVisible('contactNumber') && (
                        <td className="px-4 py-3 border-r border-white/10">{agent.contactNumber}</td>
                      )}
                      {isColVisible('address') && (
                        <td className="px-4 py-3 border-r border-white/10">{agent.address}</td>
                      )}
                      {isColVisible('commissionPercentage') && (
                        <td className="px-4 py-3 border-r border-white/10">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            {agent.commissionPercentage}%
                          </span>
                        </td>
                      )}
                      {isColVisible('action') && (
                        <td className="px-4 py-3 text-slate-400">--</td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={visibleColCount || 6}
                      className="text-center py-8 text-xs sm:text-sm text-slate-400 font-medium"
                    >
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination and Entry Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 text-xs text-slate-400">
            <div>
              Showing {filteredAgents.length > 0 ? 1 : 0} to {filteredAgents.length} of {agents.length} entries
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
      </div>

      {/* Page Footer */}
      <footer className="mt-8 text-xs text-slate-500 text-left max-w-7xl mx-auto w-full">
        DATABYTE - V6.5 | Copyright © 2026 All rights reserved.
      </footer>

      {/* Add Agent Modal */}
      <AddSalesCommissionAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAgent}
      />
    </div>
  );
}