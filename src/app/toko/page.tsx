"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, CheckCircle2, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import TokoSection from "../operations/components/TokoSection";

export default function TokoModulePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Role 3: Koordinator Toko", href: "/toko" },
      ]}
      vacancyTitle="Lovise Sofa — Dashboard Koordinator Toko"
    >
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

        {/* Role Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Lovise Sofa ERP
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                <UserCheck size={12} />
                Role: Koordinator Operasional (Toko)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <ClipboardList className="h-7 w-7 text-indigo-600" />
              Dashboard Koordinator Toko
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Penerimaan pesanan masuk (Penjualan, Stok, Event, Komplain), validasi gambar kerja teknis, dan klasifikasi routing alur pesanan (Ready / PO Pabrikan / PO Produksi).
            </p>
          </div>
        </div>

        {/* Toko Component */}
        <TokoSection onNotify={showNotification} />
      </div>
    </AppLayout>
  );
}
