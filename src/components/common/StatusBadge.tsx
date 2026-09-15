import React from 'react';
import { RecordStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, HelpCircle, XCircle, ShieldAlert, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: RecordStatus | 'SUBMITTED' | 'PASS' | 'WARNING' | 'FAIL';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  switch (status) {
    case 'VERIFIED':
    case 'PASS':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-xs ${sizeClasses}`}>
          {showIcon && <CheckCircle2 size={iconSizes} className="text-emerald-600 shrink-0" />}
          <span>{status === 'PASS' ? 'Passed' : '✓ Verified'}</span>
        </span>
      );

    case 'UNDER_REVIEW':
    case 'SUBMITTED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/90 shadow-xs ${sizeClasses}`}>
          {showIcon && <Clock size={iconSizes} className="text-blue-600 shrink-0" />}
          <span>Under Review</span>
        </span>
      );

    case 'ACTION_REQUIRED':
    case 'CORRECTION_REQUESTED':
    case 'WARNING':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 shadow-xs ${sizeClasses}`}>
          {showIcon && <AlertTriangle size={iconSizes} className="text-amber-600 shrink-0" />}
          <span>Action Required</span>
        </span>
      );

    case 'CONFLICT':
    case 'FLAGGED_DISCREPANCY':
    case 'FAIL':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300 shadow-xs ${sizeClasses}`}>
          {showIcon && <ShieldAlert size={iconSizes} className="text-rose-600 shrink-0" />}
          <span>Conflict</span>
        </span>
      );

    case 'PENDING_AI':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 shadow-xs ${sizeClasses}`}>
          {showIcon && <Clock size={iconSizes} className="text-slate-500 shrink-0 animate-pulse" />}
          <span>Pending AI</span>
        </span>
      );

    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 shadow-xs ${sizeClasses}`}>
          {showIcon && <XCircle size={iconSizes} className="text-red-600 shrink-0" />}
          <span>Rejected</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-xs ${sizeClasses}`}>
          {showIcon && <HelpCircle size={iconSizes} className="shrink-0" />}
          <span>{status}</span>
        </span>
      );
  }
};
