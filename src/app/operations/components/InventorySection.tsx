"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Warehouse, Plus, Search, Edit2, Trash2, X, AlertTriangle, 
  ArrowUpDown, CheckCircle2, Package, Sliders, Truck, ArrowRight,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useOperationsStore } from "@/lib/operations-store";
import { StockItem } from "@/types/operations";

interface InventorySectionProps {
  onNotify?: (msg: string) => void;
}

export default function InventorySection({ onNotify }: InventorySectionProps) {
  const {
    orders,
    stockItems,
    createStockItem,
    updateStockItem,
    adjustStock,
    deleteStockItem,
    releaseToDistribusi,
    recordRestockCompleted,
  } = useOperationsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<StockItem>>({
    sku: "",
    name: "",
    category: "Bahan Baku",
    currentStock: 10,
    minStock: 5,
    unit: "Lembar"
  });

  // Adjust Form State
  const [adjustDelta, setAdjustDelta] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>("Hasil Stock Opname Fisik");

  const handleOpenCreateModal = () => {
    const nextSKU = `SKU-${Date.now().toString().slice(-6)}`;
    setFormData({
      sku: nextSKU,
      name: "",
      category: "Bahan Baku",
      currentStock: 10,
      minStock: 5,
      unit: "Lembar"
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (item: StockItem) => {
    setSelectedStock(item);
    setFormData({ ...item });
    setIsEditModalOpen(true);
  };

  const handleOpenAdjustModal = (item: StockItem) => {
    setSelectedStock(item);
    setAdjustDelta(0);
    setAdjustReason("Hasil Stock Opname Fisik");
    setIsAdjustModalOpen(true);
  };

  const handleOpenDeleteModal = (item: StockItem) => {
    setSelectedStock(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const item = createStockItem(formData);
    setIsCreateModalOpen(false);
    onNotify?.(`Item stok ${item.name} (${item.sku}) berhasil ditambahkan ke inventaris`);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    updateStockItem(selectedStock.id, formData);
    setIsEditModalOpen(false);
    onNotify?.(`Data stok ${selectedStock.name} berhasil diperbarui`);
  };

  const handleSubmitAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || adjustDelta === 0) return;
    adjustStock(selectedStock.id, adjustDelta, adjustReason);
    setIsAdjustModalOpen(false);
    onNotify?.(`Stok ${selectedStock.name} disesuaikan (${adjustDelta >= 0 ? "+" : ""}${adjustDelta} ${selectedStock.unit})`);
  };

  const handleConfirmDelete = () => {
    if (!selectedStock) return;
    deleteStockItem(selectedStock.id);
    setIsDeleteModalOpen(false);
    onNotify?.(`Item stok ${selectedStock.name} telah dihapus dari sistem`);
  };

  // Filtered List
  const filteredStock = stockItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });
  // Orders waiting at Inventory stage (need allocation + release to Distribusi)
  const ordersAtInventory = orders.filter(o => o.currentStage === "Inventory");

  const handleReleaseToDistribusi = (orderId: string, spNumber: string) => {
    releaseToDistribusi(orderId);
    onNotify?.(`SP ${spNumber} berhasil dialokasikan & diteruskan ke Distribusi!`);
  };

  return (
    <div className="space-y-6">
      {/* PESANAN MENUNGGU ALOKASI GUDANG */}
      {ordersAtInventory.length > 0 && (
        <Card className="shadow-sm border-teal-200 bg-gradient-to-r from-teal-50/80 via-emerald-50/60 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                  <Package size={16} />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Pesanan Menunggu Alokasi Gudang
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Barang dari Produksi/Purchasing sudah masuk gudang. Konfirmasi alokasi & release ke Distribusi.
                  </CardDescription>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full border border-teal-200">
                {ordersAtInventory.length} pesanan
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {ordersAtInventory.map((order) => {
                const isRestock = order.sourceType === "Kebutuhan Stok";
                return (
                  <div
                    key={order.id}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isRestock ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`}>
                        {isRestock ? <Warehouse size={15} /> : <ClipboardList size={15} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-700 text-xs">{order.spNumber}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isRestock ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {order.sourceType}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {order.productType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          <span className="font-semibold">{order.customerName}</span> — {order.productName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isRestock 
                            ? "Pengadaan stok internal → catat sebagai persediaan gudang & tutup pesanan." 
                            : "Pesanan konsumen → cek kesesuaian fisik lalu teruskan ke armada distribusi."
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isRestock ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            recordRestockCompleted(order.id);
                            onNotify?.(`Pengadaan stok ${order.spNumber} (${order.productName}) berhasil dicatat sebagai persediaan gudang & SP ditutup!`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 size={13} />
                          Catat Persediaan (Selesai)
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleReleaseToDistribusi(order.id, order.spNumber)}
                          className="bg-teal-600 hover:bg-teal-700 text-white h-8 px-3 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <Truck size={13} />
                          Release ke Distribusi
                          <ArrowRight size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-b border-slate-200/80 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Warehouse size={18} className="text-emerald-600" />
                Modul Inventory — Manajemen Gudang, Bahan Baku, & Display Toko
              </CardTitle>
              <CardDescription className="text-xs">
                Katalog persediaan bahan mentah pabrik sofa, produk mebel jadi, dan sofa display toko.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => handleOpenCreateModal()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 px-3 shadow-xs flex items-center gap-1.5"
              >
                <Plus size={14} />
                + Tambah Item Stok
              </Button>

              <div className="relative w-44 md:w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari SKU / Bahan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
                {["All", "Bahan Baku", "Produk Jadi (Mebel)", "Sofa Display"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                      categoryFilter === cat
                        ? "bg-white text-emerald-700 font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat}
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
                <TableHead className="pl-4">SKU</TableHead>
                <TableHead>Nama Bahan / Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok Fisik</TableHead>
                <TableHead>Batas Safety Stock</TableHead>
                <TableHead>Status Level</TableHead>
                <TableHead>Rekomendasi Restock</TableHead>
                <TableHead className="text-right pr-4">Aksi Gudang & CRUD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredStock.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="pl-4 font-mono font-bold text-slate-600">
                    {item.sku}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] text-slate-600">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {item.currentStock} {item.unit}
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium">
                    {item.minStock} {item.unit}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === "Aman"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "Mendekati Minimum"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.recommendedRestock > 0 ? (
                      <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                        + {item.recommendedRestock} {item.unit}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Cukup</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => handleOpenAdjustModal(item)}
                        className="bg-slate-800 hover:bg-black text-white h-7 px-2 text-[11px] flex items-center gap-1"
                        title="Stock Opname (Penyesuaian Fisik)"
                      >
                        <Sliders size={12} />
                        Opname
                      </Button>

                      <button
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Data Item"
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => handleOpenDeleteModal(item)}
                        title="Hapus Item Stok"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredStock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500 text-xs">
                    <Warehouse className="h-7 w-7 text-slate-300 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-700">Tidak ada item stok ditemukan</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                    <Warehouse size={18} />
                    Tambah Item Stok Baru
                  </h3>
                  <p className="text-emerald-100 text-xs mt-0.5">Daftarkan bahan baku atau display toko ke inventaris.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-emerald-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitCreate} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU Kode Barang</label>
                  <input
                    type="text"
                    value={formData.sku || ""}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Bahan / Barang</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="e.g. Busa Yellow Super D40"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={formData.category || "Bahan Baku"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Bahan Baku">Bahan Baku (Busa, Kain, Kayu)</option>
                    <option value="Produk Jadi (Mebel)">Produk Jadi (Mebel)</option>
                    <option value="Sofa Display">Sofa Display Toko</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stok Awal</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.currentStock || 0}
                      onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Batas Minimum</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.minStock || 5}
                      onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
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
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Simpan Item Stok
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedStock && (
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
                    Edit Item Stok ({selectedStock.sku})
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Ubah nama, batas minimum, atau satuan.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Bahan / Barang</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Batas Minimum (Safety)</label>
                    <input
                      type="number"
                      value={formData.minStock || 5}
                      onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
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

      {/* STOCK OPNAME ADJUSTMENT MODAL */}
      <AnimatePresence>
        {isAdjustModalOpen && selectedStock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-slate-800 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Sliders size={16} />
                    Stock Opname Fisik
                  </h3>
                  <p className="text-slate-300 text-xs mt-0.5">{selectedStock.name}</p>
                </div>
                <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitAdjust} className="p-5 space-y-3.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <p className="text-xs text-slate-500">Stok Saat Ini di Sistem:</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {selectedStock.currentStock} {selectedStock.unit}
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Penyesuaian Qty (+ Tambah / - Kurang)
                  </label>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm font-bold text-center font-mono"
                    placeholder="Contoh: -2 atau +5"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1 text-center">
                    Hasil akhir: <strong>{Math.max(0, selectedStock.currentStock + adjustDelta)} {selectedStock.unit}</strong>
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alasan Penyesuaian</label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="e.g. Hasil hitung fisik akhir bulan, cacat bahan, dll"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsAdjustModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-slate-900 hover:bg-black text-white">
                    Konfirmasi Opname
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedStock && (
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
              <h3 className="font-bold text-slate-900 text-base">Hapus Item Stok?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Hapus <strong className="text-slate-800">{selectedStock.name}</strong> ({selectedStock.sku}) dari database gudang?
              </p>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setIsDeleteModalOpen(false)}>
                  Batal
                </Button>
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs" onClick={handleConfirmDelete}>
                  Ya, Hapus Item
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
