"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, CheckCircle2, AlertTriangle, Loader2, LineChart as LineChartIcon, Activity, AlertOctagon } from "lucide-react";
import { mockFinanceLogs, FinanceLog } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import AppLayout from "@/components/AppLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const cashflowData = [
  { date: "1 Aug", actual: 120, predicted: 120 },
  { date: "5 Aug", actual: 150, predicted: 150 },
  { date: "10 Aug", actual: 90, predicted: 90 },
  { date: "15 Aug", actual: null, predicted: 110 },
  { date: "20 Aug", actual: null, predicted: 160 },
  { date: "25 Aug", actual: null, predicted: 130 },
  { date: "30 Aug", actual: null, predicted: 180 },
];

export default function FinanceModule() {
  const [logs, setLogs] = useState<FinanceLog[]>(mockFinanceLogs);
  const [isAuditing, setIsAuditing] = useState(false);
  const [hasAudited, setHasAudited] = useState(false);
  const [filterType, setFilterType] = useState<string>("All");

  const runAIOcrAudit = () => {
    setIsAuditing(true);
    
    setTimeout(() => {
      setIsAuditing(false);
      setHasAudited(true);
    }, 2500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredLogs = logs.filter(log => filterType === "All" || log.type === filterType);
  const anomalies = logs.filter(l => l.status === "Anomaly");

  return (
    <AppLayout>
      <div className="p-8 space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Finance (FAT) Module</h1>
            <p className="text-slate-500 mt-1">AI Financial Analyst: Rekonsiliasi, Deteksi Anomali, & Prediksi Cashflow.</p>
          </div>
          <Button 
            onClick={runAIOcrAudit} 
            disabled={isAuditing} 
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isAuditing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menganalisis Data Keuangan...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Jalankan Analisis AI Terpadu
              </>
            )}
          </Button>
        </div>

        {isAuditing ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-50 pointer-events-none mt-8">
            {[1, 2, 3, 4].map((i) => (
               <Card key={i} className="animate-pulse bg-slate-100 border-none h-32"></Card>
            ))}
          </div>
        ) : (
          <>
            {/* AI Anomaly Alert */}
            {hasAudited && anomalies.length > 0 && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-4 flex items-start gap-4">
                  <AlertOctagon className="text-rose-600 shrink-0 mt-0.5 h-6 w-6" />
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-rose-900">AI Anomaly Detection Alert</h4>
                    <p className="text-sm text-rose-700 mt-1">Sistem mendeteksi {anomalies.length} transaksi yang sangat tidak wajar dibandingkan pola pengeluaran historis.</p>
                    <div className="mt-3 flex gap-2">
                      {anomalies.map(a => (
                        <div key={a.id} className="bg-white px-3 py-2 rounded-md border border-rose-100 shadow-sm text-xs">
                          <span className="font-semibold text-slate-900">{a.description}</span> <br/>
                          <span className="text-rose-600 font-mono font-bold">{formatCurrency(a.systemAmount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-100 shrink-0">Investigasi</Button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rekonsiliasi Card */}
              <Card className="lg:col-span-2 bg-white shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Rekonsiliasi (Accurate vs Mutasi)</CardTitle>
                    <CardDescription>Pencocokan otomatis dari Mutasi Bank, QRIS, dan Gabungan.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {["All", "Bank Transfer", "QRIS", "Gabungan"].map(type => (
                      <Badge 
                        key={type}
                        variant={filterType === type ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setFilterType(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Deskripsi (OCR)</TableHead>
                        <TableHead className="text-right">Mutasi</TableHead>
                        <TableHead className="text-right">Accurate</TableHead>
                        <TableHead>Status AI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log, index) => {
                        const diff = log.bankAmount - log.systemAmount;
                        const isAnomaly = log.status === "Anomaly";
                        const isDiscrepancy = log.status === "Discrepancy";
                        
                        return (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group hover:bg-slate-50 ${isAnomaly ? 'bg-rose-50/50' : isDiscrepancy ? 'bg-amber-50/50' : ''}`}
                          >
                            <TableCell className="font-medium text-slate-700">{log.type}</TableCell>
                            <TableCell className="text-slate-600">{log.description}</TableCell>
                            <TableCell className="text-right font-mono text-slate-700">
                              {formatCurrency(log.bankAmount)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-slate-700">
                              {formatCurrency(log.systemAmount)}
                            </TableCell>
                            <TableCell>
                              {hasAudited ? (
                                <Badge variant={isAnomaly ? "destructive" : isDiscrepancy ? "warning" : "success"}>
                                  {log.status}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-400 border-slate-200">
                                  Menunggu AI...
                                </Badge>
                              )}
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Predictive Cashflow */}
              {hasAudited ? (
                <Card className="bg-white shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LineChartIcon className="h-5 w-5 text-indigo-600"/> Predictive Cashflow</CardTitle>
                    <CardDescription>Prediksi AI untuk 30 hari ke depan berdasarkan tren saat ini.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={cashflowData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Aktual (Juta)" />
                          <Line type="monotone" dataKey="predicted" stroke="#818cf8" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Prediksi AI (Juta)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <p className="text-sm text-indigo-900">
                        <strong>Rekomendasi AI:</strong> Arus kas diproyeksikan sangat sehat pada akhir bulan. Anda dapat mempercepat pembayaran PO ke supplier prioritas.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-slate-50 border-dashed border-2 border-slate-300">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center h-full">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Activity className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">Analisis Belum Berjalan</h3>
                    <p className="text-sm text-slate-500 max-w-[200px]">
                      Klik tombol Analisis AI Terpadu untuk memuat prediksi arus kas (Cashflow).
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
