-- ==========================================================
-- BhoomiLens Civic-Tech PostgreSQL Database Schema
-- SIH26018 - Intelligent Land Record Digitalization & Verification
-- ==========================================================

-- 1. Users & Personas
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL, -- 'CITIZEN' | 'ADMIN' | 'REVENUE_OFFICER'
    aadhaar_masked VARCHAR(32),
    designation VARCHAR(128),
    jurisdiction VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Cadastral Land Registry (Khatauni & Land Parcels)
CREATE TABLE IF NOT EXISTS land_records (
    id VARCHAR(64) PRIMARY KEY,
    parcel_id VARCHAR(64) UNIQUE NOT NULL,
    survey_no VARCHAR(64) NOT NULL,
    khasra_no VARCHAR(64) NOT NULL,
    khata_no VARCHAR(64),
    district VARCHAR(64) NOT NULL,
    tehsil VARCHAR(64) NOT NULL,
    village VARCHAR(64) NOT NULL,
    area NUMERIC(10, 4) NOT NULL,
    area_unit VARCHAR(32) DEFAULT 'Acres',
    land_type VARCHAR(64) DEFAULT 'Agricultural',
    owner_name VARCHAR(128) NOT NULL,
    father_name VARCHAR(128),
    status VARCHAR(32) DEFAULT 'VERIFIED', -- 'VERIFIED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'CONFLICT'
    digital_seal_hash VARCHAR(128),
    encumbrance_notes TEXT,
    last_mutation_date DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ingested Deeds & Physical Documents (File Storage Registry)
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    citizen_name VARCHAR(128) NOT NULL,
    parcel_id VARCHAR(64),
    khasra_no VARCHAR(64),
    survey_no VARCHAR(64),
    village VARCHAR(64),
    district VARCHAR(64),
    doc_type VARCHAR(64) NOT NULL, -- 'SALE_DEED' | 'KHATAUNI' | 'MUTATION_CERTIFICATE' | 'GIFT_DEED'
    file_name VARCHAR(256) NOT NULL,
    file_size VARCHAR(32) NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    storage_path TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    file_hash VARCHAR(128),
    status VARCHAR(32) DEFAULT 'UNDER_REVIEW', -- 'PENDING_AI' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'CORRECTION_REQUESTED'
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Extracted OCR Records & Structured Fields
CREATE TABLE IF NOT EXISTS extracted_records (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
    document_title VARCHAR(256),
    document_type VARCHAR(128),
    registration_number VARCHAR(128),
    registration_date VARCHAR(64),
    sub_registrar_office VARCHAR(128),
    overall_confidence NUMERIC(5, 2) DEFAULT 96.00,
    owner_name VARCHAR(128),
    survey_no VARCHAR(64),
    area VARCHAR(64),
    village VARCHAR(64),
    district VARCHAR(64),
    fields_json JSONB NOT NULL,
    raw_text TEXT,
    ocr_engine VARCHAR(64),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Validation Engine Results & Discrepancies
CREATE TABLE IF NOT EXISTS validation_results (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
    record_id VARCHAR(64),
    risk_level VARCHAR(32) DEFAULT 'LOW', -- 'LOW' | 'MEDIUM' | 'HIGH'
    overall_confidence_score NUMERIC(5, 2) DEFAULT 96.00,
    recommendation VARCHAR(64), -- 'RECOMMENDED_FOR_APPROVAL' | 'MANUAL_INSPECTION_REQUIRED' | 'HIGH_FRAUD_RISK'
    checks_json JSONB NOT NULL,
    is_area_mismatch BOOLEAN DEFAULT FALSE,
    is_owner_conflict BOOLEAN DEFAULT FALSE,
    ai_explanation TEXT,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Revenue Court Rectification Petitions (Section 38 UP/UK Revenue Code)
CREATE TABLE IF NOT EXISTS correction_requests (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64),
    parcel_id VARCHAR(64),
    khasra_no VARCHAR(64) NOT NULL,
    survey_no VARCHAR(64),
    village VARCHAR(64),
    district VARCHAR(64),
    citizen_id VARCHAR(64),
    citizen_name VARCHAR(128) NOT NULL,
    requested_type_title VARCHAR(128) DEFAULT 'Owner Name correction',
    reason VARCHAR(64) NOT NULL, -- 'INCORRECT_OWNER_NAME' | 'AREA_MISMATCH' | 'BOUNDARY_ERROR'
    description TEXT NOT NULL,
    current_value VARCHAR(128), -- e.g. 'Rishi Kumar'
    requested_value VARCHAR(128), -- e.g. 'Rishi Sharma'
    evidence_doc_name VARCHAR(256),
    evidence_doc_type VARCHAR(128),
    evidence_doc_url TEXT,
    ai_assessment_json JSONB,
    requested_changes_json JSONB,
    status VARCHAR(32) DEFAULT 'UNDER_REVIEW', -- 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
    officer_notes TEXT,
    seal_hash VARCHAR(128),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 7. Tamper-Evident Immutable Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    record_id VARCHAR(64) NOT NULL,
    khasra_no VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    performed_by VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL,
    ip_address VARCHAR(64),
    block_hash VARCHAR(128) NOT NULL,
    prev_block_hash VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & query dispatch
CREATE INDEX IF NOT EXISTS idx_land_records_parcel ON land_records(parcel_id);
CREATE INDEX IF NOT EXISTS idx_land_records_khasra ON land_records(khasra_no);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_extracted_document ON extracted_records(document_id);
CREATE INDEX IF NOT EXISTS idx_validation_results_document ON validation_results(document_id);
CREATE INDEX IF NOT EXISTS idx_corrections_status ON correction_requests(status);
CREATE INDEX IF NOT EXISTS idx_audit_record ON audit_logs(record_id);
