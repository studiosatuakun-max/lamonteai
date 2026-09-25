"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Hammer, Plus, Search, Filter, CheckCircle2, Clock, 
  AlertTriangle, Warehouse, Edit2, Trash2, Check, 
  Layers, UserCheck, ShieldCheck, ChevronRight, X, ArrowRight,
  Sparkles, FileText, Activity
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useOperationsStore } from "@/lib/operations-store";
import { ProductionOrder } from "@/types/operations";

const PRODUCTION_STEPS: ProductionOrder["currentStep"][] = [
  "Potong Rangka",
  "Busa & Pegas",
  "Jahit Kain",
  "Jok & Upholstery",
  "QC & Selesai"
];

export default function ProduksiModulePage() {
  const {
    isHydrated,
    productionOrders,
    orders,
    createProductionOrder,
    updateProductionOrder,
    advanceProductionStep,
    deleteProductionOrder,
  } = useOperationsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSPK, setSelectedSPK] = useState<ProductionOrder | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ProductionOrder>>({
    spkNumber: "",
    relatedSpNumber: "",
    customerName: "",
    productName: "Sofa Chesterfield 3-Seater Velvet Emerald",
    productCategory: "Sofa Custom",
    carpenterPIC: "Pak Joko (Spesialis Rangka & Busa)",
    targetDeadline: "7 Hari Kerja",
    currentStep: "Potong Rangka",
    hasBlueprint: true,
    blueprintNotes: "Gambar kerja lengkap",
    qcStatus: "Menunggu QC",
    status: "Dalam Proses",
    notes: ""
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = () => {
    const nextNumber = `SPK-PRD-${String(productionOrders.length + 1).padStart(3, "0")}`;
    setFormData({
      spkNumber: nextNumber,
      relatedSpNumber: "",
      customerName: "",
      productName: "Sofa Modular L-Shape Scandinavian",
      productCategory: "Sofa Custom",
      carpenterPIC: "Pak Joko & Tim Busa",
      targetDeadline: "7 Hari Kerja",
      currentStep: "Potong Rangka",
      hasBlueprint: true,
      blueprintNotes: "Gambar kerja terlampir",
      qcStatus: "Menunggu QC",
      status: "Dalam Proses",
      notes: ""
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (spk: ProductionOrder) => {
    setSelectedSPK(spk);
    setFormData({ ...spk });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (spk: ProductionOrder) => {
    setSelectedSPK(spk);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.carpenterPIC) return;
    const newSPK = createProductionOrder(formData);
    setIsCreateModalOpen(false);
    showToast(`SPK ${newSPK.spkNumber} berhasil diterbitkan untuk tim pabrik!`);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSPK) return;
    updateProductionOrder(selectedSPK.id, formData);
    setIsEditModalOpen(false);
    showToast(`Data SPK ${selectedSPK.spkNumber} berhasil diperbarui`);
  };

  const handleConfirmDelete = () => {
    if (!selectedSPK) return;
    deleteProductionOrder(selectedSPK.id);
    setIsDeleteModalOpen(false);
    showToast(`SPK ${selectedSPK.spkNumber} telah dibatalkan & dihapus`);
  };

  const handleAdvanceStep = (spk: ProductionOrder) => {
    const currentIndex = PRODUCTION_STEPS.indexOf(spk.currentStep);
    if (currentIndex < PRODUCTION_STEPS.length - 1) {
      const nextStep = PRODUCTION_STEPS[currentIndex + 1];
      advanceProductionStep(spk.id, nextStep);
      showToast(`SPK ${spk.spkNumber} maju ke tahap "${nextStep}"!`);
    }
  };

  // Filtered List
  const filteredSPK = productionOrders.filter((spk) => {
    const matchesSearch = 
      spk.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spk.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spk.carpenterPIC.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spk.customerName && spk.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (spk.relatedSpNumber && spk.relatedSpNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || spk.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const inProgressCount = productionOrders.filter(p => p.status === "Dalam Proses").length;
  const qcCompletedCount = productionOrders.filter(p => p.qcStatus === "Lolos QC (Passed)").length;
  const waitingQCCount = productionOrders.filter(p => p.currentStep === "Jok & Upholstery" || p.qcStatus === "Menunggu QC").length;

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Operations Hub", href: "/operations" },
        { label: "Produksi Pabrik" },
      ]}
      vacancyTitle="Lovise Sofa — Production & Workshop Management"
    >
      <div className="p-6 md:p-8 space-y-6">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 bg-amber-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-amber-500"
            >
              <CheckCircle2 className="h-5 w-5 text-amber-200" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Divisi Operasional Lovise
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Pabrik & Workshop
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <Hammer className="text-amber-600 h-8 w-8" />
              Modul Produksi & SPK Pabrik Sofa
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Penerbitan Surat Perintah Kerja (SPK), pemantauan pengerjaan bertahap tukang (Rangka → Busa → Jahit → Jok), alokasi tim, dan Quality Control (QC).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={() => handleOpenCreateModal()}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs md:text-sm h-10 px-4 shadow-sm flex items-center gap-2"
            >
              <Plus size={16} />
              + Terbitkan SPK Produksi Baru
            </Button>
          </div>
        </div>

        {/* KPI Metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Hammer className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Dalam Pengerjaan</p>
                <p className="text-2xl font-black text-amber-700">{inProgressCount}</p>
                <p className="text-[11px] text-slate-400">Total antrean: {productionOrders.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Tahap Perakitan Jok</p>
                <p className="text-2xl font-black text-blue-600">
                  {productionOrders.filter(p => p.currentStep === "Jok & Upholstery").length}
                </p>
                <p className="text-[11px] text-slate-400">Menjelang tahap QC</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Lolos QC Pabrik</p>
                <p className="text-2xl font-black text-emerald-600">{qcCompletedCount}</p>
                <p className="text-[11px] text-emerald-700 font-medium">Siap transfer ke Gudang</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Alokasi Kepala Tukang</p>
                <p className="text-2xl font-black text-purple-700">4 Tim Aktif</p>
                <p className="text-[11px] text-slate-400">Rangka, Busa, Jahit, Jok</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WORKSHOP PROGRESS STAGES VISUAL GUIDE */}
        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Alur Standar Pabrik Sofa Lovise
              </span>
            </div>
            <span className="text-[11px] text-amber-400 font-medium">5 Tahapan Terkontrol AI</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
            {PRODUCTION_STEPS.map((step, idx) => (
              <div key={step} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-amber-400 font-bold block">TAHAP {idx + 1}</span>
                <span className="font-semibold text-slate-200">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SPK TABLE WITH FILTERS & SEARCH */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200/80 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Daftar Surat Perintah Kerja (SPK) Pabrik
                </CardTitle>
                <CardDescription className="text-xs">
                  Pantau progress pengerjaan fisik per sofa, tukang PIC, dan kontrol kualitas lolos QC.
                </CardDescription>
              </div>

              {/* Filters and Search Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-48 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari No SPK / Sofa / Tukang..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs">
                  {["All", "Dalam Proses", "Antrean", "Selesai"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        statusFilter === st
                          ? "bg-white text-amber-700 font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 text-[11px] font-semibold text-slate-500">
                  <TableHead className="pl-4">Nomor SPK</TableHead>
                  <TableHead>Konsumen & Produk Sofa</TableHead>
                  <TableHead>Tukang PIC</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Tahap Pengerjaan Tukang</TableHead>
                  <TableHead>Status QC</TableHead>
                  <TableHead>Terkait SP</TableHead>
                  <TableHead className="text-right pr-4">Aksi Produksi & CRUD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredSPK.map((spk) => {
                  const stepIdx = PRODUCTION_STEPS.indexOf(spk.currentStep);
                  const isFinished = spk.currentStep === "QC & Selesai";

                  return (
                    <TableRow key={spk.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="pl-4 font-mono font-bold text-amber-700">
                        {spk.spkNumber}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-800">{spk.productName}</div>
                        <div className="text-[11px] text-slate-500">{spk.customerName || "Stok Display"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">{spk.carpenterPIC}</div>
                        <div className="text-[10px] text-slate-400">
                          {spk.hasBlueprint ? "✓ Gambar Kerja Ada" : "⚠ Belum ada gambar"}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>{spk.targetDeadline}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800">{spk.currentStep}</span>
                            <span className="text-[10px] text-slate-500">{stepIdx + 1}/5</span>
                          </div>
                          {/* Visual Step Mini-Bar */}
                          <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                            {PRODUCTION_STEPS.map((_, i) => (
                              <div
                                key={i}
                                className={`flex-1 border-r border-white/50 ${
                                  i <= stepIdx
                                    ? isFinished ? "bg-emerald-500" : "bg-amber-500"
                                    : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          spk.qcStatus === "Lolos QC (Passed)"
                            ? "bg-emerald-100 text-emerald-800"
                            : spk.qcStatus === "Revisi Pengerjaan"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {spk.qcStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        {spk.relatedSpNumber ? (
                          <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-200">
                            {spk.relatedSpNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick action: Naikkan Tahap */}
                          {!isFinished ? (
                            <Button
                              size="sm"
                              onClick={() => handleAdvanceStep(spk)}
                              title="Naikkan ke tahap berikutnya"
                              className="bg-amber-600 hover:bg-amber-700 text-white h-7 px-2 text-[11px] flex items-center gap-1"
                            >
                              <ArrowRight size={12} />
                              Lanjut Tahap
                            </Button>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              Siap Gudang
                            </span>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(spk)}
                            title="Edit SPK"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Delete / Cancel Button */}
                          <button
                            onClick={() => handleOpenDeleteModal(spk)}
                            title="Hapus / Batalkan SPK"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredSPK.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-slate-500 text-xs">
                      <Hammer className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">Belum ada SPK Produksi</p>
                      <p className="text-slate-400 mt-0.5">
                        Klik tombol "+ Terbitkan SPK Produksi Baru" untuk memulai pengerjaan sofa custom.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* CREATE SPK MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Hammer size={20} />
                    Terbitkan SPK Produksi Baru
                  </h3>
                  <p className="text-amber-100 text-xs mt-0.5">
                    Perintah kerja bengkel/pabrik sofa custom Lovise.
                  </p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-amber-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitCreate} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor SPK</label>
                    <input
                      type="text"
                      value={formData.spkNumber || ""}
                      onChange={(e) => setFormData({ ...formData, spkNumber: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Terkait No SP (Pesanan)</label>
                    <input
                      type="text"
                      placeholder="e.g. SP-001"
                      value={formData.relatedSpNumber || ""}
                      onChange={(e) => setFormData({ ...formData, relatedSpNumber: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Pemesan / Konsumen</label>
                    <input
                      type="text"
                      value={formData.customerName || ""}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      placeholder="e.g. Bpk. Hendra Gunawan"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kategori Produk</label>
                    <select
                      value={formData.productCategory || "Sofa Custom"}
                      onChange={(e) => setFormData({ ...formData, productCategory: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Sofa Custom">Sofa Custom Pabrik</option>
                      <option value="Sofa Display Toko">Sofa Display Toko</option>
                      <option value="Reparasi / Servis">Reparasi / Servis</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Model & Nama Sofa</label>
                  <input
                    type="text"
                    value={formData.productName || ""}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="e.g. Sofa Chesterfield 3-Seater Classic Brown"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kepala Tukang / Tim PIC</label>
                    <input
                      type="text"
                      value={formData.carpenterPIC || ""}
                      onChange={(e) => setFormData({ ...formData, carpenterPIC: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      placeholder="e.g. Pak Joko (Tim Rangka & Busa)"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Selesai (Deadline)</label>
                    <input
                      type="text"
                      value={formData.targetDeadline || "7 Hari Kerja"}
                      onChange={(e) => setFormData({ ...formData, targetDeadline: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tahap Awal</label>
                    <select
                      value={formData.currentStep || "Potong Rangka"}
                      onChange={(e) => setFormData({ ...formData, currentStep: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      {PRODUCTION_STEPS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gambar Kerja Teknis</label>
                    <select
                      value={formData.hasBlueprint ? "ada" : "belum"}
                      onChange={(e) => setFormData({ ...formData, hasBlueprint: e.target.value === "ada" })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="ada">Ada / Lengkap (Siap Dikerjakan)</option>
                      <option value="belum">Belum Ada (Menyusul dari Arsitek)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan Spesifikasi Khusus</label>
                  <textarea
                    rows={2}
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="Jenis busa, warna benang, tingkat kekenyalan..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Terbitkan SPK Sekarang
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SPK MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedSPK && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Edit2 size={18} />
                    Edit SPK Produksi ({selectedSPK.spkNumber})
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Ubah deadline, ganti tukang penanggung jawab, atau revisi tahap kerja.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Produk Sofa</label>
                    <input
                      type="text"
                      value={formData.productName || ""}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tahap Pengerjaan</label>
                    <select
                      value={formData.currentStep || "Potong Rangka"}
                      onChange={(e) => setFormData({ ...formData, currentStep: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      {PRODUCTION_STEPS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tukang PIC</label>
                    <input
                      type="text"
                      value={formData.carpenterPIC || ""}
                      onChange={(e) => setFormData({ ...formData, carpenterPIC: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status QC</label>
                    <select
                      value={formData.qcStatus || "Menunggu QC"}
                      onChange={(e) => setFormData({ ...formData, qcStatus: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Menunggu QC">Menunggu QC</option>
                      <option value="Revisi Pengerjaan">Revisi Pengerjaan</option>
                      <option value="Lolos QC (Passed)">Lolos QC (Passed)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Deadline</label>
                  <input
                    type="text"
                    value={formData.targetDeadline || ""}
                    onChange={(e) => setFormData({ ...formData, targetDeadline: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan Pengerjaan</label>
                  <textarea
                    rows={2}
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
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

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedSPK && (
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
              <h3 className="font-bold text-slate-900 text-base">Hapus SPK Produksi?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Apakah Anda yakin ingin membatalkan dan menghapus <strong className="text-slate-800">{selectedSPK.spkNumber}</strong> ({selectedSPK.productName})?
              </p>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setIsDeleteModalOpen(false)}>
                  Batal
                </Button>
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs" onClick={handleConfirmDelete}>
                  Ya, Hapus SPK
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
