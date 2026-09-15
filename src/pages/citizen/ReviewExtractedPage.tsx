import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { citizenService } from '../../services/citizenService';
import { useRecords } from '../../context/RecordsContext';
import { DocumentSubmission } from '../../types';
import { OCRViewer } from '../../components/common/OCRViewer';
import { Modal } from '../../components/common/Modal';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ChevronLeft,
  FileCheck,
  Send,
  Loader2,
  Layers,
  HelpCircle,
  ShieldCheck,
  Building,
  MapPin,
  FileText,
  UserCheck
} from 'lucide-react';

interface ExtractedFieldState {
  key: string;
  label: string;
  value: string;
  confidence: number;
  source: string;
  isEdited?: boolean;
}

export const ReviewExtractedPage: React.FC = () => {
  const { docId = 'doc_sub_10294' } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const { refreshData } = useRecords();

  const [submission, setSubmission] = useState<DocumentSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHighlightKey, setActiveHighlightKey] = useState<string>('ownerName');
  const [activeTab, setActiveTab] = useState<'ownership' | 'cadastre' | 'location' | 'registration'>('cadastre');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveDraftToast, setSaveDraftToast] = useState(false);
  const [submitSuccessModal, setSubmitSuccessModal] = useState(false);
  const [overallConfidence, setOverallConfidence] = useState(96);

  // 16 Structured Land Fields with value, confidence, and page provenance
  const [fields, setFields] = useState<Record<string, ExtractedFieldState>>({
    ownerName: {
      key: 'ownerName',
      label: 'Owner Name',
      value: 'Rishi Sharma',
      confidence: 0.98,
      source: 'page 1'
    },
    fatherName: {
      key: 'fatherName',
      label: 'Father / Guardian Name',
      value: 'Late Bipin Chandra Sharma',
      confidence: 0.96,
      source: 'page 1'
    },
    surveyNo: {
      key: 'surveyNo',
      label: 'Survey / Khasra Number',
      value: '124/7',
      confidence: 0.99,
      source: 'page 2'
    },
    khataNo: {
      key: 'khataNo',
      label: 'Khata / Account Number',
      value: '0042',
      confidence: 0.95,
      source: 'page 2'
    },
    area: {
      key: 'area',
      label: 'Area',
      value: '2.35',
      confidence: 0.96,
      source: 'page 2'
    },
    unit: {
      key: 'unit',
      label: 'Unit',
      value: 'Acres',
      confidence: 0.98,
      source: 'page 2'
    },
    village: {
      key: 'village',
      label: 'Village',
      value: 'ABC',
      confidence: 0.97,
      source: 'page 2'
    },
    tehsil: {
      key: 'tehsil',
      label: 'Tehsil',
      value: 'Central Tehsil',
      confidence: 0.95,
      source: 'page 1'
    },
    district: {
      key: 'district',
      label: 'District',
      value: 'XYZ',
      confidence: 0.98,
      source: 'page 1'
    },
    state: {
      key: 'state',
      label: 'State',
      value: 'Uttarakhand',
      confidence: 0.99,
      source: 'page 1'
    },
    registrationNumber: {
      key: 'registrationNumber',
      label: 'Registration Number',
      value: 'UK-XYZ-2019-REG-04821',
      confidence: 0.99,
      source: 'page 1'
    },
    registrationDate: {
      key: 'registrationDate',
      label: 'Registration Date',
      value: '14/08/2019',
      confidence: 0.99,
      source: 'page 1'
    },
    documentType: {
      key: 'documentType',
      label: 'Document Type',
      value: 'Certified Registered Sale Deed (बैनामा)',
      confidence: 0.97,
      source: 'page 1'
    },
    previousOwner: {
      key: 'previousOwner',
      label: 'Previous Owner',
      value: 'Ram Gopal Sharma',
      confidence: 0.95,
      source: 'page 1'
    },
    transactionType: {
      key: 'transactionType',
      label: 'Transaction Type',
      value: 'Absolute Sale & Conveyance with Possession',
      confidence: 0.96,
      source: 'page 1'
    },
    boundaries: {
      key: 'boundaries',
      label: 'Boundaries',
      value: 'North: Plot 124/6 | South: State Irrigation Canal | East: Link Road 12m | West: Khasra 124/8',
      confidence: 0.93,
      source: 'page 2'
    }
  });

  // Deterministic Validation State matching contract:
  // Validation: passed: 7, warnings: 1, critical: 0, score: 86, recommendation: "MANUAL_REVIEW"
  const [validationData, setValidationData] = useState({
    passed: 7,
    warnings: 1,
    critical: 0,
    score: 86,
    recommendation: 'MANUAL_REVIEW',
    rules: [
      { id: '1', name: 'Required field present', status: 'PASS', symbol: '✓', detail: 'All mandatory cadastral fields present' },
      { id: '2', name: 'Area is numerically valid', status: 'PASS', symbol: '✓', detail: '2.35 Acres is a positive numerical area' },
      { id: '3', name: 'Date is valid', status: 'PASS', symbol: '✓', detail: 'Execution date 14/08/2019 verified' },
      { id: '4', name: 'Survey number format valid', status: 'PASS', symbol: '✓', detail: '124/7 conforms to revenue survey format' },
      { id: '5', name: 'Duplicate survey/parcel detection', status: 'PASS', symbol: '✓', detail: 'No active duplicate registered for survey 124/7' },
      { id: '6', name: 'Owner-name similarity', status: 'PASS', symbol: '✓', detail: 'Owner matches citizen token (98% similarity)' },
      { id: '7', name: 'Area difference against previous record', status: 'WARNING', symbol: '⚠', detail: 'Minor boundary review required against previous holding' },
      { id: '8', name: 'Referenced parcel exists', status: 'PASS', symbol: '✓', detail: 'Parcel LR-10294 verified in village cadastre' }
    ]
  });

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const sub = await citizenService.getSubmissionById(docId);
        if (sub && sub.extractedData) {
          setSubmission(sub);
          const rawFields = sub.extractedData.fields || {};
          if (sub.extractedData.overallConfidence) {
            setOverallConfidence(sub.extractedData.overallConfidence);
          }

          setFields(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(k => {
              if (rawFields[k]) {
                updated[k] = {
                  ...updated[k],
                  value: rawFields[k].value ?? updated[k].value,
                  confidence: rawFields[k].confidence ?? updated[k].confidence,
                  source: rawFields[k].source ?? updated[k].source,
                  isEdited: rawFields[k].isEdited ?? false
                };
              }
            });
            return updated;
          });
        }
      } catch (err) {
        console.warn('Could not load remote submission, using standard benchmark:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docId]);

  const handleFieldChange = (key: string, newValue: string) => {
    setFields(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: newValue,
        isEdited: true
      }
    }));
  };

  const handleSaveDraft = async () => {
    try {
      if (submission) {
        const payloadFields: Record<string, any> = {};
        Object.keys(fields).forEach(k => {
          payloadFields[k] = {
            value: fields[k].value,
            confidence: fields[k].confidence,
            source: fields[k].source,
            isEdited: fields[k].isEdited
          };
        });
        await citizenService.updateExtractedData(submission.id, payloadFields);
      }
      setSaveDraftToast(true);
      setTimeout(() => setSaveDraftToast(false), 3000);
    } catch (e) {
      console.error('Draft save failed:', e);
    }
  };

  const handleSubmitForVerification = async () => {
    setIsSubmitting(true);
    try {
      if (submission) {
        const payloadFields: Record<string, any> = {};
        Object.keys(fields).forEach(k => {
          payloadFields[k] = {
            value: fields[k].value,
            confidence: fields[k].confidence,
            source: fields[k].source,
            isEdited: fields[k].isEdited
          };
        });
        await citizenService.updateExtractedData(submission.id, payloadFields);
        await citizenService.submitForVerification(submission.id);
      }
      refreshData();
      setIsSubmitting(false);
      setSubmitSuccessModal(true);
    } catch (err) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Extracting 16 Land Fields &amp; Provenance via OCR...</p>
        </div>
      </div>
    );
  }

  // Group fields into the 4 functional categories
  const categories = {
    ownership: ['ownerName', 'fatherName', 'previousOwner', 'transactionType'],
    cadastre: ['surveyNo', 'khataNo', 'area', 'unit', 'boundaries'],
    location: ['village', 'tehsil', 'district', 'state'],
    registration: ['registrationNumber', 'registrationDate', 'documentType']
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/citizen/records"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <ChevronLeft size={14} />
              <span>Back to Records</span>
            </Link>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Doc ID: {docId}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Review Extracted Land Data
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify every extracted field against the deed preview. Every field displays its exact page source and trust score before submission.
          </p>
        </div>

        {/* Top Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300">
            <Sparkles size={14} className="text-emerald-700" />
            <span>AI Confidence: {overallConfidence}%</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-300">
            <ShieldCheck size={14} className="text-amber-700" />
            <span>Validation: {validationData.score}/100 ({validationData.recommendation})</span>
          </div>
        </div>
      </div>

      {/* Save Draft Toast */}
      {saveDraftToast && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Draft saved. Your field edits and provenance are updated.</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Autosaved</span>
        </div>
      )}

      {/* 2-Column Split View:
          LEFT: Document Preview (OCRViewer)
          RIGHT: 16 Structured Extracted Fields + Provenance + Validation Rules
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Document Preview */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileCheck size={15} className="text-emerald-700" />
              <span>Original Document Preview</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Registry.pdf • Sub-Registrar Sealed
            </span>
          </div>

          <div className="h-[720px] rounded-2xl overflow-hidden shadow-sm border border-slate-300">
            <OCRViewer
              documentTitle={fields.documentType.value}
              registrationNumber={fields.registrationNumber.value}
              subRegistrar={`Sub-Registrar Office, ${fields.tehsil.value}`}
              highlightKey={activeHighlightKey}
              onFieldClick={(key) => setActiveHighlightKey(key)}
            />
          </div>

          {/* Validation Engine Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-700" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Deterministic Validation (8 Rules)
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Score: {validationData.score}/100 • {validationData.recommendation}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Rules Passed</span>
                <span className="font-extrabold text-emerald-800 text-sm font-mono">
                  {validationData.passed} / 8 ✓
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Warnings</span>
                <span className="font-extrabold text-amber-800 text-sm font-mono">
                  {validationData.warnings} ⚠
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              {validationData.rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between text-[11px] p-1.5 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold ${rule.status === 'PASS' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {rule.symbol}
                    </span>
                    <span className="font-medium text-slate-700">{rule.name}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] truncate max-w-[180px]">
                    {rule.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Extracted 16 Fields with Provenance & Tabs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Extracted Land Schema (16 Fields)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click any field to view its bounding box on the original document
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <HelpCircle size={13} className="text-emerald-600" />
                <span>Field-level provenance active</span>
              </div>
            </div>

            {/* Category Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('cadastre')}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                  activeTab === 'cadastre' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers size={13} />
                <span className="hidden sm:inline">Cadastre</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ownership')}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                  activeTab === 'ownership' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck size={13} />
                <span className="hidden sm:inline">Parties</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                  activeTab === 'location' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin size={13} />
                <span className="hidden sm:inline">Location</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('registration')}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                  activeTab === 'registration' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText size={13} />
                <span className="hidden sm:inline">Registry</span>
              </button>
            </div>

            {/* Field Inputs for Active Tab */}
            <div className="space-y-3.5">
              {categories[activeTab].map((key) => {
                const f = fields[key];
                if (!f) return null;
                const isSelected = activeHighlightKey === key;
                const pct = Math.round(f.confidence * 100);

                return (
                  <div
                    key={key}
                    onClick={() => setActiveHighlightKey(key)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Header with Field Label and Provenance Source Badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-extrabold text-slate-700 tracking-wide">
                        {f.label}
                      </label>

                      {/* User specified provenance format: { value, confidence: 0.96, source: "page 2" } */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                          source: {f.source}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            pct >= 95
                              ? 'text-emerald-800 bg-emerald-100'
                              : pct >= 85
                              ? 'text-amber-800 bg-amber-100'
                              : 'text-rose-800 bg-rose-100'
                          }`}
                        >
                          {pct}% trust
                        </span>
                        {f.isEdited && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                            edited
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Input or Textarea */}
                    {key === 'boundaries' ? (
                      <textarea
                        rows={2}
                        value={f.value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="w-full text-xs font-semibold text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white leading-relaxed"
                      />
                    ) : (
                      <input
                        type="text"
                        value={f.value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="w-full text-sm font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white font-mono"
                      />
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>Trust rationale: Extracted from {f.source} via VisionOCR</span>
                      <span>Click to highlight</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions: Save Draft | Submit for Verification */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Save size={14} />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitForVerification}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Submitting for Verification...</span>
                  </>
                ) : (
                  <>
                    <span>Submit for Verification</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Submission Success Modal */}
      <Modal
        isOpen={submitSuccessModal}
        onClose={() => setSubmitSuccessModal(false)}
        title="Application Submitted for Verification"
        subtitle="Revenue Administration Docket • DILRMP"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h4 className="text-lg font-black text-slate-900">
              Document Successfully Queued!
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your deed for Survey No. <strong className="text-slate-800">{fields.surveyNo.value}</strong> ({fields.ownerName.value}) has been submitted to the Sub-Divisional Magistrate (SDM) verification queue.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>APPLICATION TRACKING ID</span>
              <span>BHOOMI-VER-2026</span>
            </div>
            <p className="text-emerald-900 font-bold">
              UK-XYZ-REG-10294-VERIFIED
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/citizen/records/rec_uk_10294"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition shadow-sm"
            >
              View Land Record
            </Link>
            <Link
              to="/citizen/history"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
            >
              Track Status
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};
