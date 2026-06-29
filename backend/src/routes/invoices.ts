import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { InvoiceRequest, RequestStatus } from '../types/index';
import { PARTIES } from '../types';

const router = express.Router();

let invoices: InvoiceRequest[] = [];

const SEED_INVOICES: InvoiceRequest[] = [
  {
    requestId: 'REQ-001',
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceId: 'INV-2026-001',
    amount: 100000.0,
    currency: 'USD',
    dueDate: '2026-09-01',
    requestedAdvance: 85000.0,
    description: 'Raw materials invoice for Q3 production — 500 units grade-A steel',
    status: 'Bidding',
    invitedLenders: [PARTIES.LenderA, PARTIES.LenderB, PARTIES.LenderC],
    auditor: PARTIES.Auditor,
    createdAt: '2026-06-29T10:00:00Z'
  },
  {
    requestId: 'REQ-002',
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceId: 'INV-2026-002',
    amount: 25000.0,
    currency: 'USD',
    dueDate: '2026-07-15',
    requestedAdvance: 20000.0,
    description: 'Consulting services — blockchain architecture advisory',
    status: 'Verified',
    invitedLenders: [PARTIES.LenderA, PARTIES.LenderB],
    auditor: PARTIES.Auditor,
    createdAt: '2026-06-28T14:30:00Z'
  },
  {
    requestId: 'REQ-003',
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceId: 'INV-2026-003',
    amount: 480000.0,
    currency: 'USD',
    dueDate: '2026-10-01',
    requestedAdvance: 400000.0,
    description: 'Enterprise SaaS platform licensing — annual renewal',
    status: 'Pending',
    invitedLenders: [PARTIES.LenderC],
    auditor: PARTIES.Auditor,
    createdAt: '2026-06-30T08:00:00Z'
  }
];

invoices = [...SEED_INVOICES];

router.get('/', (_req: Request, res: Response) => {
  res.json(invoices);
});

router.get('/:id', (req: Request, res: Response) => {
  const invoice = invoices.find(i => i.requestId === req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice request not found' });
  res.json(invoice);
});

router.post('/', (req: Request, res: Response) => {
  const { supplier, buyer, invoiceId, amount, currency, dueDate, requestedAdvance, invitedLenders, auditor } = req.body;
  if (!supplier || !buyer || !amount) {
    return res.status(400).json({ error: 'supplier, buyer, and amount are required' });
  }
  const newInvoice: InvoiceRequest = {
    requestId: `REQ-${String(invoices.length + 1).padStart(3, '0')}`,
    supplier,
    buyer,
    invoiceId: invoiceId || `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
    amount: parseFloat(amount),
    currency: currency || 'USD',
    dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    requestedAdvance: parseFloat(requestedAdvance) || 0,
    description: '',
    status: 'Pending',
    invitedLenders: invitedLenders || [],
    auditor: auditor || '',
    createdAt: new Date().toISOString()
  };
  invoices.push(newInvoice);
  res.status(201).json(newInvoice);
});

router.patch('/:id', (req: Request, res: Response) => {
  const idx = invoices.findIndex(i => i.requestId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Invoice request not found' });
  const { status, invitedLenders } = req.body;
  if (status && ['Pending', 'Verified', 'Bidding', 'Accepted', 'Funded', 'Repaid'].includes(status)) {
    invoices[idx] = { ...invoices[idx], status };
  }
  if (invitedLenders) {
    invoices[idx] = { ...invoices[idx], invitedLenders };
  }
  res.json(invoices[idx]);
});

router.get('/:id/bids', (req: Request, res: Response) => {
  const invoice = invoices.find(i => i.requestId === req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice request not found' });
  res.json({ requestId: invoice.requestId, bids: [] });
});

router.get('/:id/confirmations', (req: Request, res: Response) => {
  res.json({ requestId: req.params.id, confirmations: [] });
});

export { router as invoiceRoutes };
