"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, CheckSquare, Square, Info } from 'lucide-react';

export interface RoleItem {
  id: string;
  name: string;
  canEdit: boolean;
  canDelete: boolean;
  permissions?: string[];
}

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRole: RoleItem) => void;
  role: RoleItem | null;
}

const defaultPermissionCategories = [
  {
    category: 'User Management',
    permissions: [
      { id: 'view_user', label: 'View Users' },
      { id: 'add_user', label: 'Add User' },
      { id: 'edit_user', label: 'Edit User' },
      { id: 'delete_user', label: 'Delete User' },
    ],
  },
  {
    category: 'Contacts (Suppliers & Customers)',
    permissions: [
      { id: 'view_supplier', label: 'View Suppliers' },
      { id: 'add_supplier', label: 'Add Supplier' },
      { id: 'view_customer', label: 'View Customers' },
      { id: 'add_customer', label: 'Add Customer' },
    ],
  },
  {
    category: 'Products',
    permissions: [
      { id: 'view_product', label: 'View Products' },
      { id: 'add_product', label: 'Add Product' },
      { id: 'edit_product', label: 'Edit Product' },
      { id: 'delete_product', label: 'Delete Product' },
      { id: 'view_purchase_price', label: 'View Purchase Price' },
    ],
  },
  {
    category: 'Sell & POS Terminal',
    permissions: [
      { id: 'view_sales', label: 'View All Sales' },
      { id: 'create_sale', label: 'Create Sale / POS' },
      { id: 'edit_sale', label: 'Edit Sale' },
      { id: 'delete_sale', label: 'Delete Sale' },
    ],
  },
  {
    category: 'Purchases & Expenses',
    permissions: [
      { id: 'view_purchase', label: 'View Purchases' },
      { id: 'add_purchase', label: 'Add Purchase' },
      { id: 'view_expense', label: 'View Expenses' },
      { id: 'add_expense', label: 'Add Expense' },
    ],
  },
];

export default function EditRoleModal({
  isOpen,
  onClose,
  onSave,
  role,
}: EditRoleModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'view_sales',
    'create_sale',
    'view_product',
    'view_customer',
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (role) {
      setName(role.name || '');
      if (role.permissions && role.permissions.length > 0) {
        setSelectedPermissions(role.permissions);
      } else if (role.name === 'Admin') {
        setSelectedPermissions(
          defaultPermissionCategories.flatMap((c) => c.permissions.map((p) => p.id))
        );
      } else {
        setSelectedPermissions(['view_sales', 'create_sale', 'view_product', 'view_customer']);
      }
    }
  }, [role, isOpen]);

  if (!isOpen || !mounted || !role) return null;

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAllCategory = (catPerms: string[]) => {
    const allSelected = catPerms.every((id) => selectedPermissions.includes(id));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !catPerms.includes(id)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...catPerms])));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...role,
      name: name.trim(),
      permissions: selectedPermissions,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e0a2b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto font-sans max-h-[92vh] flex flex-col text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#120e34]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Edit Role
              </h2>
              <p className="text-[11px] text-slate-400">Configure role name and system permissions</p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs select-none [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
          
          {/* Role Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Role Name:<span className="text-rose-400 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cashier, Sales Manager"
              required
              className="w-full bg-[#08051e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Permissions Section */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Permissions Matrix
              </h3>
              <span className="text-[11px] text-cyan-400 font-medium">
                {selectedPermissions.length} permissions assigned
              </span>
            </div>

            <div className="space-y-3">
              {defaultPermissionCategories.map((cat) => {
                const catIds = cat.permissions.map((p) => p.id);
                const isCatAll = catIds.every((id) => selectedPermissions.includes(id));

                return (
                  <div
                    key={cat.category}
                    className="p-3.5 rounded-xl bg-[#120e34]/70 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="font-bold text-white text-xs">{cat.category}</span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllCategory(catIds)}
                        className="text-[11px] text-indigo-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {isCatAll ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {cat.permissions.map((perm) => {
                        const isChecked = selectedPermissions.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            onClick={() => togglePermission(perm.id)}
                            className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="accent-violet-500 rounded cursor-pointer w-4 h-4"
                            />
                            <span className={isChecked ? 'text-white font-medium' : 'text-slate-400'}>
                              {perm.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-violet-500/25 active:scale-95 cursor-pointer"
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
}
