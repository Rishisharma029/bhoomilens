import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  LandPlot, 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  Download, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const AdminAllRecordsPage: React.FC = () => {
  const { records } = useRecords();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = records.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      r.parcelId?.toLowerCase().includes(q) ||
      r.surveyNo?.toLowerCase().includes(q) ||
      r.khasraNo.toLowerCase().includes(q) ||
      r.ownerName.toLowerCase().includes(q) ||
      r.village.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q);

    const matchesDistrict = districtFilter === 'ALL' || r.district === districtFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold mb-1">
            <LandPlot size={12} />
            <span>Master Cadastral Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            All Land Records (24,581)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete geo-referenced land registry database across 13 districts of Uttarakhand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting Master Land Registry CSV...')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            <Download size={14} />
            <span>Export Registry Data</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Parcel ID, Owner, Survey No..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <span className="font-bold">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-300 bg-white"
            >
              <option value="ALL">All Districts (13)</option>
              <option value="XYZ">District XYZ</option>
              <option value="Haridwar">Haridwar</option>
              <option value="Dehradun">Dehradun</option>
              <option value="Nainital">Nainital</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-300 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ACTION_REQUIRED">Action Required</option>
              <option value="CONFLICT">Conflict</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-4 font-extrabold">Parcel ID</th>
                <th className="py-4 px-4 font-extrabold">Survey No.</th>
                <th className="py-4 px-4 font-extrabold">Owner</th>
                <th className="py-4 px-4 font-extrabold">Area</th>
                <th className="py-4 px-4 font-extrabold">Location</th>
                <th className="py-4 px-4 font-extrabold">Status</th>
                <th className="py-4 px-4 font-extrabold">Last Mutation</th>
                <th className="py-4 px-4 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((rec) => (
                <tr 
                  key={rec.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/admin/records/${rec.id}`)}
                >
                  <td className="py-4 px-4 font-mono font-bold text-purple-900 whitespace-nowrap">
                    <span className="bg-purple-50 text-purple-900 px-2.5 py-1 rounded-md border border-purple-200">
                      {rec.parcelId || `LR-${rec.khasraNo.replace(/[^0-9]/g, '') || '10294'}`}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {rec.surveyNo || rec.khasraNo}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-bold text-slate-900">{rec.ownerName}</p>
                    <p className="text-[10px] text-slate-400">{rec.fatherName}</p>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-800">
                    {rec.area} {rec.areaUnit}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      {rec.village}, {rec.district}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                    {rec.lastUpdated || rec.lastMutationDate}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <Link
                      to={`/admin/records/${rec.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-700 hover:text-white font-bold text-xs text-slate-700 transition"
                    >
                      <span>Inspect Dossier</span>
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
