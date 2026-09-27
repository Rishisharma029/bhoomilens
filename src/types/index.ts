export type UserRole = 'CITIZEN' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  aadhaarMasked?: string;
  designation?: string;
  jurisdiction?: string;
  avatarUrl?: string;
}

export type RecordStatus = 
  | 'VERIFIED'
  | 'UNDER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'CONFLICT'
  | 'PENDING_AI'
  | 'FLAGGED_DISCREPANCY'
  | 'CORRECTION_REQUESTED'
  | 'REJECTED';

export interface CoOwner {
  name: string;
  relation: string;
  share: string; // e.g. "1/2" or "25%"
}

export interface LandBoundaries {
  north: string;
  south: string;
  east: string;
  west: string;
}

export interface OwnershipHistoryStep {
  id: string;
  previousOwner: string;
  transactionType: string; // e.g. "Registered Sale Conveyance", "Ancestral Succession Mutation"
  transactionDate: string;
  currentOwner: string;
  deedRegistrationNo: string;
  considerationAmount?: string;
  subRegistrarOffice?: string;
}

export interface AttachedDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  isVerified?: boolean;
}

export interface ValidationSummary {
  checksPassed: number;
  warnings: number;
  criticalConflicts: number;
  checks: Array<{
    name: string;
    category: 'CADASTRE' | 'IDENTITY' | 'LEGAL' | 'TAX';
    status: 'PASS' | 'WARNING' | 'FAIL';
    message: string;
  }>;
}

export interface LandRecord {
  id: string;
  parcelId: string; // e.g. LR-10294
  surveyNo: string; // e.g. 124/7
  khasraNo: string;
  khataNo: string;
  district: string;
  tehsil: string;
  village: string;
  area: number;
  areaUnit: 'Acres' | 'Hectares' | 'Nali' | 'Bigha';
  landType: 'Agricultural' | 'Residential' | 'Commercial' | 'Forest/Barren';
  ownerName: string;
  fatherName: string;
  aadhaarLastFour: string;
  coOwners: CoOwner[];
  boundaries: LandBoundaries;
  marketValueEstimate: number; // in INR
  status: RecordStatus;
  lastUpdated: string;
  lastMutationDate: string;
  qrCodeId: string;
  digitalSealHash?: string;
  encumbranceNotes?: string;
  documentsCount: number;
  ownershipHistory?: OwnershipHistoryStep[];
  attachedDocuments?: AttachedDocument[];
  validationSummary?: ValidationSummary;
}

export type DocumentTypeCategory =
  | 'SALE_DEED'
  | 'MUTATION_ORDER'
  | 'KHATAUNI_ROR'
  | 'EXTRACT_7_12'
  | 'CADASTRAL_MAP'
  | 'REGISTRATION_CERTIFICATE'
  | 'UNKNOWN_MIXED';

export type VisualDocumentType =
  | 'SCANNED_LEGACY_PDF'
  | 'HANDWRITTEN_RECORD'
  | 'CADASTRAL_MAP'
  | 'DIGITAL_PDF';

export interface DocumentClassificationResult {
  documentType: DocumentTypeCategory;
  label: string;
  hindiLabel: string;
  confidence: number; // 0.0 to 1.0
  reasoning: string;
  detectedKeywords: string[];
  visualType: VisualDocumentType;
  secondaryType?: DocumentTypeCategory;
  secondaryConfidence?: number;
  features: {
    hasRevenueStamps: boolean;
    hasCourtCaseNumber: boolean;
    hasCadastralBoundaries: boolean;
    hasShareholdingRatios: boolean;
    hasMapCoordinates: boolean;
    hasGrasChallan: boolean;
  };
}

export type DocumentRegionType = 
  | 'PRINTED_TEXT' 
  | 'HANDWRITTEN_ANNOTATION' 
  | 'STAMP_SEAL' 
  | 'TABLE_FORM';

export interface RegionBoundingBox {
  x: number;      // 0..100 percentage
  y: number;      // 0..100 percentage
  width: number;  // 0..100 percentage
  height: number; // 0..100 percentage
}

export interface DocumentRegion {
  id: string;
  type: DocumentRegionType;
  label: string;
  pageNumber: number;
  bbox: RegionBoundingBox;
  confidence: number;
  extractedText: string;
  script?: 'Devanagari' | 'Latin' | 'Urdu/Perso-Arabic' | 'Mixed';
  metadata?: Record<string, any>;
}

export interface HandwrittenAnnotation {
  id: string;
  pageNumber: number;
  bbox: RegionBoundingBox;
  rawText: string;
  confidence: number;
  intent: 'CORRECTION_OVERRIDE' | 'MARGINAL_NOTE' | 'OFFICER_ENDORSEMENT' | 'SIGNATURE';
  targetField?: string;
  originalPrintedValue?: string;
  handwrittenOverrideValue?: string;
  isCounterSigned: boolean;
  endorsingAuthority?: string;
  riskAssessment: 'VERIFIED_OFFICIAL_AMENDMENT' | 'SUSPICIOUS_UNENDORSED_ALTERATION' | 'INFORMAL_MARGIN_NOTE';
  explanation: string;
}

export interface StampSealItem {
  id: string;
  pageNumber: number;
  bbox: RegionBoundingBox;
  sealType: 'SUB_REGISTRAR_SEAL' | 'REVENUE_COURT_SEAL' | 'TREASURY_CHALLAN' | 'NOTARY_SEAL';
  issuingAuthority: string;
  dateOnSeal?: string;
  confidence: number;
  isAuthentic: boolean;
  serialNumber?: string;
}

export interface TableFormItem {
  id: string;
  pageNumber: number;
  bbox: RegionBoundingBox;
  tableType: 'KHATAUNI_12_COLUMNS' | 'VILLAGE_FORM_7_12' | 'PARCEL_SCHEDULE';
  title: string;
  rowsCount: number;
  columnsCount: number;
  headers: string[];
  sampleData: Record<string, string>[];
}

export interface DocumentLayoutAnalysisResult {
  engine: string;
  totalPages: number;
  regions: DocumentRegion[];
  handwrittenAnnotations: HandwrittenAnnotation[];
  stampsAndSeals: StampSealItem[];
  tablesAndForms: TableFormItem[];
  summary: {
    printedTextCount: number;
    handwrittenCount: number;
    stampSealCount: number;
    tableFormCount: number;
    hasHandwrittenCorrections: boolean;
    tamperingRiskLevel: 'NONE' | 'LOW' | 'HIGH';
    activeCorrectionAlert?: string;
  };
}

export interface ExtractedField {
  label: string;
  key: string;
  value: string;
  confidence: number; // 0.0 to 1.0 (e.g. 0.96 is 96%)
  source?: string; // e.g. "page 1", "page 2", "page 2, line 14"
  isEdited?: boolean;
  originalValue?: string;
  isHandwrittenOverride?: boolean;
  handwrittenOverrideValue?: string;
  sourceBoundingBox?: { x: number; y: number; width: number; height: number };
}

export interface ExtractedData {
  documentTitle: string;
  documentType: string;
  classification?: DocumentClassificationResult;
  specializedData?: Record<string, any>;
  layoutAnalysis?: DocumentLayoutAnalysisResult;
  registrationNumber: string;
  registrationDate: string;
  subRegistrarOffice: string;
  overallConfidence: number; // e.g. 96
  fields: Record<string, ExtractedField>;
  rawExtractedText: string;
  ocrEngineVersion: string;
  processedAt: string;
}

export interface AICheckItem {
  id: string;
  category: 'OCR_FIDELITY' | 'CADASTRAL_ALIGNMENT' | 'TAMPERING_ANALYSIS' | 'ENCUMBRANCE_CHECK';
  title: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  confidence: number;
  description: string;
  detectedDiscrepancy?: string;
}

export interface AIValidationReport {
  id: string;
  recordId: string;
  documentId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  overallConfidenceScore: number; // 0 to 100
  checks: AICheckItem[];
  anomaliesDetected: string[];
  cadastralDiscrepancyPercentage?: number;
  tamperingAlerts?: string[];
  recommendation: 'RECOMMENDED_FOR_APPROVAL' | 'MANUAL_INSPECTION_REQUIRED' | 'HIGH_FRAUD_RISK';
  analyzedAt: string;
}

export interface DocumentSubmission {
  id: string;
  citizenId: string;
  citizenName: string;
  parcelId?: string;
  khasraNo: string;
  surveyNo?: string;
  village: string;
  district: string;
  docType: DocumentTypeCategory | string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
  status: RecordStatus;
  extractedData?: ExtractedData;
  aiValidationReport?: AIValidationReport;
  correctionRemarks?: string;
  reviewerRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface CorrectionRequest {
  id: string;
  documentId: string;
  parcelId?: string;
  khasraNo: string;
  surveyNo?: string;
  village?: string;
  district?: string;
  citizenId: string;
  citizenName: string;
  requestedTypeTitle?: string; // e.g. "Owner Name correction"
  reason: 'INCORRECT_OWNER_NAME' | 'AREA_MISMATCH' | 'BOUNDARY_ERROR' | 'SHARE_RATIO_DISPUTE' | 'MISSING_COOWNER' | 'OTHER';
  description: string;
  currentValue?: string; // e.g. "Rishi Kumar"
  requestedValue?: string; // e.g. "Rishi Sharma"
  evidenceDocName?: string; // e.g. "Name correction document"
  evidenceDocType?: string; // e.g. "Gazette Notification & Aadhaar Verification"
  evidenceDocUrl?: string;
  aiAssessment?: {
    matchLabel: string; // "Likely Match"
    score: number; // 94
    summary: string;
    signals: Array<{
      label: string;
      status: 'PASS' | 'WARNING' | 'FAIL';
      detail: string;
    }>;
  };
  requestedChanges: Array<{
    field: string;
    oldValue: string;
    newValue: string;
  }>;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  resolvedAt?: string;
  officerNotes?: string;
  sealHash?: string;
}

export interface AuditLog {
  id: string;
  recordId: string;
  khasraNo: string;
  action: 
    | 'DOCUMENT_UPLOADED'
    | 'OCR_EXTRACTION_COMPLETED'
    | 'CORRECTION_SUBMITTED'
    | 'AI_VERIFICATION_TRIGGERED'
    | 'DISCREPANCY_FLAGGED'
    | 'RECORD_APPROVED'
    | 'RECORD_REJECTED'
    | 'DIGITAL_SEAL_GENERATED';
  performedBy: string;
  role: UserRole | 'AI_SYSTEM';
  timestamp: string;
  ipAddress: string;
  blockHash: string;
  prevBlockHash: string;
  details: string;
}
