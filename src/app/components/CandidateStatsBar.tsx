'use client';

import React from 'react';
import { CandidateStatus } from '@/types/recruitment';
import { Users, CheckCircle2, XCircle, Clock, PauseCircle, TrendingUp } from 'lucide-react';

interface CandidateStatsBarProps {
  statuses: CandidateStatus[];
  totalCandidates: number;
}

export default function CandidateStatsBar({
  statuses,
  totalCandidates,
}: CandidateStatsBarProps) {
  const counts = {
    Pending: statuses.filter((s) => s === 'Pending').length,
    Shortlisted: statuses.filter((s) => s === 'Shortlisted').length,
    Hold: statuses.filter((s) => s === 'Hold').length,
    Rejected: statuses.filter((s) => s === 'Rejected').length,
  };

  const reviewed = totalCandidates - counts.Pending;
  const reviewedPct = totalCandidates > 0 ? Math.round((reviewed / totalCandidates) * 100) : 0;

  const stats = [
    {
      key: 'stat-total',
      label: 'Total Applicants',
      value: totalCandidates,
      icon: <Users size={16} />,
      iconClass: 'text-primary bg-primary/10',
      valueClass: 'text-foreground',
    },
    {
      key: 'stat-pending',
      label: 'Pending Review',
      value: counts.Pending,
      icon: <Clock size={16} />,
      iconClass: 'text-slate-500 bg-slate-100',
      valueClass: 'text-foreground',
    },
    {
      key: 'stat-shortlisted',
      label: 'Shortlisted',
      value: counts.Shortlisted,
      icon: <CheckCircle2 size={16} />,
      iconClass: 'text-green-600 bg-green-50',
      valueClass: 'text-green-700',
    },
    {
      key: 'stat-hold',
      label: 'On Hold',
      value: counts.Hold,
      icon: <PauseCircle size={16} />,
      iconClass: 'text-amber-600 bg-amber-50',
      valueClass: 'text-amber-700',
    },
    {
      key: 'stat-rejected',
      label: 'Rejected',
      value: counts.Rejected,
      icon: <XCircle size={16} />,
      iconClass: 'text-red-500 bg-red-50',
      valueClass: 'text-red-600',
    },
    {
      key: 'stat-reviewed',
      label: 'Review Progress',
      value: `${reviewedPct}%`,
      icon: <TrendingUp size={16} />,
      iconClass: 'text-primary bg-primary/10',
      valueClass: 'text-primary',
      isProgress: true,
      progressValue: reviewedPct,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="bg-card border border-border rounded-xl shadow-card px-4 py-3.5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-500 text-muted-foreground leading-tight">
              {stat.label}
            </span>
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.iconClass}`}>
              {stat.icon}
            </span>
          </div>
          <div>
            <span className={`text-2xl font-700 font-tabular ${stat.valueClass}`}>
              {stat.value}
            </span>
            {'isProgress' in stat && stat.isProgress && (
              <div className="mt-1.5 score-bar-track">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${stat.progressValue}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}