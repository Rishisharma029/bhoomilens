/**
 * BhoomiLens Civic-Tech Domain Models & Relational Entity Definitions
 * SIH26018 - Intelligent Land Record Digitalization & Verification
 * 
 * Core PostgreSQL Entities:
 * 1. users
 * 2. land_records
 * 3. documents
 * 4. validation_results
 * 5. correction_requests
 * 6. audit_logs
 */

// ==========================================================
// 1. Users Model (users)
// ==========================================================
export type UserRole = 'CITIZEN' | 'ADMIN' | 'REVENUE_OFFICER';

export interface User {
  id: string;                      // e.g. 'user_cit_101', 'admin_adm_501'
  name: string;                    // e.g. 'Rishi Sharma', 'Rajeshwar Singh Negi'
  email: string;                   // e.g. 'rishi.sharma@uttarakhand.gov.in'
  role: UserRole;                  // 'CITIZEN' | 'ADMIN' | 'REVENUE_OFFICER'
  aadhaar_masked?: string;         // e.g. 'XXXX-XXXX-8921'
  designation?: string;            // e.g. 'Sub-Divisional Magistrate (SDM)'
  jurisdiction?: string;           // e.g. 'Dehradun Sub-Division, Tehsil Sadar'
  created_at?: string;
}

export type CreateUserInput = Omit<User, 'created_at'>;

// ==========================================================
// 2. Land Records Model (land_records)
// ==========================================================
export type LandRecordStatus = 'VERIFIED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'CONFLICT';

export interface LandRecord {
  id: string;                      // Primary key / Record ID e.g. 'rec_10294'
  parcel_id: string;               // e.g. 'LR-10294'
  survey_no: string;               // e.g. '124/7'
  khasra_no: string;               // e.g. '124/7'
  khata_no?: string;               // e.g. '00142'
  district: string;                // e.g. 'XYZ' or 'Dehradun'
  tehsil: string;                  // e.g. 'Sadar' or 'Rishikesh'
  village: string;                 // e.g. 'ABC' or 'Rishikesh Rural'
  area: number;                    // Numeric area (e.g. 2.35)
  area_unit: string;               // 'Acres' | 'Hectares' | 'Bigha'
  land_type: string;               // 'Agricultural' | 'Residential' | 'Commercial'
  owner_name: string;              // e.g. 'Rishi Sharma'
  father_name?: string;            // e.g. 'Late Kedarnath Sharma'
  status: LandRecordStatus;        // 'VERIFIED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'CONFLICT'
  digital_seal_hash?: string;      // Cryptographic SHA-256 seal
  encumbrance_notes?: string;      // Mortgage/Lease/Dispute remarks
  last_mutation_date?: string;     // e.g. '2023-11-18'
  last_updated?: string;
  created_at?: string;
}

export type CreateLandRecordInput = Omit<LandRecord, 'created_at' | 'last_updated'>;

// ==========================================================
// 3. Ingested Documents Model (documents)
// ==========================================================
export type DocumentType = 'SALE_DEED' | 'KHATAUNI' | 'MUTATION_CERTIFICATE' | 'GIFT_DEED' | 'CORRECTION_AFFIDAVIT';
export type DocumentStatus = 'PENDING_AI' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'CORRECTION_REQUESTED';

export interface Document {
  id: string;                      // e.g. 'doc_sub_10294'
  citizen_id?: string;             // References users(id)
  citizen_name: string;            // e.g. 'Rishi Sharma'
  parcel_id?: string;              // e.g. 'LR-10294'
  khasra_no?: string;              // e.g. '124/7'
  survey_no?: string;              // e.g. '124/7'
  village?: string;                // e.g. 'ABC'
  district?: string;               // e.g. 'XYZ'
  doc_type: DocumentType;          // 'SALE_DEED' etc.
  file_name: string;               // e.g. 'Registry.pdf'
  file_size: string;               // e.g. '4.2 MB'
  mime_type: string;               // 'application/pdf' | 'image/png' | 'image/jpeg'
  storage_path: string;            // Local filesystem path or object storage key
  storage_url: string;             // Public / authenticated serving URL (e.g. '/uploads/...')
  file_hash?: string;              // SHA-256 integrity hash of document binary
  status: DocumentStatus;          // 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED'
  uploaded_at?: string;
}

export type CreateDocumentInput = Omit<Document, 'uploaded_at'>;

// ==========================================================
// 4. Validation Results Model (validation_results)
// ==========================================================
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type AdjudicationRecommendation = 
  | 'RECOMMENDED_FOR_APPROVAL'
  | 'MANUAL_INSPECTION_REQUIRED'
  | 'HIGH_FRAUD_RISK';

export interface ValidationCheckItem {
  id: string;                      // e.g. 'chk_owner', 'chk_area'
  name: string;                    // e.g. 'Owner Match', 'Area Consistency'
  category: 'IDENTITY' | 'GEOSPATIAL' | 'LEGAL' | 'METRIC';
  status: 'PASSED' | 'WARNING' | 'FAILED';
  icon: string;                    // '✓' | '⚠' | '✕'
  extracted_value: string;         // Value read from scanned deed
  expected_value: string;          // Master cadastral record value
  confidence: number;              // AI match score percentage (e.g. 98)
  detail: string;                  // Explanation of match or divergence
}

export interface ValidationResult {
  id: string;                      // e.g. 'val_res_10294'
  document_id: string;             // References documents(id)
  record_id?: string;              // References land_records(id or parcel_id)
  risk_level: RiskLevel;           // 'LOW' | 'MEDIUM' | 'HIGH'
  overall_confidence_score: number;// e.g. 82.00 or 97.00
  recommendation: AdjudicationRecommendation;
  checks_json: {
    passed_count: number;          // e.g. 8
    warning_count: number;         // e.g. 1
    conflict_count: number;        // e.g. 0
    checks: ValidationCheckItem[];
  };
  is_area_mismatch: boolean;       // e.g. true if variance detected
  is_owner_conflict: boolean;      // e.g. false
  ai_explanation?: string;         // e.g. 'Area differs from previous registered record by 0.75 acres...'
  analyzed_at?: string;
}

export type CreateValidationResultInput = Omit<ValidationResult, 'analyzed_at'>;

// ==========================================================
// 5. Correction Requests Model (correction_requests)
// ==========================================================
export type CorrectionStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type CorrectionReason = 
  | 'INCORRECT_OWNER_NAME'
  | 'AREA_MISMATCH'
  | 'BOUNDARY_ERROR'
  | 'FATHER_NAME_SPELLING'
  | 'KHASRA_SUBDIVISION';

export interface AIAssessmentInfo {
  match_confidence: number;        // e.g. 94 (%)
  verdict: string;                 // 'Likely Match — 94%'
  levenshtein_distance?: number;
  phonetic_match?: boolean;        // e.g. true for Metaphone / Soundex
  risk_score?: number;
  notes?: string;
}

export interface CorrectionRequest {
  id: string;                      // e.g. 'cor_req_101'
  document_id?: string;            // References documents(id)
  parcel_id?: string;              // e.g. 'LR-10294'
  khasra_no: string;               // e.g. '124/7'
  survey_no?: string;              // e.g. '124/7'
  village?: string;                // e.g. 'ABC'
  district?: string;               // e.g. 'XYZ'
  citizen_id?: string;             // References users(id)
  citizen_name: string;            // e.g. 'Rishi Sharma'
  requested_type_title: string;    // e.g. 'Owner Name correction'
  reason: CorrectionReason;        // 'INCORRECT_OWNER_NAME'
  description: string;             // Detailed explanation submitted by petitioner
  current_value?: string;          // e.g. 'Rishi Kumar'
  requested_value?: string;        // e.g. 'Rishi Sharma'
  evidence_doc_name?: string;      // e.g. 'Name_Correction_Affidavit.pdf'
  evidence_doc_type?: string;      // e.g. 'AFFIDAVIT' | 'GAZETTE_NOTIFICATION'
  evidence_doc_url?: string;       // Link to proof document
  ai_assessment_json?: AIAssessmentInfo;
  requested_changes_json?: Record<string, any>;
  status: CorrectionStatus;        // 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
  officer_notes?: string;          // Revenue court / SDM decree remarks
  seal_hash?: string;              // Cryptographic seal when approved
  submitted_at?: string;
  resolved_at?: string;
}

export type CreateCorrectionRequestInput = Omit<CorrectionRequest, 'submitted_at' | 'resolved_at'>;

// ==========================================================
// 6. Audit Logs Model (audit_logs)
// ==========================================================
export type AuditAction = 
  | 'RECORD_CREATED'
  | 'DOCUMENT_INGESTED'
  | 'AI_EXTRACTION_COMPLETED'
  | 'VALIDATION_ANALYZED'
  | 'INSPECTION_OPENED'
  | 'RECORD_APPROVED'
  | 'RECORD_REJECTED'
  | 'CORRECTION_PETITION_FILED'
  | 'CORRECTION_APPROVED'
  | 'CORRECTION_REJECTED'
  | 'DIGITAL_SEAL_AFFIXED';

export interface AuditLog {
  id: string;                      // e.g. 'aud_log_101'
  record_id: string;               // e.g. 'LR-10294' or document ID
  khasra_no: string;               // e.g. '124/7'
  action: AuditAction | string;    // e.g. 'RECORD_APPROVED'
  performed_by: string;            // e.g. 'Rajeshwar Singh Negi (SDM)'
  role: string;                    // 'ADMIN' | 'CITIZEN' | 'SYSTEM'
  ip_address?: string;             // e.g. '10.14.88.22'
  block_hash: string;              // SHA-256 tamper-evident hash
  prev_block_hash: string;         // Previous block hash
  details: string;                 // Human & machine readable event narration
  timestamp?: string;
}

export type CreateAuditLogInput = Omit<AuditLog, 'timestamp'>;
