"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, ShoppingBag, Hammer, Warehouse, Truck, 
  BrainCircuit, Sparkles, CheckCircle2, RotateCcw, ExternalLink
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOperationsStore } from "@/lib/operations-store";

// Sub-components
import TokoSection from "./components/TokoSection";
import PurchasingSection from "./components/PurchasingSection";
import ProduksiSection from "./components/ProduksiSection";
import InventorySection from "./components/InventorySection";
import DistribusiSection from "./components/DistribusiSection";
import DailyReportSection from "./components/DailyReportSection";

type TabType = "sales" | "purchasing" | "produksi" | "inventory" | "distribusi" | "digest";

function OperationsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "sales";

  const {
    isHydrated,
    orders,
    purchasingOrders,
    productionOrders,
    distributionOrders,
    stockItems,
    dailyReports,
    resetAllData
  } = useOperationsStore();

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType;
    if (tabParam && ["sales", "purchasing", "produksi", "inventory", "distribusi", "digest"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    if (confirm("Reset seluruh data simulasi ke kondisi awal bersih?")) {
      resetAllData();
      showNotification("Data simulasi berhasil direset ke kondisi awal!");
    }
  };

  const criticalStockCount = stockItems.filter(s => s.status === "Kritis" || s.status === "Mendekati Minimum").length;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Lovise Sofa ERP
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Operations Hub Terpadu
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Pusat Kendali Operasional Terintegrasi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Satu identitas nomor SP / PO menghubungkan 5 divisi: Koordinator Toko, Purchasing, Produksi, Inventory, & Distribusi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs text-slate-600 border-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
            title="Bersihkan data untuk simulasi ulang dari nol"
          >
            <RotateCcw size={13} />
            Reset Simulasi
          </Button>
        </div>
      </div>

      {/* Metric Counters Across 5 Divisions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-medium truncate">Pesanan Masuk</div>
            <div className="text-xl font-bold text-slate-900">{orders.length}</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-medium truncate">PO Purchasing</div>
            <div className="text-xl font-bold text-purple-700">{purchasingOrders.length}</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <Hammer className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-medium truncate">SPK Produksi</div>
            <div className="text-xl font-bold text-amber-700">{productionOrders.length}</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
            <Warehouse className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-medium truncate">Stok Kritis</div>
            <div className="text-xl font-bold text-red-600">{criticalStockCount}</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 font-medium truncate">Antrean Kirim</div>
            <div className="text-xl font-bold text-emerald-600">{distributionOrders.length}</div>
          </div>
        </div>
      </div>

      {/* SEGMENTED TAB NAVIGATION (NOW WITH SEPARATE PURCHASING & PRODUKSI) */}
      <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-xl overflow-x-auto border border-slate-200/80 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {[
          { 
            id: "sales", 
            label: "1. Koordinator Toko & SP", 
            icon: <ClipboardList size={15} />, 
            badge: orders.filter(o => o.currentStage === "Kepala Toko").length 
          },
          { 
            id: "purchasing", 
            label: "2. Purchasing & PO", 
            icon: <ShoppingBag size={15} />, 
            badge: purchasingOrders.length 
          },
          { 
            id: "produksi", 
            label: "3. Produksi Pabrik", 
            icon: <Hammer size={15} />, 
            badge: productionOrders.length 
          },
          { 
            id: "inventory", 
            label: "4. Inventory Gudang", 
            icon: <Warehouse size={15} />, 
            badge: criticalStockCount > 0 ? criticalStockCount : undefined 
          },
          { 
            id: "distribusi", 
            label: "5. Logistik & Distribusi", 
            icon: <Truck size={15} />, 
            badge: distributionOrders.length 
          },
          { 
            id: "digest", 
            label: "6. AI Daily Digest (5 Divisi)", 
            icon: <BrainCircuit size={15} />, 
            highlight: true 
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
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
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.id ? "bg-indigo-100 text-indigo-800" : "bg-slate-200 text-slate-700"
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <AnimatePresence mode="wait">
        {activeTab === "sales" && (
          <motion.div key="sales" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <TokoSection onNotify={showNotification} onNavigateTab={setActiveTab} />
          </motion.div>
        )}

        {activeTab === "purchasing" && (
          <motion.div key="purchasing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <PurchasingSection onNotify={showNotification} />
          </motion.div>
        )}

        {activeTab === "produksi" && (
          <motion.div key="produksi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <ProduksiSection onNotify={showNotification} />
          </motion.div>
        )}

        {activeTab === "inventory" && (
          <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <InventorySection onNotify={showNotification} />
          </motion.div>
        )}

        {activeTab === "distribusi" && (
          <motion.div key="distribusi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <DistribusiSection onNotify={showNotification} />
          </motion.div>
        )}

        {activeTab === "digest" && (
          <motion.div key="digest" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <DailyReportSection onNotify={showNotification} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OperationsModule() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Operations Hub" },
      ]}
      vacancyTitle="Lovise Sofa — Multi-Division Operations Hub"
    >
      <Suspense fallback={
        <div className="p-8 text-center text-slate-500">
          Memuat Pusat Kendali Operasional Lovise...
        </div>
      }>
        <OperationsContent />
      </Suspense>
    </AppLayout>
  );
}
