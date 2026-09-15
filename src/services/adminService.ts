import { 
  DocumentSubmission, 
  LandRecord, 
  AIValidationReport, 
  AuditLog, 
  RecordStatus,
  CorrectionRequest
} from '../types';
import { 
  delay, 
  getStoredRecords, 
  saveStoredRecords, 
  getStoredSubmissions, 
  saveStoredSubmissions, 
  getStoredCorrections,
  saveStoredCorrections,
  getStoredAuditLogs, 
  appendAuditLog 
} from './api';

export const adminService = {
  async getLiveQueueItems(): Promise<Array<{
    recordId: string;
    citizen: string;
    surveyNo: string;
    submitted: string;
    aiScore: number;
    status: string;
    rawRecordId: string;
    location: string;
    docType: string;
  }>> {
    try {
      const resp = await fetch('/api/admin/verification-queue');
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && Array.isArray(data.queue) && data.queue.length > 0) {
          return data.queue;
        }
      }
    } catch (e) {
      console.warn('Live queue fetch failed, using benchmark queue:', e);
    }

    return [
      {
        recordId: 'LR-10294',
        citizen: 'Rishi Sharma',
        surveyNo: '124/7',
        submitted: 'Today',
        aiScore: 82,
        status: 'Review',
        rawRecordId: 'rec_uk_10294',
        location: 'Village ABC, District XYZ',
        docType: 'Registry.pdf'
      },
      {
        recordId: 'LR-10295',
        citizen: 'Amit Kumar',
        surveyNo: '88/2',
        submitted: 'Today',
        aiScore: 97,
        status: 'Review',
        rawRecordId: 'rec_uk_10482',
        location: 'Manglaur Dehat, Haridwar',
        docType: 'Registered_Sale_Deed.pdf'
      },
      {
        recordId: 'LR-10296',
        citizen: 'Sunita Devi Chauhan',
        surveyNo: '304/4',
        submitted: 'Yesterday',
        aiScore: 68,
        status: 'High Risk',
        rawRecordId: 'rec_uk_10651',
        location: 'Dakpathar, Vikasnagar',
        docType: 'Khatauni_ROR.pdf'
      },
      {
        recordId: 'LR-10297',
        citizen: 'Vikram Singh Rawat',
        surveyNo: '512/9',
        submitted: '12 Sep',
        aiScore: 94,
        status: 'Review',
        rawRecordId: 'rec_uk_10903',
        location: 'Kathgodam Rural, Nainital',
        docType: 'Commercial_Deed.pdf'
      },
      {
        recordId: 'LR-10298',
        citizen: 'Pooja Verma',
        surveyNo: '142/2 Kha',
        submitted: '10 Sep',
        aiScore: 99,
        status: 'Auto-Verified',
        rawRecordId: 'rec_uk_10294',
        location: 'Tapovan Khurd, Rishikesh',
        docType: 'Mutation_Order.pdf'
      },
      {
        recordId: 'LR-10299',
        citizen: 'Harish Chandra Pant',
        surveyNo: '64/3',
        submitted: '08 Sep',
        aiScore: 71,
        status: 'High Risk',
        rawRecordId: 'rec_uk_10651',
        location: 'Almora Sadar, Almora',
        docType: 'Partition_Deed.pdf'
      }
    ];
  },

  async getAIValidationReview(id: string): Promise<any> {
    try {
      const resp = await fetch(`/api/admin/records/${id}/validate`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.validation) {
          return data.validation;
        }
      }
    } catch (e) {
      console.warn('Backend validation engine fetch failed:', e);
    }
    return null;
  },

  async getVerificationQueue(): Promise<DocumentSubmission[]> {
    await delay(180);
    const submissions = getStoredSubmissions();
    // Return all submissions requiring officer attention, ordered by priority
    return submissions.sort((a, b) => {
      const priorityOrder: Record<RecordStatus, number> = {
        CONFLICT: 1,
        FLAGGED_DISCREPANCY: 1,
        ACTION_REQUIRED: 2,
        CORRECTION_REQUESTED: 2,
        PENDING_AI: 3,
        UNDER_REVIEW: 4,
        REJECTED: 5,
        VERIFIED: 6
      };
      return (priorityOrder[a.status] || 99) - (priorityOrder[b.status] || 99);
    });
  },

  async getRecordDetails(khasraNoOrId: string): Promise<{
    record?: LandRecord;
    submissions: DocumentSubmission[];
    auditLogs: AuditLog[];
  }> {
    await delay(150);
    const records = getStoredRecords();
    const submissions = getStoredSubmissions();
    const auditLogs = getStoredAuditLogs();

    const record = records.find(r => r.id === khasraNoOrId || r.khasraNo === khasraNoOrId);
    const matchedSubs = submissions.filter(s => 
      (record && s.khasraNo === record.khasraNo) || s.id === khasraNoOrId
    );
    const matchedLogs = auditLogs.filter(l => 
      (record && l.khasraNo === record.khasraNo) || l.recordId.includes(khasraNoOrId)
    );

    return {
      record,
      submissions: matchedSubs,
      auditLogs: matchedLogs
    };
  },

  async getAIValidationReport(docId: string): Promise<AIValidationReport> {
    await delay(200);
    const submissions = getStoredSubmissions();
    const sub = submissions.find(s => s.id === docId);

    if (sub && sub.aiValidationReport) {
      return sub.aiValidationReport;
    }

    // Default generated AI report if not pre-assigned
    const isClean = sub?.khasraNo.includes('142') || sub?.docType === 'MUTATION_CERTIFICATE';
    const report: AIValidationReport = {
      id: `ai_rep_${Date.now()}`,
      recordId: `rec_${sub?.khasraNo || '001'}`,
      documentId: docId,
      riskLevel: isClean ? 'LOW' : 'MEDIUM',
      overallConfidenceScore: isClean ? 96 : 74,
      cadastralDiscrepancyPercentage: isClean ? 0 : 4.2,
      recommendation: isClean ? 'RECOMMENDED_FOR_APPROVAL' : 'MANUAL_INSPECTION_REQUIRED',
      analyzedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      anomaliesDetected: isClean ? [] : [
        'Minor boundary variance of 4.2% along southern stream demarcation.',
        'Stamp duty receipt date precedes execution date by 4 days (within permissible window).'
      ],
      checks: [
        {
          id: 'c1',
          category: 'CADASTRAL_ALIGNMENT',
          title: 'Cadastral GIS Boundary Alignment',
          status: isClean ? 'PASS' : 'WARNING',
          confidence: 0.92,
          description: isClean 
            ? '100% boundary overlap matched with Uttarakhand BhuNaksha GIS layer.' 
            : 'Boundary polygon shows 4.2% variance on Southern agricultural verge.'
        },
        {
          id: 'c2',
          category: 'TAMPERING_ANALYSIS',
          title: 'State Seal & Digital Stamp Forensics',
          status: 'PASS',
          confidence: 0.98,
          description: 'Official Sub-Registrar security watermark, embossing pixel density, and GRAS e-Challan hash verified.'
        },
        {
          id: 'c3',
          category: 'ENCUMBRANCE_CHECK',
          title: 'CERSAI Dual-Mortgage / Non-Encumbrance Check',
          status: 'PASS',
          confidence: 0.99,
          description: 'No prior mortgage, attachment orders by civil courts, or bank lien registered.'
        },
        {
          id: 'c4',
          category: 'OCR_FIDELITY',
          title: 'Indic OCR Optical Character Recognition',
          status: 'PASS',
          confidence: 0.95,
          description: 'High-confidence text extraction across Hindi and English legalese clauses.'
        }
      ]
    };

    return report;
  },

  async executeDecision(payload: {
    documentId: string;
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION';
    officerName: string;
    officerDesignation: string;
    remarks: string;
    conditionPrecedent?: string;
  }): Promise<{ submission: DocumentSubmission; sealHash?: string }> {
    let sealHash: string | undefined;

    // 1. Try real backend adjudication API
    let endpoint = `/api/admin/records/${payload.documentId}/adjudicate`;
    if (payload.decision === 'APPROVE') endpoint = `/api/admin/records/${payload.documentId}/approve`;
    else if (payload.decision === 'REJECT') endpoint = `/api/admin/records/${payload.documentId}/reject`;
    else if (payload.decision === 'REQUEST_CORRECTION') endpoint = `/api/admin/records/${payload.documentId}/request-correction`;

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.sealHash) {
          sealHash = data.sealHash;
        }
      }
    } catch (e) {
      console.warn('Backend adjudication API call failed, synchronizing locally:', e);
    }

    await delay(200);
    const submissions = getStoredSubmissions();
    const subIdx = submissions.findIndex(s => s.id === payload.documentId);
    if (subIdx === -1) throw new Error('Document submission not found');

    const sub = submissions[subIdx];
    let newStatus: RecordStatus;

    if (payload.decision === 'APPROVE') {
      newStatus = 'VERIFIED';
      if (!sealHash) {
        sealHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2, 14)}`;
      }
    } else if (payload.decision === 'REJECT') {
      newStatus = 'REJECTED';
    } else {
      newStatus = 'CORRECTION_REQUESTED';
    }

    sub.status = newStatus;
    sub.reviewedBy = `${payload.officerName} (${payload.officerDesignation})`;
    sub.reviewedAt = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    sub.reviewerRemarks = payload.remarks;

    submissions[subIdx] = sub;
    saveStoredSubmissions(submissions);

    // Update corresponding land record
    const records = getStoredRecords();
    const recIdx = records.findIndex(r => r.khasraNo === sub.khasraNo);
    if (recIdx !== -1) {
      records[recIdx].status = newStatus;
      if (sealHash) {
        records[recIdx].digitalSealHash = sealHash;
      }
      saveStoredRecords(records);
    }

    // Append to audit trail
    const actionType = 
      payload.decision === 'APPROVE' ? 'RECORD_APPROVED' :
      payload.decision === 'REJECT' ? 'RECORD_REJECTED' : 'DISCREPANCY_FLAGGED';

    appendAuditLog({
      recordId: `rec_khasra_${sub.khasraNo.replace(/[^a-zA-Z0-9]/g, '_')}`,
      khasraNo: sub.khasraNo,
      action: actionType,
      performedBy: `${payload.officerName} (${payload.officerDesignation})`,
      role: 'ADMIN',
      ipAddress: '10.14.88.22 (Govt NIC Intranet)',
      details: `${payload.decision} decision executed for Khasra ${sub.khasraNo}. Officer Remarks: "${payload.remarks}". ${sealHash ? `Issued Digital Certificate Seal: ${sealHash}` : ''}`
    });

    return { submission: sub, sealHash };
  },

  async resolveCorrectionRequest(payload: {
    correctionId: string;
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO';
    officerName: string;
    officerDesignation: string;
    officerNotes: string;
  }): Promise<{ correction: CorrectionRequest; sealHash?: string }> {
    await delay(250);
    const corrections = getStoredCorrections();
    const idx = corrections.findIndex(c => c.id === payload.correctionId);
    if (idx === -1) throw new Error('Correction request not found');

    const cor = corrections[idx];
    let newStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
    let sealHash: string | undefined;

    if (payload.decision === 'APPROVE') {
      newStatus = 'APPROVED';
      sealHash = `0xUK_RECT_${Date.now().toString(16).toUpperCase()}_${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    } else if (payload.decision === 'REJECT') {
      newStatus = 'REJECTED';
    } else {
      newStatus = 'UNDER_REVIEW';
    }

    cor.status = newStatus;
    cor.officerNotes = payload.officerNotes;
    cor.resolvedAt = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    if (sealHash) {
      cor.sealHash = sealHash;
    }

    corrections[idx] = cor;
    saveStoredCorrections(corrections);

    // If approved, propagate changes directly to the associated LandRecord
    if (payload.decision === 'APPROVE') {
      const records = getStoredRecords();
      const recIdx = records.findIndex(r => 
        (cor.parcelId && r.parcelId === cor.parcelId) || 
        r.khasraNo === cor.khasraNo || 
        r.id === cor.documentId
      );

      if (recIdx !== -1) {
        // Apply requested changes
        cor.requestedChanges.forEach(chg => {
          if (chg.field.toLowerCase().includes('owner') && cor.requestedValue) {
            records[recIdx].ownerName = cor.requestedValue;
          } else if (chg.field.toLowerCase().includes('area')) {
            const numArea = parseFloat(chg.newValue);
            if (!isNaN(numArea)) {
              records[recIdx].area = numArea;
            }
          }
        });

        records[recIdx].lastUpdated = new Date().toLocaleDateString('en-IN');
        if (sealHash) {
          records[recIdx].digitalSealHash = sealHash;
        }
        saveStoredRecords(records);
      }

      // Log in immutable audit ledger
      appendAuditLog({
        recordId: cor.parcelId || `rec_${cor.khasraNo}`,
        khasraNo: cor.khasraNo,
        action: 'RECORD_APPROVED',
        performedBy: `${payload.officerName} (${payload.officerDesignation})`,
        role: 'ADMIN',
        ipAddress: '10.14.88.22 (Govt NIC Intranet)',
        details: `Rectification Petition #${cor.id} approved. Corrected '${cor.currentValue}' to '${cor.requestedValue}'. Digital Rectification Seal: ${sealHash}`
      });
    } else if (payload.decision === 'REJECT') {
      appendAuditLog({
        recordId: cor.parcelId || `rec_${cor.khasraNo}`,
        khasraNo: cor.khasraNo,
        action: 'RECORD_REJECTED',
        performedBy: `${payload.officerName} (${payload.officerDesignation})`,
        role: 'ADMIN',
        ipAddress: '10.14.88.22 (Govt NIC Intranet)',
        details: `Rectification Petition #${cor.id} rejected. Reason: "${payload.officerNotes}"`
      });
    }

    return { correction: cor, sealHash };
  },

  async getAuditHistory(): Promise<AuditLog[]> {
    await delay(120);
    return getStoredAuditLogs();
  }
};
