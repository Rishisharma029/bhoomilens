import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LandRecord, DocumentSubmission, CorrectionRequest, AuditLog } from '../types';
import { 
  getStoredRecords, 
  getStoredSubmissions, 
  getStoredCorrections, 
  getStoredAuditLogs,
  apiGetLandRecords
} from '../services/api';

interface RecordsContextType {
  records: LandRecord[];
  submissions: DocumentSubmission[];
  corrections: CorrectionRequest[];
  auditLogs: AuditLog[];
  refreshData: () => void;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export const RecordsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([]);
  const [corrections, setCorrections] = useState<CorrectionRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const refreshData = useCallback(async () => {
    // 1. Instant local cache load
    setRecords(getStoredRecords());
    setSubmissions(getStoredSubmissions());
    setCorrections(getStoredCorrections());
    setAuditLogs(getStoredAuditLogs());

    // 2. Live backend API sync
    try {
      const liveRecords = await apiGetLandRecords();
      if (liveRecords && liveRecords.length > 0) {
        setRecords(liveRecords);
      }
    } catch (e) {
      console.warn('Live records sync failed, using cached store:', e);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Listen to storage events across tabs if multi-tab
    const handleStorageChange = () => {
      refreshData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshData]);

  return (
    <RecordsContext.Provider
      value={{
        records,
        submissions,
        corrections,
        auditLogs,
        refreshData,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
};

export const useRecords = () => {
  const context = useContext(RecordsContext);
  if (!context) throw new Error('useRecords must be used within a RecordsProvider');
  return context;
};
