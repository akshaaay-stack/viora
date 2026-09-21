import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'availability' | 'urgency' | 'wave' | 'privacy';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'availability' }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';

  if (status.toLowerCase() === 'available') {
    color = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (status.toLowerCase() === 'urgent' || status.toLowerCase() === 'critical') {
    color = 'bg-red-50 text-red-800 border-red-200';
  } else if (status.toLowerCase() === 'locked') {
    color = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (status.toLowerCase() === 'unlocked' || status.toLowerCase() === 'accepted') {
    color = 'bg-emerald-600 text-white border-emerald-600';
  }

  return (
    <span className={inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider }>
      <span>{status}</span>
    </span>
  );
};
