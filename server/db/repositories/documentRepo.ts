import { db } from '../client';
import { storageService } from '../../services/storageService';

export interface DocumentRow {
  id: string;
  citizen_id: string;
  citizen_name: string;
  parcel_id?: string;
  khasra_no: string;
  survey_no: string;
  village: string;
  district: string;
  doc_type: string;
  file_name: string;
  file_size: string;
  mime_type: string;
  storage_path: string;
  storage_url: string;
  file_hash?: string;
  status: string;
  uploaded_at: string;
  extracted_data?: any;
  ai_validation_report?: any;
}

export const documentRepo = {
  async create(doc: Partial<DocumentRow>): Promise<DocumentRow> {
    const fullDoc: DocumentRow = {
      id: doc.id || `doc_sub_${Date.now()}`,
      citizen_id: doc.citizen_id || 'user_cit_101',
      citizen_name: doc.citizen_name || 'Rishi Sharma',
      parcel_id: doc.parcel_id || 'LR-10294',
      khasra_no: doc.khasra_no || '124/7',
      survey_no: doc.survey_no || doc.khasra_no || '124/7',
      village: doc.village || 'ABC',
      district: doc.district || 'XYZ',
      doc_type: doc.doc_type || 'SALE_DEED',
      file_name: doc.file_name || 'Registry.pdf',
      file_size: doc.file_size || '4.2 MB',
      mime_type: doc.mime_type || 'application/pdf',
      storage_path: doc.storage_path || '',
      storage_url: doc.storage_url || '/mock/deed_10294.pdf',
      file_hash: doc.file_hash || `0x${Math.random().toString(16).substring(2, 14)}`,
      status: doc.status || 'UNDER_REVIEW',
      uploaded_at: doc.uploaded_at || new Date().toISOString(),
      extracted_data: doc.extracted_data,
      ai_validation_report: doc.ai_validation_report
    };

    if (db.isLivePostgres()) {
      await db.query(
        `INSERT INTO documents (
          id, citizen_id, citizen_name, parcel_id, khasra_no, survey_no,
          village, district, doc_type, file_name, file_size, mime_type,
          storage_path, storage_url, file_hash, status, uploaded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          fullDoc.id, fullDoc.citizen_id, fullDoc.citizen_name, fullDoc.parcel_id,
          fullDoc.khasra_no, fullDoc.survey_no, fullDoc.village, fullDoc.district,
          fullDoc.doc_type, fullDoc.file_name, fullDoc.file_size, fullDoc.mime_type,
          fullDoc.storage_path, fullDoc.storage_url, fullDoc.file_hash,
          fullDoc.status, fullDoc.uploaded_at
        ]
      );
    }

    // Also persist in local json store for dual persistence
    storageService.saveSubmission({
      ...fullDoc,
      fileName: fullDoc.file_name,
      fileSize: fullDoc.file_size,
      fileUrl: fullDoc.storage_url,
      citizenId: fullDoc.citizen_id,
      citizenName: fullDoc.citizen_name,
      parcelId: fullDoc.parcel_id,
      khasraNo: fullDoc.khasra_no,
      surveyNo: fullDoc.survey_no,
      extractedData: fullDoc.extracted_data,
      aiValidationReport: fullDoc.ai_validation_report
    });

    return fullDoc;
  },

  async findById(id: string): Promise<any | null> {
    if (db.isLivePostgres()) {
      const res = await db.query(`SELECT * FROM documents WHERE id = $1`, [id]);
      if (res.rows.length > 0) return res.rows[0];
    }
    return storageService.getSubmissionById(id) || null;
  },

  async listAll(): Promise<any[]> {
    if (db.isLivePostgres()) {
      const res = await db.query(`SELECT * FROM documents ORDER BY uploaded_at DESC`);
      if (res.rows.length > 0) return res.rows;
    }
    return storageService.getSubmissions();
  },

  async updateStatus(id: string, status: string, metadata?: any): Promise<void> {
    if (db.isLivePostgres()) {
      await db.query(`UPDATE documents SET status = $1 WHERE id = $2`, [status, id]);
    }
    const sub = storageService.getSubmissionById(id);
    if (sub) {
      sub.status = status;
      if (metadata?.reviewedBy) sub.reviewedBy = metadata.reviewedBy;
      if (metadata?.reviewerRemarks) sub.reviewerRemarks = metadata.reviewerRemarks;
      storageService.saveSubmission(sub);
    }
  }
};
