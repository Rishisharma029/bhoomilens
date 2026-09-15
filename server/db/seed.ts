import { db } from './client';
import { userRepo } from './repositories/userRepo';
import { landRecordRepo } from './repositories/landRecordRepo';
import { documentRepo } from './repositories/documentRepo';
import { validationResultRepo } from './repositories/validationResultRepo';
import { correctionRequestRepo } from './repositories/correctionRequestRepo';
import { auditRepo } from './repositories/auditRepo';
import { User, LandRecord, ValidationResult, CorrectionRequest, AuditLog } from './models';

export async function seedDatabase(): Promise<void> {
  console.log('🌱 [BhoomiLens] Beginning PostgreSQL database schema initialization and seeding...');
  await db.initSchema();

  // 1. Seed Core Users (users)
  const seedUsers: User[] = [
    {
      id: 'user_cit_101',
      name: 'Rishi Sharma',
      email: 'rishi.sharma@uttarakhand.gov.in',
      role: 'CITIZEN',
      aadhaar_masked: 'XXXX-XXXX-8921',
      designation: 'Registered Landholder / Citizen',
      jurisdiction: 'District Dehradun, Tehsil Rishikesh'
    },
    {
      id: 'admin_adm_501',
      name: 'Rajeshwar Singh Negi',
      email: 'sdm.dehradun@uk.gov.in',
      role: 'ADMIN',
      aadhaar_masked: 'XXXX-XXXX-4412',
      designation: 'Sub-Divisional Magistrate (SDM)',
      jurisdiction: 'Dehradun Sub-Division, Tehsil Sadar'
    },
    {
      id: 'rev_officer_204',
      name: 'Ramesh Chandra Verma',
      email: 'lekhpal.sadar@uk.gov.in',
      role: 'REVENUE_OFFICER',
      aadhaar_masked: 'XXXX-XXXX-7109',
      designation: 'Revenue Inspector / Lekhpal',
      jurisdiction: 'Halka No. 4, Village ABC'
    }
  ];

  for (const user of seedUsers) {
    await userRepo.create(user);
  }
  console.log(`✅ Seeded ${seedUsers.length} users into [users] table.`);

  // 2. Seed Master Cadastral Records (land_records)
  const seedRecords: any[] = [
    {
      id: 'rec_10294',
      parcel_id: 'LR-10294',
      parcelId: 'LR-10294',
      survey_no: '124/7',
      surveyNo: '124/7',
      khasra_no: '124/7',
      khasraNo: '124/7',
      khata_no: '00142',
      khataNo: '00142',
      district: 'XYZ',
      tehsil: 'Sadar',
      village: 'ABC',
      area: 2.35,
      area_unit: 'Acres',
      areaUnit: 'Acres',
      land_type: 'Agricultural',
      landType: 'Agricultural',
      owner_name: 'Rishi Sharma',
      ownerName: 'Rishi Sharma',
      father_name: 'Late Kedarnath Sharma',
      fatherName: 'Late Kedarnath Sharma',
      status: 'VERIFIED',
      digital_seal_hash: '0x8f2d4e1b7c9a3f5e0d2a4c6b8a1f3e5d7c9b0a2f',
      digitalSealHash: '0x8f2d4e1b7c9a3f5e0d2a4c6b8a1f3e5d7c9b0a2f',
      encumbrance_notes: 'Clear title, mutated vide order no UK-REV-2023-9021',
      last_mutation_date: '2023-11-18',
      lastMutationDate: '18/11/2023',
      last_updated: '2024-03-01T10:00:00Z',
      lastUpdated: '01/03/2024'
    },
    {
      id: 'rec_10295',
      parcel_id: 'LR-10295',
      parcelId: 'LR-10295',
      survey_no: '88/2',
      surveyNo: '88/2',
      khasra_no: '88/2',
      khasraNo: '88/2',
      khata_no: '00098',
      khataNo: '00098',
      district: 'XYZ',
      tehsil: 'Sadar',
      village: 'ABC',
      area: 1.80,
      area_unit: 'Acres',
      areaUnit: 'Acres',
      land_type: 'Residential',
      landType: 'Residential',
      owner_name: 'Amit Kumar',
      ownerName: 'Amit Kumar',
      father_name: 'Suresh Kumar',
      fatherName: 'Suresh Kumar',
      status: 'UNDER_REVIEW',
      digital_seal_hash: '0x4b7e2a9d1c8f5e3a7b9c2e4f6a8d0c2e4f6a8d0c',
      digitalSealHash: '0x4b7e2a9d1c8f5e3a7b9c2e4f6a8d0c2e4f6a8d0c',
      encumbrance_notes: 'Under mutation processing',
      last_mutation_date: '2024-01-15',
      lastMutationDate: '15/01/2024',
      last_updated: '2024-03-12T08:30:00Z',
      lastUpdated: '12/03/2024'
    },
    {
      id: 'rec_10296',
      parcel_id: 'LR-10296',
      parcelId: 'LR-10296',
      survey_no: '45/1',
      surveyNo: '45/1',
      khasra_no: '45/1',
      khasraNo: '45/1',
      khata_no: '00215',
      khataNo: '00215',
      district: 'Dehradun',
      tehsil: 'Rishikesh',
      village: 'Rishikesh Rural',
      area: 4.15,
      area_unit: 'Acres',
      areaUnit: 'Acres',
      land_type: 'Agricultural',
      landType: 'Agricultural',
      owner_name: 'Sunita Devi',
      ownerName: 'Sunita Devi',
      father_name: 'Harish Chandra',
      fatherName: 'Harish Chandra',
      status: 'ACTION_REQUIRED',
      digital_seal_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      digitalSealHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      encumbrance_notes: 'Boundary survey petition filed by adjacent plot',
      last_mutation_date: '2022-08-20',
      lastMutationDate: '20/08/2022',
      last_updated: '2024-02-28T14:15:00Z',
      lastUpdated: '28/02/2024'
    },
    {
      id: 'rec_10297',
      parcel_id: 'LR-10297',
      parcelId: 'LR-10297',
      survey_no: '19/3',
      surveyNo: '19/3',
      khasra_no: '19/3',
      khasraNo: '19/3',
      khata_no: '00044',
      khataNo: '00044',
      district: 'XYZ',
      tehsil: 'Sadar',
      village: 'ABC',
      area: 0.95,
      area_unit: 'Acres',
      areaUnit: 'Acres',
      land_type: 'Commercial',
      landType: 'Commercial',
      owner_name: 'Vikram Malhotra',
      ownerName: 'Vikram Malhotra',
      father_name: 'K.K. Malhotra',
      fatherName: 'K.K. Malhotra',
      status: 'CONFLICT',
      digital_seal_hash: '0x3c2e1d0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
      digitalSealHash: '0x3c2e1d0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
      encumbrance_notes: 'Dual ownership claim under section 229B revenue litigation',
      last_mutation_date: '2021-04-10',
      lastMutationDate: '10/04/2021',
      last_updated: '2024-03-10T16:45:00Z',
      lastUpdated: '10/03/2024'
    }
  ];

  if (db.isLivePostgres()) {
    for (const rec of seedRecords) {
      await db.query(
        `INSERT INTO land_records (
          id, parcel_id, survey_no, khasra_no, khata_no, district, tehsil,
          village, area, area_unit, land_type, owner_name, father_name,
          status, digital_seal_hash, encumbrance_notes, last_mutation_date,
          last_updated
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (parcel_id) DO UPDATE SET
          owner_name = EXCLUDED.owner_name,
          status = EXCLUDED.status,
          digital_seal_hash = EXCLUDED.digital_seal_hash,
          last_updated = CURRENT_TIMESTAMP`,
        [
          rec.id, rec.parcel_id, rec.survey_no, rec.khasra_no, rec.khata_no,
          rec.district, rec.tehsil, rec.village, rec.area, rec.area_unit,
          rec.land_type, rec.owner_name, rec.father_name, rec.status,
          rec.digital_seal_hash, rec.encumbrance_notes, rec.last_mutation_date,
          rec.last_updated
        ]
      );
    }
  }
  // Synchronize local JSON fallback
  const fs = await import('fs');
  const path = await import('path');
  const recordsFile = path.join(process.cwd(), 'server', 'data', 'records.json');
  fs.writeFileSync(recordsFile, JSON.stringify(seedRecords, null, 2), 'utf-8');
  console.log(`✅ Seeded ${seedRecords.length} land parcels into [land_records] table.`);

  // 3. Seed Ingested Documents (documents)
  const seedDocs = [
    {
      id: 'doc_sub_10294',
      citizen_id: 'user_cit_101',
      citizen_name: 'Rishi Sharma',
      parcel_id: 'LR-10294',
      khasra_no: '124/7',
      survey_no: '124/7',
      village: 'ABC',
      district: 'XYZ',
      doc_type: 'SALE_DEED',
      file_name: 'Registry.pdf',
      file_size: '4.2 MB',
      mime_type: 'application/pdf',
      storage_path: 'server/uploads/mock_deed_10294.pdf',
      storage_url: '/mock/deed_10294.pdf',
      file_hash: '0x94fa10b7218e8055c9183ec2cf6de1d5',
      status: 'UNDER_REVIEW',
      uploaded_at: '2024-03-14T09:15:00Z',
      extracted_data: {
        documentTitle: 'REGISTERED SALE DEED (बैनामा)',
        documentType: 'Registered Sale Deed (क्रेता-विक्रेता विलेख)',
        registrationNumber: 'UK-DDN-2019-094182',
        registrationDate: '14/08/2019',
        subRegistrarOffice: 'Sub-Registrar Office, Sadar Dehradun',
        overallConfidence: 96,
        ownerName: 'Rishi Sharma',
        surveyNo: '124/7',
        area: '3.10 Acres',
        village: 'ABC',
        district: 'XYZ'
      }
    },
    {
      id: 'doc_sub_10295',
      citizen_id: 'user_cit_102',
      citizen_name: 'Amit Kumar',
      parcel_id: 'LR-10295',
      khasra_no: '88/2',
      survey_no: '88/2',
      village: 'ABC',
      district: 'XYZ',
      doc_type: 'MUTATION_CERTIFICATE',
      file_name: 'Mutation.pdf',
      file_size: '2.1 MB',
      mime_type: 'application/pdf',
      storage_path: 'server/uploads/mock_mutation_10295.pdf',
      storage_url: '/mock/mutation_10295.pdf',
      file_hash: '0x88bb1944df31ac643e201b10a9f82d11',
      status: 'UNDER_REVIEW',
      uploaded_at: '2024-03-14T11:30:00Z',
      extracted_data: {
        documentTitle: 'MUTATION ORDER (दाखिल-खारिज आदेश)',
        documentType: 'Revenue Mutation Order',
        registrationNumber: 'UK-REV-2024-0192',
        registrationDate: '15/01/2024',
        subRegistrarOffice: 'Tehsildar Court, Sadar',
        overallConfidence: 97,
        ownerName: 'Amit Kumar',
        surveyNo: '88/2',
        area: '1.80 Acres',
        village: 'ABC',
        district: 'XYZ'
      }
    }
  ];

  for (const doc of seedDocs) {
    await documentRepo.create(doc);
  }
  console.log(`✅ Seeded ${seedDocs.length} deed documents into [documents] table.`);

  // 4. Seed Validation Engine Results (validation_results)
  const seedValidations: ValidationResult[] = [
    {
      id: 'val_res_10294',
      document_id: 'doc_sub_10294',
      record_id: 'LR-10294',
      risk_level: 'MEDIUM',
      overall_confidence_score: 82.00,
      recommendation: 'MANUAL_INSPECTION_REQUIRED',
      is_area_mismatch: true,
      is_owner_conflict: false,
      ai_explanation: 'Area differs from the previous registered record by 0.75 acres. Supporting documentation should be reviewed.',
      checks_json: {
        passed_count: 8,
        warning_count: 1,
        conflict_count: 0,
        checks: [
          {
            id: 'chk_owner',
            name: 'Owner Match',
            category: 'IDENTITY',
            status: 'PASSED',
            icon: '✓',
            extracted_value: 'Rishi Sharma',
            expected_value: 'Rishi Sharma',
            confidence: 98,
            detail: 'Owner name exactly matches the official revenue record.'
          },
          {
            id: 'chk_survey',
            name: 'Survey Match',
            category: 'GEOSPATIAL',
            status: 'PASSED',
            icon: '✓',
            extracted_value: '124/7',
            expected_value: '124/7',
            confidence: 99,
            detail: 'Survey & Khasra parcel bounds correctly aligned.'
          },
          {
            id: 'chk_area',
            name: 'Area Mismatch',
            category: 'METRIC',
            status: 'WARNING',
            icon: '⚠',
            extracted_value: '3.10 Acres',
            expected_value: '2.35 Acres',
            confidence: 76,
            detail: 'Area differs from the previous registered record by 0.75 acres. Supporting documentation should be reviewed.'
          },
          {
            id: 'chk_loc',
            name: 'Location Match',
            category: 'GEOSPATIAL',
            status: 'PASSED',
            icon: '✓',
            extracted_value: 'Village ABC, District XYZ',
            expected_value: 'Village ABC, District XYZ',
            confidence: 97,
            detail: 'Village and Tehsil jurisdiction matched.'
          },
          {
            id: 'chk_date',
            name: 'Date Valid',
            category: 'LEGAL',
            status: 'PASSED',
            icon: '✓',
            extracted_value: '14/08/2019',
            expected_value: 'Within valid registration period',
            confidence: 95,
            detail: 'Deed execution stamp date is legally coherent.'
          },
          {
            id: 'chk_rev',
            name: 'Review Required',
            category: 'LEGAL',
            status: 'WARNING',
            icon: '⚠',
            extracted_value: 'Manual Verification Recommended',
            expected_value: 'Automatic Clearance',
            confidence: 82,
            detail: 'Due to area divergence, Sub-Divisional Magistrate manual inspection is mandatory.'
          }
        ]
      }
    },
    {
      id: 'val_res_10295',
      document_id: 'doc_sub_10295',
      record_id: 'LR-10295',
      risk_level: 'LOW',
      overall_confidence_score: 97.00,
      recommendation: 'RECOMMENDED_FOR_APPROVAL',
      is_area_mismatch: false,
      is_owner_conflict: false,
      ai_explanation: 'All cadastral fields, boundaries, and mutation chain verify with 97% confidence.',
      checks_json: {
        passed_count: 9,
        warning_count: 0,
        conflict_count: 0,
        checks: [
          {
            id: 'chk_owner_95',
            name: 'Owner Match',
            category: 'IDENTITY',
            status: 'PASSED',
            icon: '✓',
            extracted_value: 'Amit Kumar',
            expected_value: 'Amit Kumar',
            confidence: 99,
            detail: 'Owner identity verified with zero variance.'
          },
          {
            id: 'chk_area_95',
            name: 'Area Match',
            category: 'METRIC',
            status: 'PASSED',
            icon: '✓',
            extracted_value: '1.80 Acres',
            expected_value: '1.80 Acres',
            confidence: 98,
            detail: 'Area exactly matches master record.'
          }
        ]
      }
    }
  ];

  for (const val of seedValidations) {
    await validationResultRepo.save(val);
  }
  console.log(`✅ Seeded ${seedValidations.length} validation reports into [validation_results] table.`);

  // 5. Seed Correction Requests (correction_requests)
  const seedCorrections: CorrectionRequest[] = [
    {
      id: 'cor_req_101',
      document_id: 'doc_sub_10294',
      parcel_id: 'LR-10294',
      khasra_no: '124/7',
      survey_no: '124/7',
      village: 'ABC',
      district: 'XYZ',
      citizen_id: 'user_cit_101',
      citizen_name: 'Rishi Sharma',
      requested_type_title: 'Owner Name correction',
      reason: 'INCORRECT_OWNER_NAME',
      description: 'The Khatauni record currently reflects Rishi Kumar due to a clerical typo at the Tehsil registry during computerized entry. Actual Aadhaar and registered sale deed reflect Rishi Sharma.',
      current_value: 'Rishi Kumar',
      requested_value: 'Rishi Sharma',
      evidence_doc_name: 'Name_Affidavit_Gazette.pdf',
      evidence_doc_type: 'GAZETTE_AFFIDAVIT',
      evidence_doc_url: '/mock/evidence_gazette.pdf',
      ai_assessment_json: {
        match_confidence: 94,
        verdict: 'Likely Match — 94%',
        levenshtein_distance: 4,
        phonetic_match: true,
        risk_score: 6,
        notes: 'Aadhaar demographic data and registered deed share identical father name and residential address. Typo in surname is consistent with phonetic transcription error.'
      },
      requested_changes_json: {
        field: 'owner_name',
        from: 'Rishi Kumar',
        to: 'Rishi Sharma'
      },
      status: 'UNDER_REVIEW'
    }
  ];

  for (const cor of seedCorrections) {
    await correctionRequestRepo.create(cor);
  }
  console.log(`✅ Seeded ${seedCorrections.length} correction petition into [correction_requests] table.`);

  // 6. Seed Tamper-Evident Audit Logs (audit_logs)
  const seedAuditLogs: Partial<AuditLog>[] = [
    {
      id: 'aud_log_001',
      record_id: 'LR-10294',
      khasra_no: '124/7',
      action: 'RECORD_CREATED',
      performed_by: 'System Cadastral Ingestion',
      role: 'SYSTEM',
      ip_address: '127.0.0.1',
      block_hash: '0x8f2d4e1b7c9a3f5e0d2a4c6b8a1f3e5d7c9b0a2f',
      prev_block_hash: '0x0000000000000000000000000000000000000000',
      details: 'Initial genesis cadastral record created for Parcel LR-10294 (Khasra 124/7).',
      timestamp: '01/03/2024, 10:00 AM'
    },
    {
      id: 'aud_log_002',
      record_id: 'LR-10294',
      khasra_no: '124/7',
      action: 'DOCUMENT_INGESTED',
      performed_by: 'Rishi Sharma',
      role: 'CITIZEN',
      ip_address: '192.168.1.45',
      block_hash: '0x94fa10b7218e8055c9183ec2cf6de1d5',
      prev_block_hash: '0x8f2d4e1b7c9a3f5e0d2a4c6b8a1f3e5d7c9b0a2f',
      details: 'Sale Deed (Registry.pdf) uploaded for AI OCR digitization and verification queue submission.',
      timestamp: '14/03/2024, 09:15 AM'
    },
    {
      id: 'aud_log_003',
      record_id: 'LR-10294',
      khasra_no: '124/7',
      action: 'VALIDATION_ANALYZED',
      performed_by: 'BhoomiLens AI Verification Engine',
      role: 'SYSTEM',
      ip_address: '10.14.88.22',
      block_hash: '0x2e8b4a1c7d9f0e3b5a6c8d1f2e4a6b8c0d2e4f6a',
      prev_block_hash: '0x94fa10b7218e8055c9183ec2cf6de1d5',
      details: 'Automated 6-point verification completed. Score: 82%. Flagged: Area mismatch (2.35 vs 3.10 Acres, variance 0.75 Acres). Status: UNDER_REVIEW.',
      timestamp: '14/03/2024, 09:16 AM'
    },
    {
      id: 'aud_log_004',
      record_id: 'LR-10294',
      khasra_no: '124/7',
      action: 'CORRECTION_PETITION_FILED',
      performed_by: 'Rishi Sharma',
      role: 'CITIZEN',
      ip_address: '192.168.1.45',
      block_hash: '0x5c4d3e2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
      prev_block_hash: '0x2e8b4a1c7d9f0e3b5a6c8d1f2e4a6b8c0d2e4f6a',
      details: 'Correction petition filed: Owner Name correction (Rishi Kumar -> Rishi Sharma). AI Assessment: Likely Match 94%.',
      timestamp: '14/03/2024, 10:20 AM'
    }
  ];

  for (const log of seedAuditLogs) {
    await auditRepo.appendLog(log);
  }
  console.log(`✅ Seeded ${seedAuditLogs.length} cryptographic audit blocks into [audit_logs] table.`);

  console.log('🎉 [BhoomiLens] All 6 core PostgreSQL tables/models successfully initialized & seeded!');
}

// Direct execution
if (process.argv[1] && process.argv[1].includes('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error during database seeding:', err);
      process.exit(1);
    });
}
