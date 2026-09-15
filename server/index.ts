import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import landRecordRoutes from './routes/landRecordRoutes';
import documentRoutes from './routes/documentRoutes';
import adminRoutes from './routes/adminRoutes';
import { storageService } from './services/storageService';
import { db } from './db/client';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database schema
db.initSchema().catch(err => {
  console.error('[BhoomiLens DB] Schema initialization error:', err);
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const UPLOADS_DIR = path.join(process.cwd(), 'server', 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'BhoomiLens Backend Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0-phase3'
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Land Records Master Cadastral Routes
app.use('/api/land-records', landRecordRoutes);

// Document Ingestion & Extraction Routes
app.use('/api/documents', documentRoutes);

// Admin Verification & Adjudication Routes
app.use('/api/admin', adminRoutes);

// General Records Route (backward compatibility)
app.get('/api/records', (_req: Request, res: Response) => {
  const records = storageService.getRecords();
  res.json({ success: true, records });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` BhoomiLens Backend Service running on port ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` OCR Upload: POST http://localhost:${PORT}/api/documents/upload-and-extract`);
  console.log(`====================================================`);
});
