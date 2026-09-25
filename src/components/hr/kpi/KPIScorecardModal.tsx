'use client';

import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  UserCheck, 
  FileText,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { EmployeeKPIScorecard } from '@/types/kpi';
import { getGradeColor } from '@/data/mockKpi';

interface KPIScorecardModalProps {
  scorecard: EmployeeKPIScorecard | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function KPIScorecardModal({
  scorecard,
  isOpen,
  onClose,
}: KPIScorecardModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !scorecard) return null;

  const gradeInfo = getGradeColor(scorecard.grade);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <FileText size={16} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Dokumen Resmi: Rapor Scorecard KPI Karyawan
              </h2>
              <p className="text-[11px] text-slate-500">
                Format standar cetak & evaluasi formal Lovise Sofa ERP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer size={14} /> Cetak / Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Scorecard Sheet */}
        <div 
          ref={printRef}
          className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 text-slate-900 bg-white"
        >
          {/* Header Surat / Kop Perusahaan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-slate-900 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-xs">
                LS
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  LOVISE SOFA
                </h1>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Furniture Manufacturing & Showroom Studio
                </p>
                <p className="text-[10px] text-slate-400">
                  Human Resources & People Performance Department
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800">
                DOC-ID: {scorecard.id.toUpperCase()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Periode: <strong className="text-slate-800">{scorecard.period}</strong>
              </p>
              <p className="text-[10px] text-slate-400">
                Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </p>
            </div>
          </div>

          {/* Judul Dokumen */}
          <div className="text-center py-2">
            <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-slate-900">
              LEMBAR SCORECARD KINERJA KARYAWAN
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi Pencapaian Key Performance Indicators (KPI) & Kompetensi Kerja
            </p>
          </div>

          {/* Profil Karyawan & Ringkasan Nilai */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kolom Biodata (2 col) */}
            <div className="md:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Informasi Pegawai
              </h3>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nama Lengkap</span>
                  <span className="font-bold text-slate-900 text-sm">{scorecard.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nomor Induk (NIP)</span>
                  <span className="font-mono font-bold text-slate-800">{scorecard.nip}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Departemen / Divisi</span>
                  <span className="font-medium text-slate-800">{scorecard.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Jabatan / Posisi</span>
                  <span className="font-medium text-slate-800">{scorecard.position}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Atasan / Penilai</span>
                  <span className="font-medium text-slate-800">{scorecard.evaluator}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Jabatan Penilai</span>
                  <span className="font-medium text-slate-800">{scorecard.evaluatorRole}</span>
                </div>
              </div>
            </div>

            {/* Kolom Nilai Akhir (1 col) */}
            <div className={`rounded-xl p-4 border text-center flex flex-col items-center justify-center ${gradeInfo.bg} ${gradeInfo.border}`}>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Skor Akhir KPI
              </span>
              <div className="text-4xl font-black text-slate-900 my-1">
                {scorecard.totalScore}%
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${gradeInfo.border} ${gradeInfo.text} bg-white shadow-2xs`}>
                {gradeInfo.label}
              </div>
              <div className="mt-2 text-[10px] font-medium text-slate-600">
                {scorecard.bonusEligible ? (
                  <span className="text-emerald-700 font-bold">✓ Memenuhi Syarat Bonus</span>
                ) : (
                  <span className="text-slate-500">Standar / Tanpa Insentif</span>
                )}
              </div>
            </div>
          </div>

          {/* Tabel Rincian Metrik Scorecard */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Rincian Pencapaian Indikator Kinerja</span>
              <span className="text-[11px] text-slate-500 lowercase font-normal">
                (Total bobot: 100%)
              </span>
            </h3>

            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-8 text-center">No</th>
                    <th className="py-2.5 px-3">Parameter / Dimensi KPI</th>
                    <th className="py-2.5 px-3 text-center">Satuan</th>
                    <th className="py-2.5 px-3 text-right">Target</th>
                    <th className="py-2.5 px-3 text-right">Realisasi</th>
                    <th className="py-2.5 px-3 text-right">Pencapaian</th>
                    <th className="py-2.5 px-3 text-right">Bobot</th>
                    <th className="py-2.5 px-3 text-right">Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scorecard.metrics.map((metric, idx) => (
                    <tr key={metric.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-slate-900">{metric.name}</div>
                        <div className="text-[10px] text-slate-500">{metric.description}</div>
                        {metric.notes && (
                          <div className="text-[10px] text-blue-700 italic mt-0.5">
                            * {metric.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-600">
                        {metric.unit === 'IDR' ? 'Rupiah' : metric.unit}
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-slate-800">
                        {metric.unit === 'IDR'
                          ? `Rp ${metric.target.toLocaleString('id-ID')}`
                          : `${metric.target} ${metric.unit === 'percentage' ? '%' : ''}`}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {metric.unit === 'IDR'
                          ? `Rp ${metric.actual.toLocaleString('id-ID')}`
                          : `${metric.actual} ${metric.unit === 'percentage' ? '%' : ''}`}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">
                        {metric.achievementPct}%
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-slate-600">
                        {metric.weight}%
                      </td>
                      <td className="py-2 px-3 text-right font-extrabold text-blue-700">
                        {metric.weightedScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100/80 border-t-2 border-slate-300 font-bold text-slate-900">
                  <tr>
                    <td colSpan={6} className="py-2 px-3 text-right uppercase text-[11px]">
                      Total Skor Kinerja Terbobot:
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600">100%</td>
                    <td className="py-2 px-3 text-right text-sm text-blue-700">
                      {scorecard.totalScore}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Catatan Kualitatif & Rekomendasi */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Evaluasi Kualitatif & Rekomendasi Atasan Langsung:
            </h4>
            <p className="text-slate-700 italic leading-relaxed">
              "{scorecard.reviewNotes || 'Karyawan telah menyelesaikan seluruh parameter evaluasi periode ini dengan baik.'}"
            </p>
            {scorecard.pipRequired && (
              <div className="mt-2 p-2.5 rounded-lg bg-rose-100/70 border border-rose-300 text-rose-900 text-[11px]">
                <strong>Rekomendasi PIP:</strong> Karyawan masuk ke dalam program pembinaan performa selama 30 hari kalender dengan pendampingan mentor divisi.
              </div>
            )}
          </div>

          {/* Kolom Tanda Tangan Resmi (Sign-off) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-6 text-center text-xs">
              <div>
                <p className="text-slate-500 text-[11px] mb-14">Karyawan yang Dinilai,</p>
                <div className="border-b border-slate-400 w-36 mx-auto"></div>
                <p className="font-bold text-slate-900 mt-1">{scorecard.employeeName}</p>
                <p className="text-[10px] text-slate-400 font-mono">NIP: {scorecard.nip}</p>
              </div>

              <div>
                <p className="text-slate-500 text-[11px] mb-14">Atasan Langsung / Penilai,</p>
                <div className="border-b border-slate-400 w-36 mx-auto"></div>
                <p className="font-bold text-slate-900 mt-1">{scorecard.evaluator}</p>
                <p className="text-[10px] text-slate-400">{scorecard.evaluatorRole}</p>
              </div>

              <div>
                <p className="text-slate-500 text-[11px] mb-14">Mengetahui (HR & Direksi),</p>
                <div className="border-b border-slate-400 w-36 mx-auto"></div>
                <p className="font-bold text-slate-900 mt-1">HR Operations Lovise</p>
                <p className="text-[10px] text-slate-400">Head of People & Culture</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between print:hidden">
          <span>Status verifikasi: <strong>{scorecard.status.toUpperCase()}</strong></span>
          <span>Lovise Sofa Enterprise Core System • Lovise ERP v2.4</span>
        </div>
      </div>
    </div>
  );
}
