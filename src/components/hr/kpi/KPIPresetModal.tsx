'use client';

import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Percent, 
  Target, 
  HelpCircle, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Hammer,
  ShoppingBag,
  Truck,
  Briefcase,
  Users
} from 'lucide-react';
import { KPI_DEPARTMENT_PRESETS } from '@/data/mockKpi';
import { KPIDepartmentPreset, DepartmentType } from '@/types/kpi';

interface KPIPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: KPIDepartmentPreset) => void;
}

export default function KPIPresetModal({
  isOpen,
  onClose,
  onSelectPreset,
}: KPIPresetModalProps) {
  const [selectedDept, setSelectedDept] = useState<DepartmentType>('Produksi & Workshop');

  if (!isOpen) return null;

  const activePreset = KPI_DEPARTMENT_PRESETS.find((p) => p.department === selectedDept) || KPI_DEPARTMENT_PRESETS[0];

  const getDeptIcon = (dept: DepartmentType) => {
    switch (dept) {
      case 'Produksi & Workshop':
        return <Hammer size={16} />;
      case 'Sales & Showroom':
        return <ShoppingBag size={16} />;
      case 'Logistik & Delivery':
        return <Truck size={16} />;
      case 'Finance & Admin (FAT)':
        return <Briefcase size={16} />;
      case 'HR & General Affairs':
        return <Users size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pustaka Standar Parameter KPI Lovise Sofa
              </h2>
              <p className="text-xs text-slate-500">
                Panduan baku metrik, bobot (weight), dan polaritas target per divisi kerja.
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

        {/* Division Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto gap-2 py-2">
          {KPI_DEPARTMENT_PRESETS.map((preset) => {
            const isSelected = selectedDept === preset.department;
            return (
              <button
                key={preset.department}
                onClick={() => setSelectedDept(preset.department)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {getDeptIcon(preset.department)}
                {preset.department}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Preset Info Banner */}
          <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  Role Acuan:
                </span>
                <span className="text-sm font-semibold text-blue-700">
                  {activePreset.role}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {activePreset.description}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-blue-200 text-blue-800">
                Total Bobot: 100%
              </span>
            </div>
          </div>

          {/* Metrics Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Parameter / Metrik KPI</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Satuan</th>
                  <th className="py-3 px-3">Arah Polaritas</th>
                  <th className="py-3 px-3 text-right">Target Acuan</th>
                  <th className="py-3 px-3 text-right">Bobot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activePreset.metrics.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{metric.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{metric.description}</div>
                      {metric.notes && (
                        <div className="text-[10px] text-blue-600 mt-0.5 italic">
                          💡 Catatan: {metric.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                        {metric.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {metric.unit === 'IDR' ? 'Rupiah (Rp)' : metric.unit}
                    </td>
                    <td className="py-3 px-3">
                      {metric.polarity === 'maximize' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ArrowUpRight size={12} />
                          Tinggi = Bagus
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                          <ArrowDownRight size={12} />
                          Rendah = Bagus
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-800">
                      {metric.unit === 'IDR' 
                        ? `Rp ${(metric.target / 1000000).toLocaleString('id-ID')} Jt`
                        : `${metric.target} ${metric.unit === 'percentage' ? '%' : ''}`}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {metric.weight}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rationale Framework Alert */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck size={15} className="text-blue-600" />
              Formula Standar Lovise Sofa:
            </div>
            <p>
              • <strong>Polaritas "Tinggi = Bagus"</strong> dihitung: <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800 font-mono">(Actual / Target) × 100%</code>.
            </p>
            <p>
              • <strong>Polaritas "Rendah = Bagus"</strong> (seperti Defect Rate / Waste / SLA Balas Chat) dihitung: <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800 font-mono">(Target / Actual) × 100%</code>.
            </p>
            <p>
              • <strong>Skor Akhir</strong> dihitung dari penjumlahan nilai tertimbang masing-masing parameter.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Dapat disesuaikan sewaktu-waktu sesuai target bulanan perusahaan.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onSelectPreset(activePreset);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
            >
              <Check size={14} />
              Gunakan Template Ini untuk Evaluasi Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
