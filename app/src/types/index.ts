export interface InvoiceRequest {
  requestId: string;
  supplier: string;
  buyer: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  description: string;
  status: string;
  createdAt?: string;
}

export interface FinancingBid {
  bidId: string;
  supplier: string;
  lender: string;
  requestId: string;
  interestRate: number;
  advanceRate: number;
  feeAmount: number;
  maturityDays: number;
  status: string;
  submittedAt?: string;
}

export interface FundingAgreement {
  agreementId: string;
  supplier: string;
  lender: string;
  buyer: string;
  requestId: string;
  bidId: string;
  amount: number;
  currency: string;
  interestRate: number;
  advanceRate: number;
  feeAmount: number;
  maturityDate: string;
  status: string;
  createdAt?: string;
  repaidAt?: string;
}

export interface WorkflowEvent {
  eventId: string;
  eventType: string;
  requestId: string;
  party: string;
  metadata: string;
  timestamp: string;
}

export interface AuditAccessGrant {
  grantId: string;
  supplier: string;
  buyer: string;
  lender: string;
  auditor: string;
  scope: string[];
  createdAt: string;
}

export interface RoleConfig {
  party: string;
  label: string;
  icon: string;
  color: string;
}

export type RequestStatus = "Pending" | "Verified" | "Bidding" | "Accepted" | "Funded" | "Repaid";
export type BidStatusType = "Submitted" | "Revealed" | "Accepted" | "Rejected";
export type AgreementStatusType = "Active" | "Repaid" | "Defaulted";

export interface DashboardStats {
  totalInvoices: number;
  totalBids: number;
  totalAgreements: number;
  activeBids: number;
  expectedRepayment: number;
  lenderCount: number;
}
