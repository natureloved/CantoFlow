import { InvoiceRequest, FinancingBid, FundingAgreement, WorkflowEvent, RoleConfig, RequestStatus, BidStatusType, AgreementStatusType, DashboardStats } from "../types";

export const PARTIES = {
  Supplier: "Supplier::1220a8f4c...supplier",
  Buyer: "Buyer::1220a8f4c...buyer",
  LenderA: "LenderA::1220a8f4c...lender-a",
  LenderB: "LenderB::1220a8f4c...lender-b",
  LenderC: "LenderC::1220a8f4c...lender-c",
  Auditor: "Auditor::1220a8f4c...auditor",
} as const;

export const ROLES: Record<string, RoleConfig> = {
  supplier: { party: PARTIES.Supplier, label: "Supplier", icon: "Factory", color: "bg-brand-blue" },
  lender_a: { party: PARTIES.LenderA, label: "Lender A", icon: "Landmark", color: "bg-emerald-500" },
  lender_b: { party: PARTIES.LenderB, label: "Lender B", icon: "Landmark", color: "bg-violet-500" },
  lender_c: { party: PARTIES.LenderC, label: "Lender C", icon: "Landmark", color: "bg-amber-500" },
  buyer: { party: PARTIES.Buyer, label: "Buyer", icon: "Building2", color: "bg-rose-500" },
  auditor: { party: PARTIES.Auditor, label: "Auditor", icon: "ShieldCheck", color: "bg-slate-400" },
};

export const CURRENT_ROLE = "supplier";

export const SEED_INVOICES: InvoiceRequest[] = [
  {
    requestId: "REQ-001",
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceNumber: "INV-2026-001",
    amount: 100000.0,
    currency: "USD",
    dueDate: "2026-09-01",
    description: "Raw materials invoice for Q3 production — 500 units grade-A steel",
    status: "Bidding",
    createdAt: "2026-06-29T10:00:00Z",
  },
  {
    requestId: "REQ-002",
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceNumber: "INV-2026-002",
    amount: 25000.0,
    currency: "USD",
    dueDate: "2026-07-15",
    description: "Consulting services — blockchain architecture advisory",
    status: "Verified",
    createdAt: "2026-06-28T14:30:00Z",
  },
  {
    requestId: "REQ-003",
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceNumber: "INV-2026-003",
    amount: 480000.0,
    currency: "USD",
    dueDate: "2026-10-01",
    description: "Enterprise SaaS platform licensing — annual renewal",
    status: "Pending",
    createdAt: "2026-06-30T08:00:00Z",
  },
];

export const SEED_BIDS: FinancingBid[] = [
  {
    bidId: "BID-A",
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderA,
    requestId: "REQ-001",
    interestRate: 0.08,
    advanceRate: 0.85,
    feeAmount: 1250.0,
    maturityDays: 90,
    status: "Revealed",
    submittedAt: "2026-06-29T10:05:00Z",
  },
  {
    bidId: "BID-B",
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderB,
    requestId: "REQ-001",
    interestRate: 0.065,
    advanceRate: 0.90,
    feeAmount: 1000.0,
    maturityDays: 75,
    status: "Accepted",
    submittedAt: "2026-06-29T10:08:00Z",
  },
  {
    bidId: "BID-C",
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderC,
    requestId: "REQ-001",
    interestRate: 0.07,
    advanceRate: 0.88,
    feeAmount: 1100.0,
    maturityDays: 80,
    status: "Revealed",
    submittedAt: "2026-06-29T10:12:00Z",
  },
];

export const SEED_AGREEMENT: FundingAgreement = {
  agreementId: "AG-REQ-001",
  supplier: PARTIES.Supplier,
  lender: PARTIES.LenderB,
  buyer: PARTIES.Buyer,
  requestId: "REQ-001",
  bidId: "BID-B",
  amount: 100000.0,
  currency: "USD",
  interestRate: 0.065,
  advanceRate: 0.90,
  feeAmount: 1000.0,
  maturityDate: "2026-10-25",
  status: "Active",
  createdAt: "2026-06-29T14:00:00Z",
};

export const SEED_EVENTS: WorkflowEvent[] = [
  { eventId: "EVT-001", eventType: "InvoiceCreated", requestId: "REQ-001", party: PARTIES.Supplier, metadata: "Invoice INV-2026-001 created for $100,000 USD", timestamp: "2026-06-29T10:00:00Z" },
  { eventId: "EVT-002", eventType: "InvoiceConfirmed", requestId: "REQ-001", party: PARTIES.Buyer, metadata: "Buyer confirmed amount and due date", timestamp: "2026-06-29T10:15:00Z" },
  { eventId: "EVT-003", eventType: "BidSubmitted", requestId: "REQ-001", party: PARTIES.LenderA, metadata: "LenderA submitted BID-A at 8.0%", timestamp: "2026-06-29T10:20:00Z" },
  { eventId: "EVT-004", eventType: "BidSubmitted", requestId: "REQ-001", party: PARTIES.LenderB, metadata: "LenderB submitted BID-B at 6.5%", timestamp: "2026-06-29T10:22:00Z" },
  { eventId: "EVT-005", eventType: "BidSubmitted", requestId: "REQ-001", party: PARTIES.LenderC, metadata: "LenderC submitted BID-C at 7.0%", timestamp: "2026-06-29T10:25:00Z" },
  { eventId: "EVT-006", eventType: "BidAccepted", requestId: "REQ-001", party: PARTIES.Supplier, metadata: "Accepted BID-B from LenderB at 6.5%", timestamp: "2026-06-29T11:00:00Z" },
  { eventId: "EVT-007", eventType: "AgreementCreated", requestId: "REQ-001", party: PARTIES.Supplier, metadata: "Funding Agreement AG-REQ-001 created", timestamp: "2026-06-29T11:05:00Z" },
  { eventId: "EVT-008", eventType: "AuditAccessGranted", requestId: "REQ-001", party: PARTIES.Supplier, metadata: "Auditor granted workflow visibility", timestamp: "2026-06-29T12:00:00Z" },
];

export const SEED_STATS: DashboardStats = {
  totalInvoices: 3,
  totalBids: 3,
  totalAgreements: 1,
  activeBids: 2,
  expectedRepayment: 90000.0,
  lenderCount: 3,
};

export const STATUS_FLOW: Record<RequestStatus, string> = {
  Pending: "0",
  Verified: "1",
  Bidding: "2",
  Accepted: "3",
  Funded: "4",
  Repaid: "5",
};
