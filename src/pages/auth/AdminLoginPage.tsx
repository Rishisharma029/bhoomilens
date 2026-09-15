import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Lock, ArrowRight, Loader2, Key } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, loginAsPreset } = useAuth();

  const [empId, setEmpId] = useState('UK-REV-501');
  const [pin, setPin] = useState('9988');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(empId, pin);
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Revenue Administration Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Official Intranet Gateway for SDM, Tehsildar & Kanungo Titling
          </p>
        </div>

        {/* Quick fill presets */}
        <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">
            Quick Fill Demo Officers:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                await loginAsPreset('admin_1');
                navigate('/admin/dashboard');
              }}
              className="p-2 rounded-lg bg-white border border-slate-200 text-left hover:border-purple-500 transition"
            >
              <p className="text-xs font-bold text-slate-900">Rajeshwar Negi</p>
              <p className="text-[10px] text-slate-500">SDM Dehradun</p>
            </button>

            <button
              type="button"
              onClick={async () => {
                await loginAsPreset('admin_2');
                navigate('/admin/dashboard');
              }}
              className="p-2 rounded-lg bg-white border border-slate-200 text-left hover:border-purple-500 transition"
            >
              <p className="text-xs font-bold text-slate-900">Vikram Rawat</p>
              <p className="text-[10px] text-slate-500">Kanungo Haridwar</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Employee ID / HRMS *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserCheck size={16} />
              </div>
              <input
                type="text"
                required
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="UK-REV-501"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Department Security PIN *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key size={16} />
              </div>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs tracking-widest font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Authenticating Officer...</span>
              </>
            ) : (
              <>
                <span>Sign in to Verification Suite</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            to="/auth/citizen/login"
            className="text-xs text-slate-500 hover:text-emerald-700 font-semibold"
          >
            Are you a Citizen / Landholder? Go to Citizen Login →
          </Link>
        </div>
      </div>
    </div>
  );
};
