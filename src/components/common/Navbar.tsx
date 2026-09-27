import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  User as UserIcon, 
  LogOut, 
  ArrowRightLeft, 
  Bell, 
  FileText, 
  LandPlot,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleRoleSwitch = async (newRole: 'CITIZEN' | 'ADMIN') => {
    setRoleMenuOpen(false);
    await switchRole(newRole);
    if (newRole === 'CITIZEN') {
      navigate('/citizen/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAuthPage = location.pathname.startsWith('/auth') || location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top tricolor ribbon accent */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-white to-emerald-600"></div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Emblem */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform">
              <LandPlot size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">BhoomiLens</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase tracking-wider border border-emerald-200">
                  Gov-Tech AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Intelligent Land Record Digitalization &amp; Validation
              </p>
            </div>
          </Link>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="relative">
                {/* Role Switcher Pill */}
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    role === 'ADMIN'
                      ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title="Switch between Citizen and Officer View"
                >
                  <ArrowRightLeft size={13} className="shrink-0" />
                  <span>
                    Role: <strong className="font-bold">{role === 'ADMIN' ? 'Revenue Officer (SDM)' : 'Citizen Landholder'}</strong>
                  </span>
                  <ChevronDown size={13} />
                </button>

                {/* Role Switcher Dropdown */}
                {roleMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setRoleMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Switch Active Persona
                      </p>
                    </div>

                    <button
                      onClick={() => handleRoleSwitch('CITIZEN')}
                      className={`w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition ${
                        role === 'CITIZEN' ? 'bg-emerald-50/70' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-slate-900">Citizen Portal</p>
                          {role === 'CITIZEN' && <CheckCircle2 size={13} className="text-emerald-600" />}
                        </div>
                        <p className="text-xs text-slate-500">Ramesh Chandra Joshi (Landholder)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleSwitch('ADMIN')}
                      className={`w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition ${
                        role === 'ADMIN' ? 'bg-purple-50/70' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Shield size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-slate-900">Admin / Revenue Officer</p>
                          {role === 'ADMIN' && <CheckCircle2 size={13} className="text-purple-600" />}
                        </div>
                        <p className="text-xs text-slate-500">Rajeshwar Negi (SDM Dehradun)</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* If not logged in, show Portal links */}
            {!user && (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/select-role"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 transition shadow-sm"
                >
                  <span>Portal Login</span>
                </Link>
              </div>
            )}

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {user.designation || user.phone}
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-slate-500" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                      <p className="text-[10px] text-emerald-700 font-medium mt-1">
                        Jurisdiction: {user.jurisdiction}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={role === 'CITIZEN' ? '/citizen/dashboard' : '/admin/dashboard'}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LandPlot size={15} />
                        <span>Go to Dashboard</span>
                      </Link>

                      {role === 'CITIZEN' ? (
                        <Link
                          to="/citizen/records"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FileText size={15} />
                          <span>My Land Records</span>
                        </Link>
                      ) : (
                        <Link
                          to="/admin/queue"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FileText size={15} />
                          <span>Verification Queue</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
