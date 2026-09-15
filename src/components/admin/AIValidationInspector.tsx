import React from 'react';
import { AIValidationReport } from '../../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Sparkles,
  Fingerprint
} from 'lucide-react';

interface AIValidationInspectorProps {
  report: AIValidationReport;
  onOpenDecisionModal?: () => void;
}

export const AIValidationInspector: React.FC<AIValidationInspectorProps> = ({
  report,
  onOpenDecisionModal,
}) => {
  const getRiskColor = (level: AIValidationReport['riskLevel']) => {
    switch (level) {
      case 'LOW':
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          scoreText: 'text-emerald-700',
          ring: 'ring-emerald-500/20 bg-emerald-50',
          icon: ShieldCheck,
          label: 'Low Fraud Risk — Recommended for Fast-Track Seal'
        };
      case 'MEDIUM':
        return {
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          scoreText: 'text-amber-700',
          ring: 'ring-amber-500/20 bg-amber-50',
          icon: AlertTriangle,
          label: 'Medium Risk — Cadastral Boundary Discrepancy Detected'
        };
      case 'HIGH':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          scoreText: 'text-rose-700',
          ring: 'ring-rose-500/20 bg-rose-50',
          icon: ShieldAlert,
          label: 'High Risk / Potential Tampering Detected'
        };
    }
  };

  const riskMeta = getRiskColor(report.riskLevel);
  const RiskIcon = riskMeta.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-linear-to-bl from-purple-500/20 to-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight">AI Validation & Fraud Shield</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  Engine v4.2
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated multi-vector inspection: Cadastral GIS, OCR text fidelity, stamp forensics & encumbrance
              </p>
            </div>
          </div>

          {onOpenDecisionModal && (
            <button
              onClick={onOpenDecisionModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition hover:scale-[1.02]"
            >
              <span>Execute Officer Decision</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score & Risk Overview */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Circular Score display */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-4 ${
              report.riskLevel === 'LOW' ? 'border-emerald-500 text-emerald-700' :
              report.riskLevel === 'MEDIUM' ? 'border-amber-500 text-amber-700' : 'border-rose-500 text-rose-700'
            }`}>
              <span className="text-xl font-extrabold leading-none">{report.overallConfidenceScore}%</span>
              <span className="text-[9px] font-bold uppercase text-slate-400">Score</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Integrity Index</p>
              <p className="text-sm font-bold text-slate-900">
                {report.overallConfidenceScore >= 90 ? 'Authentic' : report.overallConfidenceScore >= 70 ? 'Needs Inspection' : 'Discrepancy'}
              </p>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Risk Classification
              </span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${riskMeta.badge}`}>
                {report.riskLevel} RISK
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-2">
              <RiskIcon size={18} className={riskMeta.scoreText} />
              <p className="text-xs font-semibold text-slate-800">
                {riskMeta.label}
              </p>
            </div>
          </div>
        </div>

        {/* Anomalies Box if present */}
        {report.anomaliesDetected.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs">
            <h5 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={15} className="text-amber-700" />
              Detected Anomalies Requiring Manual Review ({report.anomaliesDetected.length})
            </h5>
            <ul className="list-disc ml-5 space-y-1 text-amber-800 text-[11px]">
              {report.anomaliesDetected.map((ano, idx) => (
                <li key={idx} className="leading-relaxed">{ano}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Check Items */}
      <div className="p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Automated Verification Vectors
        </h4>

        <div className="space-y-3">
          {report.checks.map((chk) => {
            return (
              <div 
                key={chk.id}
                className={`p-4 rounded-xl border transition-all ${
                  chk.status === 'PASS' 
                    ? 'border-slate-200 bg-white hover:border-emerald-300' 
                    : chk.status === 'WARNING'
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-rose-200 bg-rose-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {chk.status === 'PASS' && (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      )}
                      {chk.status === 'WARNING' && (
                        <AlertTriangle size={18} className="text-amber-600" />
                      )}
                      {chk.status === 'FAIL' && (
                        <XCircle size={18} className="text-rose-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{chk.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                          Confidence: {Math.round(chk.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {chk.description}
                      </p>
                      {chk.detectedDiscrepancy && (
                        <p className="text-[11px] font-semibold text-rose-700 mt-1.5 flex items-center gap-1">
                          <Layers size={12} />
                          Discrepancy: {chk.detectedDiscrepancy}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    chk.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                    chk.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {chk.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cadastral GIS polygon integration notice */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <Fingerprint size={18} className="text-slate-500" />
            <span>
              SHA-256 Digital Fingerprint: <code className="text-slate-800 font-mono">0x44fa77199bc01923881ca10294877bc</code>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">NIC GIS Cloud</span>
        </div>
      </div>
    </div>
  );
};
