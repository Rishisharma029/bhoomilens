import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Layers, 
  AlertTriangle, 
  ArrowRight, 
  FileWarning, 
  ExternalLink,
  MapPin,
  CheckCircle2,
  Lock,
  Building2,
  Users,
  Compass,
  FileText,
  BadgeAlert,
  Sparkles
} from 'lucide-react';

interface ConflictCard {
  id: string;
  type: 'AREA_MISMATCH' | 'OWNER_CONFLICT' | 'BOUNDARY_OVERLAP' | 'MORTGAGE_LIEN';
  title: string;
  surveyNo: string;
  previousValue?: string;
  currentValue?: string;
  conflictDetail?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  recordId: string;
  targetPath: string;
  village: string;
  district: string;
  partiesInvolved: string;
  aiDetectionEngine: string;
}

export const ConflictCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Conflict Cards matching the user's exact specifications:
  // 1. ⚠ AREA MISMATCH
  //    Survey No. 124/7
  //    Previous: 2.35 acres
  //    Current: 3.10 acres
  //    Severity: Medium
  //    [Investigate]
  //
  // 2. ⚠ OWNER CONFLICT
  //    Survey No. 88/2
  //    Two different owners detected
  //    Severity: High
  //    [Investigate]
  const conflictCards: ConflictCard[] = [
    {
      id: 'conf_1',
      type: 'AREA_MISMATCH',
      title: 'AREA MISMATCH',
      surveyNo: '124/7',
      previousValue: '2.35 acres',
      currentValue: '3.10 acres',
      severity: 'Medium',
      recordId: 'LR-10294',
      targetPath: '/admin/records/rec_uk_10294/ai-validation',
      village: 'Village ABC',
      district: 'District XYZ',
      partiesInvolved: 'Rishi Sharma (Claimant) vs Khatauni Fasli 1426 Record',
      aiDetectionEngine: 'BhuNaksha Cadastral Polygon Variance (+0.75 Acres)'
    },
    {
      id: 'conf_2',
      type: 'OWNER_CONFLICT',
      title: 'OWNER CONFLICT',
      surveyNo: '88/2',
      conflictDetail: 'Two different owners detected',
      severity: 'High',
      recordId: 'LR-10295',
      targetPath: '/admin/records/rec_uk_10482/ai-validation',
      village: 'Manglaur Dehat',
      district: 'Haridwar',
      partiesInvolved: 'Amit Kumar (Purchaser) vs Harishankar Sharma (Prior Registered Title)',
      aiDetectionEngine: 'Registry Database Duplicate Index Match #UK-ROO-9941'
    },
    {
      id: 'conf_3',
      type: 'BOUNDARY_OVERLAP',
      title: 'BOUNDARY OVERLAP',
      surveyNo: '512/9 Ka',
      previousValue: 'Buffer clear (2018)',
      currentValue: 'Railway corridor collision (-18.4%)',
      conflictDetail: 'Cadastral polygon intersects with Central Railway Reservation verge',
      severity: 'High',
      recordId: 'LR-10903',
      targetPath: '/admin/records/rec_uk_10903/ai-validation',
      village: 'Kathgodam Rural',
      district: 'Nainital',
      partiesInvolved: 'Devendra Bhatt vs Northern Railway Infrastructure Division',
      aiDetectionEngine: 'Geo-Spatial GIS Polygon Intersection Check'
    },
    {
      id: 'conf_4',
      type: 'MORTGAGE_LIEN',
      title: 'DUPLICATE MORTGAGE / CERSAI LIEN',
      surveyNo: '304/4',
      conflictDetail: 'Active Agricultural Credit Lien of ₹18.5L detected in State Bank Registry',
      severity: 'Critical',
      recordId: 'LR-10651',
      targetPath: '/admin/records/rec_uk_10651/ai-validation',
      village: 'Dakpathar',
      district: 'Dehradun',
      partiesInvolved: 'Sunita Devi Chauhan vs State Bank of India (Vikasnagar Branch)',
      aiDetectionEngine: 'CERSAI National Central Registry API Integration'
    }
  ];

  const filtered = conflictCards.filter(c => {
    const matchesFilter = 
      activeFilter === 'ALL' || 
      (activeFilter === 'AREA' && c.type === 'AREA_MISMATCH') ||
      (activeFilter === 'OWNER' && c.type === 'OWNER_CONFLICT') ||
      (activeFilter === 'BOUNDARY' && c.type === 'BOUNDARY_OVERLAP') ||
      (activeFilter === 'LIEN' && c.type === 'MORTGAGE_LIEN');

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      c.surveyNo.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.recordId.toLowerCase().includes(q) ||
      c.village.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const getSeverityBadge = (sev: ConflictCard['severity']) => {
    switch (sev) {
      case 'Critical':
        return (
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
            Severity: Critical
          </span>
        );
      case 'High':
        return (
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            Severity: High
          </span>
        );
      case 'Medium':
        return (
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            Severity: Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Severity: Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-rose-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold mb-2">
              <ShieldAlert size={14} className="text-rose-400" />
              <span>BhoomiLens Intelligent Validation Shield</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Conflict Center (287 Detected)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal">
              High-priority discrepancy triage: Automated AI detection of area variances, double ownership claims, 
              undisclosed bank liens, and cadastral boundary collisions across Uttarakhand.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-rose-900/60 text-rose-200 px-3 py-2 rounded-xl border border-rose-500/40">
              Active Triage: 4 Flagged Parcels
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Conflicts (287)' },
            { id: 'AREA', label: 'Area Mismatches (142)' },
            { id: 'OWNER', label: 'Owner Conflicts (84)' },
            { id: 'BOUNDARY', label: 'Boundary Overlaps (41)' },
            { id: 'LIEN', label: 'Lien & Encumbrance (20)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Survey No, Owner..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-600 bg-white"
          />
        </div>
      </div>

      {/* STANDOUT CONFLICT CARDS GRID (Requested format) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((card) => {
          const isArea = card.type === 'AREA_MISMATCH';
          const isOwner = card.type === 'OWNER_CONFLICT';
          const isCritical = card.severity === 'Critical';

          return (
            <div
              key={card.id}
              className={`bg-white rounded-3xl border-2 p-6 shadow-md transition-all hover:shadow-xl flex flex-col justify-between ${
                isCritical 
                  ? 'border-red-400 bg-gradient-to-b from-red-50/20 to-white' 
                  : isOwner 
                  ? 'border-rose-300 bg-gradient-to-b from-rose-50/20 to-white' 
                  : 'border-amber-300 bg-gradient-to-b from-amber-50/20 to-white'
              }`}
            >
              <div>
                {/* Top Badge & Severity */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                      isOwner ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-950'
                    }`}>
                      <AlertTriangle size={14} className={isOwner ? 'text-rose-700' : 'text-amber-700'} />
                      <span>⚠ {card.title}</span>
                    </span>
                  </div>

                  {getSeverityBadge(card.severity)}
                </div>

                {/* Survey Number */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Survey Number
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-mono mt-0.5">
                    Survey No. {card.surveyNo}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{card.village}, {card.district}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-purple-900 font-bold">{card.recordId}</span>
                  </p>
                </div>

                {/* Key Discrepancy Evidence Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5 space-y-2 text-xs">
                  {card.previousValue && card.currentValue ? (
                    <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-200/80">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Previous Registered:
                        </span>
                        <p className="text-sm font-black text-slate-700 font-mono mt-0.5">
                          {card.previousValue}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                          Current Submitted:
                        </span>
                        <p className="text-sm font-black text-rose-700 font-mono mt-0.5">
                          {card.currentValue}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="pb-2 border-b border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                        Conflict Detected:
                      </span>
                      <p className="text-sm font-black text-rose-900 mt-0.5">
                        {card.conflictDetail}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1 text-[11px] text-slate-600 pt-1">
                    <p>
                      <strong>Parties Involved:</strong> {card.partiesInvolved}
                    </p>
                    <p className="text-purple-800 font-semibold flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>{card.aiDetectionEngine}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button: [Investigate] */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  BhoomiLens Inspector v2.4
                </span>

                <Link
                  to={card.targetPath}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition hover:scale-[1.02]"
                >
                  <span>Investigate</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
