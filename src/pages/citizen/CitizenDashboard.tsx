import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecords } from '../../context/RecordsContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  LandPlot, 
  Layers, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  FileEdit, 
  ShieldCheck,
  MapPin
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { records, submissions } = useRecords();

  const totalArea = records.reduce((acc, r) => acc + r.area, 0).toFixed(3);
  const verifiedCount = records.filter(r => r.status === 'VERIFIED').length;
  const pendingCount = submissions.filter(s => s.status === 'PENDING_AI' || s.status === 'FLAGGED_DISCREPANCY').length;

  return (
    <div className="w-full space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden w-full border border-emerald-700/50">
        <div className="absolute -right-8 -bottom-8 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-400/40 text-emerald-200 text-xs font-bold mb-2.5">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>Aadhaar Authenticated: {user?.aadhaarMasked || 'XXXX-XXXX-8492'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              Namaste, {user?.name || 'Sunita Devi Chauhan'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 max-w-3xl leading-relaxed font-normal">
              Welcome to your personal Dev Bhoomi Digital Land Vault. Review registered parcels, track pending AI deed verifications, and access digitally sealed Records of Rights (ROR).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/citizen/upload"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition hover:scale-[1.02]"
            >
              <UploadCloud size={17} />
              <span>Upload Land Document</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Owned Land Parcels"
          value={records.length}
          subtitle="Registered across 2 circles"
          icon={LandPlot}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <MetricCard
          title="Total Land Holding"
          value={`${totalArea} Ha`}
          subtitle="Approx ~ 42.5 Nali"
          icon={Layers}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-700"
        />
        <MetricCard
          title="Verified Titles"
          value={verifiedCount}
          subtitle="Digitally Sealed & Stamped"
          icon={CheckCircle2}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-700"
        />
        <MetricCard
          title="In Verification Pipeline"
          value={pendingCount}
          subtitle="AI Cadastral Scan active"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/citizen/upload"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Upload Registered Deed</h4>
          <p className="text-xs text-slate-500 mt-1">
            Submit a sale deed, 7/12 extract or mutation order to trigger automated OCR and BhuNaksha check.
          </p>
          <span className="text-xs font-bold text-emerald-700 mt-3 inline-flex items-center gap-1">
            <span>Proceed to upload</span>
            <ArrowRight size={13} />
          </span>
        </Link>

        <Link
          to="/citizen/review-extracted/doc_sub_101"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Review Extracted Data</h4>
          <p className="text-xs text-slate-500 mt-1">
            Inspect side-by-side OCR fields with confidence ratings for Khasra 88/1 Ga before revenue sign-off.
          </p>
          <span className="text-xs font-bold text-blue-700 mt-3 inline-flex items-center gap-1">
            <span>Open Review Engine</span>
            <ArrowRight size={13} />
          </span>
        </Link>

        <Link
          to="/citizen/correction-request/doc_sub_102"
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileEdit size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">File Correction Request</h4>
          <p className="text-xs text-slate-500 mt-1">
            Found an area variance or boundary discrepancy? File an official rectification petition with Kanungo.
          </p>
          <span className="text-xs font-bold text-amber-700 mt-3 inline-flex items-center gap-1">
            <span>File Rectification</span>
            <ArrowRight size={13} />
          </span>
        </Link>
      </div>

      {/* Main Content Split: My Land Parcels & Recent Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Registered Parcels (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">My Registered Land Records</h3>
              <p className="text-xs text-slate-500">Official cadastral plots linked to your identity</p>
            </div>
            <Link
              to="/citizen/records"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All Records</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {records.slice(0, 3).map((rec) => (
              <div key={rec.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-lg px-2 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Khasra {rec.khasraNo}</span>
                    <span className="text-xs font-mono text-slate-500">Khata #{rec.khataNo}</span>
                    <StatusBadge status={rec.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{rec.village}, Tehsil {rec.tehsil}, {rec.district}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Area: <strong className="text-slate-700">{rec.area} {rec.areaUnit}</strong> • Type: {rec.landType} • Value: ₹{(rec.marketValueEstimate / 100000).toFixed(1)} Lakhs
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/citizen/records`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                  >
                    View Parcel
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Submissions Status Glance */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Recent Applications</h3>
              <p className="text-xs text-slate-500">Uploaded deeds & orders</p>
            </div>
            <Link
              to="/citizen/history"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              History →
            </Link>
          </div>

          <div className="space-y-3">
            {submissions.slice(0, 3).map((sub) => (
              <div key={sub.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                    {sub.fileName}
                  </span>
                  <StatusBadge status={sub.status} size="sm" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Khasra: {sub.khasraNo}</span>
                  <span>{sub.uploadedAt.split(' ')[0]}</span>
                </div>
                <div className="pt-1 border-t border-slate-200/60 flex justify-between items-center text-[11px]">
                  <span className="text-slate-600 font-medium">{sub.docType.replace('_', ' ')}</span>
                  <Link
                    to={`/citizen/review-extracted/${sub.id}`}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Inspect OCR →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
