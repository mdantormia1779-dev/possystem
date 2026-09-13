import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  ArrowDownToLine, 
  AlertTriangle, 
  PlusCircle, 
  Receipt, 
  CreditCard, 
  Clock, 
  ArrowUpRight, 
  ChevronRight,
  Sparkles,
  PackageCheck
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: "Today's Sales",
      value: "৳ 1,24,500",
      change: "+14.2%",
      isPositive: true,
      subtext: "vs. yesterday",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Total Orders",
      value: "48",
      change: "+8.1%",
      isPositive: true,
      subtext: "42 Paid, 6 Due",
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Purchases",
      value: "৳ 86,200",
      change: "-3.5%",
      isPositive: false,
      subtext: "8 Supplier Invoices",
      icon: ArrowDownToLine,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Low Stock Alert",
      value: "12 Items",
      change: "Action needed",
      isPositive: false,
      subtext: "Below minimum level",
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
  ];

  const recentOrders = [
    {
      id: "INV-2026-0048",
      customer: "Kamal Hossain",
      items: "Yamaha Engine Oil 10W-40, Brake Pad",
      total: "৳ 2,450",
      method: "bKash",
      status: "Paid",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "10 mins ago",
    },
    {
      id: "INV-2026-0047",
      customer: "Rafiqul Islam",
      items: "Tubeless Tyre 90/90-17, Valve",
      total: "৳ 3,800",
      method: "Cash",
      status: "Paid",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "24 mins ago",
    },
    {
      id: "INV-2026-0046",
      customer: "Motaleb Bike Works",
      items: "Chain Sprocket Kit (FZ-S), Spark Plug",
      total: "৳ 4,600",
      method: "Cash",
      status: "Partial",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200",
      time: "45 mins ago",
    },
    {
      id: "INV-2026-0045",
      customer: "Shakil Ahmed",
      items: "Motul 3100 4T 10W-30 (1L)",
      total: "৳ 650",
      method: "Card",
      status: "Paid",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "1 hour ago",
    },
    {
      id: "INV-2026-0044",
      customer: "Hasan Motors",
      items: "Battery 12V 5Ah, Horn Set",
      total: "৳ 2,900",
      method: "Credit / Due",
      status: "Due",
      statusColor: "bg-rose-50 text-rose-700 border-rose-200",
      time: "2 hours ago",
    },
  ];

  const lowStockItems = [
    {
      name: "Yamaha FZ Version 2 Air Filter",
      sku: "YMH-AF-02",
      current: 2,
      min: 10,
      category: "Filters",
    },
    {
      name: "Castrol Activ 4T 20W-50 1L",
      sku: "CST-20W50-1L",
      current: 4,
      min: 24,
      category: "Lubricants",
    },
    {
      name: "Ceramic Brake Shoes (Pulsar 150)",
      sku: "BS-PLS-150",
      current: 1,
      min: 8,
      category: "Brakes",
    },
    {
      name: "NGK Laser Iridium Spark Plug",
      sku: "NGK-IR-99",
      current: 3,
      min: 15,
      category: "Ignition",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Welcome back, Admin
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles size={12} /> Live POS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rangpur Bike Parlour - Real-time shop overview & quick transactions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button 
            type="button" 
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors"
          >
            <PlusCircle size={16} />
            <span>Add Purchase</span>
          </button>

          <button 
            type="button" 
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0042b3] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Receipt size={16} />
            <span>Open POS Terminal</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${stat.color} transition-transform group-hover:scale-110 duration-200`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  <span className={`font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-slate-400">{stat.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Orders Table + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Orders (2 spans) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-800">Recent Sales & Invoices</h2>
              <p className="text-xs text-slate-400 mt-0.5">Today&apos;s latest completed & pending transactions</p>
            </div>
            <button 
              type="button" 
              className="text-xs font-semibold text-[#0042b3] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{order.customer}</div>
                      <div className="text-[11px] text-slate-400 sm:hidden truncate max-w-[120px]">
                        {order.items}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 hidden sm:table-cell truncate max-w-[200px]">
                      {order.items}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {order.total}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 whitespace-nowrap">
                      {order.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Alerts & Cash Status (1 span) */}
        <div className="space-y-6">
          {/* Low Stock Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-500" />
                <h3 className="font-bold text-sm text-slate-800">Low Stock Alert</h3>
              </div>
              <span className="text-xs bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                4 Critical
              </span>
            </div>

            <div className="space-y-3">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-rose-600">{item.current} left</span>
                    <p className="text-[10px] text-slate-400">Min: {item.min}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cash & Register Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" />
              <span>Cash Register & Accounts</span>
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">Cash in Drawer</span>
                <span className="text-sm font-bold text-slate-800">৳ 34,250</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">bKash Merchant</span>
                <span className="text-sm font-bold text-slate-800">৳ 58,400</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">Bank Balance (City Bank)</span>
                <span className="text-sm font-bold text-slate-800">৳ 31,850</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Total Liquid Funds</span>
              <span className="text-base font-extrabold text-[#0042b3]">৳ 1,24,500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
