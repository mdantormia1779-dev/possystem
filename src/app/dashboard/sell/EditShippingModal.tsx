"use client";

import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Truck, FileText } from 'lucide-react';
import { SaleRecord } from './DeleteSaleModal';

interface EditShippingModalProps {
  isOpen: boolean;
  sale: SaleRecord | null;
  onClose: () => void;
  onSave: (saleId: string, shippingData: any) => void;
}

export default function EditShippingModal({
  isOpen,
  sale,
  onClose,
  onSave,
}: EditShippingModalProps) {
  const [shippingDetails, setShippingDetails] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingStatus, setShippingStatus] = useState('');
  const [deliveredTo, setDeliveredTo] = useState('');
  const [deliveryPerson, setDeliveryPerson] = useState('');
  const [shippingNote, setShippingNote] = useState('');

  useEffect(() => {
    if (sale) {
      setShippingDetails(sale.shippingDetails || '');
      setShippingAddress(sale.customerName || '');
      setShippingStatus(sale.shippingStatus || '');
      setDeliveredTo('');
      setDeliveryPerson('');
      setShippingNote('');
    }
  }, [sale]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !sale) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sale.id, {
      shippingDetails,
      shippingAddress,
      shippingStatus,
      deliveredTo,
      deliveryPerson,
      shippingNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col text-slate-200 max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/80">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-violet-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Edit Shipping - <span className="font-mono text-cyan-300">{sale.invoiceNo}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpdate} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5 text-xs custom-scrollbar">
            
            {/* Row 1: Shipping Details & Shipping Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Shipping Details:*
                </label>
                <textarea
                  rows={3}
                  value={shippingDetails}
                  onChange={(e) => setShippingDetails(e.target.value)}
                  placeholder="Shipping Details"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Shipping Address:
                </label>
                <textarea
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Shipping Address"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Row 2: Status, Delivered To, Delivery Person */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Shipping Status:
                </label>
                <select
                  value={shippingStatus}
                  onChange={(e) => setShippingStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#0c0827]">Please Select</option>
                  <option value="Ordered" className="bg-[#0c0827]">Ordered</option>
                  <option value="Packed" className="bg-[#0c0827]">Packed</option>
                  <option value="Shipped" className="bg-[#0c0827]">Shipped</option>
                  <option value="Delivered" className="bg-[#0c0827]">Delivered</option>
                  <option value="Cancelled" className="bg-[#0c0827]">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Delivered To:
                </label>
                <input
                  type="text"
                  value={deliveredTo}
                  onChange={(e) => setDeliveredTo(e.target.value)}
                  placeholder="Delivered To"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Delivery Person:
                </label>
                <select
                  value={deliveryPerson}
                  onChange={(e) => setDeliveryPerson(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#0c0827]">Please Select</option>
                  <option value="Delivery Agent 1" className="bg-[#0c0827]">Delivery Agent 1</option>
                  <option value="Delivery Agent 2" className="bg-[#0c0827]">Delivery Agent 2</option>
                  <option value="Delivery Rider" className="bg-[#0c0827]">Delivery Rider</option>
                </select>
              </div>
            </div>

            {/* Row 3: Shipping note */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Shipping note:
              </label>
              <textarea
                rows={3}
                value={shippingNote}
                onChange={(e) => setShippingNote(e.target.value)}
                placeholder="Shipping note"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
              />
            </div>

            {/* Row 4: Shipping Documents dropzone */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Shipping Documents:
              </label>
              <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center bg-[#08051e]/50 hover:bg-[#08051e]/80 hover:border-violet-500/50 transition-all cursor-pointer">
                <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-300 text-xs">Drop files here to upload</p>
                <p className="text-[10px] text-slate-500 mt-1">or click to browse from device</p>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">No attachment found</p>
            </div>

            {/* Row 5: Activities */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Activities:
              </label>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c0827] text-slate-400 font-semibold border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">By</th>
                      <th className="py-2.5 px-3">Note</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#08051e]/60">
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500 italic">
                        No records found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-[#0c0827]/90 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/25 transition-all active:scale-95 cursor-pointer"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-white/10 active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
