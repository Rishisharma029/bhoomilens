import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { 
  ChevronLeft, 
  MapPin, 
  LandPlot, 
  User, 
  FileText, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  FileUp, 
  Layers, 
  QrCode, 
  ExternalLink,
  Sparkles,
  Calendar,
  Check
} from 'lucide-react';

export const RecordDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records } = useRecords();

  // Find matching record by id or parcelId or khasraNo, fallback to default LR-10294
  const record = records.find(r => r.id === id || r.parcelId === id || r.khasraNo === id) || records[0];

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [activeCheckCategory, setActiveCheckCategory] = useState<string>('ALL');

  if (!record) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-slate-900">Land record not found.</p>
        <Link to="/citizen/records" className="text-xs text-emerald-700 underline mt-2 inline-block font-semibold">
          Return to My Land Records
        </Link>
      </div>
    );
  }

  const parcelId = record.parcelId || 'LR-10294';
  const surveyNo = record.surveyNo || record.khasraNo || '124/7';
  const currentOwner = record.ownerName || 'Rishi Sharma';
  const areaStr = `${record.area} ${record.areaUnit}`;
  const village = record.village || 'ABC';
  const district = record.district || 'XYZ';

  // Default fallback documents if not present
  const documents = record.attachedDocuments || [
    { id: '1', title: 'Registered Sale Deed', fileName: 'Registry.pdf', fileSize: '4.2 MB', fileType: 'PDF Document', uploadedAt: '14/08/2019', isVerified: true },
    { id: '2', title: 'Mutation Order Sheet', fileName: 'Mutation.pdf', fileSize: '1.8 MB', fileType: 'PDF Document', uploadedAt: '02/09/2019', isVerified: true },
    { id: '3', title: 'Cadastral Demarcation Map', fileName: 'Supporting_Document.pdf', fileSize: '2.6 MB', fileType: 'PDF Document', uploadedAt: '15/09/2019', isVerified: true },
  ];

  // Default fallback ownership history
  const ownershipHistory = record.ownershipHistory || [
    {
      id: 'h1',
      previousOwner: 'Ram Gopal Sharma',
      transactionType: 'Registered Absolute Sale Conveyance',
      transactionDate: '14/08/2019',
      currentOwner: 'Rishi Sharma',
      deedRegistrationNo: 'UK-XYZ-2019-REG-04821',
      considerationAmount: '₹ 62,50,000'
    },
    {
      id: 'h2',
      previousOwner: 'Dharampal Sharma',
      transactionType: 'Ancestral Succession & Mutation (दाखिल खारिज)',
      transactionDate: '22/04/2004',
      currentOwner: 'Ram Gopal Sharma',
      deedRegistrationNo: 'MUT-XYZ-2004-0992'
    }
  ];

  // Validation Summary
  const validationSummary = record.validationSummary || {
    checksPassed: 8,
    warnings: 1,
    criticalConflicts: 0,
    checks: [
      { name: 'Cadastral Boundary Polygon Match', category: 'CADASTRE', status: 'PASS', message: '100% boundary overlap matched with state BhuNaksha GIS server.' },
      { name: 'Sub-Registrar State Seal & Watermark', category: 'LEGAL', status: 'PASS', message: 'E-Treasury GRAS challan & official seal pixel density authenticated.' },
      { name: 'CERSAI Non-Encumbrance & Lien Check', category: 'LEGAL', status: 'PASS', message: 'No active non-performing charge, bank mortgage, or civil court stay.' },
      { name: 'Khatauni Fasli Record Alignment', category: 'CADASTRE', status: 'PASS', message: 'Area is consistent with 12-Yearly Fasli record.' },
      { name: 'UIDAI Aadhaar Beneficiary Authentication', category: 'IDENTITY', status: 'PASS', message: 'Biometric token matched for recorded owner.' },
      { name: 'Circle Rate Revenue Tax Clearance', category: 'TAX', status: 'PASS', message: 'Stamp duty and registration fees verified against state treasury.' },
      { name: 'Revenue Court Mutation Sanction', category: 'LEGAL', status: 'PASS', message: 'Section 34/35 UP/UK Revenue Code final mutation decree certified.' },
      { name: 'Physical Survey Demarcation Spot Check', category: 'CADASTRE', status: 'PASS', message: 'Lekhpal site verification report filed without objections.' },
      { name: 'Indic Spelling Character Variance', category: 'IDENTITY', status: 'WARNING', message: 'Deed has minor alternate spelling in Hindi script (ऋषि vs रिशि); verified via Aadhaar linkage.' }
    ]
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/citizen/records"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2 transition"
          >
            <ChevronLeft size={14} />
            <span>Back to My Land Records</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Land Record Details
            </h1>
            <span className="font-mono text-xs font-extrabold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg border border-emerald-300">
              {parcelId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
          >
            <Download size={14} />
            <span>Download Certified ROR</span>
          </button>

          <Link
            to={`/citizen/correction-request/doc_sub_10294`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition"
          >
            <span>Request Correction</span>
          </Link>
        </div>
      </div>

      {/* CORE INFO CARDS (Requested Structure) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Land Record */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Land Record
            </span>
            <p className="text-base font-black font-mono text-emerald-900">
              {parcelId}
            </p>
          </div>

          {/* Current Owner */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Current Owner
            </span>
            <p className="text-base font-extrabold text-slate-900">
              {currentOwner}
            </p>
          </div>

          {/* Survey Number */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Survey Number
            </span>
            <p className="text-base font-extrabold text-slate-900 font-mono">
              {surveyNo}
            </p>
          </div>

          {/* Area */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Area
            </span>
            <p className="text-base font-extrabold text-slate-900">
              {areaStr}
            </p>
          </div>

          {/* Village & District */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Location
            </span>
            <p className="text-xs font-bold text-slate-900">Village: {village}</p>
            <p className="text-xs text-slate-500">District: {district}</p>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </span>
            <div className="pt-0.5">
              <StatusBadge status={record.status} size="md" />
            </div>
          </div>
        </div>

        {/* Cadastral Coordinates Note */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Authenticated under Section 34/35 U.P. &amp; U.K. Revenue Code</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Digital Seal:</span>
            <span className="text-slate-800 font-semibold">{record.digitalSealHash || '0x8f2a11b98cf982e043bc123490aafe876251b44c'}</span>
          </div>
        </div>
      </div>

      {/* OWNERSHIP HISTORY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Ownership History
            </h3>
            <p className="text-xs text-slate-500">
              Chronological chain of title from previous owners to current registered owner
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-bold border border-emerald-200">
            Chain of Title Intact
          </span>
        </div>

        {/* Requested visual flow: Previous Owner → Transaction → Current Owner */}
        <div className="space-y-4 pt-2">
          {ownershipHistory.map((step, idx) => (
            <div 
              key={step.id} 
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Previous Owner */}
                <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Previous Owner
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm">{step.previousOwner}</p>
                </div>

                {/* Transaction Connector */}
                <div className="flex flex-col items-center justify-center px-2 text-center">
                  <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-xs">
                    <span>Transaction</span>
                    <ArrowRight size={14} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 max-w-[190px] leading-tight mt-0.5">
                    {step.transactionType}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {step.transactionDate} {step.considerationAmount ? `• ${step.considerationAmount}` : ''}
                  </span>
                </div>

                {/* Current Owner */}
                <div className="flex-1 bg-white p-3 rounded-lg border border-emerald-300 text-center sm:text-left shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                    {idx === 0 ? 'Current Owner' : 'Transferee'}
                  </span>
                  <p className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                    <span>{step.currentOwner}</span>
                    {idx === 0 && <Check size={14} className="text-emerald-600 stroke-[3]" />}
                  </p>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 font-mono text-right">
                Doc Ref: {step.deedRegistrationNo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMNS: DOCUMENTS & VALIDATION SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* DOCUMENTS (Requested files: Registry.pdf, Mutation.pdf, Supporting_Document.pdf) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Documents
              </h3>
              <p className="text-xs text-slate-500">
                Uploaded, scanned, and digitized deeds for this parcel
              </p>
            </div>
            <Link
              to="/citizen/upload"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <FileUp size={14} />
              <span>Upload New</span>
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500/80 transition-all flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {doc.fileName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {doc.title} • <span className="font-mono">{doc.fileSize}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/citizen/review-extracted/doc_sub_10294"
                    className="p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition"
                    title="Review Extracted OCR Data"
                  >
                    <Sparkles size={16} />
                  </Link>

                  <button
                    onClick={() => alert(`Downloading verified copy of ${doc.fileName}...`)}
                    className="p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition"
                    title="Download File"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VALIDATION SUMMARY (Requested: 8 checks passed, 1 warning, 0 critical conflicts) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Validation Summary
              </h3>
              <p className="text-xs text-slate-500">
                Automated multi-vector AI fraud &amp; cadastral checks
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Confidence: 96%
            </span>
          </div>

          {/* Three Summary Stat Pills */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3">
              <span className="text-xl font-black text-emerald-800 leading-none">
                {validationSummary.checksPassed}
              </span>
              <p className="text-[11px] font-bold text-emerald-900 mt-1">checks passed</p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3">
              <span className="text-xl font-black text-amber-800 leading-none">
                {validationSummary.warnings}
              </span>
              <p className="text-[11px] font-bold text-amber-900 mt-1">warning</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-xl font-black text-slate-700 leading-none">
                {validationSummary.criticalConflicts}
              </span>
              <p className="text-[11px] font-bold text-slate-600 mt-1">critical conflicts</p>
            </div>
          </div>

          {/* Detailed Verification Checks List */}
          <div className="space-y-2 pt-2 max-h-64 overflow-y-auto pr-1">
            {validationSummary.checks.map((chk, idx) => (
              <div 
                key={idx}
                className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2.5 ${
                  chk.status === 'PASS' 
                    ? 'border-slate-100 bg-slate-50/50' 
                    : chk.status === 'WARNING'
                    ? 'border-amber-200 bg-amber-50/60'
                    : 'border-rose-200 bg-rose-50/60'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0">
                    {chk.status === 'PASS' && <CheckCircle2 size={15} className="text-emerald-600" />}
                    {chk.status === 'WARNING' && <AlertTriangle size={15} className="text-amber-600" />}
                    {chk.status === 'FAIL' && <XCircle size={15} className="text-rose-600" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[11px]">{chk.name}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{chk.message}</p>
                  </div>
                </div>

                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded font-mono shrink-0 ${
                  chk.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                  chk.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {chk.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Download Certificate Modal */}
      <Modal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Digitally Sealed Record of Rights (खतौनी)"
        subtitle={`Parcel ${parcelId} • Authenticated Certificate`}
      >
        <div className="space-y-5">
          <div className="bg-amber-50/70 p-6 rounded-2xl border-2 border-amber-900/20 text-center space-y-3">
            <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto border border-amber-300 font-serif font-bold text-xs">
              GOVT
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-amber-900">
                Government of Uttarakhand • Revenue Board
              </p>
              <h4 className="text-base font-extrabold text-amber-950 mt-0.5">
                CERTIFIED RECORD OF RIGHTS (ROR)
              </h4>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Parcel ID:</span>
                <span className="font-mono font-bold text-slate-800">{parcelId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recorded Owner:</span>
                <span className="font-bold text-slate-800">{currentOwner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Survey No:</span>
                <span className="font-bold text-slate-800">{surveyNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Holding Area:</span>
                <span className="font-bold text-slate-800">{areaStr}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-amber-900/20">
              <span>SHA-256 Verified Seal</span>
              <QrCode size={40} className="text-slate-800" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDownloadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Downloading official certified ROR for ${parcelId}...`);
                setDownloadModalOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition"
            >
              <Download size={14} />
              <span>Download Signed PDF</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
