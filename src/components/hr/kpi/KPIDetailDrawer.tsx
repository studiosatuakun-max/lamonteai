'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Award, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  User,
  Calendar,
  Building,
  Briefcase,
  FileCheck,
  Printer,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  EmployeeKPIScorecard, 
  KPIMetric, 
  KPIGrade 
} from '@/types/kpi';
import { 
  calculateMetricAchievement, 
  calculateKPIGrade, 
  getGradeColor 
} from '@/data/mockKpi';

interface KPIDetailDrawerProps {
  scorecard: EmployeeKPIScorecard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: EmployeeKPIScorecard) => void;
  onOpenScorecardReport?: (scorecard: EmployeeKPIScorecard) => void;
}

export default function KPIDetailDrawer({
  scorecard,
  isOpen,
  onClose,
  onSave,
  onOpenScorecardReport,
}: KPIDetailDrawerProps) {
  const [formData, setFormData] = useState<EmployeeKPIScorecard | null>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    if (scorecard) {
      setFormData(JSON.parse(JSON.stringify(scorecard)));
    }
  }, [scorecard]);

  if (!isOpen || !formData) return null;

  const handleActualChange = (metricId: string, valStr: string) => {
    const val = parseFloat(valStr) || 0;
    
    const updatedMetrics = formData.metrics.map((m) => {
      if (m.id === metricId) {
        const achievement = calculateMetricAchievement(m.target, val, m.polarity);
        const weighted = Math.round(((achievement * m.weight) / 100) * 10) / 10;
        return {
          ...m,
          actual: val,
          achievementPct: achievement,
          weightedScore: weighted,
        };
      }
      return m;
    });

    const newTotalScore = Math.round(
      updatedMetrics.reduce((sum, m) => sum + m.weightedScore, 0) * 10
    ) / 10;

    const newGrade = calculateKPIGrade(newTotalScore);
    const pip = newGrade === 'D' || newGrade === 'E';
    const bonus = newTotalScore >= 85.0;

    setFormData({
      ...formData,
      metrics: updatedMetrics,
      totalScore: newTotalScore,
      grade: newGrade,
      pipRequired: pip,
      bonusEligible: bonus,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
  };

  const handleNotesChange = (metricId: string, text: string) => {
    setFormData({
      ...formData,
      metrics: formData.metrics.map((m) =>
        m.id === metricId ? { ...m, notes: text } : m
      ),
    });
  };

  const handleStatusChange = (newStatus: EmployeeKPIScorecard['status']) => {
    const updated = {
      ...formData,
      status: newStatus,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setFormData(updated);
    onSave(updated);
    showToast();
  };

  const handleSaveAll = () => {
    onSave(formData);
    showToast();
  };

  const showToast = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const gradeInfo = getGradeColor(formData.grade);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.employeeName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold">
                  {formData.employeeName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {formData.employeeName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                  {formData.nip}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{formData.position}</span>
                <span>•</span>
                <span className="font-medium text-slate-700">{formData.department}</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">{formData.period}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenScorecardReport && (
              <button
                type="button"
                onClick={() => onOpenScorecardReport(formData)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Buka Lembar Scorecard Resmi (Print / PDF)"
              >
                <Printer size={13} className="text-blue-600" />
                <span>Rapor Scorecard</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Executive Score Ribbon */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Total Skor KPI
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {formData.totalScore}%
            </div>
          </div>

          <div className={`p-3 rounded-xl border ${gradeInfo.bg} ${gradeInfo.border}`}>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Grade Kinerja
            </span>
            <div className={`text-2xl font-black ${gradeInfo.text} mt-0.5`}>
              Grade {formData.grade}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Hak Insentif / Bonus
            </span>
            <div className="mt-1">
              {formData.bonusEligible ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <Award size={12} />
                  Eligible Bonus
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                  Tidak Memenuhi
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Status Evaluasi
            </span>
            <div className="mt-1">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                formData.status === 'approved' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : formData.status === 'reviewed' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {formData.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Metrics Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {formData.pipRequired && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
              <AlertTriangle className="shrink-0 text-rose-600 mt-0.5" size={18} />
              <div className="text-xs space-y-1">
                <p className="font-bold text-rose-800">
                  Perhatian: Karyawan Terindikasi Butuh Program Pembinaan (PIP)
                </p>
                <p className="text-rose-700">
                  Skor di bawah 75% mengharuskan adanya supervisi intensif selama 30 hari untuk memperbaiki target yang tidak tercapai.
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Breakdown Parameter & Realisasi Kinerja
              </h3>
              <span className="text-xs text-slate-500">
                Ubah nilai <strong>Actual</strong> di bawah untuk simulasi hitung otomatis
              </span>
            </div>

            <div className="space-y-4">
              {formData.metrics.map((metric, index) => {
                const isUnder = metric.achievementPct < 85;
                const isAbove = metric.achievementPct >= 100;

                return (
                  <div
                    key={metric.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:border-blue-200 transition-all space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                          <span className="text-sm font-bold text-slate-900">{metric.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {metric.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{metric.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {metric.polarity === 'maximize' ? (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <ArrowUpRight size={11} /> Tinggi Bagus
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                            <ArrowDownRight size={11} /> Rendah Bagus
                          </span>
                        )}
                        <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">
                          Bobot: {metric.weight}%
                        </span>
                      </div>
                    </div>

                    {/* Target vs Actual Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">
                          Target Baku
                        </label>
                        <div className="text-xs font-semibold text-slate-700 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                          {metric.unit === 'IDR'
                            ? `Rp ${metric.target.toLocaleString('id-ID')}`
                            : `${metric.target} ${metric.unit === 'percentage' ? '%' : metric.unit}`}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-blue-700 block mb-1">
                          Realisasi Aktual (Input)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            value={metric.actual}
                            onChange={(e) => handleActualChange(metric.id, e.target.value)}
                            className="w-full text-xs font-bold text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-blue-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                          />
                          <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400 pointer-events-none">
                            {metric.unit === 'IDR' ? 'IDR' : metric.unit}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">
                          Pencapaian & Skor Tertimbang
                        </label>
                        <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className={`font-extrabold ${isAbove ? 'text-emerald-600' : isUnder ? 'text-rose-600' : 'text-blue-600'}`}>
                            {metric.achievementPct}%
                          </span>
                          <span className="text-slate-500 font-medium">
                            Skor: <strong className="text-slate-800">{metric.weightedScore}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Visual */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isAbove 
                              ? 'bg-emerald-500' 
                              : isUnder 
                              ? 'bg-rose-500' 
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(metric.achievementPct, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Field Catatan */}
                    <div>
                      <input
                        type="text"
                        value={metric.notes || ''}
                        onChange={(e) => handleNotesChange(metric.id, e.target.value)}
                        placeholder="Tambahkan catatan khusus untuk metrik ini..."
                        className="w-full text-xs text-slate-600 placeholder:text-slate-400 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-300 focus:outline-hidden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evaluator Notes Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Catatan Evaluasi Penilai / Manager
              </label>
              <span className="text-[11px] text-slate-500">
                Penilai: {formData.evaluator} ({formData.evaluatorRole})
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.reviewNotes}
              onChange={(e) => setFormData({ ...formData, reviewNotes: e.target.value })}
              className="w-full text-xs text-slate-800 p-3 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              placeholder="Berikan feedback pencapaian kerja, area peningkatan, atau rekomendasi..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSavedToast && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                <CheckCircle size={14} /> Tersimpan!
              </span>
            )}
            <span className="text-xs text-slate-400">
              Update: {formData.lastUpdated}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('draft')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Simpan Draft
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Save size={14} /> Simpan Perubahan
            </button>
            <button
              onClick={() => handleStatusChange('approved')}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle size={14} /> Approve Final
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
