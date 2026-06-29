import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Factory,
  Landmark,
  Building2,
  ShieldCheck,
  FileText,
  BarChart3,
  Award,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";
import { ROLES, CURRENT_ROLE } from "../data/seed";
import { cn } from "../lib/utils";

const navItems: Record<string, { href: string; label: string; icon: any }[]> = {
  supplier: [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/invoices", label: "Invoices", icon: FileText },
    { href: "/bids", label: "My Bids", icon: Award },
    { href: "/agreements", label: "Agreements", icon: FileText },
    { href: "/audit", label: "Audit", icon: ShieldCheck },
  ],
  lender_a: [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/invoices", label: "Marketplace", icon: FileText },
    { href: "/bids", label: "My Bids", icon: Award },
  ],
  lender_b: [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/invoices", label: "Marketplace", icon: FileText },
    { href: "/bids", label: "My Bids", icon: Award },
  ],
  lender_c: [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/invoices", label: "Marketplace", icon: FileText },
    { href: "/bids", label: "My Bids", icon: Award },
  ],
  buyer: [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/invoices", label: "My Invoices", icon: FileText },
    { href: "/agreements", label: "Agreements", icon: FileText },
  ],
  auditor: [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/audit", label: "Audit Trail", icon: ShieldCheck },
    { href: "/agreements", label: "Agreements", icon: FileText },
  ],
};

export function Sidebar({
  isOpen,
  onClose,
  role,
  setParty,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  setParty: (r: string) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = navItems[role] || navItems.supplier;
  const roleConfig = ROLES[CURRENT_ROLE];

  const handleSignOut = () => {
    setParty("supplier");
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          width: isOpen ? 280 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 h-full z-40 lg:z-0 lg:translate-x-0 lg:w-64 glass-panel lg:static lg:opacity-100 flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">CantoFlow</h1>
              <p className="text-xs text-slate-500">Invoice Financing</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Navigation
          </p>
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-brand-blue/15 text-white shadow-inner border border-brand-blue/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-brand-blue" />}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700/40">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", (roleConfig?.color || "bg-surface-100") + " text-white")}>
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{roleConfig?.label || role}</p>
              <p className="text-xs text-slate-500 truncate font-mono">
                {(roleConfig?.party || "").slice(0, 20)}…
              </p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs text-slate-500 px-2 mb-1.5">Switch Role</p>
            <div className="grid grid-cols-3 gap-1">
              {Object.entries(ROLES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setParty(key)}
                  className={cn(
                    "px-2 py-1.5 text-[10px] font-medium rounded-md border transition-all",
                    role === key
                      ? "bg-white/10 text-white border-white/20"
                      : "text-slate-400 border-transparent hover:bg-slate-800/50"
                  )}
                >
                  {config.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export function Navbar({
  onMenuClick,
  party,
  onRoleChange,
}: {
  onMenuClick: () => void;
  party: string;
  onRoleChange: (r: string) => void;
}) {
  const roleConfig = ROLES[CURRENT_ROLE];

  return (
    <header className="h-14 glass-panel border-t-0 border-x-0 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 bg-surface-400/80 backdrop-blur-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden lg:flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full", roleConfig?.color || "bg-brand-blue")} />
          <span className="text-sm font-semibold text-white">{roleConfig?.label || "Supplier"}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-200/60 border border-slate-700/40 text-xs text-slate-400 font-mono">
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          Canton Network
        </div>

        <select
          onChange={(e) => onRoleChange(e.target.value)}
          value={CURRENT_ROLE}
          className="bg-surface-200 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        >
          <option value="supplier">Supplier</option>
          <option value="lender_a">Lender A</option>
          <option value="lender_b">Lender B</option>
          <option value="lender_c">Lender C</option>
          <option value="buyer">Buyer</option>
          <option value="auditor">Auditor</option>
        </select>
      </div>
    </header>
  );
}
