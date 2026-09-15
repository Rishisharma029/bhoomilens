import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecords } from '../../context/RecordsContext';
import { 
  LayoutDashboard, 
  LandPlot, 
  UploadCloud, 
  FileCheck, 
  FileEdit, 
  History, 
  Inbox, 
  ShieldCheck, 
  FileSearch, 
  FileSpreadsheet,
  AlertCircle,
  AlertOctagon,
  FolderArchive,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ShieldAlert,
  Files
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, logout } = useAuth();
  const { submissions, records } = useRecords();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const citizenNavItems = [
    {
      label: 'Dashboard',
      to: '/citizen/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'My Land Records',
      to: '/citizen/records',
      icon: LandPlot,
      badge: records.length.toString(),
    },
    {
      label: 'Upload Document',
      to: '/citizen/upload',
      icon: UploadCloud,
    },
    {
      label: 'Review Extracted Data',
      to: '/citizen/review-extracted/doc_sub_10294',
      icon: FileCheck,
      badge: 'Active',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      label: 'Correction Request',
      to: '/citizen/correction-request/doc_sub_102',
      icon: FileEdit,
    },
    {
      label: 'Document History',
      to: '/citizen/history',
      icon: History,
    },
  ];

  // Exact Admin Sidebar requested by user:
  // Dashboard, Verification Queue, All Land Records, Conflict Center, Correction Requests,
  // Document Repository, Analytics, Audit Logs, Users & Roles, Settings, Logout
  const adminNavItems = [
    {
      label: 'Dashboard',
      to: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Verification Queue',
      to: '/admin/queue',
      icon: Inbox,
      badge: '1,243',
      badgeColor: 'bg-purple-100 text-purple-800 font-bold'
    },
    {
      label: 'All Land Records',
      to: '/admin/records',
      icon: LandPlot,
      badge: '24,581',
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      label: 'Conflict Center',
      to: '/admin/conflicts',
      icon: ShieldAlert,
      badge: '287',
      badgeColor: 'bg-rose-100 text-rose-800 font-bold animate-pulse'
    },
    {
      label: 'Correction Requests',
      to: '/admin/corrections',
      icon: FileEdit,
      badge: '164',
      badgeColor: 'bg-amber-100 text-amber-800 font-bold'
    },
    {
      label: 'Document Repository',
      to: '/admin/documents',
      icon: Files,
      badge: '21.9k',
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      label: 'Analytics',
      to: '/admin/analytics',
      icon: BarChart3,
    },
    {
      label: 'Audit Logs',
      to: '/admin/audit-history',
      icon: FileSpreadsheet,
    },
    {
      label: 'Users & Roles',
      to: '/admin/users',
      icon: Users,
    },
    {
      label: 'Settings',
      to: '/admin/settings',
      icon: Settings,
    },
  ];

  const navItems = role === 'ADMIN' ? adminNavItems : citizenNavItems;

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-65px)] flex flex-col justify-between p-3.5 text-slate-300">
      <div className="space-y-4">
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              {role === 'ADMIN' ? 'Revenue Command Center' : 'Citizen Land Services'}
            </span>
            {role === 'ADMIN' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" title="Live Sync Active"></span>
            )}
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? role === 'ADMIN'
                          ? 'bg-purple-600 text-white shadow-md font-bold'
                          : 'bg-emerald-800 text-white shadow-md font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold shrink-0 ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Informational badge for admin */}
        {role === 'ADMIN' ? (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 text-xs">
            <div className="flex items-start gap-2">
              <ShieldCheck size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-200 text-[11px]">BhuNaksha GIS Active</p>
                <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">
                  Dehradun Circle #4 • Auto Cadastral Cross-Verification Engine Online
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-200 text-[11px]">Digital Land Vault</p>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                  All land title records are digitally sealed &amp; verified via GRAS &amp; DigiLocker.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer support snippet + Logout button */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

        <div className="px-3 text-[10px] text-slate-500 flex justify-between items-center">
          <span>BhoomiLens v2.4</span>
          <span className="font-mono">NIC-UK</span>
        </div>
      </div>
    </aside>
  );
};
