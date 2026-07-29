'use client';

import React from 'react';
import { Candidate, CandidateStatus } from '@/types/recruitment';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Bot,
  Info,
} from 'lucide-react';

interface AIAnalysisPanelProps {
  candidate: Candidate;
  currentStatus: CandidateStatus;
}

const SCORE_RING_CONFIG = {
  High: { color: '#16A34A', bg: 'bg-green-50', text: 'text-green-700', label: 'High Match' },
  Medium: { color: '#D97706', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Moderate Match' },
  Low: { color: '#DC2626', bg: 'bg-red-50', text: 'text-red-700', label: 'Low Match' },
};

export default function AIAnalysisPanel({ candidate, currentStatus }: AIAnalysisPanelProps) {
  const ring = SCORE_RING_CONFIG[candidate.scoreCategory];
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (candidate.score / 100) * circumference;

  return (
    <div className="px-5 py-5 space-y-5 pb-4">
      {/* Candidate header */}
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-lg flex-shrink-0">
          {candidate.name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-700 text-foreground">{candidate.name}</h2>
            <StatusBadge status={currentStatus} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{candidate.role}</p>
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail size={11} />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone size={11} />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={11} />
              <span>{candidate.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick info pills */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-500 text-muted-foreground">
          <Briefcase size={11} />
          {candidate.experience} experience
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-500 text-muted-foreground">
          <GraduationCap size={11} />
          {candidate.education.split(',')[0]}
        </div>
      </div>

      <hr className="border-border" />

      {/* AI Recommendation Box */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border-b border-border">
          <Bot size={15} className="text-primary flex-shrink-0" />
          <span className="text-xs font-700 uppercase tracking-wider text-primary">
            System Recommendation
          </span>
          <div className="ml-auto relative group">
            <Info size={13} className="text-muted-foreground cursor-help" />
            <div className="pointer-events-none absolute right-0 top-5 z-10 w-52 rounded-lg bg-foreground px-3 py-2 text-xs text-primary-foreground shadow-elevated opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              AI score is based on job requirement matching. Final decision remains with the HR reviewer.
            </div>
          </div>
        </div>

        {/* Score section */}
        <div className="px-4 py-4 flex items-center gap-5">
          {/* SVG Score Ring */}
          <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 88, height: 88 }}>
            <svg width="88" height="88" className="-rotate-90">
              <circle
                cx="44" cy="44" r="36"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="7"
              />
              <circle
                cx="44" cy="44" r="36"
                fill="none"
                stroke={ring.color}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-700 text-foreground font-tabular leading-none">
                {candidate.score}
              </span>
              <span className="text-[10px] text-muted-foreground font-500">/ 100</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-700 ${ring.bg} ${ring.text}`}>
              {ring.label}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI confidence based on {candidate.matchPoints.length + candidate.gapPoints.length} evaluated criteria
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-green-600 font-600">{candidate.matchPoints.length} matched</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-red-500 font-600">{candidate.gapPoints.length} gaps</span>
              {candidate.flags.length > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-amber-600 font-600">{candidate.flags.length} flag{candidate.flags.length > 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Match Points */}
        <div className="px-4 pb-3 border-t border-border pt-3">
          <p className="text-xs font-700 uppercase tracking-wider text-green-700 mb-2.5">
            ✓ Match Points
          </p>
          <ul className="space-y-2">
            {candidate.matchPoints.map((point, i) => (
              <li key={`match-${candidate.id}-${i}`} className="flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Gap Points */}
        {candidate.gapPoints.length > 0 && (
          <div className="px-4 pb-3 border-t border-border pt-3">
            <p className="text-xs font-700 uppercase tracking-wider text-red-600 mb-2.5">
              ✗ Gap Points
            </p>
            <ul className="space-y-2">
              {candidate.gapPoints.map((point, i) => (
                <li key={`gap-${candidate.id}-${i}`} className="flex items-start gap-2.5">
                  <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Flags */}
        {candidate.flags.length > 0 && (
          <div className="px-4 pb-4 border-t border-amber-100 pt-3 bg-amber-50/50">
            <div className="flex items-center gap-1.5 mb-2.5">
              <AlertTriangle size={13} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs font-700 uppercase tracking-wider text-amber-700">
                Flags for Review
              </p>
            </div>
            <ul className="space-y-2">
              {candidate.flags.map((flag, i) => (
                <li key={`flag-${candidate.id}-${i}`} className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <span className="text-sm text-amber-800 leading-snug">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {candidate.flags.length === 0 && (
          <div className="px-4 pb-4 border-t border-border pt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 size={13} className="text-green-500" />
              No anomalies or flags detected for this candidate.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}