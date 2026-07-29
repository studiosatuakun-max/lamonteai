'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CANDIDATES } from '@/data/candidates';
import { CandidateStatus } from '@/types/recruitment';
import AIAnalysisPanel from './AIAnalysisPanel';
import CVDocumentViewer from './CVDocumentViewer';
import ReviewActionBar from './ReviewActionBar';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export default function CandidateReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get('id');
  const candidateId = idParam ? parseInt(idParam, 10) : CANDIDATES[0].id;

  const candidateIndex = CANDIDATES.findIndex((c) => c.id === candidateId);
  const candidate = CANDIDATES[candidateIndex] ?? CANDIDATES[0];

  // Backend integration point: replace with API call to PATCH /api/applications/:id/status
  const [currentStatus, setCurrentStatus] = useState<CandidateStatus>(candidate.status);
  const [hrNotes, setHrNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState<'shortlisted' | 'rejected' | 'hold' | null>(null);

  const prevCandidate = candidateIndex > 0 ? CANDIDATES[candidateIndex - 1] : null;
  const nextCandidate = candidateIndex < CANDIDATES.length - 1 ? CANDIDATES[candidateIndex + 1] : null;

  const handleDecision = async (decision: 'Shortlisted' | 'Rejected' | 'Hold') => {
    setIsSaving(true);
    // Simulate async save — backend integration point
    await new Promise((r) => setTimeout(r, 900));
    setCurrentStatus(decision);
    setSavedFeedback(
      decision === 'Shortlisted' ? 'shortlisted' : decision === 'Rejected' ? 'rejected' : 'hold'
    );
    setIsSaving(false);
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Navigation bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card flex-shrink-0">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Candidates
        </button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-tabular">
            {candidateIndex + 1} of {CANDIDATES.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                prevCandidate &&
                router.push(`/candidate-review?id=${prevCandidate.id}`)
              }
              disabled={!prevCandidate}
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() =>
                nextCandidate &&
                router.push(`/candidate-review?id=${nextCandidate.id}`)
              }
              disabled={!nextCandidate}
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Save feedback toast */}
      {savedFeedback && (
        <div
          className={`mx-6 mt-3 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-500 border flex-shrink-0 transition-all duration-300 ${
            savedFeedback === 'shortlisted' ?'bg-green-50 border-green-200 text-green-700'
              : savedFeedback === 'rejected' ?'bg-red-50 border-red-200 text-red-700' :'bg-amber-50 border-amber-200 text-amber-700'
          }`}
        >
          <span className={`h-2 w-2 rounded-full flex-shrink-0 ${
            savedFeedback === 'shortlisted' ? 'bg-green-500' : savedFeedback === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
          }`} />
          {savedFeedback === 'shortlisted'
            ? `${candidate.name} has been shortlisted.`
            : savedFeedback === 'rejected'
            ? `${candidate.name} has been rejected.`
            : `${candidate.name} has been placed on hold.`}
        </div>
      )}

      {/* Split panel */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left panel — AI Analysis (40%) */}
        <div className="w-[40%] min-w-[320px] border-r border-border flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto panel-scroll">
            <AIAnalysisPanel candidate={candidate} currentStatus={currentStatus} />
          </div>
          {/* Sticky action bar */}
          <ReviewActionBar
            candidate={candidate}
            currentStatus={currentStatus}
            hrNotes={hrNotes}
            onHrNotesChange={setHrNotes}
            onDecision={handleDecision}
            isSaving={isSaving}
          />
        </div>

        {/* Right panel — CV Document Viewer (60%) */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <CVDocumentViewer candidate={candidate} />
        </div>
      </div>
    </div>
  );
}