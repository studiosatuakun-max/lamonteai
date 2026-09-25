'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import CandidateListContent from '../components/CandidateListContent';
import EmployeeKPIView from '@/components/hr/kpi/EmployeeKPIView';
import { Target, Users, Award, Briefcase } from 'lucide-react';

export default function HRModulePage() {
  const [activeTab, setActiveTab] = useState<'kpi' | 'recruitment'>('kpi');

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'HR Module', href: '/hr' },
        { label: activeTab === 'kpi' ? 'KPI & Kinerja Karyawan' : 'Rekrutmen Kandidat' },
      ]}
      vacancyTitle="Lovise Sofa — Human Resources Management"
    >
      <div className="p-6 md:p-8 space-y-6">
        {/* Module Sub-Header & Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Lovise Sofa ERP
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                HR & Talent Suite
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Human Resources Portal
            </h1>
          </div>

          {/* Segmented Navigation Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('kpi')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'kpi'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target size={15} />
              KPI & Kinerja Karyawan
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800">
                New
              </span>
            </button>

            <button
              onClick={() => setActiveTab('recruitment')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'recruitment'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={15} />
              Rekrutmen & Pelamar
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'kpi' ? (
          <EmployeeKPIView />
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Job Vacancy Active
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Senior Fashion Designer — Candidate Applications
              </h2>
            </div>
            <CandidateListContent />
          </div>
        )}
      </div>
    </AppLayout>
  );
}