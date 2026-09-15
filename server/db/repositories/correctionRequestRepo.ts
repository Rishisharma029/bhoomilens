import { db } from '../client';
import { CorrectionRequest, CreateCorrectionRequestInput } from '../models';
import fs from 'fs';
import path from 'path';

const CORRECTIONS_FILE = path.join(process.cwd(), 'server', 'data', 'corrections.json');

export const correctionRequestRepo = {
  async listAll(): Promise<CorrectionRequest[]> {
    if (db.isLivePostgres()) {
      const res = await db.query<CorrectionRequest>(`SELECT * FROM correction_requests ORDER BY submitted_at DESC`);
      if (res.rows.length > 0) return res.rows;
    }
    try {
      if (fs.existsSync(CORRECTIONS_FILE)) {
        return JSON.parse(fs.readFileSync(CORRECTIONS_FILE, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading corrections file:', e);
    }
    return [];
  },

  async findById(id: string): Promise<CorrectionRequest | null> {
    if (db.isLivePostgres()) {
      const res = await db.query<CorrectionRequest>(`SELECT * FROM correction_requests WHERE id = $1`, [id]);
      if (res.rows.length > 0) return res.rows[0];
    }
    const all = await this.listAll();
    return all.find(c => c.id === id) || null;
  },

  async findByParcelId(parcelId: string): Promise<CorrectionRequest[]> {
    if (db.isLivePostgres()) {
      const res = await db.query<CorrectionRequest>(`SELECT * FROM correction_requests WHERE parcel_id = $1`, [parcelId]);
      if (res.rows.length > 0) return res.rows;
    }
    const all = await this.listAll();
    return all.filter(c => c.parcel_id === parcelId);
  },

  async create(req: CreateCorrectionRequestInput): Promise<CorrectionRequest> {
    const fullReq: CorrectionRequest = {
      ...req,
      submitted_at: new Date().toISOString()
    };

    if (db.isLivePostgres()) {
      await db.query(
        `INSERT INTO correction_requests (
          id, document_id, parcel_id, khasra_no, survey_no, village, district,
          citizen_id, citizen_name, requested_type_title, reason, description,
          current_value, requested_value, evidence_doc_name, evidence_doc_type,
          evidence_doc_url, ai_assessment_json, requested_changes_json, status,
          officer_notes, seal_hash, submitted_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          officer_notes = EXCLUDED.officer_notes,
          seal_hash = EXCLUDED.seal_hash,
          resolved_at = CURRENT_TIMESTAMP`,
        [
          fullReq.id, fullReq.document_id || null, fullReq.parcel_id || null,
          fullReq.khasra_no, fullReq.survey_no || null, fullReq.village || null,
          fullReq.district || null, fullReq.citizen_id || null, fullReq.citizen_name,
          fullReq.requested_type_title, fullReq.reason, fullReq.description,
          fullReq.current_value || null, fullReq.requested_value || null,
          fullReq.evidence_doc_name || null, fullReq.evidence_doc_type || null,
          fullReq.evidence_doc_url || null,
          fullReq.ai_assessment_json ? JSON.stringify(fullReq.ai_assessment_json) : null,
          fullReq.requested_changes_json ? JSON.stringify(fullReq.requested_changes_json) : null,
          fullReq.status, fullReq.officer_notes || null, fullReq.seal_hash || null,
          fullReq.submitted_at
        ]
      );
    }

    const all = await this.listAll();
    const existingIdx = all.findIndex(c => c.id === fullReq.id);
    if (existingIdx >= 0) {
      all[existingIdx] = fullReq;
    } else {
      all.unshift(fullReq);
    }

    try {
      fs.writeFileSync(CORRECTIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving corrections file:', e);
    }

    return fullReq;
  },

  async updateStatus(id: string, status: CorrectionRequest['status'], notes?: string, sealHash?: string): Promise<CorrectionRequest | null> {
    const resolvedAt = new Date().toISOString();
    if (db.isLivePostgres()) {
      await db.query(
        `UPDATE correction_requests 
         SET status = $1, officer_notes = COALESCE($2, officer_notes), seal_hash = COALESCE($3, seal_hash), resolved_at = $4
         WHERE id = $5`,
        [status, notes || null, sealHash || null, resolvedAt, id]
      );
    }

    const all = await this.listAll();
    const req = all.find(c => c.id === id);
    if (req) {
      req.status = status;
      if (notes) req.officer_notes = notes;
      if (sealHash) req.seal_hash = sealHash;
      req.resolved_at = resolvedAt;
      try {
        fs.writeFileSync(CORRECTIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');
      } catch (e) {
        console.error('Error saving corrections file:', e);
      }
      return req;
    }
    return null;
  }
};
