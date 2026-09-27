import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  PenTool, 
  Stamp, 
  Table, 
  ShieldCheck, 
  Eye, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DocumentRegionType } from '../../types';

interface OCRViewerProps {
  documentTitle?: string;
  registrationNumber?: string;
  subRegistrar?: string;
  highlightKey?: string;
  onFieldClick?: (key: string) => void;
  initialPage?: number;
}

export const OCRViewer: React.FC<OCRViewerProps> = ({
  documentTitle = 'CERTIFIED REGISTERED SALE DEED (बैनामा)',
  registrationNumber = 'UK-ROO-2026-REG-09941',
  subRegistrar = 'Sub-Registrar Office, Roorkee II',
  highlightKey,
  onFieldClick,
  initialPage = 3
}) => {
  const [zoom, setZoom] = useState(100);
  const [activePage, setActivePage] = useState<number>(initialPage);
  const [activeModalityFilter, setActiveModalityFilter] = useState<'ALL' | DocumentRegionType>('ALL');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>('hw_area_correction_p3');

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 70), 160));
  };

  const isVisible = (type: DocumentRegionType) => {
    return activeModalityFilter === 'ALL' || activeModalityFilter === type;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 text-slate-200 font-sans shadow-lg">
      
      {/* Top Document Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-emerald-400" />
          <span className="font-bold text-slate-100 truncate max-w-[220px]">
            {documentTitle}
          </span>
          <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">
            {registrationNumber}
          </span>
        </div>

        {/* Page Switcher (Page 1, 2, 3) */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setActivePage(p => Math.max(1, p - 1))}
            disabled={activePage === 1}
            className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            title="Previous Page"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-[11px] font-mono px-2 text-slate-200 font-bold">
            Page {activePage} of 3
          </span>
          <button
            onClick={() => setActivePage(p => Math.min(3, p + 1))}
            disabled={activePage === 3}
            className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300"
            title="Next Page"
          >
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleZoom(-10)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[11px] font-mono w-9 text-center text-slate-300 font-semibold">{zoom}%</span>
          <button
            onClick={() => handleZoom(10)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white ml-0.5"
            title="Reset Zoom"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* Multi-Modal Modality Layer Selector Banner */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
        <div className="flex items-center gap-1.5 shrink-0">
          <Layers size={13} className="text-emerald-400" />
          <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">
            Detection Layers:
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveModalityFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 ${
              activeModalityFilter === 'ALL'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>All Layers</span>
          </button>

          <button
            onClick={() => setActiveModalityFilter('HANDWRITTEN_ANNOTATION')}
            className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 ${
              activeModalityFilter === 'HANDWRITTEN_ANNOTATION'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <PenTool size={11} />
            <span>✍ Handwriting (3)</span>
          </button>

          <button
            onClick={() => setActiveModalityFilter('STAMP_SEAL')}
            className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 ${
              activeModalityFilter === 'STAMP_SEAL'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs'
                : 'text-purple-400/80 hover:text-purple-300 hover:bg-purple-500/10'
            }`}
          >
            <Stamp size={11} />
            <span>🏛 Seals/Stamps (2)</span>
          </button>

          <button
            onClick={() => setActiveModalityFilter('TABLE_FORM')}
            className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 ${
              activeModalityFilter === 'TABLE_FORM'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <Table size={11} />
            <span>📊 Tables (1)</span>
          </button>

          <button
            onClick={() => setActiveModalityFilter('PRINTED_TEXT')}
            className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 ${
              activeModalityFilter === 'PRINTED_TEXT'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-xs'
                : 'text-blue-400/80 hover:text-blue-300 hover:bg-blue-500/10'
            }`}
          >
            <FileText size={11} />
            <span>🟦 Printed Text</span>
          </button>
        </div>
      </div>

      {/* Simulated Document Canvas / Paper */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center bg-slate-950/90 items-start">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="w-[580px] min-h-[760px] bg-amber-50 text-slate-900 p-8 shadow-2xl rounded-sm border border-amber-300/80 font-serif text-[13px] leading-relaxed relative transition-transform select-none"
        >
          
          {/* ============================================================== */}
          {/* PAGE 3: THE CLASSIC USER REAL-WORLD SCENARIO                   */}
          {/* Printed details + ✍ handwritten correction "Area = 2.35 -> 2.42" */}
          {/* ============================================================== */}
          {activePage === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Page Number Watermark */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b border-amber-200 pb-2 mb-3">
                <span>REVENUE DOCKET: BOOK 1, VOL 4821</span>
                <span className="font-bold text-amber-950 bg-amber-200/60 px-2 py-0.5 rounded">
                  Page 3 of 3 • Cadastral Schedule &amp; Execution
                </span>
                <span>DOC: {registrationNumber}</span>
              </div>

              {/* Box 1: Printed Registration Details */}
              <div 
                className={`p-4 rounded-xl transition relative border-2 ${
                  isVisible('PRINTED_TEXT')
                    ? 'border-blue-400/60 bg-blue-50/20'
                    : 'border-transparent'
                }`}
              >
                {isVisible('PRINTED_TEXT') && (
                  <span className="absolute -top-2.5 left-3 bg-blue-700 text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
                    <FileText size={9} /> PRINTED REGISTRATION DETAILS • OCR 98%
                  </span>
                )}

                <div className="space-y-2 mt-1">
                  <p className="font-sans font-extrabold text-xs uppercase tracking-wider text-slate-700">
                    STATUTORY CONVEYANCE PARTICULARS:
                  </p>

                  <div 
                    onClick={() => onFieldClick?.('ownerName')}
                    className={`p-2 rounded cursor-pointer transition ${
                      highlightKey === 'ownerName' ? 'bg-emerald-200/80 ring-2 ring-emerald-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <strong>Recorded Owner / Purchaser:</strong> Sri Ramesh Kumar, S/o Late Bipin Chandra Kumar
                  </div>

                  <div className="p-2 rounded">
                    <strong>Survey / Khasra Number:</strong> <span className="font-mono font-bold">124/7</span> (Khata No. 0042)
                  </div>
                </div>
              </div>

              {/* Box 2: THE HIGHLIGHTED HANDWRITTEN CORRECTION SECTION */}
              <div className="relative p-5 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-100/40 shadow-xs space-y-3">
                
                {/* Visual Label Pill */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <PenTool size={11} className="text-amber-800" />
                    <span>Multimodal Script Demarcation</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                    Officer Endorsed ✓
                  </span>
                </div>

                {/* Printed Text with Strike-Through */}
                <div className="relative">
                  <p className="font-sans text-xs text-slate-600">
                    Original Printed Area:
                  </p>
                  <p className="font-mono text-sm text-slate-800 mt-0.5">
                    Total Area: <span className="line-through decoration-rose-600 decoration-2 font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded">2.35 Acres</span>
                  </p>
                </div>

                {/* Handwritten Stroke Annotation Callout (Exactly as requested by user) */}
                <div 
                  onClick={() => {
                    setSelectedRegionId('hw_area_correction_p3');
                    onFieldClick?.('area');
                  }}
                  className={`p-3 rounded-xl border-2 transition cursor-pointer ${
                    selectedRegionId === 'hw_area_correction_p3'
                      ? 'border-amber-600 bg-amber-100 ring-2 ring-amber-500/30 shadow-md'
                      : 'border-amber-300 bg-amber-50/80 hover:bg-amber-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-sans font-extrabold text-amber-900 uppercase flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-700" />
                      <span>✍ Handwritten Correction Detected (Indic Handwriting OCR 94%)</span>
                    </span>
                    <span className="text-[9px] font-mono text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded font-bold">
                      Devanagari + Latin Pen Stroke
                    </span>
                  </div>

                  {/* Simulated realistic ink handwriting text */}
                  <div className="font-serif italic text-base sm:text-lg font-black text-blue-950 tracking-wide my-1 py-1 px-2 bg-blue-50/50 rounded border border-blue-200/60 flex items-center justify-between">
                    <span>"Area = 2.35 → 2.42 Acres"</span>
                    <span className="text-[10px] font-sans font-bold text-emerald-800 not-italic bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      संशोधित (Corrected)
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-600 mt-1">
                    Duly initialed by <strong>Tehsildar Sadar</strong> with official amendment docket endorsement.
                  </p>
                </div>

                {/* Sub-Divisional Revenue Court Judicial Seal */}
                <div className="flex items-center justify-between pt-2 border-t border-amber-300/60">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-800/80 bg-purple-100/50 flex items-center justify-center p-1 text-center">
                      <div className="text-[7px] font-bold text-purple-950 uppercase leading-tight font-sans">
                        Revenue<br />Court<br />★ SEAL ★
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-purple-950 font-sans">
                        Revenue Court of Tehsildar Sadar
                      </p>
                      <p className="text-[10px] text-purple-800 font-mono">
                        Judicial Seal Affixed • Case No. 418/2024
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 block">Initial &amp; Date</span>
                    <span className="font-serif italic text-xs font-bold text-slate-700">R.S. Negi (18/01/24)</span>
                  </div>
                </div>

              </div>

              {/* Box 3: Table / Form (Cadastral Parcel Schedule) */}
              {isVisible('TABLE_FORM') && (
                <div className="p-3 rounded-xl border-2 border-emerald-500/50 bg-emerald-50/20 relative mt-2">
                  <span className="absolute -top-2.5 left-3 bg-emerald-700 text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
                    <Table size={9} /> TABLE / FORM REGION • 5 COLUMNS × 1 ROW
                  </span>

                  <table className="w-full text-[10px] font-sans mt-2 border-collapse border border-slate-300 bg-white">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="border border-slate-300 p-1 text-left">Khasra No.</th>
                        <th className="border border-slate-300 p-1 text-left">Khata No.</th>
                        <th className="border border-slate-300 p-1 text-left">Printed Area</th>
                        <th className="border border-slate-300 p-1 text-left">Corrected Area</th>
                        <th className="border border-slate-300 p-1 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-1 font-mono font-bold">124/7</td>
                        <td className="border border-slate-300 p-1 font-mono">0042</td>
                        <td className="border border-slate-300 p-1 font-mono text-slate-400 line-through">2.35 Acres</td>
                        <td className="border border-slate-300 p-1 font-mono font-extrabold text-blue-900 bg-blue-50">2.42 Acres</td>
                        <td className="border border-slate-300 p-1 text-emerald-800 font-bold">Verified ✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bottom Execution Signatures */}
              <div className="pt-4 border-t border-amber-900/30 flex justify-between items-end text-xs">
                <div className="text-center font-sans">
                  <div className="font-serif italic text-slate-600 mb-1">Ramesh Kumar</div>
                  <div className="text-[10px] uppercase font-bold text-slate-700">Signature of Purchaser</div>
                </div>

                <div className="text-center font-sans">
                  <div className="font-serif italic text-slate-600 mb-1">R.S. Negi, Tehsildar</div>
                  <div className="text-[10px] uppercase font-bold text-slate-700">Attesting Revenue Officer</div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 1: DEED HEADER, PARTIES, GRAS TREASURY CHALLAN STAMP       */}
          {/* ============================================================== */}
          {activePage === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center border-b-2 border-amber-900/30 pb-3 mb-4">
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-full border-2 border-amber-800 flex items-center justify-center p-1 bg-amber-100/60">
                    <div className="text-[9px] font-bold tracking-tighter text-amber-900 text-center uppercase">
                      Govt. of Uttarakhand<br />★ 2019 ★
                    </div>
                  </div>
                </div>
                <h2 className="text-sm font-bold tracking-wider text-amber-950 uppercase font-sans">
                  REGISTRATION &amp; STAMPS DEPARTMENT, UTTARAKHAND
                </h2>
                <p className="text-[11px] font-sans font-medium text-amber-900/80">
                  {subRegistrar}
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono mt-2 text-slate-600 px-2">
                  <span>Book No. 1, Vol. 4182</span>
                  <span>Doc No: {registrationNumber}</span>
                  <span>Execution Date: 14/08/2019</span>
                </div>
              </div>

              {/* Vendor & Purchaser Recitals */}
              <div className="space-y-3">
                <div className="p-2 rounded bg-amber-100/40 border border-amber-300/50">
                  <strong>VENDOR:</strong> Sri Ram Gopal Sharma, S/o Late Radhey Shyam Sharma. (Party of First Part)
                </div>

                <div className="p-2 rounded bg-emerald-100/50 border border-emerald-300/60">
                  <strong>PURCHASER:</strong> Sri Rishi Sharma, S/o Late Bipin Chandra Sharma. (Party of Second Part)
                </div>

                <div className="p-2 rounded bg-purple-50 border border-purple-200">
                  <strong>TREASURY E-CHALLAN:</strong> GRAS-UK-2019-CH-994101 • Stamp Duty Paid: ₹ 2,97,500/-
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 2: BOUNDARIES & REVENUE REGISTER MARGIN NOTES              */}
          {/* ============================================================== */}
          {activePage === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center font-bold text-xs uppercase text-amber-900 border-b border-amber-300 pb-2">
                FOUR CADASTRAL BOUNDARIES (चौहद्दी) &amp; ADJACENT HOLDINGS
              </div>

              <div className="p-3 bg-white rounded border border-amber-200 space-y-1.5 text-xs">
                <p><strong>North:</strong> Plot No. 124/6 (Agricultural Holding)</p>
                <p><strong>South:</strong> State Irrigation Canal (राजवाहा 12m)</p>
                <p><strong>East:</strong> Link Chak-Road 12m wide</p>
                <p><strong>West:</strong> Khasra 124/8 (Private Orchard)</p>
              </div>

              <div className="p-3 bg-amber-100/60 rounded border border-amber-300 font-serif italic text-xs text-slate-700">
                ✍ <strong>Handwritten Margin Entry:</strong> "अमलदरामद रजिस्टर खतौनी वर्ष १४३० फसली में प्रविष्टि संख्या ४२ पर दर्ज।"
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Interactive Region Inspector Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-extrabold text-slate-200">
            Selected Region:
          </span>
          <span className="font-mono text-amber-400 text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            ✍ Handwritten Area Correction (2.35 → 2.42 Acres)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono">
            Engine: Indic-Handwriting-BiLSTM-v3.2
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck size={11} /> Endorsed by SDM/Tehsildar
          </span>
        </div>
      </div>

    </div>
  );
};
