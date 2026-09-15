import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { 
  ChevronLeft, 
  FileEdit, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Eye, 
  Building2, 
  User, 
  MapPin, 
  Calendar,
  Check,
  Award
} from 'lucide-react';

export const CorrectionReviewPage: React.FC = () => {
  const { id = 'cor_req_101' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { corrections, records, refreshData } = useRecords();

  const [officerNotes, setOfficerNotes] = useState(
    'Upon scrutiny of the petitioner\'s registered conveyance deed, UIDAI biometric verification, official state gazette notification, and the BhoomiLens 94% AI verification score confirming clerical error, the rectification petition is allowed. Direct Lekhpal / Registrar Kanungo to substitute "Rishi Sharma" in place of "Rishi Kumar" in Khatauni LR-10294.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolutionResult, setResolutionResult] = useState<{
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO';
    sealHash?: string;
  } | null>(null);

  // Match correction
  const correction = corrections.find(c => c.id === id) || corrections[0];
  const matchedRecord = records.find(r => 
    (correction?.parcelId && r.parcelId === correction.parcelId) || 
    r.khasraNo === correction?.khasraNo
  );

  const isApproved = correction?.status === 'APPROVED' || resolutionResult?.decision === 'APPROVE';
  const isRejected = correction?.status === 'REJECTED' || resolutionResult?.decision === 'REJECT';

  const handleDecision = async (decision: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO') => {
    if (!correction) return;
    setIsProcessing(true);

    try {
      const result = await adminService.resolveCorrectionRequest({
        correctionId: correction.id,
        decision,
        officerName: user?.name || 'Rajeshwar Singh Negi',
        officerDesignation: (user as any)?.designation || 'Sub-Divisional Magistrate (SDM)',
        officerNotes,
      });

      refreshData();
      setResolutionResult({ decision, sealHash: result.sealHash });
    } catch (err) {
      console.error('Failed to resolve correction request:', err);
      alert('Error updating correction request');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!correction) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Correction request not found.</p>
        <Link to="/admin/corrections" className="text-purple-700 font-bold text-sm underline mt-2 inline-block">
          Return to Correction Requests
        </Link>
      </div>
    );
  }

  const currentValue = correction.currentValue || 'Rishi Kumar';
  const requestedValue = correction.requestedValue || 'Rishi Sharma';
  const evidenceDoc = correction.evidenceDocName || 'Name correction document';
  const aiScore = correction.aiAssessment?.score || 94;
  const matchLabel = correction.aiAssessment?.matchLabel || 'Likely Match';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Breadcrumb & Status Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/corrections"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            title="Back to Corrections"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                Petition #{correction.id}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500">
                Parcel: {correction.parcelId || 'LR-10294'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium">
                Khasra {correction.khasraNo}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {correction.requestedTypeTitle || 'Owner Name correction'} — Review & Adjudication
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isApproved ? (
            <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold flex items-center gap-1.5 border border-emerald-200">
              <CheckCircle2 size={14} className="text-emerald-700" />
              <span>SANCTIONED / APPROVED</span>
            </span>
          ) : isRejected ? (
            <span className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 text-xs font-extrabold flex items-center gap-1.5 border border-rose-200">
              <XCircle size={14} className="text-rose-700" />
              <span>REJECTED</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center gap-1.5 border border-amber-200">
              <Clock size={14} className="text-amber-700" />
              <span>UNDER REVIEW</span>
            </span>
          )}
        </div>
      </div>

      {/* Success Notification Banner on Approval */}
      {resolutionResult?.decision === 'APPROVE' && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Award size={26} />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-emerald-950">
                  Rectification Sanctioned & Recorded Successfully
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  Court Order UK-REV-2026-COR-101
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                The land record for <strong>Parcel {correction.parcelId || 'LR-10294'}</strong> (Khasra {correction.khasraNo}) has been updated from <strong>"{currentValue}"</strong> to <strong>"{requestedValue}"</strong>. An immutable cryptographic rectification seal has been appended to the state land ledger.
              </p>
              {resolutionResult.sealHash && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] font-mono bg-white/90 text-slate-800 px-3 py-1 rounded-lg border border-emerald-200">
                    Digital Seal: <strong>{resolutionResult.sealHash}</strong>
                  </span>
                </div>
              )}
              <div className="pt-2 flex items-center gap-3">
                <Link
                  to={`/admin/records/${matchedRecord?.id || 'rec_uk_10294'}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-200/70 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition"
                >
                  <Eye size={13} />
                  <span>View Updated Land Record</span>
                </Link>
                <Link
                  to="/admin/audit-history"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
                >
                  <span>Inspect Audit Ledger</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage Flow Stepper Ribbon: before -> requested -> evidence -> decision */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Step 1: Before */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center">
              1
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1</div>
              <div className="text-xs font-bold text-slate-800">BEFORE</div>
            </div>
          </div>

          {/* Step 2: Requested */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-50 border border-purple-200">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Step 2</div>
              <div className="text-xs font-bold text-purple-950">REQUESTED</div>
            </div>
          </div>

          {/* Step 3: Evidence */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Step 3</div>
              <div className="text-xs font-bold text-amber-950">EVIDENCE</div>
            </div>
          </div>

          {/* Step 4: Decision */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
              4
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Step 4</div>
              <div className="text-xs font-bold text-emerald-950">DECISION</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Review Grid: Before -> Requested -> Evidence -> Decision */}
      <div className="space-y-6">

        {/* ROW 1: BEFORE & REQUESTED (Side-by-Side Comparison) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. BEFORE (Current Record) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-rose-400" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <span>BEFORE (Current Record)</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500">
                Khatauni 2019 Entry
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  Current Recorded Owner
                </span>
                <div className="text-2xl font-black text-rose-950 font-mono flex items-center gap-2">
                  <span>{currentValue}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-200/70 text-rose-900">
                    Flagged Typo
                  </span>
                </div>
                <p className="text-[11px] text-rose-800 pt-1">
                  Entered during 2019 computerized Khatauni data entry from legacy manual ledger.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Parcel ID</span>
                  <span className="font-mono font-bold text-slate-800">{correction.parcelId || 'LR-10294'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Survey / Khasra</span>
                  <span className="font-mono font-bold text-slate-800">{correction.khasraNo}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Village</span>
                  <span className="font-bold text-slate-800">{correction.village || 'ABC'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">District</span>
                  <span className="font-bold text-slate-800">{correction.district || 'XYZ'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. REQUESTED (Citizen's Correction) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-emerald-500" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <span>REQUESTED (Citizen Correction)</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500">
                Filed: {correction.submittedAt}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Requested Rectified Name
                </span>
                <div className="text-2xl font-black text-emerald-950 font-mono flex items-center gap-2">
                  <span>{requestedValue}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-950">
                    Citizen Verified
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 pt-1">
                  Matches registered 1998 sale deed, Class X certificate, and Aadhaar UIDAI ledger.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Citizen Grounds / Statement
                </span>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{correction.description}"
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <User size={12} />
                  <span>Petitioner: <strong>{correction.citizenName}</strong></span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: EVIDENCE & AI ASSESSMENT */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                <FileText size={15} />
                <span>3. EVIDENCE & AI ASSESSMENT</span>
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Supporting Documentation & Forensic Cross-Verification
              </h2>
            </div>

            {/* AI Assessment Badge matching the exact prompt */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-950 border border-emerald-200 shadow-2xs">
              <Sparkles size={16} className="text-emerald-700" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">AI Assessment</div>
                <div className="text-sm font-black tracking-tight">
                  {matchLabel} — {aiScore}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Primary Evidence Attached Card */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Submitted Evidentiary Documents
              </h3>

              {/* Main Document Box */}
              <div className="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/40 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {evidenceDoc}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {correction.evidenceDocType || 'Gazette Notification & Aadhaar Verification'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                    PDF • 2.4 MB
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-purple-100 leading-relaxed">
                  Contains notarized name rectification affidavit, Uttarakhand State Gazette Publication No. UK-GAZ-2024-8819, and Aadhaar card UIDAI biometric verification receipt.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => alert(`Opening ${evidenceDoc} in secure document viewer...`)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye size={13} />
                    <span>Inspect Document</span>
                  </button>
                  <button
                    onClick={() => alert(`Downloading verified copy of ${evidenceDoc}...`)}
                    className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Secondary corroborating attachments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Original 1998 Registered Sale Deed</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">UK-DEED-1998-041</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>UIDAI Tokenized Aadhaar Ledger</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">XXXX-XXXX-8492</span>
                </div>
              </div>
            </div>

            {/* AI Forensic Reasoning & Signals */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                AI Validation & Identity Signals
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-800">
                    BhoomiLens AI Assessment Report
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    Confidence: 94.2%
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {correction.aiAssessment?.summary || 
                    'High biometric and phonetic correlation (94%). Typographical clerical error confirmed in 2019 computerized record migration from manual register.'}
                </p>

                {/* Evidence Signals Checklist */}
                <div className="space-y-2 pt-1">
                  {(correction.aiAssessment?.signals || [
                    { label: 'UIDAI Aadhaar Linkage', status: 'PASS', detail: 'Tokenized biometric hash matches registered landholder identity.' },
                    { label: '1998 Physical Registry Deed', status: 'PASS', detail: 'Original deed signature verified as "Rishi Sharma".' },
                    { label: 'State Gazette Notification', status: 'PASS', detail: 'UK-GAZ-2024-8819 published and verified on official e-Gazette portal.' },
                    { label: 'Levenshtein Edit Distance', status: 'PASS', detail: 'Distance = 3 (Kumar → Sharma), characteristic of clerical data-entry error.' }
                  ]).map((sig, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-800">{sig.label}</div>
                        <div className="text-[11px] text-slate-500">{sig.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ROW 3: DECISION (Official Adjudication) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>4. DECISION & REVENUE COURT ORDER</span>
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Official Order & Statutory Disposal (Section 38 UP/UK Revenue Code)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
              Presiding: SDM Rajeshwar Singh Negi
            </span>
          </div>

          {/* Order Notes Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Official Finding & Rectification Sanction Order
            </label>
            <textarea
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              rows={4}
              disabled={isApproved || isRejected || isProcessing}
              className="w-full text-xs font-mono p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-600 focus:outline-hidden leading-relaxed text-slate-800 disabled:opacity-80"
              placeholder="Enter judicial reasoning or directions to Registrar Kanungo..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 font-mono">
              Action triggers automatic Khatauni mutation, digital seal, and audit log generation.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isApproved || isRejected || isProcessing}
                onClick={() => handleDecision('REJECT')}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <XCircle size={15} />
                <span>Reject Request</span>
              </button>

              <button
                type="button"
                disabled={isApproved || isRejected || isProcessing}
                onClick={() => handleDecision('REQUEST_MORE_INFO')}
                className="px-4 py-2.5 rounded-xl border border-amber-200 text-amber-900 hover:bg-amber-50 font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <AlertTriangle size={15} />
                <span>Request More Info</span>
              </button>

              <button
                type="button"
                disabled={isApproved || isRejected || isProcessing}
                onClick={() => handleDecision('APPROVE')}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-xs disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>
                  {isProcessing ? 'Executing Sanction...' : isApproved ? 'Sanctioned & Recorded' : 'Approve Correction'}
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
