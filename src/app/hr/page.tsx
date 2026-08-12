import React from 'react';
import AppLayout from '@/components/AppLayout';
import CandidateListContent from '../components/CandidateListContent';

export default function CandidateListPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Job Vacancies', href: '/jobs' },
        { label: 'Senior Fashion Designer', href: '/' },
        { label: 'Candidates' },
      ]}
      vacancyTitle="Senior Fashion Designer — Candidate Applications"
    >
      <CandidateListContent />
    </AppLayout>
  );
}