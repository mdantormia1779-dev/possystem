"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  IoClose 
} from 'react-icons/io5';
import { 
  FiBold, 
  FiItalic, 
  FiList, 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight, 
  FiLink, 
  FiImage, 
  FiPrinter, 
  FiHelpCircle,
  FiUploadCloud
} from 'react-icons/fi';

export interface NoteItem {
  id: string;
  heading: string;
  description: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
  fileName?: string;
  isPrivate?: boolean;
}

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt' | 'addedBy'>) => void;
}

export default function AddNoteModal({
  isOpen,
  onClose,
  onSave,
}: AddNoteModalProps) {
  const [mounted, setMounted] = useState(false);
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading.trim()) return;

    onSave({
      heading,
      description,
      fileName,
      isPrivate,
    });

    // Reset & close
    setHeading('');
    setDescription('');
    setFileName('');
    setIsPrivate(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#120e34] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col max-h-[92vh] text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Add Note
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Heading Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Heading:*
            </label>
            <input
              type="text"
              required
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter note heading"
              className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Description Editor Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Description:
            </label>
            <div className="border border-white/15 rounded-xl bg-[#0c0827]/80 overflow-hidden">
              {/* Toolbar */}
              <div className="px-3 py-2 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-2 flex-wrap text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium mr-2">Paragraph</span>
                  <div className="h-4 w-[1px] bg-white/10 mx-1" />
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Bold">
                    <FiBold className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Italic">
                    <FiItalic className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-4 w-[1px] bg-white/10 mx-1" />
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Align Left">
                    <FiAlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Align Center">
                    <FiAlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Align Right">
                    <FiAlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Bullet List">
                    <FiList className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-4 w-[1px] bg-white/10 mx-1" />
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Insert Link">
                    <FiLink className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Insert Image">
                    <FiImage className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-white/10 transition-colors" title="Print">
                    <FiPrinter className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your note description here..."
                className="w-full p-3 bg-transparent text-xs sm:text-sm text-white focus:outline-none placeholder-slate-500 resize-y"
              />

              {/* Editor status footer */}
              <div className="px-3 py-1 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                <span>P</span>
                <span>{description.trim() ? description.trim().split(/\s+/).length : 0} WORDS POWERED BY TINY</span>
              </div>
            </div>
          </div>

          {/* Documents Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Documents:
            </label>
            <div className="relative border-2 border-dashed border-white/20 hover:border-indigo-400/50 rounded-xl p-6 text-center bg-[#0c0827]/50 transition-colors cursor-pointer group">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <FiUploadCloud className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                <p className="text-xs text-slate-300 font-medium">
                  {fileName ? (
                    <span className="text-cyan-400 font-semibold">{fileName}</span>
                  ) : (
                    'Drop files here to upload'
                  )}
                </p>
                <p className="text-[11px] text-slate-500">or click to browse from device</p>
              </div>
            </div>
          </div>

          {/* Is Private Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20 cursor-pointer accent-indigo-500"
            />
            <label htmlFor="is_private" className="text-xs font-medium text-slate-200 cursor-pointer flex items-center gap-1">
              <span>Is Private?</span>
              <FiHelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/25 active:scale-95 cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all border border-white/10 cursor-pointer"
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
