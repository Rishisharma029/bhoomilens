import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecords } from '../../context/RecordsContext';
import { adminService } from '../../services/adminService';
import { VerificationActionModal } from '../../components/admin/VerificationActionModal';
import { 
  ShieldCheck, 
  Inbox, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  FileSearch, 
  FileSpreadsheet, 
  CheckCircle2, 
  Users,
  Sparkles,
  Search,
  Filter,
  Layers,
  ShieldAlert,
  FileEdit,
  LandPlot,
  Files,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';

interface VerificationQueueItem {
  recordId: string;
  citizen: string;
  surveyNo: string;
  submitted: string;
  aiScore: number;
  status: 'Review' | 'Auto-Verified' | 'High Risk' | 'Under Review';
  location: string;
  docType: string;
  rawRecordId: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { records, submissions, auditLogs, refreshData } = useRecords();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubForAction, setSelectedSubForAction] = useState<any | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  // Exact Verification Queue Table rows specified by user:
  // LR-10294  | Rishi Sharma | 124/7 | Today | 82% | Review | Inspect
  // LR-10295  | Amit Kumar   | 88/2  | Today | 97% | Review | Inspect
  // + additional realistic rows
  const [queueItems, setQueueItems] = useState<VerificationQueueItem[]>([
    {
      recordId: 'LR-10294',
      citizen: 'Rishi Sharma',
      surveyNo: '124/7',
      submitted: 'Today',
      aiScore: 82,
      status: 'Review',
      location: 'Village ABC, District XYZ',
      docType: 'Registry.pdf',
      rawRecordId: 'rec_uk_10294'
    },
    {
      recordId: 'LR-10295',
      citizen: 'Amit Kumar',
      surveyNo: '88/2',
      submitted: 'Today',
      aiScore: 97,
      status: 'Review',
      location: 'Manglaur Dehat, Haridwar',
      docType: 'Registered_Sale_Deed.pdf',
      rawRecordId: 'rec_uk_10482'
    },
    {
      recordId: 'LR-10296',
      citizen: 'Sunita Devi Chauhan',
      surveyNo: '304/4',
      submitted: 'Yesterday',
      aiScore: 68,
      status: 'High Risk',
      location: 'Dakpathar, Vikasnagar',
      docType: 'Khatauni_ROR.pdf',
      rawRecordId: 'rec_uk_10651'
    },
    {
      recordId: 'LR-10297',
      citizen: 'Vikram Singh Rawat',
      surveyNo: '512/9',
      submitted: '12 Sep',
      aiScore: 94,
      status: 'Review',
      location: 'Kathgodam Rural, Nainital',
      docType: 'Commercial_Deed.pdf',
      rawRecordId: 'rec_uk_10903'
    },
    {
      recordId: 'LR-10298',
      citizen: 'Pooja Verma',
      surveyNo: '142/2 Kha',
      submitted: '10 Sep',
      aiScore: 99,
      status: 'Auto-Verified',
      location: 'Tapovan Khurd, Rishikesh',
      docType: 'Mutation_Certificate.pdf',
      rawRecordId: 'rec_uk_10294'
    },
  ]);

  useEffect(() => {
    adminService.getLiveQueueItems().then(items => {
      if (items && items.length > 0) {
        setQueueItems(items as any);
      }
    });
  }, [submissions]);

  const filteredQueue = queueItems.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.recordId.toLowerCase().includes(q) ||
      item.citizen.toLowerCase().includes(q) ||
      item.surveyNo.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score >= 75) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getStatusBadge = (status: VerificationQueueItem['status']) => {
    switch (status) {
      case 'Auto-Verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Auto-Verified</span>
          </span>
        );
      case 'High Risk':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300 animate-pulse">
            <ShieldAlert size={12} className="text-rose-600" />
            <span>High Risk</span>
          </span>
        );
      case 'Review':
      case 'Under Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} className="text-blue-600" />
            <span>Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Officer Command Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-bold">
                <ShieldCheck size={14} className="text-purple-300" />
                <span>Executive Revenue Command Console</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                NIC Uttarakhand Node 4 Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {user?.designation || 'Sub-Divisional Magistrate (SDM)'}: {user?.name || 'Rajeshwar Singh Negi'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal">
              BhoomiLens Automated Titling, Cadastral GIS Conflict Engine &amp; Statutory Digital Sealing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/queue"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition hover:scale-[1.02]"
            >
              <Inbox size={16} />
              <span>Full Verification Queue (1,243)</span>
            </Link>

            <Link
              to="/admin/conflicts"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/60 font-bold text-xs transition"
            >
              <ShieldAlert size={15} className="text-rose-400" />
              <span>Conflict Center (287)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* TOP STATISTICS (Requested exact metrics:
          Total Land Records: 24,581
          Pending Verification: 1,243
          Conflicts Detected: 287
          Correction Requests: 164
          Documents Processed: 21,904
      ) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Jurisdiction Telemetry &amp; Registry Load
          </span>
          <span className="text-xs font-mono text-slate-400">
            Dehradun Division • Refreshed Live
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Total Land Records */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-400 transition flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Land Records
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <LandPlot size={17} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                24,581
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Cadastral plots indexed</p>
            </div>
          </div>

          {/* Card 2: Pending Verification */}
          <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs hover:border-purple-400 transition flex flex-col justify-between bg-purple-50/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                Pending Verification
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                <Inbox size={17} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-purple-900 tracking-tight">
                1,243
              </span>
              <p className="text-[11px] text-purple-700/80 mt-0.5 font-medium">Awaiting officer triage</p>
            </div>
          </div>

          {/* Card 3: Conflicts Detected */}
          <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs hover:border-rose-400 transition flex flex-col justify-between bg-rose-50/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                Conflicts Detected
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                <ShieldAlert size={17} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-900 tracking-tight">
                  287
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 animate-pulse">
                  High Risk
                </span>
              </div>
              <p className="text-[11px] text-rose-700/80 mt-0.5 font-medium">Boundary &amp; overlap flags</p>
            </div>
          </div>

          {/* Card 4: Correction Requests */}
          <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs hover:border-amber-400 transition flex flex-col justify-between bg-amber-50/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Correction Requests
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <FileEdit size={17} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-amber-900 tracking-tight">
                164
              </span>
              <p className="text-[11px] text-amber-700/80 mt-0.5 font-medium">Citizen petitions filed</p>
            </div>
          </div>

          {/* Card 5: Documents Processed */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs hover:border-emerald-400 transition flex flex-col justify-between bg-emerald-50/20 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Documents Processed
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Files size={17} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-emerald-900 tracking-tight">
                21,904
              </span>
              <p className="text-[11px] text-emerald-700/80 mt-0.5 font-medium">OCR digitized deeds</p>
            </div>
          </div>

        </div>
      </div>

      {/* VERIFICATION QUEUE SECTION (Requested exact table) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Verification Queue
              </h2>
              <span className="text-xs font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                {filteredQueue.length} Active Items
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Triage deeds and mutations submitted by citizens with real-time AI validation scores
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={14} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Record ID, Citizen, Survey..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50"
              />
            </div>

            <Link
              to="/admin/queue"
              className="text-xs font-bold text-purple-700 hover:text-purple-800 whitespace-nowrap"
            >
              View Full Queue →
            </Link>
          </div>
        </div>

        {/* The Exact Table:
            Record ID | Citizen | Survey No. | Submitted | AI Score | Status | Action
        */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Record ID</th>
                <th className="py-3.5 px-4 font-extrabold">Citizen</th>
                <th className="py-3.5 px-4 font-extrabold">Survey No.</th>
                <th className="py-3.5 px-4 font-extrabold">Submitted</th>
                <th className="py-3.5 px-4 font-extrabold">AI Score</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-4 font-extrabold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.map((item) => (
                <tr 
                  key={item.recordId}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/admin/records/${item.rawRecordId}/ai-validation`)}
                >
                  {/* Record ID */}
                  <td className="py-4 px-4 font-mono font-bold text-purple-900 whitespace-nowrap">
                    <span className="bg-purple-50 text-purple-900 px-2.5 py-1 rounded-md border border-purple-200">
                      {item.recordId}
                    </span>
                  </td>

                  {/* Citizen */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-bold text-slate-900">{item.citizen}</p>
                    <p className="text-[10px] text-slate-400">{item.location}</p>
                  </td>

                  {/* Survey No. */}
                  <td className="py-4 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                    {item.surveyNo}
                  </td>

                  {/* Submitted */}
                  <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                    {item.submitted}
                  </td>

                  {/* AI Score */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border font-mono ${getScoreBadgeColor(item.aiScore)}`}>
                        {item.aiScore}%
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Action: Inspect */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <Link
                      to={`/admin/records/${item.rawRecordId}/ai-validation`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xs transition hover:scale-105"
                    >
                      <span>Inspect</span>
                      <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Decision Action Modal */}
      {selectedSubForAction && (
        <VerificationActionModal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          documentId={selectedSubForAction.id}
          khasraNo={selectedSubForAction.khasraNo}
          citizenName={selectedSubForAction.citizenName}
          onSuccess={() => refreshData()}
        />
      )}
    </div>
  );
};
