"use client";

import React, { useRef } from 'react';
import { X, Printer, Building, User, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';

export interface PurchaseItemDetail {
  name: string;
  sku: string;
  quantity: number;
  unit?: string;
  unitCostBeforeDiscount?: number;
  discountPercent?: number;
  unitCostBeforeTax?: number;
  subtotalBeforeTax?: number;
  tax?: number;
  unitCostPriceAfterTax?: number;
  lineTotal: number;
}

export interface PurchasePaymentDetail {
  id?: string;
  date: string;
  referenceNo: string;
  amount: number;
  paymentMode: string;
  paymentNote?: string;
}

export interface PurchaseActivityDetail {
  date: string;
  action: string;
  by: string;
  status: string;
  total: number;
  paymentStatus: string;
}

export interface PurchaseDetailsRecord {
  id: string;
  referenceNo: string;
  supplierName: string;
  supplierMobile?: string;
  purchaseDate: string;
  businessName?: string;
  businessAddress?: string;
  businessMobile?: string;
  businessLocation: string;
  status: 'Received' | 'Pending' | 'Ordered' | string;
  paymentStatus: 'Paid' | 'Partial' | 'Due' | string;
  grandTotal: number;
  paidAmount: number;
  paymentDue: number;
  paymentMethod?: string;
  items?: PurchaseItemDetail[];
  shippingCharges?: number;
  shippingDetails?: string;
  additionalNotes?: string;
  totalExpenses?: number;
  calculatedTax?: number;
  calculatedDiscount?: number;
  addedBy?: string;
  payments?: PurchasePaymentDetail[];
  activities?: PurchaseActivityDetail[];
}

interface PurchaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: PurchaseDetailsRecord | null;
}

export default function PurchaseDetailsModal({
  isOpen,
  onClose,
  purchase
}: PurchaseDetailsModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !purchase) return null;

  // Format currency
  const formatMoney = (val: number | undefined) => {
    const num = Number(val || 0);
    return `৳ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const netTotal = (purchase.items && purchase.items.length > 0)
    ? purchase.items.reduce((sum, it) => sum + (it.subtotalBeforeTax || it.lineTotal || 0), 0)
    : purchase.grandTotal;

  const discountAmount = purchase.calculatedDiscount || 0;
  const taxAmount = purchase.calculatedTax || 0;
  const shippingCharge = purchase.shippingCharges || 0;
  const grandTotal = purchase.grandTotal || (netTotal - discountAmount + taxAmount + shippingCharge);

  // Fallback payments if none provided
  const paymentsList: PurchasePaymentDetail[] = (purchase.payments && purchase.payments.length > 0)
    ? purchase.payments
    : [
        {
          date: purchase.purchaseDate ? purchase.purchaseDate.split(' ')[0] : '16/08/2026',
          referenceNo: purchase.referenceNo.replace('PO', 'PP'),
          amount: purchase.paidAmount,
          paymentMode: purchase.paymentMethod || 'Cash',
          paymentNote: '--'
        }
      ];

  // Fallback activities if none provided
  const activitiesList: PurchaseActivityDetail[] = (purchase.activities && purchase.activities.length > 0)
    ? purchase.activities
    : [
        {
          date: purchase.purchaseDate || '16/08/2026 03:29 PM',
          action: 'Added',
          by: purchase.addedBy || 'Admin',
          status: purchase.status || 'Received',
          total: grandTotal,
          paymentStatus: purchase.paymentStatus || 'Paid'
        }
      ];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      alert('Please allow pop-ups to print this invoice.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Details - #${purchase.referenceNo}</title>
          <meta charset="utf-8" />
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: Arial, Helvetica, sans-serif; 
              color: #212529; 
              background: #fff; 
              margin: 0; 
              padding: 24px;
              font-size: 12px;
            }
            .header-title { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 6px; }
            .date-right { text-align: right; font-weight: 600; margin-bottom: 12px; font-size: 12px; }
            .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; line-height: 1.5; }
            .info-col { flex: 1; font-size: 12px; }
            .info-col strong { color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
            th { 
              background-color: #20c997; 
              color: #ffffff; 
              padding: 8px 10px; 
              text-align: left; 
              font-weight: bold;
              border: 1px solid #1ba87e;
            }
            td { 
              border: 1px solid #dee2e6; 
              padding: 7px 10px; 
              color: #212529; 
            }
            .bottom-layout { display: flex; gap: 24px; margin-top: 16px; }
            .bottom-left { flex: 1.2; }
            .bottom-right { flex: 0.8; }
            .badge-cyan {
              background-color: #00c0ef;
              color: #ffffff;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 10px;
              font-weight: bold;
              display: inline-block;
              margin-right: 4px;
            }
            .grey-bar {
              background-color: #e2e8f0;
              min-height: 24px;
              padding: 6px 10px;
              margin-top: 4px;
              margin-bottom: 14px;
              font-size: 11px;
            }
            .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
            @media print {
              body { padding: 10px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-title">Purchase Details (Reference No: #${purchase.referenceNo})</div>
          <div class="date-right">Date: ${purchase.purchaseDate ? purchase.purchaseDate.split(' ')[0] : '16/08/2026'}</div>
          
          <div class="info-grid">
            <div class="info-col">
              <strong>Supplier:</strong><br />
              ${purchase.supplierName}<br />
              Mobile: ${purchase.supplierMobile || '564656454656'}
            </div>
            <div class="info-col">
              <strong>Business:</strong><br />
              ${purchase.businessName || 'RANGPUR BIKE PARLOUR'} ${purchase.businessLocation || 'RANGPUR BIKE PARLOUR'}<br />
              ${purchase.businessAddress || 'RANGPUR,RANGPUR,Bangladesh'}<br />
              Mobile: ${purchase.businessMobile || '01957387109'}
            </div>
            <div class="info-col">
              <strong>Reference No:</strong> #${purchase.referenceNo}<br />
              <strong>Date:</strong> ${purchase.purchaseDate ? purchase.purchaseDate.split(' ')[0] : '16/08/2026'}<br />
              <strong>Purchase Status:</strong> ${purchase.status}<br />
              <strong>Payment Status:</strong> ${purchase.paymentStatus}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Purchase Quantity</th>
                <th>Unit Cost (Before Discount)</th>
                <th>Discount Percent</th>
                <th>Unit Cost (Before Tax)</th>
                <th>Subtotal (Before Tax)</th>
                <th>Tax</th>
                <th>Unit Cost Price (After Tax)</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${(purchase.items || []).map((it, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${it.name}</td>
                  <td>${it.sku}</td>
                  <td>${it.quantity} ${it.unit || 'Pieces'}</td>
                  <td>৳ ${(it.unitCostBeforeDiscount || it.unitCostBeforeTax || 0).toFixed(2)}</td>
                  <td>${(it.discountPercent || 0).toFixed(2)} %</td>
                  <td>৳ ${(it.unitCostBeforeTax || 0).toFixed(2)}</td>
                  <td>৳ ${(it.subtotalBeforeTax || it.lineTotal || 0).toFixed(2)}</td>
                  <td>৳ ${(it.tax || 0).toFixed(2)}</td>
                  <td>৳ ${(it.unitCostPriceAfterTax || it.unitCostBeforeTax || 0).toFixed(2)}</td>
                  <td>৳ ${(it.lineTotal || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="bottom-layout">
            <div class="bottom-left">
              <h4>Payment info:</h4>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Reference No</th>
                    <th>Amount</th>
                    <th>Payment mode</th>
                    <th>Payment note</th>
                  </tr>
                </thead>
                <tbody>
                  ${paymentsList.map((p, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${p.date}</td>
                      <td>${p.referenceNo}</td>
                      <td>৳ ${p.amount.toFixed(2)}</td>
                      <td>${p.paymentMode}</td>
                      <td>${p.paymentNote || '--'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <h4>Shipping Details:</h4>
              <div class="grey-bar">${purchase.shippingDetails || '--'}</div>

              <h4>Activities:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>By</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  ${activitiesList.map((a) => `
                    <tr>
                      <td>${a.date}</td>
                      <td>${a.action}</td>
                      <td>${a.by}</td>
                      <td>
                        Status: <span class="badge-cyan">${a.status}</span>
                        Total: <span class="badge-cyan">৳ ${a.total.toFixed(2)}</span>
                        Payment Status: <span class="badge-cyan">${a.paymentStatus}</span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="bottom-right">
              <div class="totals-row"><span>Net Total Amount:</span> <strong>৳ ${netTotal.toFixed(2)}</strong></div>
              <div class="totals-row"><span>Discount: (-)</span> <strong>৳ ${discountAmount.toFixed(2)}</strong></div>
              <div class="totals-row"><span>Purchase Tax: (+)</span> <strong>${taxAmount > 0 ? `৳ ${taxAmount.toFixed(2)}` : '0.00'}</strong></div>
              <div class="totals-row"><span>Additional Shipping charges: (+)</span> <strong>${shippingCharge > 0 ? `৳ ${shippingCharge.toFixed(2)}` : '0.00'}</strong></div>
              <div class="totals-row" style="border-top: 1px solid #ccc; padding-top: 8px; margin-top: 8px; font-size: 14px;">
                <span>Purchase Total:</span> <strong>৳ ${grandTotal.toFixed(2)}</strong>
              </div>
              <h4 style="margin-top: 20px;">Additional Notes:</h4>
              <div class="grey-bar">${purchase.additionalNotes || '--'}</div>
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0e0a2b] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl text-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col font-sans backdrop-blur-2xl">
        
        {/* Ambient Top Glow matching project theme */}
        <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-xs pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#120e34]/90 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>Purchase Details</span>
              <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                #{purchase.referenceNo}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs scrollbar-thin scrollbar-thumb-white/15">
          
          {/* Date right-aligned under title */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-1">
            <span className="text-slate-500 text-[11px]">Purchase Order Summary</span>
            <span className="text-slate-300">Date: {purchase.purchaseDate ? purchase.purchaseDate.split(' ')[0] : '16/08/2026'}</span>
          </div>

          {/* 3 Columns Information Section matching project cosmic cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#08051e]/80 border border-white/10 text-xs text-slate-300">
            {/* Supplier Info */}
            <div className="space-y-1">
              <span className="font-bold text-indigo-200 block text-[11px] uppercase tracking-wider">Supplier</span>
              <p className="font-semibold text-white text-sm">{purchase.supplierName || 'SHAMIM'}</p>
              <p className="text-slate-400">
                Mobile: <span className="text-slate-200">{purchase.supplierMobile || '564656454656'}</span>
              </p>
            </div>

            {/* Business Info */}
            <div className="space-y-1">
              <span className="font-bold text-indigo-200 block text-[11px] uppercase tracking-wider">Business</span>
              <p className="font-bold text-white">
                {purchase.businessName || 'RANGPUR BIKE PARLOUR'} <span className="font-normal text-slate-400">{purchase.businessLocation || 'RANGPUR BIKE PARLOUR'}</span>
              </p>
              <p className="text-slate-400">{purchase.businessAddress || 'RANGPUR,RANGPUR,Bangladesh'}</p>
              <p className="text-slate-400">
                Mobile: <span className="text-slate-200">{purchase.businessMobile || '01957387109'}</span>
              </p>
            </div>

            {/* Purchase Meta */}
            <div className="space-y-1">
              <span className="font-bold text-indigo-200 block text-[11px] uppercase tracking-wider">Order Status</span>
              <p>
                <span className="text-slate-400">Reference No: </span>
                <span className="font-bold text-cyan-300">#{purchase.referenceNo}</span>
              </p>
              <p>
                <span className="text-slate-400">Date: </span>
                <span className="text-slate-200">{purchase.purchaseDate ? purchase.purchaseDate.split(' ')[0] : '16/08/2026'}</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {purchase.status || 'Received'}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {purchase.paymentStatus || 'Paid'}
                </span>
              </div>
            </div>
          </div>

          {/* 11-Columns Main Purchased Items Table */}
          <div>
            <h4 className="font-bold text-white text-xs mb-2">Purchased Products</h4>
            <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin scrollbar-thumb-white/15">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white font-bold text-[11px] border-b border-white/15 select-none">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center border-r border-white/10">#</th>
                    <th className="py-2.5 px-3 border-r border-white/10">Product Name</th>
                    <th className="py-2.5 px-3 border-r border-white/10">SKU</th>
                    <th className="py-2.5 px-3 border-r border-white/10 text-center">Purchase Quantity</th>
                    <th className="py-2.5 px-3 border-r border-white/10 text-right">Unit Cost (Before Disc)</th>
                    <th className="py-2.5 px-3 border-r border-white/10 text-center">Discount %</th>
                    <th className="py-2.5 px-3 border-r border-white/10 text-right">Unit Cost (Before Tax)</th>
                    <th className="py-2.5 px-3 border-r border-white/10 text-right">Subtotal (Before Tax)</th>
                    <th className="py-2.5 px-3 border-r border-white/10 text-right">Tax</th>
                    <th className="py-2.5 px-3 border-r border-white/10 text-right">Unit Cost Price (After Tax)</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-[#08051e]/60 text-slate-200">
                  {purchase.items && purchase.items.length > 0 ? (
                    purchase.items.map((item, idx) => {
                      const qty = item.quantity || 1;
                      const unitCostBeforeDisc = item.unitCostBeforeDiscount !== undefined ? item.unitCostBeforeDiscount : (item.lineTotal / qty);
                      const discPercent = item.discountPercent || 0;
                      const costBeforeTax = item.unitCostBeforeTax !== undefined ? item.unitCostBeforeTax : unitCostBeforeDisc;
                      const subtotalBeforeTax = item.subtotalBeforeTax !== undefined ? item.subtotalBeforeTax : (costBeforeTax * qty);
                      const tax = item.tax || 0;
                      const costAfterTax = item.unitCostPriceAfterTax !== undefined ? item.unitCostPriceAfterTax : (costBeforeTax + tax);
                      const lineTotal = item.lineTotal !== undefined ? item.lineTotal : (costAfterTax * qty);

                      return (
                        <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                          <td className="py-2.5 px-3 text-center font-medium text-slate-400 border-r border-white/10">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white border-r border-white/10">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-cyan-300 font-mono border-r border-white/10">
                            {item.sku || '0003'}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-200 border-r border-white/10 whitespace-nowrap">
                            {qty.toFixed(2)} {item.unit || 'Pieces'}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap border-r border-white/10">
                            {formatMoney(unitCostBeforeDisc)}
                          </td>
                          <td className="py-2.5 px-3 text-center border-r border-white/10">
                            {discPercent.toFixed(2)} %
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap border-r border-white/10">
                            {formatMoney(costBeforeTax)}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap border-r border-white/10">
                            {formatMoney(subtotalBeforeTax)}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap border-r border-white/10">
                            {formatMoney(tax)}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap border-r border-white/10">
                            {formatMoney(costAfterTax)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-cyan-300 whitespace-nowrap">
                            {formatMoney(lineTotal)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={11} className="py-6 text-center text-slate-400">
                        No item details found for this purchase order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Layout: Split into Left (Payment info, Shipping, Activities) & Right (Totals, Notes) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (Approx 60% width) */}
            <div className="md:col-span-7 space-y-5">
              
              {/* 1. Payment info */}
              <div>
                <h4 className="font-bold text-white text-xs mb-2">Payment info:</h4>
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white font-bold text-[11px]">
                      <tr>
                        <th className="py-2 px-3 w-10 text-center border-r border-white/10">#</th>
                        <th className="py-2 px-3 border-r border-white/10">Date</th>
                        <th className="py-2 px-3 border-r border-white/10">Reference No</th>
                        <th className="py-2 px-3 border-r border-white/10 text-right">Amount</th>
                        <th className="py-2 px-3 border-r border-white/10">Payment mode</th>
                        <th className="py-2 px-3">Payment note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-[#08051e]/60 text-slate-200">
                      {paymentsList.map((pm, i) => (
                        <tr key={i} className="hover:bg-white/[0.04]">
                          <td className="py-2 px-3 text-center text-slate-400 border-r border-white/10">{i + 1}</td>
                          <td className="py-2 px-3 border-r border-white/10 whitespace-nowrap">{pm.date}</td>
                          <td className="py-2 px-3 font-medium text-cyan-300 font-mono border-r border-white/10">{pm.referenceNo}</td>
                          <td className="py-2 px-3 border-r border-white/10 text-right whitespace-nowrap font-bold text-emerald-400">
                            {formatMoney(pm.amount)}
                          </td>
                          <td className="py-2 px-3 border-r border-white/10">{pm.paymentMode}</td>
                          <td className="py-2 px-3 text-slate-400">{pm.paymentNote || '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Shipping Details */}
              <div>
                <h4 className="font-bold text-white text-xs mb-1.5">Shipping Details:</h4>
                <div className="bg-[#08051e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300">
                  {purchase.shippingDetails || '--'}
                </div>
              </div>

              {/* 3. Activities */}
              <div>
                <h4 className="font-bold text-white text-xs mb-1.5">Activities:</h4>
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="border-b border-white/10 text-slate-300 bg-white/[0.04] font-bold text-[11px]">
                      <tr>
                        <th className="py-2 px-3 border-r border-white/10">Date</th>
                        <th className="py-2 px-3 border-r border-white/10">Action</th>
                        <th className="py-2 px-3 border-r border-white/10">By</th>
                        <th className="py-2 px-3">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-[#08051e]/60 text-slate-200">
                      {activitiesList.map((act, i) => (
                        <tr key={i} className="hover:bg-white/[0.04]">
                          <td className="py-2 px-3 border-r border-white/10 text-slate-400 whitespace-nowrap">
                            {act.date}
                          </td>
                          <td className="py-2 px-3 border-r border-white/10 font-medium text-white">
                            {act.action}
                          </td>
                          <td className="py-2 px-3 border-r border-white/10 text-slate-300">
                            {act.by}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1">
                                <span className="text-slate-400">Status:</span>
                                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {act.status}
                                </span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="text-slate-400">Total:</span>
                                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {formatMoney(act.total)}
                                </span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="text-slate-400">Payment Status:</span>
                                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {act.paymentStatus}
                                </span>
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column (Approx 40% width) */}
            <div className="md:col-span-5 space-y-5">
              
              {/* Financial Summary */}
              <div className="p-4 rounded-2xl bg-[#08051e]/80 border border-white/10 space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-medium">Net Total Amount:</span>
                  <span className="font-bold text-white">{formatMoney(netTotal)}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-medium">Discount:</span>
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-rose-400 font-mono">(-)</span>
                    <span className="font-bold">{formatMoney(discountAmount)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-medium">Purchase Tax:</span>
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-cyan-400 font-mono">(+)</span>
                    <span className="font-bold">{taxAmount > 0 ? formatMoney(taxAmount) : '0.00'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 font-medium">Additional Shipping charges:</span>
                  <div className="flex items-center gap-1.5 text-white">
                    <span className="text-cyan-400 font-mono">(+)</span>
                    <span className="font-bold">{shippingCharge > 0 ? formatMoney(shippingCharge) : '0.00'}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2.5 border-t border-white/10 mt-2">
                  <span className="font-extrabold text-white text-sm">Purchase Total:</span>
                  <span className="font-extrabold text-cyan-300 text-base">{formatMoney(grandTotal)}</span>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h4 className="font-bold text-white text-xs mb-1.5">Additional Notes:</h4>
                <div className="bg-[#08051e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-400 min-h-[44px]">
                  {purchase.additionalNotes || '--'}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#120e34]/90 flex justify-end items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer active:scale-95"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer active:scale-95"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
