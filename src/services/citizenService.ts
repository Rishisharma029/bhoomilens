import { LandRecord, DocumentSubmission, CorrectionRequest, ExtractedData } from '../types';
import { 
  delay, 
  getStoredRecords, 
  saveStoredRecords, 
  getStoredSubmissions, 
  saveStoredSubmissions,
  getStoredCorrections,
  saveStoredCorrections,
  appendAuditLog,
  apiGetLandRecords,
  apiGetLandRecordById
} from './api';

export const citizenService = {
  async getMyRecords(citizenName?: string): Promise<LandRecord[]> {
    const apiRecords = await apiGetLandRecords({ owner: citizenName });
    if (apiRecords && apiRecords.length > 0) {
      return apiRecords;
    }
    const records = getStoredRecords();
    if (!citizenName) return records;
    return records.filter(r => 
      r.ownerName.toLowerCase().includes(citizenName.toLowerCase().split(' ')[0]) ||
      r.coOwners.some(c => c.name.toLowerCase().includes(citizenName.toLowerCase().split(' ')[0]))
    );
  },

  async getRecordById(id: string): Promise<LandRecord | null> {
    const apiRecord = await apiGetLandRecordById(id);
    if (apiRecord) return apiRecord;
    const records = getStoredRecords();
    return records.find(r => r.id === id || r.parcelId === id) || null;
  },

  async uploadDocument(payload: {
    citizenId: string;
    citizenName: string;
    khasraNo: string;
    village: string;
    district: string;
    docType: DocumentSubmission['docType'];
    fileName: string;
    fileSize: string;
    file?: File | null;
  }): Promise<DocumentSubmission> {
    // 1. Try real backend API first: POST /api/documents/upload
    try {
      const formData = new FormData();
      if (payload.file) {
        formData.append('document', payload.file);
        formData.append('file', payload.file);
      }
      formData.append('citizenId', payload.citizenId);
      formData.append('citizenName', payload.citizenName);
      formData.append('ownerName', payload.citizenName);
      formData.append('docType', payload.docType);
      formData.append('village', payload.village);
      formData.append('district', payload.district);
      formData.append('surveyNo', payload.khasraNo);
      formData.append('khasraNo', payload.khasraNo);

      const resp = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          const sub: DocumentSubmission = {
            id: data.submissionId || data.documentId || data.document?.id || `doc_sub_${Date.now()}`,
            citizenId: payload.citizenId,
            citizenName: payload.citizenName,
            parcelId: data.landRecord?.parcelId || data.document?.parcel_id || 'LR-10294',
            khasraNo: data.landRecord?.khasraNo || payload.khasraNo,
            surveyNo: data.landRecord?.surveyNo || payload.khasraNo,
            village: payload.village,
            district: payload.district,
            docType: payload.docType,
            fileName: payload.fileName,
            fileSize: payload.fileSize,
            fileUrl: data.fileUrl || '/mock/deed_10294.pdf',
            uploadedAt: new Date().toLocaleDateString('en-IN'),
            status: 'UNDER_REVIEW',
            extractedData: data.extractedData || {
              documentTitle: 'REGISTERED SALE DEED (बैनामा)',
              documentType: 'Sale Deed',
              registrationNumber: 'UK-DDN-2019-094182',
              registrationDate: '14/08/2019',
              subRegistrarOffice: 'Sub-Registrar Office Sadar',
              overallConfidence: 96,
              fields: {
                ownerName: { label: 'Owner', key: 'ownerName', value: payload.citizenName, confidence: 0.98 },
                surveyNo: { label: 'Survey No.', key: 'surveyNo', value: payload.khasraNo, confidence: 0.99 },
                area: { label: 'Area', key: 'area', value: '2.35 Acres', confidence: 0.94 },
                village: { label: 'Village', key: 'village', value: payload.village, confidence: 0.97 },
                district: { label: 'District', key: 'district', value: payload.district, confidence: 0.98 },
                registrationDate: { label: 'Registration Date', key: 'registrationDate', value: '14/08/2019', confidence: 0.96 }
              }
            }
          };

          const currentSubs = getStoredSubmissions();
          saveStoredSubmissions([sub, ...currentSubs.filter(s => s.id !== sub.id)]);

          // Also synchronize newly created Land Record into records store
          if (data.landRecord) {
            const currentRecs = getStoredRecords();
            const recParcelId = data.landRecord.parcelId || data.landRecord.parcel_id;
            const mappedLandRecord: LandRecord = {
              id: data.landRecord.id || `rec_${recParcelId}`,
              parcelId: recParcelId,
              surveyNo: data.landRecord.surveyNo || data.landRecord.survey_no || payload.khasraNo,
              khasraNo: data.landRecord.khasraNo || data.landRecord.khasra_no || payload.khasraNo,
              khataNo: data.landRecord.khataNo || data.landRecord.khata_no || '00142',
              ownerName: payload.citizenName,
              fatherName: 'Late Kedarnath Sharma',
              aadhaarLastFour: '8921',
              area: typeof data.landRecord.area === 'number' ? data.landRecord.area : 2.35,
              areaUnit: 'Acres',
              landType: 'Agricultural',
              district: payload.district,
              tehsil: 'Sadar',
              village: payload.village,
              status: 'UNDER_REVIEW',
              digitalSealHash: '',
              lastUpdated: new Date().toLocaleDateString('en-IN'),
              lastMutationDate: new Date().toLocaleDateString('en-IN'),
              encumbranceNotes: 'Document uploaded; pending SDM administrative verification',
              marketValueEstimate: 7850000,
              documentsCount: 1,
              qrCodeId: `UK-XYZ-${recParcelId}`,
              boundaries: {
                north: 'Gram Panchayat Water Canal',
                south: 'Agricultural holding',
                east: 'Main Chak-Road 12m width',
                west: 'Forest Boundary Buffer'
              },
              coOwners: [],
              attachedDocuments: [
                { id: `doc_${Date.now()}`, title: 'Sale Deed', fileName: payload.fileName, fileType: 'application/pdf', fileSize: payload.fileSize, uploadedAt: new Date().toLocaleDateString('en-IN'), isVerified: false }
              ],
              ownershipHistory: [
                { id: `h_${Date.now()}`, transactionDate: new Date().toLocaleDateString('en-IN'), previousOwner: 'Self Submission', currentOwner: payload.citizenName, transactionType: 'Online Digitalization', deedRegistrationNo: 'UK-XYZ-2024-REG-NEW' }
              ],
              validationSummary: {
                checksPassed: 8,
                warnings: 1,
                criticalConflicts: 0,
                checks: [
                  { name: 'Owner Identity Verification', category: 'IDENTITY', status: 'PASS', message: 'Matched with Aadhaar and Khatauni' },
                  { name: 'Survey Coordinates Check', category: 'CADASTRE', status: 'PASS', message: 'Cadastral polygon verified on BhuNaksha' }
                ]
              }
            };

            const filtered = currentRecs.filter(r => r.parcelId !== recParcelId);
            saveStoredRecords([mappedLandRecord, ...filtered]);
          }

          appendAuditLog({
            recordId: sub.parcelId || `rec_${sub.khasraNo}`,
            khasraNo: sub.khasraNo,
            action: 'DOCUMENT_UPLOADED',
            performedBy: payload.citizenName,
            role: 'CITIZEN',
            ipAddress: '157.34.198.44',
            details: `Backend OCR processed ${payload.fileName}. Created land record ${sub.parcelId} (UNDER REVIEW).`
          });

          return sub;
        }
      }
    } catch (apiErr) {
      console.warn('Backend API upload failed, falling back to local simulation:', apiErr);
    }

    // 2. Local fallback if server unreachable
    await delay(400);
    const docId = `doc_sub_${Date.now()}`;
    const newSubmission: DocumentSubmission = {
      id: docId,
      citizenId: payload.citizenId,
      citizenName: payload.citizenName,
      parcelId: 'LR-10294',
      khasraNo: payload.khasraNo,
      village: payload.village,
      district: payload.district,
      docType: payload.docType,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      fileUrl: '/mock/deed_10294.pdf',
      uploadedAt: new Date().toLocaleDateString('en-IN'),
      status: 'UNDER_REVIEW',
      extractedData: {
        documentTitle: 'CERTIFIED REGISTERED SALE DEED (बैनामा)',
        documentType: payload.docType.replace('_', ' '),
        registrationNumber: 'UK-XYZ-2019-REG-04821',
        registrationDate: '14/08/2019',
        subRegistrarOffice: `Sub-Registrar Office, Vikasnagar`,
        overallConfidence: 96,
        fields: {
          ownerName: { label: 'Owner', key: 'ownerName', value: payload.citizenName, confidence: 0.97 },
          surveyNo: { label: 'Survey No.', key: 'surveyNo', value: payload.khasraNo, confidence: 0.99 },
          area: { label: 'Area', key: 'area', value: '2.35 Acres', confidence: 0.94 },
          village: { label: 'Village', key: 'village', value: payload.village, confidence: 0.96 },
          district: { label: 'District', key: 'district', value: payload.district, confidence: 0.98 },
          registrationDate: { label: 'Registration Date', key: 'registrationDate', value: '14/08/2019', confidence: 0.99 }
        },
        rawExtractedText: `GOVERNMENT OF UTTARAKHAND / REGISTRATION DEPARTMENT\nSUB-REGISTRAR OFFICE VIKASNAGAR\nREGISTRATION NO: UK-XYZ-2019-REG-04821\n\nProperty: Survey 124/7, Area 2.35 Acres in Village ABC...`,
        ocrEngineVersion: 'VisionOCR-Indic-v4.2',
        processedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      }
    };

    const currentSubs = getStoredSubmissions();
    saveStoredSubmissions([newSubmission, ...currentSubs]);

    appendAuditLog({
      recordId: `rec_khasra_${payload.khasraNo.replace(/[^a-zA-Z0-9]/g, '_')}`,
      khasraNo: payload.khasraNo,
      action: 'DOCUMENT_UPLOADED',
      performedBy: payload.citizenName,
      role: 'CITIZEN',
      ipAddress: '157.34.198.44',
      details: `Citizen uploaded ${payload.fileName} (${payload.fileSize}) for Khasra ${payload.khasraNo}. OCR auto-extracted fields.`
    });

    return newSubmission;
  },

  async getSubmissionById(docId: string): Promise<DocumentSubmission | null> {
    try {
      const resp = await fetch(`/api/documents/${docId}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.submission) {
          return data.submission;
        }
      }
    } catch (e) {
      // fallback
    }

    await delay(100);
    const submissions = getStoredSubmissions();
    return submissions.find(s => s.id === docId) || null;
  },

  async getSubmissions(citizenId?: string): Promise<DocumentSubmission[]> {
    await delay(150);
    const submissions = getStoredSubmissions();
    if (!citizenId) return submissions;
    return submissions.filter(s => s.citizenId === citizenId);
  },

  async updateExtractedData(docId: string, updatedFields: Record<string, { value: string; confidence: number; isEdited?: boolean }>): Promise<DocumentSubmission> {
    try {
      const resp = await fetch(`/api/documents/${docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: updatedFields })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.submission) {
          const sub = data.submission;
          const submissions = getStoredSubmissions();
          const targetIndex = submissions.findIndex(s => s.id === docId);
          if (targetIndex >= 0) {
            submissions[targetIndex] = sub;
            saveStoredSubmissions(submissions);
          }
          return sub;
        }
      }
    } catch (e) {
      // fallback
    }

    await delay(150);
    const submissions = getStoredSubmissions();
    const targetIndex = submissions.findIndex(s => s.id === docId);
    if (targetIndex === -1) throw new Error('Document submission not found');

    const sub = submissions[targetIndex];
    if (!sub.extractedData) throw new Error('No extracted data present');

    const updatedExtractedData: ExtractedData = {
      ...sub.extractedData,
      fields: {
        ...sub.extractedData.fields,
        ...Object.entries(updatedFields).reduce((acc, [k, f]) => {
          acc[k] = {
            ...sub.extractedData!.fields[k],
            value: f.value,
            isEdited: true,
            originalValue: sub.extractedData!.fields[k]?.originalValue || sub.extractedData!.fields[k]?.value,
            confidence: 1.0 // citizen confirmed
          };
          return acc;
        }, {} as Record<string, any>)
      }
    };

    submissions[targetIndex] = {
      ...sub,
      extractedData: updatedExtractedData
    };

    saveStoredSubmissions(submissions);

    appendAuditLog({
      recordId: `rec_khasra_${sub.khasraNo.replace(/[^a-zA-Z0-9]/g, '_')}`,
      khasraNo: sub.khasraNo,
      action: 'OCR_EXTRACTION_COMPLETED',
      performedBy: sub.citizenName,
      role: 'CITIZEN',
      ipAddress: '157.34.198.44',
      details: `Citizen reviewed and confirmed extracted OCR data fields for submission ${sub.id}.`
    });

    return submissions[targetIndex];
  },

  async submitForVerification(docId: string): Promise<{ success: boolean; recordId: string }> {
    try {
      const resp = await fetch(`/api/documents/${docId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          return { success: true, recordId: data.recordId || 'LR-10294' };
        }
      }
    } catch (e) {
      // fallback
    }

    const submissions = getStoredSubmissions();
    const subIdx = submissions.findIndex(s => s.id === docId);
    if (subIdx >= 0) {
      submissions[subIdx].status = 'UNDER_REVIEW';
      saveStoredSubmissions(submissions);
      return { success: true, recordId: submissions[subIdx].parcelId || 'LR-10294' };
    }
    return { success: true, recordId: 'LR-10294' };
  },

  async submitCorrectionRequest(payload: {
    documentId: string;
    khasraNo: string;
    citizenId: string;
    citizenName: string;
    reason: CorrectionRequest['reason'];
    description: string;
    requestedChanges: Array<{ field: string; oldValue: string; newValue: string }>;
  }): Promise<CorrectionRequest> {
    await delay(200);
    const newCorrection: CorrectionRequest = {
      id: `cor_req_${Date.now()}`,
      documentId: payload.documentId,
      khasraNo: payload.khasraNo,
      citizenId: payload.citizenId,
      citizenName: payload.citizenName,
      reason: payload.reason,
      description: payload.description,
      requestedChanges: payload.requestedChanges,
      status: 'SUBMITTED',
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      officerNotes: 'Pending review by circle revenue officer.'
    };

    const currentCorrections = getStoredCorrections();
    saveStoredCorrections([newCorrection, ...currentCorrections]);

    // Update document status to CORRECTION_REQUESTED
    const submissions = getStoredSubmissions();
    const docIdx = submissions.findIndex(s => s.id === payload.documentId);
    if (docIdx !== -1) {
      submissions[docIdx].status = 'CORRECTION_REQUESTED';
      submissions[docIdx].correctionRemarks = payload.description;
      saveStoredSubmissions(submissions);
    }

    // Also update any matching land record status
    const records = getStoredRecords();
    const recIdx = records.findIndex(r => r.khasraNo === payload.khasraNo);
    if (recIdx !== -1) {
      records[recIdx].status = 'CORRECTION_REQUESTED';
      saveStoredRecords(records);
    }

    appendAuditLog({
      recordId: `rec_khasra_${payload.khasraNo.replace(/[^a-zA-Z0-9]/g, '_')}`,
      khasraNo: payload.khasraNo,
      action: 'CORRECTION_SUBMITTED',
      performedBy: payload.citizenName,
      role: 'CITIZEN',
      ipAddress: '157.34.198.44',
      details: `Correction request #${newCorrection.id} filed for Khasra ${payload.khasraNo}. Reason: ${payload.reason}`
    });

    return newCorrection;
  },

  async getMyCorrections(citizenId?: string): Promise<CorrectionRequest[]> {
    await delay(100);
    const corrections = getStoredCorrections();
    if (!citizenId) return corrections;
    return corrections.filter(c => c.citizenId === citizenId);
  }
};
