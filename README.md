# CantoFlow

**Private Invoice Financing Marketplace on Canton**

CantoFlow demonstrates how [Canton Network](https://canton.network)'s Daml smart contract privacy model enables a trusted, multi-party invoice financing workflow — without exposing sensitive commercial data between lenders, buyers, and suppliers.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Canton Ledger                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │ Invoice  │  │ Financing│  │ Funding  │  │ AuditAccess  │    │
│  │ Request  │◄─┤   Bid    │◄─┤    Agreement│  │   Grant     │    │
│  │(Supp+Buy)│  │(Sup+Lndr)│  │(Sup+Lnd+Buy)│ │(Agnc→Auditor)│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │
│       ▲              ▲              ▲                ▲           │
│ Canton Privacy Model:                                         │
│  • Each FinancingBid is a SEPARATE contract                    │
│  • LenderA cannot see LenderB's bid (no cross-leakage)       │
│  • Buyer sees invoice details, not financing terms             │
│  • Auditor gets delegated read access (dynamic disclosure)    │
└──────────────────────────────────────────────────────────────────┘
                            ▲
                            │ Ledger API
                            │
                    ┌───────┴────────┐
                    │  Backend (Node.js) │
                    │  Express + REST API │
                    └───────┬────────┘
                            │
                    ┌───────┴────────┐
                    │  Frontend (React) │
                    │  Role-switched   │
                    │  Dashboards       │
                    └─────────────────┘
```

---

## Roles

| Role | Party | What they see | What they CAN'T see |
|------|-------|---------------|---------------------|
| **Supplier** | Supplier | All invoices, ALL bids on their invoices, FundingAgreement, Audit events | Nothing — full visibility |
| **Lender A/B/C** | Individual lender | ONLY their own FinancingBid, invoice amount | OTHER lenders' bids, other lenders' rates/fees |
| **Buyer** | Buyer | Invoice amount, due date, FundingAgreement (signatory) | Individual lender bids, financing terms |
| **Auditor** | Auditor | WorkflowEvent timeline, AuditAccessGrant scope | Invoice amounts, bid details, financing rates |

---

## Daml Contract Model

Canto privacy is enforced **at the Daml contract level**, not in frontend code:

1. **`InvoiceRequest`** — Signatories: `{supplier, buyer}`. Buyer can confirm the invoice detailing amount and due date.
2. **`FinancingBid`** — Signatories: `{supplier, lenderX}`. ONE contract per lender. Canton ensures that only the supplier's node and that lender's node hold this contract. No cross-contract visibility.
3. **`FundingAgreement`** — Signatories: `{supplier, lender, buyer}`. Final funded state visible to all three businesses.
4. **`AuditAccessGrant`** — Signatory: `supplier`. Explicitly delegates audit scope to the `auditor` party.
5. **`WorkflowEvent`** — Signatory: `supplier`, Observer: `auditor`. Append-only log for compliance tracking.

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
2. Buyer confirms invoice (amount + due date)
3. Three lenders submit confidential FinancingBid contracts (contract-level isolation)
4. Supplier accepts LenderB's best bid
5. FundingAgreement created (supplier + lender + buyer as signatories)
6. Auditor granted scope + WorkflowEvents created
7. Privacy assertions:
   - Supplier sees 3 bids
   - Lender A sees only 1 bid
   - Lender B sees only 1 bid
   - Auditor sees workflow events

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=3001
```

### Frontend (`app/.env`)
```
VITE_API_URL=http://localhost:3001
```

---

## Vercel Deployment

```bash
# Frontend only — deploy app/ as standalone Vite app
cd app
npm run build
npx vercel deploy dist/
```

Set environment variable:
- `VITE_API_URL` = your backend URL (Canton Ledger API endpoint)

---

## Why Canton?

Traditional invoice financing requires central intermediaries — factors, payment processors, or custom clearing houses — that create counterparty risk and expose commercial terms.

Canton solves this by:

1. **Contract-level privacy** — Daml's signatory model means Lender A's bid contract literally does not exist on Lender B's node
2. **Selective disclosure** — AuditAccessGrant provides fine-grained, revocable visibility without revealing contracts
3. **Immutable consensus** — All state transitions are validated by the Canton ledger
4. **Composable workflows** — Templates compose: an InvoiceRequest carries through to FundingAgreement

The demonstration proves that **Canton is uniquely suitable**: the Daml model means privacy is baked into the contract design, not bolted onto the application layer with access control middleware.

---

## License

MIT — built for the Canton hackathon.
