"use client";

import React, { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, Warehouse, Truck, CheckCircle2, AlertTriangle, 
  FilePlus2, PackageCheck, CalendarDays, ShoppingBag, Loader2, 
  PenTool, BrainCircuit, Hammer, Sparkles, MessageSquare, 
  Clock, ShieldAlert, ArrowRight, RefreshCw, X, ChevronRight, 
  FileText, Check, AlertCircle, Phone, MapPin, User, Send, 
  Layers, Package, Calendar, AlertOctagon, Info,
  Camera, Image as ImageIcon, Upload, Scan, Smartphone, Eye, ExternalLink, Play
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
  parseOrderFromImage,
  generateDailyDigestAction 
} from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import AppLayout from "@/components/AppLayout";

// SVG Mock Presets for Instant Multimodal Demo
const DEMO_WA_SCREENSHOT = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
  <rect width="480" height="320" fill="#EFEAE2"/>
  <rect width="480" height="52" fill="#075E54"/>
  <circle cx="32" cy="26" r="16" fill="#128C7E"/>
  <text x="60" y="26" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="bold">Ibu Dian Permata Sari (081288991122)</text>
  <text x="60" y="41" fill="#C5E2DC" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11">Online • WhatsApp Chat</text>
  
  <rect x="24" y="70" width="340" height="95" rx="12" fill="#FFFFFF"/>
  <text x="38" y="94" fill="#1E293B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Halo min, mau pesan custom sofa L-Shape:</text>
  <text x="38" y="114" fill="#047857" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">• Sofa Modular L-Shape (Ukuran 280x180cm)</text>
  <text x="38" y="134" fill="#1E293B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">• Bahan Velvet Emerald Green #04, busa kenyal</text>
  <text x="38" y="152" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10">10:14 • Terkirim</text>
  
  <rect x="24" y="178" width="360" height="115" rx="12" fill="#FFFFFF"/>
  <text x="38" y="202" fill="#1E293B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Alamat: Jl. Senopati No. 88, Kebayoran Baru, Jaksel.</text>
  <text x="38" y="222" fill="#2563EB" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">Tgl kirim: Minta diantar tanggal 30 Agustus 2026 ya.</text>
  <text x="38" y="242" fill="#1E293B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Gambar kerja sudah ada dari arsitek kami.</text>
  <text x="38" y="262" fill="#059669" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="bold">✓ Gambar Kerja: Ada / Lengkap</text>
  <text x="38" y="280" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10">10:16 • Dibaca</text>
</svg>
`);

const DEMO_PAPER_SP = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
  <rect width="480" height="320" fill="#FFFDF8" stroke="#E2E8F0" stroke-width="2"/>
  <rect x="20" y="18" width="440" height="42" fill="#0F172A" rx="6"/>
  <text x="36" y="44" fill="#F8FAFC" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="bold">LOVISE SOFA — FORMULIR PESANAN TOKO</text>
  <text x="380" y="44" fill="#F59E0B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="bold">SP-092</text>
  
  <line x1="20" y1="72" x2="460" y2="72" stroke="#CBD5E1" stroke-dasharray="4"/>
  <text x="30" y="98" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Nama Konsumen:</text>
  <text x="160" y="98" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">Bpk. Hendra Gunawan (081377889900)</text>
  
  <text x="30" y="125" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Produk Pesanan:</text>
  <text x="160" y="125" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">Sofa Chesterfield 3 Seater Classic Brown</text>
  
  <text x="30" y="152" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Jenis Pesanan:</text>
  <text x="160" y="152" fill="#D97706" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">[X] PO Sofa Custom Pabrik</text>
  
  <text x="30" y="179" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Alamat Kirim:</text>
  <text x="160" y="179" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Sentul Alaya Cluster Victoria Blok D-15, Bogor</text>
  
  <text x="30" y="206" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Wilayah / Tgl:</text>
  <text x="160" y="206" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Luar Kota • Request: 5 Sept 2026</text>
  
  <text x="30" y="233" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Gambar Kerja:</text>
  <text x="160" y="233" fill="#DC2626" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">[ ] Belum ada (Menyusul via arsitek)</text>
  
  <rect x="25" y="252" width="430" height="48" fill="#F8FAFC" rx="6" stroke="#E2E8F0"/>
  <text x="38" y="272" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11">Catatan: Bahan kulit sintetis grade A, warna dark brown coklat tua.</text>
  <text x="38" y="288" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10">Dicatat oleh Sales: Toko Fatmawati (Sarah) — 24/09/2026</text>
</svg>
`);

export default function OperationsModule() {
  // State Data
  const [orders, setOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [dailyReports, setDailyReports] = useState<DailyReportEntry[]>(mockDailyReports);
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [aiDigest, setAiDigest] = useState<AIDigestResult | null>(initialAIDigest);
  
  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<"sales" | "produksi_purchasing" | "inventory" | "distribusi" | "digest">("sales");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Guided Simulation Toast
  const [workflowToast, setWorkflowToast] = useState<{
    spNumber: string;
    message: string;
    targetTab: "sales" | "produksi_purchasing" | "inventory" | "distribusi" | "digest";
    stageName: string;
  } | null>(null);

  // Modals State
  const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState<SalesOrder | null>(null);
  const [isChatParserOpen, setIsChatParserOpen] = useState(false);
  const [parserMode, setParserMode] = useState<"text" | "upload" | "camera">("upload");
  const [chatInputText, setChatInputText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(DEMO_WA_SCREENSHOT);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>("Screenshot_WA_Ibu_Dian.jpg");
  const [activePreset, setActivePreset] = useState<"wa_screenshot" | "paper_sp" | null>("wa_screenshot");
  const [isParsingChat, setIsParsingChat] = useState(false);
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    notes: "",
    sourceImage: undefined
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
        const targetTab = 
          result.data.currentStage === "Produksi" || result.data.currentStage === "Purchasing" ? "produksi_purchasing" :
          result.data.currentStage === "Inventory" || result.data.currentStage === "Kepala Toko" ? "inventory" :
          result.data.currentStage === "Distribusi" ? "distribusi" : "sales";

        setWorkflowToast({
          spNumber: result.data.spNumber,
          message: `Pesanan baru ${result.data.spNumber} berhasil dibuat dan otomatis dialirkan ke bagian ${result.data.currentStage}!`,
          targetTab: targetTab,
          stageName: result.data.currentStage
        });

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
          notes: "",
          sourceImage: undefined
        });
        setFormMessage({ type: 'success', text: result.message });
        setTimeout(() => setFormMessage(null), 4000);
      } else {
        setFormMessage({ type: 'error', text: result.message || 'Terjadi kesalahan' });
      }
    });
  };

  // Image Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setActivePreset(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: "wa_screenshot" | "paper_sp") => {
    setActivePreset(preset);
    setUploadedImage(preset === "wa_screenshot" ? DEMO_WA_SCREENSHOT : DEMO_PAPER_SP);
    setUploadedFileName(preset === "wa_screenshot" ? "Screenshot_WA_Ibu_Dian.jpg" : "Foto_Nota_SP_Fatmawati_092.jpg");
  };

  // Execute AI Extraction (Text OR Image)
  const handleExecuteAIExtraction = async () => {
    setIsParsingChat(true);

    if (parserMode === "text") {
      if (!chatInputText.trim()) {
        setIsParsingChat(false);
        return;
      }
      const res = await parseOrderFromChat(chatInputText);
      setIsParsingChat(false);

      if (res.success && res.data) {
        applyParsedData(res.data);
      }
    } else {
      // Image or Camera mode
      const res = await parseOrderFromImage({
        imageData: uploadedImage || undefined,
        fileName: uploadedFileName || undefined,
        samplePreset: activePreset || undefined
      });
      setIsParsingChat(false);

      if (res.success && res.data) {
        applyParsedData(res.data, uploadedImage || undefined);
      }
    }
  };

  const applyParsedData = (data: Partial<CreateOrderPayload>, imageUri?: string) => {
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
      sourceImage: imageUri || data.sourceImage || prev.sourceImage
    }));
    setIsChatParserOpen(false);
    setChatInputText("");
    setFormMessage({ 
      type: 'success', 
      text: parserMode === "text" 
        ? 'Data dari Chat WhatsApp berhasil diekstrak AI ke Formulir!' 
        : 'Gemini Multimodal Vision berhasil mengekstrak dokumen gambar ke Formulir!' 
    });
    setTimeout(() => setFormMessage(null), 5000);
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

  // Advance Order Stages with Audit Trail and Guided Workflow Toast
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

        // Trigger workflow toast
        if (updates.currentStage) {
          const targetTab = 
            updates.currentStage === "Produksi" || updates.currentStage === "Purchasing" ? "produksi_purchasing" :
            updates.currentStage === "Inventory" || updates.currentStage === "Kepala Toko" ? "inventory" :
            updates.currentStage === "Distribusi" ? "distribusi" : "sales";
          
          setWorkflowToast({
            spNumber: o.spNumber,
            message: `Pesanan ${o.spNumber} berhasil dipindahkan ke alur ${updates.currentStage}!`,
            targetTab: targetTab,
            stageName: updates.currentStage
          });
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
      notes: `Restock otomatis karena sisa stok ${item.currentStock} ${item.unit} (batas aman ${item.minStock} ${item.unit})`,
      sourceImage: undefined
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
              <span className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shadow-xs">
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

          {/* Quick Action Button for Multimodal Vision & Chat */}
          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setIsChatParserOpen(true)}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md text-xs md:text-sm font-semibold flex items-center gap-2 px-4 py-2 rounded-xl"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              AI Smart Input (Chat / Gambar / Kamera)
            </Button>
          </div>
        </div>

        {/* GUIDED WORKFLOW SIMULATION TOAST BANNER */}
        <AnimatePresence>
          {workflowToast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-indigo-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs md:text-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-amber-400 text-slate-950 rounded-lg font-bold flex items-center justify-center">
                  <Play size={14} className="fill-slate-950" />
                </span>
                <div>
                  <span className="text-amber-300 font-bold mr-1.5">Alur Berjalan Otomatis:</span>
                  <span>{workflowToast.message}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setActiveTab(workflowToast.targetTab);
                    setWorkflowToast(null);
                  }}
                  className="px-3 py-1 bg-white text-indigo-950 rounded-lg font-bold text-xs hover:bg-indigo-50 flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  Buka Tab {workflowToast.stageName} <ArrowRight size={13} />
                </button>
                <button 
                  onClick={() => setWorkflowToast(null)} 
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            
            {/* ALERT RESTOCK WIDGET JIKA ADA STOK KRITIS (GRID VIEW - NO SWIPE) */}
            {stockItems.some(s => s.status === "Kritis" || s.status === "Mendekati Minimum") && (
              <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 border border-amber-200 rounded-xl p-4 md:p-5 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                      <AlertOctagon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-950">
                        Peringatan Kebutuhan Stok (Restock Trigger)
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Sistem mendeteksi <strong>{stockItems.filter(s => s.status === "Kritis").length} bahan kritis</strong> dan <strong>{stockItems.filter(s => s.status === "Mendekati Minimum").length} bahan mendekati batas minimum</strong>.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200 w-max">
                    Klik item untuk auto-fill form restock
                  </span>
                </div>

                {/* Grid 3 Kolom - Terbuka Semua Tanpa Swipe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stockItems.filter(s => s.status !== "Aman").map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-amber-200/90 p-3.5 shadow-2xs hover:shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between gap-2.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {item.category}
                          </span>
                          <Badge 
                            variant={item.status === "Kritis" ? "destructive" : "warning"} 
                            className="text-[10px] px-1.5 py-0 h-4 font-bold"
                          >
                            {item.status === "Kritis" ? "🔴 Kritis" : "🟡 Menipis"}
                          </Badge>
                        </div>
                        <h5 className="text-xs font-bold text-slate-800 line-clamp-1">
                          {item.name}
                        </h5>
                        <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                          <span>Sisa: <strong className={item.status === "Kritis" ? "text-rose-600" : "text-amber-700"}>{item.currentStock} {item.unit}</strong></span>
                          <span className="text-slate-400">Batas Aman: {item.minStock} {item.unit}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerRestockForm(item)}
                        className="w-full mt-1 py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>⚡ Buat PO Restock ({item.recommendedRestock} {item.unit})</span>
                        <ArrowRight size={13} className="text-amber-600" />
                      </button>
                    </div>
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
                      className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                    >
                      <Sparkles size={13} className="text-amber-500" /> AI Input (Foto / WA)
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

                    {/* Image Attachment Preview if extracted from Vision */}
                    {newOrder.sourceImage && (
                      <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <ImageIcon size={15} className="text-indigo-600" />
                          <span className="font-medium text-indigo-900">Dokumen Foto/Screenshot Terlampir</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Terverifikasi AI Vision
                        </span>
                      </div>
                    )}

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
                  <Badge variant="outline" className="text-xs font-medium">
                    {filteredOrders.length} Pesanan Terdaftar
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
                              {o.sourceImage && (
                                <span className="block text-[9px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-1 rounded w-max mt-0.5">
                                  📷 Ada Foto SP
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
                            <span>Shift 1 (Spesialis Jok & Rangka)</span>
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
                              { division: "Produksi", title: "Produksi Selesai (Lolos QC)", description: "Barang lolos QC pabrik dan dikirim ke Gudang Lovise", pic: "Mandor Pabrik (Maman)" }
                            )}
                            className="bg-orange-600 hover:bg-orange-700 text-xs h-8"
                          >
                            {isProcessing === o.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : o.productionStage !== "QC & Selesai" ? (
                              "Pilih QC Dulu"
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
                                { division: "Purchasing", title: "PO Supplier Terbit", description: `PO dikirim ke vendor ${o.supplierName || 'PT Indo Kayu Sejahtera'}`, pic: "Indah (Purchasing)" }
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
                                { division: "Purchasing", title: "Supplier Konfirmasi Kirim", description: "Barang dikirim supplier menuju Gudang Lovise", pic: "Indah (Purchasing)" }
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
                                { division: "Distribusi", title: "Plotting Rute Masuk Kalender", description: "Dijadwalkan pada 20 Agustus Armada Pak Joko (Luar Kota)", pic: "Hendra (Distribusi)" }
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
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs md:text-sm shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
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
                        Audit Trail Terpusat (Single SP Identity)
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
                  
                  {/* Dokumen Terlampir if available */}
                  {selectedOrderForTimeline.sourceImage && (
                    <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-indigo-600" /> Dokumen Fisik / Screenshot Terlampir:
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                          Terdigitalisasi AI Vision
                        </span>
                      </div>
                      <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-white max-h-40 flex items-center justify-center p-2">
                        <img 
                          src={selectedOrderForTimeline.sourceImage} 
                          alt="Dokumen SP Asli" 
                          className="max-h-36 object-contain rounded"
                        />
                      </div>
                    </div>
                  )}

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

                {/* Modal Footer with In-Modal Simulation Helper */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Posisi: <strong>{selectedOrderForTimeline.currentStage}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* In-Modal Simulation Step Trigger */}
                    {selectedOrderForTimeline.currentStage === "Kepala Toko" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          advanceStage(
                            selectedOrderForTimeline.id,
                            { hasBlueprint: true, currentStage: "Produksi", productionStage: "Potong Rangka", status: "Diproses" },
                            { division: "Koordinator Toko", title: "SPK Diteruskan ke Pabrik", description: "Gambar kerja diverifikasi & SPK diterbitkan ke Mandor Pabrik", pic: "Doni (Koord. Toko)" }
                          );
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
                      >
                        ⚡ Simulasikan: SPK ke Pabrik
                      </Button>
                    )}
                    {selectedOrderForTimeline.currentStage === "Produksi" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          advanceStage(
                            selectedOrderForTimeline.id,
                            { currentStage: "Inventory", productionStage: "QC & Selesai", status: "Pending" },
                            { division: "Produksi", title: "Pengerjaan Pabrik Selesai", description: "Lolos QC tukang & diserahkan ke Gudang", pic: "Maman (Produksi)" }
                          );
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-8"
                      >
                        ⚡ Simulasikan: Kirim ke Gudang
                      </Button>
                    )}
                    {selectedOrderForTimeline.currentStage === "Inventory" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          advanceStage(
                            selectedOrderForTimeline.id,
                            { currentStage: "Distribusi", status: "Pending" },
                            { division: "Inventory", title: "Verifikasi Gudang Lengkap", description: "Barang siap kirim diserahkan ke Distribusi", pic: "Agus (Gudang)" }
                          );
                        }}
                        className="bg-amber-700 hover:bg-amber-800 text-white text-xs h-8"
                      >
                        ⚡ Simulasikan: Siap Kirim
                      </Button>
                    )}
                    {selectedOrderForTimeline.currentStage === "Distribusi" && selectedOrderForTimeline.status !== "Selesai" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          advanceStage(
                            selectedOrderForTimeline.id,
                            { currentStage: "Selesai", status: "Selesai", distributionDate: "2026-08-20" },
                            { division: "Distribusi", title: "Serah Terima Konsumen (BAST)", description: "Barang diterima, pesanan ditutup", pic: "Pak Joko (Supir)" }
                          );
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                      >
                        ⚡ Simulasikan: Tutup SP (Selesai BAST)
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => setSelectedOrderForTimeline(null)}
                      variant="outline"
                      className="text-xs px-3 h-8"
                    >
                      Tutup
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* MODAL 2: AI SMART ORDER PARSER (CHAT / UPLOAD IMAGE / KAMERA HP) */}
        {/* ======================================================== */}
        <AnimatePresence>
          {isChatParserOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800 text-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-amber-400 text-slate-900 rounded-lg">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold">AI Smart Order Parser (Gemini Multimodal)</h3>
                      <p className="text-xs text-indigo-200">Ekstrak data pesanan dari Chat WhatsApp, Foto Nota SP, atau Kamera HP</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatParserOpen(false)}
                    className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-3 p-2 bg-slate-100 border-b text-xs font-semibold shrink-0">
                  <button
                    type="button"
                    onClick={() => setParserMode("upload")}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      parserMode === "upload" 
                        ? "bg-white text-indigo-700 shadow-xs font-bold" 
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ImageIcon size={14} /> Upload Foto / Screenshot
                  </button>
                  <button
                    type="button"
                    onClick={() => setParserMode("camera")}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      parserMode === "camera" 
                        ? "bg-white text-indigo-700 shadow-xs font-bold" 
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Camera size={14} /> Kamera HP Langsung
                  </button>
                  <button
                    type="button"
                    onClick={() => setParserMode("text")}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      parserMode === "text" 
                        ? "bg-white text-indigo-700 shadow-xs font-bold" 
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <MessageSquare size={14} /> Teks Chat WA
                  </button>
                </div>

                {/* Modal Content Body */}
                <div className="p-5 overflow-y-auto space-y-4">
                  
                  {/* 1. MODE: UPLOAD FOTO / SCREENSHOT */}
                  {parserMode === "upload" && (
                    <div className="space-y-3.5">
                      {/* Presets Bar for Instant Client Demo */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-slate-700">Contoh Dokumen Demo (1-Klik Presentasi):</span>
                          <span className="text-[10px] text-slate-400">Pilih salah satu untuk tes cepat</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectPreset("wa_screenshot")}
                            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                              activePreset === "wa_screenshot" 
                                ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-bold" 
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="p-1 bg-emerald-100 text-emerald-800 rounded">📱</span>
                            <div>
                              <div className="leading-tight">Screenshot Chat WA</div>
                              <div className="text-[10px] text-slate-400 font-normal">Sofa Modular Emerald</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelectPreset("paper_sp")}
                            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                              activePreset === "paper_sp" 
                                ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-bold" 
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="p-1 bg-amber-100 text-amber-800 rounded">📝</span>
                            <div>
                              <div className="leading-tight">Foto Nota SP Kertas</div>
                              <div className="text-[10px] text-slate-400 font-normal">Formulir Toko No. 092</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Dropzone Area */}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />

                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 rounded-xl p-4 text-center cursor-pointer transition-colors space-y-1.5"
                      >
                        <div className="inline-flex p-2 bg-indigo-100 text-indigo-700 rounded-full">
                          <Upload size={18} />
                        </div>
                        <div className="text-xs font-semibold text-slate-800">
                          Klik untuk upload gambar atau drag & drop file di sini
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Mendukung screenshot chat, foto SP nota kertas, struk kasir, atau PDF pesanan (JPG, PNG)
                        </p>
                      </div>

                      {/* Image Preview & Laser Scan Animation */}
                      {uploadedImage && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">Preview Dokumen Terpilih:</span>
                            <span className="text-[11px] font-mono text-indigo-600">{uploadedFileName}</span>
                          </div>
                          
                          <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center max-h-56">
                            <img 
                              src={uploadedImage} 
                              alt="Uploaded Preview" 
                              className="w-full max-h-56 object-contain"
                            />
                            
                            {/* Futuristic Scanning Animation while AI analyzes */}
                            {isParsingChat && (
                              <motion.div
                                initial={{ top: "0%" }}
                                animate={{ top: ["0%", "95%", "0%"] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] pointer-events-none"
                              />
                            )}

                            {isParsingChat && (
                              <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[1px] flex items-center justify-center">
                                <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border border-cyan-400/40 shadow-lg">
                                  <Scan className="h-4 w-4 text-cyan-300 animate-pulse" />
                                  Gemini Multimodal Vision mendeteksi teks...
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. MODE: KAMERA HP LANGSUNG */}
                  {parserMode === "camera" && (
                    <div className="space-y-4 text-center py-2">
                      <input 
                        type="file" 
                        ref={cameraInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden" 
                      />

                      <div className="border border-slate-200 rounded-2xl p-6 bg-gradient-to-b from-slate-50 to-white space-y-4">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                          <Camera size={32} />
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900">
                            Ambil Foto Langsung via Kamera
                          </h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Arahkan kamera ke formulir SP kertas toko, faktur fisik, atau sketsa gambar kerja pesanan custom.
                          </p>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                          <Button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 flex items-center gap-2 shadow-sm w-full sm:w-auto"
                          >
                            <Camera size={15} /> Buka Kamera HP
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              handleSelectPreset("paper_sp");
                              setParserMode("upload");
                            }}
                            className="text-xs text-slate-700 border-slate-300 hover:bg-slate-100 w-full sm:w-auto"
                          >
                            Simulasikan Hasil Foto Nota
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. MODE: TEKS CHAT WA */}
                  {parserMode === "text" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700">
                          Teks Chat WhatsApp Mentah:
                        </label>
                        <button
                          type="button"
                          onClick={() => setChatInputText(
                            "Min tolong buatin sofa custom model L-Shape ukuran 270x180 bahan velvet emerald green ya.\nNama: Ibu Citra Lestari (081299887766)\nAlamat: Jl. Kemang Raya No. 15, Jakarta Selatan\nKirim tgl 28 Agustus ya. Gambar kerja sudah ada."
                          )}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          + Isi Contoh Chat
                        </button>
                      </div>

                      <textarea
                        rows={5}
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        placeholder="Contoh:&#10;Min tolong buatin sofa custom model L-Shape ukuran 270x180 bahan velvet abu-abu ya.&#10;Nama: Ibu Citra Lestari&#10;Alamat: Jl. Kemang Raya No. 15, Jakarta Selatan&#10;Kirim tgl 25 Agustus ya."
                        className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* AI Explanation Banner */}
                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200/80 rounded-xl p-3 text-[11px] text-indigo-950 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <BrainCircuit size={13} className="text-indigo-600" /> 
                      {parserMode === "text" ? "Gemini Text Extraction:" : "Gemini Multimodal Vision OCR:"}
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {parserMode === "text" 
                        ? "AI membaca konteks chat dan mengekstrak Nama, Produk, Wilayah, Tanggal Request, dan Status Gambar Kerja."
                        : "AI mengenali tulisan tangan nota fisik maupun tangkapan layar, membaca field pesanan, dan mengisikannya otomatis ke formulir tanpa ketik ulang."}
                    </p>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsChatParserOpen(false)}
                    className="text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleExecuteAIExtraction}
                    disabled={isParsingChat || (parserMode === "text" && !chatInputText.trim()) || (parserMode !== "text" && !uploadedImage)}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm px-4"
                  >
                    {isParsingChat ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menganalisis dengan Gemini AI...</>
                    ) : (
                      <><Sparkles size={14} className="text-amber-300" /> Ekstrak ke Formulir SP</>
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
