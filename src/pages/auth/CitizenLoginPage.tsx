import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LandPlot, Smartphone, KeyRound, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export const CitizenLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginCitizen, loginAsPreset } = useAuth();

  const [phone, setPhone] = useState('9897123456');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginCitizen(phone, otp);
      navigate('/citizen/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <LandPlot size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Citizen Landholder Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access Dev Bhoomi land records via Aadhaar-linked Mobile OTP
          </p>
        </div>

        {/* Quick fill presets */}
        <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">
            Quick Fill Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                await loginAsPreset('citizen_1');
                navigate('/citizen/dashboard');
              }}
              className="p-2 rounded-lg bg-white border border-slate-200 text-left hover:border-emerald-500 transition"
            >
              <p className="text-xs font-bold text-slate-900">Ramesh Chandra</p>
              <p className="text-[10px] text-slate-500">Khasra 142 & 88</p>
            </button>

            <button
              type="button"
              onClick={async () => {
                await loginAsPreset('citizen_2');
                navigate('/citizen/dashboard');
              }}
              className="p-2 rounded-lg bg-white border border-slate-200 text-left hover:border-emerald-500 transition"
            >
              <p className="text-xs font-bold text-slate-900">Sunita Chauhan</p>
              <p className="text-[10px] text-slate-500">Khasra 304/4</p>
            </button>
          </div>
        </div>

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number or Aadhaar *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Smartphone size={16} />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                An instant 6-digit OTP will be dispatched to your registered handset.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Generate OTP</span>
              <ArrowRight size={15} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enter 6-Digit OTP *
                </label>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  Change Mobile
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={16} />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-3 py-2.5 text-xs tracking-widest font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
              <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Demo test OTP is set to 123456
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Verify & Enter Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            to="/auth/admin/login"
            className="text-xs text-slate-500 hover:text-purple-700 font-semibold"
          >
            Are you a Revenue Department Official? Sign in here →
          </Link>
        </div>
      </div>
    </div>
  );
};
