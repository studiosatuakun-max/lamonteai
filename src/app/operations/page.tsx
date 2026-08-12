"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, ArrowRightCircle, Package, Factory, CheckCircle2, TrendingUp, Map, Star, Truck, ShoppingCart } from "lucide-react";
import { mockOrders, mockSuppliers, mockProductionJobs, Order } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import AppLayout from "@/components/AppLayout";

export default function OperationsModule() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("orders");

  const processOrder = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === id) {
            let newStatus = "Production";
            if (order.stockAvailable >= order.quantity) newStatus = "Distribution";
            if (order.product.includes("PO")) newStatus = "Procurement";
            return { ...order, status: newStatus as any };
          }
          return order;
        })
      );
      setProcessingId(null);
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="warning" className="w-[100px] justify-center">Pending</Badge>;
      case "Production":
        return <Badge variant="destructive" className="w-[100px] justify-center bg-orange-500">Production</Badge>;
      case "Distribution":
        return <Badge variant="success" className="w-[100px] justify-center bg-blue-500">Distribution</Badge>;
      case "Procurement":
        return <Badge variant="outline" className="w-[100px] justify-center border-purple-500 text-purple-700 bg-purple-50">Procurement</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operations Module</h1>
          <p className="text-slate-500 mt-1">AI Supply Chain Optimization (Produksi, Distribusi, dan Procurement).</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-max">
          {[
            { id: "orders", label: "Order Management", icon: <ShoppingCart size={16} /> },
            { id: "production", label: "Production (AI)", icon: <Factory size={16} /> },
            { id: "distribution", label: "Distribution (AI)", icon: <Truck size={16} /> },
            { id: "procurement", label: "Procurement (AI)", icon: <Star size={16} /> },
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

        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Pending", "Production", "Distribution", "Procurement"].map(status => (
                <Card key={status} className="bg-white shadow-sm border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-slate-500 uppercase">{status}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800">
                      {orders.filter(o => o.status === status).length}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle>Daftar Pesanan Masuk</CardTitle>
                <CardDescription>
                  Klik "Proses" untuk routing pesanan. (Ready = Distribusi, Kosong = Produksi, PO = Procurement).
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="pl-6">ID Pesanan</TableHead>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead className="text-center">Qty / Stok</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right pr-6">Aksi (Rule-Based)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {orders.map((order) => (
                        <motion.tr key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b">
                          <TableCell className="pl-6 font-mono text-xs text-slate-500">#{order.id}</TableCell>
                          <TableCell className="font-medium text-slate-900">{order.customerName}</TableCell>
                          <TableCell className="text-slate-600">{order.product}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <span className="font-semibold text-slate-900">{order.quantity}</span> /
                              <span className={`font-semibold ${order.stockAvailable >= order.quantity ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {order.stockAvailable}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <motion.div layout>{getStatusBadge(order.status)}</motion.div>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {order.status === "Pending" ? (
                              <Button 
                                onClick={() => processOrder(order.id)} disabled={processingId === order.id}
                                size="sm" className="bg-indigo-600 hover:bg-indigo-700 w-28"
                              >
                                {processingId === order.id ? <Settings2 className="animate-spin h-4 w-4" /> : <>Proses <ArrowRightCircle className="ml-2 h-4 w-4" /></>}
                              </Button>
                            ) : (
                              <Button disabled size="sm" variant="outline" className="w-28 text-slate-400">Routed</Button>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "production" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2"><Factory className="text-orange-500"/> AI Smart Plotting (Produksi)</CardTitle>
                <CardDescription>AI menyusun jadwal produksi otomatis untuk memaksimalkan efisiensi mesin.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockProductionJobs.map(job => (
                    <div key={job.id} className="p-4 border border-orange-100 bg-orange-50/30 rounded-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-slate-900">{job.product}</h4>
                        <p className="text-sm text-slate-600 mt-1">Rekomendasi AI: <strong>{job.suggestedShift}</strong></p>
                      </div>
                      <div className="text-right">
                        <Badge variant="success" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
                          <TrendingUp className="mr-1 h-3 w-3" /> +{job.efficiencyGain}% Efisiensi
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "distribution" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2"><Map className="text-blue-500"/> AI Route Optimization (Distribusi)</CardTitle>
                <CardDescription>AI mengelompokkan pengiriman ke rute yang sama untuk menghemat biaya.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Truck size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Rute Pengiriman Optimal Ditemukan</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2">
                  AI telah menggabungkan 3 pesanan ke rute Jakarta Selatan. Estimasi penghematan bahan bakar: <strong>22%</strong> dan waktu: <strong>1.5 Jam</strong>.
                </p>
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700">Cetak Surat Jalan & Rute</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "procurement" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2"><Star className="text-purple-500"/> AI Supplier Scoring (Procurement)</CardTitle>
                <CardDescription>Pemilihan supplier otomatis berdasarkan sentimen review dan rekam jejak pengiriman.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Nama Supplier</TableHead>
                      <TableHead>Harga Penawaran</TableHead>
                      <TableHead>Estimasi Tiba</TableHead>
                      <TableHead>Sentimen Review</TableHead>
                      <TableHead className="text-right pr-6">AI Trust Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSuppliers.sort((a, b) => b.aiTrustScore - a.aiTrustScore).map((supplier, idx) => (
                      <TableRow key={supplier.id} className={idx === 0 ? "bg-purple-50/50" : ""}>
                        <TableCell className="pl-6 font-medium">
                          {supplier.name} 
                          {idx === 0 && <Badge className="ml-2 bg-purple-600">Rekomendasi Utama</Badge>}
                        </TableCell>
                        <TableCell className="font-mono">Rp {supplier.price.toLocaleString("id-ID")}</TableCell>
                        <TableCell>{supplier.speedDays} Hari</TableCell>
                        <TableCell>
                          <span className={`text-sm font-semibold ${supplier.sentiment === 'Positive' ? 'text-emerald-600' : supplier.sentiment === 'Negative' ? 'text-rose-600' : 'text-amber-600'}`}>
                            {supplier.sentiment}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{ width: `${supplier.aiTrustScore}%` }}></div>
                            </div>
                            <span className="font-bold">{supplier.aiTrustScore}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
