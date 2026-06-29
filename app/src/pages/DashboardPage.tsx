import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Award,
  Landmark,
  Users,
  Activity,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SEED_STATS, SEED_INVOICES, PARTIES } from "../data/seed";
import {
  InvoiceRequest,
  FinancingBid,
  FundingAgreement,
  WorkflowEvent,
} from "../types";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, statusColor, getRoleBadge } from "../lib/utils";
import { useState } from "react";

const EVENT_TYPES = ["InvoiceCreated", "InvoiceConfirmed", "BidSubmitted", "BidAccepted", "AgreementCreated", "BidRevealed"];

const EVENT_FLOW_DATA = [
  { stage: "Created", events: 1, label: "Invoice Created" },
  { stage: "Confirmed", events: 1, label: "Buyer Verified" },
  { stage: "Bidding", events: 3, label: "Bids Submitted" },
  { stage: "Accepted", events: 1, label: "Bid Accepted" },
  { stage: "Funded", events: 1, label: "Agreement Created" },
  { stage: "Settled", events: 0, label: "Repaid" },
];

const BID_RATE_DATA = [
  { lender: "Lender B", rate: 6.5, accepted: true },
  { lender: "Lender C", rate: 7.0, accepted: false },
  { lender: "Lender A", rate: 8.0, accepted: false },
];

const COLORS = {
  accepted: "#8b5cf6",
  pending: "#4f90ff",
  inactive: "#475569",
};

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  subtitle,
  accent,
}: {
  title: string;
  value: string;
  change?: string;
  icon: any;
  subtitle?: string;
  accent?: "blue" | "emerald" | "violet";
}) {
  const accentColors = {
    blue: "from-brand-blue/20 to-brand-blue/5 border-brand-blue/20",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-2xl border bg-surface-300/40 p-5 border-slate-700/40 hover:border-slate-600/60 transition-colors group cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accentColors[accent || "blue"]} opacity-50 group-hover:opacity-70 transition-opacity`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-xl bg-surface-200/80">
            <Icon className="w-5 h-5 text-brand-blue" />
          </div>
          {change && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {change}
            </span>
          )}
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

  const { data: invoices, isLoading: invLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/invoices");
        if (res.ok) return (await res.json()) as InvoiceRequest[];
      } catch { /* offline */ }
      return SEED_INVOICES;
    },
    staleTime: 1000 * 60,
  });

  const { data: bids, isLoading: bidLoading } = useQuery({
    queryKey: ["bids"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/bids");
        if (res.ok) return (await res.json()) as FinancingBid[];
      } catch { /* offline */ }
      return [] as FinancingBid[];
    },
    staleTime: 1000 * 60,
  });

  const { data: agreements } = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/agreements");
        if (res.ok) return (await res.json()) as FundingAgreement[];
      } catch { /* offline */ }
      return [] as FundingAgreement[];
    },
    staleTime: 1000 * 60,
  });

  const { data: events } = useQuery({
    queryKey: ["audit-events"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/audit");
        if (res.ok) return (await res.json()) as WorkflowEvent[];
      } catch { /* offline */ }
      return [] as WorkflowEvent[];
    },
    staleTime: 1000 * 60,
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/dashboard/summary");
        if (res.ok) return (await res.json());
      } catch { /* offline */ }
      return SEED_STATS;
    },
    staleTime: 1000 * 60,
  });

  const seedBids = bids?.length ? bids : [];
  const seedAgreements = agreements?.length ? agreements : [];
  const seedEvents = events?.length ? events : [];
  const seedInvoices = invoices?.length ? invoices : [];

  const totalInvoices = stats?.totalInvoices ?? 3;
  const totalBids = stats?.totalBids ?? 3;
  const totalAgreements = stats?.totalAgreements ?? 1;
  const activeBids = stats?.activeBids ?? 2;
  const expectedRepayment = stats?.expectedRepayment ?? 90000;

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Invoice financing marketplace — Canton privacy layer active</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-200/60 border border-slate-700/40">
            <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
            <span className="text-xs text-slate-400">Ledger Connected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Invoices"
          value={String(totalInvoices)}
          change="+1 this month"
          icon={FileText}
          subtitle="Active financing requests"
          accent="blue"
        />
        <StatCard
          title="Active Bids"
          value={String(totalBids)}
          change="3 lenders bidding"
          icon={Award}
          subtitle="Confidential proposals"
          accent="emerald"
        />
        <StatCard
          title="Agreements"
          value={String(totalAgreements)}
          change="1 active"
          icon={Landmark}
          subtitle="Funding agreements"
          accent="violet"
        />
        <StatCard
          title="Expected Repayment"
          value={formatCurrency(expectedRepayment)}
          icon={DollarSign}
          subtitle={
            seedAgreements.length > 0
              ? `Due ${formatDate(seedAgreements[0]?.maturityDate || "")}`
              : "No agreements yet"
          }
          accent="blue"
        />
      </div>

      <div className="flex items-center gap-1 p-1 bg-surface-300/60 rounded-xl border border-slate-700/40 mb-6 w-fit">
        {(["overview", "workflow"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === tab
                ? "bg-surface-200 text-white shadow-inner"
                : "text-slate-400 hover:text-white hover:bg-surface-100/50"
            )}
          >
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Area type="monotone" dataKey="events" stroke="#4f90ff" fill="url(#workflowGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Latest Events</h3>
            <div className="space-y-3">
              {events?.slice(-4).map((ev) => (
                <div key={ev.eventId} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-200/40 hover:bg-surface-200/70 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/15 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{ev.eventType}</p>
                    <p className="text-xs text-slate-500 truncate">{ev.metadata}</p>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">{new Date(ev.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Bid Rate Comparison</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart2 data={BID_RATE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="lender" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 10]} />
                <Tooltip
                  formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Interest Rate"]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <BarChart className="w-full h-full" />
              </BarChart2>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Workflow Event Flow</h3>
            <div className="space-y-3">
              {events?.map((ev, i) => (
                <div key={ev.eventId} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn("w-3 h-3 rounded-full border-2", i === 0 ? "border-brand-blue bg-brand-blue/30" : EVENT_TYPES.includes(ev.eventType) ? "border-emerald-400 bg-emerald-400/30" : "border-slate-500 bg-slate-500/20")} />
                    {i < (events?.length || 0) - 1 && <div className="w-0.5 h-6 bg-slate-700" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-xs font-medium text-white">{ev.eventType}</p>
                    <p className="text-xs text-slate-500">{ev.metadata}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5 font-mono">{ev.party} · {new Date(ev.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
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
                {seedInvoices.map((inv) => (
                  <tr
                    key={inv.requestId}
                    onClick={() => navigate(`/invoices/${inv.requestId}`)}
                    className="hover:bg-surface-100/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 pr-4">
                      <span className="text-xs font-mono text-brand-blue">{inv.invoiceNumber}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-xs text-white max-w-[200px] truncate">{inv.description}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs font-semibold text-white">{formatCurrency(inv.amount, inv.currency)}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-slate-400">{formatDate(inv.dueDate)}</span>
                    </td>
                    <td className="py-3">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border", statusColor(inv.status))}>
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
