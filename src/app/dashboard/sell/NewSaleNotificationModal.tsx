"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Info,
  ChevronDown,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  RotateCcw,
  RotateCw,
  MessageSquare,
  Mail
} from 'lucide-react';
import { SaleRecord } from './DeleteSaleModal';

interface NewSaleNotificationModalProps {
  isOpen: boolean;
  sale: SaleRecord | null;
  onClose: () => void;
  onSend: (msg: string) => void;
}

export default function NewSaleNotificationModal({
  isOpen,
  sale,
  onClose,
  onSend,
}: NewSaleNotificationModalProps) {
  const [sendEmail, setSendEmail] = useState(true);
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('Thank you from {business_name}');
  const [ccEmail, setCcEmail] = useState('');
  const [bccEmail, setBccEmail] = useState('');
  const [emailBody, setEmailBody] = useState(
`Dear {contact_name},

Your invoice number is {invoice_number}
Total amount: {total_amount}
Paid amount: {received_amount}

Thank you for shopping with us.

{business_logo}`
  );

  const [sendSms, setSendSms] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsBody, setSmsBody] = useState(
    'Dear {contact_name}, thank you for your purchase. Invoice #{invoice_number}, Total: {total_amount}.'
  );
  const [showSmsSection, setShowSmsSection] = useState(false);

  useEffect(() => {
    if (sale) {
      setToEmail(sale.contactNumber ? `${sale.customerName.toLowerCase().replace(/\s+/g, '')}@example.com` : '');
      setSmsPhone(sale.contactNumber || '');
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

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(`New sale notification sent successfully for Invoice #${sale.invoiceNo}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-[#120e34] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col text-slate-200 max-h-[94vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0827]/80">
          <div className="flex items-center gap-2">
            <Mail size={17} className="text-violet-400" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Send Notification - New Sale
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSendNotification} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5 text-xs custom-scrollbar">
            
            {/* Available Tags box matching Screenshot 4 */}
            <div className="p-3.5 rounded-xl bg-[#08051e] border border-white/10 text-slate-400 text-[11px] leading-relaxed">
              <span className="font-bold text-white block mb-1">Available Tags:</span>
              <p className="line-clamp-4 hover:line-clamp-none transition-all font-mono text-[10px] text-slate-400">
                {`{business_name}, {business_logo}, {invoice_number}, {invoice_url}, {total_amount}, {paid_amount}, {due_amount}, {cumulative_due_amount}, {due_date}, {location_name}, {location_address}, {location_email}, {location_phone}, {location_custom_field_1}, {location_custom_field_2}, {location_custom_field_3}, {location_custom_field_4}, {contact_name}, {contact_custom_field_1}, {contact_custom_field_2}, {contact_custom_field_3}, {contact_custom_field_4}, {contact_custom_field_5}, {contact_custom_field_6}, {contact_custom_field_7}, {contact_custom_field_8}, {contact_custom_field_9}, {contact_custom_field_10}, {sell_custom_field_1}, {sell_custom_field_2}, {sell_custom_field_3}, {sell_custom_field_4}, {shipping_custom_field_1}, {shipping_custom_field_2}, {shipping_custom_field_3}, {shipping_custom_field_4}, {shipping_custom_field_5}`}
              </p>
            </div>

            {/* Send Email Section */}
            <div className="rounded-2xl border border-white/10 bg-[#08051e]/60 p-4 space-y-4">
              <h3 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
                <span>Send Email</span>
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendEmailCheck"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#08051e] border-white/20 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <label htmlFor="sendEmailCheck" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Send Email
                </label>
              </div>

              {sendEmail && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                      <span>To:</span>
                      <Info size={12} className="text-cyan-400" />
                    </label>
                    <input
                      type="text"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="To"
                      className="w-full px-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email Subject:</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">CC:</label>
                      <input
                        type="text"
                        value={ccEmail}
                        onChange={(e) => setCcEmail(e.target.value)}
                        placeholder="CC"
                        className="w-full px-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">BCC:</label>
                      <input
                        type="text"
                        value={bccEmail}
                        onChange={(e) => setBccEmail(e.target.value)}
                        placeholder="BCC"
                        className="w-full px-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Rich Text Styled Editor Box matching Screenshot 4 */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email Body:</label>
                    <div className="border border-white/15 rounded-xl overflow-hidden bg-[#08051e]">
                      
                      {/* Sub-menu bar */}
                      <div className="px-3 py-1.5 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                        <span className="hover:text-white cursor-pointer">My Favorites</span>
                        <span className="hover:text-white cursor-pointer">File</span>
                        <span className="hover:text-white cursor-pointer">Edit</span>
                        <span className="hover:text-white cursor-pointer">View</span>
                        <span className="hover:text-white cursor-pointer">Insert</span>
                        <span className="hover:text-white cursor-pointer">Format</span>
                        <span className="hover:text-white cursor-pointer">Tools</span>
                        <span className="hover:text-white cursor-pointer">Table</span>
                        <span className="hover:text-white cursor-pointer">Help</span>
                      </div>

                      {/* Tool bar */}
                      <div className="px-3 py-1.5 border-b border-white/10 bg-white/[0.04] flex items-center gap-2 text-slate-300 text-xs">
                        <button type="button" className="p-1 hover:bg-white/10 rounded cursor-pointer" title="Undo">
                          <RotateCcw size={12} />
                        </button>
                        <button type="button" className="p-1 hover:bg-white/10 rounded cursor-pointer" title="Redo">
                          <RotateCw size={12} />
                        </button>
                        <span className="w-[1px] h-4 bg-white/10" />
                        <span className="text-[11px] font-medium text-slate-300 px-1">Paragraph ▾</span>
                        <span className="w-[1px] h-4 bg-white/10" />
                        <button type="button" className="p-1 hover:bg-white/10 rounded cursor-pointer font-bold" title="Bold">
                          <Bold size={12} />
                        </button>
                        <button type="button" className="p-1 hover:bg-white/10 rounded cursor-pointer italic" title="Italic">
                          <Italic size={12} />
                        </button>
                        <span className="w-[1px] h-4 bg-white/10" />
                        <button type="button" className="p-1 hover:bg-white/10 rounded cursor-pointer" title="Align Left">
                          <AlignLeft size={12} />
                        </button>
                        <button type="button" className="p-1 hover:bg-white/10 rounded cursor-pointer" title="Align Center">
                          <AlignCenter size={12} />
                        </button>
                        <button type="button" className="p-1 hover:bg-white/10 rounded cursor-pointer" title="Align Right">
                          <AlignRight size={12} />
                        </button>
                      </div>

                      {/* Textarea */}
                      <textarea
                        rows={7}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full p-3.5 bg-transparent text-slate-200 text-xs font-mono focus:outline-none resize-none leading-relaxed"
                      />

                      {/* Footer bar */}
                      <div className="px-3 py-1 border-t border-white/10 bg-white/[0.02] flex justify-between items-center text-[10px] text-slate-500">
                        <span>p</span>
                        <span>20 WORDS • POWERED BY TINY</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Send SMS / WhatsApp Section matching Screenshot 4 */}
            <div className="rounded-2xl border border-white/10 bg-[#08051e]/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowSmsSection(!showSmsSection)}
                className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-bold text-cyan-400 text-xs sm:text-sm">
                  Send sms/whatsapp notification
                </span>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform ${showSmsSection ? 'rotate-180' : ''}`}
                />
              </button>

              {showSmsSection && (
                <div className="p-4 pt-1 space-y-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sendSmsCheck"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#08051e] border-white/20 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />
                    <label htmlFor="sendSmsCheck" className="text-xs font-semibold text-slate-200 cursor-pointer">
                      Send SMS / WhatsApp Notification
                    </label>
                  </div>

                  {sendSms && (
                    <>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Mobile Number:</label>
                        <input
                          type="text"
                          value={smsPhone}
                          onChange={(e) => setSmsPhone(e.target.value)}
                          placeholder="Mobile Number"
                          className="w-full px-3 py-2 rounded-xl bg-[#08051e] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Message Body:</label>
                        <textarea
                          rows={3}
                          value={smsBody}
                          onChange={(e) => setSmsBody(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#08051e] border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none font-mono"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Footer Actions matching Screenshot 4 */}
          <div className="px-6 py-4 bg-[#0c0827]/90 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/25 transition-all active:scale-95 cursor-pointer"
            >
              <Send size={13} />
              <span>Send</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-white/10 active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
