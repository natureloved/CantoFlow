import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { FundingAgreement, AgreementStatus } from '../types';
import { PARTIES } from '../types';

const router = express.Router();

let agreements: FundingAgreement[] = [];

const SEED_AGREEMENT: FundingAgreement = {
  agreementId: 'AG-REQ-001',
  supplier: PARTIES.Supplier,
  lender: PARTIES.LenderB,
  buyer: PARTIES.Buyer,
  requestId: 'REQ-001',
  bidId: 'BID-B',
  amount: 100000.0,
  currency: 'USD',
  interestRate: 0.065,
  advanceRate: 0.90,
  feeAmount: 1000.0,
  maturityDate: '2026-10-25',
  status: 'Active',
  createdAt: '2026-06-29T14:00:00Z'
};

agreements = [SEED_AGREEMENT];

router.get('/', (_req: Request, res: Response) => {
  res.json(agreements);
});

router.get('/:id', (req: Request, res: Response) => {
  const agreement = agreements.find(a => a.agreementId === req.params.id);
  if (!agreement) return res.status(404).json({ error: 'Agreement not found' });
  res.json(agreement);
});

router.post('/', (req: Request, res: Response) => {
  const { supplier, lender, buyer, requestId, bidId, amount, currency, interestRate, advanceRate, feeAmount, maturityDate } = req.body;
  if (!supplier || !lender || !buyer || !requestId) {
    return res.status(400).json({ error: 'supplier, lender, buyer, and requestId are required' });
  }
  const newAgreement: FundingAgreement = {
    agreementId: `AG-${requestId}`,
    supplier,
    lender,
    buyer,
    requestId,
    bidId: bidId || '',
    amount: parseFloat(amount) || 0,
    currency: currency || 'USD',
    interestRate: parseFloat(interestRate) || 0,
    advanceRate: parseFloat(advanceRate) || 0,
    feeAmount: parseFloat(feeAmount) || 0,
    maturityDate: maturityDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date().toISOString()
  };
  agreements.push(newAgreement);
  res.status(201).json(newAgreement);
});

router.patch('/:id', (req: Request, res: Response) => {
  const idx = agreements.findIndex(a => a.agreementId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Agreement not found' });
  const { status } = req.body;
  if (status && ['Active', 'Repaid', 'Defaulted'].includes(status)) {
    agreements[idx] = { ...agreements[idx], status: status as AgreementStatus };
  }
  res.json(agreements[idx]);
});

router.post('/:id/repay', (req: Request, res: Response) => {
  const idx = agreements.findIndex(a => a.agreementId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Agreement not found' });
  agreements[idx] = { ...agreements[idx], status: 'Repaid', repaidAt: new Date().toISOString() };
  res.json(agreements[idx]);
});

export { router as agreementRoutes };
