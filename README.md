# CantoFlow

**Private Invoice Financing Marketplace on Canton**

CantoFlow demonstrates how [Canton Network](https://canton.network)'s Daml smart contract privacy model enables a trusted, multi-party invoice financing workflow — without exposing sensitive commercial data between lenders, buyers, and suppliers.

---

## Final Architecture

```text
Frontend (React/Vite)
    ↓
Backend API / orchestration layer
    ↓
Canton / Daml Ledger API or JSON API
    ↓
Daml smart contracts on participant-hosted parties
```

---

## Architecture Summary

CantoFlow is a multi-party financial workflow application with a web frontend, a lightweight backend orchestration layer, and Daml smart contracts running on Canton.

**The architecture must make one thing obvious: privacy is enforced in the contract/ledger model, not merely hidden in the frontend.**

---

## Frontend Architecture

### Stack
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- TanStack Query
- Recharts
- Lucide icons

### Modules
- **Pages**: Landing, SupplierDashboard, LenderDashboard, BuyerDashboard, AuditorDashboard
- **Shared**: PartySwitcher, PrivacyBanner, StatCard, Modal, Button, Timeline, TransactionStream
- **Domain**: InvoiceCard, NewInvoiceModal, BidCard, BidList, BidsModal, LoanCard, VerificationPanel, AuditLogTable

### Responsibilities
- Render role-specific data
- Explain visibility boundaries
- Submit user actions to backend / ledger API
- Display workflow status and events
- Animate privacy and state changes

### Must NOT do
- Enforce privacy
- Decide who can see what
- Own core business rules

---

## Backend Architecture

### Stack
- Node.js
- TypeScript
- Express
- (Optional) Prisma + Postgres for read models

### Responsibilities
- Party lookup and session bootstrap
- Auth/token handling for demo mode
- Lightweight orchestration of frontend requests to ledger
- Optional read model aggregation
- Seeding demo data
- Optional event projection for easier UI reads

### Must NOT own
- Core business logic — all financing workflow rules remain in Daml

### Modules
- `auth.ts`
- `parties.ts`
- `invoices.ts`
- `bids.ts`
- `agreements.ts`
- `audit.ts`
- `seed.ts`
- `ledgerClient.ts`

---

## Daml Smart Contract Architecture

### Design Principle
Use separate templates for each workflow stage, not one giant mutable record.

### Templates

#### 1. `InvoiceRequest`
Represents a financing request created by the supplier.

**Fields:**
- `supplier` — Party
- `buyer` — Party
- `invoiceId` — Text
- `amount` — Decimal
- `currency` — Text
- `dueDate` — Date
- `requestedAdvance` — Decimal
- `status` — InvoiceRequestStatus
- `invitedLenders` — Set Party
- `auditor` — Party (optional observer)

**Choices:**
- `InviteLenders` — Controller: supplier
- `CancelRequest` — Controller: supplier
- `SubmitForBuyerVerification` — Controller: supplier
- `AcceptBid` — Controller: supplier

#### 2. `BuyerConfirmation`
Represents buyer validation. Separate template so buyer does not see financing terms.

**Fields:**
- `invoiceRequestCid` — ContractId InvoiceRequest
- `supplier` — Party
- `buyer` — Party
- `confirmedAmount` — Decimal
- `confirmedDueDate` — Date
- `status` — ConfirmationStatus
- `notes` — Text

**Choices:**
- `ConfirmInvoice` — Controller: buyer
- `RaiseDispute` — Controller: buyer

#### 3. `FinancingBid`
Represents a confidential lender offer.

**Fields:**
- `invoiceRequestCid` — ContractId InvoiceRequest
- `supplier` — Party
- `lender` — Party
- `offerAmount` — Decimal
- `feeRate` — Decimal
- `expiry` — Date
- `status` — BidStatus

**Choices:**
- `WithdrawBid` — Controller: lender
- `ExpireBid` — Controller: supplier
- `MarkAccepted` — Controller: supplier

#### 4. `FundingAgreement`
Created when supplier accepts a bid.

**Fields:**
- `invoiceRequestCid` — ContractId InvoiceRequest
- `supplier` — Party
- `lender` — Party
- `buyer` — Party
- `principal` — Decimal
- `feeRate` — Decimal
- `repaymentAmount` — Decimal
- `maturityDate` — Date
- `status` — AgreementStatus

**Choices:**
- `RecordFunding` — Controller: supplier
- `ScheduleRepayment` — Controller: supplier
- `MarkRepaid` — Controller: supplier
- `FlagIssue` — Controller: supplier

#### 5. `AuditAccessGrant`
Optional helper for scoped disclosure.

**Fields:**
- `grantor` — Party
- `grantee` — Party
- `dealReference` — ContractId InvoiceRequest
- `scope` — Set Text
- `expiry` — Date
- `status` — AuditGrantStatus

**Choices:**
- `RevokeGrant` — Controller: grantor

---

## Role Visibility Matrix

### Supplier Sees
- Own invoice requests
- All bids on their own invoices
- Selected lender identity and offer terms
- Buyer confirmation status
- Funding agreement for accepted bid
- Own audit history

### Lender Sees
- Invoices they are invited to
- Only their own bid submissions
- Whether their bid is pending / won / not selected
- Accepted agreement if they win
- **No** competitor pricing

### Buyer Sees
- Invoice amount
- Due date
- Supplier identity (if intended in workflow)
- Ability to confirm or dispute
- **No** lender competition data
- **No** sealed bid terms

### Auditor Sees
- Permissioned deal history
- Timeline of financing events
- Read-only states
- **No** mutation controls
- Only approved scope of sensitive commercial data

---

## API Design

### Key Frontend Actions

**Supplier**
- `createInvoiceRequest`
- `inviteLenders`
- `listMyInvoices`
- `listBidsForInvoice`
- `acceptBid`

**Lender**
- `listInvitedInvoices`
- `submitBid`
- `listMyBids`

**Buyer**
- `listInvoicesPendingVerification`
- `confirmInvoice`
- `disputeInvoice`

**Auditor**
- `listAuthorizedDeals`
- `getDealAuditLog`
- `getPermissionMatrix`

### Response Design Principle
The API returns data already shaped for the user's role.

Examples:
- Supplier gets all bids for own invoice
- Lender gets only own bids
- Buyer gets only verification fields
- Auditor gets read-only event view

---

## Read Model Strategy

### Option A — Direct Ledger Reads
Fastest for pure demo if data model is simple.

### Option B — Projected Read Model
Better UX if you need aggregated dashboards.

### Hackathon Recommendation
- Direct reads for core workflow
- Optional lightweight projection for summary cards and timelines

---

## Demo Seed Data Architecture

- 1 supplier party
- 3 lender parties
- 1 buyer party
- 1 auditor party
- 2 invoice requests (1 active bidding, 1 verified)
- 3 bids on one active invoice
- 1 previously funded agreement
- 1 buyer confirmation
- 1 audit access grant

This gives enough data for every dashboard to feel alive.

---

## Deployment Strategy

### Dev Mode
- Local Daml sandbox / Canton setup
- Local backend
- Local Vite frontend

### Demo Mode
- Pre-seeded ledger state
- Hosted frontend
- Stable demo data
- Optional mocked backend fallback if ledger unavailable

### Critical Requirement
Have a fallback recorded demo even if live product exists.

---

## Principle to Say on Stage

> CantoFlow uses Canton to enforce who can see what at the ledger level, so the frontend is simply revealing each party's legitimate view of the workflow rather than simulating privacy in the UI.

---

## Setup

### Prerequisites
- Node.js ≥ 18
- Daml SDK 2.9.8 (`daml install --sdkver 2.9.8`)
- (Optional) Canton Sandbox for full ledger testing

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd app
npm install
npm run dev
```

### Daml Tests
```bash
cd daml
daml install --sdkver 2.9.8
daml build
daml test
```

---

## Run Happy-Path Test

The Daml test `CantoFlow.Main.Test.testHappyPath` validates:

1. Supplier creates InvoiceRequest
2. Supplier invites lenders
3. Buyer confirms invoice (separate BuyerConfirmation template)
4. Three lenders submit confidential FinancingBid contracts
5. Supplier accepts best bid
6. FundingAgreement created
7. Auditor granted scope + WorkflowEvents created
8. Privacy assertions:
   - Supplier sees 3 bids
   - Lender A sees only 1 bid
   - Lender B sees only 1 bid
   - Auditor sees workflow events
9. Mark agreement as repaid

---

## Vercel Deployment

```bash
cd app
npm run build
npx vercel deploy dist/
```

Environment variable:
- `VITE_API_URL` = your backend URL

---

## License

MIT — built for the Canton hackathon.
