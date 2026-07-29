'use client';

import React from 'react';
import { Candidate, CandidateStatus } from '@/types/recruitment';
import { CheckCircle2, XCircle, PauseCircle, Loader2, MessageSquare } from 'lucide-react';

interface ReviewActionBarProps {
  candidate: Candidate;
  currentStatus: CandidateStatus;
  hrNotes: string;
  onHrNotesChange: (v: string) => void;
  onDecision: (decision: 'Shortlisted' | 'Rejected' | 'Hold') => void;
  isSaving: boolean;
}

export default function ReviewActionBar({
  candidate,
  currentStatus,
  hrNotes,
  onHrNotesChange,
  onDecision,
  isSaving,
}: ReviewActionBarProps) {
  return (
    <div className="border-t border-border bg-card px-5 py-4 flex-shrink-0 space-y-3 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
      {/* HR Notes */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-600 text-muted-foreground mb-1.5">
          <MessageSquare size={12} />
          HR Notes (Optional)
        </label>
        <textarea
          value={hrNotes}
          onChange={(e) => onHrNotesChange(e.target.value)}
          placeholder={`Add your assessment of ${candidate.name.split(' ')[0]}...`}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
        />
      </div>

      {/* Decision buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecision('Shortlisted')}
          disabled={isSaving || currentStatus === 'Shortlisted'}
          className={`btn-shortlist flex-1 justify-center text-sm py-2.5 ${
            currentStatus === 'Shortlisted' ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isSaving && currentStatus !== 'Shortlisted' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <CheckCircle2 size={14} />
          )}
          {currentStatus === 'Shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
        </button>

        <button
          onClick={() => onDecision('Hold')}
          disabled={isSaving || currentStatus === 'Hold'}
          className={`btn-hold flex-1 justify-center text-sm py-2.5 ${
            currentStatus === 'Hold' ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isSaving && currentStatus !== 'Hold' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <PauseCircle size={14} />
          )}
          {currentStatus === 'Hold' ? 'On Hold ✓' : 'Hold'}
        </button>

        <button
          onClick={() => onDecision('Rejected')}
          disabled={isSaving || currentStatus === 'Rejected'}
          className={`btn-reject flex-1 justify-center text-sm py-2.5 ${
            currentStatus === 'Rejected' ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isSaving && currentStatus !== 'Rejected' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <XCircle size={14} />
          )}
          {currentStatus === 'Rejected' ? 'Rejected ✓' : 'Reject'}
        </button>
      </div>

      {currentStatus !== 'Pending' && (
        <p className="text-center text-xs text-muted-foreground">
          Decision recorded · You can change it at any time
        </p>
      )}
    </div>
  );
}