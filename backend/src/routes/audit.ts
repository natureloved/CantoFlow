import express, { Request, Response } from 'express';
import { WorkflowEvent } from '../types';
import { PARTIES } from '../types';

const router = express.Router();

let events: WorkflowEvent[] = [];

const SEED_EVENTS: WorkflowEvent[] = [
  { eventId: 'EVT-001', eventType: 'InvoiceCreated', requestId: 'REQ-001', party: PARTIES.Supplier, metadata: 'Invoice INV-2026-001 created for $100,000 USD', timestamp: '2026-06-29T10:00:00Z' },
  { eventId: 'EVT-002', eventType: 'InvoiceConfirmed', requestId: 'REQ-001', party: PARTIES.Buyer, metadata: 'Buyer confirmed amount and due date', timestamp: '2026-06-29T10:15:00Z' },
  { eventId: 'EVT-003', eventType: 'BidSubmitted', requestId: 'REQ-001', party: PARTIES.LenderA, metadata: 'LenderA submitted BID-A at 8.0%', timestamp: '2026-06-29T10:20:00Z' },
  { eventId: 'EVT-004', eventType: 'BidSubmitted', requestId: 'REQ-001', party: PARTIES.LenderB, metadata: 'LenderB submitted BID-B at 6.5%', timestamp: '2026-06-29T10:22:00Z' },
  { eventId: 'EVT-005', eventType: 'BidSubmitted', requestId: 'REQ-001', party: PARTIES.LenderC, metadata: 'LenderC submitted BID-C at 7.0%', timestamp: '2026-06-29T10:25:00Z' },
  { eventId: 'EVT-006', eventType: 'BidAccepted', requestId: 'REQ-001', party: PARTIES.Supplier, metadata: 'Accepted BID-B from LenderB at 6.5%', timestamp: '2026-06-29T11:00:00Z' },
  { eventId: 'EVT-007', eventType: 'AgreementCreated', requestId: 'REQ-001', party: PARTIES.Supplier, metadata: 'Funding Agreement AG-REQ-001 created', timestamp: '2026-06-29T11:05:00Z' },
  { eventId: 'EVT-008', eventType: 'AuditAccessGranted', requestId: 'REQ-001', party: PARTIES.Supplier, metadata: 'Auditor granted scope: InvoiceRequest,FundingAgreement,WorkflowEvent', timestamp: '2026-06-29T12:00:00Z' }
];

events = [...SEED_EVENTS];

router.get('/', (_req: Request, res: Response) => {
  res.json(events);
});

router.get('/:requestId', (req: Request, res: Response) => {
  const filtered = events.filter(e => e.requestId === req.params.requestId);
  res.json(filtered);
});

router.post('/', (req: Request, res: Response) => {
  const { eventType, requestId, party, metadata } = req.body;
  const newEvent: WorkflowEvent = {
    eventId: `EVT-${String(events.length + 1).padStart(3, '0')}`,
    eventType: eventType || 'Unknown',
    requestId: requestId || '',
    party: party || PARTIES.Supplier,
    metadata: metadata || '',
    timestamp: new Date().toISOString()
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

export { router as auditRoutes };
