import { motion } from "framer-motion";
import { ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { SEED_EVENTS } from "../data/seed";
import { formatDate, formatDuration } from "../lib/utils";
import { cn } from "../lib/utils";

export function AuditPage() {
  const events = SEED_EVENTS;

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-slate-400/15">
            <ShieldCheck className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Audit Log</h1>
            <p className="text-sm text-slate-500 mt-0.5">Read-only workflow history · Canton dynamic disclosure</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-slate-400 mb-2">Scope Granted</h3>
          <p className="text-sm text-white font-medium">InvoiceRequest</p>
          <p className="text-sm text-white font-medium">FundingAgreement</p>
          <p className="text-sm text-white font-medium">WorkflowEvent</p>
          <div className="mt-3 pt-3 border-t border-slate-700/40">
            <p className="text-xs text-slate-500">Granted by: <span className="text-slate-300">Supplier</span></p>
            <p className="text-xs text-slate-500">Grantee: <span className="text-slate-300">Auditor</span></p>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-slate-400 mb-3">Event Count</h3>
          <p className="text-3xl font-bold text-white">{events.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total workflow events visible in audit scope</p>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-slate-400 mb-3">Audit Status</h3>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Complete</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">All key events captured with cryptographically verifiable signatures</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Workflow Event Timeline</h3>
          <span className="text-xs text-slate-500">Uneditable · Auditor-only access</span>
        </div>

        <div className="space-y-2">
          {events.map((ev, i) => (
            <div key={ev.eventId} className="flex items-start gap-4">
              <div className="flex flex-col items-center shrink-0 mt-1">
                <div className={cn("w-3 h-3 rounded-full", i === 0 ? "bg-brand-blue shadow-[0_0_8px_rgba(79,144,255,0.5)]" : "bg-emerald-400")} />
                {i < events.length - 1 && <div className="w-0.5 h-full bg-slate-700/60 mt-1" />}
              </div>
              <div className="flex-1 min-w-0 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-brand-blue/80">{ev.eventId}</span>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", statusColor(ev.eventType))}>
                    {ev.eventType}
                  </span>
                  <span className="text-xs text-slate-500">via {ev.party}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{ev.metadata}</p>
                <p className="text-[10px] text-slate-600 mt-1 font-mono">Request: {ev.requestId}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-400">{formatDate(ev.timestamp)}</p>
                <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                  {new Date(ev.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
