import React from 'react';
import { Settings, Shield, Key, Bell, Database, Globe } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold mb-1">
          <Settings size={12} />
          <span>System Configuration</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Administrative &amp; GIS Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure BhuNaksha sync thresholds, digital certificate expiry, and OCR confidence triggers.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            AI Triage &amp; Cadastral Thresholds
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-800">Automatic Approval Confidence Threshold</p>
              <p className="text-[11px] text-slate-500">Deeds exceeding this score with 0 GIS collisions are routed for fast-track seal.</p>
            </div>
            <span className="font-mono font-bold text-emerald-800 bg-white px-3 py-1 rounded-lg border border-slate-300">
              95%
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-800">Cadastral Boundary Variance Tolerance</p>
              <p className="text-[11px] text-slate-500">Maximum permissible margin before triggering automatic conflict alert.</p>
            </div>
            <span className="font-mono font-bold text-purple-800 bg-white px-3 py-1 rounded-lg border border-slate-300">
              &plusmn; 2.0%
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Digital Sealing &amp; Blockchain Ledger
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-800">SHA-256 State Seal Hash Authority</p>
              <p className="text-[11px] text-slate-500">NIC Public Key Infrastructure (PKI) Smart Card Active</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
