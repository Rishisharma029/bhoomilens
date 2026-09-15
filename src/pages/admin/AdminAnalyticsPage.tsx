import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, ShieldCheck, Layers, Cpu } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold mb-1">
          <BarChart3 size={12} />
          <span>Operational Intelligence</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Executive Analytics &amp; Throughput
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time verification speed, GIS cross-match accuracy, and automated decision rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Resolution Time</span>
          <p className="text-3xl font-black text-purple-900">1.8 Hours</p>
          <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp size={14} /> 94% faster than manual physical paper filing
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Automated AI Triage Rate</span>
          <p className="text-3xl font-black text-emerald-800">88.4%</p>
          <p className="text-xs text-slate-500 font-medium">Auto-approved clean cadastral deeds</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Dispute Reduction</span>
          <p className="text-3xl font-black text-blue-900">76.2%</p>
          <p className="text-xs text-slate-500 font-medium">Reduction in revenue boundary litigations</p>
        </div>
      </div>
    </div>
  );
};
