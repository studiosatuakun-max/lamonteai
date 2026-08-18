"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, Warehouse, Truck, CheckCircle2, AlertTriangle, 
  FilePlus2, PackageCheck, CalendarDays, ShoppingBag, Loader2, 
  PenTool, BrainCircuit, Hammer
} from "lucide-react";
import { mockSalesOrders } from "@/lib/dummy-data";
import { SalesOrder, CreateOrderPayload } from "@/types/operations";
import { submitOrderToEngine } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import AppLayout from "@/components/AppLayout";

export default function OperationsModule() {
  const [orders, setOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [activeTab, setActiveTab] = useState("sales");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Form State for Sales
  const [newOrder, setNewOrder] = useState<CreateOrderPayload>({
    customerName: "",
    productName: "",
    productType: "Ready Stock",
    region: "Dalam Kota",
    requestDate: "",
    hasBlueprint: true,
  });

  const [isPending, startTransition] = React.useTransition();
  const [formMessage, setFormMessage] = useState<{ type: 'error'|'success', text: string } | null>(null);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    startTransition(async () => {
      const result = await submitOrderToEngine(newOrder);

      if (result.success && result.data) {
        setOrders([result.data, ...orders]);
        setNewOrder({ ...newOrder, customerName: "", productName: "", requestDate: "" });
        setFormMessage({ type: 'success', text: 'Pesanan berhasil dibuat & dirouting!' });
        setTimeout(() => setFormMessage(null), 3000);
      } else {
        setFormMessage({ type: 'error', text: result.message || 'Terjadi kesalahan' });
      }
    });
  };

  const advanceStage = (id: string, updates: Partial<SalesOrder>) => {
    setIsProcessing(id);
    setTimeout(() => {
      setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
      setIsProcessing(null);
    }, 800);
  };

  const changeProductionStage = (id: string, stage: any) => {
    setOrders(orders.map(o => o.id === id ? { ...o, productionStage: stage } : o));
  };

  // Helper for Calendar
  const plottedOrders = orders.filter(o => o.currentStage === "Selesai" && o.distributionDate);
  const getCapacity = (dateStr: string) => {
    const count = plottedOrders.filter(o => o.distributionDate === dateStr).length;
    return count;
  };

  const getCalendarDays = () => {
    // Dummy next 3 days
    return [
      { date: "2026-08-19", dayName: "Rabu, 19 Ags" },
      { date: "2026-08-20", dayName: "Kamis, 20 Ags" },
      { date: "2026-08-21", dayName: "Jumat, 21 Ags" },
    ];
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operations Module</h1>
          <p className="text-slate-500 mt-1">SOP Alur Operasional Penjualan (Dashboard Terintegrasi AI).</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-max overflow-x-auto">
          {[
            { id: "sales", label: "1. Sales & Order Entry", icon: <ClipboardList size={16} /> },
            { id: "produksi_purchasing", label: "2. Purchasing & Produksi", icon: <PenTool size={16} /> },
            { id: "inventory", label: "3. Inventory & Koord. Toko", icon: <Warehouse size={16} /> },
            { id: "distribusi", label: "4. Distribusi & Kalender", icon: <Truck size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: SALES */}
        {activeTab === "sales" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2"><FilePlus2 size={18} className="text-indigo-600" /> Form Penjualan</CardTitle>
                <CardDescription>Input pesanan dari konsumen.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Nama Konsumen</label>
                    <input required value={newOrder.customerName} onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} className="w-full mt-1 border rounded-md px-3 py-2 text-sm" placeholder="Contoh: PT Sejahtera" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Nama Produk</label>
                    <input required value={newOrder.productName} onChange={e => setNewOrder({...newOrder, productName: e.target.value})} className="w-full mt-1 border rounded-md px-3 py-2 text-sm" placeholder="Contoh: Sofa L-Shape" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Jenis Produk</label>
                      <select value={newOrder.productType} onChange={e => setNewOrder({...newOrder, productType: e.target.value as any})} className="w-full mt-1 border rounded-md px-3 py-2 text-sm">
                        <option value="Ready Stock">Ready Stock</option>
                        <option value="PO Sofa">PO Sofa</option>
                        <option value="PO Produk Mebel">PO Produk Mebel</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase">Wilayah</label>
                      <select value={newOrder.region} onChange={e => setNewOrder({...newOrder, region: e.target.value as any})} className="w-full mt-1 border rounded-md px-3 py-2 text-sm">
                        <option value="Dalam Kota">Dalam Kota</option>
                        <option value="Luar Kota">Luar Kota</option>
                      </select>
                    </div>
                  </div>
                  
                  {newOrder.productType === "PO Sofa" && (
                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-md border">
                      <input type="checkbox" id="blueprint" checked={newOrder.hasBlueprint} onChange={e => setNewOrder({...newOrder, hasBlueprint: e.target.checked})} className="rounded text-indigo-600" />
                      <label htmlFor="blueprint" className="text-sm font-medium text-slate-700">Gambar Kerja Sudah Ada?</label>
                    </div>
                  )}

                  {formMessage && (
                    <div className={`p-3 rounded-md text-sm ${formMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {formMessage.text}
                    </div>
                  )}

                  <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    {isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses AI Routing...</>
                    ) : (
                      "Buat Pesanan & Routing Otomatis"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2"><ShoppingBag size={18} className="text-indigo-600" /> Tracking Pesanan (Sales View)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">ID</TableHead>
                      <TableHead>Konsumen & Produk</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-6 font-mono text-xs">{o.id}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{o.customerName}</div>
                          <div className="text-xs text-slate-500">{o.productName}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{o.productType}</Badge></TableCell>
                        <TableCell><Badge className="bg-slate-200 text-slate-800 hover:bg-slate-300 border-none">{o.currentStage}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={o.status === "Blocked" ? "destructive" : o.status === "Selesai" ? "success" : "warning"}>{o.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB 2: PURCHASING & PRODUKSI */}
        {activeTab === "produksi_purchasing" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-purple-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2"><Hammer size={18} className="text-orange-600" /> Pembuatan & Pembelian Barang</CardTitle>
                <CardDescription>Tim Produksi menggarap PO Sofa, tim Purchasing membuat PO Mebel.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">ID</TableHead>
                      <TableHead>Produk & Jenis</TableHead>
                      <TableHead>Rekomendasi AI</TableHead>
                      <TableHead>Status Pengerjaan</TableHead>
                      <TableHead className="text-right pr-6">Aksi Selesai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => ["Produksi", "Purchasing"].includes(o.currentStage)).map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-6 font-mono text-xs">{o.id}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{o.productName}</div>
                          <Badge variant="outline" className="mt-1">{o.productType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-2 bg-indigo-50 p-2 rounded-md border border-indigo-100 max-w-[200px]">
                            <BrainCircuit className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                            <span className="text-xs text-indigo-900 font-medium leading-tight">
                              {o.productType === "PO Sofa" ? "Vendor A (Spesialis Kayu & Busa)" : "Supplier Indo Sejahtera (Harga Termurah)"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {o.currentStage === "Produksi" ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-slate-500">Tahap Produksi:</span>
                              <select 
                                value={o.productionStage} 
                                onChange={e => changeProductionStage(o.id, e.target.value)}
                                className="border rounded-md px-2 py-1 text-xs w-32 bg-slate-50"
                              >
                                <option value="Belum Mulai">Belum Mulai</option>
                                <option value="Potong Rangka">Potong Rangka</option>
                                <option value="Jahit">Jahit</option>
                                <option value="Finishing">Finishing</option>
                              </select>
                            </div>
                          ) : (
                            <Badge className="bg-purple-100 text-purple-800">Menunggu PO</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {o.currentStage === "Produksi" ? (
                             <Button 
                               size="sm" 
                               disabled={isProcessing === o.id || o.productionStage !== "Finishing"}
                               onClick={() => advanceStage(o.id, { currentStage: "Inventory", productionStage: "Selesai", status: "Pending" })}
                               className="bg-orange-600 hover:bg-orange-700"
                             >
                               {o.productionStage !== "Finishing" ? "Selesaikan Tahap Dulu" : "Produksi Selesai"}
                             </Button>
                          ) : (
                             <Button 
                               size="sm" 
                               disabled={isProcessing === o.id}
                               onClick={() => advanceStage(o.id, { currentStage: "Inventory", purchasingStatus: "Ordered", status: "Pending" })}
                               className="bg-purple-600 hover:bg-purple-700"
                             >
                               Buat PO Supplier
                             </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => ["Produksi", "Purchasing"].includes(o.currentStage)).length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">Tidak ada tugas Produksi atau Purchasing saat ini.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB 3: INVENTORY & KOORDINATOR TOKO */}
        {activeTab === "inventory" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2"><Warehouse size={18} className="text-slate-700" /> Gerbang Inventory & Koordinator</CardTitle>
                <CardDescription>Mengecek PO Sofa baru (Koordinator) dan Mengonfirmasi kedatangan fisik barang (Inventory).</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">ID</TableHead>
                      <TableHead>Konsumen & Produk</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Notifikasi Status</TableHead>
                      <TableHead className="text-right pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => ["Kepala Toko", "Inventory"].includes(o.currentStage)).map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-6 font-mono text-xs">{o.id}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{o.customerName}</div>
                          <div className="text-xs text-slate-500">{o.productName} ({o.productType})</div>
                        </TableCell>
                        <TableCell><Badge className="bg-slate-100 text-slate-800 border-none">{o.currentStage}</Badge></TableCell>
                        <TableCell>
                          {o.currentStage === "Kepala Toko" ? (
                             o.status === "Blocked" ? (
                               <span className="flex items-center gap-1 text-xs font-semibold text-rose-600"><AlertTriangle size={14}/> Menunggu Gambar Kerja</span>
                             ) : (
                               <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><CheckCircle2 size={14}/> Siap Diproses (Order Baru)</span>
                             )
                          ) : (
                             // Inventory Notifications
                             <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md w-max font-medium">
                               <Loader2 size={12} className="animate-spin"/>
                               {o.productType === "PO Sofa" ? "Menunggu Kedatangan dari Pabrik" :
                                o.productType === "PO Produk Mebel" ? "Menunggu Kedatangan dari Supplier" : 
                                "Menunggu Pengambilan Gudang"}
                             </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {o.currentStage === "Kepala Toko" ? (
                            <Button 
                              size="sm" 
                              disabled={o.status === "Blocked" || isProcessing === o.id}
                              onClick={() => advanceStage(o.id, { currentStage: "Produksi", productionStage: "Belum Mulai", status: "Diproses" })}
                              variant="outline"
                            >
                              Buat Form Permintaan Produksi
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(o.id, { currentStage: "Distribusi", status: "Pending" })}
                              className="bg-indigo-600 hover:bg-indigo-700"
                            >
                              <PackageCheck size={16} className="mr-2" /> Ceklist: Barang Tiba
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => ["Kepala Toko", "Inventory"].includes(o.currentStage)).length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">Gudang kosong. Tidak ada pesanan menunggu.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB 4: DISTRIBUSI & KALENDER */}
        {activeTab === "distribusi" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* KIRI: Antrean Distribusi */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2"><Truck size={18} className="text-blue-600" /> Antrean Distribusi</CardTitle>
                <CardDescription>Pesanan siap dikirim. Plot jadwal ke kalender di samping.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">ID & Nama</TableHead>
                      <TableHead>Wilayah / Tgl Request</TableHead>
                      <TableHead className="text-right pr-4">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => o.currentStage === "Distribusi").map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-4">
                          <div className="font-semibold">{o.id}</div>
                          <div className="text-xs text-slate-500">{o.customerName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={o.region === "Dalam Kota" ? "default" : "secondary"} className="mb-1">{o.region}</Badge>
                          <div className="text-xs font-medium text-slate-600">{o.requestDate || "Bebas"}</div>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button 
                            size="sm" 
                            disabled={isProcessing === o.id}
                            // Dummy plot to next day (19 Ags)
                            onClick={() => advanceStage(o.id, { currentStage: "Selesai", status: "Selesai", distributionDate: "2026-08-19" })}
                            className="bg-blue-600 hover:bg-blue-700 text-xs px-2 h-8"
                          >
                            Plot Jadwal
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.currentStage === "Distribusi").length === 0 && (
                      <TableRow><TableCell colSpan={3} className="text-center py-8 text-slate-500">Antrean kosong.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* KANAN: Kalender Visual */}
            <Card className="shadow-sm border-slate-200 bg-slate-50">
              <CardHeader className="border-b border-slate-200 bg-white">
                <CardTitle className="flex items-center gap-2"><CalendarDays size={18} className="text-slate-700" /> Kalender Distribusi Harian</CardTitle>
                <CardDescription>Visualisasi kapasitas truk harian.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 grid gap-4">
                {getCalendarDays().map(day => {
                  const items = plottedOrders.filter(o => o.distributionDate === day.date);
                  const capacity = items.length;
                  const maxCapacity = 5;
                  const isFull = capacity >= maxCapacity;

                  return (
                    <div key={day.date} className="bg-white rounded-lg border p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-800">{day.dayName}</h4>
                        <Badge variant={isFull ? "destructive" : "outline"} className={isFull ? "" : "text-emerald-700 border-emerald-200 bg-emerald-50"}>
                          Kapasitas: {capacity}/{maxCapacity}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <AnimatePresence>
                          {items.length === 0 && <div className="text-xs text-slate-400 italic">Belum ada jadwal.</div>}
                          {items.map(item => (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={item.id} 
                              className="text-xs bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center"
                            >
                              <span className="font-medium text-slate-700">{item.customerName} - {item.productName}</span>
                              <Badge variant="secondary" className="text-[10px] h-5">{item.region}</Badge>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

          </motion.div>
        )}

      </div>
    </AppLayout>
  );
}
