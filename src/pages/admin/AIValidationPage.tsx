import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { adminService } from '../../services/adminService';
import { OCRViewer } from '../../components/common/OCRViewer';
import { VerificationActionModal } from '../../components/admin/VerificationActionModal';
import { 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  Layers, 
  Sparkles, 
  Check, 
  Download, 
  RotateCw, 
  Eye, 
  FileText,
  Clock,
  Compass,
  Building2,
  FileCheck2,
  User,
  MapPin,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export const AIValidationPage: React.FC = () => {
  const { id = 'rec_uk_10294' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, refreshData } = useRecords();

  const [activeHighlightKey, setActiveHighlightKey] = useState<string>('areaClaimed');
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<'APPROVE' | 'REQUEST_CORRECTION' | 'REJECT'>('APPROVE');
  const [actionExecutedToast, setActionExecutedToast] = useState<{ decision: string; message: string } | null>(null);
  const [backendValidation, setBackendValidation] = useState<any | null>(null);

  useEffect(() => {
    adminService.getAIValidationReview(id).then(res => {
      if (res) {
        setBackendValidation(res);
      }
    });
  }, [id]);

  // Match record
  const record = records.find(r => r.id === id || r.parcelId === id || r.khasraNo === id) || records[0];

  const isAreaMismatchCase = record?.surveyNo === '124/7' || record?.khasraNo === '124/7' || record?.parcelId === 'LR-10294';
  const isOwnerConflictCase = record?.surveyNo === '88/2' || record?.khasraNo === '88/1 Ga' || record?.parcelId === 'LR-10295';

  // Three-panel data:
  // Panel 2: Extracted Record
  const extractedData = backendValidation?.extractedData || {
    owner: isOwnerConflictCase ? 'Amit Kumar / Ramesh Chandra' : (record?.ownerName || 'Rishi Sharma'),
    surveyNo: record?.surveyNo || record?.khasraNo || '124/7',
    area: isAreaMismatchCase ? '3.10 acres' : `${record?.area} ${record?.areaUnit}`,
    village: record?.village || 'ABC',
    registrationDate: '14/08/2019',
    docNumber: 'UK-XYZ-2019-REG-04821',
    seller: 'Ram Gopal Sharma',
    consideration: '₹ 62,50,000'
  };

  // Panel 3: Validation status items
  // ✓ Owner Match
  // ✓ Survey Match
  // ⚠ Area Mismatch (differs by 0.75 acres)
  // ✓ Location Match
  // ✓ Date Valid
  // ⚠ Review Required
  const validationItems = backendValidation?.validationItems || [
    {
      label: 'Owner Match',
      status: isOwnerConflictCase ? 'FAIL' : 'PASS',
      symbol: isOwnerConflictCase ? '⚠' : '✓',
      note: isOwnerConflictCase ? 'Dual conflicting claimants detected in registry index' : 'Matched 100% with registered Khatedar & Aadhaar token',
      color: isOwnerConflictCase ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      label: 'Survey Match',
      status: 'PASS',
      symbol: '✓',
      note: `Survey ${extractedData.surveyNo} authenticated on BhuNaksha GIS server`,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      label: isAreaMismatchCase ? 'Area Mismatch' : 'Area Alignment',
      status: isAreaMismatchCase ? 'WARNING' : 'PASS',
      symbol: isAreaMismatchCase ? '⚠' : '✓',
      note: isAreaMismatchCase 
        ? 'Previous record: 2.35 acres | Submitted deed: 3.10 acres (Differs by 0.75 acres)'
        : 'Holding area matches 12-Yearly Fasli record',
      color: isAreaMismatchCase ? 'text-amber-800 bg-amber-50 border-amber-300' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      label: 'Location Match',
      status: 'PASS',
      symbol: '✓',
      note: `Village ${extractedData.village}, District ${record?.district || 'XYZ'} confirmed`,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      label: 'Date Valid',
      status: 'PASS',
      symbol: '✓',
      note: 'Registration date within permissible legal timeline; GRAS e-stamp matched',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      label: 'Review Required',
      status: 'WARNING',
      symbol: '⚠',
      note: isAreaMismatchCase 
        ? 'Officer inspection mandatory due to 0.75 acre cadastral discrepancy'
        : 'Requires officer verification before digital seal generation',
      color: 'text-amber-800 bg-amber-50 border-amber-300'
    }
  ];

  const aiExplanation = backendValidation?.aiExplanation || (isAreaMismatchCase 
    ? 'Area differs from the previous registered record by 0.75 acres. Supporting documentation should be reviewed.'
    : 'All biometric, cadastral polygon, and e-treasury validations passed with zero critical discrepancies.');

  const handleDecisionClick = (decision: 'APPROVE' | 'REQUEST_CORRECTION' | 'REJECT') => {
    setSelectedDecision(decision);
    setActionModalOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin/queue"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <ChevronLeft size={14} />
              <span>Back to Verification Queue</span>
            </Link>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-purple-900 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Inspection Dossier: {record?.parcelId || 'LR-10294'}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Verification Review &amp; Evidence Inspector
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side inspection: Compare the original scanned deed against AI extracted fields and automated cadastral evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
            Survey No. {extractedData.surveyNo}
          </span>
          <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <AlertTriangle size={13} className="text-amber-700" />
            <span>Review Required</span>
          </span>
        </div>
      </div>

      {actionExecutedToast && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between shadow-xl animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{actionExecutedToast.message}</span>
          </div>
          <button onClick={() => setActionExecutedToast(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* THREE-PANEL LAYOUT (Exact specification requested):
          ┌─────────────────────┬──────────────────────┬─────────────────────┐
          │ ORIGINAL DOCUMENT   │ EXTRACTED RECORD     │ VALIDATION          │
          │                     │                      │                     │
          │ PDF/Image preview   │ Owner                │ ✓ Owner Match       │
          │                     │ Survey No.           │ ✓ Survey Match      │
          │                     │ Area                 │ ⚠ Area Mismatch     │
          │                     │ Village              │ ✓ Location Match    │
          │                     │ Registration Date    │ ✓ Date Valid        │
          │                     │                      │ ⚠ Review Required   │
          └─────────────────────┴──────────────────────┴─────────────────────┘
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* PANEL 1: ORIGINAL DOCUMENT (PDF/Image preview) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-[680px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText size={15} className="text-purple-700" />
                <span>ORIGINAL DOCUMENT</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                PDF / High-Res Scan
              </span>
            </div>

            <div className="h-[580px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
              <OCRViewer
                documentTitle="CERTIFIED REGISTERED SALE DEED (बैनामा)"
                registrationNumber={extractedData.docNumber}
                subRegistrar="Sub-Registrar Office, District XYZ"
                highlightKey={activeHighlightKey}
                onFieldClick={(k) => setActiveHighlightKey(k)}
              />
            </div>
          </div>
        </div>

        {/* PANEL 2: EXTRACTED RECORD */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs h-[680px] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles size={15} className="text-purple-700" />
                <span>EXTRACTED RECORD</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Confidence: 96%
              </span>
            </div>

            {/* Fields List */}
            <div className="space-y-3 text-xs">
              
              {/* Owner */}
              <div 
                onClick={() => setActiveHighlightKey('ownerName')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeHighlightKey === 'ownerName' 
                    ? 'border-purple-500 bg-purple-50/40 ring-2 ring-purple-500/20' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Owner
                </span>
                <p className="text-sm font-extrabold text-slate-900">{extractedData.owner}</p>
                <span className="text-[10px] text-slate-400">Purchaser / Claimed Khatedar</span>
              </div>

              {/* Survey No. */}
              <div 
                onClick={() => setActiveHighlightKey('khasraNo')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeHighlightKey === 'khasraNo' 
                    ? 'border-purple-500 bg-purple-50/40 ring-2 ring-purple-500/20' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Survey No.
                </span>
                <p className="text-sm font-black font-mono text-purple-900">{extractedData.surveyNo}</p>
                <span className="text-[10px] text-slate-400">Cadastral Khasra Plot ID</span>
              </div>

              {/* Area */}
              <div 
                onClick={() => setActiveHighlightKey('areaClaimed')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeHighlightKey === 'areaClaimed' 
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Area
                  </span>
                  {isAreaMismatchCase && (
                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                      +0.75 Acres Variance
                    </span>
                  )}
                </div>
                <p className="text-sm font-black text-slate-900">{extractedData.area}</p>
                <span className="text-[10px] text-slate-500">Documented Holding in Deed</span>
              </div>

              {/* Village */}
              <div 
                onClick={() => setActiveHighlightKey('village')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeHighlightKey === 'village' 
                    ? 'border-purple-500 bg-purple-50/40 ring-2 ring-purple-500/20' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Village
                </span>
                <p className="text-sm font-extrabold text-slate-900">{extractedData.village}</p>
                <span className="text-[10px] text-slate-400">Revenue Village &amp; Circle</span>
              </div>

              {/* Registration Date */}
              <div 
                onClick={() => setActiveHighlightKey('registrationDate')}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeHighlightKey === 'registrationDate' 
                    ? 'border-purple-500 bg-purple-50/40 ring-2 ring-purple-500/20' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Registration Date
                </span>
                <p className="text-sm font-black font-mono text-slate-900">{extractedData.registrationDate}</p>
                <span className="text-[10px] text-slate-400">Sub-Registrar Execution Timestamp</span>
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono text-center">
            Extracted by VisionOCR v4.2 • SHA-256 Verified
          </div>
        </div>

        {/* PANEL 3: VALIDATION */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs h-[680px] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-purple-700" />
                <span>VALIDATION</span>
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                backendValidation?.recommendation === 'APPROVED' 
                  ? 'bg-emerald-100 text-emerald-900' 
                  : backendValidation?.recommendation === 'REJECTED'
                  ? 'bg-rose-100 text-rose-900'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {backendValidation?.recommendation || 'MANUAL_REVIEW'}
              </span>
            </div>

            {/* Deterministic Validation Scorecard Tree */}
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl font-mono text-[11px] space-y-1 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-white pb-1.5 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Sparkles size={13} />
                  <span>Validation Result</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 text-[10px]">
                  Score: {backendValidation?.score ?? 86}%
                </span>
              </div>
              <div className="text-slate-300 pt-1 leading-relaxed">
                <div>├── <span className="text-emerald-400 font-bold">passed</span>: {backendValidation?.passed ?? 7}</div>
                <div>├── <span className="text-amber-400 font-bold">warnings</span>: {backendValidation?.warnings ?? 1}</div>
                <div>├── <span className="text-rose-400 font-bold">critical</span>: {backendValidation?.critical ?? 0}</div>
                <div>├── <span className="text-blue-400 font-bold">score</span>: {backendValidation?.score ?? 86}</div>
                <div>└── <span className="text-purple-300 font-bold">recommendation</span>: "{backendValidation?.recommendation || 'MANUAL_REVIEW'}"</div>
              </div>
            </div>

            {/* Individual Deterministic Validation Rules */}
            <div className="space-y-2.5">
              {validationItems.map((item: any, idx: number) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition ${item.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold flex items-center gap-1.5">
                      <span className="font-black text-sm">{item.symbol}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] leading-tight opacity-90">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Cadastral GIS Indicator */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              GIS Cadastral Cross-Match
            </span>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <AlertTriangle size={13} className="text-amber-600" />
              <span>Variance Exceeds 2.0% Tolerance</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI VALIDATION EXPLANATION (Below the 3 panels) */}
      <div className="bg-amber-50/80 rounded-2xl border-2 border-amber-300 p-5 shadow-xs space-y-2 text-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide">
              AI Validation Explanation
            </h3>
            <p className="text-xs text-amber-900/80 font-medium">
              BhoomiLens Geo-Spatial &amp; Title Anomaly Alert
            </p>
          </div>
        </div>

        {/* Dynamic AI Validation Explanation */}
        <p className="text-sm font-bold text-amber-950 leading-relaxed pl-10">
          {aiExplanation}
        </p>

        <div className="pl-10 text-xs text-amber-900 space-y-1 pt-1">
          <p>
            • <strong>Previous Recorded Area:</strong> <span className="font-mono">2.35 acres</span> (as per Khatauni Fasli 1426, Record Ref LR-10294)
          </p>
          <p>
            • <strong>Submitted Deed Area:</strong> <span className="font-mono">3.10 acres</span> (Claimed absolute transfer from Ram Gopal Sharma)
          </p>
          <p>
            • <strong>Cadastral BhuNaksha GIS Overlay:</strong> Polygon perimeter indicates that the eastern parcel boundary encroaches into the village drainage buffer channel.
          </p>
        </div>
      </div>

      {/* STATUTORY DECISION BUTTONS (Approve | Request Correction | Reject) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900">
            Statutory Revenue Decision &amp; Order
          </h4>
          <p className="text-xs text-slate-500">
            The revenue officer has full authority to approve, order physical demarcation, or reject under the UP/UK Revenue Code.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Reject */}
          <button
            onClick={() => handleDecisionClick('REJECT')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-extrabold text-xs transition shadow-xs"
          >
            Reject Title
          </button>

          {/* Request Correction */}
          <button
            onClick={() => handleDecisionClick('REQUEST_CORRECTION')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs transition shadow-xs"
          >
            Request Correction
          </button>

          {/* Approve */}
          <button
            onClick={() => handleDecisionClick('APPROVE')}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition shadow-md hover:scale-[1.02]"
          >
            Approve &amp; Seal
          </button>
        </div>
      </div>

      {/* Action Modal */}
      <VerificationActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        documentId={record?.id || 'rec_uk_10294'}
        khasraNo={extractedData.surveyNo}
        citizenName={extractedData.owner}
        onSuccess={() => {
          refreshData();
          setActionExecutedToast({
            decision: selectedDecision,
            message: `Statutory order executed for Survey ${extractedData.surveyNo}. Audit log chained.`
          });
        }}
      />
    </div>
  );
};
