"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, CheckCircle2, UserCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import PurchasingSection from "../operations/components/PurchasingSection";

export default function PurchasingModulePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Role 4: Purchasing", href: "/purchasing" },
      ]}
      vacancyTitle="Lovise Sofa — Dashboard Purchasing"
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
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                <UserCheck size={12} />
                Role: Purchasing Officer
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-purple-600" />
              Dashboard Purchasing & Pengadaan
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Rekomendasi supplier otomatis (Harga, Lead Time, Fleksibilitas Tempo), kalkulator kebutuhan restock cerdas, dan penerbitan Purchase Order (PO) ke pabrikan/supplier luar.
            </p>
          </div>
        </div>

        {/* Purchasing Component */}
        <PurchasingSection onNotify={showNotification} />
      </div>
    </AppLayout>
  );
}
