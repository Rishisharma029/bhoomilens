import React from 'react';
import { RecordStatus } from '../../types';
import { Check, Clock, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface StatusTimelineProps {
  status: RecordStatus;
  uploadedAt?: string;
  reviewedAt?: string;
  reviewerRemarks?: string;
  reviewedBy?: string;
  sealHash?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  status,
  uploadedAt = '12 Sep 2026, 11:42 AM',
  reviewedAt,
  reviewerRemarks,
  reviewedBy,
  sealHash,
}) => {
  const steps = [
    {
      id: 1,
      title: 'Document Uploaded',
      subtitle: uploadedAt,
      isDone: true,
      isCurrent: false,
    },
    {
      id: 2,
      title: 'AI OCR & Data Extraction',
      subtitle: '98% confidence score achieved',
      isDone: true,
      isCurrent: false,
    },
    {
      id: 3,
      title: 'Cadastral GIS Cross-Match',
      subtitle: status === 'FLAGGED_DISCREPANCY' 
        ? 'Boundary variance flagged (+13.5%)' 
        : 'Polygon matched with state map',
      isDone: status !== 'PENDING_AI',
      isCurrent: status === 'PENDING_AI',
      isWarning: status === 'FLAGGED_DISCREPANCY',
    },
    {
      id: 4,
      title: 'Revenue Officer Inspection',
      subtitle: reviewedBy ? `Reviewed by ${reviewedBy}` : 'Pending circle Kanungo verification',
      isDone: status === 'VERIFIED' || status === 'REJECTED',
      isCurrent: status === 'UNDER_REVIEW' || status === 'CORRECTION_REQUESTED',
      isDanger: status === 'REJECTED',
    },
    {
      id: 5,
      title: 'Digital Seal & DigiLocker Delivery',
      subtitle: sealHash ? `Digital Seal: ${sealHash.substring(0, 16)}...` : 'Pending final approval',
      isDone: status === 'VERIFIED',
      isCurrent: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
        <span>Verification Lifecycle Timeline</span>
        <span className="text-[11px] font-mono text-emerald-700 font-semibold">
          NIC Uttarakhand E-Governance
        </span>
      </h4>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
        {steps.map((step) => {
          let badgeBg = 'bg-slate-200 text-slate-500';
          let icon = <span className="text-[10px] font-bold">{step.id}</span>;

          if (step.isDone) {
            badgeBg = 'bg-emerald-600 text-white ring-4 ring-emerald-100';
            icon = <Check size={12} className="stroke-[3]" />;
          } else if (step.isWarning) {
            badgeBg = 'bg-amber-500 text-white ring-4 ring-amber-100';
            icon = <AlertCircle size={12} className="stroke-[3]" />;
          } else if (step.isDanger) {
            badgeBg = 'bg-red-500 text-white ring-4 ring-red-100';
            icon = <X size={12} className="stroke-[3]" />;
          } else if (step.isCurrent) {
            badgeBg = 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse';
            icon = <Clock size={12} className="stroke-[3]" />;
          }

          return (
            <div key={step.id} className="relative group">
              <div
                className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${badgeBg}`}
              >
                {icon}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 leading-none">
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {reviewerRemarks && (
        <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-700" />
            Official Remarks ({reviewedBy}):
          </p>
          <p className="text-slate-600 mt-1 italic leading-relaxed">
            "{reviewerRemarks}"
          </p>
          {reviewedAt && (
            <p className="text-[10px] text-slate-400 mt-1">
              Signed on: {reviewedAt}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
