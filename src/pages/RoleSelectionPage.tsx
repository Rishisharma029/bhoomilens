import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LandPlot, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Briefcase,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsPreset } = useAuth();

  const handleQuickDemoCitizen = async () => {
    await loginAsPreset('citizen_1');
    navigate('/citizen/dashboard');
  };

  const handleQuickDemoAdmin = async () => {
    await loginAsPreset('admin_1');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Uttarakhand Land Governance Identity Gateway</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Select Your Portal Role
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Choose your persona to access specialized land services, AI deed extraction, or administrative verification queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Citizen Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm hover:border-emerald-600 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-emerald-200">
                <LandPlot size={30} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-900">Citizen Landholder</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Public
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Access your registered land parcels, upload deeds for AI optical character extraction, raise 
                boundary correction requests, and inspect mutation status timelines.
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-6 text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400">
                  Demo Citizen Persona:
                </p>
                <p className="font-semibold text-slate-800">Ramesh Chandra Joshi</p>
                <p className="text-[11px] text-slate-500">Khasra 142/2 Kha & 88/1 Ga • Haridwar Circle</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleQuickDemoCitizen}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition"
              >
                <span>Demo 1-Click Citizen Login</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => navigate('/auth/citizen/login')}
                className="w-full text-center py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Citizen Mobile OTP Login →
              </button>
            </div>
          </div>

          {/* Admin Officer Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm hover:border-purple-600 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-purple-200">
                <ShieldCheck size={30} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-900">Revenue Administration</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Official
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Access statutory verification queues, run AI discrepancy checks, inspect cadastral GIS polygon 
                overlaps, authenticate state seals, and issue digitally signed title decisions.
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-6 text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-slate-400">
                  Demo Officer Persona:
                </p>
                <p className="font-semibold text-slate-800">Rajeshwar Singh Negi</p>
                <p className="text-[11px] text-slate-500">Sub-Divisional Magistrate (SDM) • Dehradun Division</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleQuickDemoAdmin}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition"
              >
                <span>Demo 1-Click Officer Login</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => navigate('/auth/admin/login')}
                className="w-full text-center py-2 text-xs font-semibold text-purple-700 hover:text-purple-800 hover:underline"
              >
                Official ID & Security PIN Login →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
