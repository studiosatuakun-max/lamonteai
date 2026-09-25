'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  Plus, 
  Eye, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  FileSpreadsheet,
  Download,
  Sparkles,
  ChevronRight,
  UserCheck,
  Building2,
  LayoutGrid,
  Table as TableIcon,
  Printer,
  FileText
} from 'lucide-react';
import { 
  EmployeeKPIScorecard, 
  KPIDepartmentPreset, 
  DepartmentType, 
  KPIGrade, 
  KPIStatus 
} from '@/types/kpi';
import { 
  INITIAL_EMPLOYEE_SCORECARDS, 
  getGradeColor 
} from '@/data/mockKpi';
import KPISummaryCards from './KPISummaryCards';
import KPIPresetModal from './KPIPresetModal';
import KPIDetailDrawer from './KPIDetailDrawer';
import KPICreateModal from './KPICreateModal';
import KPIScorecardModal from './KPIScorecardModal';

export default function EmployeeKPIView() {
  const [scorecards, setScorecards] = useState<EmployeeKPIScorecard[]>(INITIAL_EMPLOYEE_SCORECARDS);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals & Drawer State
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeScorecard, setActiveScorecard] = useState<EmployeeKPIScorecard | null>(null);
  const [scorecardReportData, setScorecardReportData] = useState<EmployeeKPIScorecard | null>(null);
  const [isScorecardModalOpen, setIsScorecardModalOpen] = useState(false);
  const [preselectedPreset, setPreselectedPreset] = useState<KPIDepartmentPreset | null>(null);

  // Filtered scorecards
  const filteredScorecards = useMemo(() => {
    return scorecards.filter((s) => {
      const matchSearch = 
        s.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        s.nip.toLowerCase().includes(search.toLowerCase()) ||
        s.position.toLowerCase().includes(search.toLowerCase());

      const matchDept = selectedDept === 'All' || s.department === selectedDept;
      const matchGrade = selectedGrade === 'All' || s.grade === selectedGrade;
      const matchStatus = selectedStatus === 'All' || s.status === selectedStatus;

      return matchSearch && matchDept && matchGrade && matchStatus;
    });
  }, [scorecards, search, selectedDept, selectedGrade, selectedStatus]);

  // Handlers
  const handleSaveScorecard = (updated: EmployeeKPIScorecard) => {
    setScorecards((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setActiveScorecard(updated);
  };

  const handleCreateScorecard = (newScorecard: EmployeeKPIScorecard) => {
    setScorecards((prev) => [newScorecard, ...prev]);
    setActiveScorecard(newScorecard);
  };

  const handleSelectPresetFromLibrary = (preset: KPIDepartmentPreset) => {
    setPreselectedPreset(preset);
    setIsCreateModalOpen(true);
  };

  const handleOpenScorecardDocument = (item: EmployeeKPIScorecard) => {
    setScorecardReportData(item);
    setIsScorecardModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Performance & Appraisal Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Scorecard & KPI Karyawan Lovise Sofa
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Sistem evaluasi performa terukur berbasis bobot (weighting), target polaritas (maximize/minimize), realisasi aktual per divisi, dan cetak lembar scorecard resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Layers size={16} className="text-blue-600" />
            Pustaka Parameter Standar
          </button>

          <button
            onClick={() => {
              setPreselectedPreset(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus size={16} />
            + Evaluasi Karyawan Baru
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <KPISummaryCards scorecards={scorecards} />

      {/* Main Filter & View Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Cari nama karyawan, NIP, atau jabatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-400"
            />
          </div>

          {/* Dropdown Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Departemen */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:border-blue-600"
            >
              <option value="All">Semua Divisi</option>
              <option value="Produksi & Workshop">Produksi & Workshop</option>
              <option value="Sales & Showroom">Sales & Showroom</option>
              <option value="Logistik & Delivery">Logistik & Delivery</option>
              <option value="Finance & Admin (FAT)">Finance & Admin</option>
              <option value="HR & General Affairs">HR & GA</option>
            </select>

            {/* Grade */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:border-blue-600"
            >
              <option value="All">Semua Grade</option>
              <option value="A">Grade A (Outstanding)</option>
              <option value="B">Grade B (Exceeds)</option>
              <option value="C">Grade C (Standard)</option>
              <option value="D">Grade D (Needs Improvement)</option>
              <option value="E">Grade E (Poor)</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:border-blue-600"
            >
              <option value="All">Semua Status</option>
              <option value="approved">Approved</option>
              <option value="reviewed">Reviewed</option>
              <option value="draft">Draft</option>
            </select>

            {/* View Switcher Toggle */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl border border-slate-300">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan Kartu Scorecard"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Scorecard</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan Tabel"
              >
                <TableIcon size={15} />
                <span className="hidden sm:inline">Tabel</span>
              </button>
            </div>

            {(search || selectedDept !== 'All' || selectedGrade !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedDept('All');
                  setSelectedGrade('All');
                  setSelectedStatus('All');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Content View: Grid or Table */}
        {filteredScorecards.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            Tidak ditemukan data scorecard KPI sesuai filter pencarian.
          </div>
        ) : viewMode === 'grid' ? (
          /* SCORECARD GRID VIEW */
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-slate-50/40">
            {filteredScorecards.map((scorecard) => {
              const gradeStyles = getGradeColor(scorecard.grade);
              const isTop = scorecard.grade === 'A';
              const isPip = scorecard.pipRequired || scorecard.grade === 'D' || scorecard.grade === 'E';

              return (
                <div
                  key={scorecard.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                        {scorecard.avatar ? (
                          <img
                            src={scorecard.avatar}
                            alt={scorecard.employeeName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-sm">
                            {scorecard.employeeName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                          {scorecard.employeeName}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-400">
                          {scorecard.nip}
                        </p>
                        <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">
                          {scorecard.position}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-black text-sm px-2.5 py-1 rounded-xl border ${gradeStyles.bg} ${gradeStyles.text} ${gradeStyles.border} shadow-2xs`}
                    >
                      {scorecard.grade}
                    </span>
                  </div>

                  {/* Card Score Dial Body */}
                  <div className="p-5 flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Total Skor Kinerja
                        </span>
                        <div className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                          {scorecard.totalScore}%
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Departemen
                        </span>
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          {scorecard.department}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          scorecard.totalScore >= 95
                            ? 'bg-emerald-500'
                            : scorecard.totalScore >= 85
                            ? 'bg-blue-600'
                            : scorecard.totalScore >= 75
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(scorecard.totalScore, 100)}%` }}
                      />
                    </div>

                    {/* Top 3 KPI Metrics Mini-List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Indikator Utama ({scorecard.metrics.length} Parameter):
                      </span>
                      {scorecard.metrics.slice(0, 3).map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-50">
                          <span className="text-slate-600 truncate max-w-[190px]">{m.name}</span>
                          <span className={`font-bold ${m.achievementPct >= 100 ? 'text-emerald-600' : m.achievementPct < 85 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {m.achievementPct}%
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Badge status */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {isTop && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                          <Award size={11} /> Bonus Full
                        </span>
                      )}
                      {isPip && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <AlertTriangle size={11} /> Perlu PIP
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium ml-auto">
                        Periode: {scorecard.period}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenScorecardDocument(scorecard)}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <FileText size={13} className="text-blue-600" />
                      Rapor Scorecard
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveScorecard(scorecard)}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Eye size={13} />
                      Evaluasi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Karyawan</th>
                  <th className="py-3.5 px-4">Divisi & Posisi</th>
                  <th className="py-3.5 px-4 text-center">Periode</th>
                  <th className="py-3.5 px-4">Pencapaian KPI</th>
                  <th className="py-3.5 px-4 text-center">Grade</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Indikator HR</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredScorecards.map((scorecard) => {
                  const gradeStyles = getGradeColor(scorecard.grade);
                  const isTop = scorecard.grade === 'A';
                  const isPip = scorecard.pipRequired || scorecard.grade === 'D' || scorecard.grade === 'E';

                  return (
                    <tr
                      key={scorecard.id}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => setActiveScorecard(scorecard)}
                    >
                      {/* Employee Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                            {scorecard.avatar ? (
                              <img
                                src={scorecard.avatar}
                                alt={scorecard.employeeName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-xs">
                                {scorecard.employeeName.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {scorecard.employeeName}
                            </div>
                            <div className="font-mono text-[11px] text-slate-400">
                              {scorecard.nip}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Division & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {scorecard.position}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {scorecard.department}
                        </div>
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {scorecard.period}
                        </span>
                      </td>

                      {/* KPI Score & Gauge */}
                      <td className="py-3.5 px-4 min-w-[170px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-xs">
                            {scorecard.totalScore}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {scorecard.metrics.length} Parameter
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              scorecard.totalScore >= 95
                                ? 'bg-emerald-500'
                                : scorecard.totalScore >= 85
                                ? 'bg-blue-600'
                                : scorecard.totalScore >= 75
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(scorecard.totalScore, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Grade Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block font-extrabold text-xs px-2.5 py-1 rounded-lg border ${gradeStyles.bg} ${gradeStyles.text} ${gradeStyles.border}`}
                        >
                          Grade {scorecard.grade}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            scorecard.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : scorecard.status === 'reviewed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {scorecard.status === 'approved' && <CheckCircle2 size={11} />}
                          {scorecard.status === 'reviewed' && <Clock size={11} />}
                          {scorecard.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Indicators */}
                      <td className="py-3.5 px-4">
                        {isTop && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            <Award size={12} /> Bonus Full
                          </span>
                        )}
                        {isPip && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <AlertTriangle size={12} /> Butuh PIP
                          </span>
                        )}
                        {!isTop && !isPip && (
                          <span className="text-[11px] text-slate-500">Standar Terpenuhi</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenScorecardDocument(scorecard);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
                            title="Buka Lembar Cetak Rapor Scorecard"
                          >
                            <FileText size={13} className="text-blue-600" />
                            Scorecard
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveScorecard(scorecard);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Eye size={13} />
                            Evaluasi
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table/Grid Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong>{filteredScorecards.length}</strong> dari <strong>{scorecards.length}</strong> evaluasi karyawan
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Grade A &ge; 95%
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Grade B &ge; 85%
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Grade C &ge; 75%
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Grade D/E &lt; 75%
            </span>
          </div>
        </div>
      </div>

      {/* Modals & Detail Drawer */}
      <KPIDetailDrawer
        scorecard={activeScorecard}
        isOpen={!!activeScorecard}
        onClose={() => setActiveScorecard(null)}
        onSave={handleSaveScorecard}
        onOpenScorecardReport={(sc) => handleOpenScorecardDocument(sc)}
      />

      <KPIScorecardModal
        scorecard={scorecardReportData}
        isOpen={isScorecardModalOpen}
        onClose={() => setIsScorecardModalOpen(false)}
      />

      <KPIPresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={handleSelectPresetFromLibrary}
      />

      <KPICreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateScorecard}
        preselectedPreset={preselectedPreset}
      />
    </div>
  );
}
