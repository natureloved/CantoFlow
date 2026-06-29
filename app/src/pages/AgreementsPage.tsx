import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, Landmark, ArrowRight, Shield, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEED_AGREEMENT } from "../data/seed";
import { cn, formatCurrency, formatDate, statusColor } from "../lib/utils";

export function AgreementsPage() {
  const navigate = useNavigate();
  const role = CURRENT_ROLE;
  const isSupplier = role === "supplier";
  const isLender = role.startsWith("lender");
  const isAuditor = role === "auditor";

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Funding Agreements</h1>
        <p className="text-sm text-slate-400 mt-1">
          {isSupplier ? "View and manage your funding agreements" : isAuditor ? "Audit scope agreements" : "View your agreements"}
        </p>
      </div>

      <div className="space-y-4">
        {[SEED_AGREEMENT].map((agreement) => (
          <motion.div
            key={agreement.agreementId}
            whileHover={{ scale: 1.001 }}
            className="glass-card p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-violet-500/15">
                    <Landmark className="w-5 h-5 text-violet-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono">{agreement.agreementId}</h3>
                    <p className="text-xs text-slate-500">Mandatory rights in Canton Daml contracts. Cannot be altered unilaterally.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Financed Amount</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(agreement.amount)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Interest Rate</p>
                    <p className="text-lg font-bold text-white">{formatPercent(agreement.interestRate)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Advance Rate</p>
                    <p className="text-lg font-bold text-white">{formatPercent(agreement.advanceRate)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Origination Fee</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(agreement.feeAmount)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Maturity</p>
                    <p className="text-sm font-semibold text-white">{formatDate(agreement.maturityDate)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-200/50">
                    <p className="text-[10px] text-slate-500 mb-1">Status</p>
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border", statusColor(agreement.status))}>
                      {agreement.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/40">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Shield className="w-3.5 h-3.5 text-brand-blue" />
                    <span className="font-mono">{agreement.supplier.split("::")?.[0] || "Supplier"}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Landmark className="w-3.5 h-3.5 text-violet-400" />
                    <span className="font-mono">{agreement.lender.split("::")?.[0] || "Lender"}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-mono">{agreement.buyer.split("::")?.[0] || "Buyer"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
