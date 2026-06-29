import { motion } from "framer-motion";
import { Award, ArrowDownRight, ArrowUpRight, Eye, EyeOff, Send, CheckCircle2 } from "lucide-react";
import { cn, formatCurrency, formatPercent, statusColor, formatDuration } from "../lib/utils";
import { ROLES, SEED_BIDS, SEED_INVOICES } from "../data/seed";
import { useNavigate } from "react-router-dom";

export function BidsPage() {
  const navigate = useNavigate();
  const roleKey = CURRENT_ROLE;
  const isLender = roleKey.startsWith("lender");
  const isSupplier = roleKey === "supplier";
  const roleConfig = ROLES[CURRENT_ROLE];

  const myLenderParty = roleConfig?.party;

  // Canton privacy model: supplier sees ALL bids on their invoices
  // Each lender sees ONLY their own bids
  const visibleBids =
    isSupplier
      ? SEED_BIDS
      : isLender
        ? SEED_BIDS.filter((b) => b.lender === myLenderParty)
        : [];

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isSupplier ? "Bid Management" : isLender ? "My Bids" : "Bids"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {visibleBids.length === 0 && isLender ? (
              <span className="flex items-center gap-1.5 text-slate-500">
                <Lock className="w-3.5 h-3.5" />
                No bids visible — submit your first confidential bid
              </span>
            ) : (
              `${visibleBids.length} confidential bid${visibleBids.length !== 1 ? "s" : ""} visible`
            )}
          </p>
        </div>
        {isLender && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <EyeOff className="w-4 h-4 text-emerald-400" />
            Private · Only your bids visible
          </div>
        )}
        {isSupplier && (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Eye className="w-4 h-4" />
            All {visibleBids.length} bids visible — Canton contract isolation ensures no lender cross-sees
          </div>
        )}
      </div>

      {visibleBids.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <EyeOff className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Bids Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {isLender
              ? Canton privacy model ensures you can only see your own bids. Submit your first proposal from the marketplace."
              : "No bids available at this time."}
          </p>
          {isLender && (
            <button onClick={() => navigate("/invoices")} className="btn-primary mt-6">
              <Send className="w-4 h-4" />
              Browse Marketplace
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visibleBids.map((bid) => {
            const invoice = SEED_INVOICES.find((i) => i.requestId === bid.requestId);
            const isAccepted = bid.status === "Accepted";

            return (
              <motion.div
                key={bid.bidId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl", isAccepted ? "bg-violet-500/15" : "bg-surface-200")}>
                      <Award className={cn("w-5 h-5", isAccepted ? "text-violet-300" : "text-slate-400")} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{bid.bidId}</p>
                      <p className="text-xs text-slate-500 font-mono">Lender: {bid.lender.split("::")[0] || bid.lender.slice(0, 20)}</p>
                    </div>
                  </div>
                  <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold border", statusColor(bid.status))}>
                    {bid.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Interest Rate</p>
                    <p className="text-base font-bold text-white">{formatPercent(bid.interestRate)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Advance Rate</p>
                    <p className="text-base font-bold text-white">{formatPercent(bid.advanceRate)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Fee Amount</p>
                    <p className="text-base font-bold text-white">{formatCurrency(bid.feeAmount)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Maturity</p>
                    <p className="text-base font-bold text-white">{formatDuration(bid.maturityDays)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-200/30">
                  <p className="text-xs text-slate-500">Invoice: <span className="text-slate-300">{invoice?.invoiceNumber || bid.requestId}</span> · <span className="text-slate-300">{invoice ? formatCurrency(invoice.amount, invoice.currency) : ""}</span></p>
                  {isAccepted ? (
                    <span className="flex items-center gap-1.5 text-xs text-violet-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Winning bid
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">Competing bid · Private</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
