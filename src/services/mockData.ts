import { LandRecord, DocumentSubmission, AIValidationReport, CorrectionRequest, AuditLog, User } from '../types';

export const MOCK_USERS: Record<string, User> = {
  citizen_1: {
    id: 'user_cit_101',
    name: 'Rishi Sharma',
    role: 'CITIZEN',
    email: 'rishi.sharma@bhoomilens.gov.in',
    phone: '+91 98971 23456',
    aadhaarMasked: 'XXXX-XXXX-8492',
    jurisdiction: 'District XYZ • Circle ABC',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  citizen_2: {
    id: 'user_cit_102',
    name: 'Sunita Devi Chauhan',
    role: 'CITIZEN',
    email: 'sunita.chauhan@bhoomilens.gov.in',
    phone: '+91 94120 78912',
    aadhaarMasked: 'XXXX-XXXX-3310',
    jurisdiction: 'Dehradun Circle (Vikasnagar)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  admin_1: {
    id: 'admin_adm_501',
    name: 'Rajeshwar Singh Negi',
    role: 'ADMIN',
    email: 'r.negi.sdm@uk.gov.in',
    phone: '+91 94111 55667',
    designation: 'Sub-Divisional Magistrate (SDM)',
    jurisdiction: 'Dehradun Revenue Division',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  admin_2: {
    id: 'admin_adm_502',
    name: 'Vikram Singh Rawat',
    role: 'ADMIN',
    email: 'v.rawat.ri@uk.gov.in',
    phone: '+91 94111 88990',
    designation: 'Senior Revenue Inspector / Kanungo',
    jurisdiction: 'Haridwar Circle & Land Titling Bureau',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  }
};

export const INITIAL_LAND_RECORDS: LandRecord[] = [
  {
    id: 'rec_uk_10294',
    parcelId: 'LR-10294',
    surveyNo: '124/7',
    khasraNo: '124/7',
    khataNo: '0042',
    district: 'XYZ',
    tehsil: 'Central Tehsil',
    village: 'ABC',
    area: 2.35,
    areaUnit: 'Acres',
    landType: 'Agricultural',
    ownerName: 'Rishi Sharma',
    fatherName: 'Late Bipin Chandra Sharma',
    aadhaarLastFour: '8492',
    coOwners: [
      { name: 'Kavita Sharma', relation: 'Wife', share: '1/3' },
      { name: 'Aditya Sharma', relation: 'Son', share: '1/3' }
    ],
    boundaries: {
      north: 'Survey 124/6 (Gram Panchayat Water Canal)',
      south: 'Survey 124/8 (Agricultural holding of S. Rawat)',
      east: 'Main Chak-Road 12m width',
      west: 'Survey 123/2 (Forest Boundary Buffer)'
    },
    marketValueEstimate: 7850000,
    status: 'VERIFIED',
    lastUpdated: '14/08/2019',
    lastMutationDate: '2019-08-14',
    qrCodeId: 'UK-XYZ-LR-10294',
    digitalSealHash: '0x8f2a11b98cf982e043bc123490aafe876251b44c',
    encumbranceNotes: 'Clean title authenticated by SDM Court. Zero encumbrance.',
    documentsCount: 3,
    ownershipHistory: [
      {
        id: 'hist_1',
        previousOwner: 'Ram Gopal Sharma',
        transactionType: 'Registered Absolute Sale Conveyance',
        transactionDate: '14/08/2019',
        currentOwner: 'Rishi Sharma',
        deedRegistrationNo: 'UK-XYZ-2019-REG-04821',
        considerationAmount: '₹ 62,50,000',
        subRegistrarOffice: 'Sub-Registrar Office, District XYZ'
      },
      {
        id: 'hist_2',
        previousOwner: 'Dharampal Sharma',
        transactionType: 'Ancestral Succession & Mutation (दाखिल खारिज)',
        transactionDate: '22/04/2004',
        currentOwner: 'Ram Gopal Sharma',
        deedRegistrationNo: 'MUT-XYZ-2004-0992',
        subRegistrarOffice: 'Tehsildar Court ABC'
      }
    ],
    attachedDocuments: [
      {
        id: 'doc_att_1',
        title: 'Certified Registered Sale Deed',
        fileName: 'Registry.pdf',
        fileSize: '4.2 MB',
        fileType: 'PDF Document',
        uploadedAt: '14/08/2019',
        isVerified: true
      },
      {
        id: 'doc_att_2',
        title: 'Sanctioned Mutation Order Sheet',
        fileName: 'Mutation.pdf',
        fileSize: '1.8 MB',
        fileType: 'PDF Document',
        uploadedAt: '02/09/2019',
        isVerified: true
      },
      {
        id: 'doc_att_3',
        title: 'Cadastral Demarcation Survey Map',
        fileName: 'Supporting_Document.pdf',
        fileSize: '2.6 MB',
        fileType: 'PDF Document',
        uploadedAt: '15/09/2019',
        isVerified: true
      }
    ],
    validationSummary: {
      checksPassed: 8,
      warnings: 1,
      criticalConflicts: 0,
      checks: [
        { name: 'Cadastral Boundary Polygon Match', category: 'CADASTRE', status: 'PASS', message: '100% boundary overlap matched with state BhuNaksha GIS server.' },
        { name: 'Sub-Registrar State Seal & Watermark', category: 'LEGAL', status: 'PASS', message: 'E-Treasury GRAS challan & official seal pixel density authenticated.' },
        { name: 'CERSAI Non-Encumbrance & Lien Check', category: 'LEGAL', status: 'PASS', message: 'No active non-performing charge, bank mortgage, or civil court stay.' },
        { name: 'Khatauni Fasli Record Alignment', category: 'CADASTRE', status: 'PASS', message: 'Area 2.35 Acres is consistent with 12-Yearly Fasli record.' },
        { name: 'UIDAI Aadhaar Beneficiary Authentication', category: 'IDENTITY', status: 'PASS', message: 'Biometric & demographic token matched for recorded owner.' },
        { name: 'Circle Rate Revenue Tax Clearance', category: 'TAX', status: 'PASS', message: 'Stamp duty and registration fees verified against state treasury.' },
        { name: 'Revenue Court Mutation Sanction', category: 'LEGAL', status: 'PASS', message: 'Section 34/35 UP/UK Revenue Code final mutation decree certified.' },
        { name: 'Physical Survey Demarcation Spot Check', category: 'CADASTRE', status: 'PASS', message: 'Lekhpal site verification report filed without objections.' },
        { name: 'Indic Spelling Character Variance', category: 'IDENTITY', status: 'WARNING', message: 'Deed has minor alternate spelling in Hindi script (ऋषि vs रिशि); verified via Aadhaar linkage.' }
      ]
    }
  },
  {
    id: 'rec_uk_10482',
    parcelId: 'LR-10482',
    surveyNo: '88/1 Ga',
    khasraNo: '88/1 Ga',
    khataNo: '0142',
    district: 'Haridwar',
    tehsil: 'Roorkee',
    village: 'Manglaur Dehat',
    area: 1.15,
    areaUnit: 'Hectares',
    landType: 'Agricultural',
    ownerName: 'Rishi Sharma',
    fatherName: 'Late Bipin Chandra Sharma',
    aadhaarLastFour: '8492',
    coOwners: [],
    boundaries: {
      north: 'Survey 87 (National Highway bypass)',
      south: 'Survey 89 (Agricultural plot of Satish Kumar)',
      east: 'Irrigation Tube-well Channel',
      west: 'Village Abadi Boundary'
    },
    marketValueEstimate: 9800000,
    status: 'UNDER_REVIEW',
    lastUpdated: '12/09/2026',
    lastMutationDate: '2026-01-20',
    qrCodeId: 'UK-HWR-LR-10482',
    encumbranceNotes: 'Recent sale deed mutation pending officer sign-off.',
    documentsCount: 2,
    ownershipHistory: [
      {
        id: 'hist_3',
        previousOwner: 'Harishankar Sharma',
        transactionType: 'Registered Absolute Sale Deed',
        transactionDate: '10/09/2026',
        currentOwner: 'Rishi Sharma',
        deedRegistrationNo: 'UK-ROO-2026-REG-09941',
        considerationAmount: '₹ 62,50,000',
        subRegistrarOffice: 'Sub-Registrar Office, Roorkee II'
      }
    ],
    attachedDocuments: [
      {
        id: 'doc_att_4',
        title: 'Registered Sale Deed',
        fileName: 'Registry.pdf',
        fileSize: '4.8 MB',
        fileType: 'PDF Document',
        uploadedAt: '12/09/2026',
        isVerified: false
      },
      {
        id: 'doc_att_5',
        title: 'BhuNaksha Cadastral Print',
        fileName: 'Supporting_Document.pdf',
        fileSize: '3.1 MB',
        fileType: 'PDF Document',
        uploadedAt: '12/09/2026',
        isVerified: true
      }
    ],
    validationSummary: {
      checksPassed: 7,
      warnings: 2,
      criticalConflicts: 0,
      checks: [
        { name: 'Cadastral Boundary Polygon Match', category: 'CADASTRE', status: 'PASS', message: 'Boundary matches within tolerance threshold.' },
        { name: 'Sub-Registrar State Seal', category: 'LEGAL', status: 'PASS', message: 'Authenticated by Roorkee Sub-Registrar.' },
        { name: 'Mutation Court Order', category: 'LEGAL', status: 'WARNING', message: 'Application currently queued before Tehsildar Court.' }
      ]
    }
  },
  {
    id: 'rec_uk_10651',
    parcelId: 'LR-10651',
    surveyNo: '304/4',
    khasraNo: '304/4',
    khataNo: '0211',
    district: 'Dehradun',
    tehsil: 'Vikasnagar',
    village: 'Dakpathar',
    area: 0.185,
    areaUnit: 'Hectares',
    landType: 'Residential',
    ownerName: 'Rishi Sharma',
    fatherName: 'W/o Late Bipin Chandra Sharma',
    aadhaarLastFour: '8492',
    coOwners: [
      { name: 'Sunita Devi', relation: 'Sister', share: '1/2' }
    ],
    boundaries: {
      north: 'Internal Colony Road (9m width)',
      south: 'Plot No. 18 (Private Bungalow)',
      east: 'Plot No. 15 (Vacant Plot)',
      west: 'Greenbelt verge'
    },
    marketValueEstimate: 3600000,
    status: 'ACTION_REQUIRED',
    lastUpdated: '10/09/2026',
    lastMutationDate: '2026-02-02',
    qrCodeId: 'UK-DED-LR-10651',
    encumbranceNotes: 'Action Required: Area variance flagged against state cadastral GIS survey.',
    documentsCount: 2,
    ownershipHistory: [
      {
        id: 'hist_4',
        previousOwner: 'Mahender Singh Chauhan',
        transactionType: 'Gift Conveyance Deed',
        transactionDate: '01/08/2026',
        currentOwner: 'Rishi Sharma',
        deedRegistrationNo: 'UK-DED-2026-REG-3310',
        subRegistrarOffice: 'Tehsil Office Vikasnagar'
      }
    ],
    attachedDocuments: [
      {
        id: 'doc_att_6',
        title: 'Khatauni Extract',
        fileName: 'Registry.pdf',
        fileSize: '2.1 MB',
        fileType: 'PDF Document',
        uploadedAt: '10/09/2026',
        isVerified: false
      }
    ],
    validationSummary: {
      checksPassed: 5,
      warnings: 2,
      criticalConflicts: 1,
      checks: [
        { name: 'Cadastral GIS Polygon Overlay', category: 'CADASTRE', status: 'FAIL', message: 'Claimed area 0.210 Ha conflicts with BhuNaksha GIS boundary 0.185 Ha.' },
        { name: 'Road Demarcation Alignment', category: 'CADASTRE', status: 'WARNING', message: 'Colony road widening demarcation pending revenue survey.' }
      ]
    }
  },
  {
    id: 'rec_uk_10903',
    parcelId: 'LR-10903',
    surveyNo: '512/9 Ka',
    khasraNo: '512/9 Ka',
    khataNo: '0034',
    district: 'Nainital',
    tehsil: 'Haldwani',
    village: 'Kathgodam Rural',
    area: 0.88,
    areaUnit: 'Hectares',
    landType: 'Commercial',
    ownerName: 'Rishi Sharma',
    fatherName: 'Late Bipin Chandra Sharma',
    aadhaarLastFour: '8492',
    coOwners: [],
    boundaries: {
      north: 'Kathgodam Railway buffer line',
      south: 'Main Nainital Highway',
      east: 'Private Hotel Complex',
      west: 'Panchayat Nala'
    },
    marketValueEstimate: 21500000,
    status: 'CONFLICT',
    lastUpdated: '18/02/2026',
    lastMutationDate: '2026-02-18',
    qrCodeId: 'UK-NTL-LR-10903',
    encumbranceNotes: 'Critical Conflict: Overlapping claim registered by adjacent commercial entity.',
    documentsCount: 3,
    ownershipHistory: [
      {
        id: 'hist_5',
        previousOwner: 'Laxman Bhatt',
        transactionType: 'Commercial Transfer Deed',
        transactionDate: '18/02/2026',
        currentOwner: 'Rishi Sharma',
        deedRegistrationNo: 'UK-NTL-2026-REG-7712',
        subRegistrarOffice: 'Haldwani Sub-Registrar'
      }
    ],
    attachedDocuments: [
      {
        id: 'doc_att_7',
        title: 'Commercial Transfer Deed',
        fileName: 'Registry.pdf',
        fileSize: '5.4 MB',
        fileType: 'PDF Document',
        uploadedAt: '18/02/2026',
        isVerified: false
      },
      {
        id: 'doc_att_8',
        title: 'Mutation Claim Sheet',
        fileName: 'Mutation.pdf',
        fileSize: '2.3 MB',
        fileType: 'PDF Document',
        uploadedAt: '18/02/2026',
        isVerified: false
      }
    ],
    validationSummary: {
      checksPassed: 4,
      warnings: 1,
      criticalConflicts: 2,
      checks: [
        { name: 'Boundary Overlap Conflict', category: 'CADASTRE', status: 'FAIL', message: 'Survey boundary collides with Khasra 512/8 buffer zone.' },
        { name: 'Prior Charge / Mortgage Check', category: 'LEGAL', status: 'FAIL', message: 'Civil court caveat detected on northern highway frontage.' }
      ]
    }
  }
];

export const INITIAL_SUBMISSIONS: DocumentSubmission[] = [
  {
    id: 'doc_sub_10294',
    citizenId: 'user_cit_101',
    citizenName: 'Rishi Sharma',
    parcelId: 'LR-10294',
    khasraNo: '124/7',
    surveyNo: '124/7',
    village: 'ABC',
    district: 'XYZ',
    docType: 'SALE_DEED',
    fileName: 'Registry.pdf',
    fileSize: '4.2 MB',
    fileUrl: '/mock/registry_10294.pdf',
    uploadedAt: '14/08/2019',
    status: 'VERIFIED',
    extractedData: {
      documentTitle: 'CERTIFIED REGISTERED SALE DEED (बैनामा)',
      documentType: 'Registered Absolute Conveyance Deed',
      registrationNumber: 'UK-XYZ-2019-REG-04821',
      registrationDate: '14/08/2019',
      subRegistrarOffice: 'Sub-Registrar Office, District XYZ',
      overallConfidence: 96,
      fields: {
        ownerName: { label: 'Owner', key: 'ownerName', value: 'Rishi Sharma', confidence: 0.98 },
        surveyNo: { label: 'Survey No.', key: 'surveyNo', value: '124/7', confidence: 0.99 },
        area: { label: 'Area', key: 'area', value: '2.35 acres', confidence: 0.96 },
        village: { label: 'Village', key: 'village', value: 'ABC', confidence: 0.97 },
        district: { label: 'District', key: 'district', value: 'XYZ', confidence: 0.98 },
        registrationDate: { label: 'Registration Date', key: 'registrationDate', value: '14/08/2019', confidence: 0.99 },
        sellerName: { label: 'Previous Owner / Vendor', key: 'sellerName', value: 'Ram Gopal Sharma', confidence: 0.95 },
        considerationAmount: { label: 'Transaction Consideration', key: 'considerationAmount', value: '₹ 62,50,000', confidence: 0.98 },
        stampDutyPaid: { label: 'E-Stamp Duty Paid', key: 'stampDutyPaid', value: '₹ 3,12,500 (Verified GRAS)', confidence: 0.97 }
      },
      rawExtractedText: `GOVERNMENT OF UTTARAKHAND / REGISTRATION DEPARTMENT\nSUB-REGISTRAR OFFICE DISTRICT XYZ\nREGISTRATION NO: UK-XYZ-2019-REG-04821\nDATE: 14/08/2019\n\nThis Deed of Absolute Sale is executed on 14th August 2019 between Sri Ram Gopal Sharma (Vendor) AND Sri Rishi Sharma s/o Late Bipin Chandra Sharma (Purchaser)...\nProperty described as Survey No. 124/7, Measuring Area 2.35 Acres in Village ABC, District XYZ.`,
      ocrEngineVersion: 'VisionOCR-Indic-v4.2',
      processedAt: '14/08/2019 11:44 AM'
    }
  },
  {
    id: 'doc_sub_101',
    citizenId: 'user_cit_101',
    citizenName: 'Rishi Sharma',
    parcelId: 'LR-10482',
    khasraNo: '88/1 Ga',
    surveyNo: '88/1 Ga',
    village: 'Manglaur Dehat',
    district: 'Haridwar',
    docType: 'SALE_DEED',
    fileName: 'Registered_Sale_Deed_Khasra_88-1Ga.pdf',
    fileSize: '4.8 MB',
    fileUrl: '/mock/deed_881ga.pdf',
    uploadedAt: '12/09/2026',
    status: 'UNDER_REVIEW',
    extractedData: {
      documentTitle: 'CERTIFIED REGISTERED SALE DEED (बैनामा)',
      documentType: 'Registered Absolute Conveyance Deed',
      registrationNumber: 'UK-ROO-2026-REG-09941',
      registrationDate: '10/09/2026',
      subRegistrarOffice: 'Sub-Registrar Office, Roorkee II',
      overallConfidence: 94,
      fields: {
        ownerName: { label: 'Owner', key: 'ownerName', value: 'Rishi Sharma', confidence: 0.97 },
        surveyNo: { label: 'Survey No.', key: 'surveyNo', value: '88/1 Ga', confidence: 0.99 },
        area: { label: 'Area', key: 'area', value: '1.150 Hectares', confidence: 0.94 },
        village: { label: 'Village', key: 'village', value: 'Manglaur Dehat', confidence: 0.96 },
        district: { label: 'District', key: 'district', value: 'Haridwar', confidence: 0.98 },
        registrationDate: { label: 'Registration Date', key: 'registrationDate', value: '10/09/2026', confidence: 0.99 }
      },
      rawExtractedText: `GOVERNMENT OF UTTARAKHAND / REGISTRATION DEPARTMENT\nSUB-REGISTRAR OFFICE ROORKEE\nREGISTRATION NO: UK-ROO-2026-REG-09941\n\nProperty described as Survey 88/1 Ga, Area 1.15 Hectares in Village Manglaur Dehat...`,
      ocrEngineVersion: 'VisionOCR-Indic-v4.2',
      processedAt: '12/09/2026 11:44 AM'
    }
  }
];

export const INITIAL_CORRECTIONS: CorrectionRequest[] = [
  {
    id: 'cor_req_101',
    documentId: 'doc_att_1',
    parcelId: 'LR-10294',
    khasraNo: '124/7',
    surveyNo: '124/7',
    village: 'ABC',
    district: 'XYZ',
    citizenId: 'user_cit_101',
    citizenName: 'Rishi Sharma',
    requestedTypeTitle: 'Owner Name correction',
    reason: 'INCORRECT_OWNER_NAME',
    currentValue: 'Rishi Kumar',
    requestedValue: 'Rishi Sharma',
    evidenceDocName: 'Name correction document',
    evidenceDocType: 'Gazette Notification & Aadhaar Card Verification',
    evidenceDocUrl: '/mock/name_correction_gazette.pdf',
    aiAssessment: {
      matchLabel: 'Likely Match',
      score: 94,
      summary: 'High biometric and phonetic correlation (94%). Typographical clerical error confirmed in 2019 computerized record migration from manual register.',
      signals: [
        { label: 'UIDAI Aadhaar Linkage', status: 'PASS', detail: 'Tokenized biometric hash matches registered landholder identity.' },
        { label: '1998 Physical Registry Deed', status: 'PASS', detail: 'Original deed signature verified as "Rishi Sharma".' },
        { label: 'State Gazette Notification', status: 'PASS', detail: 'UK-GAZ-2024-8819 published and verified on official e-Gazette portal.' },
        { label: 'Levenshtein Edit Distance', status: 'PASS', detail: 'Distance = 3 (Kumar → Sharma), characteristic of clerical data-entry error.' }
      ]
    },
    description: 'Typographical error in recorded Khatauni. My legal surname is Sharma as per registered 1998 sale deed, Class X certificate, and Gazette notification, but was inadvertently entered as "Kumar" during 2019 digitisation.',
    requestedChanges: [
      { field: 'Owner Name', oldValue: 'Rishi Kumar', newValue: 'Rishi Sharma' }
    ],
    status: 'UNDER_REVIEW',
    submittedAt: '13/09/2026',
    officerNotes: 'Adjudication pending under UP/UK Revenue Code Section 38 (Correction of clerical mistakes in Record of Rights).'
  },
  {
    id: 'cor_req_901',
    documentId: 'doc_sub_102',
    parcelId: 'LR-10651',
    khasraNo: '304/4',
    surveyNo: '304/4',
    village: 'Dakpathar',
    district: 'Dehradun',
    citizenId: 'user_cit_101',
    citizenName: 'Rishi Sharma',
    requestedTypeTitle: 'Cadastral Area Variance correction',
    reason: 'AREA_MISMATCH',
    currentValue: '0.210 Hectares',
    requestedValue: '0.185 Hectares',
    evidenceDocName: 'Lekhpal Spot Demarcation Report',
    evidenceDocType: 'Cadastral Resurvey Field Map',
    aiAssessment: {
      matchLabel: 'Spot Check Recommended',
      score: 82,
      summary: 'Area reduction of 0.025 Hectares corresponds with 2023 PWD road widening project.',
      signals: [
        { label: 'PWD Acquisition Award', status: 'PASS', detail: 'Road widening notification gazetted in 2023.' },
        { label: 'Boundary Polygon Alignment', status: 'PASS', detail: '0.185 Ha matches current GIS satellite footprint.' }
      ]
    },
    description: 'Physical demarcation survey carried out by Lekhpal shows 0.185 Hectares after road widening, whereas old deed had 0.210 Ha. Requesting update to match on-ground 0.185 Ha.',
    requestedChanges: [
      { field: 'Area', oldValue: '0.210 Hectares', newValue: '0.185 Hectares' }
    ],
    status: 'UNDER_REVIEW',
    submittedAt: '11/09/2026',
    officerNotes: 'Assigned to Kanungo for spot measurement verification.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_log_001',
    recordId: 'rec_uk_10294',
    khasraNo: '124/7',
    action: 'RECORD_APPROVED',
    performedBy: 'Rajeshwar Singh Negi (SDM)',
    role: 'ADMIN',
    timestamp: '14/08/2019 04:30 PM',
    ipAddress: '10.14.88.22 (Govt NIC Intranet)',
    blockHash: '0x8f2a11b98cf982e043bc123490aafe876251b',
    prevBlockHash: '0x3c7109ff8217bb4199aa0821bca9012351221',
    details: 'Digital Seal affixed for LR-10294 (Survey 124/7). Final Title Certification generated and dispatched to DigiLocker.'
  },
  {
    id: 'aud_log_002',
    recordId: 'rec_uk_10294',
    khasraNo: '124/7',
    action: 'AI_VERIFICATION_TRIGGERED',
    performedBy: 'BhoomiLens AI Engine',
    role: 'AI_SYSTEM',
    timestamp: '14/08/2019 11:45 AM',
    ipAddress: 'Internal AI Cluster #04',
    blockHash: '0x3c7109ff8217bb4199aa0821bca9012351221',
    prevBlockHash: '0x1a88bb912300482caef0991482012bc091244',
    details: 'Automated OCR completed with 96% confidence score. 8 checks passed, 1 warning, 0 conflicts.'
  }
];
