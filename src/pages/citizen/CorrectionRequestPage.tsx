import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecords } from '../../context/RecordsContext';
import { citizenService } from '../../services/citizenService';
import { CorrectionRequest } from '../../types';
import { 
  FileEdit, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Clock, 
  ChevronLeft,
  Loader2,
  ShieldAlert
} from 'lucide-react';

export const CorrectionRequestPage: React.FC = () => {
  const { docId = 'doc_sub_102' } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { corrections, refreshData } = useRecords();

  const [reason, setReason] = useState<CorrectionRequest['reason']>('AREA_MISMATCH');
  const [khasraNo, setKhasraNo] = useState('304/4');
  const [description, setDescription] = useState(
    'The physical demarcation survey carried out by Lekhpal shows 0.185 Hectares after widening of the colony road, but old deed stated 0.210 Ha. Requesting update to match on-ground 0.185 Ha.'
  );

  const [changes, setChanges] = useState<Array<{ field: string; oldValue: string; newValue: string }>>([
    { field: 'Area (Hectares)', oldValue: '0.210 Hectares', newValue: '0.185 Hectares' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddChangeRow = () => {
    setChanges([...changes, { field: '', oldValue: '', newValue: '' }]);
  };

  const handleRemoveChangeRow = (idx: number) => {
    setChanges(changes.filter((_, i) => i !== idx));
  };

  const handleUpdateChangeRow = (idx: number, key: 'field' | 'oldValue' | 'newValue', val: string) => {
    const copy = [...changes];
    copy[idx][key] = val;
    setChanges(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await citizenService.submitCorrectionRequest({
        documentId: docId,
        khasraNo,
        citizenId: user?.id || 'user_cit_101',
        citizenName: user?.name || 'Ramesh Chandra Joshi',
        reason,
        description,
        requestedChanges: changes.filter(c => c.field.trim() !== ''),
      });

      refreshData();
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/citizen/history');
      }, 1500);
    } catch (err) {
      console.error('Failed to submit correction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            to="/citizen/dashboard"
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
          >
            <ChevronLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
          <AlertTriangle size={13} />
          <span>Statutory Rectification Petition</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          File Correction Request (त्रुटि सुधार प्रार्थना पत्र)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Submit an official rectification request to the Sub-Divisional Magistrate (SDM) or Tehsildar 
          for resolving discrepancy in owner name, land area, or cadastral boundaries.
        </p>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          <div>
            <p className="font-bold">Correction Request Successfully Filed!</p>
            <p className="text-[11px] text-emerald-700">
              Petition registered in circle revenue docket. Redirecting to your Document History timeline...
            </p>
          </div>
        </div>
      )}

      {/* Quick Test Demo Presets */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-purple-950 block">Quick Demo Presets:</span>
          <span className="text-[11px] text-purple-800">Pre-fill common revenue court correction petitions</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setKhasraNo('124/7');
              setReason('INCORRECT_OWNER_NAME');
              setDescription('Typographical error in recorded Khatauni. My legal surname is Sharma as registered in original 1998 sale deed, but was entered as "Kumar" during 2019 digitisation.');
              setChanges([{ field: 'Owner Name', oldValue: 'Rishi Kumar', newValue: 'Rishi Sharma' }]);
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-2xs transition"
          >
            Owner Name: Rishi Kumar → Rishi Sharma
          </button>
          <button
            type="button"
            onClick={() => {
              setKhasraNo('304/4');
              setReason('AREA_MISMATCH');
              setDescription('Physical demarcation survey carried out by Lekhpal shows 0.185 Hectares after road widening, whereas old deed had 0.210 Ha.');
              setChanges([{ field: 'Area (Hectares)', oldValue: '0.210 Hectares', newValue: '0.185 Hectares' }]);
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-purple-200 text-purple-900 font-bold text-xs transition"
          >
            Area: 0.210 Ha → 0.185 Ha
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Khasra and Reason Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Land Parcel (Khasra No.) *
            </label>
            <input
              type="text"
              required
              value={khasraNo}
              onChange={(e) => setKhasraNo(e.target.value)}
              placeholder="e.g. 304/4"
              className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Discrepancy Classification *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
            >
              <option value="AREA_MISMATCH">Area Mismatch / Cadastral Polygon Variance</option>
              <option value="INCORRECT_OWNER_NAME">Spelling / Name Error in Record of Rights</option>
              <option value="BOUNDARY_ERROR">Boundary Direction / Neighbor Description Error</option>
              <option value="SHARE_RATIO_DISPUTE">Co-Sharer Proportion / Khatedar Share Dispute</option>
              <option value="MISSING_COOWNER">Omission of Registered Co-Beneficiary</option>
              <option value="OTHER">Other Procedural Clastification</option>
            </select>
          </div>
        </div>

        {/* Change Rows Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Specific Field Amendments *
            </label>
            <button
              type="button"
              onClick={handleAddChangeRow}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Add Another Field</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {changes.map((row, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    required
                    placeholder="Field Name (e.g. Area, North Boundary)"
                    value={row.field}
                    onChange={(e) => handleUpdateChangeRow(idx, 'field', e.target.value)}
                    className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    required
                    placeholder="Current / Extracted Value"
                    value={row.oldValue}
                    onChange={(e) => handleUpdateChangeRow(idx, 'oldValue', e.target.value)}
                    className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-rose-700 font-medium"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    required
                    placeholder="Requested Corrected Value"
                    value={row.newValue}
                    onChange={(e) => handleUpdateChangeRow(idx, 'newValue', e.target.value)}
                    className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-emerald-800 font-bold"
                  />
                </div>

                {changes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChangeRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Explanation */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Factual Grounds & Supporting Demarcation References *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain ground reality, cite Lekhpal survey dates or court order references..."
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 leading-relaxed"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            Assigned to Circle Revenue Inspector / Kanungo for field spot verification.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Registering Petition...</span>
              </>
            ) : (
              <>
                <span>Submit Correction Petition</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Active Existing Petitions */}
      {corrections.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Correction Petitions in Circle ({corrections.length})
          </h4>

          <div className="space-y-3">
            {corrections.map((cor) => (
              <div key={cor.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    Petition #{cor.id} • Khasra {cor.khasraNo}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Clock size={11} /> {cor.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  "{cor.description}"
                </p>
                {cor.officerNotes && (
                  <p className="text-[11px] font-semibold text-emerald-800 bg-white/70 p-2 rounded border border-amber-200/60">
                    Kanungo Note: {cor.officerNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
