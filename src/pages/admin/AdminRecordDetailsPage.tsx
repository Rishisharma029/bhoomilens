import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRecords } from '../../context/RecordsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationActionModal } from '../../components/admin/VerificationActionModal';
import { 
  ChevronLeft, 
  MapPin, 
  Compass, 
  Users, 
  Sparkles, 
  FileCheck2, 
  Layers, 
  Building2, 
  QrCode,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CadastralGISEngine } from '../../components/gis/CadastralGISEngine';

export const AdminRecordDetailsPage: React.FC = () => {
  const { id = 'rec_uk_003' } = useParams<{ id: string }>();
  const { records, submissions, auditLogs, refreshData } = useRecords();
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const record = records.find(r => r.id === id || r.khasraNo === id) || records[2] || records[0];
  const matchedSubmissions = submissions.filter(s => s.khasraNo === record?.khasraNo);

  if (!record) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-slate-900">Land record not found.</p>
        <Link to="/admin/queue" className="text-xs text-purple-700 underline mt-2 inline-block font-semibold">
          Return to Verification Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin/queue"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <ChevronLeft size={14} />
              <span>Back to Verification Queue</span>
            </Link>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-mono text-purple-800 font-semibold bg-purple-50 px-2 py-0.5 rounded">
              Record ID: {record.id}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Statutory Cadastral Record: Khasra {record.khasraNo}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {record.village}, Tehsil {record.tehsil}, District {record.district} • Revenue Division Dehradun
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <StatusBadge status={record.status} />
          
          <Link
            to={`/admin/records/${record.id}/ai-validation`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition border border-purple-300 shadow-xs"
          >
            <Sparkles size={14} className="text-purple-700" />
            <span>AI Validation Shield</span>
          </Link>

          <button
            onClick={() => setActionModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition shadow-xs"
          >
            Take Action
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Cadastral Land Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cadastral Polygon Simulation Map */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers size={16} className="text-purple-600" />
                  <span>BhuNaksha Cadastral GIS Polygon Overlay</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time geo-referenced survey map with boundary coordinate tracking
                </p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
                GIS Layer Live
              </span>
            </div>

            {/* Interactive Cadastral GIS Engine (BhuNaksha Vector Cadastre & Satellite Overlap) */}
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <CadastralGISEngine 
                khasraNo={record.khasraNo} 
                deedArea={typeof record.area === 'number' ? record.area : 2.35} 
                height="500px" 
              />
            </div>
          </div>

          {/* Legal Ownership Dossier */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Primary Khatedar & Title Record
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] uppercase font-bold">Recorded Khatedar</span>
                <p className="font-bold text-slate-900 mt-0.5">{record.ownerName}</p>
                <p className="text-slate-500 text-[11px]">{record.fatherName}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] uppercase font-bold">Khata & Khasra No</span>
                <p className="font-bold text-slate-900 mt-0.5">Khata #{record.khataNo}</p>
                <p className="text-slate-500 text-[11px]">Khasra {record.khasraNo}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] uppercase font-bold">Total Land Holding</span>
                <p className="font-bold text-slate-900 mt-0.5">{record.area} {record.areaUnit}</p>
                <p className="text-emerald-700 text-[11px] font-semibold">{record.landType}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] uppercase font-bold">Estimated Land Value</span>
                <p className="font-bold text-slate-900 mt-0.5">₹{(record.marketValueEstimate / 100000).toFixed(1)} Lakhs</p>
                <p className="text-slate-500 text-[11px]">Circle Rate Valuation</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] uppercase font-bold">Last Mutation Date</span>
                <p className="font-bold text-slate-900 mt-0.5">{record.lastMutationDate}</p>
                <p className="text-slate-500 text-[11px]">Under Section 34/35</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] uppercase font-bold">Aadhaar Last 4</span>
                <p className="font-bold text-slate-900 mt-0.5 font-mono">XXXX-XXXX-{record.aadhaarLastFour}</p>
                <p className="text-slate-500 text-[11px]">UIDAI Verified</p>
              </div>
            </div>

            {/* Boundaries */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1 mb-2">
                <Compass size={13} />
                <span>Statutory Four Boundaries (चौहद्दी)</span>
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div><strong className="text-slate-600">North:</strong> <span className="text-slate-800">{record.boundaries.north}</span></div>
                <div><strong className="text-slate-600">South:</strong> <span className="text-slate-800">{record.boundaries.south}</span></div>
                <div><strong className="text-slate-600">East:</strong> <span className="text-slate-800">{record.boundaries.east}</span></div>
                <div><strong className="text-slate-600">West:</strong> <span className="text-slate-800">{record.boundaries.west}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Connected Submissions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick AI Action Card */}
          <div className="bg-purple-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-purple-300" />
              <h4 className="text-sm font-bold">Automated AI Inspection</h4>
            </div>
            <p className="text-xs text-purple-200/90 leading-relaxed">
              Scan deed against state registry database, detect area discrepancies, and review seal pixel authenticity.
            </p>
            <Link
              to={`/admin/records/${record.id}/ai-validation`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold transition shadow-md"
            >
              <span>Launch AI Validation Shield</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Submissions Linked to this Parcel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Submitted Deeds for Khasra ({matchedSubmissions.length})
            </h4>

            <div className="space-y-2">
              {matchedSubmissions.map((sub) => (
                <div key={sub.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate max-w-[160px]">
                      {sub.fileName}
                    </span>
                    <StatusBadge status={sub.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Uploaded by: {sub.citizenName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <VerificationActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        documentId={matchedSubmissions[0]?.id || 'doc_sub_102'}
        khasraNo={record.khasraNo}
        citizenName={record.ownerName}
        onSuccess={() => refreshData()}
      />
    </div>
  );
};
