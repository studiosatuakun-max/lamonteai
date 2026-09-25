"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, Plus, Search, Clock, MapPin, User, CheckCircle2, 
  Edit2, Trash2, X, Phone, Calendar, ArrowRight, ShieldCheck,
  ClipboardList, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useOperationsStore } from "@/lib/operations-store";
import { DistributionOrder, SalesOrder } from "@/types/operations";
import OrderAuditTrailModal from "./OrderAuditTrailModal";

interface DistribusiSectionProps {
  onNotify?: (msg: string) => void;
}

export default function DistribusiSection({ onNotify }: DistribusiSectionProps) {
  const {
    orders,
    distributionOrders,
    createDistributionOrder,
    updateDistributionOrder,
    completeDelivery,
    deleteDistributionOrder,
  } = useOperationsStore();

  const [selectedOrderForAudit, setSelectedOrderForAudit] = useState<SalesOrder | null>(null);

  const handleTraceSP = (spNumber?: string) => {
    if (!spNumber) return;
    const found = orders.find(o => o.spNumber.toUpperCase() === spNumber.trim().toUpperCase());
    if (found) {
      setSelectedOrderForAudit(found);
    } else {
      onNotify?.(`Pesanan dengan nomor ${spNumber} tidak ditemukan di sistem.`);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSJ, setSelectedSJ] = useState<DistributionOrder | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<DistributionOrder>>({
    sjNumber: "",
    relatedSpNumber: "",
    customerName: "",
    customerPhone: "",
    destinationAddress: "",
    region: "Dalam Kota",
    driverName: "Pak Agus",
    vehiclePlate: "Truk Box Lovise (B 9021 LOV)",
    scheduledDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    timeSlot: "Pagi (09:00 - 13:00)",
    status: "Menunggu Muat",
    notes: ""
  });

  // Completion Form State
  const [receivedByName, setReceivedByName] = useState("");
  const [receivedNotes, setReceivedNotes] = useState("Diterima dengan baik dan sesuai pesanan");

  const handleOpenCreateModal = () => {
    const nextNumber = `SJ-DIST-${String(distributionOrders.length + 1).padStart(3, "0")}`;
    setFormData({
      sjNumber: nextNumber,
      relatedSpNumber: "",
      customerName: "",
      customerPhone: "0812-3344-5566",
      destinationAddress: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
      region: "Dalam Kota",
      driverName: "Pak Agus",
      vehiclePlate: "Truk Box Lovise (B 9021 LOV)",
      scheduledDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      timeSlot: "Pagi (09:00 - 13:00)",
      status: "Menunggu Muat",
      notes: ""
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (sj: DistributionOrder) => {
    setSelectedSJ(sj);
    setFormData({ ...sj });
    setIsEditModalOpen(true);
  };

  const handleOpenCompleteModal = (sj: DistributionOrder) => {
    setSelectedSJ(sj);
    setReceivedByName(sj.customerName);
    setReceivedNotes("Sofa diterima dalam kondisi mulus & tanda tangan serah terima lengkap.");
    setIsCompleteModalOpen(true);
  };

  const handleOpenDeleteModal = (sj: DistributionOrder) => {
    setSelectedSJ(sj);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.destinationAddress) return;
    const newSJ = createDistributionOrder(formData);
    setIsCreateModalOpen(false);
    onNotify?.(`Surat Jalan ${newSJ.sjNumber} berhasil dibuat untuk supir ${newSJ.driverName}!`);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSJ) return;
    updateDistributionOrder(selectedSJ.id, formData);
    setIsEditModalOpen(false);
    onNotify?.(`Data Surat Jalan ${selectedSJ.sjNumber} berhasil diperbarui`);
  };

  const handleSubmitComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSJ) return;
    completeDelivery(selectedSJ.id, receivedByName, receivedNotes);
    setIsCompleteModalOpen(false);
    onNotify?.(`Pengiriman ${selectedSJ.sjNumber} SELESAI! Diterima oleh ${receivedByName}.`);
  };

  const handleConfirmDelete = () => {
    if (!selectedSJ) return;
    deleteDistributionOrder(selectedSJ.id);
    setIsDeleteModalOpen(false);
    onNotify?.(`Surat Jalan ${selectedSJ.sjNumber} telah dibatalkan & dihapus`);
  };

  // Filtered List
  const filteredOrders = distributionOrders.filter((sj) => {
    const matchesSearch = 
      sj.sjNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sj.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sj.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sj.destinationAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sj.relatedSpNumber && sj.relatedSpNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || sj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Orders at Distribusi stage that don't have a SJ yet
  const ordersReadyToShip = orders.filter(o => 
    o.currentStage === "Distribusi" && 
    !distributionOrders.find(d => d.relatedSpNumber === o.spNumber)
  );

  const handleQuickCreateSJ = (order: typeof orders[0]) => {
    const nextNumber = `SJ-DIST-${String(distributionOrders.length + 1).padStart(3, "0")}`;
    const newSJ = createDistributionOrder({
      sjNumber: nextNumber,
      relatedSpNumber: order.spNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone || "0812-0000-0000",
      destinationAddress: order.address || "Jakarta",
      region: order.region || "Dalam Kota",
      driverName: "Pak Agus",
      vehiclePlate: "Truk Box Lovise (B 9021 LOV)",
      scheduledDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      timeSlot: order.region === "Luar Kota" ? "Khusus Luar Kota" : "Pagi (09:00 - 13:00)",
      status: "Menunggu Muat",
      notes: `Auto-generated dari SP ${order.spNumber}`
    });
    onNotify?.(`Surat Jalan ${newSJ.sjNumber} otomatis dibuat untuk SP ${order.spNumber}!`);
  };

  return (
    <div className="space-y-6">
      {/* PESANAN SIAP KIRIM DARI GUDANG */}
      {ordersReadyToShip.length > 0 && (
        <Card className="shadow-sm border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Package size={16} />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Pesanan Siap Kirim dari Gudang
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Inventory sudah release barang. Buat Surat Jalan untuk plotting pengiriman.
                  </CardDescription>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                {ordersReadyToShip.length} pesanan
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {ordersReadyToShip.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <ClipboardList size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-700 text-xs">{order.spNumber}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {order.region}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        <span className="font-semibold">{order.customerName}</span> — {order.productName}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {order.address || "Alamat belum diisi"}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleQuickCreateSJ(order)}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Truck size={13} />
                    Buat Surat Jalan
                    <ArrowRight size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border-b border-slate-200/80 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck size={18} className="text-blue-600" />
                Modul Distribusi — Surat Jalan & Pengiriman Konsumen
              </CardTitle>
              <CardDescription className="text-xs">
                Jadwal armada truk, penugasan supir, rute pengiriman Jabodetabek & Luar Kota, serta tanda terima konsumen.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => handleOpenCreateModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-8 px-3 shadow-xs flex items-center gap-1.5"
              >
                <Plus size={14} />
                + Buat Surat Jalan Baru
              </Button>

              <div className="relative w-44 md:w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari SJ / Konsumen / Supir..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
                {["All", "Menunggu Muat", "Sedang Di Jalan", "Terkirim"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                      statusFilter === st
                        ? "bg-white text-blue-700 font-bold shadow-xs"
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
                <TableHead className="pl-4">Nomor SJ</TableHead>
                <TableHead>Konsumen & Kontak</TableHead>
                <TableHead>Alamat Tujuan</TableHead>
                <TableHead>Armada & Supir</TableHead>
                <TableHead>Jadwal Kirim</TableHead>
                <TableHead>Status Pengiriman</TableHead>
                <TableHead>Terkait SP</TableHead>
                <TableHead className="text-right pr-4">Aksi Logistik & CRUD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredOrders.map((sj) => (
                <TableRow key={sj.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="pl-4 font-mono font-bold text-blue-700">
                    {sj.sjNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-800">{sj.customerName}</div>
                    <div className="text-[11px] text-slate-500">{sj.customerPhone || "-"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-700 text-xs max-w-xs truncate" title={sj.destinationAddress}>
                      {sj.destinationAddress}
                    </div>
                    <Badge variant="outline" className="text-[10px] text-slate-500 mt-0.5">
                      {sj.region}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-800">{sj.driverName}</div>
                    <div className="text-[11px] text-slate-500">{sj.vehiclePlate}</div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="font-medium text-slate-700">{sj.scheduledDate}</div>
                    <div className="text-[10px] text-slate-400">{sj.timeSlot}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sj.status === "Terkirim"
                        ? "bg-emerald-100 text-emerald-800"
                        : sj.status === "Sedang Di Jalan"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {sj.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {sj.relatedSpNumber ? (
                      <button
                        type="button"
                        onClick={() => handleTraceSP(sj.relatedSpNumber)}
                        title="Klik untuk melihat Audit Trail lengkap SP ini"
                        className="font-mono font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 px-2 py-0.5 rounded text-[11px] border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>🔍</span>
                        <span>{sj.relatedSpNumber}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {sj.status !== "Terkirim" && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenCompleteModal(sj)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2 text-[11px] flex items-center gap-1"
                        >
                          <CheckCircle2 size={12} />
                          Terkirim
                        </Button>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(sj)}
                        title="Edit Surat Jalan"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => handleOpenDeleteModal(sj)}
                        title="Hapus / Batalkan SJ"
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
                    <Truck className="h-7 w-7 text-slate-300 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-700">Belum ada Surat Jalan (SJ)</p>
                    <p className="text-slate-400 text-[11px]">
                      Klik tombol "+ Buat Surat Jalan Baru" untuk menjadwalkan pengiriman sofa ke konsumen.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CREATE SJ MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-blue-600 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Truck size={18} />
                    Buat Surat Jalan (SJ) Pengiriman Baru
                  </h3>
                  <p className="text-blue-100 text-xs mt-0.5">Penjadwalan pengiriman armada sofa ke alamat konsumen.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-blue-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitCreate} className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor Surat Jalan</label>
                    <input
                      type="text"
                      value={formData.sjNumber || ""}
                      onChange={(e) => setFormData({ ...formData, sjNumber: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Terkait No SP Konsumen</label>
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
                    <label className="font-bold text-slate-700 block mb-1">Nama Konsumen / Penerima</label>
                    <input
                      type="text"
                      value={formData.customerName || ""}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Telepon Penerima</label>
                    <input
                      type="text"
                      value={formData.customerPhone || ""}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alamat Tujuan Pengiriman</label>
                  <textarea
                    rows={2}
                    value={formData.destinationAddress || ""}
                    onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="Alamat lengkap, nomor rumah, patokan..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Supir PIC</label>
                    <input
                      type="text"
                      value={formData.driverName || "Pak Agus"}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Armada Truk / Mobil</label>
                    <input
                      type="text"
                      value={formData.vehiclePlate || "Truk Box Lovise (B 9021 LOV)"}
                      onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tanggal Pengiriman</label>
                    <input
                      type="text"
                      value={formData.scheduledDate || ""}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Slot Waktu</label>
                    <select
                      value={formData.timeSlot || "Pagi (09:00 - 13:00)"}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Pagi (09:00 - 13:00)">Pagi (09:00 - 13:00)</option>
                      <option value="Sore (14:00 - 18:00)">Sore (14:00 - 18:00)</option>
                      <option value="Khusus Luar Kota">Khusus Luar Kota</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Terbitkan Surat Jalan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SJ MODAL */}
      <AnimatePresence>
        {isEditModalOpen && selectedSJ && (
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
                    Edit Surat Jalan ({selectedSJ.sjNumber})
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Ubah supir, jadwal tanggal pengiriman, atau alamat kirim.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Supir</label>
                    <input
                      type="text"
                      value={formData.driverName || ""}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status Pengiriman</label>
                    <select
                      value={formData.status || "Menunggu Muat"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    >
                      <option value="Menunggu Muat">Menunggu Muat</option>
                      <option value="Sedang Di Jalan">Sedang Di Jalan</option>
                      <option value="Terkirim">Terkirim</option>
                      <option value="Reschedule">Reschedule</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alamat Tujuan</label>
                  <textarea
                    rows={2}
                    value={formData.destinationAddress || ""}
                    onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tanggal Jadwal</label>
                    <input
                      type="text"
                      value={formData.scheduledDate || ""}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Slot Waktu</label>
                    <input
                      type="text"
                      value={formData.timeSlot || ""}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as any })}
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

      {/* COMPLETE DELIVERY MODAL */}
      <AnimatePresence>
        {isCompleteModalOpen && selectedSJ && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-emerald-600 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Konfirmasi Diterima Konsumen
                  </h3>
                  <p className="text-emerald-100 text-xs mt-0.5">{selectedSJ.sjNumber}</p>
                </div>
                <button onClick={() => setIsCompleteModalOpen(false)} className="text-emerald-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitComplete} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    value={receivedByName}
                    onChange={(e) => setReceivedByName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catatan Serah Terima</label>
                  <textarea
                    rows={2}
                    value={receivedNotes}
                    onChange={(e) => setReceivedNotes(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsCompleteModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Konfirmasi Selesai Kirim
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedSJ && (
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
              <h3 className="font-bold text-slate-900 text-base">Hapus Surat Jalan?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Batalkan & hapus <strong className="text-slate-800">{selectedSJ.sjNumber}</strong> untuk {selectedSJ.customerName}?
              </p>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setIsDeleteModalOpen(false)}>
                  Batal
                </Button>
                <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs" onClick={handleConfirmDelete}>
                  Ya, Hapus SJ
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
