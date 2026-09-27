import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  ShieldCheck, 
  Maximize2, 
  Eye, 
  EyeOff,
  Navigation,
  Info,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CadastralGISEngineProps {
  khasraNo?: string;
  deedArea?: number;
  onSelectAnomaly?: (anomaly: any) => void;
  height?: string;
}

export const CadastralGISEngine: React.FC<CadastralGISEngineProps> = ({
  khasraNo = '124/7',
  deedArea = 2.35,
  onSelectAnomaly,
  height = '560px'
}) => {
  const [zoom, setZoom] = useState(100);
  const [activeLayerMode, setActiveLayerMode] = useState<'SATELLITE' | 'HYBRID' | 'VECTOR'>('SATELLITE');
  
  // Layer visibility toggles
  const [showDeedClaim, setShowDeedClaim] = useState(true);
  const [showGisMaster, setShowGisMaster] = useState(true);
  const [showOverlapZone, setShowOverlapZone] = useState(true);
  const [showAdjacentParcels, setShowAdjacentParcels] = useState(true);
  const [showInfrastructure, setShowInfrastructure] = useState(true);

  // Selected feature inspector
  const [selectedFeature, setSelectedFeature] = useState<{
    title: string;
    type: string;
    area: string;
    owner?: string;
    khasra?: string;
    details: string;
  } | null>({
    title: 'Claim vs GIS Intersection (Khasra 124/7)',
    type: 'INTERSECTION_ZONE',
    area: '2.31 Acres Overlap (96.7% Concordance)',
    owner: 'Rishi Sharma',
    khasra: '124/7',
    details: '96.7% Intersection-over-Union alignment with master cadastre. 0.04 acre overlap detected with northern plot 124/6.'
  });

  const gisArea = 2.42;
  const areaDiff = Number((gisArea - deedArea).toFixed(2));
  const diffPercent = '+2.98%';
  const overlapPercent = '96.7%';

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 text-slate-100 overflow-hidden shadow-2xl flex flex-col font-sans">
      
      {/* Top GIS Toolbar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
            <Compass size={17} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white tracking-tight">
                Cadastral GIS Engine • BhuNaksha WGS84
              </h3>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                EPSG:4326 LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Mauza ABC, Central Tehsil, District XYZ • Khasra {khasraNo} (Parcel LR-10294)
            </p>
          </div>
        </div>

        {/* Basemap Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveLayerMode('SATELLITE')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
              activeLayerMode === 'SATELLITE'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setActiveLayerMode('HYBRID')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
              activeLayerMode === 'HYBRID'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌍 Hybrid
          </button>
          <button
            onClick={() => setActiveLayerMode('VECTOR')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
              activeLayerMode === 'VECTOR'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🗺️ Cadastre
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setZoom(z => Math.max(70, z - 10))}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-[11px] font-mono px-1.5 text-slate-300 font-bold">{zoom}%</span>
          <button
            onClick={() => setZoom(z => Math.min(160, z + 10))}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Reset Extent"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* Main Map Viewport + Side Comparison Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative flex-1 min-h-[500px]">
        
        {/* INTERACTIVE MAP CANVAS (8 cols) */}
        <div className="lg:col-span-8 relative overflow-hidden bg-slate-950 flex items-center justify-center min-h-[460px] select-none">
          
          {/* Simulated Satellite Terrain Texture */}
          <div 
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
            className={`w-[660px] h-[480px] rounded-2xl relative transition-transform overflow-hidden shadow-2xl border ${
              activeLayerMode === 'SATELLITE' 
                ? 'bg-radial from-[#1e2e1d] via-[#142316] to-[#0c160e] border-slate-700' 
                : activeLayerMode === 'HYBRID'
                ? 'bg-radial from-[#243328] via-[#1a291e] to-[#0f1b13] border-slate-700'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            {/* Satellite Agricultural Field Grid Patterns & Textures */}
            {activeLayerMode !== 'VECTOR' && (
              <>
                {/* Field texture lines */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#86efac_1px,transparent_1px)] bg-[size:18px_18px]" />
                
                {/* Canal Waterway (Cyan) */}
                <div className="absolute bottom-8 left-0 right-0 h-4 bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900 border-y border-cyan-500/40 opacity-80 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-cyan-200 tracking-widest uppercase font-bold">
                    ≈ State Irrigation Canal (राजवाहा 12m) ≈
                  </span>
                </div>

                {/* Chak Road (Orange) */}
                <div className="absolute top-0 bottom-0 right-10 w-4 bg-amber-900/60 border-x border-amber-600/50 opacity-85 flex items-center justify-center">
                  <span className="text-[8px] font-mono text-amber-200 uppercase tracking-widest rotate-90 whitespace-nowrap">
                    Chak Road (12m)
                  </span>
                </div>

                {/* Tree Clumps / Orchard texture */}
                <div className="absolute top-12 left-8 w-24 h-24 rounded-full bg-emerald-950/80 border border-emerald-600/30 blur-xs" />
                <div className="absolute bottom-16 right-20 w-20 h-20 rounded-full bg-emerald-950/70 border border-emerald-600/20 blur-xs" />
              </>
            )}

            {/* SVG Polygon Layers Overlay */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 660 480">
              <defs>
                {/* Red Hatched Pattern for Overlap/Encroachment Zones */}
                <pattern id="overlapHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2.5" />
                </pattern>
                {/* Emerald Hatched Pattern for Claimed Land */}
                <pattern id="claimHatch" width="10" height="10" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#10b981" strokeWidth="1.5" opacity="0.3" />
                </pattern>
              </defs>

              {/* 1. ADJACENT PARCEL: Khasra 124/6 (North Holding) */}
              {showAdjacentParcels && (
                <g 
                  onClick={() => setSelectedFeature({
                    title: 'Adjacent Parcel: Khasra 124/6',
                    type: 'ADJACENT_PARCEL',
                    area: '1.85 Acres',
                    owner: 'Dharampal Agricultural Holding',
                    khasra: '124/6',
                    details: 'Northern agricultural holding. Historical boundary stones present along southern verge.'
                  })}
                  className="cursor-pointer group"
                >
                  <polygon
                    points="140,40 480,40 470,160 140,150"
                    fill="#334155"
                    fillOpacity="0.25"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="group-hover:fill-opacity-40 transition"
                  />
                  <text x="310" y="90" fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    Khasra 124/6 (Dharampal) • 1.85 Ac
                  </text>
                </g>
              )}

              {/* 2. ADJACENT PARCEL: Khasra 124/8 (West Orchard) */}
              {showAdjacentParcels && (
                <g 
                  onClick={() => setSelectedFeature({
                    title: 'Adjacent Parcel: Khasra 124/8',
                    type: 'ADJACENT_PARCEL',
                    area: '3.10 Acres',
                    owner: 'Private Orchard (Surinder Nath)',
                    khasra: '124/8',
                    details: 'Western orchard parcel. Contiguous boundary verified with zero slivers or gaps.'
                  })}
                  className="cursor-pointer group"
                >
                  <polygon
                    points="20,150 140,150 140,400 20,400"
                    fill="#334155"
                    fillOpacity="0.25"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="group-hover:fill-opacity-40 transition"
                  />
                  <text x="80" y="270" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    Khasra 124/8 (Orchard)
                  </text>
                </g>
              )}

              {/* 3. GIS MASTER CADASTRAL BOUNDARY (Blue solid polygon) */}
              {showGisMaster && (
                <g 
                  onClick={() => setSelectedFeature({
                    title: 'Master BhuNaksha Cadastre (GIS Boundary)',
                    type: 'GIS_MASTER',
                    area: '2.42 Acres (0.979 Hectares)',
                    owner: 'Rishi Sharma',
                    khasra: '124/7',
                    details: 'Official digitised polygon from State Land Records Directorate. Centroid: 30.31649° N, 78.03219° E.'
                  })}
                  className="cursor-pointer group"
                >
                  <polygon
                    points="140,160 480,160 490,400 140,400"
                    fill="#1d4ed8"
                    fillOpacity="0.2"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    className="group-hover:fill-opacity-30 transition"
                  />
                </g>
              )}

              {/* 4. DEED CLAIM BOUNDARY (Emerald dashed polygon - Slightly smaller, shifted ~1.4m) */}
              {showDeedClaim && (
                <g 
                  onClick={() => setSelectedFeature({
                    title: 'Deed Claim Boundary (Extracted)',
                    type: 'DEED_CLAIM',
                    area: '2.35 Acres',
                    owner: 'Rishi Sharma (Purchaser)',
                    khasra: '124/7',
                    details: 'Spatial polygon constructed from registered conveyance sale deed schedule. Stated area: 2.35 Acres.'
                  })}
                  className="cursor-pointer group"
                >
                  <polygon
                    points="145,145 470,145 480,390 145,390"
                    fill="url(#claimHatch)"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                    className="group-hover:stroke-emerald-300 transition"
                  />
                </g>
              )}

              {/* 5. OVERLAP & INTERSECTION ANOMALY ZONE (Hatched Red) */}
              {showOverlapZone && (
                <g 
                  onClick={() => {
                    const anomaly = {
                      title: 'Northern Boundary Overlap Zone',
                      type: 'OVERLAP',
                      area: '0.04 Acres (141.6 sq. meters)',
                      owner: 'Overlaps into Khasra 124/6',
                      khasra: '124/7 ∩ 124/6',
                      details: 'Deed claim boundary extends 0.04 acres beyond the northern cadastral boundary into parcel 124/6.'
                    };
                    setSelectedFeature(anomaly);
                    onSelectAnomaly?.(anomaly);
                  }}
                  className="cursor-pointer group animate-pulse"
                >
                  {/* Overlap polygon on northern verge */}
                  <polygon
                    points="145,145 470,145 470,160 145,160"
                    fill="url(#overlapHatch)"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <circle cx="310" cy="152" r="9" fill="#ef4444" fillOpacity="0.9" />
                  <text x="310" y="156" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">⚠</text>
                </g>
              )}

              {/* Center Parcel Label & Centroid Marker */}
              <circle cx="310" cy="275" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <text x="310" y="260" fill="#ffffff" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="black">
                KHASRA 124/7
              </text>
              <text x="310" y="295" fill="#93c5fd" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                GIS: 2.42 Ac • Deed: 2.35 Ac
              </text>
              <text x="310" y="315" fill="#34d399" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                Overlap: 96.7% (Concordant)
              </text>

              {/* Cardinal Compass Indicator */}
              <g transform="translate(610, 45)">
                <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                <path d="M 0 -14 L 4 -2 L -4 -2 Z" fill="#ef4444" />
                <path d="M 0 14 L 4 2 L -4 2 Z" fill="#94a3b8" />
                <text x="0" y="-17" fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">N</text>
              </g>
            </svg>

            {/* Scale Bar */}
            <div className="absolute bottom-2 left-3 bg-slate-900/90 px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700 flex items-center gap-2">
              <div className="w-12 h-1 bg-white border border-slate-500" />
              <span>50 meters • Scale 1:4000</span>
            </div>
          </div>

          {/* Floating Layer Controls (Top Left of Map) */}
          <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1.5 shadow-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              GIS Vector Overlays
            </span>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showDeedClaim}
                onChange={e => setShowDeedClaim(e.target.checked)}
                className="rounded accent-emerald-500 text-emerald-500"
              />
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span>Deed Claim (2.35 Ac)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showGisMaster}
                onChange={e => setShowGisMaster(e.target.checked)}
                className="rounded accent-blue-500 text-blue-500"
              />
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              <span>GIS Master (2.42 Ac)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showOverlapZone}
                onChange={e => setShowOverlapZone(e.target.checked)}
                className="rounded accent-rose-500 text-rose-500"
              />
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
              <span className="text-rose-300 font-bold">Intersection / Overlap</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showAdjacentParcels}
                onChange={e => setShowAdjacentParcels(e.target.checked)}
                className="rounded accent-slate-400 text-slate-400"
              />
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-500 inline-block" />
              <span>Adjacent Cadastre</span>
            </label>
          </div>

        </div>

        {/* SIDE CADASTRAL COMPARISON & CLASSIFICATION CARD (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between space-y-5">
          
          {/* EXACT USER SPECIFICATION COMPARISON HUD */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                <Sparkles size={12} />
                <span>Cadastral Concordance Engine</span>
              </span>
              <h4 className="text-base font-black text-white tracking-tight">
                Deed Boundary vs. GIS Boundary
              </h4>
            </div>

            {/* The 2-Column Exact Spec Comparison Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800 text-center">
                <div>
                  <span className="text-[10px] uppercase text-emerald-400 font-bold block">Deed Boundary</span>
                  <p className="text-lg font-black text-white mt-0.5">{deedArea} acres</p>
                  <span className="text-[9px] text-slate-400">Claimed Holding</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-[10px] uppercase text-blue-400 font-bold block">GIS Boundary</span>
                  <p className="text-lg font-black text-white mt-0.5">{gisArea} acres</p>
                  <span className="text-[9px] text-slate-400">Master BhuNaksha</span>
                </div>
              </div>

              {/* Area Difference & Overlap */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Area in deed:</span>
                  <span className="font-bold text-white">{deedArea} acres</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">GIS area:</span>
                  <span className="font-bold text-white">{gisArea} acres</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Difference:</span>
                  <span className="font-bold text-amber-400">+{areaDiff} acres ({diffPercent})</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 font-sans font-bold">Boundary overlap:</span>
                  <span className="font-bold text-emerald-400">{overlapPercent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-bold">Cadastral Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]">
                    <AlertTriangle size={11} />
                    <span>REVIEW</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Category Spatial Discrepancy Classification Inspector */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Spatial Boundary Classifications
              </span>

              <div className="space-y-1.5 text-xs">
                {/* 1. OVERLAP */}
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">⚠</span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300">1. Overlap Detected</span>
                      <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-950 px-1 rounded">0.04 Ac</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Northern verge bleeds 141.6 sq.m into Parcel 124/6.
                    </p>
                  </div>
                </div>

                {/* 2. SHIFTED BOUNDARY */}
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">ℹ</span>
                  <div>
                    <span className="font-bold text-amber-300">2. Shifted Boundary</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Centroid translated +1.4m South-East (Cartographic shift).
                    </p>
                  </div>
                </div>

                {/* 3. ROAD/DRAINAGE ENCROACHMENT */}
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <span className="font-bold text-emerald-300">3. Road / Canal Clearance</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Clear: 1.8m from Chak Road, 3.2m from Canal corridor.
                    </p>
                  </div>
                </div>

                {/* 4. GAP & 5. MISSING PARCEL */}
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>4. Boundary Gaps: <strong className="text-emerald-400">None</strong></span>
                  <span>5. Missing Parcel: <strong className="text-emerald-400">Mapped</strong></span>
                </div>
              </div>
            </div>

          </div>

          {/* Selected Feature Inspector Drawer */}
          {selectedFeature && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">
                  {selectedFeature.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedFeature.area}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-tight">
                {selectedFeature.details}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
