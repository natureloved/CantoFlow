import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { FinancingBid, BidStatus } from '../types';
import { PARTIES } from '../types';

const router = express.Router();

let bids: FinancingBid[] = [];

const SEED_BIDS: FinancingBid[] = [
  {
    bidId: 'BID-A',
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderA,
    requestId: 'REQ-001',
    interestRate: 0.08,
    advanceRate: 0.85,
    feeAmount: 1250.0,
    maturityDays: 90,
    status: 'Revealed',
    submittedAt: '2026-06-29T10:05:00Z'
  },
  {
    bidId: 'BID-B',
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderB,
    requestId: 'REQ-001',
    interestRate: 0.065,
    advanceRate: 0.90,
    feeAmount: 1000.0,
    maturityDays: 75,
    status: 'Accepted',
    submittedAt: '2026-06-29T10:08:00Z'
  },
  {
    bidId: 'BID-C',
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderC,
    requestId: 'REQ-001',
    interestRate: 0.07,
    advanceRate: 0.88,
    feeAmount: 1100.0,
    maturityDays: 80,
    status: 'Revealed',
    submittedAt: '2026-06-29T10:12:00Z'
  }
];

bids = [...SEED_BIDS];

router.get('/', (req: Request, res: Response) => {
  const { requestId, lender } = req.query;
  let filtered = [...bids];
  if (requestId) filtered = filtered.filter(b => b.requestId === requestId as string);
  if (lender) filtered = filtered.filter(b => b.lender === lender as string);
  res.json(filtered);
});

router.get('/:id', (req: Request, res: Response) => {
  const bid = bids.find(b => b.bidId === req.params.id);
  if (!bid) return res.status(404).json({ error: 'Bid not found' });
  res.json(bid);
});

router.post('/', (req: Request, res: Response) => {
  const { supplier, lender, requestId, interestRate, advanceRate, feeAmount, maturityDays } = req.body;
  if (!supplier || !lender || !requestId) {
    return res.status(400).json({ error: 'supplier, lender, and requestId are required' });
  }
  const newBid: FinancingBid = {
    bidId: `BID-${String.fromCharCode(65 + bids.length % 26)}`,
    supplier,
    lender,
    requestId,
    interestRate: parseFloat(interestRate),
    advanceRate: parseFloat(advanceRate),
    feeAmount: parseFloat(feeAmount),
    maturityDays: parseInt(maturityDays),
    status: 'Submitted',
    submittedAt: new Date().toISOString()
  };
  bids.push(newBid);
  res.status(201).json(newBid);
});

router.patch('/:id', (req: Request, res: Response) => {
  const idx = bids.findIndex(b => b.bidId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Bid not found' });
  const { status } = req.body;
  if (status && ['Submitted', 'Revealed', 'Accepted', 'Rejected'].includes(status)) {
    bids[idx] = { ...bids[idx], status: status as BidStatus };
  }
  res.json(bids[idx]);
});

router.post('/:id/reveal', (req: Request, res: Response) => {
  const idx = bids.findIndex(b => b.bidId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Bid not found' });
  bids[idx] = { ...bids[idx], status: 'Revealed' };
  res.json(bids[idx]);
});

router.post('/:id/accept', (req: Request, res: Response) => {
  const idx = bids.findIndex(b => b.bidId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Bid not found' });
  bids[idx] = { ...bids[idx], status: 'Accepted' };
  res.json(bids[idx]);
});

export { router as bidRoutes };
