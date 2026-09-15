import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LandRecord } from '../../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  FileText, 
  ArrowRight, 
  Eye, 
  Layers, 
  LayoutGrid, 
  LayoutList,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Sparkles,
  Plus
} from 'lucide-react';

type FilterTab = 'ALL' | 'VERIFIED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'CONFLICT';

export const MyRecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const { records } = useRecords();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredRecords = records.filter(rec => {
    // Search by Parcel ID, Survey No, Owner, Location
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !q ||
      (rec.parcelId && rec.parcelId.toLowerCase().includes(q)) ||
      (rec.surveyNo && rec.surveyNo.toLowerCase().includes(q)) ||
      rec.khasraNo.toLowerCase().includes(q) ||
      rec.ownerName.toLowerCase().includes(q) ||
      rec.village.toLowerCase().includes(q) ||
      rec.district.toLowerCase().includes(q);

    // Tab filter: All / Verified / Under Review / Action Required / Conflict
    let matchesTab = true;
    if (activeTab === 'VERIFIED') {
      matchesTab = rec.status === 'VERIFIED';
    } else if (activeTab === 'UNDER_REVIEW') {
      matchesTab = rec.status === 'UNDER_REVIEW' || rec.status === 'PENDING_AI';
    } else if (activeTab === 'ACTION_REQUIRED') {
      matchesTab = rec.status === 'ACTION_REQUIRED' || rec.status === 'CORRECTION_REQUESTED';
    } else if (activeTab === 'CONFLICT') {
      matchesTab = rec.status === 'CONFLICT' || rec.status === 'FLAGGED_DISCREPANCY';
    }

    return matchesSearch && matchesTab;
  });

  const getCountForTab = (tab: FilterTab) => {
    if (tab === 'ALL') return records.length;
    if (tab === 'VERIFIED') return records.filter(r => r.status === 'VERIFIED').length;
    if (tab === 'UNDER_REVIEW') return records.filter(r => r.status === 'UNDER_REVIEW' || r.status === 'PENDING_AI').length;
    if (tab === 'ACTION_REQUIRED') return records.filter(r => r.status === 'ACTION_REQUIRED' || r.status === 'CORRECTION_REQUESTED').length;
    if (tab === 'CONFLICT') return records.filter(r => r.status === 'CONFLICT' || r.status === 'FLAGGED_DISCREPANCY').length;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
            <Sparkles size={12} />
            <span>Digital Land Registry Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Land Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and view verified cadastral parcels, ownership titles, and AI validation reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/citizen/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Digitize New Document</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'ALL', label: 'All Records' },
          { id: 'VERIFIED', label: 'Verified', color: 'text-emerald-700' },
          { id: 'UNDER_REVIEW', label: 'Under Review', color: 'text-blue-700' },
          { id: 'ACTION_REQUIRED', label: 'Action Required', color: 'text-amber-700' },
          { id: 'CONFLICT', label: 'Conflict', color: 'text-rose-700' },
        ].map((tab) => {
          const count = getCountForTab(tab.id as FilterTab);
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FilterTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Layout Toggle Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Parcel ID (e.g. LR-10294), Survey No, Owner, Location..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-800 font-bold">{filteredRecords.length}</strong> parcels
          </span>

          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition ${
                viewMode === 'table' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table / Grid Container */}
      {viewMode === 'table' ? (
        /* 1. SEARCHABLE TABLE */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-extrabold">Parcel ID</th>
                  <th className="py-3.5 px-4 font-extrabold">Survey No.</th>
                  <th className="py-3.5 px-4 font-extrabold">Owner</th>
                  <th className="py-3.5 px-4 font-extrabold">Area</th>
                  <th className="py-3.5 px-4 font-extrabold">Location</th>
                  <th className="py-3.5 px-4 font-extrabold">Status</th>
                  <th className="py-3.5 px-4 font-extrabold">Last Updated</th>
                  <th className="py-3.5 px-4 font-extrabold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => {
                  const parcelId = rec.parcelId || `LR-${rec.khasraNo.replace(/[^0-9]/g, '') || '10294'}`;
                  const surveyNo = rec.surveyNo || rec.khasraNo;
                  const locationStr = `${rec.village}, ${rec.district}`;
                  const areaStr = `${rec.area} ${rec.areaUnit}`;

                  return (
                    <tr 
                      key={rec.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/citizen/records/${rec.id}`)}
                    >
                      {/* Parcel ID */}
                      <td className="py-4 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200">
                          {parcelId}
                        </span>
                      </td>

                      {/* Survey No */}
                      <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {surveyNo}
                      </td>

                      {/* Owner */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{rec.ownerName}</p>
                        <p className="text-[11px] text-slate-400">{rec.fatherName}</p>
                      </td>

                      {/* Area */}
                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-800">
                        <span className="font-bold">{areaStr}</span>
                        <span className="text-[10px] text-slate-400 block">{rec.landType}</span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span>{locationStr}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={rec.status} />
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {rec.lastUpdated || rec.lastMutationDate}
                      </td>

                      {/* View Action */}
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <Link
                          to={`/citizen/records/${rec.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-700 font-bold text-xs transition shadow-2xs"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search size={20} />
              </div>
              <p className="text-sm font-bold text-slate-900">No matching land records found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search terms or filter selection. You can also upload and digitize a new land deed.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('ALL');
                }}
                className="text-xs font-bold text-emerald-700 underline pt-1"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 2. CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((rec) => {
            const parcelId = rec.parcelId || `LR-${rec.khasraNo.replace(/[^0-9]/g, '') || '10294'}`;
            const surveyNo = rec.surveyNo || rec.khasraNo;

            return (
              <div
                key={rec.id}
                onClick={() => navigate(`/citizen/records/${rec.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-500/80 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-extrabold bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-200">
                      {parcelId}
                    </span>
                    <StatusBadge status={rec.status} size="sm" />
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    Survey No. {surveyNo}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Owner: <strong className="text-slate-900 font-bold">{rec.ownerName}</strong>
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Area:</span>
                      <span className="font-bold text-slate-800">{rec.area} {rec.areaUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-slate-700">{rec.village}, {rec.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Updated:</span>
                      <span className="font-mono text-slate-500 text-[11px]">{rec.lastUpdated || rec.lastMutationDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                  <Link
                    to={`/citizen/records/${rec.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>View Record Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
