"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, Send, Edit2, Trash2, X, AlertTriangle, 
  CheckCircle2, Clock, Sparkles, Loader2, RefreshCw, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOperationsStore } from "@/lib/operations-store";
import { DailyReportEntry, AIDigestResult, SalesOrder } from "@/types/operations";
import { generateDailyDigestAction } from "../actions";
import OrderAuditTrailModal from "./OrderAuditTrailModal";

interface DailyReportSectionProps {
  onNotify?: (msg: string) => void;
}

export default function DailyReportSection({ onNotify }: DailyReportSectionProps) {
  const {
    dailyReports,
    orders,
    aiDigest,
    createDailyReport,
    updateDailyReport,
    deleteDailyReport,
    setAiDigest,
  } = useOperationsStore();

  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [reportDivision, setReportDivision] = useState<DailyReportEntry["division"]>("Produksi");
  const [reportAuthor, setReportAuthor] = useState("Pak Joko (Mandor Pabrik)");
  const [reportText, setReportText] = useState("");
  const [reportUrgency, setReportUrgency] = useState<DailyReportEntry["urgency"]>("Normal");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReportEntry | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<DailyReportEntry>>({});
  const [selectedOrderForAudit, setSelectedOrderForAudit] = useState<SalesOrder | null>(null);

  const handleTraceSP = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = orders.find(o => o.spNumber.toUpperCase() === cleanCode);
    if (found) {
      setSelectedOrderForAudit(found);
    } else {
      onNotify?.(`Pesanan dengan nomor ${code} belum ditemukan atau dibuat melalui SP baru.`);
    }
  };

  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    // Detect mentioned SPs, POs, or SPKs
    const spMatches = reportText.match(/(?:SP|PO|SPK)-[A-Za-z0-9-]+/gi) || [];
    const relatedSP = Array.from(new Set(spMatches.map(s => s.toUpperCase())));

    createDailyReport({
      division: reportDivision,
      reporter: reportAuthor,
      notes: reportText,
      urgency: reportUrgency,
      relatedSP
    });

    setReportText("");
    onNotify?.(`Laporan dari divisi ${reportDivision} berhasil disimpan!`);
  };

  const handleOpenEditModal = (report: DailyReportEntry) => {
    setSelectedReport(report);
    setEditFormData({ ...report });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (report: DailyReportEntry) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    updateDailyReport(selectedReport.id, editFormData);
    setIsEditModalOpen(false);
    onNotify?.("Laporan harian berhasil diperbarui");
  };

  const handleConfirmDelete = () => {
    if (!selectedReport) return;
    deleteDailyReport(selectedReport.id);
    setIsDeleteModalOpen(false);
    onNotify?.("Laporan harian berhasil dihapus");
  };

  const handleGenerateDigest = async () => {
    setIsGenerating(true);
    try {
      const res = await generateDailyDigestAction(dailyReports, orders);
      if (res.success && res.data) {
        setAiDigest(res.data);
        onNotify?.("AI Daily Digest berhasil digenerate!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* DIGEST BANNER / GENERATOR */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl overflow-hidden relative">
        <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-300 border border-white/10">
              <Sparkles size={14} className="text-amber-400" />
              AI Intelligence Operations Digest
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              Ringkasan Operasional & Deteksi Bottleneck Lintas Divisi
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              AI membaca seluruh laporan harian dari Purchasing, Produksi, Inventory, Distribusi, dan Koordinator Toko, lalu menghubungkannya berdasarkan nomor identitas tunggal (SP / PO).
            </p>
          </div>

          <Button
            disabled={isGenerating}
            onClick={handleGenerateDigest}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-6 rounded-xl shadow-lg shrink-0 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Menganalisis...
              </>
            ) : (
              <>
                <BrainCircuit className="h-5 w-5 text-indigo-200" />
                Generate AI Daily Digest
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* AI DIGEST RESULT DISPLAY */}
      {aiDigest && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card className="border-indigo-200 shadow-md">
            <CardHeader className="bg-indigo-50/60 border-b border-indigo-100 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <BrainCircuit size={16} className="text-indigo-600" />
                  Hasil Analisis AI Daily Digest ({aiDigest.date})
                </CardTitle>
                <span className="text-[11px] text-slate-500">
                  {aiDigest.totalOrdersMonitored} Pesanan Termonitor
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-medium">
                {aiDigest.summary}
              </div>

              {aiDigest.bottlenecks && aiDigest.bottlenecks.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs">
                    <AlertTriangle size={14} className="text-amber-600" />
                    Bottleneck / Kendala yang Terdeteksi:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiDigest.bottlenecks.map((b, idx) => (
                      <div key={idx} className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-amber-900">{b.spNumber}</span>
                          <Badge variant="outline" className="text-[10px] bg-white text-amber-800 border-amber-300">
                            {b.division}
                          </Badge>
                        </div>
                        <p className="font-bold text-slate-800">{b.issue}</p>
                        <p className="text-[11px] text-slate-600">
                          <strong>Saran AI:</strong> {b.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* FORM INPUT LAPORAN HARIAN (CREATE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-200 lg:col-span-1">
          <CardHeader className="bg-slate-50 border-b border-slate-200/80 pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send size={16} className="text-indigo-600" />
              Input Laporan Harian Divisi
            </CardTitle>
            <CardDescription className="text-xs">
              Sampaikan progres atau kendala operasional hari ini. AI akan membaca No SP otomatis.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmitNewReport} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Divisi Pelapor</label>
                <select
                  value={reportDivision}
                  onChange={(e) => setReportDivision(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="Koordinator Toko">Koordinator Toko</option>
                  <option value="Purchasing">Purchasing</option>
                  <option value="Produksi">Produksi</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Distribusi">Distribusi</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Petugas / Pelapor</label>
                <input
                  type="text"
                  value={reportAuthor}
                  onChange={(e) => setReportAuthor(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Urgensi</label>
                <select
                  value={reportUrgency}
                  onChange={(e) => setReportUrgency(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="Normal">Normal (Berjalan Lancar)</option>
                  <option value="Perhatian">Perhatian (Perlu Koordinasi)</option>
                  <option value="Kritis">Kritis (Kendala Macet)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Isi Laporan (Sebutkan No SP jika ada)</label>
                <textarea
                  rows={4}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  placeholder="Contoh: Rangka untuk SP-001 sudah selesai, lanjut proses jahit..."
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Kirim Laporan Harian
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* LOG LAPORAN HARIAN (READ, UPDATE, DELETE) */}
        <Card className="shadow-sm border-slate-200 lg:col-span-2">
          <CardHeader className="bg-slate-50 border-b border-slate-200/80 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Riwayat Laporan Operasional Hari Ini
              </CardTitle>
              <CardDescription className="text-xs">
                Total {dailyReports.length} laporan tercatat dari seluruh divisi.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {dailyReports.map((rep) => (
              <div
                key={rep.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition-all shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-3"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-bold text-indigo-700 bg-indigo-50 border-indigo-200">
                      {rep.division}
                    </Badge>
                    <span className="font-semibold text-slate-800">{rep.reporter}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[11px]">{rep.time}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rep.urgency === "Kritis" ? "bg-red-100 text-red-800" : rep.urgency === "Perhatian" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {rep.urgency}
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed pt-1">
                    {rep.notes}
                  </p>

                  {rep.relatedSP && rep.relatedSP.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400">Terkait:</span>
                      {rep.relatedSP.map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => handleTraceSP(sp)}
                          title="Klik untuk menelusuri audit trail riwayat pesanan ini"
                          className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 px-1.5 py-0.5 rounded border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>🔍</span>
                          <span>{sp}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => handleOpenEditModal(rep)}
                    title="Edit Laporan"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(rep)}
                    title="Hapus Laporan"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {dailyReports.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">Belum ada laporan harian hari ini</p>
                <p className="text-[11px] mt-0.5">Gunakan formulir di sebelah kiri untuk mengirim laporan.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Edit2 size={16} />
                    Edit Laporan Harian
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Koreksi teks laporan atau tingkat urgensi.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Petugas</label>
                  <input
                    type="text"
                    value={editFormData.reporter || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, reporter: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tingkat Urgensi</label>
                  <select
                    value={editFormData.urgency || "Normal"}
                    onChange={(e) => setEditFormData({ ...editFormData, urgency: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Perhatian">Perhatian</option>
                    <option value="Kritis">Kritis</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Isi Laporan</label>
                  <textarea
                    rows={4}
                    value={editFormData.notes || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-slate-900 hover:bg-black text-white">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hapus Laporan Harian?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Hapus laporan dari {selectedReport.reporter} ({selectedReport.division})?
              </p>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setIsDeleteModalOpen(false)}>
                  Batal
                </Button>
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs" onClick={handleConfirmDelete}>
                  Ya, Hapus
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUDIT TRAIL TRACE MODAL */}
      <OrderAuditTrailModal
        order={selectedOrderForAudit}
        onClose={() => setSelectedOrderForAudit(null)}
      />
    </div>
  );
}
