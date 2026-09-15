import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecords } from '../../context/RecordsContext';
import { citizenService } from '../../services/citizenService';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  FileUp,
  Cpu,
  Check,
  Circle
} from 'lucide-react';

type StepStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export const UploadDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshData } = useRecords();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('Registry.pdf');
  const [fileSize, setFileSize] = useState('4.2 MB');
  const [isProcessing, setIsProcessing] = useState(false);

  // 5 Workflow Stepper States requested by user:
  // 1. Upload                 ✓
  // 2. OCR Processing         ✓
  // 3. Information Extraction ◉
  // 4. Validation             ○
  // 5. Review                 ○
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0); // 0 = not started, 1..5

  const steps = [
    { id: 1, title: 'Upload', desc: 'Secure cloud ingestion & hashing' },
    { id: 2, title: 'OCR Processing', desc: 'VisionOCR Indic clause parsing' },
    { id: 3, title: 'Information Extraction', desc: 'Owner, Survey No, Area, Village & Date' },
    { id: 4, title: 'Validation', desc: 'Cadastral GIS cross-match & forgery check' },
    { id: 5, title: 'Review', desc: 'Side-by-side verification & draft' },
  ];

  const handlePreloadSampleDeed = () => {
    setFileName('Registry.pdf');
    setFileSize('4.2 MB');
  };

  const handleStartDigitization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCurrentStepIndex(1); // Step 1: Upload

    try {
      // 1. Upload
      await new Promise(r => setTimeout(r, 450));
      setCurrentStepIndex(2); // Step 2: OCR Processing

      // Trigger backend OCR and field extraction pipeline
      const uploadPromise = citizenService.uploadDocument({
        citizenId: user?.id || 'user_cit_101',
        citizenName: user?.name || 'Rishi Sharma',
        khasraNo: '124/7',
        village: 'ABC',
        district: 'XYZ',
        docType: 'SALE_DEED',
        fileName,
        fileSize,
        file,
      });

      // 2. OCR Processing
      await new Promise(r => setTimeout(r, 600));
      setCurrentStepIndex(3); // Step 3: Information Extraction

      // 3. Information Extraction
      await new Promise(r => setTimeout(r, 550));
      setCurrentStepIndex(4); // Step 4: Validation

      // 4. Validation
      const newSub = await uploadPromise;
      await new Promise(r => setTimeout(r, 450));
      setCurrentStepIndex(5); // Step 5: Review

      refreshData();
      await new Promise(r => setTimeout(r, 350));
      navigate(`/citizen/review-extracted/${newSub.id}`);
    } catch (err) {
      console.error('Digitization error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
          <Sparkles size={13} />
          <span>BhoomiLens AI Pipeline</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Upload Land Document
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Intelligent end-to-end deed digitalization: upload deed scans, parse Indic legal clauses, and run automated cadastral cross-verification.
        </p>
      </div>

      {/* Main Upload Box & Action */}
      {!isProcessing ? (
        <form onSubmit={handleStartDigitization} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Select Document Scan
            </span>
            <button
              type="button"
              onClick={handlePreloadSampleDeed}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>Preload Sample Registry.pdf</span>
            </button>
          </div>

          {/* Drag & Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-10 text-center bg-slate-50/60 hover:bg-slate-50 transition cursor-pointer relative group">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setFileName(e.target.files[0].name);
                  setFileSize(`${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />

            <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud size={32} />
            </div>

            <p className="text-sm font-bold text-slate-800">
              Drag &amp; Drop PDF / Image
            </p>
            <p className="text-xs text-slate-500 mt-1">
              or click here to browse files from your device
            </p>

            {/* Supported formats label */}
            <div className="mt-4 pt-3 border-t border-slate-200 inline-block text-[11px] text-slate-400">
              Supported: <strong className="text-slate-600 font-bold">PDF, JPG, JPEG, PNG</strong> (up to 25 MB)
            </div>

            {fileName && (
              <div className="mt-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                  <FileText size={15} />
                  <span>Selected: {fileName} ({fileSize})</span>
                  <CheckCircle2 size={15} className="text-emerald-600 ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Start Digitization Button */}
          <div className="pt-2 flex flex-col items-center">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Start Digitization</span>
              <ArrowRight size={17} />
            </button>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Automated Indic OCR &amp; Cadastral Validation will begin immediately.
            </p>
          </div>
        </form>
      ) : (
        /* WORKFLOW PROCESSING STEPPER (Requested exact 5-step UI) */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900">
              Digitizing Land Document: {fileName}
            </h3>
            <p className="text-xs text-slate-500">
              Executing BhoomiLens Indic OCR and Cadastral GIS verification pipeline...
            </p>
          </div>

          {/* 5-Step Status Stepper */}
          <div className="max-w-md mx-auto space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 font-sans">
            {steps.map((step) => {
              const isDone = currentStepIndex > step.id;
              const isCurrent = currentStepIndex === step.id;
              const isPending = currentStepIndex < step.id;

              return (
                <div key={step.id} className="flex items-center justify-between py-2 border-b border-slate-200/60 last:border-none">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {step.id}.
                    </span>
                    <div>
                      <p className={`text-sm font-bold ${
                        isCurrent ? 'text-emerald-900 font-black' : isDone ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Icon Indicator: ✓ or ◉ or ○ */}
                  <div>
                    {isDone && (
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        ✓
                      </span>
                    )}
                    {isCurrent && (
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-600 flex items-center justify-center text-sm font-extrabold animate-pulse">
                        ◉
                      </span>
                    )}
                    {isPending && (
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-300 flex items-center justify-center text-sm">
                        ○
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Animation Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div 
                style={{ width: `${(currentStepIndex / 5) * 100}%` }}
                className="bg-linear-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center font-mono">
              Step {currentStepIndex} of 5 in progress • Readying Side-by-Side Review Screen...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
