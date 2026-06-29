import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { FundingAgreement, AgreementStatusType } from '../types/index';
import { PARTIES } from '../types';

const router = express.Router();

let agreements: FundingAgreement[] = [];

const SEED_AGREEMENT: FundingAgreement = {
  agreementId: 'AG-REQ-001',
  invoiceRequestCid: 'REQ-001',
  supplier: PARTIES.Supplier,
  lender: PARTIES.LenderB,
  buyer: PARTIES.Buyer,
  principal: 90000.0,
  feeRate: 0.065,
  repaymentAmount: 95850.0,
  maturityDate: '2026-09-14',
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
  const { invoiceRequestCid, supplier, lender, buyer, principal, feeRate, maturityDate } = req.body;
  if (!invoiceRequestCid || !supplier || !lender || !buyer) {
    return res.status(400).json({ error: 'invoiceRequestCid, supplier, lender, and buyer are required' });
  }
  const newAgreement: FundingAgreement = {
    agreementId: `AG-${invoiceRequestCid}`,
    invoiceRequestCid,
    supplier,
    lender,
    buyer,
    principal: parseFloat(principal) || 0,
    feeRate: parseFloat(feeRate) || 0,
    repaymentAmount: (parseFloat(principal) || 0) * (1 + (parseFloat(feeRate) || 0)),
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
    agreements[idx] = { ...agreements[idx], status: status as AgreementStatusType };
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
