"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, PenTool, ClipboardList, Warehouse, Truck, CheckCircle2, AlertTriangle, FilePlus2, PackageCheck, CalendarDays, ShoppingBag } from "lucide-react";
import { mockSalesOrders, SalesOrder } from "@/lib/dummy-data";
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
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    productName: "",
    productType: "Ready Stock" as "Ready Stock" | "PO Sofa" | "PO Produk Mebel",
    region: "Dalam Kota" as "Dalam Kota" | "Luar Kota",
    requestDate: "",
    hasBlueprint: true,
    purchasingStatus: "Belum" as "Belum" | "Requested" | "Ordered",
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customerName || !newOrder.productName) return;

    let initialStage: SalesOrder["currentStage"] = "Inventory";
    let initialStatus: SalesOrder["status"] = "Pending";

    if (newOrder.productType === "PO Sofa") {
      initialStage = "Kepala Toko";
      if (!newOrder.hasBlueprint) initialStatus = "Blocked";
    } else if (newOrder.productType === "PO Produk Mebel") {
      initialStage = "Purchasing";
    }

    const orderToCreate: SalesOrder = {
      id: `so-00${orders.length + 1}`,
      customerName: newOrder.customerName,
      productName: newOrder.productName,
      productType: newOrder.productType,
      region: newOrder.region,
      requestDate: newOrder.requestDate,
      hasBlueprint: newOrder.hasBlueprint,
      purchasingStatus: newOrder.purchasingStatus,
      currentStage: initialStage,
      status: initialStatus,
    };

    setOrders([orderToCreate, ...orders]);
    setNewOrder({ ...newOrder, customerName: "", productName: "", requestDate: "" });
  };

  const advanceStage = (id: string, nextStage: SalesOrder["currentStage"], newStatus: SalesOrder["status"] = "Pending") => {
    setIsProcessing(id);
    setTimeout(() => {
      setOrders(orders.map(o => o.id === id ? { ...o, currentStage: nextStage, status: newStatus } : o));
      setIsProcessing(null);
    }, 800);
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operations Module</h1>
          <p className="text-slate-500 mt-1">Role-Based To-Do List Dashboard (SOP Alur Penjualan).</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-max overflow-x-auto">
          {[
            { id: "sales", label: "Sales & Order Entry", icon: <ClipboardList size={16} /> },
            { id: "produksi", label: "Produksi (Kepala Toko & Partner)", icon: <PenTool size={16} /> },
            { id: "purchasing", label: "Purchasing & Inventory", icon: <Warehouse size={16} /> },
            { id: "distribusi", label: "Distribusi & Kalender", icon: <Truck size={16} /> },
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

        {/* TAB: SALES */}
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

                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Buat Pesanan & Routing Otomatis</Button>
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

        {/* TAB: PRODUKSI */}
        {activeTab === "produksi" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-orange-50/50 border-b border-orange-100">
                <CardTitle className="flex items-center gap-2"><PenTool size={18} className="text-orange-600" /> To-Do List: Kepala Toko & Produksi</CardTitle>
                <CardDescription>Khusus menangani pesanan PO Sofa.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">ID</TableHead>
                      <TableHead>Konsumen & Produk</TableHead>
                      <TableHead>Role / Stage</TableHead>
                      <TableHead>Kondisi</TableHead>
                      <TableHead className="text-right pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => o.productType === "PO Sofa" && ["Kepala Toko", "Produksi"].includes(o.currentStage)).map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-6 font-mono text-xs">{o.id}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{o.customerName}</div>
                          <div className="text-xs text-slate-500">{o.productName}</div>
                        </TableCell>
                        <TableCell><Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-none">{o.currentStage}</Badge></TableCell>
                        <TableCell>
                          {o.currentStage === "Kepala Toko" && o.status === "Blocked" ? (
                            <span className="flex items-center gap-1 text-xs font-semibold text-rose-600"><AlertTriangle size={14}/> Menunggu Gambar Kerja</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><CheckCircle2 size={14}/> Siap Diproses</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {o.currentStage === "Kepala Toko" && (
                            <Button 
                              size="sm" 
                              disabled={o.status === "Blocked" || isProcessing === o.id}
                              onClick={() => advanceStage(o.id, "Produksi", "Diproses")}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Buat Form Produksi
                            </Button>
                          )}
                          {o.currentStage === "Produksi" && (
                            <Button 
                              size="sm" 
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(o.id, "Inventory", "Pending")}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              Selesai Diproduksi
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.productType === "PO Sofa" && ["Kepala Toko", "Produksi"].includes(o.currentStage)).length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">Tidak ada tugas PO Sofa saat ini.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB: PURCHASING & INVENTORY */}
        {activeTab === "purchasing" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-purple-50/50 border-b border-purple-100">
                <CardTitle className="flex items-center gap-2"><Warehouse size={18} className="text-purple-600" /> To-Do List: Purchasing & Inventory</CardTitle>
                <CardDescription>Menangani pesanan PO Mebel (Purchasing) dan Konfirmasi Kedatangan Barang (Inventory).</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">ID</TableHead>
                      <TableHead>Konsumen & Produk</TableHead>
                      <TableHead>Role / Stage</TableHead>
                      <TableHead>Jenis Produk</TableHead>
                      <TableHead className="text-right pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => ["Purchasing", "Inventory"].includes(o.currentStage)).map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-6 font-mono text-xs">{o.id}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{o.customerName}</div>
                          <div className="text-xs text-slate-500">{o.productName}</div>
                        </TableCell>
                        <TableCell><Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-none">{o.currentStage}</Badge></TableCell>
                        <TableCell><span className="text-sm text-slate-600">{o.productType}</span></TableCell>
                        <TableCell className="text-right pr-6">
                          {o.currentStage === "Purchasing" && (
                            <Button 
                              size="sm" 
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(o.id, "Inventory", "Pending")}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Buat PO ke Supplier
                            </Button>
                          )}
                          {o.currentStage === "Inventory" && (
                            <Button 
                              size="sm" 
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(o.id, "Distribusi", "Pending")}
                              variant="outline"
                              className="border-purple-600 text-purple-700 hover:bg-purple-50"
                            >
                              <PackageCheck size={16} className="mr-2" /> Konfirmasi Barang Tiba
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB: DISTRIBUSI */}
        {activeTab === "distribusi" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2"><CalendarDays size={18} className="text-blue-600" /> Kalender & Plotting Distribusi</CardTitle>
                <CardDescription>Pesanan siap dikirim. Plotting jadwal ke kalender pengiriman.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">ID</TableHead>
                      <TableHead>Konsumen & Produk</TableHead>
                      <TableHead>Wilayah</TableHead>
                      <TableHead>Request Tgl</TableHead>
                      <TableHead className="text-right pr-6">Aksi Plotting</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => o.currentStage === "Distribusi").map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-6 font-mono text-xs">{o.id}</TableCell>
                        <TableCell>
                          <div className="font-semibold">{o.customerName}</div>
                          <div className="text-xs text-slate-500">{o.productName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={o.region === "Dalam Kota" ? "default" : "secondary"}>{o.region}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{o.requestDate || "Sesuai Rute"}</span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button 
                            size="sm" 
                            disabled={isProcessing === o.id}
                            onClick={() => advanceStage(o.id, "Selesai", "Selesai")}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Plot Jadwal & Rute
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.currentStage === "Distribusi").length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">Tidak ada pesanan yang siap dikirim.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </div>
    </AppLayout>
  );
}
