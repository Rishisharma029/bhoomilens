import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useRecords } from '../../context/RecordsContext';
import { adminService } from '../../services/adminService';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Stamp, 
  Loader2,
  ShieldAlert
} from 'lucide-react';

interface VerificationActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  khasraNo: string;
  citizenName: string;
  onSuccess?: () => void;
}

export const VerificationActionModal: React.FC<VerificationActionModalProps> = ({
  isOpen,
  onClose,
  documentId,
  khasraNo,
  citizenName,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { refreshData } = useRecords();

  const [decision, setDecision] = useState<'APPROVE' | 'REQUEST_CORRECTION' | 'REJECT'>('APPROVE');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultSeal, setResultSeal] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await adminService.executeDecision({
        documentId,
        decision,
        officerName: user?.name || 'SDM Dehradun',
        officerDesignation: user?.designation || 'Sub-Divisional Magistrate',
        remarks,
      });

      refreshData();

      if (response.sealHash) {
        setResultSeal(response.sealHash);
      } else {
        onClose();
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error executing decision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setResultSeal(null);
    onClose();
    onSuccess?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resultSeal ? handleFinish : onClose}
      title="Revenue Officer Verification Action"
      subtitle={`Application for Khasra ${khasraNo} • ${citizenName}`}
      maxWidth="lg"
    >
      {resultSeal ? (
        <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <Stamp size={32} />
          </div>

          <div>
            <h4 className="text-lg font-extrabold text-slate-900">
              Digital Land Title Approved & Sealed
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Cryptographic seal has been affixed to the Record of Rights and dispatched to DigiLocker.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left font-mono text-xs">
            <div className="flex justify-between text-slate-400 text-[10px] mb-1">
              <span>DIGITAL SEAL HASH</span>
              <span>SHA-256</span>
            </div>
            <p className="text-emerald-800 break-all font-semibold">
              {resultSeal}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
            >
              Return to Verification Queue
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Decision Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Decision
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setDecision('APPROVE');
                  setRemarks('Verified against Revenue Court orders and cadastral GIS layers. Approved for final title issuance.');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-bold ${
                  decision === 'APPROVE'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 size={20} className={decision === 'APPROVE' ? 'text-emerald-600' : 'text-slate-400'} />
                <span>Approve & Seal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDecision('REQUEST_CORRECTION');
                  setRemarks('Cadastral area boundary variance (+13.5%) detected. Citizen requested to submit physical demarcation spot measurement by Circle Kanungo.');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-bold ${
                  decision === 'REQUEST_CORRECTION'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle size={20} className={decision === 'REQUEST_CORRECTION' ? 'text-amber-600' : 'text-slate-400'} />
                <span>Request Rectification</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDecision('REJECT');
                  setRemarks('Rejected under Section 157-A of Revenue Code: Encroachment on Gram Sabha public waterbody/pasture reservation.');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-bold ${
                  decision === 'REJECT'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle size={20} className={decision === 'REJECT' ? 'text-rose-600' : 'text-slate-400'} />
                <span>Reject Title</span>
              </button>
            </div>
          </div>

          {/* Officer Remarks Text Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Statutory Officer Remarks & Directions *
            </label>
            <textarea
              rows={4}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official reasoning, conditions precedent, or specific corrections required..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              These remarks will be permanently recorded in the immutable audit log and transmitted via SMS to the landholder.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !remarks.trim()}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition disabled:opacity-50 ${
                decision === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' :
                decision === 'REQUEST_CORRECTION' ? 'bg-amber-600 hover:bg-amber-700' :
                'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm {decision.replace('_', ' ')}</span>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
