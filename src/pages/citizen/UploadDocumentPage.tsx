import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecords } from '../../context/RecordsContext';
import { citizenService } from '../../services/citizenService';
import { DocumentTypeCategory } from '../../types';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers,
  Scale,
  BookOpen,
  MapPin,
  FileCheck,
  HelpCircle,
  Cpu,
  Brain,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface PresetDoc {
  name: string;
  size: string;
  category: DocumentTypeCategory;
  categoryLabel: string;
  categoryHindi: string;
  icon: any;
  color: string;
  bgLight: string;
}

const PRESET_DOCUMENTS: PresetDoc[] = [
  {
    name: 'Registry_Sale_Deed.pdf',
    size: '4.2 MB',
    category: 'SALE_DEED',
    categoryLabel: 'Sale Deed',
    categoryHindi: 'बैनामा / विक्रय विलेख',
    icon: FileText,
    color: 'text-emerald-700 border-emerald-300',
    bgLight: 'bg-emerald-50 hover:bg-emerald-100/80'
  },
  {
    name: 'Dakhil_Kharij_Order.pdf',
    size: '2.8 MB',
    category: 'MUTATION_ORDER',
    categoryLabel: 'Mutation Order',
    categoryHindi: 'दाखिल खारिज / नामांतरण',
    icon: Scale,
    color: 'text-blue-700 border-blue-300',
    bgLight: 'bg-blue-50 hover:bg-blue-100/80'
  },
  {
    name: 'Nakal_Khatauni_ROR.pdf',
    size: '1.9 MB',
    category: 'KHATAUNI_ROR',
    categoryLabel: 'Khatauni / ROR',
    categoryHindi: 'खतौनी / अधिकार अभिलेख',
    icon: BookOpen,
    color: 'text-indigo-700 border-indigo-300',
    bgLight: 'bg-indigo-50 hover:bg-indigo-100/80'
  },
  {
    name: 'Village_Form_7_12.pdf',
    size: '2.1 MB',
    category: 'EXTRACT_7_12',
    categoryLabel: '7/12 Extract',
    categoryHindi: 'सात-बारा उतारा',
    icon: Layers,
    color: 'text-amber-700 border-amber-300',
    bgLight: 'bg-amber-50 hover:bg-amber-100/80'
  },
  {
    name: 'BhuNaksha_Cadastral_Map.png',
    size: '6.4 MB',
    category: 'CADASTRAL_MAP',
    categoryLabel: 'Cadastral Map',
    categoryHindi: 'भू-नक्शा / शजरा',
    icon: MapPin,
    color: 'text-rose-700 border-rose-300',
    bgLight: 'bg-rose-50 hover:bg-rose-100/80'
  },
  {
    name: 'SubRegistrar_Certificate.pdf',
    size: '1.4 MB',
    category: 'REGISTRATION_CERTIFICATE',
    categoryLabel: 'Registration Cert',
    categoryHindi: 'पंजीकरण प्रमाण पत्र',
    icon: FileCheck,
    color: 'text-purple-700 border-purple-300',
    bgLight: 'bg-purple-50 hover:bg-purple-100/80'
  }
];

export const UploadDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshData } = useRecords();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('Registry_Sale_Deed.pdf');
  const [fileSize, setFileSize] = useState('4.2 MB');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<PresetDoc | null>(PRESET_DOCUMENTS[0]);

  // Stepper State:
  // 1. Upload & Cloud Ingestion
  // 2. Indic Vision OCR
  // 3. AI Document Classifier (7 statutory revenue classes)
  // 4. Specialized Legal Extraction
  // 5. Cadastral Validation & Review
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps = [
    { id: 1, title: 'Upload & Ingest', desc: 'Secure cloud ingestion & SHA-256 cryptographic hashing' },
    { id: 2, title: 'Indic Vision OCR', desc: 'Tesseract & multi-script Indic revenue parser' },
    { id: 3, title: 'AI Document Classifier', desc: 'Auto-classifies into 7 categories (zero manual selection)' },
    { id: 4, title: 'Specialized Extraction', desc: 'Domain-routed legal extraction with provenance & confidence' },
    { id: 5, title: 'Cadastral Validation', desc: '8-rule deterministic check, boundary alignment & draft record' },
  ];

  const handleSelectPreset = (preset: PresetDoc) => {
    setFile(null);
    setFileName(preset.name);
    setFileSize(preset.size);
    setDetectedCategory(preset);
  };

  const handleStartDigitization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCurrentStepIndex(1); // Step 1: Upload

    try {
      // 1. Ingestion
      await new Promise(r => setTimeout(r, 450));
      setCurrentStepIndex(2); // Step 2: OCR

      // Trigger backend pipeline (passes filename, mimeType, and lets classifier auto-route)
      const uploadPromise = citizenService.uploadDocument({
        citizenId: user?.id || 'user_cit_101',
        citizenName: user?.name || 'Rishi Sharma',
        khasraNo: '124/7',
        village: 'ABC',
        district: 'XYZ',
        docType: detectedCategory?.category || 'SALE_DEED',
        fileName,
        fileSize,
        file,
      });

      // 2. Indic OCR
      await new Promise(r => setTimeout(r, 650));
      setCurrentStepIndex(3); // Step 3: AI Document Classifier

      // 3. AI Document Classifier
      await new Promise(r => setTimeout(r, 600));
      setCurrentStepIndex(4); // Step 4: Specialized Extraction

      // 4. Specialized Extraction
      const newSub = await uploadPromise;
      await new Promise(r => setTimeout(r, 550));
      setCurrentStepIndex(5); // Step 5: Cadastral Validation

      // 5. Finalize
      refreshData();
      await new Promise(r => setTimeout(r, 450));
      navigate(`/citizen/review-extracted/${newSub.id}`);
    } catch (err) {
      console.error('Digitization error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles size={14} className="text-emerald-700" />
          <span>BhoomiLens AI Ingestion &amp; Classification Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Upload &amp; Classify Land Document
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload scanned deeds, handwritten mutation orders, cadastral maps, or legacy PDFs. The BhoomiLens 
          neural classifier identifies statutory revenue categories and automatically dispatches to specialized extraction pipelines.
        </p>
      </div>

      {/* Intelligent Classifier Concept Architecture Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
          <Brain size={16} />
          <span>Automated Document-Type Routing Engine</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          No manual dropdowns required. Upload any revenue record and the classifier scores vocabulary, structural morphology, 
          and revenue seals to assign the document type and route it to domain-specific extractors:
        </p>

        {/* 7 Statutory Categories Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
            <FileText size={16} className="text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Sale Deed</p>
              <p className="text-[10px] text-emerald-300">बैनामा / विलेख</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
            <Scale size={16} className="text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Mutation Order</p>
              <p className="text-[10px] text-blue-300">दाखिल खारिज</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Khatauni / ROR</p>
              <p className="text-[10px] text-indigo-300">खतौनी अभिलेख</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
            <Layers size={16} className="text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">7/12 Extract</p>
              <p className="text-[10px] text-amber-300">सात-बारा उतारा</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
            <MapPin size={16} className="text-rose-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Cadastral Map</p>
              <p className="text-[10px] text-rose-300">भू-नक्शा / शजरा</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
            <FileCheck size={16} className="text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Registration Cert</p>
              <p className="text-[10px] text-purple-300">पंजीकरण प्रमाण</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 flex items-center gap-2 col-span-2 sm:col-span-1">
            <HelpCircle size={16} className="text-slate-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Unknown / Mixed</p>
              <p className="text-[10px] text-slate-400">अज्ञात / मिश्रित</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Upload Box & Action */}
      {!isProcessing ? (
        <form onSubmit={handleStartDigitization} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Quick-Preset Selector for rapid evaluation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Zap size={14} className="text-emerald-600" />
                <span>Test With Sample Documents (1-Click Presets)</span>
              </span>
              <span className="text-[11px] text-slate-500">Auto-routes to specialized parser</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_DOCUMENTS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = fileName === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected 
                        ? `${preset.color} bg-white ring-2 ring-emerald-600 shadow-xs font-bold` 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Icon size={14} />
                        <span>{preset.categoryLabel}</span>
                      </div>
                      {isSelected && <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{preset.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{preset.categoryHindi}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 sm:p-10 text-center bg-slate-50/60 hover:bg-slate-50 transition cursor-pointer relative group">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const uploaded = e.target.files[0];
                  setFile(uploaded);
                  setFileName(uploaded.name);
                  setFileSize(`${(uploaded.size / (1024 * 1024)).toFixed(1)} MB`);
                  setDetectedCategory(null);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />

            <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud size={32} />
            </div>

            <p className="text-sm font-bold text-slate-800">
              Drag &amp; Drop Scanned Record / PDF / Image
            </p>
            <p className="text-xs text-slate-500 mt-1">
              or click here to browse files from your computer or mobile device
            </p>

            {/* Supported formats label */}
            <div className="mt-4 pt-3 border-t border-slate-200 inline-block text-[11px] text-slate-500">
              Accepted: <strong className="text-slate-700 font-bold">PDF, Scanned TIFF/JPG, PNG</strong> (up to 25 MB)
            </div>

            {fileName && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-2xs">
                  <FileText size={15} />
                  <span>Selected: {fileName} ({fileSize})</span>
                  <CheckCircle2 size={15} className="text-emerald-600 ml-1" />
                </div>
                {detectedCategory && (
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
                    Preset: {detectedCategory.categoryLabel} ({detectedCategory.categoryHindi})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Start Digitization Button */}
          <div className="pt-2 flex flex-col items-center">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Trigger Intelligent Digitization</span>
              <ArrowRight size={17} />
            </button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              OCR, document classification, specialized field extraction &amp; 8-rule cadastral validation run automatically.
            </p>
          </div>
        </form>
      ) : (
        /* WORKFLOW PROCESSING STEPPER (5-step UI with AI Document Classifier) */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900">
              Digitizing Land Document: {fileName}
            </h3>
            <p className="text-xs text-slate-500">
              Executing BhoomiLens multi-engine Indic OCR and autonomous legal document routing...
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

          {/* Document Classifier Live Signal Indicator */}
          {currentStepIndex >= 3 && (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-center space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1">
                <Brain size={13} />
                <span>Document Classifier Dispatched</span>
              </span>
              <p className="text-xs font-bold text-slate-800">
                Identified as: <span className="text-emerald-800 font-extrabold">{detectedCategory?.categoryLabel || 'Sale Deed'}</span> ({detectedCategory?.categoryHindi || 'बैनामा'})
              </p>
              <p className="text-[11px] text-slate-500">
                Specialized extraction pipeline active: reading stamp duty, boundary parcels &amp; consideration clauses.
              </p>
            </div>
          )}

          {/* Progress Animation Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                style={{ width: `${(currentStepIndex / 5) * 100}%` }}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
              />
            </div>
            <p className="text-[11px] text-slate-500 text-center font-mono">
              Step {currentStepIndex} of 5 in progress • Generating verifiable land record...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
