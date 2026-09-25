"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSearch, CheckCircle2, AlertTriangle, Loader2, 
  LineChart as LineChartIcon, Activity, AlertOctagon,
  Plus, Edit2, Trash2, X, DollarSign
} from "lucide-react";
import { mockFinanceLogs, FinanceLog } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import AppLayout from "@/components/AppLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const cashflowData = [
  { date: "1 Aug", actual: 120, predicted: 120 },
  { date: "5 Aug", actual: 150, predicted: 150 },
  { date: "10 Aug", actual: 90, predicted: 90 },
  { date: "15 Aug", actual: null, predicted: 110 },
  { date: "20 Aug", actual: null, predicted: 160 },
  { date: "25 Aug", actual: null, predicted: 130 },
  { date: "30 Aug", actual: null, predicted: 180 },
];

export default function FinanceModule() {
  const [logs, setLogs] = useState<FinanceLog[]>(mockFinanceLogs);
  const [isAuditing, setIsAuditing] = useState(false);
  const [hasAudited, setHasAudited] = useState(false);
  const [filterType, setFilterType] = useState<string>("All");

  // CRUD Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<FinanceLog | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<FinanceLog>>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "Bank Transfer",
    bankAmount: 1500000,
    systemAmount: 1500000,
    status: "Balanced"
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      type: "Bank Transfer",
      bankAmount: 1000000,
      systemAmount: 1000000,
      status: "Balanced"
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (log: FinanceLog) => {
    setSelectedLog(log);
    setFormData({ ...log });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (log: FinanceLog) => {
    setSelectedLog(log);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;
    const diff = Math.abs((formData.bankAmount || 0) - (formData.systemAmount || 0));
    const autoStatus: FinanceLog["status"] = 
      diff === 0 ? "Balanced" : Math.abs(formData.bankAmount || 0) > 20000000 ? "Anomaly" : "Discrepancy";

    const newLog: FinanceLog = {
      id: `f-${Date.now()}`,
      date: formData.date || new Date().toISOString().split("T")[0],
      description: formData.description,
      type: formData.type || "Bank Transfer",
      bankAmount: Number(formData.bankAmount) || 0,
      systemAmount: Number(formData.systemAmount) || 0,
      status: autoStatus
    };

    setLogs([newLog, ...logs]);
    setIsCreateModalOpen(false);
    showToast(`Transaksi "${newLog.description}" berhasil ditambahkan!`);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog) return;
    const diff = Math.abs((formData.bankAmount || 0) - (formData.systemAmount || 0));
    const autoStatus: FinanceLog["status"] = 
      diff === 0 ? "Balanced" : Math.abs(formData.bankAmount || 0) > 20000000 ? "Anomaly" : "Discrepancy";

    const nextLogs = logs.map(l => {
      if (l.id !== selectedLog.id) return l;
      return {
        ...l,
        ...formData,
        bankAmount: Number(formData.bankAmount) || 0,
        systemAmount: Number(formData.systemAmount) || 0,
        status: autoStatus
      } as FinanceLog;
    });

    setLogs(nextLogs);
    setIsEditModalOpen(false);
    showToast(`Data transaksi berhasil diperbarui`);
  };

  const handleConfirmDelete = () => {
    if (!selectedLog) return;
    setLogs(logs.filter(l => l.id !== selectedLog.id));
    setIsDeleteModalOpen(false);
    showToast(`Transaksi telah dihapus`);
  };

  const runAIOcrAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setHasAudited(true);
      showToast("Analisis AI Terpadu selesai! Anomali & Rekonsiliasi terdeteksi.");
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredLogs = logs.filter(log => filterType === "All" || log.type === filterType);
  const anomalies = logs.filter(l => l.status === "Anomaly");

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Finance (FAT)" },
      ]}
      vacancyTitle="Lovise Sofa — Financial Accounting & Taxation"
    >
      <div className="p-8 space-y-6 animate-in fade-in duration-500">
        {/* Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 bg-blue-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-700"
            >
              <CheckCircle2 className="h-5 w-5 text-blue-300" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Finance (FAT) Module</h1>
            <p className="text-slate-500 mt-1">AI Financial Analyst: Rekonsiliasi, Deteksi Anomali, & Prediksi Cashflow.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleOpenCreateModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              + Tambah Transaksi
            </Button>

            <Button 
              onClick={runAIOcrAudit} 
              disabled={isAuditing} 
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menganalisis Data...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Jalankan Analisis AI Terpadu
                </>
              )}
            </Button>
          </div>
        </div>

        {isAuditing ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-50 pointer-events-none mt-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse bg-slate-100 border-none h-32"></Card>
            ))}
          </div>
        ) : (
          <>
            {/* AI Anomaly Alert */}
            {hasAudited && anomalies.length > 0 && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-4 flex items-start gap-4">
                  <AlertOctagon className="text-rose-600 shrink-0 mt-0.5 h-6 w-6" />
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-rose-900">AI Anomaly Detection Alert</h4>
                    <p className="text-sm text-rose-700 mt-1">Sistem mendeteksi {anomalies.length} transaksi yang sangat tidak wajar dibandingkan pola pengeluaran historis.</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {anomalies.map(a => (
                        <div key={a.id} className="bg-white px-3 py-2 rounded-md border border-rose-100 shadow-sm text-xs">
                          <span className="font-semibold text-slate-900">{a.description}</span> <br/>
                          <span className="text-rose-600 font-mono font-bold">{formatCurrency(a.systemAmount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rekonsiliasi Card */}
              <Card className="lg:col-span-2 bg-white shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Rekonsiliasi (Accurate vs Mutasi)</CardTitle>
                    <CardDescription>Pencocokan otomatis dari Mutasi Bank, QRIS, dan Gabungan ({filteredLogs.length} transaksi).</CardDescription>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["All", "Bank Transfer", "QRIS", "Gabungan"].map(type => (
                      <Badge 
                        key={type}
                        variant={filterType === type ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => setFilterType(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="text-xs">
                        <TableHead>Tipe</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-right">Mutasi</TableHead>
                        <TableHead className="text-right">Accurate</TableHead>
                        <TableHead>Status AI</TableHead>
                        <TableHead className="text-right pr-4">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs">
                      {filteredLogs.map((log) => {
                        const isAnomaly = log.status === "Anomaly";
                        const isDiscrepancy = log.status === "Discrepancy";
                        
                        return (
                          <TableRow
                            key={log.id}
                            className={`group hover:bg-slate-50 ${isAnomaly ? 'bg-rose-50/50' : isDiscrepancy ? 'bg-amber-50/50' : ''}`}
                          >
                            <TableCell className="font-medium text-slate-700">{log.type}</TableCell>
                            <TableCell className="text-slate-600">{log.description}</TableCell>
                            <TableCell className="text-right font-mono text-slate-700">
                              {formatCurrency(log.bankAmount)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-slate-700">
                              {formatCurrency(log.systemAmount)}
                            </TableCell>
                            <TableCell>
                              {hasAudited ? (
                                <Badge variant={isAnomaly ? "destructive" : isDiscrepancy ? "warning" : "success"}>
                                  {log.status}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-400 border-slate-200">
                                  Menunggu AI...
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right pr-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditModal(log)}
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                  title="Edit Transaksi"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteModal(log)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                  title="Hapus Transaksi"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {filteredLogs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-slate-400 text-xs">
                            Belum ada catatan transaksi keuangan.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Predictive Cashflow */}
              {hasAudited ? (
                <Card className="bg-white shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LineChartIcon className="h-5 w-5 text-indigo-600"/> Predictive Cashflow</CardTitle>
                    <CardDescription>Prediksi AI untuk 30 hari ke depan berdasarkan tren saat ini.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={cashflowData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Aktual (Juta)" />
                          <Line type="monotone" dataKey="predicted" stroke="#818cf8" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Prediksi AI (Juta)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <p className="text-sm text-indigo-900">
                        <strong>Rekomendasi AI:</strong> Arus kas diproyeksikan sangat sehat pada akhir bulan. Anda dapat mempercepat pembayaran PO ke supplier prioritas.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-slate-50 border-dashed border-2 border-slate-300">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center h-full">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Activity className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">Analisis Belum Berjalan</h3>
                    <p className="text-sm text-slate-500 max-w-[200px]">
                      Klik tombol Analisis AI Terpadu untuk memuat prediksi arus kas (Cashflow).
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-emerald-600 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Plus size={18} />
                    Tambah Transaksi Keuangan Baru
                  </h3>
                  <p className="text-emerald-100 text-xs mt-0.5">Catat pembayaran faktur atau settlement kasir.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-emerald-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitCreate} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deskripsi Transaksi</label>
                  <input
                    type="text"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="Contoh: Pembayaran Invoice INV-005"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tipe Pembayaran</label>
                    <select
                      value={formData.type || "Bank Transfer"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="QRIS">QRIS</option>
                      <option value="Gabungan">Gabungan</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nominal Mutasi Bank (IDR)</label>
                    <input
                      type="number"
                      value={formData.bankAmount || 0}
                      onChange={(e) => setFormData({ ...formData, bankAmount: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nominal Accurate (IDR)</label>
                    <input
                      type="number"
                      value={formData.systemAmount || 0}
                      onChange={(e) => setFormData({ ...formData, systemAmount: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Simpan Transaksi
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedLog && (
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
                    Edit Transaksi Keuangan
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Koreksi nominal bank mutasi atau pencatatan Accurate.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deskripsi</label>
                  <input
                    type="text"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mutasi Bank (IDR)</label>
                    <input
                      type="number"
                      value={formData.bankAmount || 0}
                      onChange={(e) => setFormData({ ...formData, bankAmount: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sistem Accurate (IDR)</label>
                    <input
                      type="number"
                      value={formData.systemAmount || 0}
                      onChange={(e) => setFormData({ ...formData, systemAmount: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
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
        {isDeleteModalOpen && selectedLog && (
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
              <h3 className="font-bold text-slate-900 text-base">Hapus Transaksi Keuangan?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Hapus catatan transaksi <strong className="text-slate-800">{selectedLog.description}</strong>?
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
    </AppLayout>
  );
}
