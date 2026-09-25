'use client';

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { 
  EmployeeKPIScorecard, 
  KPIDepartmentPreset, 
  DepartmentType, 
  KPIMetric 
} from '@/types/kpi';
import { 
  KPI_DEPARTMENT_PRESETS, 
  calculateMetricAchievement, 
  calculateKPIGrade 
} from '@/data/mockKpi';

interface KPICreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newScorecard: EmployeeKPIScorecard) => void;
  preselectedPreset?: KPIDepartmentPreset | null;
}

export default function KPICreateModal({
  isOpen,
  onClose,
  onCreate,
  preselectedPreset,
}: KPICreateModalProps) {
  const [employeeName, setEmployeeName] = useState('');
  const [nip, setNip] = useState('LVS-' + Math.floor(100 + Math.random() * 900));
  const [department, setDepartment] = useState<DepartmentType>(
    preselectedPreset?.department || 'Produksi & Workshop'
  );
  const [position, setPosition] = useState(preselectedPreset?.role || 'Tukang Jahit & Upholstery');
  const [period, setPeriod] = useState('September 2026');
  const [evaluator, setEvaluator] = useState('Agus Setiawan, S.T.');
  const [evaluatorRole, setEvaluatorRole] = useState('Kepala Divisi Operasional');

  if (!isOpen) return null;

  const handleDepartmentChange = (dept: DepartmentType) => {
    setDepartment(dept);
    const preset = KPI_DEPARTMENT_PRESETS.find((p) => p.department === dept);
    if (preset) {
      setPosition(preset.role);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim()) return;

    const preset = KPI_DEPARTMENT_PRESETS.find((p) => p.department === department) || KPI_DEPARTMENT_PRESETS[0];

    const metrics: KPIMetric[] = preset.metrics.map((m, idx) => {
      // Default initial actual equal to target for starting baseline
      const initialActual = m.target;
      const achievement = calculateMetricAchievement(m.target, initialActual, m.polarity);
      const weighted = Math.round(((achievement * m.weight) / 100) * 10) / 10;
      return {
        ...m,
        id: `m-new-${Date.now()}-${idx}`,
        actual: initialActual,
        achievementPct: achievement,
        weightedScore: weighted,
      };
    });

    const totalScore = Math.round(metrics.reduce((acc, m) => acc + m.weightedScore, 0) * 10) / 10;
    const grade = calculateKPIGrade(totalScore);

    const newScorecard: EmployeeKPIScorecard = {
      id: `kpi-emp-${Date.now()}`,
      nip: nip || `LVS-${Math.floor(100 + Math.random() * 900)}`,
      employeeName,
      department,
      position,
      period,
      periodType: 'monthly',
      status: 'draft',
      metrics,
      totalScore,
      grade,
      evaluator,
      evaluatorRole,
      reviewNotes: 'Form evaluasi KPI baru dibuat dengan template parameter standar divisi.',
      pipRequired: false,
      bonusEligible: totalScore >= 85,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onCreate(newScorecard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Buat Evaluasi KPI Karyawan Baru
              </h2>
              <p className="text-xs text-slate-500">
                Otomatis memuat indikator & parameter standar sesuai divisi kerja.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
              Nama Lengkap Karyawan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rian Hidayat"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1">
                Nomor Induk (NIP)
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full text-xs font-mono text-slate-900 px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1">
                Periode Penilaian
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full text-xs text-slate-900 px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
              Divisi / Departemen
            </label>
            <select
              value={department}
              onChange={(e) => handleDepartmentChange(e.target.value as DepartmentType)}
              className="w-full text-xs text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
            >
              {KPI_DEPARTMENT_PRESETS.map((p) => (
                <option key={p.department} value={p.department}>
                  {p.department} ({p.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1">
              Jabatan / Posisi
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full text-xs text-slate-900 px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1">
                Nama Penilai / Evaluator
              </label>
              <input
                type="text"
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
                className="w-full text-xs text-slate-900 px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1">
                Role Penilai
              </label>
              <input
                type="text"
                value={evaluatorRole}
                onChange={(e) => setEvaluatorRole(e.target.value)}
                className="w-full text-xs text-slate-900 px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-start gap-2.5 text-blue-900 text-xs">
            <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p>
              Sistem akan otomatis mengimpor <strong>5 metrik standar</strong> dengan bobot kumulatif 100% dari template <em>{department}</em>. Realisasi angka aktual dapat langsung diubah di halaman scorecard setelah dibuat.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus size={15} /> Buat Scorecard KPI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
