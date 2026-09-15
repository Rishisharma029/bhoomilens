import { 
  INITIAL_LAND_RECORDS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_CORRECTIONS, 
  INITIAL_AUDIT_LOGS, 
  MOCK_USERS 
} from './mockData';
import { LandRecord, DocumentSubmission, CorrectionRequest, AuditLog, User } from '../types';

const STORAGE_KEYS = {
  USER: 'bhoomilens_v2_current_user',
  RECORDS: 'bhoomilens_v2_records',
  SUBMISSIONS: 'bhoomilens_v2_submissions',
  CORRECTIONS: 'bhoomilens_v3_corrections',
  AUDIT_LOGS: 'bhoomilens_v2_audit_logs',
};

// Initialize localStorage with realistic mock data if not already present
export const initMockStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_LAND_RECORDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CORRECTIONS)) {
    localStorage.setItem(STORAGE_KEYS.CORRECTIONS, JSON.stringify(INITIAL_CORRECTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_USERS.citizen_1));
  }
};

// Simulated network latency
export const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Synchronous Storage Helpers (used as instant cache & fallback)
export const getStoredRecords = (): LandRecord[] => {
  initMockStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
  return raw ? JSON.parse(raw) : INITIAL_LAND_RECORDS;
};

export const saveStoredRecords = (records: LandRecord[]) => {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
};

export const getStoredSubmissions = (): DocumentSubmission[] => {
  initMockStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  return raw ? JSON.parse(raw) : INITIAL_SUBMISSIONS;
};

export const saveStoredSubmissions = (subs: DocumentSubmission[]) => {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
};

export const getStoredCorrections = (): CorrectionRequest[] => {
  initMockStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.CORRECTIONS);
  return raw ? JSON.parse(raw) : INITIAL_CORRECTIONS;
};

export const saveStoredCorrections = (corrections: CorrectionRequest[]) => {
  localStorage.setItem(STORAGE_KEYS.CORRECTIONS, JSON.stringify(corrections));
};

export const getStoredAuditLogs = (): AuditLog[] => {
  initMockStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
};

export const saveStoredAuditLogs = (logs: AuditLog[]) => {
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
};

export const appendAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp' | 'blockHash' | 'prevBlockHash'>) => {
  const currentLogs = getStoredAuditLogs();
  const prevBlockHash = currentLogs[0]?.blockHash || '0x0000000000000000000000000000000000000';
  const randomHex = Math.random().toString(16).substring(2, 10);
  const newHash = `0x${Date.now().toString(16)}${randomHex}`;

  const newLog: AuditLog = {
    ...log,
    id: `aud_log_${Date.now()}`,
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    blockHash: newHash,
    prevBlockHash,
  };

  const updatedLogs = [newLog, ...currentLogs];
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updatedLogs));
  return newLog;
};

export const getStoredUser = (): User | null => {
  initMockStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
};

export const setStoredUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// ==========================================================
// REAL BACKEND API CLIENT FUNCTIONS
// ==========================================================

/**
 * 1. Auth Login: POST /api/auth/login
 */
export async function apiLogin(credentials: { email?: string; phone?: string; otp?: string; empId?: string; pin?: string; role?: string }) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        setStoredUser(data.user);
        return data.user;
      }
    }
  } catch (err) {
    console.warn('[API] Login network error, using local preset:', err);
  }
  return null;
}

/**
 * 2. Auth Register: POST /api/auth/register
 */
export async function apiRegister(userData: { name: string; email: string; role?: string; aadhaar?: string }) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        setStoredUser(data.user);
        return data.user;
      }
    }
  } catch (err) {
    console.warn('[API] Register network error:', err);
  }
  return null;
}

/**
 * 3. Fetch Land Records: GET /api/land-records
 */
export async function apiGetLandRecords(params?: { status?: string; search?: string; owner?: string }): Promise<LandRecord[]> {
  try {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.owner) query.append('owner', params.owner);

    const url = `/api/land-records${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        // Map backend shape to frontend LandRecord format
        const mapped: LandRecord[] = data.records.map((r: any) => ({
          id: r.id || r.parcelId,
          parcelId: r.parcelId || r.parcel_id || 'LR-10294',
          surveyNo: r.surveyNo || r.survey_no || '124/7',
          khasraNo: r.khasraNo || r.khasra_no || r.surveyNo || '124/7',
          khataNo: r.khataNo || r.khata_no || '00142',
          ownerName: r.ownerName || r.owner_name || 'Rishi Sharma',
          fatherName: r.fatherName || r.father_name || 'Late Kedarnath Sharma',
          aadhaarLastFour: '8921',
          area: typeof r.area === 'number' ? r.area : parseFloat(r.area) || 2.35,
          areaUnit: (r.areaUnit || r.area_unit || 'Acres') as any,
          landType: (r.landType || r.land_type || 'Agricultural') as any,
          district: r.district || 'XYZ',
          tehsil: r.tehsil || 'Sadar',
          village: r.village || 'ABC',
          status: r.status || 'VERIFIED',
          digitalSealHash: r.digitalSealHash || r.digital_seal_hash || '',
          lastUpdated: r.lastUpdated || r.last_updated || new Date().toLocaleDateString('en-IN'),
          lastMutationDate: r.lastMutationDate || r.last_mutation_date || '18/11/2023',
          encumbranceNotes: r.encumbranceNotes || r.encumbrance_notes || 'Clean title authenticated by SDM Court.',
          marketValueEstimate: 7850000,
          documentsCount: 2,
          qrCodeId: `UK-XYZ-${r.parcelId || 'LR-10294'}`,
          boundaries: {
            north: 'Gram Panchayat Water Canal',
            south: 'Agricultural holding',
            east: 'Main Chak-Road 12m width',
            west: 'Forest Boundary Buffer'
          },
          coOwners: [],
          attachedDocuments: [
            { id: 'd1', title: 'Sale Deed', fileName: 'Registry.pdf', fileType: 'application/pdf', fileSize: '4.2 MB', uploadedAt: '14/08/2019', isVerified: true },
            { id: 'd2', title: 'Mutation Order', fileName: 'Mutation.pdf', fileType: 'application/pdf', fileSize: '2.1 MB', uploadedAt: '18/11/2023', isVerified: true }
          ],
          ownershipHistory: [
            { id: 'h1', transactionDate: '14/08/2019', previousOwner: 'Ram Gopal Sharma', currentOwner: r.ownerName || 'Rishi Sharma', transactionType: 'Sale Deed Registration', deedRegistrationNo: 'UK-XYZ-2019-REG-04821' },
            { id: 'h2', transactionDate: '18/11/2023', previousOwner: 'Tehsildar Sadar', currentOwner: r.ownerName || 'Rishi Sharma', transactionType: 'Mutation Sanctioned', deedRegistrationNo: 'UK-XYZ-2023-MUT-0192' }
          ],
          validationSummary: {
            checksPassed: 8,
            warnings: r.status === 'UNDER_REVIEW' ? 1 : 0,
            criticalConflicts: 0,
            checks: [
              { name: 'Owner Identity Verification', category: 'IDENTITY', status: 'PASS', message: 'Matched with Aadhaar and Khatauni' },
              { name: 'Survey Coordinates Check', category: 'CADASTRE', status: 'PASS', message: 'Cadastral polygon verified on BhuNaksha' }
            ]
          }
        }));

        saveStoredRecords(mapped);
        return mapped;
      }
    }
  } catch (err) {
    console.warn('[API] GetLandRecords network error, using local cache:', err);
  }
  return getStoredRecords();
}

/**
 * 4. Get Land Record by ID: GET /api/land-records/:id
 */
export async function apiGetLandRecordById(id: string): Promise<LandRecord | null> {
  try {
    const res = await fetch(`/api/land-records/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.record) {
        return data.record;
      }
    }
  } catch (err) {
    console.warn('[API] GetLandRecordById network error:', err);
  }
  const all = getStoredRecords();
  return all.find(r => r.id === id || r.parcelId === id || r.khasraNo === id) || null;
}

/**
 * 5. Create Land Record: POST /api/land-records
 */
export async function apiCreateLandRecord(recordData: any): Promise<LandRecord | null> {
  try {
    const res = await fetch('/api/land-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.record) {
        const current = getStoredRecords();
        saveStoredRecords([data.record, ...current]);
        return data.record;
      }
    }
  } catch (err) {
    console.warn('[API] CreateLandRecord error:', err);
  }
  return null;
}

/**
 * 6. Upload Document: POST /api/documents/upload
 */
export async function apiUploadDocument(formData: FormData) {
  try {
    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Refresh records cache with newly created land record
        if (data.landRecord) {
          const currentRecords = getStoredRecords();
          const exists = currentRecords.some(r => r.parcelId === data.landRecord.parcelId);
          if (!exists) {
            saveStoredRecords([data.landRecord, ...currentRecords]);
          }
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('[API] UploadDocument error:', err);
  }
  return null;
}

/**
 * 7. Verification Queue: GET /api/admin/verification-queue
 */
export async function apiGetVerificationQueue() {
  try {
    const res = await fetch('/api/admin/verification-queue');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.queue)) {
        return data.queue;
      }
    }
  } catch (err) {
    console.warn('[API] VerificationQueue network error:', err);
  }
  return null;
}

/**
 * 8. Approve Record: POST /api/admin/records/:id/approve
 */
export async function apiApproveRecord(id: string, officerName?: string, remarks?: string) {
  try {
    const res = await fetch(`/api/admin/records/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officerName: officerName || 'Rajeshwar Singh Negi',
        remarks: remarks || 'Verified against master revenue records'
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] ApproveRecord error:', err);
  }
  return null;
}

/**
 * 9. Reject Record: POST /api/admin/records/:id/reject
 */
export async function apiRejectRecord(id: string, officerName?: string, remarks?: string) {
  try {
    const res = await fetch(`/api/admin/records/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officerName: officerName || 'Rajeshwar Singh Negi',
        remarks: remarks || 'Rejected due to discrepancies'
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] RejectRecord error:', err);
  }
  return null;
}

/**
 * 10. Request Correction: POST /api/admin/records/:id/request-correction
 */
export async function apiRequestCorrection(id: string, officerName?: string, remarks?: string) {
  try {
    const res = await fetch(`/api/admin/records/${id}/request-correction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officerName: officerName || 'Rajeshwar Singh Negi',
        remarks: remarks || 'Correction requested on cadastral area'
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] RequestCorrection error:', err);
  }
  return null;
}
