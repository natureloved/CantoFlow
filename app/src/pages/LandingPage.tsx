import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Shield, Zap, Factory, Landmark, Building2, ShieldCheck, FileText, Award, ArrowDownRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROLES, CURRENT_ROLE } from "../data/seed";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-400 flex flex-col">
      <header className="h-14 glass-panel border-t-0 border-x-0 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 bg-surface-400/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">CantoFlow</h1>
            <p className="text-[10px] text-slate-500">Invoice Financing on Canton</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="btn-ghost">Launch App →</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-8">
              <Lock className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-medium text-brand-blue">Privacy-Enforced Smart Contracts on Canton</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6">
              Invoice Financing<br />
              <span className="bg-gradient-to-r from-brand-blue via-brand-teal to-brand-purple bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Without Compromise</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
              CantoFlow enables suppliers, lenders, buyers, and auditors to collaborate on invoice financing — 
              while Canton's Daml contracts ensure each party sees only what they're meant to see.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/" className="btn-primary text-base px-8 py-3">
                Launch Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="btn-secondary text-base px-8 py-3">
                View Architecture
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-rose-500/15"><Building2 className="w-5 h-5 text-rose-400" /></div>
                <h3 className="text-lg font-semibold text-white">How Traditional Invoice Financing Fails</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /><span>Central intermediaries see all commercial terms</span></li>
                <li className="flex items-start gap-3 text-sm text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /><span>Competing lenders see each other's bids (rate leakage)</span></li>
                <li className="flex items-start gap-3 text-sm text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /><span>Buyers see financing terms they shouldn't</span></li>
                <li className="flex items-start gap-3 text-sm text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" /><span>Privacy is bolted on with access-control middleware</span></li>
              </ul>
            </div>

            <div className="glass-card p-8 border-brand-blue/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-brand-blue/15"><Shield className="w-5 h-5 text-brand-blue" /></div>
                <h3 className="text-lg font-semibold text-white">How CantoFlow Solves It</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" /><span><strong className="text-white">Contract-level isolation</strong> — each FinancingBid is a separate Daml contract</span></li>
                <li className="flex items-start gap-3 text-sm text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" /><span><strong className="text-white">No cross-leakage</strong> — LenderA cannot see LenderB's bid at the ledger level</span></li>
                <li className="flex items-start gap-3 text-sm text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" /><span><strong className="text-white">Selective disclosure</strong> — AuditAccessGrant grants scoped visibility without exposing contracts</span></li>
                <li className="flex items-start gap-3 text-sm text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" /><span><strong className="text-white">Privacy by design</strong> — enforced in Daml, not application middleware</span></li>
              </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-2">Four Roles. One Workflow. Clear Boundaries.</h2>
            <p className="text-sm text-slate-400 text-center mb-10 max-w-2xl mx-auto">Each party has a legitimate, role-specific view of the same financing workflow. Canton's Daml privacy model makes this guarantee.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { role: "supplier", icon: Factory, color: "bg-brand-blue", title: "Supplier", desc: "Sees all bids on their invoices. Creates requests, invites lenders, accepts the best offer.", sees: "All bids, buyer confirmations, agreement status", cantSee: "Nothing — full visibility" },
                { role: "lender_a", icon: Landmark, color: "bg-emerald-500", title: "Lender", desc: "Sees only their own bid. Submits confidential offers without seeing competitor pricing.", sees: "Own bid, win/loss state, accepted agreement", cantSee: "Other lenders' bids or rates" },
                { role: "buyer", icon: Building2, color: "bg-rose-500", title: "Buyer", desc: "Verifies invoice amount and due date. Knows their invoice was financed but not the terms.", sees: "Invoice amount, due date, confirmation status", cantSee: "Lender bids, financing rates, fee terms" },
                { role: "auditor", icon: ShieldCheck, color: "bg-slate-400", title: "Auditor", desc: "Read-only workflow history via delegated scope. Verifies process integrity without seeing secrets.", sees: "WorkflowEvent timeline, state transitions", cantSee: "Invoice amounts, bid details, rates" },
              ].map((item) => (
                <div key={item.role} className="glass-card p-5 group hover:border-slate-600/60 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-4`}><item.icon className="w-5 h-5 text-white" /></div>
                  <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{item.desc}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] text-emerald-400 mb-1 uppercase tracking-wider font-medium">Sees</p>
                      <p className="text-xs text-slate-300">{item.sees}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-rose-400 mb-1 uppercase tracking-wider font-medium">Cannot See</p>
                      <p className="text-xs text-slate-500">{item.cantSee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Why Canton?</h2>
              <p className="text-sm text-slate-400 mb-6 max-w-lg">Canton's Daml smart contract model is not just "another blockchain." It's purpose-built for multi-party workflows where privacy is a requirement, not an afterthought.</p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-surface-300 shrink-0"><Zap className="w-5 h-5 text-brand-blue" /></div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Contract-Level Privacy</h4>
                    <p className="text-xs text-slate-400 mt-1">Each FinancingBid exists as a separate contract. Canton's sync protocol ensures LenderA's node never sees LenderB's contract — impossible by design.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-surface-300 shrink-0"><EyeOff className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Selective Disclosure</h4>
                    <p className="text-xs text-slate-400 mt-1">AuditAccessGrant provides fine-grained, revocable visibility to the auditor. No contract is exposed — only its state transitions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-surface-300 shrink-0"><Lock className="w-5 h-5 text-violet-400" /></div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Composable Workflows</h4>
                    <p className="text-xs text-slate-400 mt-1">Templates compose naturally: InvoiceRequest → BuyerConfirmation → FinancingBid → FundingAgreement. Each enforces its own signatory rules.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Canton Privacy Model</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-surface-200/50 flex items-center gap-3">
                  <div className="w-2 h-2 bg-brand-blue rounded-full" />
                  <div className="flex-1 text-xs text-slate-300">InvoiceRequest signatories: <span className="font-mono text-white">supplier + buyer</span></div>
                </div>
                <div className="p-3 rounded-xl bg-surface-200/50 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <div className="flex-1 text-xs text-slate-300">FinancingBid signatories: <span className="font-mono text-white">supplier + one lender</span></div>
                </div>
                <div className="p-3 rounded-xl bg-surface-200/50 flex items-center gap-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full" />
                  <div className="flex-1 text-xs text-slate-300">FundingAgreement signatories: <span className="font-mono text-white">supplier + lender + buyer</span></div>
                </div>
                <div className="p-3 rounded-xl bg-surface-200/50 flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  <div className="flex-1 text-xs text-slate-300">AuditAccessGrant: <span className="font-mono text-white">delegated observer scope</span></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/40">
                <p className="text-xs text-slate-500">Result: each Daml template enforces visibility at the contract level. Frontend simply reveals what the ledger allows.</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to See Canton Privacy in Action?</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6">Switch between Supplier, Lender, Buyer, and Auditor roles to experience how the same workflow looks fundamentally different to each party — enforced by smart contracts.</p>
            <Link to="/" className="btn-primary text-base px-8 py-3">
              Launch Interactive Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
