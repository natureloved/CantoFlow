export const PARTIES = {
  Supplier: 'Supplier::1220a8f4c...supplier',
  Buyer: 'Buyer::1220a8f4c...buyer',
  LenderA: 'LenderA::1220a8f4c...lender-a',
  LenderB: 'LenderB::1220a8f4c...lender-b',
  LenderC: 'LenderC::1220a8f4c...lender-c',
  Auditor: 'Auditor::1220a8f4c...auditor'
} as const;

export const ROLES: Record<string, { party: string; label: string; icon: string; color: string }> = {
  supplier: { party: PARTIES.Supplier, label: 'Supplier', icon: 'Factory', color: 'bg-blue-500' },
  lender_a: { party: PARTIES.LenderA, label: 'Lender A', icon: 'Landmark', color: 'bg-emerald-500' },
  lender_b: { party: PARTIES.LenderB, label: 'Lender B', icon: 'Landmark', color: 'bg-violet-500' },
  lender_c: { party: PARTIES.LenderC, label: 'Lender C', icon: 'Landmark', color: 'bg-amber-500' },
  buyer: { party: PARTIES.Buyer, label: 'Buyer', icon: 'Building2', color: 'bg-rose-500' },
  auditor: { party: PARTIES.Auditor, label: 'Auditor', icon: 'ShieldCheck', color: 'bg-slate-400' }
};

export const CURRENT_ROLE = 'supplier';

export const InvoiceRequestStatus = {
  Pending: 'Pending',
  Verified: 'Verified',
  Bidding: 'Bidding',
  Accepted: 'Accepted',
  Funded: 'Funded',
  Repaid: 'Repaid'
} as const;

export const BidStatus = {
  Submitted: 'Submitted',
  Revealed: 'Revealed',
  Accepted: 'Accepted',
  Rejected: 'Rejected'
} as const;

export const AgreementStatus = {
  Active: 'Active',
  Repaid: 'Repaid',
  Defaulted: 'Defaulted'
} as const;

export type RequestStatus = keyof typeof InvoiceRequestStatus;
export type BidStatusKey = keyof typeof BidStatus;
export type AgreementStatusKey = keyof typeof AgreementStatus;
