import { Eye, EyeOff, Lock, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface PrivacyBannerProps {
  role: string;
}

const PRIVACY_MESSAGES: Record<string, { title: string; description: string; icon: any; items: string[] }> = {
  supplier: {
    title: "Full Visibility · Supplier Role",
    description: "You see all invoices and all bids for your invoices. Financing terms are visible only to you and the winning lender.",
    icon: Eye,
    items: ["All invoice requests visible", "All lender bids on your invoices", "Funding agreements and repayments", "Full audit log access"],
  },
  lender_a: {
    title: "Private Bid · Lender A",
    description: "You see only YOUR bids. Other lenders' rates and terms are completely hidden from your node.",
    icon: EyeOff,
    items: ["Your bids only — no lender competition", "Invoice amount is known but proceeds hidden", "Canton: separate FinancingBid contracts", "No cross-leakage between lenders"],
  },
  lender_b: {
    title: "Private Bid · Lender B",
    description: "You see only YOUR bids. Other lenders' rates and terms are completely hidden from your node.",
    icon: EyeOff,
    items: ["Your bids only — no lender competition", "Invoice amount is known but proceeds hidden", "Canton: separate FinancingBid contracts", "No cross-leakage between lenders"],
  },
  lender_c: {
    title: "Private Bid · Lender C",
    description: "You see only YOUR bids. Other lenders' rates and terms are completely hidden from your node.",
    icon: EyeOff,
    items: ["Your bids only — no lender competition", "Invoice amount is known but proceeds hidden", "Canton: separate FinancingBid contracts", "No cross-leakage between lenders"],
  },
  buyer: {
    title: "Invoice Verification · Buyer",
    description: "You verify invoice amount and due date. Financing terms are hidden from your view.",
    icon: Shield,
    items: ["Your invoices and due dates", "Confirm invoice legitimacy", "Part of FundingAgreement (signatory)", "Cannot see lender bids or rates"],
  },
  auditor: {
    title: "Read-Only Audit · Auditor",
    description: "Delegated observer access. You see workflow transitions, not commercial terms.",
    icon: Lock,
    items: ["WorkflowEvent history", "AuditAccessGrant scope", "Contract transitions (state changes)", "No access to bid details or invoice amounts"],
  },
};

export function PrivacyBanner({ role }: PrivacyBannerProps) {
  const config = PRIVACY_MESSAGES[role] || PRIVACY_MESSAGES.supplier;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-8"
    >
      <div className="glass-card p-4 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className={cn("p-2.5 rounded-xl", role.startsWith("lender") ? "bg-emerald-500/15" : role === "auditor" ? "bg-slate-400/15" : role === "buyer" ? "bg-rose-500/15" : "bg-brand-blue/15")}>
          <Icon className={cn("w-5 h-5", role.startsWith("lender") ? "text-emerald-300" : role === "auditor" ? "text-slate-300" : role === "buyer" ? "text-rose-300" : "text-brand-blue")} />
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-semibold text-white">{config.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{config.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {config.items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-surface-100/80 text-slate-300 border border-slate-700/40"
            >
              <Zap className="w-3 h-3 text-brand-blue" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function cn(...classes: (boolean | undefined | string)[]) {
  return classes.filter(Boolean).join(" ");
}
