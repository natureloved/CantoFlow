export interface InvoiceRequest {
  requestId: string;
  supplier: string;
  buyer: string;
  invoiceId: string;
  amount: number;
  currency: string;
  dueDate: string;
  requestedAdvance: number;
  status: string;
  invitedLenders: string[];
  auditor: string;
  createdAt?: string;
}

export interface BuyerConfirmation {
  confirmationId: string;
  invoiceRequestCid: string;
  supplier: string;
  buyer: string;
  confirmedAmount: number;
  confirmedDueDate: string;
  status: string;
  notes: string;
  createdAt?: string;
}

export interface FinancingBid {
  bidId: string;
  invoiceRequestCid: string;
  supplier: string;
  lender: string;
  offerAmount: number;
  feeRate: number;
  expiry: string;
  status: string;
  submittedAt?: string;
}

export interface FundingAgreement {
  agreementId: string;
  invoiceRequestCid: string;
  supplier: string;
  lender: string;
  buyer: string;
  principal: number;
  feeRate: number;
  repaymentAmount: number;
  maturityDate: string;
  status: string;
  createdAt?: string;
  repaidAt?: string;
}

export interface AuditAccessGrant {
  grantId: string;
  grantor: string;
  grantee: string;
  dealReference: string;
  scope: string[];
  expiry: string;
  status: string;
  createdAt?: string;
}

export interface WorkflowEvent {
  eventId: string;
  eventType: string;
  requestId: string;
  party: string;
  metadata: string;
  timestamp: string;
}

export interface RoleConfig {
  party: string;
  label: string;
  icon: string;
  color: string;
}

export type RequestStatus = "Pending" | "Verified" | "Bidding" | "Accepted" | "Funded" | "Repaid";
export type BidStatusType = "Submitted" | "Revealed" | "Accepted" | "Rejected" | "Expired";
export type AgreementStatusType = "Active" | "Repaid" | "Defaulted";
export type ConfirmationStatusType = "Pending" | "Confirmed" | "Disputed";

export interface DashboardStats {
  totalInvoices: number;
  totalBids: number;
  totalAgreements: number;
  activeBids: number;
  expectedRepayment: number;
  lenderCount: number;
}
