import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Clock, 
  History, 
  ExternalLink,
  Sparkles,
  QrCode,
  LandPlot
} from 'lucide-react';

export const SubmissionResultPage: React.FC = () => {
  const { id = 'LR-10294' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records } = useRecords();

  const record = records.find(r => r.parcelId === id || r.id === id || r.khasraNo === id) || records[0];
  const recordIdDisplay = record?.parcelId || id || 'LR-10294';

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Big Green Success Checkmark */}
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <CheckCircle2 size={44} className="stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ✓ Document submitted successfully
            </h1>
            <p className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200 mt-1">
              Record ID: {recordIdDisplay}
            </p>
          </div>
        </div>

        {/* Informational Message */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-center space-y-4">
          <p className="text-sm font-semibold text-slate-700 leading-relaxed max-w-md mx-auto">
            Your document has been digitized and submitted for administrative verification.
          </p>

          <div className="pt-2 border-t border-slate-200 flex flex-col items-center justify-center gap-1.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Current status:
            </span>
            <div className="scale-110 pt-0.5">
              <StatusBadge status="UNDER_REVIEW" size="lg" />
            </div>
          </div>
        </div>

        {/* Verification Pipeline Step Tracker */}
        <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-left">
            <ShieldCheck size={18} className="text-purple-700 shrink-0" />
            <div>
              <p className="font-bold text-[11px]">Assigned to Revenue Administration Queue</p>
              <p className="text-[10px] text-purple-700">Sub-Divisional Magistrate (SDM) • District XYZ</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-purple-300 text-purple-800">
            Docket #2026-XYZ
          </span>
        </div>

        {/* Primary Action: [View Record] */}
        <div className="space-y-3 pt-2">
          <Link
            to={`/citizen/records/${record?.id || 'rec_uk_10294'}`}
            className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 transition hover:scale-[1.01]"
          >
            <span>View Record</span>
            <ArrowRight size={16} />
          </Link>

          <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-500 pt-1">
            <Link
              to="/citizen/history"
              className="hover:text-slate-800 flex items-center gap-1"
            >
              <History size={14} />
              <span>Track Application in Document History</span>
            </Link>
            <span>•</span>
            <Link
              to="/citizen/records"
              className="hover:text-slate-800"
            >
              My Land Records
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
