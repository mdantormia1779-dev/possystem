"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiHelpCircle, FiChevronUp, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

interface PermissionOption {
  id: string;
  label: string;
  type?: 'checkbox' | 'radio';
  radioGroup?: string;
  hasInfo?: boolean;
}

interface PermissionCategory {
  id: string;
  name: string;
  hasInfo?: boolean;
  hasSelectAll?: boolean;
  options: PermissionOption[];
}

const permissionData: PermissionCategory[] = [
  {
    id: 'others',
    name: 'Others',
    hasSelectAll: true,
    options: [
      { id: 'view_export_buttons', label: 'View export to buttons (csv/excel/print/pdf) on tables' },
    ],
  },
  {
    id: 'user',
    name: 'User',
    hasSelectAll: true,
    options: [
      { id: 'view_user', label: 'View user' },
      { id: 'add_user', label: 'Add user' },
      { id: 'edit_user', label: 'Edit user' },
      { id: 'delete_user', label: 'Delete user' },
    ],
  },
  {
    id: 'roles',
    name: 'Roles',
    hasSelectAll: true,
    options: [
      { id: 'view_role', label: 'View role' },
      { id: 'add_role', label: 'Add Role' },
      { id: 'edit_role', label: 'Edit Role' },
      { id: 'delete_role', label: 'Delete role' },
    ],
  },
  {
    id: 'supplier',
    name: 'Supplier',
    hasSelectAll: true,
    options: [
      { id: 'view_all_supplier', label: 'View all supplier', type: 'radio', radioGroup: 'supplier_view' },
      { id: 'view_own_supplier', label: 'View own supplier', type: 'radio', radioGroup: 'supplier_view' },
      { id: 'add_supplier', label: 'Add supplier' },
      { id: 'edit_supplier', label: 'Edit supplier' },
      { id: 'delete_supplier', label: 'Delete supplier' },
    ],
  },
  {
    id: 'customer',
    name: 'Customer',
    hasInfo: true,
    hasSelectAll: true,
    options: [
      { id: 'view_all_customer', label: 'View all customer', type: 'radio', radioGroup: 'customer_view_scope' },
      { id: 'view_own_customer', label: 'View own customer', type: 'radio', radioGroup: 'customer_view_scope' },
      { id: 'cust_no_sell_1m', label: 'View customers with no sell from one month only', type: 'radio', radioGroup: 'customer_inactivity' },
      { id: 'cust_no_sell_3m', label: 'View customers with no sell from three months only', type: 'radio', radioGroup: 'customer_inactivity' },
      { id: 'cust_no_sell_6m', label: 'View customers with no sell from six months only', type: 'radio', radioGroup: 'customer_inactivity' },
      { id: 'cust_no_sell_1y', label: 'View customers with no sell from one year only', type: 'radio', radioGroup: 'customer_inactivity' },
      { id: 'cust_irrespective_sell', label: 'View customers irrespective of their sell', type: 'radio', radioGroup: 'customer_inactivity' },
      { id: 'add_customer', label: 'Add customer' },
      { id: 'edit_customer', label: 'Edit customer' },
      { id: 'delete_customer', label: 'Delete customer' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    hasSelectAll: true,
    options: [
      { id: 'view_product', label: 'View product' },
      { id: 'add_product', label: 'Add product' },
      { id: 'edit_product', label: 'Edit product' },
      { id: 'delete_product', label: 'Delete product' },
      { id: 'add_opening_stock', label: 'Add Opening Stock' },
      { id: 'view_purchase_price', label: 'View Purchase Price', hasInfo: true },
    ],
  },
  {
    id: 'purchase_stock_adjustment',
    name: 'Purchase & Stock Adjustment',
    hasSelectAll: true,
    options: [
      { id: 'view_all_purchase_stock', label: 'View all Purchase & Stock Adjustment', type: 'radio', radioGroup: 'ps_view' },
      { id: 'view_own_purchase_stock', label: 'View own Purchase & Stock Adjustment', type: 'radio', radioGroup: 'ps_view' },
      { id: 'add_purchase_stock', label: 'Add purchase & Stock Adjustment' },
      { id: 'edit_purchase_stock', label: 'Edit purchase & Stock Adjustment' },
      { id: 'delete_purchase_stock', label: 'Delete purchase & Stock Adjustment' },
      { id: 'add_purchase_payment', label: 'Add purchase payment' },
      { id: 'edit_purchase_payment', label: 'Edit purchase payment' },
      { id: 'delete_purchase_payment', label: 'Delete purchase payment' },
      { id: 'update_status_purchase', label: 'Update Status' },
    ],
  },
  {
    id: 'pos',
    name: 'POS',
    hasSelectAll: true,
    options: [
      { id: 'view_pos_sell', label: 'View POS sell' },
      { id: 'add_pos_sell', label: 'Add POS sell' },
      { id: 'edit_pos_sell', label: 'Edit POS sell' },
      { id: 'delete_pos_sell', label: 'Delete POS sell' },
      { id: 'edit_product_price_pos', label: 'Edit product price from POS screen' },
      { id: 'edit_product_discount_pos', label: 'Edit product discount from POS screen' },
      { id: 'add_edit_payment_pos', label: 'Add/Edit Payment' },
      { id: 'print_invoice_pos', label: 'Print Invoice' },
      { id: 'disable_multiple_pay', label: 'Disable Multiple Pay' },
      { id: 'disable_draft', label: 'Disable Draft' },
      { id: 'disable_express_checkout', label: 'Disable Express Checkout' },
      { id: 'disable_discount', label: 'Disable Discount' },
      { id: 'disable_suspend_sale', label: 'Disable Suspend Sale' },
      { id: 'disable_credit_sale_button', label: 'Disable credit sale button' },
      { id: 'disable_quotation', label: 'Disable Quotation' },
      { id: 'disable_card', label: 'Disable Card' },
    ],
  },
  {
    id: 'sell',
    name: 'Sell',
    hasInfo: true,
    hasSelectAll: true,
    options: [
      { id: 'view_all_sell', label: 'View all sell', type: 'radio', radioGroup: 'sell_scope' },
      { id: 'view_own_sell_only', label: 'View own sell only', type: 'radio', radioGroup: 'sell_scope' },
      { id: 'view_paid_sells_only', label: 'View paid sells only' },
      { id: 'view_due_sells_only', label: 'View due sells only' },
      { id: 'view_partially_paid_sells_only', label: 'View partially paid sells only' },
      { id: 'view_overdue_sells_only', label: 'View overdue sells only' },
      { id: 'add_sell', label: 'Add Sell' },
      { id: 'update_sell', label: 'Update Sell' },
      { id: 'delete_sell', label: 'Delete Sell' },
      { id: 'commission_agent_view_own_sell', label: 'Commission agent can view their own sell' },
      { id: 'add_sell_payment', label: 'Add sell payment' },
      { id: 'edit_sell_payment', label: 'Edit sell payment' },
      { id: 'delete_sell_payment', label: 'Delete sell payment' },
      { id: 'edit_product_price_sales_screen', label: 'Edit product price from sales screen' },
      { id: 'edit_product_discount_sale_screen', label: 'Edit product discount from Sale screen' },
      { id: 'add_edit_delete_discount', label: 'Add/Edit/Delete Discount' },
      { id: 'access_all_sell_return', label: 'Access all sell return' },
      { id: 'access_own_sell_return', label: 'Access own sell return' },
      { id: 'add_edit_invoice_number', label: 'Add edit invoice number' },
    ],
  },
  {
    id: 'draft',
    name: 'Draft',
    hasSelectAll: true,
    options: [
      { id: 'view_all_drafts', label: 'View all drafts', type: 'radio', radioGroup: 'draft_view' },
      { id: 'view_own_drafts', label: 'View own drafts', type: 'radio', radioGroup: 'draft_view' },
      { id: 'edit_draft', label: 'Edit draft' },
      { id: 'delete_draft', label: 'Delete draft' },
    ],
  },
  {
    id: 'quotation',
    name: 'Quotation',
    hasSelectAll: true,
    options: [
      { id: 'view_all_quotations', label: 'View all quotations', type: 'radio', radioGroup: 'quotation_view' },
      { id: 'view_own_quotations', label: 'View own quotations', type: 'radio', radioGroup: 'quotation_view' },
      { id: 'edit_quotation', label: 'Edit quotation' },
      { id: 'delete_quotation', label: 'Delete quotation' },
    ],
  },
  {
    id: 'shipments',
    name: 'Shipments',
    hasSelectAll: true,
    options: [
      { id: 'access_all_shipments', label: 'Access all shipments', type: 'radio', radioGroup: 'shipment_access' },
      { id: 'access_own_shipments', label: 'Access own shipments', type: 'radio', radioGroup: 'shipment_access' },
      { id: 'access_pending_shipments_only', label: 'Access pending shipments only' },
      { id: 'commission_agent_access_own_shipments', label: 'Commission agent can access their own shipments' },
    ],
  },
  {
    id: 'cash_register',
    name: 'Cash Register',
    hasSelectAll: true,
    options: [
      { id: 'view_cash_register', label: 'View cash register' },
      { id: 'close_cash_register', label: 'Close cash register' },
    ],
  },
  {
    id: 'brand',
    name: 'Brand',
    hasSelectAll: true,
    options: [
      { id: 'view_brand', label: 'View brand' },
      { id: 'add_brand', label: 'Add brand' },
      { id: 'edit_brand', label: 'Edit brand' },
      { id: 'delete_brand', label: 'Delete brand' },
    ],
  },
  {
    id: 'tax_rate',
    name: 'Tax rate',
    hasSelectAll: true,
    options: [
      { id: 'view_tax_rate', label: 'View tax rate' },
      { id: 'add_tax_rate', label: 'Add tax rate' },
      { id: 'edit_tax_rate', label: 'Edit tax rate' },
      { id: 'delete_tax_rate', label: 'Delete tax rate' },
    ],
  },
  {
    id: 'unit',
    name: 'Unit',
    hasSelectAll: true,
    options: [
      { id: 'view_unit', label: 'View unit' },
      { id: 'add_unit', label: 'Add unit' },
      { id: 'edit_unit', label: 'Edit unit' },
      { id: 'delete_unit', label: 'Delete unit' },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    hasSelectAll: true,
    options: [
      { id: 'view_category', label: 'View category' },
      { id: 'add_category', label: 'Add category' },
      { id: 'edit_category', label: 'Edit category' },
      { id: 'delete_category', label: 'Delete category' },
    ],
  },
  {
    id: 'report',
    name: 'Report',
    hasSelectAll: true,
    options: [
      { id: 'view_purchase_sell_report', label: 'View purchase & sell report' },
      { id: 'view_tax_report', label: 'View Tax report' },
      { id: 'view_supplier_customer_report', label: 'View Supplier & Customer report' },
      { id: 'view_expense_report', label: 'View expense report' },
      { id: 'view_profit_loss_report', label: 'View profit/loss report' },
      { id: 'view_stock_reports', label: 'View stock report, stock adjustment report & stock expiry report' },
      { id: 'view_trending_product_report', label: 'View trending product report' },
      { id: 'view_register_report', label: 'View register report' },
      { id: 'view_sales_rep_report', label: 'View sales representative report' },
      { id: 'view_product_stock_value', label: 'View product stock value' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    hasSelectAll: true,
    options: [
      { id: 'access_business_settings', label: 'Access business settings' },
      { id: 'access_barcode_settings', label: 'Access barcode settings' },
      { id: 'access_invoice_settings', label: 'Access invoice settings' },
      { id: 'access_printers', label: 'Access printers' },
    ],
  },
  {
    id: 'expense',
    name: 'Expense',
    hasSelectAll: true,
    options: [
      { id: 'access_all_expenses', label: 'Access all expenses', type: 'radio', radioGroup: 'expense_scope' },
      { id: 'view_own_expense_only', label: 'View own expense only', type: 'radio', radioGroup: 'expense_scope' },
      { id: 'add_expense', label: 'Add Expense' },
      { id: 'edit_expense', label: 'Edit Expense' },
      { id: 'delete_expense', label: 'Delete Expense' },
    ],
  },
  {
    id: 'home',
    name: 'Home',
    hasInfo: true,
    options: [
      { id: 'view_home_data', label: 'View Home data' },
    ],
  },
  {
    id: 'account',
    name: 'Account',
    options: [
      { id: 'access_accounts', label: 'Access Accounts' },
      { id: 'edit_account_transaction', label: 'Edit account transaction' },
      { id: 'delete_account_transaction', label: 'Delete account transaction' },
    ],
  },
  {
    id: 'access_selling_price_groups',
    name: 'Access selling price groups',
    options: [
      { id: 'default_selling_price', label: 'Default Selling Price' },
    ],
  },
  {
    id: 'superadmin',
    name: 'Superadmin',
    options: [
      { id: 'access_package_subscriptions', label: 'Access package subscriptions' },
    ],
  },
];

function EditRoleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get('id') || '2';

  const [roleName, setRoleName] = useState<string>('Cashier');
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({
    // Pre-select typical cashier permissions matching screenshots
    view_pos_sell: true,
    add_pos_sell: true,
    edit_pos_sell: true,
    delete_pos_sell: true,
    add_edit_payment_pos: true,
    print_invoice_pos: true,
    view_cash_register: true,
    close_cash_register: true,
    view_home_data: true,
    default_selling_price: true,
  });
  const [radioPermissions, setRadioPermissions] = useState<Record<string, string>>({
    sell_scope: 'view_own_sell_only',
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (roleId === '1') {
      setRoleName('Admin');
      // Admin has all permissions
      const allPerms: Record<string, boolean> = {};
      permissionData.forEach((cat) => {
        cat.options.forEach((opt) => {
          if (!opt.type || opt.type === 'checkbox') {
            allPerms[opt.id] = true;
          }
        });
      });
      setSelectedPermissions(allPerms);
    } else {
      setRoleName('Cashier');
    }
  }, [roleId]);

  const handleCheckboxChange = (permId: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permId]: !prev[permId],
    }));
  };

  const handleRadioChange = (group: string, permId: string) => {
    setRadioPermissions((prev) => ({
      ...prev,
      [group]: permId,
    }));
  };

  const handleSelectAll = (category: PermissionCategory) => {
    const allCheckboxIds = category.options
      .filter((opt) => !opt.type || opt.type === 'checkbox')
      .map((opt) => opt.id);

    const isAllChecked = allCheckboxIds.every((id) => selectedPermissions[id]);

    setSelectedPermissions((prev) => {
      const updated = { ...prev };
      allCheckboxIds.forEach((id) => {
        updated[id] = !isAllChecked;
      });
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    setIsSaved(true);
    setTimeout(() => {
      router.push('/dashboard/rules');
    }, 800);
  };

  return (
    <div className="w-full font-sans select-none flex flex-col justify-between min-h-[calc(100vh-8rem)] text-slate-200">
      <div className="w-full space-y-4 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/rules"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Back to roles"
          >
            <FiArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              Edit Role
            </h1>
            <p className="text-xs text-indigo-300/70">Modify role details and configure system permissions</p>
          </div>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
            <FiCheckCircle className="w-4 h-4" />
            <span>Role updated successfully! Redirecting...</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="w-full bg-[#120e34]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.36)] p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Role Name Input */}
          <div className="max-w-xl">
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Role Name:*
            </label>
            <input
              type="text"
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Role Name"
              className="w-full px-3.5 py-2 bg-[#0c0827]/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight mb-3">
              Permissions:
            </h2>

            {/* Permission List Table/Matrix matching screenshots */}
            <div className="divide-y divide-white/10 border-t border-white/10">
              {permissionData.map((category) => {
                const checkboxOptions = category.options.filter((opt) => !opt.type || opt.type === 'checkbox');
                const isAllSelected = checkboxOptions.length > 0 && checkboxOptions.every((opt) => selectedPermissions[opt.id]);

                return (
                  <div key={category.id} className="py-4 flex flex-col md:flex-row md:items-start text-xs border-b border-white/5">
                    {/* Left: Category Name */}
                    <div className="w-full md:w-56 shrink-0 flex items-center gap-1.5 font-semibold text-white mb-2 md:mb-0">
                      <span>{category.name}</span>
                      {category.hasInfo && (
                        <FiHelpCircle className="w-3.5 h-3.5 text-cyan-400 cursor-pointer" />
                      )}
                    </div>

                    {/* Middle: Select All */}
                    <div className="w-full md:w-48 shrink-0 mb-3 md:mb-0">
                      {category.hasSelectAll && (
                        <label className="inline-flex items-center gap-2 cursor-pointer font-normal text-slate-300">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={() => handleSelectAll(category)}
                            className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20 cursor-pointer accent-indigo-500"
                          />
                          <span>Select all</span>
                        </label>
                      )}
                    </div>

                    {/* Right: Option List */}
                    <div className="flex-1 space-y-2.5">
                      {category.options.map((opt) => {
                        const isRadio = opt.type === 'radio';
                        const checked = isRadio
                          ? radioPermissions[opt.radioGroup!] === opt.id
                          : Boolean(selectedPermissions[opt.id]);

                        return (
                          <div key={opt.id} className="flex items-center gap-2.5">
                            <input
                              type={isRadio ? 'radio' : 'checkbox'}
                              id={opt.id}
                              name={isRadio ? opt.radioGroup : undefined}
                              checked={checked}
                              onChange={() => {
                                if (isRadio) {
                                  handleRadioChange(opt.radioGroup!, opt.id);
                                } else {
                                  handleCheckboxChange(opt.id);
                                }
                              }}
                              className={`w-4 h-4 ${
                                isRadio
                                  ? 'text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20'
                                  : 'rounded text-indigo-500 focus:ring-indigo-500/40 bg-[#0c0827] border-white/20'
                              } cursor-pointer accent-indigo-500`}
                            />
                            <label htmlFor={opt.id} className="text-slate-300 cursor-pointer inline-flex items-center gap-1.5 leading-tight">
                              <span>{opt.label}</span>
                              {opt.hasInfo && (
                                <FiHelpCircle className="w-3.5 h-3.5 text-cyan-400 cursor-pointer" />
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button: Update (matching media_1789379607151.png) */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <Link
              href="/dashboard/rules"
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs sm:text-sm border border-white/10 transition-all cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* Page Footer */}
      <footer className="mt-8 text-[11px] text-slate-500 flex items-center justify-between max-w-7xl mx-auto w-full">
        <span>DATABYTE - V6.5 | Copyright © 2026 All rights reserved.</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-7 h-7 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
          title="Scroll to top"
        >
          <FiChevronUp className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}

export default function EditRolePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading role editor...</div>}>
      <EditRoleContent />
    </Suspense>
  );
}
