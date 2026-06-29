import express, { Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import { invoiceRoutes } from './routes/invoices';
import { bidRoutes } from './routes/bids';
import { agreementRoutes } from './routes/agreements';
import { auditRoutes } from './routes/audit';
import { dashboardRoutes } from './routes/dashboard';
import { PARTIES, ROLES } from './types';

const app = express();

app.use(cors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', cantoparty: 'CantoFlow Demo Backend' });
});

app.get('/api/setup/parties', (_req: Request, res: Response) => {
  res.json({
    roles: ROLES,
    parties: PARTIES
  });
});

app.use('/api/invoices', invoiceRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[CantoFlow] Backend running on http://localhost:${PORT}`);
});
