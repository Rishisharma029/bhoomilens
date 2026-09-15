import { db } from '../client';
import { storageService } from '../../services/storageService';

export const landRecordRepo = {
  async listAll(): Promise<any[]> {
    if (db.isLivePostgres()) {
      const res = await db.query(`SELECT * FROM land_records ORDER BY created_at DESC`);
      if (res.rows.length > 0) return res.rows;
    }
    return storageService.getRecords();
  },

  async findByParcelId(parcelId: string): Promise<any | null> {
    if (db.isLivePostgres()) {
      const res = await db.query(`SELECT * FROM land_records WHERE parcel_id = $1`, [parcelId]);
      if (res.rows.length > 0) return res.rows[0];
    }
    const recs = storageService.getRecords();
    return recs.find(r => r.parcelId === parcelId) || null;
  },

  async findBySurveyNo(surveyNo: string): Promise<any | null> {
    if (db.isLivePostgres()) {
      const res = await db.query(`SELECT * FROM land_records WHERE survey_no = $1 OR khasra_no = $1`, [surveyNo]);
      if (res.rows.length > 0) return res.rows[0];
    }
    const recs = storageService.getRecords();
    return recs.find(r => r.surveyNo === surveyNo || r.khasraNo === surveyNo) || null;
  },

  async updateStatus(parcelIdOrId: string, status: string, sealHash?: string): Promise<void> {
    if (db.isLivePostgres()) {
      await db.query(
        `UPDATE land_records SET status = $1, digital_seal_hash = COALESCE($2, digital_seal_hash), last_updated = CURRENT_TIMESTAMP WHERE parcel_id = $3 OR id = $3`,
        [status, sealHash, parcelIdOrId]
      );
    }
    const records = storageService.getRecords();
    const idx = records.findIndex(r => r.parcelId === parcelIdOrId || r.id === parcelIdOrId);
    if (idx >= 0) {
      records[idx].status = status;
      if (sealHash) {
        records[idx].digitalSealHash = sealHash;
      }
      records[idx].lastUpdated = new Date().toLocaleDateString('en-IN');
      storageService.saveRecords(records);
    }
  },

  async updateOwner(parcelIdOrId: string, newOwner: string, sealHash?: string): Promise<void> {
    if (db.isLivePostgres()) {
      await db.query(
        `UPDATE land_records SET owner_name = $1, digital_seal_hash = COALESCE($2, digital_seal_hash), last_updated = CURRENT_TIMESTAMP WHERE parcel_id = $3 OR id = $3`,
        [newOwner, sealHash, parcelIdOrId]
      );
    }
    const records = storageService.getRecords();
    const idx = records.findIndex(r => r.parcelId === parcelIdOrId || r.id === parcelIdOrId);
    if (idx >= 0) {
      records[idx].ownerName = newOwner;
      if (sealHash) {
        records[idx].digitalSealHash = sealHash;
      }
      records[idx].lastUpdated = new Date().toLocaleDateString('en-IN');
      storageService.saveRecords(records);
    }
  }
};
