import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, FileText, Award, Landmark, Users, Clock, DollarSign, BarChart2, Eye, Shield, Zap, Lock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { SEED_STATS, SEED_INVOICES, PARTIES } from "../data/seed";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, statusColor, getRoleBadge } from "../lib/utils";
import { useState } from "react";

const EVENT_FLOW_DATA = [
  { stage: "Created", events: 1, label: "Invoice Created" },
  { stage: "Verified", events: 1, label: "Buyer Verified" },
  { stage: "Bidding", events: 3, label: "Bids Submitted" },
  { stage: "Accepted", events: 1, label: "Bid Accepted" },
  { stage: "Funded", events: 1, label: "Agreement Created" },
  { stage: "Settled", events: 0, label: "Repaid" },
];

const BID_FEE_DATA = [
  { lender: "Lender B", rate: 6.5, accepted: true },
  { lender: "Lender C", rate: 7.0, accepted: false },
  { lender: "Lender A", rate: 8.0, accepted: false },
];

function StatCard({ title, value, change, icon: Icon, subtitle, accent }: { title: string; value: string; change?: string; icon: any; subtitle?: string; accent?: "blue" | "emerald" | "violet" }) {
  const accentColors: Record<string, string> = { blue: "from-brand-blue/20 to-brand-blue/5 border-brand-blue/20", emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20", violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20" };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="relative overflow-hidden rounded-2xl border bg-surface-300/40 p-5 border-slate-700/40 hover:border-slate-600/60 transition-colors group cursor-pointer">
      <div className={`absolute inset-0 bg-gradient-to-br ${accentColors[accent || "blue"]} opacity-50 group-hover:opacity-70 transition-opacity`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-xl bg-surface-200/80"><Icon className="w-5 h-5 text-brand-blue" /></div>
          {change && <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{change}</span>}
        </div>
        <p className="text-xs font-medium text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "workflow">("overview");
  const qc = useQueryClient();

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Invoice financing marketplace — Canton privacy layer active</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-200/60 border border-slate-700/40">
            <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-xs text-slate-400">Ledger Connected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Invoices" value="3" change="+1 this month" icon={FileText} subtitle="Active financing requests" accent="blue" />
        <StatCard title="Active Bids" value="3" change="3 lenders bidding" icon={Award} subtitle="Confidential proposals" accent="emerald" />
        <StatCard title="Agreements" value="1" change="1 active" icon={Landmark} subtitle="Funding agreements" accent="violet" />
        <StatCard title="Expected Repayment" value={formatCurrency(95850)} icon={DollarSign} subtitle={`Due ${formatDate("2026-09-14")}`} accent="blue" />
      </div>

      <div className="flex items-center gap-1 p-1 bg-surface-300/60 rounded-xl border border-slate-700/40 mb-6 w-fit">
        {(["overview", "workflow"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? "bg-surface-200 text-white shadow-inner" : "text-slate-400 hover:text-white hover:bg-surface-100/50"}`}>
            {tab === "overview" ? "Market Overview" : "Workflow Progress"}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Workflow Progress</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={EVENT_FLOW_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="workflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f90ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f90ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }} itemStyle={{ color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="events" stroke="#4f90ff" fill="url(#workflowGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Bid Fee Comparison</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={BID_FEE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="lender" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 10]} />
                <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Fee Rate"]} contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {BID_FEE_DATA.map((entry) => <Cell key={entry.lender} fill={entry.accepted ? "#8b5cf6" : "#4f90ff"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Active Workflow — REQ-001</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-blue shadow-[0_0_8px_rgba(79,144,255,0.5)]" />
                <div className="flex-1"><p className="text-xs font-medium text-white">1. InvoiceRequest Created</p><p className="text-xs text-slate-500">Supplier created INV-2026-001 for $100,000</p></div>
                <span className="text-xs text-slate-500">Jun 29, 10:00</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-brand-blue shadow-[0_0_8px_rgba(79,144,255,0.5)]" />
                <div className="flex-1"><p className="text-xs font-medium text-white">2. Buyer Confirmed</p><p className="text-xs text-slate-500">Buyer verified amount and due date</p></div>
                <span className="text-xs text-slate-500">Jun 29, 10:15</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400" />
                <div className="flex-1"><p className="text-xs font-medium text-white">3. 3 Lenders Invited</p><p className="text-xs text-slate-500">Supplier invited LenderA, LenderB, LenderC</p></div>
                <span className="text-xs text-slate-500">Jun 29, 10:20</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400" />
                <div className="flex-1"><p className="text-xs font-medium text-white">4. 3 Confidential Bids Submitted</p><p className="text-xs text-slate-500">LenderA: 8.0% · LenderB: 6.5% · LenderC: 7.0%</p></div>
                <span className="text-xs text-slate-500">Jun 29, 10:25</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-violet-400" />
                <div className="flex-1"><p className="text-xs font-medium text-white">5. Bid Accepted (LenderB)</p><p className="text-xs text-slate-500">Supplier accepted 6.5% fee rate bid</p></div>
                <span className="text-xs text-slate-500">Jun 29, 11:00</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 border-2 border-slate-600 bg-surface-300" />
                <div className="flex-1"><p className="text-xs font-medium text-slate-500">6. Funding Agreement Created</p><p className="text-xs text-slate-600">AG-REQ-001 · Active</p></div>
                <span className="text-xs text-slate-600">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 border-2 border-slate-700 bg-surface-300" />
                <div className="flex-1"><p className="text-xs font-medium text-slate-500">7. Auditor Granted Access</p><p className="text-xs text-slate-600">WorkflowEvent scope issued</p></div>
                <span className="text-xs text-slate-600">Pending</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Invoices</h3>
            <button onClick={() => navigate("/invoices")} className="text-xs text-brand-blue hover:underline">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/40">
                  <th className="pb-3 text-xs font-medium text-slate-500">Invoice ID</th>
                  <th className="pb-3 text-xs font-medium text-slate-500">Description</th>
                  <th className="pb-3 text-xs font-medium text-slate-500">Amount</th>
                  <th className="pb-3 text-xs font-medium text-slate-500">Due Date</th>
                  <th className="pb-3 text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {SEED_INVOICES.map((inv) => (
                  <tr key={inv.requestId} onClick={() => navigate(`/invoices/${inv.requestId}`)} className="hover:bg-surface-100/50 transition-colors cursor-pointer">
                    <td className="py-3 pr-4"><span className="text-xs font-mono text-brand-blue">{inv.invoiceId}</span></td>
                    <td className="py-3 pr-4"><p className="text-xs text-white max-w-[200px] truncate">{inv.description}</p></td>
                    <td className="py-3 pr-4"><span className="text-xs font-semibold text-white">{formatCurrency(inv.amount, inv.currency)}</span></td>
                    <td className="py-3 pr-4"><span className="text-xs text-slate-400">{formatDate(inv.dueDate)}</span></td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
