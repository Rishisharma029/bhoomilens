import React from 'react';
import { Users, Shield, UserCheck, Key, Plus } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const officers = [
    { id: '1', name: 'Rajeshwar Singh Negi', role: 'Sub-Divisional Magistrate (SDM)', circle: 'Dehradun Division', activeCases: 42 },
    { id: '2', name: 'Vikram Singh Rawat', role: 'Senior Revenue Inspector / Kanungo', circle: 'Haridwar Circle', activeCases: 78 },
    { id: '3', name: 'Alok Bhatt', role: 'Tehsildar', circle: 'Roorkee Tehsil', activeCases: 51 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold mb-1">
            <Users size={12} />
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Revenue Officers &amp; Staff
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage administrative hierarchy, statutory jurisdiction assignments, and digital seal authorities.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-4 px-4">Officer</th>
              <th className="py-4 px-4">Designation</th>
              <th className="py-4 px-4">Jurisdiction</th>
              <th className="py-4 px-4">Active Docket Cases</th>
              <th className="py-4 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {officers.map(o => (
              <tr key={o.id}>
                <td className="py-4 px-4 font-bold text-slate-900">{o.name}</td>
                <td className="py-4 px-4 text-purple-900 font-semibold">{o.role}</td>
                <td className="py-4 px-4 text-slate-600">{o.circle}</td>
                <td className="py-4 px-4 font-mono font-bold text-slate-800">{o.activeCases}</td>
                <td className="py-4 px-4 text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active &amp; Authorized
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
