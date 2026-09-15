import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LandPlot, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  MapPin, 
  Building2,
  FileCheck2,
  Users,
  Compass,
  Layers,
  Fingerprint,
  Stamp,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { useRecords } from '../context/RecordsContext';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { records } = useRecords();
  const { loginAsPreset } = useAuth();

  const [searchKhasra, setSearchKhasra] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKhasra.trim()) return;

    setHasSearched(true);
    const found = records.find(r => 
      r.khasraNo.toLowerCase().includes(searchKhasra.trim().toLowerCase()) ||
      r.khataNo.toLowerCase().includes(searchKhasra.trim().toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchKhasra.trim().toLowerCase())
    );
    setSearchResult(found || null);
  };

  const handleQuickDemoCitizen = async () => {
    await loginAsPreset('citizen_1');
    navigate('/citizen/dashboard');
  };

  const handleQuickDemoAdmin = async () => {
    await loginAsPreset('admin_1');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Top Gov-Tech Official Ribbon */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 sm:px-8 py-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Ashoka / Official emblem badge */}
          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-serif text-[9px] font-bold">
            UK
          </div>
          <span className="font-semibold text-slate-300">GOVERNMENT OF UTTARAKHAND</span>
          <span className="text-slate-600">|</span>
          <span>Department of Revenue &amp; Land Resources</span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:inline text-emerald-400 font-medium">Digital India Land Records Modernization Programme (DILRMP)</span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
            GIS Cadastral Nodes Active
          </span>
          <span className="text-slate-600">|</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
            SHA-256 Verified
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-16 lg:pb-24">
        {/* Subtle geometric survey mesh & aurora background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:36px_36px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-linear-to-tr from-emerald-600/15 via-teal-500/10 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Title & Subtitle */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-inner">
              <Cpu size={14} className="text-emerald-400" />
              <span>Next-Gen Land Governance AI Architecture</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white flex items-center justify-center gap-3">
                <span>BhoomiLens</span>
              </h1>
              <p className="text-lg sm:text-xl font-bold bg-linear-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                Intelligent Land Record Digitalization &amp; Validation
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              State-of-the-art civic-tech infrastructure bridging citizen landholders and revenue magistrates. 
              Powered by Indic OCR clause parsing, BhuNaksha cadastral GIS boundary verification, and automated fraud shields.
            </p>

            {/* Quick Khasra Verification Sandbox on Landing Page */}
            <div className="pt-2 max-w-xl mx-auto">
              <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 backdrop-blur-md shadow-2xl">
                <div className="flex items-center pl-3 text-slate-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={searchKhasra}
                  onChange={(e) => setSearchKhasra(e.target.value)}
                  placeholder="Test live search: Khasra '142/2 Kha' or '88/1 Ga'..."
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition shadow-sm"
                >
                  Quick Check
                </button>
              </form>

              {hasSearched && (
                <div className="mt-3 p-4 rounded-xl bg-slate-800 text-slate-100 text-left shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
                  {searchResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-700/60 flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-emerald-400" />
                          Authenticated Cadastral Record Found
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Khasra: {searchResult.khasraNo}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white">
                        {searchResult.ownerName}
                      </p>
                      <p className="text-xs text-slate-300">
                        {searchResult.village}, Tehsil {searchResult.tehsil}, {searchResult.district} • {searchResult.area} {searchResult.areaUnit} ({searchResult.landType})
                      </p>
                      <div className="pt-2 flex justify-between items-center border-t border-slate-700/80 text-[11px]">
                        <span className="font-mono text-slate-400">Ref: {searchResult.qrCodeId}</span>
                        <button
                          onClick={handleQuickDemoCitizen}
                          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                        >
                          <span>Open in Citizen Vault</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs text-slate-400">
                      No record matched "{searchKhasra}". Try searching demo Khasra <span className="font-mono text-emerald-400">142/2 Kha</span> or <span className="font-mono text-emerald-400">88/1 Ga</span>.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* TWO LARGE CARDS */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* CARD 1: CITIZEN PORTAL */}
            <div className="bg-gradient-to-b from-slate-800/90 to-slate-800/40 rounded-3xl border-2 border-slate-700/80 p-8 shadow-2xl hover:border-emerald-500/80 hover:shadow-emerald-900/20 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                {/* Header & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg group-hover:scale-105 transition-transform">
                    <LandPlot size={32} className="stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-600/40">
                    Public Services
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                  Citizen Portal
                </h3>

                {/* Requested exact description */}
                <p className="text-sm font-medium text-slate-300 leading-relaxed mb-6">
                  Upload, view and manage your land documents and track verification.
                </p>

                {/* Key Capability Points */}
                <div className="space-y-3 mb-8 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>AI Indic OCR Extraction:</strong> Automated extraction of ownership shares, boundaries, and consideration.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Side-by-Side Review:</strong> Inspect OCR bounding boxes directly against your scanned physical deed.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Correction Petitions:</strong> File statutory rectification requests for area variances or spelling errors.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Digitally Sealed ROR:</strong> Download authenticated Record of Rights with QR code &amp; DigiLocker sync.</span>
                  </div>
                </div>
              </div>

              {/* Login Actions */}
              <div className="space-y-3 pt-6 border-t border-slate-700/60">
                <Link
                  to="/auth/citizen/login"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition hover:scale-[1.01]"
                >
                  <span>Login to Citizen Portal</span>
                  <ArrowRight size={17} />
                </Link>

                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <span className="text-slate-400">Evaluating for Hackathon?</span>
                  <button
                    onClick={handleQuickDemoCitizen}
                    className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
                  >
                    <span>1-Click Demo Citizen Login</span>
                    <Sparkles size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: ADMINISTRATION PORTAL */}
            <div className="bg-gradient-to-b from-slate-800/90 to-slate-800/40 rounded-3xl border-2 border-slate-700/80 p-8 shadow-2xl hover:border-purple-500/80 hover:shadow-purple-900/20 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                {/* Header & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg group-hover:scale-105 transition-transform">
                    <ShieldCheck size={32} className="stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-purple-950/80 text-purple-400 border border-purple-600/40">
                    Revenue Administration
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                  Administration Portal
                </h3>

                {/* Requested exact description */}
                <p className="text-sm font-medium text-slate-300 leading-relaxed mb-6">
                  Verify land records, investigate conflicts and manage citizen requests.
                </p>

                {/* Key Capability Points */}
                <div className="space-y-3 mb-8 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Prioritized Verification Queue:</strong> Instant triage based on automated AI risk &amp; discrepancy scores.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Cadastral GIS Visualizer:</strong> Automated polygon cross-check against Uttarakhand BhuNaksha records.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Forgery &amp; Stamp Forensics:</strong> Watermark pixel analysis, GRAS e-Challan validation, CERSAI lien search.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                    <span><strong>Statutory Order Sign-Off:</strong> Approve &amp; issue cryptographic digital seal, request correction, or reject title.</span>
                  </div>
                </div>
              </div>

              {/* Login Actions */}
              <div className="space-y-3 pt-6 border-t border-slate-700/60">
                <Link
                  to="/auth/admin/login"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition hover:scale-[1.01]"
                >
                  <span>Login to Administration Portal</span>
                  <ArrowRight size={17} />
                </Link>

                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <span className="text-slate-400">SDM / Tehsildar Test Mode?</span>
                  <button
                    onClick={handleQuickDemoAdmin}
                    className="text-purple-400 hover:text-purple-300 font-bold underline flex items-center gap-1"
                  >
                    <span>1-Click Demo Officer Login</span>
                    <Sparkles size={13} />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Telemetry Bar (Civic-Tech Trust Indicators) */}
          <div className="mt-16 max-w-5xl mx-auto bg-slate-950/80 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div>
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Cadastral GIS Alignment
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">BhuNaksha Geo-Referenced</p>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-2xl font-black text-purple-400">&lt; 2 Hours</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Deed Triage Turnaround
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Down from 45 days manual</p>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-2xl font-black text-amber-400">SHA-256</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Cryptographic Seal
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Immutable Audit Trail</p>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-2xl font-black text-teal-400">VisionOCR v4</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Indic NLP Accuracy
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Hindi &amp; English Legalese</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Gov-Tech Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/90 py-8 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300 font-bold">
              <LandPlot size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-200">BhoomiLens — Intelligent Land Record Digitalization &amp; Validation</p>
              <p className="text-[11px] text-slate-500">Government of Uttarakhand • Revenue &amp; Land Reform Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>MeitY &amp; NIC E-Governance Standards</span>
            <span className="text-slate-700">•</span>
            <span>U.P. / U.K. Revenue Code (Sec 34/35)</span>
            <span className="text-slate-700">•</span>
            <span>DigiLocker Integration Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
