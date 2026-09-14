"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { RoleItem } from './EditRoleModal';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (roleId: string) => void;
  role: RoleItem | null;
}

export default function DeleteRoleModal({
  isOpen,
  onClose,
  onConfirm,
  role,
}: DeleteRoleModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !role) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e0a2b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-6 text-slate-200 overflow-hidden my-auto font-sans">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/15 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <AlertTriangle size={28} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Delete Role?
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Are you sure you want to delete the role{' '}
              <span className="text-white font-semibold underline decoration-rose-400/50">
                {role.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="w-full p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-left text-xs text-rose-300">
            <p className="font-semibold mb-0.5">Warning:</p>
            <p className="text-[11px] text-rose-300/80">
              Users currently assigned to this role may immediately lose their specific permission privileges.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(role.id);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/25 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Delete Role</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
