import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Search, Filter, Eye, Lock, Shield, ArrowRight, MoreVertical } from "lucide-react";
import { SEED_INVOICES, SEED_BIDS } from "../data/seed";
import { cn, formatCurrency, formatDate, statusColor } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { ROLES, PARTIES } from "../data/seed";

export function InvoicesPage() {
  const navigate = useNavigate();
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const role = ROLES[CURRENT_ROLE];
  const isSupplier = CURRENT_ROLE === "supplier";
  const isBuyer = CURRENT_ROLE === "buyer";
  const isAuditor = CURRENT_ROLE === "auditor";

  const invoices = SEED_INVOICES.map(inv => {
    const requestBids = SEED_BIDS.filter(b => b.invoiceRequestCid === inv.requestId);
    return { ...inv, bidCount: requestBids.length };
  });

  return (
    <div className="max-w-7xl mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isSupplier ? "My Invoice Requests" : isBuyer ? "Invoice Verification" : isAuditor ? "Audited Invoices" : "Marketplace"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isSupplier ? "Submit and manage your invoice financing requests" : isBuyer ? "Verify invoice amounts and due dates" : isAuditor ? "Review invoices under audit scope" : "Browse available invoice financing opportunities"}
          </p>
        </div>
        {isSupplier && (
          <button onClick={() => setShowNewModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            New Financing Request
          </button>
        )}
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-300/60 border border-slate-700/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-blue/40 transition-colors"
            />
          </div>
          <button className="btn-ghost">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="space-y-3">
          {invoices.map((invoice) => (
            <motion.div
              key={invoice.requestId}
              whileHover={{ scale: [1, 1.005] }}
              className={cn("group p-4 rounded-xl border transition-all cursor-pointer", selectedInvoice === invoice.requestId ? "border-brand-blue/50 bg-brand-blue/5" : "border-slate-700/40 bg-surface-300/30 hover:border-slate-600/60")}
              onClick={() => setSelectedInvoice(selectedInvoice === invoice.requestId ? null : invoice.requestId)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-surface-200">
                    <FileText className={cn("w-4 h-4", isAuditor ? "text-slate-400" : "text-brand-blue")} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{invoice.invoiceId}</p>
                    <p className="text-xs text-slate-500">{invoice.requestId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isAuditor ? (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Eye className="w-3 h-3" />
                      Audit view
                    </div>
                  ) : isBuyer ? (
                    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border", statusColor(invoice.status))}>
                      {invoice.status}
                    </span>
                  ) : (
                    <>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-brand-blue/60" />
                        {invoice.bidCount} bid{invoice.bidCount !== 1 ? "s" : ""}
                      </span>
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border", statusColor(invoice.status))}>
                        {invoice.status}
                      </span>
                    </>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3 line-clamp-1">{invoice.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>{formatCurrency(invoice.amount, invoice.currency)}</span>
                <span>Advance: {formatCurrency(invoice.requestedAdvance, invoice.currency)}</span>
                <span>Due {formatDate(invoice.dueDate)}</span>
                <span>{invoice.supplier.split("::")[0] || invoice.supplier.slice(0, 15)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showNewModal && <NewRequestModal onClose={() => setShowNewModal(false)} />}
    </div>
  );
}

function NewRequestModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (amount && dueDate) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-6 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">New Financing Request</h3>
            <p className="text-xs text-slate-500 mt-0.5">Create an invoice request on the Canton ledger</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-surface-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-brand-blue/8 border border-brand-blue/20 flex items-start gap-3">
            <Lock className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" />
            <p className="text-xs text-slate-400">
              Invoice details will be shared with the Buyer for verification. Financing terms remain private until a bid is accepted.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Invoice Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100,000"
                className="input-field pr-14"
              />
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-slate-400 text-xs font-medium focus:outline-none">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the invoice..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="pt-2">
            <button onClick={handleSubmit} className="btn-primary w-full justify-center">
              <Plus className="w-4 h-4" />
              Submit on Ledger
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
