import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2) {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDuration(days: number) {
  if (days >= 90) return `${Math.round(days / 30)} months`;
  if (days >= 30) return `${Math.round(days / 30)} mo`;
  return `${days}d`;
}

export function statusColor(status: string) {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
    Verified: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    Bidding: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    Accepted: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    Funded: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
    Repaid: "bg-slate-500/10 text-slate-300 border-slate-500/30",
    Submitted: "bg-gray-500/10 text-gray-300 border-gray-500/30",
    Revealed: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    Active: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  };
  return colors[status] || "bg-gray-500/10 text-gray-300 border-gray-500/30";
}

export function getRoleBadge(role: string) {
  const badges: Record<string, string> = {
    supplier: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    lender_a: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    lender_b: "bg-violet-500/20 text-violet-300 border-violet-500/40",
    lender_c: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    buyer: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    auditor: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  };
  return badges[role] || "bg-gray-500/20 text-gray-300 border-gray-500/40";
}
