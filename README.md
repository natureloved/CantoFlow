# CantoFlow

**Private Invoice Financing Marketplace on Canton**

CantoFlow demonstrates how [Canton Network](https://canton.network)'s Daml smart contract privacy model enables a trusted, multi-party invoice financing workflow — without exposing sensitive commercial data between lenders, buyers, and suppliers.

---

## What This Is

A working demo of a 4-role invoice financing workflow where **privacy is enforced at the smart contract level**, not just hidden in the UI.

**The demo flow:**
1. Supplier creates invoice financing request
2. Buyer verifies invoice amount and due date
3. Three lenders submit confidential bids (each bid is a separate contract)
4. Supplier opens and compares bids privately
5. Supplier accepts one bid
6. Funding agreement is created
7. Auditor reviews workflow integrity via selective disclosure

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · Vite · TypeScript · Tailwind CSS · Framer Motion · TanStack Query · Recharts |
| Backend | Node.js · TypeScript · Express |
| Smart Contracts | Daml on Canton |

---

## Architecture

```
Frontend (React/Vite) → Backend API → Canton Ledger API → Daml Contracts
```

**Key Contract Templates:**
- `InvoiceRequest` — Signatories: supplier + buyer
- `BuyerConfirmation` — Separate contract for buyer verification
- `FinancingBid` — ONE contract per lender (signatories: supplier + one lender)
- `FundingAgreement` — Signatories: supplier + lender + buyer
- `AuditAccessGrant` — Delegated scope for auditor
- `WorkflowEvent` — Append-only audit log

**Privacy principle:** Each FinancingBid is a separate Daml contract. LenderA's node never sees LenderB's bid — Canton's sync protocol enforces this. The frontend simply reveals each party's legitimate view.

---

## Run Demo

### Prerequisites
- Node.js ≥ 18

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

Open `http://localhost:5173` and click **Launch Demo**.

---

## Demo Story (2 minutes)

1. You land on the Landing page explaining CantoFlow and why Canton is necessary
2. Click **Launch Demo** → you enter as **Supplier**
3. See 3 active invoices and 3 confidential bids on REQ-001
4. Switch to **Lender A** in the top-right role switcher → you see ONLY Lender A's bid
5. Switch to **Lender B** → you see ONLY Lender B's bid (which was accepted)
6. Switch to **Buyer** → you see invoice verification status, no lender data
7. Switch to **Auditor** → you see a read-only workflow timeline, no commercial data

**The point:** Canton's Daml contracts enforce these visibility boundaries. The UI is just revealing what the ledger already decided.

---

## What We Built (MVP)

### Must Have
- [x] 4 core roles: Supplier, Lender, Buyer, Auditor
- [x] Invoice request creation and listing
- [x] Buyer invoice verification (separate template)
- [x] Confidential bid submission (contract isolation)
- [x] Supplier bid comparison and acceptance
- [x] Funding agreement state
- [x] Auditor read-only workflow review
- [x] Role switcher
- [x] Privacy banners explaining visibility
- [x] Premium dark-mode UI with animated transitions
- [x] Seeded demo data (3 bids, 1 agreement, 1 invoice)

### Deferred to Roadmap
- Insurer / regulator roles
- Multi-currency settlement
- Secondary loan market
- AI assistant
- Real document storage
- Live bank integrations
- KYC automation

---

## Repository Structure

```text
cantoflow/
  daml/
    src/CantoFlow/Main.daml      # Daml templates
    test/CantoFlow/Main/Test.daml # Happy-path test
    daml.yaml                     # Daml project config
  backend/
    src/
      routes/                     # Express routes
      types/                      # TypeScript interfaces
      index.ts                    # Server entrypoint
  app/
    src/
      pages/                      # React pages
      components/                 # Shared UI components
      data/seed.ts                # Demo seed data
      types/                      # Frontend types
```

---

## Why This Wins

| Criterion | How CantoFlow Delivers |
|-----------|------------------------|
| Privacy | Daml contract-level isolation — not frontend filtering |
| Clarity | Animated role switcher + privacy banners make visibility obvious |
| Polish | Premium dark fintech UI with smooth transitions |
| Simplicity | Core flow (7 steps) works end-to-end in 2 minutes |
| Canton-specific | Built around `FinancingBid` contract isolation, `AuditAccessGrant`, `WorkflowEvent` |

---

## License

MIT — built for the Canton hackathon.
