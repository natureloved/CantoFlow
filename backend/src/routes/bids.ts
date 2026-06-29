import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { FinancingBid, BidStatusType } from '../types/index';
import { PARTIES } from '../types';

const router = express.Router();

let bids: FinancingBid[] = [];

const SEED_BIDS: FinancingBid[] = [
  {
    bidId: 'BID-A',
    invoiceRequestCid: 'REQ-001',
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderA,
    offerAmount: 85000.0,
    feeRate: 0.08,
    expiry: '2026-11-29',
    status: 'Revealed',
    submittedAt: '2026-06-29T10:05:00Z'
  },
  {
    bidId: 'BID-B',
    invoiceRequestCid: 'REQ-001',
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderB,
    offerAmount: 90000.0,
    feeRate: 0.065,
    expiry: '2026-09-14',
    status: 'Accepted',
    submittedAt: '2026-06-29T10:08:00Z'
  },
  {
    bidId: 'BID-C',
    invoiceRequestCid: 'REQ-001',
    supplier: PARTIES.Supplier,
    lender: PARTIES.LenderC,
    offerAmount: 88000.0,
    feeRate: 0.07,
    expiry: '2026-10-15',
    status: 'Revealed',
    submittedAt: '2026-06-29T10:12:00Z'
  }
];

bids = [...SEED_BIDS];

router.get('/', (req: Request, res: Response) => {
  const { requestId, lender } = req.query;
  let filtered = [...bids];
  if (requestId) filtered = filtered.filter(b => b.invoiceRequestCid === requestId as string);
  if (lender) filtered = filtered.filter(b => b.lender === lender as string);
  res.json(filtered);
});

router.get('/:id', (req: Request, res: Response) => {
  const bid = bids.find(b => b.bidId === req.params.id);
  if (!bid) return res.status(404).json({ error: 'Bid not found' });
  res.json(bid);
});

router.post('/', (req: Request, res: Response) => {
  const { invoiceRequestCid, supplier, lender, offerAmount, feeRate, expiry } = req.body;
  if (!invoiceRequestCid || !supplier || !lender) {
    return res.status(400).json({ error: 'invoiceRequestCid, supplier, and lender are required' });
  }
  const newBid: FinancingBid = {
    bidId: `BID-${String.fromCharCode(65 + bids.length % 26)}`,
    invoiceRequestCid,
    supplier,
    lender,
    offerAmount: parseFloat(offerAmount) || 0,
    feeRate: parseFloat(feeRate) || 0,
    expiry: expiry || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
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
  if (status && ['Submitted', 'Revealed', 'Accepted', 'Rejected', 'Expired'].includes(status)) {
    bids[idx] = { ...bids[idx], status: status as BidStatusType };
  }
  res.json(bids[idx]);
});

router.post('/:id/withdraw', (req: Request, res: Response) => {
  const idx = bids.findIndex(b => b.bidId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Bid not found' });
  bids[idx] = { ...bids[idx], status: 'Expired' };
  res.json(bids[idx]);
});

router.post('/:id/accept', (req: Request, res: Response) => {
  const idx = bids.findIndex(b => b.bidId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Bid not found' });
  bids[idx] = { ...bids[idx], status: 'Accepted' };
  res.json(bids[idx]);
});

export { router as bidRoutes };
