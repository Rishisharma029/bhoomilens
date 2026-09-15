import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface OCRViewerProps {
  documentTitle?: string;
  registrationNumber?: string;
  subRegistrar?: string;
  highlightKey?: string;
  onFieldClick?: (key: string) => void;
}

export const OCRViewer: React.FC<OCRViewerProps> = ({
  documentTitle = 'CERTIFIED REGISTERED SALE DEED (बैनामा)',
  registrationNumber = 'UK-ROO-2026-REG-09941',
  subRegistrar = 'Sub-Registrar Office, Roorkee II',
  highlightKey,
  onFieldClick,
}) => {
  const [zoom, setZoom] = useState(100);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 80), 150));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 text-slate-200">
      {/* Top Document Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700 text-xs">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-amber-400" />
          <span className="font-semibold text-slate-100 truncate max-w-[240px]">
            {documentTitle}
          </span>
          <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
            {registrationNumber}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleZoom(-10)}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-[11px] font-mono w-10 text-center">{zoom}%</span>
          <button
            onClick={() => handleZoom(10)}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white ml-1"
            title="Reset Zoom"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      {/* Simulated Document Canvas / Paper */}
      <div className="flex-1 overflow-auto p-6 flex justify-center bg-slate-950/70 items-start">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="w-[560px] min-h-[760px] bg-amber-50/90 text-slate-900 p-8 shadow-2xl rounded-sm border border-amber-200/60 font-serif text-[13px] leading-relaxed relative transition-transform"
        >
          {/* Official Header & Seal */}
          <div className="text-center border-b-2 border-amber-900/30 pb-4 mb-5">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full border-2 border-amber-800 flex items-center justify-center p-1 bg-amber-100/60">
                <div className="text-[9px] font-bold tracking-tighter text-amber-900 text-center uppercase">
                  Govt. of Uttarakhand<br />★ 2026 ★
                </div>
              </div>
            </div>
            <h2 className="text-sm font-bold tracking-wider text-amber-950 uppercase font-sans">
              REGISTRATION & STAMPS DEPARTMENT, UTTARAKHAND
            </h2>
            <p className="text-[11px] font-sans font-medium text-amber-900/80">
              {subRegistrar}
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono mt-2 text-slate-600 px-2">
              <span>Book No. 1, Vol. 4821</span>
              <span>Doc No: {registrationNumber}</span>
              <span>Date: 10/09/2026</span>
            </div>
          </div>

          {/* Legal Document Clauses with OCR interactive bounding boxes */}
          <div className="space-y-4">
            <p className="text-[11px] font-mono text-center tracking-wider text-amber-900 font-bold">
              —— DEED OF ABSOLUTE SALE CONVEYANCE ——
            </p>

            <p>
              This absolute deed of sale is entered and executed at Roorkee on this 10th day of September 2026 by and between:
            </p>

            <div 
              onClick={() => onFieldClick?.('sellerName')}
              className={`p-1.5 rounded transition cursor-pointer ${
                highlightKey === 'sellerName' 
                  ? 'bg-amber-300/60 ring-2 ring-amber-500' 
                  : 'hover:bg-blue-100/60'
              }`}
            >
              <strong>VENDOR:</strong> Sri Harishankar Sharma, S/o Sri Radhey Shyam Sharma, Resident of House No. 42, Civil Lines, Roorkee, Haridwar. (Party of First Part)
            </div>

            <div 
              onClick={() => onFieldClick?.('ownerName')}
              className={`p-1.5 rounded transition cursor-pointer relative ${
                highlightKey === 'ownerName' 
                  ? 'bg-emerald-300/60 ring-2 ring-emerald-600' 
                  : 'bg-emerald-100/40 border border-emerald-300/60 hover:bg-emerald-200/50'
              }`}
            >
              <div className="absolute -top-2.5 right-2 bg-emerald-700 text-white text-[9px] px-1.5 py-0.2 rounded font-sans font-bold flex items-center gap-1">
                <CheckCircle2 size={10} /> OCR 98%
              </div>
              <strong>PURCHASER:</strong> <u>Sri Ramesh Chandra Joshi</u>, S/o Late Bipin Chandra Joshi, Resident of Tapovan Khurd, Tehsil Rishikesh. (Party of Second Part)
            </div>

            <div className="border-t border-dashed border-amber-900/30 pt-3">
              <p className="font-bold text-[12px] mb-1 font-sans text-amber-950">
                SCHEDULE OF PROPERTY (विवरण संपत्ति):
              </p>
              
              <div 
                onClick={() => onFieldClick?.('khasraNo')}
                className={`p-1.5 rounded transition cursor-pointer ${
                  highlightKey === 'khasraNo' 
                    ? 'bg-blue-300/60 ring-2 ring-blue-600' 
                    : 'bg-blue-50 border border-blue-200/70 hover:bg-blue-100/50'
                }`}
              >
                All that piece and parcel of agricultural land bearing <strong>Khasra No. 88/1 Ga</strong>, Khata No. 0142, situated in Revenue Village Manglaur Dehat, Pargana & Tehsil Roorkee, District Haridwar.
              </div>

              <div 
                onClick={() => onFieldClick?.('areaClaimed')}
                className={`p-1.5 rounded transition cursor-pointer mt-1.5 ${
                  highlightKey === 'areaClaimed' 
                    ? 'bg-purple-300/60 ring-2 ring-purple-600' 
                    : 'bg-purple-50 border border-purple-200/70 hover:bg-purple-100/50'
                }`}
              >
                Measuring an area of <strong>1.150 Hectares (11,500 sq. meters)</strong>, bounded by:
                <ul className="list-disc ml-5 mt-1 text-[11px] font-sans">
                  <li>North: Khasra 87 (National Highway bypass road)</li>
                  <li>South: Khasra 89 (Agricultural plot of Satish Kumar)</li>
                  <li>East: Irrigation Tube-well Channel</li>
                  <li>West: Village Abadi Boundary</li>
                </ul>
              </div>
            </div>

            <div 
              onClick={() => onFieldClick?.('considerationAmount')}
              className={`p-1.5 rounded transition cursor-pointer ${
                highlightKey === 'considerationAmount' 
                  ? 'bg-amber-300/60 ring-2 ring-amber-600' 
                  : 'hover:bg-amber-100/60'
              }`}
            >
              <strong>TOTAL VALUATION & CONSIDERATION:</strong> The agreed consideration of <strong>₹ 62,50,000/- (Sixty Two Lakhs Fifty Thousand Only)</strong> has been paid through RTGS Bank Transfer to the Vendor.
            </div>

            <div 
              onClick={() => onFieldClick?.('stampDutyPaid')}
              className="p-1.5 rounded bg-amber-100/40 border border-amber-300/60 text-[11px] font-mono flex items-center justify-between"
            >
              <span>E-Stamp Ref: IN-UK77218900412B</span>
              <span className="font-bold text-emerald-800">Stamp Duty Paid: ₹ 3,12,500/-</span>
            </div>
          </div>

          {/* Bottom Official Signatures & Digital Stamp */}
          <div className="mt-8 pt-4 border-t border-amber-900/30 flex justify-between items-end">
            <div className="text-center font-sans">
              <div className="font-serif italic text-slate-500 mb-1">Harishankar</div>
              <div className="text-[10px] uppercase font-bold text-slate-700">Signature of Vendor</div>
            </div>

            {/* Official Sub Registrar Stamp Mock */}
            <div className="border-2 border-emerald-800 rounded p-2 text-center bg-white/80 shadow-xs">
              <div className="text-[8px] font-bold text-emerald-900 uppercase">
                Govt of Uttarakhand • Sub-Registrar
              </div>
              <div className="text-[11px] font-extrabold text-emerald-950">
                VERIFIED & REGISTERED
              </div>
              <div className="text-[8px] font-mono text-emerald-800">
                HASH: 0x88f2..412b
              </div>
            </div>

            <div className="text-center font-sans">
              <div className="font-serif italic text-slate-500 mb-1">Ramesh Chandra</div>
              <div className="text-[10px] uppercase font-bold text-slate-700">Signature of Purchaser</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
