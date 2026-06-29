import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { InvoiceRequest, RequestStatus } from '../types';

const router = express.Router();

let invoices: InvoiceRequest[] = [];

const SEED_INVOICES: InvoiceRequest[] = [
  {
    requestId: 'REQ-001',
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceNumber: 'INV-2026-001',
    amount: 100000.0,
    currency: 'USD',
    dueDate: '2026-09-01',
    description: 'Raw materials invoice for Q3 production — 500 units grade-A steel',
    status: 'Bidding',
    createdAt: '2026-06-29T10:00:00Z'
  },
  {
    requestId: 'REQ-002',
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceNumber: 'INV-2026-002',
    amount: 25000.0,
    currency: 'USD',
    dueDate: '2026-07-15',
    description: 'Consulting services — blockchain architecture advisory',
    status: 'Verified',
    createdAt: '2026-06-28T14:30:00Z'
  },
  {
    requestId: 'REQ-003',
    supplier: PARTIES.Supplier,
    buyer: PARTIES.Buyer,
    invoiceNumber: 'INV-2026-003',
    amount: 480000.0,
    currency: 'USD',
    dueDate: '2026-10-01',
    description: 'Enterprise SaaS platform licensing — annual renewal',
    status: 'Pending',
    createdAt: '2026-06-30T08:00:00Z'
  }
];

// Initialize seeded data
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
  const { supplier, buyer, invoiceNumber, amount, currency, dueDate, description } = req.body;
  if (!supplier || !buyer || !amount) {
    return res.status(400).json({ error: 'supplier, buyer, and amount are required' });
  }
  const newInvoice: InvoiceRequest = {
    requestId: `REQ-${String(invoices.length + 1).padStart(3, '0')}`,
    supplier,
    buyer,
    invoiceNumber: invoiceNumber || `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
    amount: parseFloat(amount),
    currency: currency || 'USD',
    dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    description: description || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  invoices.push(newInvoice);
  res.status(201).json(newInvoice);
});

router.patch('/:id', (req: Request, res: Response) => {
  const idx = invoices.findIndex(i => i.requestId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Invoice request not found' });
  const { status } = req.body;
  if (status && ['Pending', 'Verified', 'Bidding', 'Accepted', 'Funded', 'Repaid'].includes(status)) {
    invoices[idx] = { ...invoices[idx], status };
  }
  res.json(invoices[idx]);
});

router.get('/:id/bids-with-ids', (req: Request, res: Response) => {
  const invoice = invoices.find(i => i.requestId === req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice request not found' });
  res.json({ requestId: invoice.requestId, bids: [] });
});

export { router as invoiceRoutes };
