"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, Plus, Search, Sparkles, Clock, MapPin, 
  Phone, User, CheckCircle2, AlertTriangle, Eye, Edit2, 
  Trash2, X, FileText, ArrowRight, ShieldCheck, Check,
  Camera, Upload, ImageIcon, Warehouse, ShoppingBag, Hammer,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useOperationsStore } from "@/lib/operations-store";
import AISmartOrderParserModal from "./AISmartOrderParserModal";
import OrderAuditTrailModal from "./OrderAuditTrailModal";

interface TokoSectionProps {
  onNotify?: (msg: string) => void;
  onNavigateTab?: (tab: "sales" | "purchasing" | "produksi" | "inventory" | "distribusi" | "digest") => void;
}

export default function TokoSection({ onNotify, onNavigateTab }: TokoSectionProps) {
  const {
    orders,
    stockItems,
    createOrder,
    updateOrder,
    deleteOrder,
    advanceOrderFromToko,
  } = useOperationsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  // Form State
  const [formSourceType, setFormSourceType] = useState<"Pesanan Konsumen" | "Kebutuhan Stok">("Pesanan Konsumen");
  const [newOrder, setNewOrder] = useState<CreateOrderPayload>({
    sourceType: "Pesanan Konsumen",
    customerName: "",
    customerPhone: "",
    address: "",
    productName: "",
    productType: "PO Sofa",
    region: "Dalam Kota",
    requestDate: "",
    hasBlueprint: true,
    notes: ""
  });

  // Modals state
  const [isAiParserOpen, setIsAiParserOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<SalesOrder>>({});
  const [timelineOrder, setTimelineOrder] = useState<SalesOrder | null>(null);

  const handleOpenEditModal = (order: SalesOrder) => {
    setSelectedOrder(order);
    setEditFormData({ ...order });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (order: SalesOrder) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.productName) return;

    const created = createOrder({
      ...newOrder,
      sourceType: formSourceType,
      customerName: formSourceType === "Kebutuhan Stok" ? "Internal Restock Gudang" : (newOrder.customerName || "Konsumen Lovise")
    });

    // Reset form
    setNewOrder({
      sourceType: "Pesanan Konsumen",
      customerName: "",
      customerPhone: "",
      address: "",
      productName: "",
      productType: "PO Sofa",
      region: "Dalam Kota",
      requestDate: "",
      hasBlueprint: true,
      notes: ""
    });

    onNotify?.(`Pesanan ${created.spNumber} (${created.productName}) berhasil diterbitkan!`);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrder(selectedOrder.id, editFormData);
    setIsEditModalOpen(false);
    onNotify?.(`Data pesanan ${selectedOrder.spNumber} berhasil diperbarui`);
  };

  const handleConfirmDelete = () => {
    if (!selectedOrder) return;
    deleteOrder(selectedOrder.id);
    setIsDeleteModalOpen(false);
    onNotify?.(`Pesanan ${selectedOrder.spNumber} telah dihapus dari sistem`);
  };

  const handleAdvanceStage = (order: SalesOrder) => {
    if (order.currentStage === "Kepala Toko") {
      const nextStage = advanceOrderFromToko(order.id);
      if (nextStage) {
        onNotify?.(`Pesanan ${order.spNumber} diklasifikasi sebagai "${order.productType}" → diteruskan ke divisi ${nextStage}!`);
      }
    }
  };

  const handleApplyAiExtraction = (data: Partial<CreateOrderPayload>, imageUri?: string) => {
    setFormSourceType("Pesanan Konsumen");
    setNewOrder(prev => ({
      ...prev,
      ...data,
      customerName: data.customerName || prev.customerName,
      customerPhone: data.customerPhone || prev.customerPhone,
      address: data.address || prev.address,
      productName: data.productName || prev.productName,
      productType: data.productType || prev.productType,
      region: data.region || prev.region,
      requestDate: data.requestDate || prev.requestDate,
      hasBlueprint: data.hasBlueprint !== undefined ? data.hasBlueprint : prev.hasBlueprint,
      notes: data.notes || prev.notes,
      sourceImage: imageUri || prev.sourceImage
    }));
    onNotify?.("Formulir berhasil terisi otomatis oleh AI Vision!");
  };

  // Filtered List
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.spNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || o.productType === filterType;
    return matchesSearch && matchesType;
  });

  const criticalStockItems = stockItems.filter(s => s.status === "Kritis" || s.status === "Mendekati Minimum");

  return (
    <div className="space-y-6">
      {/* RESTOCK TRIGGER CARDS */}
      {criticalStockItems.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Pemicu Restock Gudang (Klik untuk Auto-Fill Pesanan)
              </h4>
            </div>
            <span className="text-[11px] text-amber-700 font-medium">Bahan Mendekati Batas Aman</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {criticalStockItems.map((stk) => (
              <div
                key={stk.id}
                onClick={() => {
                  setFormSourceType("Kebutuhan Stok");
                  setNewOrder({
                    sourceType: "Kebutuhan Stok",
                    customerName: "Internal Restock Gudang Lovise",
                    productName: stk.name,
                    productType: stk.category === "Bahan Baku" ? "PO Sofa" : "PO Produk Mebel",
                    region: "Dalam Kota",
                    requestDate: "Segera",
                    notes: `Restock kebutuhan stok ${stk.sku} (Sisa ${stk.currentStock} ${stk.unit})`
                  });
                  onNotify?.(`Form terisi untuk restock: ${stk.name}`);
                }}
                className="bg-white p-3 rounded-lg border border-amber-200 hover:border-amber-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{stk.sku}</span>
                  <p className="font-bold text-slate-800 text-xs truncate max-w-[170px]">{stk.name}</p>
                  <p className="text-[11px] text-red-600 font-semibold mt-0.5">Sisa: {stk.currentStock} {stk.unit}</p>
                </div>
                <Button size="sm" variant="outline" className="text-[11px] h-7 border-amber-300 text-amber-800 hover:bg-amber-100">
                  Pilih Restock
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORM INPUT PESANAN (CREATE) */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-white border-b border-slate-200/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList size={18} className="text-indigo-600" />
                Penerbitan Surat Pesanan (SP) Konsumen & Restock
              </CardTitle>
              <CardDescription className="text-xs">
                Pilih jalur input: Manual formulir toko atau Gunakan AI Multimodal Parser (Kamera HP / Upload / WA).
              </CardDescription>
            </div>

            <Button
              type="button"
              onClick={() => setIsAiParserOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs h-9 px-3.5 shadow-sm flex items-center gap-2 shrink-0"
            >
              <Sparkles size={15} className="text-amber-300" />
              AI Smart Order Parser (Upload / Kamera)
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <form onSubmit={handleSubmitNewOrder} className="space-y-4 text-xs">
            {/* Source Type Selector */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <span className="font-bold text-slate-700">Tipe Pemicu:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="sourceType"
                  checked={formSourceType === "Pesanan Konsumen"}
                  onChange={() => setFormSourceType("Pesanan Konsumen")}
                  className="text-indigo-600"
                />
                <span className="font-medium text-slate-800">Pesanan Konsumen (Toko/Online)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="sourceType"
                  checked={formSourceType === "Kebutuhan Stok"}
                  onChange={() => setFormSourceType("Kebutuhan Stok")}
                  className="text-indigo-600"
                />
                <span className="font-medium text-slate-800">Kebutuhan Stok (Restock Internal)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {formSourceType === "Pesanan Konsumen" ? "Nama Konsumen" : "Penanggung Jawab Stok"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ibu Dian Permata Sari"
                  value={newOrder.customerName || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required={formSourceType === "Pesanan Konsumen"}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  placeholder="e.g. 081288991122"
                  value={newOrder.customerPhone || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Kirim</label>
                <input
                  type="text"
                  placeholder="Alamat lengkap tujuan..."
                  value={newOrder.address || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Produk / Model Sofa</label>
                <input
                  type="text"
                  placeholder="e.g. Sofa Modular L-Shape Emerald"
                  value={newOrder.productName || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, productName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {formSourceType === "Kebutuhan Stok" ? "Jenis Pemenuhan Stok" : "Kategori Alur Pesanan"}
                </label>
                <select
                  value={newOrder.productType}
                  onChange={(e) => setNewOrder({ ...newOrder, productType: e.target.value as any })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  {formSourceType === "Kebutuhan Stok" ? (
                    <>
                      <option value="PO Sofa">Produksi Internal (Pabrik Lovise)</option>
                      <option value="PO Produk Mebel">Pembelian ke Supplier (Purchasing)</option>
                    </>
                  ) : (
                    <>
                      <option value="PO Sofa">PO Sofa Custom (Pabrik Lovise)</option>
                      <option value="Ready Stock">Ready Stock (Langsung Kirim Gudang)</option>
                      <option value="PO Produk Mebel">PO Produk Mebel (Supplier Eksternal)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Wilayah Distribusi</label>
                <select
                  value={newOrder.region}
                  onChange={(e) => setNewOrder({ ...newOrder, region: e.target.value as any })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="Dalam Kota">Dalam Kota (Jabodetabek)</option>
                  <option value="Luar Kota">Luar Kota (Ekspedisi Khusus)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-600" />
                  Permintaan Tanggal Kirim
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={newOrder.requestDate || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, requestDate: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white text-xs cursor-pointer focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {newOrder.requestDate 
                    ? `📅 Target: ${new Date(newOrder.requestDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` 
                    : "Pilih tanggal dari kalender, atau kosongkan jika tidak ada permintaan khusus."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Gambar Kerja Teknis (Blueprint)
                </label>
                {newOrder.productType === "Ready Stock" ? (
                  <div className="border border-emerald-200 bg-emerald-50/70 rounded-lg p-2.5 text-xs text-emerald-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Tidak Diperlukan (Barang Jadi)</span>
                      <span className="text-[11px] text-emerald-700">Barang ready di gudang, langsung dialokasikan tanpa gambar kerja.</span>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold shrink-0">
                      ✓ Ready Stock
                    </span>
                  </div>
                ) : newOrder.productType === "PO Produk Mebel" ? (
                  <div className="border border-purple-200 bg-purple-50/70 rounded-lg p-2.5 text-xs text-purple-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Katalog Supplier (Mebel Jadi)</span>
                      <span className="text-[11px] text-purple-700">Pengadaan barang jadi langsung dipesan ke supplier eksternal.</span>
                    </div>
                    <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold shrink-0">
                      ✓ Vendor PO
                    </span>
                  </div>
                ) : formSourceType === "Kebutuhan Stok" ? (
                  <div className="border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-xs text-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Standar Model Pabrik</span>
                      <span className="text-[11px] text-slate-500">Produksi rutin stok display gudang menggunakan spesifikasi standar.</span>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold shrink-0">
                      ✓ Standar
                    </span>
                  </div>
                ) : (
                  <>
                    <select
                      value={newOrder.hasBlueprint ? "ada" : "belum"}
                      onChange={(e) => setNewOrder({ ...newOrder, hasBlueprint: e.target.value === "ada" })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="ada">Ada / Lengkap (Siap Dikerjakan Pabrik)</option>
                      <option value="belum">Belum Ada (Menyusul dari Arsitek/Konsumen)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Wajib ada gambar kerja arsitek/spesifikasi sebelum mandor pabrik memotong rangka sofa.
                    </p>
                  </>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  placeholder="Spesifikasi warna, busa kenyal, dsb..."
                  value={newOrder.notes || ""}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            {/* Document Preview Badge if attached from AI Vision */}
            {newOrder.sourceImage && (
              <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                <span className="text-xs text-indigo-900 font-semibold flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-indigo-600" /> Dokumen Nota / Screenshot Terlampir dari AI Vision
                </span>
                <button
                  type="button"
                  onClick={() => setNewOrder({ ...newOrder, sourceImage: undefined })}
                  className="text-xs text-red-600 hover:underline"
                >
                  Hapus Lampiran
                </button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6">
                Terbitkan Surat Pesanan (SP)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ORDERS TABLE (READ, UPDATE, DELETE, TIMELINE) */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200/80 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Daftar Pesanan Masuk (Single SP Identity)
              </CardTitle>
              <CardDescription className="text-xs">
                Satu nomor identitas terhubung ke seluruh divisi operasional Lovise Sofa.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-44 md:w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari SP / Konsumen / Sofa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
                {["All", "PO Sofa", "Ready Stock", "PO Produk Mebel"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                      filterType === t
                        ? "bg-white text-indigo-700 font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t}
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
                <TableHead className="pl-4">Nomor SP</TableHead>
                <TableHead>Konsumen</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Alur Pesanan</TableHead>
                <TableHead>Posisi Divisi</TableHead>
                <TableHead>Gambar Kerja</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Aksi Toko & CRUD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="pl-4 font-mono font-bold text-indigo-700">
                    {order.spNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-800">{order.customerName}</div>
                    <div className="text-[11px] text-slate-500">{order.customerPhone || "-"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-800">{order.productName}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span>{order.region}</span>
                      {order.requestDate && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 font-medium flex items-center gap-0.5" title="Permintaan Tanggal Kirim">
                            <Calendar size={10} />
                            {order.requestDate.includes("-") 
                              ? new Date(order.requestDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" }) 
                              : order.requestDate}
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] text-slate-600">
                      {order.productType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-200">
                      {order.currentStage}
                    </span>
                  </TableCell>
                  <TableCell>
                    {order.productType === "Ready Stock" ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        — Ready Stock
                      </span>
                    ) : order.productType === "PO Produk Mebel" ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        — Supplier
                      </span>
                    ) : order.sourceType === "Kebutuhan Stok" ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        ✓ Standar
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        order.hasBlueprint 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {order.hasBlueprint ? "✓ Ada" : "⚠ Belum"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === "Selesai" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Advance Stage button */}
                      {order.currentStage === "Kepala Toko" && (
                        <Button
                          size="sm"
                          onClick={() => handleAdvanceStage(order)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white h-7 px-2 text-[11px] flex items-center gap-1"
                        >
                          <ArrowRight size={12} />
                          Teruskan
                        </Button>
                      )}

                      {/* Detail & Timeline */}
                      <button
                        onClick={() => setTimelineOrder(order)}
                        title="Lihat Timeline Perjalanan Pesanan"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye size={13} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(order)}
                        title="Edit Pesanan"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleOpenDeleteModal(order)}
                        title="Hapus Pesanan"
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
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500 text-xs">
                    <ClipboardList className="h-7 w-7 text-slate-300 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-700">Belum ada pesanan aktif</p>
                    <p className="text-slate-400 text-[11px]">
                      Gunakan formulir di atas atau klik AI Smart Order Parser untuk memasukkan pesanan baru.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI PARSER MODAL */}
      <AISmartOrderParserModal
        isOpen={isAiParserOpen}
        onClose={() => setIsAiParserOpen(false)}
        onExtracted={handleApplyAiExtraction}
      />

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedOrder && (
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
                    Edit Pesanan Konsumen ({selectedOrder.spNumber})
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Koreksi data pemesan, alamat kirim, atau catatan teknis.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Konsumen</label>
                    <input
                      type="text"
                      value={editFormData.customerName || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor Telepon</label>
                    <input
                      type="text"
                      value={editFormData.customerPhone || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, customerPhone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Produk / Model Sofa</label>
                  <input
                    type="text"
                    value={editFormData.productName || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alamat Kirim</label>
                  <textarea
                    rows={2}
                    value={editFormData.address || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Posisi Divisi</label>
                    <select
                      value={editFormData.currentStage || "Kepala Toko"}
                      onChange={(e) => setEditFormData({ ...editFormData, currentStage: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Kepala Toko">Kepala Toko</option>
                      <option value="Purchasing">Purchasing</option>
                      <option value="Produksi">Produksi</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Distribusi">Distribusi</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status</label>
                    <select
                      value={editFormData.status || "Diproses"}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Calendar size={12} className="text-indigo-600" />
                      Permintaan Tanggal Kirim
                    </label>
                    <input
                      type="date"
                      value={editFormData.requestDate || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, requestDate: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gambar Kerja (Blueprint)</label>
                    {editFormData.productType === "Ready Stock" ? (
                      <div className="p-2 border border-emerald-200 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium">
                        ✓ Tidak Diperlukan (Ready Stock)
                      </div>
                    ) : editFormData.productType === "PO Produk Mebel" ? (
                      <div className="p-2 border border-purple-200 rounded-lg bg-purple-50 text-purple-800 text-[11px] font-medium">
                        ✓ Katalog Supplier
                      </div>
                    ) : (
                      <select
                        value={editFormData.hasBlueprint ? "ada" : "belum"}
                        onChange={(e) => setEditFormData({ ...editFormData, hasBlueprint: e.target.value === "ada" })}
                        className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                      >
                        <option value="ada">Ada / Lengkap (Pabrik)</option>
                        <option value="belum">Belum Ada (Menyusul)</option>
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan</label>
                  <input
                    type="text"
                    value={editFormData.notes || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
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

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedOrder && (
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
              <h3 className="font-bold text-slate-900 text-base">Hapus Pesanan Konsumen?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Hapus <strong className="text-slate-800">{selectedOrder.spNumber}</strong> ({selectedOrder.productName}) untuk {selectedOrder.customerName}?
              </p>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setIsDeleteModalOpen(false)}>
                  Batal
                </Button>
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs" onClick={handleConfirmDelete}>
                  Ya, Hapus Pesanan
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TIMELINE AUDIT TRAIL MODAL */}
      <OrderAuditTrailModal
        order={timelineOrder}
        onClose={() => setTimelineOrder(null)}
      />
    </div>
  );
}
