import { db } from '../client';
import { ValidationResult, CreateValidationResultInput } from '../models';
import fs from 'fs';
import path from 'path';

const VALIDATIONS_FILE = path.join(process.cwd(), 'server', 'data', 'validations.json');

export const validationResultRepo = {
  async listAll(): Promise<ValidationResult[]> {
    if (db.isLivePostgres()) {
      const res = await db.query<ValidationResult>(`SELECT * FROM validation_results ORDER BY analyzed_at DESC`);
      if (res.rows.length > 0) return res.rows;
    }
    try {
      if (fs.existsSync(VALIDATIONS_FILE)) {
        return JSON.parse(fs.readFileSync(VALIDATIONS_FILE, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading validations file:', e);
    }
    return [];
  },

  async findByDocumentId(documentId: string): Promise<ValidationResult | null> {
    if (db.isLivePostgres()) {
      const res = await db.query<ValidationResult>(`SELECT * FROM validation_results WHERE document_id = $1`, [documentId]);
      if (res.rows.length > 0) return res.rows[0];
    }
    const all = await this.listAll();
    return all.find(v => v.document_id === documentId) || null;
  },

  async findById(id: string): Promise<ValidationResult | null> {
    if (db.isLivePostgres()) {
      const res = await db.query<ValidationResult>(`SELECT * FROM validation_results WHERE id = $1`, [id]);
      if (res.rows.length > 0) return res.rows[0];
    }
    const all = await this.listAll();
    return all.find(v => v.id === id) || null;
  },

  async save(val: CreateValidationResultInput): Promise<ValidationResult> {
    const fullResult: ValidationResult = {
      ...val,
      analyzed_at: new Date().toISOString()
    };

    if (db.isLivePostgres()) {
      await db.query(
        `INSERT INTO validation_results (
          id, document_id, record_id, risk_level, overall_confidence_score,
          recommendation, checks_json, is_area_mismatch, is_owner_conflict,
          ai_explanation, analyzed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          risk_level = EXCLUDED.risk_level,
          overall_confidence_score = EXCLUDED.overall_confidence_score,
          recommendation = EXCLUDED.recommendation,
          checks_json = EXCLUDED.checks_json,
          is_area_mismatch = EXCLUDED.is_area_mismatch,
          is_owner_conflict = EXCLUDED.is_owner_conflict,
          ai_explanation = EXCLUDED.ai_explanation`,
        [
          fullResult.id, fullResult.document_id, fullResult.record_id || null,
          fullResult.risk_level, fullResult.overall_confidence_score,
          fullResult.recommendation, JSON.stringify(fullResult.checks_json),
          fullResult.is_area_mismatch, fullResult.is_owner_conflict,
          fullResult.ai_explanation || null, fullResult.analyzed_at
        ]
      );
    }

    const all = await this.listAll();
    const existingIdx = all.findIndex(v => v.id === fullResult.id || v.document_id === fullResult.document_id);
    if (existingIdx >= 0) {
      all[existingIdx] = fullResult;
    } else {
      all.unshift(fullResult);
    }

    try {
      fs.writeFileSync(VALIDATIONS_FILE, JSON.stringify(all, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving validations file:', e);
    }

    return fullResult;
  }
};
