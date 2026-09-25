"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Plus, Search, Filter, CheckCircle2, Clock, 
  AlertTriangle, Truck, Warehouse, Edit2, Trash2, ExternalLink, 
  DollarSign, Package, Calendar, RefreshCw, X, ChevronRight,
  ShieldCheck, ArrowRight, FileText
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useOperationsStore } from "@/lib/operations-store";
import { PurchasingOrder } from "@/types/operations";

export default function PurchasingModulePage() {
  const {
    isHydrated,
    purchasingOrders,
    stockItems,
    orders,
    createPurchasingOrder,
    updatePurchasingOrder,
    receivePurchasingOrder,
    deletePurchasingOrder,
  } = useOperationsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchasingOrder | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PurchasingOrder>>({
    poNumber: "",
    relatedSpNumber: "",
    supplierName: "PT Foamindo Abadi",
    supplierPhone: "0812-8877-6655",
    itemName: "Busa Rebounded D50",
    category: "Busa",
    quantity: 10,
    unit: "Lembar",
    unitPrice: 275000,
    expectedDeliveryDate: "3 Hari Kerja",
    status: "Dipesan",
    paymentStatus: "DP 50%",
    notes: ""
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCreateModal = (preset?: Partial<PurchasingOrder>) => {
    const nextNumber = `PO-PUR-${String(purchasingOrders.length + 1).padStart(3, "0")}`;
    setFormData({
      poNumber: nextNumber,
      relatedSpNumber: "",
      supplierName: "PT Foamindo Abadi",
      supplierPhone: "0812-8877-6655",
      itemName: "Busa Rebounded D50",
      category: "Busa",
      quantity: 10,
      unit: "Lembar",
      unitPrice: 275000,
      expectedDeliveryDate: "3 Hari Kerja",
      status: "Dipesan",
      paymentStatus: "DP 50%",
      notes: "",
      ...preset
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (po: PurchasingOrder) => {
    setSelectedPO(po);
    setFormData({ ...po });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (po: PurchasingOrder) => {
    setSelectedPO(po);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.supplierName) return;
    const newPO = createPurchasingOrder(formData);
    setIsCreateModalOpen(false);
    showToast(`PO ${newPO.poNumber} berhasil diterbitkan ke ${newPO.supplierName}`);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;
    updatePurchasingOrder(selectedPO.id, formData);
    setIsEditModalOpen(false);
    showToast(`Data PO ${selectedPO.poNumber} berhasil diperbarui`);
  };

  const handleConfirmDelete = () => {
    if (!selectedPO) return;
    deletePurchasingOrder(selectedPO.id);
    setIsDeleteModalOpen(false);
    showToast(`PO ${selectedPO.poNumber} telah dibatalkan & dihapus`);
  };

  const handleReceiveItem = (po: PurchasingOrder) => {
    receivePurchasingOrder(po.id);
    showToast(`Bahan ${po.itemName} (${po.quantity} ${po.unit}) telah DITERIMA dan stok Gudang otomatis bertambah!`);
  };

  // Filtered List
  const filteredOrders = purchasingOrders.filter((po) => {
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.relatedSpNumber && po.relatedSpNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const activePOCount = purchasingOrders.filter(p => ["Dipesan", "Dalam Pengiriman"].includes(p.status)).length;
  const criticalStockItems = stockItems.filter(s => s.status === "Kritis" || s.status === "Mendekati Minimum");
  const totalProcurementValue = purchasingOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Operations Hub", href: "/operations" },
        { label: "Purchasing & Pengadaan" },
      ]}
      vacancyTitle="Lovise Sofa — Purchasing & Supply Chain Management"
    >
      <div className="p-6 md:p-8 space-y-6">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-500"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
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
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Purchasing & Procurement
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <ShoppingBag className="text-purple-600 h-8 w-8" />
              Modul Purchasing & PO Supplier
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manajemen pengadaan bahan baku sofa, Purchase Order (PO) ke vendor, lead-time supplier, dan konfirmasi kedatangan barang ke gudang.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={() => handleOpenCreateModal()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs md:text-sm h-10 px-4 shadow-sm flex items-center gap-2"
            >
              <Plus size={16} />
              + Terbitkan PO Supplier Baru
            </Button>
          </div>
        </div>

        {/* KPI Metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">PO Sedang Berjalan</p>
                <p className="text-2xl font-black text-purple-700">{activePOCount}</p>
                <p className="text-[11px] text-slate-400">Total terdaftar: {purchasingOrders.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Restock Bahan Kritis</p>
                <p className="text-2xl font-black text-amber-600">{criticalStockItems.length} Bahan</p>
                <p className="text-[11px] text-amber-700 font-medium">Perlu PO segera</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Warehouse className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Bahan Tiba di Gudang</p>
                <p className="text-2xl font-black text-blue-600">
                  {purchasingOrders.filter(p => p.status === "Tiba di Gudang").length}
                </p>
                <p className="text-[11px] text-slate-400">Tersinkron ke Inventory</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Nilai Total Pengadaan</p>
                <p className="text-lg font-black text-emerald-700 truncate">{formatIDR(totalProcurementValue)}</p>
                <p className="text-[11px] text-slate-400">Tercatat di sistem</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RESTOCK TRIGGER SECTION (AI SUPPLY CHAIN ALERT) */}
        {criticalStockItems.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Peringatan Kebutuhan Stok (Restock Trigger Gudang)
                </h3>
              </div>
              <span className="text-xs text-slate-500">Klik item untuk langsung membuat PO ke supplier</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {criticalStockItems.map((stk) => (
                <div
                  key={stk.id}
                  className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{stk.sku}</span>
                      <Badge className={stk.status === "Kritis" ? "bg-red-500 text-white text-[10px]" : "bg-amber-500 text-white text-[10px]"}>
                        {stk.status}
                      </Badge>
                    </div>
                    <p className="font-bold text-slate-800 text-sm mt-1">{stk.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sisa: <strong className="text-red-600 font-bold">{stk.currentStock} {stk.unit}</strong> (Min: {stk.minStock})
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleOpenCreateModal({
                      itemName: stk.name,
                      category: stk.category === "Bahan Baku" ? (stk.name.includes("Busa") ? "Busa" : stk.name.includes("Kain") ? "Kain" : "Kayu") : "Mebel Jadi",
                      quantity: stk.recommendedRestock || 10,
                      unit: stk.unit,
                      notes: `Auto-restock trigger kebutuhan stok minimum ${stk.sku}`
                    })}
                    className="mt-3 bg-amber-600 hover:bg-amber-700 text-white text-xs h-7 w-full flex items-center justify-center gap-1.5"
                  >
                    <Plus size={13} />
                    Buat PO ({stk.recommendedRestock || 5} {stk.unit})
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PO TABLE WITH FILTERS & SEARCH */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200/80 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Daftar Purchase Order (PO) Supplier
                </CardTitle>
                <CardDescription className="text-xs">
                  Semua transaksi pengadaan bahan baku pabrik dan pesanan mebel supplier.
                </CardDescription>
              </div>

              {/* Filters and Search Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-48 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari No PO / Supplier / Bahan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs">
                  {["All", "Dipesan", "Dalam Pengiriman", "Tiba di Gudang", "Dibatalkan"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        statusFilter === st
                          ? "bg-white text-purple-700 font-bold shadow-xs"
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
                  <TableHead className="pl-4">Nomor PO</TableHead>
                  <TableHead>Supplier & Kontak</TableHead>
                  <TableHead>Item Bahan</TableHead>
                  <TableHead>Kuantitas</TableHead>
                  <TableHead>Total Biaya</TableHead>
                  <TableHead>Estimasi Tiba</TableHead>
                  <TableHead>Status PO</TableHead>
                  <TableHead>Terkait SP</TableHead>
                  <TableHead className="text-right pr-4">Aksi CRUD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredOrders.map((po) => (
                  <TableRow key={po.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="pl-4 font-mono font-bold text-purple-700">
                      {po.poNumber}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-800">{po.supplierName}</div>
                      <div className="text-[11px] text-slate-500">{po.supplierPhone || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-800">{po.itemName}</div>
                      <Badge variant="outline" className="text-[10px] text-slate-500 mt-0.5">
                        {po.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {po.quantity} {po.unit}
                    </TableCell>
                    <TableCell className="font-mono text-slate-800 font-semibold">
                      {formatIDR(po.totalPrice || 0)}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>{po.expectedDeliveryDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === "Tiba di Gudang"
                          ? "bg-emerald-100 text-emerald-800"
                          : po.status === "Dalam Pengiriman"
                          ? "bg-blue-100 text-blue-800"
                          : po.status === "Dibatalkan"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {po.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {po.relatedSpNumber ? (
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-200">
                          {po.relatedSpNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Restock Umum</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick action: Terima Bahan di Gudang */}
                        {po.status !== "Tiba di Gudang" && po.status !== "Dibatalkan" && (
                          <Button
                            size="sm"
                            onClick={() => handleReceiveItem(po)}
                            title="Konfirmasi Terima di Gudang"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2 text-[11px] flex items-center gap-1"
                          >
                            <Warehouse size={12} />
                            Terima Gudang
                          </Button>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(po)}
                          title="Edit PO"
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* Delete / Cancel Button */}
                        <button
                          onClick={() => handleOpenDeleteModal(po)}
                          title="Hapus / Batalkan PO"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-slate-500 text-xs">
                      <ShoppingBag className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">Belum ada Purchase Order (PO)</p>
                      <p className="text-slate-400 mt-0.5">
                        Klik tombol "+ Terbitkan PO Supplier Baru" atau pilih dari Peringatan Kebutuhan Stok di atas.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* CREATE PO MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-purple-700 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <ShoppingBag size={20} />
                    Terbitkan Purchase Order (PO) Baru
                  </h3>
                  <p className="text-purple-100 text-xs mt-0.5">
                    Kirim pesanan pembelian bahan baku atau barang mebel ke vendor supplier.
                  </p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-purple-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitCreate} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor PO</label>
                    <input
                      type="text"
                      value={formData.poNumber || ""}
                      onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Terkait No SP (Opsional)</label>
                    <input
                      type="text"
                      placeholder="e.g. SP-001 (Kosongkan jika restock)"
                      value={formData.relatedSpNumber || ""}
                      onChange={(e) => setFormData({ ...formData, relatedSpNumber: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Supplier</label>
                    <input
                      type="text"
                      value={formData.supplierName || ""}
                      onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Telepon Supplier</label>
                    <input
                      type="text"
                      value={formData.supplierPhone || ""}
                      onChange={(e) => setFormData({ ...formData, supplierPhone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Item Bahan</label>
                    <input
                      type="text"
                      value={formData.itemName || ""}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                    <select
                      value={formData.category || "Busa"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Busa">Busa (Rebounded/Yellow)</option>
                      <option value="Kain">Kain & Velvet</option>
                      <option value="Kayu">Kayu Rangka (Mahoni/Kamper)</option>
                      <option value="Aksesoris & Kaki">Aksesoris & Kaki Sofa</option>
                      <option value="Mebel Jadi">Mebel Jadi (Meja/Kursi)</option>
                      <option value="Finishing & Lem">Finishing & Lem</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kuantitas</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.quantity || 1}
                      onChange={(e) => {
                        const q = Number(e.target.value);
                        setFormData({ 
                          ...formData, 
                          quantity: q, 
                          totalPrice: q * (formData.unitPrice || 0) 
                        });
                      }}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Satuan</label>
                    <input
                      type="text"
                      value={formData.unit || "Lembar"}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Harga Satuan (IDR)</label>
                    <input
                      type="number"
                      value={formData.unitPrice || 0}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        setFormData({ 
                          ...formData, 
                          unitPrice: p, 
                          totalPrice: (formData.quantity || 1) * p 
                        });
                      }}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Kedatangan (Lead Time)</label>
                    <input
                      type="text"
                      value={formData.expectedDeliveryDate || "3 Hari Kerja"}
                      onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status Pembayaran</label>
                    <select
                      value={formData.paymentStatus || "DP 50%"}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="DP 50%">DP 50%</option>
                      <option value="Lunas">Lunas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                  <textarea
                    rows={2}
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="Instruksi khusus spesifikasi bahan..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Terbitkan PO Sekarang
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT PO MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedPO && (
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
                    Edit Purchase Order ({selectedPO.poNumber})
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Perbarui rincian harga, kuantitas, atau status PO vendor.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Supplier</label>
                    <input
                      type="text"
                      value={formData.supplierName || ""}
                      onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status PO</label>
                    <select
                      value={formData.status || "Dipesan"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Dipesan">Dipesan</option>
                      <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                      <option value="Tiba di Gudang">Tiba di Gudang</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kuantitas</label>
                    <input
                      type="number"
                      value={formData.quantity || 1}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Satuan</label>
                    <input
                      type="text"
                      value={formData.unit || ""}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Harga Satuan (IDR)</label>
                    <input
                      type="number"
                      value={formData.unitPrice || 0}
                      onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Kedatangan (Lead Time)</label>
                  <input
                    type="text"
                    value={formData.expectedDeliveryDate || ""}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan</label>
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
        {isDeleteModalOpen && selectedPO && (
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
              <h3 className="font-bold text-slate-900 text-base">Hapus Purchase Order?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Apakah Anda yakin ingin membatalkan dan menghapus <strong className="text-slate-800">{selectedPO.poNumber}</strong> ({selectedPO.itemName})? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setIsDeleteModalOpen(false)}>
                  Batal
                </Button>
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs" onClick={handleConfirmDelete}>
                  Ya, Hapus PO
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
