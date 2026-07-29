import React from 'react';
import { CandidateStatus } from '@/types/recruitment';

interface StatusBadgeProps {
  status: CandidateStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  CandidateStatus,
  { label: string; className: string }
> = {
  Pending: {
    label: 'Pending',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  },
  Shortlisted: {
    label: 'Shortlisted',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 border border-red-200',
  },
  Hold: {
    label: 'Hold',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full font-500 ${config.className} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
          status === 'Pending' ?'bg-slate-400'
            : status === 'Shortlisted' ?'bg-green-500'
            : status === 'Rejected' ?'bg-red-500' :'bg-amber-500'
        }`}
      />
      {config.label}
    </span>
  );
}