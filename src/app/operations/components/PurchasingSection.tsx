"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Plus, Search, Clock, Warehouse, Edit2, 
  Trash2, X, AlertTriangle, ArrowRight, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useOperationsStore } from "@/lib/operations-store";
import { PurchasingOrder } from "@/types/operations";

interface PurchasingSectionProps {
  onNotify?: (msg: string) => void;
}

export default function PurchasingSection({ onNotify }: PurchasingSectionProps) {
  const {
    purchasingOrders,
    stockItems,
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
    onNotify?.(`PO ${newPO.poNumber} berhasil diterbitkan ke ${newPO.supplierName}`);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;
    updatePurchasingOrder(selectedPO.id, formData);
    setIsEditModalOpen(false);
    onNotify?.(`Data PO ${selectedPO.poNumber} berhasil diperbarui`);
  };

  const handleConfirmDelete = () => {
    if (!selectedPO) return;
    deletePurchasingOrder(selectedPO.id);
    setIsDeleteModalOpen(false);
    onNotify?.(`PO ${selectedPO.poNumber} telah dibatalkan & dihapus`);
  };

  const handleReceiveItem = (po: PurchasingOrder) => {
    receivePurchasingOrder(po.id);
    onNotify?.(`Bahan ${po.itemName} (${po.quantity} ${po.unit}) telah DITERIMA di Gudang!`);
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

  const criticalStockItems = stockItems.filter(s => s.status === "Kritis" || s.status === "Mendekati Minimum");

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* RESTOCK TRIGGER SECTION */}
      {criticalStockItems.length > 0 && (
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-purple-600" />
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                Restock Alert Gudang — Buat PO Instan ke Supplier
              </h4>
            </div>
            <span className="text-[11px] text-purple-600 font-medium">Auto Supply Chain Alert</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {criticalStockItems.map((stk) => (
              <div
                key={stk.id}
                className="bg-white p-3 rounded-lg border border-purple-100 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{stk.sku}</span>
                  <p className="font-bold text-slate-800 text-xs truncate max-w-[170px]">{stk.name}</p>
                  <p className="text-[11px] text-red-600 font-semibold mt-0.5">Sisa: {stk.currentStock} {stk.unit}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleOpenCreateModal({
                    itemName: stk.name,
                    category: stk.category === "Bahan Baku" ? (stk.name.includes("Busa") ? "Busa" : stk.name.includes("Kain") ? "Kain" : "Kayu") : "Mebel Jadi",
                    quantity: stk.recommendedRestock || 10,
                    unit: stk.unit,
                    notes: `Restock cepat trigger gudang ${stk.sku}`
                  })}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] h-7 px-2"
                >
                  <Plus size={12} className="mr-1" />
                  + PO ({stk.recommendedRestock || 5})
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PO TABLE WITH FILTERS & SEARCH */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white border-b border-slate-200/80 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag size={18} className="text-purple-600" />
                Modul Purchasing — Purchase Order (PO) Supplier
              </CardTitle>
              <CardDescription className="text-xs">
                Menerbitkan PO bahan baku & mebel, memantau pengiriman vendor, dan mengonfirmasi barang tiba di gudang.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => handleOpenCreateModal()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-8 px-3 shadow-xs flex items-center gap-1.5"
              >
                <Plus size={14} />
                + Buat PO Baru
              </Button>

              <div className="relative w-44 md:w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari PO / Vendor / Bahan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
                {["All", "Dipesan", "Tiba di Gudang"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
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
                <TableHead>Supplier</TableHead>
                <TableHead>Bahan / Item</TableHead>
                <TableHead>Kuantitas</TableHead>
                <TableHead>Total Biaya</TableHead>
                <TableHead>Estimasi Tiba</TableHead>
                <TableHead>Status PO</TableHead>
                <TableHead>Terkait SP</TableHead>
                <TableHead className="text-right pr-4">Aksi Purchasing & CRUD</TableHead>
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
                      <span className="text-slate-400 text-[11px]">Restock Gudang</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {po.status !== "Tiba di Gudang" && po.status !== "Dibatalkan" && (
                        <Button
                          size="sm"
                          onClick={() => handleReceiveItem(po)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2 text-[11px] flex items-center gap-1"
                        >
                          <Warehouse size={12} />
                          Terima Gudang
                        </Button>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(po)}
                        title="Edit PO"
                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => handleOpenDeleteModal(po)}
                        title="Hapus / Batalkan PO"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                    <ShoppingBag className="h-7 w-7 text-slate-300 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-700">Belum ada Purchase Order (PO)</p>
                    <p className="text-slate-400 text-[11px]">
                      Klik tombol "+ Buat PO Baru" di atas untuk menambahkan PO pengadaan supplier.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <ShoppingBag size={18} />
                    Terbitkan Purchase Order (PO) Baru
                  </h3>
                  <p className="text-purple-100 text-xs mt-0.5">Form pengadaan bahan baku sofa ke vendor supplier.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-purple-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitCreate} className="p-5 space-y-3.5 text-xs">
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
                      <option value="Mebel Jadi">Mebel Jadi</option>
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
                  <label className="font-bold text-slate-700 block mb-1">Catatan</label>
                  <textarea
                    rows={2}
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="Spesifikasi / catatan pengadaan..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Terbitkan PO
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
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Edit2 size={16} />
                    Edit Purchase Order ({selectedPO.poNumber})
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Perbarui kuantitas, harga, atau status PO vendor.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-3.5 text-xs">
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
                Batalkan & hapus PO <strong className="text-slate-800">{selectedPO.poNumber}</strong> ({selectedPO.itemName})?
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
    </div>
  );
}
