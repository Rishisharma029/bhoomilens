import { db } from '../client';
import fs from 'fs';
import path from 'path';

export interface AuditLogRow {
  id: string;
  record_id: string;
  khasra_no: string;
  action: string;
  performed_by: string;
  role: string;
  ip_address: string;
  block_hash: string;
  prev_block_hash: string;
  details: string;
  timestamp: string;
}

const AUDIT_FILE = path.join(process.cwd(), 'server', 'data', 'audit_logs.json');

export const auditRepo = {
  async appendLog(log: Partial<AuditLogRow>): Promise<AuditLogRow> {
    const logs = await this.listAll();
    const prevBlockHash = logs[0]?.block_hash || '0x0000000000000000000000000000000000000000';
    const newHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2, 10)}`;

    const fullLog: AuditLogRow = {
      id: log.id || `aud_log_${Date.now()}`,
      record_id: log.record_id || 'rec_general',
      khasra_no: log.khasra_no || 'N/A',
      action: log.action || 'TRANSACTION_RECORDED',
      performed_by: log.performed_by || 'System',
      role: log.role || 'ADMIN',
      ip_address: log.ip_address || '10.14.88.22',
      block_hash: newHash,
      prev_block_hash: prevBlockHash,
      details: log.details || '',
      timestamp: log.timestamp || new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    if (db.isLivePostgres()) {
      await db.query(
        `INSERT INTO audit_logs (
          id, record_id, khasra_no, action, performed_by, role,
          ip_address, block_hash, prev_block_hash, details, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          fullLog.id, fullLog.record_id, fullLog.khasra_no, fullLog.action,
          fullLog.performed_by, fullLog.role, fullLog.ip_address,
          fullLog.block_hash, fullLog.prev_block_hash, fullLog.details,
          fullLog.timestamp
        ]
      );
    }

    try {
      const updated = [fullLog, ...logs];
      fs.writeFileSync(AUDIT_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving audit log file:', e);
    }

    return fullLog;
  },

  async listAll(): Promise<AuditLogRow[]> {
    if (db.isLivePostgres()) {
      const res = await db.query(`SELECT * FROM audit_logs ORDER BY timestamp DESC`);
      if (res.rows.length > 0) return res.rows;
    }
    try {
      if (fs.existsSync(AUDIT_FILE)) {
        return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading audit logs:', e);
    }
    return [];
  }
};
