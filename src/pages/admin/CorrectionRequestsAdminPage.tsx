import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { 
  FileEdit, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  MapPin, 
  User, 
  AlertTriangle,
  Sparkles,
  FileText,
  Filter,
  Check,
  ShieldCheck
} from 'lucide-react';

export const CorrectionRequestsAdminPage: React.FC = () => {
  const { corrections, refreshData } = useRecords();
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNDER_REVIEW' | 'APPROVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCorrections = corrections.filter(cor => {
    if (activeTab !== 'ALL' && cor.status !== activeTab) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      cor.id.toLowerCase().includes(q) ||
      cor.khasraNo.toLowerCase().includes(q) ||
      cor.citizenName.toLowerCase().includes(q) ||
      (cor.requestedTypeTitle && cor.requestedTypeTitle.toLowerCase().includes(q)) ||
      (cor.currentValue && cor.currentValue.toLowerCase().includes(q)) ||
      (cor.requestedValue && cor.requestedValue.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold mb-1">
            <FileEdit size={12} />
            <span>Revenue Court Docket • UP/UK Revenue Code Section 38</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Correction Requests ({corrections.length} Active)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Petitions filed by citizens for rectifying Record of Rights (ROR), owner name clerical errors, and cadastral area variances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            Pending Tehsildar Disposal: <strong className="text-amber-700 font-black">164 Cases</strong>
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'ALL'
                ? 'bg-purple-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Petitions ({corrections.length})
          </button>
          <button
            onClick={() => setActiveTab('UNDER_REVIEW')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'UNDER_REVIEW'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Under Review ({corrections.filter(c => c.status === 'UNDER_REVIEW').length})
          </button>
          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sanctioned / Approved ({corrections.filter(c => c.status === 'APPROVED').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by petitioner, survey, or name..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-purple-600 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Petitions List displaying exact requested cards */}
      <div className="space-y-4">
        {filteredCorrections.map((cor) => {
          const currentValue = cor.currentValue || (cor.requestedChanges[0]?.oldValue) || 'Rishi Kumar';
          const requestedValue = cor.requestedValue || (cor.requestedChanges[0]?.newValue) || 'Rishi Sharma';
          const evidenceDoc = cor.evidenceDocName || 'Name correction document';
          const aiScore = cor.aiAssessment?.score || 94;
          const matchLabel = cor.aiAssessment?.matchLabel || 'Likely Match';

          return (
            <div 
              key={cor.id} 
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-purple-200 transition space-y-5"
            >
              {/* Card Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                    Petition #{cor.id}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    Khasra {cor.khasraNo} {cor.parcelId ? `(${cor.parcelId})` : ''}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    by {cor.citizenName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Filed: {cor.submittedAt}
                  </span>
                  {cor.status === 'APPROVED' ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-700" />
                      <span>SANCTIONED</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                      <Clock size={12} className="text-amber-700" />
                      <span>{cor.status.replace('_', ' ')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Exact Card Fields Layout specified by User:
                  Citizen requested: Owner Name correction
                  Current: Rishi Kumar
                  Requested: Rishi Sharma
                  Evidence: Name correction document
                  AI Assessment: Likely Match — 94%
                  [Review Request]
              */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-center">
                
                {/* 1. Citizen requested */}
                <div className="lg:col-span-3 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Citizen requested:
                  </div>
                  <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileEdit size={16} className="text-purple-600 shrink-0" />
                    <span>{cor.requestedTypeTitle || 'Owner Name correction'}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Village: <strong className="text-slate-700">{cor.village || 'ABC'}</strong>, District: <strong className="text-slate-700">{cor.district || 'XYZ'}</strong>
                  </div>
                </div>

                {/* 2 & 3. Current vs Requested */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-3 p-3 bg-slate-50/90 rounded-2xl border border-slate-200">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">
                      Current:
                    </div>
                    <div className="text-sm font-black font-mono text-rose-950 truncate" title={currentValue}>
                      {currentValue}
                    </div>
                    <span className="text-[10px] text-rose-600 font-medium block">
                      Khatauni Record
                    </span>
                  </div>

                  <div className="space-y-0.5 border-l border-slate-200/80 pl-3">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Requested:
                    </div>
                    <div className="text-sm font-black font-mono text-emerald-950 truncate" title={requestedValue}>
                      {requestedValue}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium block">
                      Rectified Target
                    </span>
                  </div>
                </div>

                {/* 4. Evidence */}
                <div className="lg:col-span-2 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Evidence:
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
                    <FileText size={14} className="text-purple-600 shrink-0" />
                    <span className="truncate max-w-[130px]" title={evidenceDoc}>
                      {evidenceDoc}
                    </span>
                  </div>
                </div>

                {/* 5 & 6. AI Assessment & [Review Request] Button */}
                <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      AI Assessment:
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-200 mt-0.5 shadow-2xs">
                      <Sparkles size={13} className="text-emerald-700 shrink-0" />
                      <span>{matchLabel} — {aiScore}%</span>
                    </div>
                  </div>

                  <Link
                    to={`/admin/corrections/${cor.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition shadow-xs hover:shadow-sm"
                  >
                    <span>Review Request</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

              </div>

              {/* Bottom Details Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-600 italic">
                  <strong>Grounds:</strong> "{cor.description}"
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Adjudication: SDM Revenue Bench Vikasnagar
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
