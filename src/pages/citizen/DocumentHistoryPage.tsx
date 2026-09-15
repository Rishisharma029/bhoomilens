import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatusTimeline } from '../../components/citizen/StatusTimeline';
import { DocumentSubmission } from '../../types';
import { 
  History, 
  FileText, 
  ArrowRight, 
  Search, 
  Download, 
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const DocumentHistoryPage: React.FC = () => {
  const { submissions } = useRecords();
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || 'doc_sub_101');

  const selectedSub = submissions.find(s => s.id === selectedSubId) || submissions[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Document History & Application Lifecycle
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          End-to-end audit trail of all deeds, mutation orders, and correction petitions filed in your vault.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Submissions List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Submitted Documents ({submissions.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {submissions.map((sub) => {
              const isSelected = sub.id === selectedSub?.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                          {sub.fileName}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Khasra: <strong className="text-slate-700">{sub.khasraNo}</strong> • {sub.village}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Uploaded: {sub.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={sub.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Submission Lifecycle Timeline & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedSub ? (
            <div className="space-y-4">
              {/* Document Summary Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Application Ref: {selectedSub.id}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {selectedSub.fileName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedSub.docType.replace('_', ' ')} • {selectedSub.fileSize}
                    </p>
                  </div>
                  <StatusBadge status={selectedSub.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs py-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">District</span>
                    <p className="font-bold text-slate-800">{selectedSub.district}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Village</span>
                    <p className="font-bold text-slate-800">{selectedSub.village}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Khasra No</span>
                    <p className="font-bold text-slate-800">{selectedSub.khasraNo}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Claimant</span>
                    <p className="font-bold text-slate-800 truncate">{selectedSub.citizenName}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/citizen/review-extracted/${selectedSub.id}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>View Extracted OCR Attributes</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    to={`/citizen/correction-request/${selectedSub.id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-amber-700"
                  >
                    File Correction Petition →
                  </Link>
                </div>
              </div>

              {/* Status Timeline */}
              <StatusTimeline
                status={selectedSub.status}
                uploadedAt={selectedSub.uploadedAt}
                reviewedAt={selectedSub.reviewedAt}
                reviewedBy={selectedSub.reviewedBy}
                reviewerRemarks={selectedSub.reviewerRemarks}
                sealHash={selectedSub.status === 'VERIFIED' ? '0x8f2a11b98cf982e043bc123490aafe876251b' : undefined}
              />
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              No document selected. Click any document on the left to inspect its timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
