import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/summary', (_req: Request, res: Response) => {
  res.json({
    totalInvoices: 3,
    totalBids: 3,
    totalAgreements: 1,
    activeBids: 2,
    expectedRepayment: 90000.0,
    lenderCount: 3
  });
});

router.get('/invoices/:requestId', (req: Request, res: Response) => {
  res.json({
    requestId: req.params.requestId,
    auditEvents: [],
    relevance: 'All events visible via AuditAccessGrant scope'
  });
});

export { router as dashboardRoutes };
