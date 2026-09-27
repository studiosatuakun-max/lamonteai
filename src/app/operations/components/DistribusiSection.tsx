"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, Plus, Search, Clock, MapPin, User, CheckCircle2, 
  Edit2, Trash2, X, Phone, Calendar, ArrowRight, ShieldCheck,
  ClipboardList, Package, MessageSquare, Send, Wrench, PackageCheck, AlertTriangle
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
    updateAssemblyPacking,
    markWaSentToGS,
    markWaSentToCustomer,
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

  // Rakit (GS) & Packing Modal State
  const [isAssemblyModalOpen, setIsAssemblyModalOpen] = useState(false);
  const [selectedDistributionForAssembly, setSelectedDistributionForAssembly] = useState<DistributionOrder | null>(null);
  const [assemblyForm, setAssemblyForm] = useState<{
    assemblyPIC: string;
    assemblyDurationMinutes: number;
    assemblyStatus: "Belum Dirakit" | "Sedang Dirakit" | "Selesai Rakit";
    packingPIC: string;
    packingDurationMinutes: number;
    packingStatus: "Belum Dipacking" | "Sedang Dipacking" | "Selesai Packing";
    shippingType: "Internal" | "Eksternal";
    expeditionName: string;
    trackingNumber: string;
  }>({
    assemblyPIC: "Bambang & Tim GS",
    assemblyDurationMinutes: 45,
    assemblyStatus: "Sedang Dirakit",
    packingPIC: "Dedi (Packing Gudang)",
    packingDurationMinutes: 30,
    packingStatus: "Sedang Dipacking",
    shippingType: "Internal",
    expeditionName: "",
    trackingNumber: ""
  });

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

  const handleOpenAssemblyModal = (sj: DistributionOrder) => {
    setSelectedDistributionForAssembly(sj);
    setAssemblyForm({
      assemblyPIC: sj.assemblyPIC || "Bambang & Rahmat (Tim GS)",
      assemblyDurationMinutes: sj.assemblyDurationMinutes || 45,
      assemblyStatus: sj.assemblyStatus || "Sedang Dirakit",
      packingPIC: sj.packingPIC || "Dedi (Packing Gudang)",
      packingDurationMinutes: sj.packingDurationMinutes || 30,
      packingStatus: sj.packingStatus || "Sedang Dipacking",
      shippingType: sj.shippingType || "Internal",
      expeditionName: sj.expeditionName || "",
      trackingNumber: sj.trackingNumber || ""
    });
    setIsAssemblyModalOpen(true);
  };

  const handleSaveAssemblyPacking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDistributionForAssembly) return;

    updateAssemblyPacking(selectedDistributionForAssembly.id, assemblyForm);
    setIsAssemblyModalOpen(false);
    onNotify?.(`Data perakitan (Tim GS) & packing untuk ${selectedDistributionForAssembly.sjNumber} berhasil dicatat!`);
  };

  const handleSendWaToGS = (dist: DistributionOrder) => {
    const spNumber = dist.relatedSpNumber;
    const phone = "6281234567890";
    const msg = `Halo Tim GS (General Services) Lovise Sofa,%0A%0ABerikut jadwal perakitan sofa besok pagi:%0A• No SP: ${spNumber}%0A• Konsumen: ${dist.customerName}%0A• Alamat: ${dist.destinationAddress}%0A• Jadwal Kirim: ${dist.scheduledDate} (${dist.timeSlot})%0A• Armada/Driver: ${dist.driverName} (${dist.vehiclePlate})%0A%0AMohon persiapkan toolkit dan perlengkapan rakit tepat waktu. Terima kasih!`;
    
    markWaSentToGS(dist.id);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    onNotify?.(`Pesan WhatsApp jadwal perakitan telah dikirimkan ke Tim GS untuk SP ${spNumber}!`);
  };

  const handleSendWaToCustomer = (dist: DistributionOrder) => {
    let cleanPhone = (dist.customerPhone || "").replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    if (!cleanPhone) cleanPhone = "6281299998888";

    const msg = `Halo Bpk/Ibu ${dist.customerName},%0A%0APesanan sofa Anda (SP ${dist.relatedSpNumber}) telah lolos QC dan dijadwalkan untuk dikirim pada:%0A📅 Hari/Tanggal: ${dist.scheduledDate}%0A⏰ Waktu: ${dist.timeSlot}%0A🚚 Pengiriman: ${dist.shippingType === "Eksternal" ? (dist.expeditionName || "Ekspedisi Cargo") : "Armada Internal Lovise (" + dist.driverName + ")"}%0A📍 Alamat Tujuan: ${dist.destinationAddress}%0A%0APetugas kami akan menghubungi Anda saat armada bergerak. Terima kasih telah memilih Lovise Sofa!`;

    markWaSentToCustomer(dist.id);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    onNotify?.(`Pemberitahuan jadwal kirim berhasil dikirimkan via WhatsApp ke konsumen ${dist.customerName}!`);
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

  // Orders needing Rakit (GS) & Packing
  const ordersNeedingAssemblyPacking = distributionOrders.filter(d => 
    d.status !== "Terkirim" && (
      !d.assemblyStatus || d.assemblyStatus !== "Selesai Rakit" ||
      !d.packingStatus || d.packingStatus !== "Selesai Packing"
    )
  );

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
      {/* WARNING OTOMATIS: RAKIT (TIM GS) & PACKING */}
      {ordersNeedingAssemblyPacking.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/50 to-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500 text-white rounded-lg">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                  Peringatan Otomatis: Proses Rakit (Tim GS) & Packing Diperlukan
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    {ordersNeedingAssemblyPacking.length} Pesanan Menunggu
                  </span>
                </h4>
                <p className="text-[11px] text-slate-600">
                  Pesanan telah lolos QC dan jadwal pengiriman sudah diplot. Wajib diselesaikan oleh Petugas Rakit (Tim GS) & Petugas Packing sebelum armada muat.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ordersNeedingAssemblyPacking.map((sj) => (
              <div
                key={sj.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-700 text-xs">{sj.sjNumber} • {sj.relatedSpNumber}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      Jadwal: {sj.scheduledDate} ({sj.timeSlot})
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-800 text-xs mt-1">{sj.customerName}</h5>
                  <p className="text-[11px] text-slate-500 truncate">{sj.destinationAddress}</p>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Wrench size={12} className="text-amber-600" />
                          Rakit (GS):
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          sj.assemblyStatus === "Selesai Rakit" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {sj.assemblyStatus || "Belum Dirakit"}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 mt-1 truncate">{sj.assemblyPIC || "Tim GS"}</div>
                      <span className="text-[10px] text-slate-400 block">{sj.assemblyDurationMinutes || 0} menit</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <PackageCheck size={12} className="text-blue-600" />
                          Packing:
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          sj.packingStatus === "Selesai Packing" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {sj.packingStatus || "Belum Dipacking"}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 mt-1 truncate">{sj.packingPIC || "Staf Packing"}</div>
                      <span className="text-[10px] text-slate-400 block">{sj.packingDurationMinutes || 0} menit</span>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS & WHATSAPP */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      onClick={() => handleSendWaToGS(sj)}
                      className={`text-[10px] h-7 px-2 flex items-center gap-1 ${
                        sj.waSentToGS 
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300" 
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      }`}
                      title="Kirim pesan WhatsApp ke Tim GS mengenai jadwal perakitan besok pagi"
                    >
                      <MessageSquare size={11} />
                      {sj.waSentToGS ? "WA GS ✓" : "WA ke Tim GS"}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleSendWaToCustomer(sj)}
                      className={`text-[10px] h-7 px-2 flex items-center gap-1 ${
                        sj.waSentToCustomer 
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300" 
                          : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                      }`}
                      title="Kirim pesan WhatsApp ke konsumen mengenai jadwal pengiriman"
                    >
                      <Send size={11} />
                      {sj.waSentToCustomer ? "WA Konsumen ✓" : "WA ke Konsumen"}
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenAssemblyModal(sj)}
                    className="text-[10px] h-7 px-2 border-amber-300 hover:bg-amber-50 text-amber-900 font-semibold"
                  >
                    <Wrench size={11} className="mr-1" />
                    Input Rakit & Packing
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <TableHead className="pl-4">Nomor SJ & SP</TableHead>
                <TableHead>Konsumen & Tujuan</TableHead>
                <TableHead>Armada / Ekspedisi</TableHead>
                <TableHead>Rakit (Tim GS) & Packing</TableHead>
                <TableHead>Jadwal & Status Kirim</TableHead>
                <TableHead>Notifikasi WhatsApp</TableHead>
                <TableHead className="text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredOrders.map((sj) => (
                <TableRow key={sj.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* SJ & SP */}
                  <TableCell className="pl-4 font-mono">
                    <div className="font-bold text-blue-700">{sj.sjNumber}</div>
                    {sj.relatedSpNumber ? (
                      <button
                        type="button"
                        onClick={() => handleTraceSP(sj.relatedSpNumber)}
                        title="Klik untuk melihat Audit Trail lengkap SP ini"
                        className="mt-1 font-mono font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 px-1.5 py-0.5 rounded text-[10px] border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer w-fit"
                      >
                        <span>🔍</span>
                        <span>{sj.relatedSpNumber}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[10px]">-</span>
                    )}
                  </TableCell>

                  {/* KONSUMEN & TUJUAN */}
                  <TableCell>
                    <div className="font-semibold text-slate-800">{sj.customerName}</div>
                    <div className="text-[11px] text-slate-500">{sj.customerPhone || "-"}</div>
                    <div className="text-[11px] text-slate-600 max-w-[200px] truncate mt-0.5" title={sj.destinationAddress}>
                      {sj.destinationAddress}
                    </div>
                    <Badge variant="outline" className="text-[9px] text-slate-500 mt-0.5">
                      {sj.region}
                    </Badge>
                  </TableCell>

                  {/* ARMADA / EKSPEDISI */}
                  <TableCell>
                    {sj.shippingType === "Eksternal" ? (
                      <div>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          Ekspedisi: {sj.expeditionName || "Cargo"}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Resi: {sj.trackingNumber || "Belum ada resi"}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          <Truck size={12} className="text-blue-600" />
                          <span>{sj.driverName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{sj.vehiclePlate}</div>
                      </div>
                    )}
                  </TableCell>

                  {/* RAKIT (TIM GS) & PACKING */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-500 font-medium flex items-center gap-0.5">
                          <Wrench size={10} className="text-amber-600" />
                          Rakit:
                        </span>
                        <span className="font-semibold text-slate-700 truncate max-w-[90px]">{sj.assemblyPIC || "Tim GS"}</span>
                        <span className="text-slate-400">({sj.assemblyDurationMinutes || 0}m)</span>
                        <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                          sj.assemblyStatus === "Selesai Rakit" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {sj.assemblyStatus === "Selesai Rakit" ? "Selesai" : (sj.assemblyStatus || "Belum")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-500 font-medium flex items-center gap-0.5">
                          <PackageCheck size={10} className="text-blue-600" />
                          Packing:
                        </span>
                        <span className="font-semibold text-slate-700 truncate max-w-[90px]">{sj.packingPIC || "Staf Packing"}</span>
                        <span className="text-slate-400">({sj.packingDurationMinutes || 0}m)</span>
                        <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                          sj.packingStatus === "Selesai Packing" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {sj.packingStatus === "Selesai Packing" ? "Selesai" : (sj.packingStatus || "Belum")}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenAssemblyModal(sj)}
                        className="text-[10px] text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 underline cursor-pointer"
                      >
                        <Wrench size={10} />
                        Update Rakit/Packing
                      </button>
                    </div>
                  </TableCell>

                  {/* JADWAL & STATUS */}
                  <TableCell>
                    <div className="font-medium text-slate-700">{sj.scheduledDate}</div>
                    <div className="text-[10px] text-slate-400">{sj.timeSlot}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      sj.status === "Terkirim"
                        ? "bg-emerald-100 text-emerald-800"
                        : sj.status === "Sedang Di Jalan"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {sj.status}
                    </span>
                  </TableCell>

                  {/* WHATSAPP */}
                  <TableCell>
                    <div className="flex flex-col gap-1 w-28">
                      <Button
                        size="sm"
                        onClick={() => handleSendWaToGS(sj)}
                        className={`text-[10px] h-6 px-1.5 flex items-center justify-center gap-1 ${
                          sj.waSentToGS
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                        title="Kirim pesan WhatsApp ke Tim GS mengenai jadwal perakitan"
                      >
                        <MessageSquare size={10} />
                        <span>{sj.waSentToGS ? "WA GS ✓" : "WA Tim GS"}</span>
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleSendWaToCustomer(sj)}
                        className={`text-[10px] h-6 px-1.5 flex items-center justify-center gap-1 ${
                          sj.waSentToCustomer
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300"
                            : "bg-emerald-700 hover:bg-emerald-800 text-white"
                        }`}
                        title="Kirim pesan WhatsApp ke konsumen mengenai jadwal pengiriman"
                      >
                        <Send size={10} />
                        <span>{sj.waSentToCustomer ? "WA Konsumen ✓" : "WA Konsumen"}</span>
                      </Button>
                    </div>
                  </TableCell>

                  {/* AKSI */}
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
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
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500 text-xs">
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

      {/* RAKIT (TIM GS) & PACKING MODAL */}
      <AnimatePresence>
        {isAssemblyModalOpen && selectedDistributionForAssembly && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Wrench size={18} />
                    Pencatatan Perakitan (Tim GS) & Packing Barang
                  </h3>
                  <p className="text-amber-100 text-xs mt-0.5">
                    SJ: <span className="font-mono font-bold text-white">{selectedDistributionForAssembly.sjNumber}</span> | SP: <span className="font-mono font-bold text-white">{selectedDistributionForAssembly.relatedSpNumber || "-"}</span> | {selectedDistributionForAssembly.customerName}
                  </p>
                </div>
                <button onClick={() => setIsAssemblyModalOpen(false)} className="text-amber-200 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveAssemblyPacking} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                {/* PERAKITAN TIM GS */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <Wrench size={14} className="text-amber-700" />
                      1. Perakitan Barang (Tim GS / General Services)
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                      Tahap Pasca QC
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Petugas Rakit (Tim GS)</label>
                      <input
                        type="text"
                        value={assemblyForm.assemblyPIC}
                        onChange={(e) => setAssemblyForm({ ...assemblyForm, assemblyPIC: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                        placeholder="e.g. Bambang & Rahmat (Tim GS)"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Durasi Rakit (Menit)</label>
                      <input
                        type="number"
                        min={0}
                        value={assemblyForm.assemblyDurationMinutes}
                        onChange={(e) => setAssemblyForm({ ...assemblyForm, assemblyDurationMinutes: parseInt(e.target.value) || 0 })}
                        className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                        placeholder="e.g. 45"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status Perakitan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Belum Dirakit", "Sedang Dirakit", "Selesai Rakit"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setAssemblyForm({ ...assemblyForm, assemblyStatus: st })}
                          className={`p-2 rounded-lg text-center font-semibold text-xs border transition-all ${
                            assemblyForm.assemblyStatus === st
                              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PACKING BARANG */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                      <PackageCheck size={14} className="text-blue-700" />
                      2. Packing Barang & Proteksi Sofa
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded">
                      Standard Quality
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Petugas Packing</label>
                      <input
                        type="text"
                        value={assemblyForm.packingPIC}
                        onChange={(e) => setAssemblyForm({ ...assemblyForm, packingPIC: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                        placeholder="e.g. Dedi (Gudang Packing)"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Durasi Packing (Menit)</label>
                      <input
                        type="number"
                        min={0}
                        value={assemblyForm.packingDurationMinutes}
                        onChange={(e) => setAssemblyForm({ ...assemblyForm, packingDurationMinutes: parseInt(e.target.value) || 0 })}
                        className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                        placeholder="e.g. 30"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status Packing</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Belum Dipacking", "Sedang Dipacking", "Selesai Packing"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setAssemblyForm({ ...assemblyForm, packingStatus: st })}
                          className={`p-2 rounded-lg text-center font-semibold text-xs border transition-all ${
                            assemblyForm.packingStatus === st
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MODA PENGIRIMAN & EKSPEDISI */}
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                      <Truck size={14} className="text-purple-700" />
                      3. Moda Pengiriman & Ekspedisi
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAssemblyForm({ ...assemblyForm, shippingType: "Internal" })}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                        assemblyForm.shippingType === "Internal"
                          ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="font-bold text-xs">🚚 Armada Internal Lovise</div>
                      <div className={`text-[10px] mt-0.5 ${assemblyForm.shippingType === "Internal" ? "text-purple-100" : "text-slate-500"}`}>
                        Driver internal & truk Lovise
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssemblyForm({ ...assemblyForm, shippingType: "Eksternal" })}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                        assemblyForm.shippingType === "Eksternal"
                          ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="font-bold text-xs">📦 Ekspedisi / Cargo Eksternal</div>
                      <div className={`text-[10px] mt-0.5 ${assemblyForm.shippingType === "Eksternal" ? "text-purple-100" : "text-slate-500"}`}>
                        Dakota, Baraka, Sentral Cargo, JNE
                      </div>
                    </button>
                  </div>

                  {assemblyForm.shippingType === "Eksternal" && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nama Ekspedisi Cargo</label>
                        <input
                          type="text"
                          value={assemblyForm.expeditionName}
                          onChange={(e) => setAssemblyForm({ ...assemblyForm, expeditionName: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                          placeholder="e.g. Dakota Cargo / Sentral Cargo"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nomor Resi / AWB</label>
                        <input
                          type="text"
                          value={assemblyForm.trackingNumber}
                          onChange={(e) => setAssemblyForm({ ...assemblyForm, trackingNumber: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-2 bg-white font-mono"
                          placeholder="e.g. DKT-88992019"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* NOTIFIKASI WHATSAPP CEPAT */}
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-emerald-700" />
                      Blast Jadwal via WhatsApp Otomatis:
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">
                      Pesan WhatsApp terformat otomatis untuk Tim GS atau Konsumen
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSendWaToGS(selectedDistributionForAssembly)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5 flex items-center gap-1"
                    >
                      <MessageSquare size={11} />
                      WA Tim GS
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSendWaToCustomer(selectedDistributionForAssembly)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] h-7 px-2.5 flex items-center gap-1"
                    >
                      <Send size={11} />
                      WA Konsumen
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button type="button" variant="outline" onClick={() => setIsAssemblyModalOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                    Simpan Data Rakit, Packing & Pengiriman
                  </Button>
                </div>
              </form>
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
