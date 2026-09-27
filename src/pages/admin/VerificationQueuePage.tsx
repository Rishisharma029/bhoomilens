import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { adminService } from '../../services/adminService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationActionModal } from '../../components/admin/VerificationActionModal';
import { 
  Inbox, 
  Search, 
  Filter, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Layers,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const VerificationQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { records, submissions, refreshData } = useRecords();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSubForAction, setSelectedSubForAction] = useState<any | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [queueData, setQueueData] = useState<any[]>([
    {
      recordId: 'LR-10294',
      citizen: 'Rishi Sharma',
      surveyNo: '124/7',
      submitted: 'Today',
      aiScore: 82,
      status: 'Review',
      rawRecordId: 'rec_uk_10294',
      location: 'Village ABC, District XYZ',
      docType: 'Registry.pdf'
    },
    {
      recordId: 'LR-10295',
      citizen: 'Amit Kumar',
      surveyNo: '88/2',
      submitted: 'Today',
      aiScore: 97,
      status: 'Review',
      rawRecordId: 'rec_uk_10482',
      location: 'Manglaur Dehat, Haridwar',
      docType: 'Registered_Sale_Deed.pdf'
    },
    {
      recordId: 'LR-10296',
      citizen: 'Sunita Devi Chauhan',
      surveyNo: '304/4',
      submitted: 'Yesterday',
      aiScore: 68,
      status: 'High Risk',
      rawRecordId: 'rec_uk_10651',
      location: 'Dakpathar, Vikasnagar',
      docType: 'Khatauni_ROR.pdf'
    },
    {
      recordId: 'LR-10297',
      citizen: 'Vikram Singh Rawat',
      surveyNo: '512/9',
      submitted: '12 Sep',
      aiScore: 94,
      status: 'Review',
      rawRecordId: 'rec_uk_10903',
      location: 'Kathgodam Rural, Nainital',
      docType: 'Commercial_Deed.pdf'
    },
    {
      recordId: 'LR-10298',
      citizen: 'Pooja Verma',
      surveyNo: '142/2 Kha',
      submitted: '10 Sep',
      aiScore: 99,
      status: 'Auto-Verified',
      rawRecordId: 'rec_uk_10294',
      location: 'Tapovan Khurd, Rishikesh',
      docType: 'Mutation_Order.pdf'
    },
    {
      recordId: 'LR-10299',
      citizen: 'Harish Chandra Pant',
      surveyNo: '64/3',
      submitted: '08 Sep',
      aiScore: 71,
      status: 'High Risk',
      rawRecordId: 'rec_uk_10651',
      location: 'Almora Sadar, Almora',
      docType: 'Partition_Deed.pdf'
    }
  ]);

  useEffect(() => {
    adminService.getLiveQueueItems().then(items => {
      if (items && items.length > 0) {
        setQueueData(items);
      }
    });
  }, [submissions]);

  const filteredQueue = queueData.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      item.recordId.toLowerCase().includes(q) ||
      item.citizen.toLowerCase().includes(q) ||
      item.surveyNo.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score >= 75) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Auto-Verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Auto-Verified</span>
          </span>
        );
      case 'High Risk':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300 animate-pulse">
            <ShieldAlert size={12} className="text-rose-600" />
            <span>High Risk</span>
          </span>
        );
      case 'Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={12} className="text-blue-600" />
            <span>Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold mb-1">
            <Inbox size={12} />
            <span>Revenue Executive Triage</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Verification Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time queue of deeds awaiting statutory officer inspection, cadastral validation, and digital sealing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            Queue Depth: <strong className="text-purple-700">{filteredQueue.length} Active</strong> / 1,243 Total
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Record ID, Citizen, Survey No..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <span className="font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-semibold"
            >
              <option value="ALL">All Applications</option>
              <option value="Review">Review</option>
              <option value="High Risk">High Risk</option>
              <option value="Auto-Verified">Auto-Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-4 font-extrabold">Record ID</th>
                <th className="py-4 px-4 font-extrabold">Citizen</th>
                <th className="py-4 px-4 font-extrabold">Survey No.</th>
                <th className="py-4 px-4 font-extrabold">Submitted</th>
                <th className="py-4 px-4 font-extrabold">AI Score</th>
                <th className="py-4 px-4 font-extrabold">Status</th>
                <th className="py-4 px-4 font-extrabold text-right">Action</th>
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
                    <p className="font-bold text-slate-900 text-xs">{item.citizen}</p>
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
    </div>
  );
};
