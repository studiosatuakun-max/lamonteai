"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, Warehouse, Truck, CheckCircle2, AlertTriangle, 
  FilePlus2, PackageCheck, CalendarDays, ShoppingBag, Loader2, 
  PenTool, BrainCircuit, Hammer, Sparkles, MessageSquare, 
  Clock, ShieldAlert, ArrowRight, RefreshCw, X, ChevronRight, 
  FileText, Check, AlertCircle, Phone, MapPin, User, Send, 
  Layers, Package, Calendar, AlertOctagon, Info
} from "lucide-react";
import { 
  mockSalesOrders, 
  mockDailyReports, 
  mockStockItems, 
  initialAIDigest, 
  mockSuppliers 
} from "@/lib/dummy-data";
import { 
  SalesOrder, 
  CreateOrderPayload, 
  DailyReportEntry, 
  AIDigestResult, 
  StockItem, 
  TimelineEvent 
} from "@/types/operations";
import { 
  submitOrderToEngine, 
  parseOrderFromChat, 
  generateDailyDigestAction 
} from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import AppLayout from "@/components/AppLayout";

export default function OperationsModule() {
  // State Data
  const [orders, setOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [dailyReports, setDailyReports] = useState<DailyReportEntry[]>(mockDailyReports);
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [aiDigest, setAiDigest] = useState<AIDigestResult | null>(initialAIDigest);
  
  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<"sales" | "produksi_purchasing" | "inventory" | "distribusi" | "digest">("sales");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Modals State
  const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState<SalesOrder | null>(null);
  const [isChatParserOpen, setIsChatParserOpen] = useState(false);
  const [chatInputText, setChatInputText] = useState("");
  const [isParsingChat, setIsParsingChat] = useState(false);
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);

  // New Daily Report Input State
  const [newReport, setNewReport] = useState({
    division: "Produksi" as DailyReportEntry["division"],
    reporter: "",
    notes: "",
    relatedSP: "",
    urgency: "Normal" as DailyReportEntry["urgency"]
  });

  // Form State for Sales & Restock
  const [formSourceType, setFormSourceType] = useState<"Pesanan Konsumen" | "Kebutuhan Stok">("Pesanan Konsumen");
  const [newOrder, setNewOrder] = useState<CreateOrderPayload>({
    sourceType: "Pesanan Konsumen",
    customerName: "",
    customerPhone: "",
    address: "",
    productName: "",
    productType: "Ready Stock",
    region: "Dalam Kota",
    requestDate: "",
    hasBlueprint: true,
    notes: ""
  });

  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Orders
  const filteredOrders = orders;

  // Create Order Handler
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    startTransition(async () => {
      const payload: CreateOrderPayload = {
        ...newOrder,
        sourceType: formSourceType,
        customerName: formSourceType === "Kebutuhan Stok" ? "Internal Gudang & Toko" : newOrder.customerName
      };

      const result = await submitOrderToEngine(payload);

      if (result.success && result.data) {
        setOrders([result.data, ...orders]);
        setNewOrder({
          sourceType: formSourceType,
          customerName: "",
          customerPhone: "",
          address: "",
          productName: "",
          productType: "Ready Stock",
          region: "Dalam Kota",
          requestDate: "",
          hasBlueprint: true,
          notes: ""
        });
        setFormMessage({ type: 'success', text: result.message });
        setTimeout(() => setFormMessage(null), 4000);
      } else {
        setFormMessage({ type: 'error', text: result.message || 'Terjadi kesalahan' });
      }
    });
  };

  // Chat Parser Handler (AI Smart Parser)
  const handleParseChat = async () => {
    if (!chatInputText.trim()) return;
    setIsParsingChat(true);
    const res = await parseOrderFromChat(chatInputText);
    setIsParsingChat(false);

    if (res.success && res.data) {
      setFormSourceType("Pesanan Konsumen");
      setNewOrder(prev => ({
        ...prev,
        ...res.data,
        customerName: res.data?.customerName || prev.customerName,
        customerPhone: res.data?.customerPhone || prev.customerPhone,
        address: res.data?.address || prev.address,
        productName: res.data?.productName || prev.productName,
        productType: res.data?.productType || prev.productType,
        region: res.data?.region || prev.region,
        requestDate: res.data?.requestDate || prev.requestDate,
        hasBlueprint: res.data?.hasBlueprint !== undefined ? res.data.hasBlueprint : prev.hasBlueprint,
        notes: res.data?.notes || prev.notes
      }));
      setIsChatParserOpen(false);
      setChatInputText("");
      setFormMessage({ type: 'success', text: 'Data dari Chat WhatsApp berhasil diekstrak AI ke Formulir!' });
      setTimeout(() => setFormMessage(null), 4000);
    }
  };

  // Generate AI Daily Digest
  const handleGenerateDigest = async () => {
    setIsGeneratingDigest(true);
    const res = await generateDailyDigestAction(dailyReports);
    setIsGeneratingDigest(false);
    if (res.success && res.data) {
      setAiDigest(res.data);
    }
  };

  // Add Daily Report from staff
  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.notes || !newReport.reporter) return;

    const entry: DailyReportEntry = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      division: newReport.division,
      reporter: newReport.reporter,
      notes: newReport.notes,
      relatedSP: newReport.relatedSP ? newReport.relatedSP.split(",").map(s => s.trim().toUpperCase()) : [],
      urgency: newReport.urgency
    };

    setDailyReports([entry, ...dailyReports]);
    setNewReport({
      division: "Produksi",
      reporter: "",
      notes: "",
      relatedSP: "",
      urgency: "Normal"
    });
  };

  // Advance Order Stages with Audit Trail
  const advanceStage = (
    id: string, 
    updates: Partial<SalesOrder>, 
    newTimelineEvent?: { division: TimelineEvent["division"]; title: string; description: string; pic: string }
  ) => {
    setIsProcessing(id);
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id !== id) return o;
        
        const nowFormatted = new Date().toISOString().replace("T", " ").substring(0, 16);
        const updatedTimeline = newTimelineEvent ? [
          ...o.timeline,
          {
            id: `t-${Date.now()}`,
            timestamp: nowFormatted,
            division: newTimelineEvent.division,
            title: newTimelineEvent.title,
            description: newTimelineEvent.description,
            status: (updates.status === "Selesai" ? "completed" : "in_progress") as TimelineEvent["status"],
            pic: newTimelineEvent.pic
          }
        ] : o.timeline;

        const updatedOrder = { 
          ...o, 
          ...updates, 
          timeline: updatedTimeline, 
          updatedAt: new Date().toISOString() 
        };

        if (selectedOrderForTimeline?.id === id) {
          setSelectedOrderForTimeline(updatedOrder);
        }

        return updatedOrder;
      }));
      setIsProcessing(null);
    }, 600);
  };

  // Change Production Stage
  const changeProductionStage = (id: string, stage: any) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const nowFormatted = new Date().toISOString().replace("T", " ").substring(0, 16);
      return {
        ...o,
        productionStage: stage,
        timeline: [
          ...o.timeline,
          {
            id: `t-${Date.now()}`,
            timestamp: nowFormatted,
            division: "Produksi",
            title: `Update Progres Pabrik: ${stage}`,
            description: `Tukang memperbarui tahapan produksi ke ${stage}`,
            status: stage === "QC & Selesai" ? "completed" : "in_progress",
            pic: "Mandor Pabrik"
          }
        ]
      };
    }));
  };

  // Trigger Quick Restock into Form
  const triggerRestockForm = (item: StockItem) => {
    setFormSourceType("Kebutuhan Stok");
    setNewOrder({
      sourceType: "Kebutuhan Stok",
      customerName: "Internal Gudang Lovise",
      customerPhone: "-",
      address: "Gudang Utama",
      productName: `Pengadaan ${item.name} (${item.recommendedRestock} ${item.unit})`,
      productType: item.category === "Sofa Display" ? "PO Sofa" : "PO Produk Mebel",
      region: "Dalam Kota",
      requestDate: "",
      hasBlueprint: true,
      notes: `Restock otomatis karena sisa stok ${item.currentStock} ${item.unit} (batas aman ${item.minStock} ${item.unit})`
    });
    setActiveTab("sales");
  };

  // Calendar Helpers
  const plottedOrders = orders.filter(o => o.distributionDate);
  const calendarDays = [
    { date: "2026-08-19", dayName: "Rabu, 19 Ags 2026" },
    { date: "2026-08-20", dayName: "Kamis, 20 Ags 2026" },
    { date: "2026-08-21", dayName: "Jumat, 21 Ags 2026" },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Layers className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                  Divisi Operasional Lovise Sofa
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Sistem Terintegrasi 5 Bagian: Purchasing • Produksi • Inventory • Distribusi • Koordinator Toko
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setIsChatParserOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm text-xs md:text-sm font-medium flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              AI Quick Input (Chat WA)
            </Button>
          </div>
        </div>

        {/* TOP METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Pesanan</div>
              <div className="text-xl font-bold text-slate-900">{orders.length} <span className="text-xs font-normal text-slate-500">SP/PO</span></div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
              <Hammer className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Pabrik & Custom</div>
              <div className="text-xl font-bold text-orange-600">
                {orders.filter(o => o.currentStage === "Produksi" || o.currentStage === "Kepala Toko").length}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Purchasing PO</div>
              <div className="text-xl font-bold text-purple-600">
                {orders.filter(o => o.currentStage === "Purchasing").length}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Warehouse className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Gudang / Fisik</div>
              <div className="text-xl font-bold text-amber-700">
                {orders.filter(o => o.currentStage === "Inventory").length}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Antrean Distribusi</div>
              <div className="text-xl font-bold text-emerald-600">
                {orders.filter(o => o.currentStage === "Distribusi").length}
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-xl overflow-x-auto border border-slate-200/80 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { id: "sales", label: "1. Pemicu & Input SP / Restock", icon: <ClipboardList size={16} />, badge: orders.filter(o => o.currentStage === "Kepala Toko").length },
            { id: "produksi_purchasing", label: "2. Purchasing & Produksi", icon: <Hammer size={16} />, badge: orders.filter(o => ["Produksi", "Purchasing"].includes(o.currentStage)).length },
            { id: "inventory", label: "3. Inventory Gudang & Toko", icon: <Warehouse size={16} />, badge: orders.filter(o => ["Inventory", "Kepala Toko"].includes(o.currentStage)).length },
            { id: "distribusi", label: "4. Distribusi & Kalender", icon: <Truck size={16} />, badge: orders.filter(o => o.currentStage === "Distribusi").length },
            { id: "digest", label: "5. AI Daily Report (5 Divisi)", icon: <BrainCircuit size={16} />, highlight: true },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? tab.highlight 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md font-semibold"
                    : "bg-white text-indigo-700 shadow-sm font-semibold"
                  : tab.highlight
                  ? "text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              {tab.icon} 
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? "bg-indigo-100 text-indigo-800" : "bg-slate-200 text-slate-700"}`}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PEMICU & ORDER ENTRY (SALES & RESTOCK) */}
        {/* ======================================================== */}
        {activeTab === "sales" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* ALERT RESTOCK WIDGET JIKA ADA STOK KRITIS */}
            {stockItems.some(s => s.status === "Kritis" || s.status === "Mendekati Minimum") && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <AlertOctagon className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">
                      Peringatan Kebutuhan Stok (Restock Trigger)
                    </h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Sistem mendeteksi <strong>{stockItems.filter(s => s.status === "Kritis").length} bahan kritis</strong> dan <strong>{stockItems.filter(s => s.status === "Mendekati Minimum").length} bahan mendekati batas minimum</strong>.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {stockItems.filter(s => s.status !== "Aman").map(item => (
                    <button
                      key={item.id}
                      onClick={() => triggerRestockForm(item)}
                      className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-medium text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
                    >
                      <span>{item.name}</span>
                      <Badge variant={item.status === "Kritis" ? "destructive" : "warning"} className="text-[10px] px-1 py-0 h-4">
                        Sisa {item.currentStock} {item.unit}
                      </Badge>
                      <ArrowRight size={12} className="text-amber-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* FORMULIR INPUT SP / RESTOCK */}
              <Card className="lg:col-span-5 shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FilePlus2 size={18} className="text-indigo-600" /> 
                      Formulir Input Kebutuhan Barang
                    </CardTitle>
                    <button 
                      type="button" 
                      onClick={() => setIsChatParserOpen(true)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                    >
                      <Sparkles size={12} /> Auto-fill WA
                    </button>
                  </div>
                  <CardDescription className="text-xs">
                    Menerbitkan Nomor SP unik & otomatis merouting alur ke bagian terkait.
                  </CardDescription>

                  {/* Toggle Source: Pesanan Konsumen vs Kebutuhan Stok */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-200/70 p-1 rounded-lg mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormSourceType("Pesanan Konsumen");
                        setNewOrder(prev => ({ ...prev, sourceType: "Pesanan Konsumen" }));
                      }}
                      className={`text-xs py-1.5 rounded-md font-semibold transition-all ${
                        formSourceType === "Pesanan Konsumen" 
                          ? "bg-white text-indigo-700 shadow-2xs" 
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🛍️ Pesanan Konsumen (SP)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSourceType("Kebutuhan Stok");
                        setNewOrder(prev => ({ ...prev, sourceType: "Kebutuhan Stok", customerName: "Internal Gudang Lovise" }));
                      }}
                      className={`text-xs py-1.5 rounded-md font-semibold transition-all ${
                        formSourceType === "Kebutuhan Stok" 
                          ? "bg-white text-amber-700 shadow-2xs" 
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      📦 Kebutuhan Stok (Restock)
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="pt-5">
                  <form onSubmit={handleCreateOrder} className="space-y-4">
                    
                    {/* Nomor SP Preview */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Nomor Identitas Sistem:</span>
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {formSourceType === "Kebutuhan Stok" ? "PO-RESTOCK-AUTO" : "SP-2026-AUTO"}
                      </span>
                    </div>

                    {formSourceType === "Pesanan Konsumen" ? (
                      <>
                        <div>
                          <label className="text-xs font-semibold text-slate-700">Nama Konsumen *</label>
                          <input 
                            required 
                            value={newOrder.customerName} 
                            onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} 
                            className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" 
                            placeholder="Contoh: Bpk. Bambang Sutrisno" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-700">No. WhatsApp</label>
                            <input 
                              value={newOrder.customerPhone || ""} 
                              onChange={e => setNewOrder({...newOrder, customerPhone: e.target.value})} 
                              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs" 
                              placeholder="0812xxxx" 
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-700">Wilayah Kirim</label>
                            <select 
                              value={newOrder.region} 
                              onChange={e => setNewOrder({...newOrder, region: e.target.value as any})} 
                              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs bg-white"
                            >
                              <option value="Dalam Kota">Dalam Kota (Jabodetabek)</option>
                              <option value="Luar Kota">Luar Kota (Antar Provinsi)</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Tujuan Penempatan Stok</label>
                        <input 
                          value={newOrder.customerName} 
                          onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} 
                          className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs bg-slate-50" 
                          placeholder="Gudang Utama / Showroom Fatmawati" 
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Nama Produk / Bahan Kebutuhan *</label>
                      <input 
                        required 
                        value={newOrder.productName} 
                        onChange={e => setNewOrder({...newOrder, productName: e.target.value})} 
                        className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" 
                        placeholder={formSourceType === "Kebutuhan Stok" ? "Contoh: Busa Rebounded D50 (15 Lembar)" : "Contoh: Sofa Scandinavian 3 Seater Grey"} 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Klasifikasi Produk</label>
                        <select 
                          value={newOrder.productType} 
                          onChange={e => setNewOrder({...newOrder, productType: e.target.value as any})} 
                          className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs bg-white font-medium"
                        >
                          <option value="Ready Stock">Ready Stock (Gudang)</option>
                          <option value="PO Sofa">PO Sofa (Produksi Pabrik)</option>
                          <option value="PO Produk Mebel">PO Produk Mebel (Purchasing)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Request Tanggal Kirim</label>
                        <input 
                          type="date"
                          value={newOrder.requestDate || ""} 
                          onChange={e => setNewOrder({...newOrder, requestDate: e.target.value})} 
                          className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs bg-white" 
                        />
                      </div>
                    </div>

                    {/* Conditional: Gambar Kerja khusus PO Sofa */}
                    {newOrder.productType === "PO Sofa" && (
                      <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg space-y-1">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="blueprintCheck" 
                            checked={newOrder.hasBlueprint} 
                            onChange={e => setNewOrder({...newOrder, hasBlueprint: e.target.checked})} 
                            className="rounded text-indigo-600 h-4 w-4" 
                          />
                          <label htmlFor="blueprintCheck" className="text-xs font-semibold text-slate-800 cursor-pointer">
                            Gambar Kerja / Dimensi Custom Sudah Ada?
                          </label>
                        </div>
                        <p className="text-[11px] text-amber-800 pl-6">
                          *Jika belum ada, status pesanan akan <strong>Blocked (Tertahan)</strong> di Koordinator Toko sampai arsitek mengirimkan gambar kerja.
                        </p>
                      </div>
                    )}

                    {/* Alamat & Catatan */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Catatan / Spesifikasi Khusus</label>
                      <textarea
                        rows={2}
                        value={newOrder.notes || ""}
                        onChange={e => setNewOrder({...newOrder, notes: e.target.value})}
                        className="w-full mt-1 border border-slate-300 rounded-md p-2 text-xs"
                        placeholder="Contoh: Kain velvet anti-cakar kucing, kaki kayu jati natural..."
                      />
                    </div>

                    {formMessage && (
                      <div className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${formMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {formMessage.type === 'error' ? <AlertCircle size={14}/> : <CheckCircle2 size={14}/>}
                        {formMessage.text}
                      </div>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium text-xs md:text-sm py-2">
                      {isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menerbitkan SP & Menjalankan Alur...</>
                      ) : (
                        "Terbitkan SP / PO & Alirkan ke Bagian Terkait"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* TABEL PELACAKAN SATU PINTU (UNIFIED SP REGISTRY) */}
              <Card className="lg:col-span-7 shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShoppingBag size={18} className="text-indigo-600" />
                      Registry Pesanan Terpadu (Single SP Identity)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Seluruh 5 divisi terhubung ke identitas nomor SP yang sama.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {filteredOrders.length} Pesanan Aktif
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="text-xs bg-slate-50/50">
                          <TableHead className="pl-4">Nomor SP / PO</TableHead>
                          <TableHead>Konsumen & Produk</TableHead>
                          <TableHead>Jenis Alur</TableHead>
                          <TableHead>Posisi Divisi</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right pr-4">Audit Trail</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-xs">
                        {filteredOrders.map((o) => (
                          <TableRow key={o.id} className="hover:bg-slate-50/80 transition-colors">
                            <TableCell className="pl-4 font-mono font-bold text-indigo-700">
                              {o.spNumber}
                              {o.sourceType === "Kebutuhan Stok" && (
                                <span className="block text-[9px] font-sans font-normal text-amber-700 bg-amber-50 px-1 rounded w-max mt-0.5">
                                  Restock
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-slate-800">{o.customerName}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">{o.productName}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px] font-normal">
                                {o.productType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                                {o.currentStage}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  o.status === "Blocked" ? "destructive" : 
                                  o.status === "Selesai" ? "success" : 
                                  o.status === "Diproses" ? "default" : "warning"
                                }
                                className="text-[10px]"
                              >
                                {o.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedOrderForTimeline(o)}
                                className="text-xs h-7 px-2.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
                              >
                                Riwayat SP
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

            </div>
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PURCHASING & PRODUKSI */}
        {/* ======================================================== */}
        {activeTab === "produksi_purchasing" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* SUB-SECTION A: PRODUKSI (PABRIK SOFA CUSTOM) */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 via-amber-50 to-white border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Hammer size={18} className="text-orange-600" />
                      Pengerjaan Pabrik (PO Sofa Custom & Produksi Stok)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Menjadwalkan dan mengerjakan pesanan bertahap: Potong Rangka → Jahit → Finishing → Selesai Masuk Gudang.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200 text-xs">
                    {orders.filter(o => o.currentStage === "Produksi").length} Antrean Aktif
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs bg-slate-50/50">
                      <TableHead className="pl-4">Nomor SP</TableHead>
                      <TableHead>Konsumen & Model Sofa</TableHead>
                      <TableHead>Rekomendasi Spesialis</TableHead>
                      <TableHead>Tahap Pengerjaan Tukang</TableHead>
                      <TableHead className="text-right pr-4">Aksi Penyelesaian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {orders.filter(o => o.currentStage === "Produksi").map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-4 font-mono font-bold text-orange-700">
                          {o.spNumber}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800">{o.customerName}</div>
                          <div className="text-[11px] text-slate-500">{o.productName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-200 w-max">
                            <BrainCircuit className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            <span>Shift 1 (Spesialis Jok & Recliner)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <select
                              value={o.productionStage || "Potong Rangka"}
                              onChange={e => changeProductionStage(o.id, e.target.value)}
                              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium focus:ring-1 focus:ring-orange-500 w-36"
                            >
                              <option value="Potong Rangka">1. Potong Rangka</option>
                              <option value="Jahit">2. Jahit Busa & Kain</option>
                              <option value="Finishing">3. Finishing & Rakit</option>
                              <option value="QC & Selesai">4. QC & Selesai</option>
                            </select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button
                            size="sm"
                            disabled={isProcessing === o.id || o.productionStage !== "QC & Selesai"}
                            onClick={() => advanceStage(
                              o.id,
                              { currentStage: "Inventory", status: "Pending" },
                              { division: "Produksi", title: "Produksi Selesai", description: "Barang lolos QC pabrik dan dikirim ke Gudang", pic: "Mandor Pabrik" }
                            )}
                            className="bg-orange-600 hover:bg-orange-700 text-xs h-8"
                          >
                            {isProcessing === o.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : o.productionStage !== "QC & Selesai" ? (
                              "Selesaikan QC Dulu"
                            ) : (
                              "Kirim ke Gudang"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.currentStage === "Produksi").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-slate-500 text-xs">
                          Tidak ada pesanan aktif di bagian Produksi saat ini.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* SUB-SECTION B: PURCHASING (PO SUPPLIER MEBEL & RESTOCK) */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 via-indigo-50 to-white border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <PenTool size={18} className="text-purple-600" />
                      Purchasing (Pengadaan Supplier Mebel & Restock Bahan)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Menerbitkan PO Supplier, memantau kesiapan barang, dan mengonfirmasi kedatangan ke gudang.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 text-xs">
                    {orders.filter(o => o.currentStage === "Purchasing").length} Kebutuhan PO
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs bg-slate-50/50">
                      <TableHead className="pl-4">Nomor SP / PO</TableHead>
                      <TableHead>Kebutuhan Barang</TableHead>
                      <TableHead>Supplier Rekomendasi</TableHead>
                      <TableHead>Status PO Supplier</TableHead>
                      <TableHead className="text-right pr-4">Aksi Purchasing</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {orders.filter(o => o.currentStage === "Purchasing").map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-4 font-mono font-bold text-purple-700">
                          {o.spNumber}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800">{o.productName}</div>
                          <div className="text-[11px] text-slate-500">{o.customerName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-slate-800">
                            {o.supplierName || "PT Indo Kayu Sejahtera"}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-medium">Trust Score: 95% (Harga Terbaik)</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={o.purchasingStatus === "Ordered" ? "success" : "warning"}
                            className="text-[10px]"
                          >
                            {o.purchasingStatus === "Ordered" ? "Sudah Dipesan ke Vendor" : "Menunggu Order"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          {o.purchasingStatus !== "Ordered" ? (
                            <Button
                              size="sm"
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(
                                o.id,
                                { purchasingStatus: "Ordered" },
                                { division: "Purchasing", title: "PO Supplier Terbit", description: `PO dikirim ke vendor ${o.supplierName || 'Supplier Rekomendasi'}`, pic: "Staf Purchasing" }
                              )}
                              className="bg-purple-600 hover:bg-purple-700 text-xs h-8"
                            >
                              Terbitkan PO Supplier
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(
                                o.id,
                                { currentStage: "Inventory", status: "Pending" },
                                { division: "Purchasing", title: "Supplier Konfirmasi Kirim", description: "Barang dikirim supplier menuju Gudang Lovise", pic: "Staf Purchasing" }
                              )}
                              className="bg-indigo-600 hover:bg-indigo-700 text-xs h-8"
                            >
                              Barang Tiba di Gudang
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.currentStage === "Purchasing").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-slate-500 text-xs">
                          Tidak ada kebutuhan pengadaan aktif di bagian Purchasing saat ini.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </motion.div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INVENTORY (GUDANG & KOORDINATOR TOKO) */}
        {/* ======================================================== */}
        {activeTab === "inventory" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* KOORDINATOR TOKO (VALIDASI GAMBAR KERJA PO SOFA) */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ClipboardList size={18} className="text-indigo-600" />
                      Koordinator Toko (Validasi Gambar Kerja PO Sofa)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Memeriksa gambar kerja sebelum SPK pengerjaan diteruskan ke bagian Produksi Pabrik.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {orders.filter(o => o.currentStage === "Kepala Toko").length} Pesanan Menunggu
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs bg-slate-50/50">
                      <TableHead className="pl-4">Nomor SP</TableHead>
                      <TableHead>Konsumen & Produk</TableHead>
                      <TableHead>Kelengkapan Gambar Kerja</TableHead>
                      <TableHead className="text-right pr-4">Aksi Koordinator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {orders.filter(o => o.currentStage === "Kepala Toko").map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-4 font-mono font-bold text-indigo-700">{o.spNumber}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800">{o.customerName}</div>
                          <div className="text-[11px] text-slate-500">{o.productName}</div>
                        </TableCell>
                        <TableCell>
                          {o.hasBlueprint ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={13} /> Gambar Kerja Lengkap
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertTriangle size={13} /> Tertahan (Gambar Kerja Belum Ada)
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          {!o.hasBlueprint ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => advanceStage(
                                o.id,
                                { hasBlueprint: true, status: "Diproses" },
                                { division: "Koordinator Toko", title: "Gambar Kerja Divalidasi", description: "Gambar kerja diserahkan oleh arsitek dan diverifikasi lengkap", pic: "Doni (Koord. Toko)" }
                              )}
                              className="text-xs h-7 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            >
                              Validasi Gambar Masuk
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(
                                o.id,
                                { currentStage: "Produksi", productionStage: "Potong Rangka", status: "Diproses" },
                                { division: "Koordinator Toko", title: "SPK Pabrik Diterbitkan", description: "Form Permintaan Produksi diteruskan ke Mandor Pabrik", pic: "Doni (Koord. Toko)" }
                              )}
                              className="bg-indigo-600 hover:bg-indigo-700 text-xs h-7"
                            >
                              Terbitkan SPK ke Pabrik
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.currentStage === "Kepala Toko").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-slate-500 text-xs">
                          Tidak ada pesanan tertahan di Koordinator Toko.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* PENERIMAAN & VERIFIKASI FISIK GUDANG (INVENTORY) */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Warehouse size={18} className="text-amber-700" />
                      Penerimaan & Verifikasi Fisik Gudang (Inventory)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Barang dari supplier & pabrik dicatat masuk gudang, dicek fisik sesuai SP, lalu disiapkan untuk pengiriman.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs">
                    {orders.filter(o => o.currentStage === "Inventory").length} Menunggu Konfirmasi
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs bg-slate-50/50">
                      <TableHead className="pl-4">Nomor SP</TableHead>
                      <TableHead>Konsumen & Barang</TableHead>
                      <TableHead>Status Kesiapan Fisik</TableHead>
                      <TableHead className="text-right pr-4">Aksi Gudang</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {orders.filter(o => o.currentStage === "Inventory").map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-4 font-mono font-bold text-amber-800">{o.spNumber}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800">{o.customerName}</div>
                          <div className="text-[11px] text-slate-500">{o.productName} ({o.productType})</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md w-max font-medium">
                            <Package className="h-3.5 w-3.5 text-amber-600" />
                            {o.productType === "Ready Stock" ? "Cek Ketersediaan Rak Gudang" :
                             o.productType === "PO Sofa" ? "Barang Tiba dari Pabrik (Menunggu Cek Fisik)" :
                             "Barang Tiba dari Supplier (Menunggu Cek Fisik)"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <Button
                            size="sm"
                            disabled={isProcessing === o.id}
                            onClick={() => advanceStage(
                              o.id,
                              { currentStage: "Distribusi", status: "Pending" },
                              { division: "Inventory", title: "Verifikasi Fisik Selesai", description: "Barang lolos cek fisik, dipacking, dan diserahkan ke antrean Distribusi", pic: "Agus (Gudang)" }
                            )}
                            className="bg-amber-700 hover:bg-amber-800 text-xs h-8"
                          >
                            <PackageCheck size={14} className="mr-1.5" />
                            Konfirmasi: Barang Siap Kirim
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.currentStage === "Inventory").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-slate-500 text-xs">
                          Gudang bersih. Tidak ada pesanan menunggu verifikasi fisik.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </motion.div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DISTRIBUSI & KALENDER PENGIRIMAN */}
        {/* ======================================================== */}
        {activeTab === "distribusi" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* KIRI: ANTREAN SIAP KIRIM */}
            <Card className="xl:col-span-5 shadow-sm border-slate-200">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Truck size={18} className="text-blue-600" />
                      Antrean Distribusi (Siap Plotting)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Pesanan telah diverifikasi gudang dan siap dijadwalkan ke kalender armada.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-800 border-blue-200">
                    {orders.filter(o => o.currentStage === "Distribusi").length} Antrean
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs bg-slate-50/50">
                      <TableHead className="pl-4">Nomor SP & Konsumen</TableHead>
                      <TableHead>Wilayah / Request</TableHead>
                      <TableHead className="text-right pr-4">Plotting Kalender</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {orders.filter(o => o.currentStage === "Distribusi").map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="pl-4">
                          <div className="font-mono font-bold text-blue-700">{o.spNumber}</div>
                          <div className="font-semibold text-slate-800">{o.customerName}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{o.productName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={o.region === "Dalam Kota" ? "default" : "secondary"} className="text-[10px] mb-1">
                            {o.region}
                          </Badge>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {o.requestDate ? `Req: ${o.requestDate}` : "Bebas Rute"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="flex flex-col items-end gap-1">
                            <Button
                              size="sm"
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(
                                o.id,
                                { distributionDate: "2026-08-20", driverName: "Pak Joko (Armada 02)", status: "Diproses" },
                                { division: "Distribusi", title: "Plotting Rute Masuk Kalender", description: "Dijadwalkan pada 20 Agustus Armada Pak Joko", pic: "Hendra (Distribusi)" }
                              )}
                              className="bg-blue-600 hover:bg-blue-700 text-xs h-7 px-2.5"
                            >
                              Plot ke 20 Ags
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isProcessing === o.id}
                              onClick={() => advanceStage(
                                o.id,
                                { currentStage: "Selesai", status: "Selesai", distributionDate: "2026-08-19" },
                                { division: "Distribusi", title: "Serah Terima Selesai (BAST)", description: "Barang telah diterima konsumen dengan baik. SP Ditutup", pic: "Pak Joko (Supir)" }
                              )}
                              className="text-[10px] h-6 px-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                            >
                              Tutup SP (Selesai Kirim)
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.currentStage === "Distribusi").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-slate-500 text-xs">
                          Antrean distribusi kosong. Semua pesanan sudah terjadwal atau telah selesai dikirim.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* KANAN: KALENDER DISTRIBUSI HARIAN (SLOT & KAPASITAS TRUK) */}
            <Card className="xl:col-span-7 shadow-sm border-slate-200 bg-slate-50/50">
              <CardHeader className="bg-white border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarDays size={18} className="text-slate-800" />
                      Kalender Pengiriman & Kuota Armada Harian
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Membatasi kuota muatan harian agar pengiriman tidak overload (Dalam Kota & Luar Kota).
                    </CardDescription>
                  </div>
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                    Max: 5 Trip / Hari
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {calendarDays.map((day) => {
                  const dayItems = plottedOrders.filter(o => o.distributionDate === day.date);
                  const capacity = dayItems.length;
                  const isFull = capacity >= 5;

                  return (
                    <div key={day.date} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                      <div className="flex items-center justify-between mb-3 border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-indigo-600" />
                          <h4 className="text-sm font-semibold text-slate-800">{day.dayName}</h4>
                        </div>
                        <Badge 
                          variant={isFull ? "destructive" : "outline"} 
                          className={isFull ? "text-xs" : "text-xs text-emerald-700 border-emerald-200 bg-emerald-50"}
                        >
                          Kapasitas: {capacity}/5 Slot Terisi
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {dayItems.length === 0 ? (
                          <div className="text-xs text-slate-400 italic py-2">
                            Belum ada jadwal plotting pengiriman pada tanggal ini.
                          </div>
                        ) : (
                          dayItems.map((item) => (
                            <div 
                              key={item.id}
                              className="text-xs bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between transition-colors"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-indigo-700 text-[11px]">{item.spNumber}</span>
                                  <span className="font-semibold text-slate-800">{item.customerName}</span>
                                </div>
                                <div className="text-[11px] text-slate-500">{item.productName} • {item.address}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={item.region === "Dalam Kota" ? "default" : "secondary"} className="text-[10px] h-5">
                                  {item.region}
                                </Badge>
                                {item.status === "Selesai" ? (
                                  <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                                    <CheckCircle2 size={13} /> Selesai BAST
                                  </span>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => advanceStage(
                                      item.id,
                                      { currentStage: "Selesai", status: "Selesai" },
                                      { division: "Distribusi", title: "Serah Terima Selesai", description: "Barang diserahterimakan, pesanan ditutup", pic: "Supir" }
                                    )}
                                    className="text-[10px] h-6 px-2 bg-emerald-600 hover:bg-emerald-700"
                                  >
                                    Konfirmasi Terima
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

          </motion.div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: AI DAILY REPORT & LAPORAN 5 DIVISI (BRIEF POIN 1) */}
        {/* ======================================================== */}
        {activeTab === "digest" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* HERO AI DAILY DIGEST */}
            <Card className="border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <BrainCircuit size={200} />
              </div>
              <CardContent className="p-6 md:p-8 space-y-5 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-2">
                      <Sparkles size={13} className="text-amber-300" />
                      AI Daily Report & Anomaly Detector
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                      Ringkasan Eksekutif Operasional Harian
                    </h2>
                    <p className="text-xs md:text-sm text-indigo-200 mt-1 max-w-2xl">
                      AI secara otomatis membaca seluruh laporan yang masuk dari 5 bagian, mengenali nomor SP/PO yang dibahas, dan mendeteksi potensi keterlambatan.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleGenerateDigest}
                    disabled={isGeneratingDigest}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs md:text-sm shadow-md shrink-0 flex items-center gap-2"
                  >
                    {isGeneratingDigest ? (
                      <><Loader2 className="h-4 w-4 animate-spin text-slate-950" /> Merangkum Laporan 5 Divisi...</>
                    ) : (
                      <><RefreshCw className="h-4 w-4 text-slate-950" /> Generate AI Daily Digest</>
                    )}
                  </Button>
                </div>

                {/* DIGEST CONTENT */}
                {aiDigest && (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15 space-y-4">
                    <div className="flex items-center justify-between text-xs text-indigo-200 border-b border-white/10 pb-2.5">
                      <span>Tanggal Laporan: <strong>{aiDigest.date}</strong></span>
                      <span>Terakhir Diperbarui: <strong>{aiDigest.generatedAt}</strong></span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-100 leading-relaxed">
                      {aiDigest.summary}
                    </p>

                    {/* BOTTLENECKS / ANOMALI DETECTED */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert size={14} /> Peringatan Risiko & Bottleneck Terdeteksi:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {aiDigest.bottlenecks.map((item, idx) => (
                          <div key={idx} className="bg-black/30 border border-amber-500/30 rounded-lg p-3 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-amber-300">{item.spNumber}</span>
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 bg-rose-600">
                                {item.division}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-200">{item.issue}</p>
                            <p className="text-[11px] text-amber-200/90 italic">
                              👉 Saran AI: {item.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HIGHLIGHTS */}
                    <div className="space-y-1.5 pt-2">
                      <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Sorotan Progres Positif:
                      </h4>
                      <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                        {aiDigest.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FEED LAPORAN MASUK DARI 5 DIVISI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* FORM INPUT LAPORAN STAF OPERASIONAL */}
              <Card className="lg:col-span-4 shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText size={18} className="text-indigo-600" />
                    Input Laporan Kerja Sore
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Staf masing-masing bagian menyampaikan catatan harian di sini.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <form onSubmit={handleAddReport} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Divisi Pelapor</label>
                      <select
                        value={newReport.division}
                        onChange={e => setNewReport({...newReport, division: e.target.value as any})}
                        className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs bg-white font-medium"
                      >
                        <option value="Purchasing">Purchasing</option>
                        <option value="Produksi">Produksi</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Distribusi">Distribusi</option>
                        <option value="Koordinator Toko">Koordinator Toko</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Nama Staf / PIC</label>
                      <input
                        required
                        value={newReport.reporter}
                        onChange={e => setNewReport({...newReport, reporter: e.target.value})}
                        className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs"
                        placeholder="Contoh: Rian (Purchasing)"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Nomor SP / PO Terkait (Pisahkan Koma)</label>
                      <input
                        value={newReport.relatedSP}
                        onChange={e => setNewReport({...newReport, relatedSP: e.target.value})}
                        className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs font-mono"
                        placeholder="Contoh: SP-2026-0802, SP-2026-0803"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Catatan Pekerjaan & Kendala Lapangan</label>
                      <textarea
                        required
                        rows={3}
                        value={newReport.notes}
                        onChange={e => setNewReport({...newReport, notes: e.target.value})}
                        className="w-full mt-1 border border-slate-300 rounded-md p-2 text-xs"
                        placeholder="Tuliskan kendala bahan, progres tukang, atau status armada..."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Tingkat Urgensi</label>
                      <select
                        value={newReport.urgency}
                        onChange={e => setNewReport({...newReport, urgency: e.target.value as any})}
                        className="w-full mt-1 border border-slate-300 rounded-md px-3 py-1.5 text-xs bg-white"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Perhatian">Perhatian (Potensi Hambatan)</option>
                        <option value="Kritis">Kritis (Perlu Tindakan Cepat)</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-xs font-medium py-2">
                      Kirim Laporan Harian
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FEED LAPORAN HARIAN MASUK */}
              <Card className="lg:col-span-8 shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare size={18} className="text-indigo-600" />
                      Feed Laporan Harian Operasional (5 Divisi)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Laporan yang masuk otomatis dihubungkan oleh AI berdasarkan nomor SP.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {dailyReports.length} Laporan Tercatat
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {dailyReports.map((rep) => (
                    <div 
                      key={rep.id} 
                      className={`p-3.5 rounded-xl border transition-all ${
                        rep.urgency === "Kritis" ? "bg-red-50/60 border-red-200" :
                        rep.urgency === "Perhatian" ? "bg-amber-50/60 border-amber-200" :
                        "bg-white border-slate-200 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rep.division === "Produksi" ? "bg-orange-100 text-orange-800" :
                            rep.division === "Purchasing" ? "bg-purple-100 text-purple-800" :
                            rep.division === "Inventory" ? "bg-amber-100 text-amber-800" :
                            rep.division === "Distribusi" ? "bg-blue-100 text-blue-800" :
                            "bg-indigo-100 text-indigo-800"
                          }`}>
                            {rep.division}
                          </span>
                          <span className="text-xs font-semibold text-slate-800">{rep.reporter}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{rep.time} WIB</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed mb-2">
                        {rep.notes}
                      </p>

                      {rep.relatedSP && rep.relatedSP.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">Terkait SP:</span>
                          {rep.relatedSP.map((sp, idx) => (
                            <span 
                              key={idx}
                              onClick={() => {
                                const found = orders.find(o => o.spNumber === sp);
                                if (found) setSelectedOrderForTimeline(found);
                              }}
                              className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                            >
                              {sp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>

          </motion.div>
        )}

        {/* ======================================================== */}
        {/* MODAL 1: SINGLE SP AUDIT TRAIL (POIN 1 BRIEF KLIEN) */}
        {/* ======================================================== */}
        <AnimatePresence>
          {selectedOrderForTimeline && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                        Audit Trail Terpusat
                      </span>
                      <span className="font-mono font-bold text-amber-300">{selectedOrderForTimeline.spNumber}</span>
                    </div>
                    <h3 className="text-lg font-bold">
                      {selectedOrderForTimeline.customerName}
                    </h3>
                    <p className="text-xs text-indigo-200">
                      {selectedOrderForTimeline.productName} • {selectedOrderForTimeline.productType}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrderForTimeline(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body: Timeline Journey */}
                <div className="p-6 overflow-y-auto space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Wilayah</span>
                      <span className="font-semibold text-slate-800">{selectedOrderForTimeline.region}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Posisi Saat Ini</span>
                      <span className="font-semibold text-indigo-700">{selectedOrderForTimeline.currentStage}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Pesanan</span>
                      <Badge variant={selectedOrderForTimeline.status === "Selesai" ? "success" : "default"} className="text-[10px] mt-0.5">
                        {selectedOrderForTimeline.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Jadwal Kirim</span>
                      <span className="font-semibold text-slate-800">{selectedOrderForTimeline.distributionDate || "Belum Terjadwal"}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Clock size={14} className="text-indigo-600" />
                      Perjalanan Lengkap Pesanan (Dari Sales s/d Supir)
                    </h4>
                    
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {selectedOrderForTimeline.timeline.map((evt, idx) => (
                        <div key={evt.id || idx} className="relative">
                          <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            evt.status === "completed" ? "bg-emerald-600 text-white" :
                            evt.status === "blocked" ? "bg-rose-600 text-white" :
                            "bg-indigo-600 text-white"
                          }`}>
                            {evt.status === "completed" ? "✓" : evt.status === "blocked" ? "!" : "•"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-800">{evt.title}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                                {evt.division}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                              {evt.description}
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                              <span>🕒 {evt.timestamp}</span>
                              {evt.pic && <span>👤 PIC: {evt.pic}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                  <Button
                    onClick={() => setSelectedOrderForTimeline(null)}
                    className="bg-slate-900 text-white text-xs px-4"
                  >
                    Tutup Riwayat
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* MODAL 2: AI SMART ORDER PARSER (CHAT WA QUICK INPUT) */}
        {/* ======================================================== */}
        <AnimatePresence>
          {isChatParserOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden"
              >
                <div className="p-5 bg-gradient-to-r from-indigo-700 to-violet-800 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                    <div>
                      <h3 className="text-base font-bold">AI Smart Order Parser</h3>
                      <p className="text-xs text-indigo-200">Paste chat WhatsApp konsumen untuk auto-fill formulir</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatParserOpen(false)}
                    className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      Teks Chat WhatsApp atau Catatan Sales Mentah:
                    </label>
                    <textarea
                      rows={5}
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      placeholder="Contoh:&#10;Min tolong buatin sofa custom model L-Shape ukuran 270x180 bahan velvet abu-abu ya.&#10;Nama: Ibu Citra Lestari&#10;Alamat: Jl. Kemang Raya No. 15, Jakarta Selatan&#10;Kirim tgl 25 Agustus ya."
                      className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-lg p-3 text-[11px] text-indigo-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <BrainCircuit size={13} className="text-indigo-600" /> Cara Kerja AI:
                    </div>
                    <p className="text-slate-600">
                      Model Gemini akan mengekstrak Nama, Tipe Produk (Ready / Custom Sofa / Mebel), Wilayah, Tanggal Request, dan Status Gambar Kerja langsung ke formulir.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsChatParserOpen(false)}
                    className="text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleParseChat}
                    disabled={isParsingChat || !chatInputText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    {isParsingChat ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengekstrak Chat...</>
                    ) : (
                      <><Sparkles size={14} className="text-amber-300" /> Ekstrak ke Form SP</>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
}
