'use client';

import React from 'react';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Sparkles,
  ShieldCheck,
  Target
} from 'lucide-react';
import { EmployeeKPIScorecard } from '@/types/kpi';

interface KPISummaryCardsProps {
  scorecards: EmployeeKPIScorecard[];
}

export default function KPISummaryCards({ scorecards }: KPISummaryCardsProps) {
  const totalEmployees = scorecards.length;
  const avgScore = totalEmployees > 0 
    ? Math.round((scorecards.reduce((acc, s) => acc + s.totalScore, 0) / totalEmployees) * 10) / 10 
    : 0;

  const approvedCount = scorecards.filter((s) => s.status === 'approved').length;
  const reviewProgress = totalEmployees > 0 ? Math.round((approvedCount / totalEmployees) * 100) : 0;

  const topPerformers = scorecards.filter((s) => s.grade === 'A');
  const underperformers = scorecards.filter((s) => s.pipRequired || s.grade === 'D' || s.grade === 'E');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Rata-Rata Skor Perusahaan */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Rata-rata Skor KPI
          </span>
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {avgScore}%
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Grade B (Solid)
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <Target size={13} className="text-slate-400" />
          Target perusahaan: <span className="font-semibold text-slate-700">85.0%</span>
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-700" 
            style={{ width: `${Math.min(avgScore, 100)}%` }} 
          />
        </div>
      </div>

      {/* 2. Progres Review KPI */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Progres Review Bulan Ini
          </span>
          <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {reviewProgress}%
          </span>
          <span className="text-xs font-medium text-slate-500">
            ({approvedCount}/{totalEmployees} Karyawan)
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald-500" />
          {totalEmployees - approvedCount} karyawan menunggu approval
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
            style={{ width: `${reviewProgress}%` }} 
          />
        </div>
      </div>

      {/* 3. Top Performer (Grade A) */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-purple-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Top Performers (Grade A)
          </span>
          <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-purple-900 tracking-tight">
            {topPerformers.length}
          </span>
          <span className="text-xs font-medium text-slate-500">
            Karyawan Unggul
          </span>
        </div>
        <p className="mt-2 text-xs text-purple-700 flex items-center gap-1.5 font-medium">
          <Sparkles size={13} className="text-purple-500" />
          Layak bonus insentif penuh
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-purple-600 h-full rounded-full transition-all duration-700" 
            style={{ width: `${totalEmployees > 0 ? (topPerformers.length / totalEmployees) * 100 : 0}%` }} 
          />
        </div>
      </div>

      {/* 4. Butuh Evaluasi / PIP */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Butuh Pembinaan (PIP)
          </span>
          <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold tracking-tight ${underperformers.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {underperformers.length}
          </span>
          <span className="text-xs font-medium text-slate-500">
            Karyawan (&lt;75%)
          </span>
        </div>
        <p className="mt-2 text-xs text-amber-700 flex items-center gap-1.5 font-medium">
          <AlertTriangle size={13} className="text-amber-500" />
          Perlu evaluasi berkala & coaching
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-amber-500 h-full rounded-full transition-all duration-700" 
            style={{ width: `${totalEmployees > 0 ? (underperformers.length / totalEmployees) * 100 : 0}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
