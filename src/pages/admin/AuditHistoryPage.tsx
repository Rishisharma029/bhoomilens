import React, { useState } from 'react';
import { useRecords } from '../../context/RecordsContext';
import { AuditLog } from '../../types';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Fingerprint, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

export const AuditHistoryPage: React.FC = () => {
  const { auditLogs } = useRecords();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.khasraNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: AuditLog['action']) => {
    switch (action) {
      case 'RECORD_APPROVED':
      case 'DIGITAL_SEAL_GENERATED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DISCREPANCY_FLAGGED':
      case 'RECORD_REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'AI_VERIFICATION_TRIGGERED':
      case 'OCR_EXTRACTION_COMPLETED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CORRECTION_SUBMITTED':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devbhoomi_audit_ledger_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Immutable Audit Trail & Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically chained history of every land record modification, AI scan, and revenue sign-off.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
        >
          <Download size={14} />
          <span>Export Audit Ledger</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Khasra, Officer, Details..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-600">Action Type:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
          >
            <option value="ALL">All Actions</option>
            <option value="RECORD_APPROVED">Record Approved</option>
            <option value="RECORD_REJECTED">Record Rejected</option>
            <option value="DISCREPANCY_FLAGGED">Discrepancy Flagged</option>
            <option value="AI_VERIFICATION_TRIGGERED">AI Scan Run</option>
            <option value="CORRECTION_SUBMITTED">Correction Filed</option>
            <option value="DOCUMENT_UPLOADED">Document Upload</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Khasra / Record</th>
                <th className="py-3.5 px-4">Actor & Role</th>
                <th className="py-3.5 px-4">Audit Details</th>
                <th className="py-3.5 px-4">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getActionBadgeColor(log.action)}`}>
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                    Khasra {log.khasraNo}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-800">{log.performedBy}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Role: {log.role}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[10px] text-slate-500">
                    <div className="flex items-center gap-1 text-purple-700">
                      <Fingerprint size={12} />
                      <span title={log.blockHash}>{log.blockHash.substring(0, 12)}...</span>
                    </div>
                    <span className="text-[9px] text-slate-400">IP: {log.ipAddress}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
