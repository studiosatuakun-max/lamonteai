import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import CandidateReviewContent from './components/CandidateReviewContent';

export default function CandidateReviewPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Job Vacancies', href: '/jobs' },
        { label: 'Senior Fashion Designer', href: '/' },
        { label: 'Candidates', href: '/' },
        { label: 'Candidate Review' },
      ]}
      vacancyTitle="Candidate Review — Senior Fashion Designer"
    >
      <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading...</div>}>
        <CandidateReviewContent />
      </Suspense>
    </AppLayout>
  );
}