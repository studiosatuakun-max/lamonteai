"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, CheckCircle2, UserCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import DistribusiSection from "../operations/components/DistribusiSection";

export default function DistribusiModulePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Role 7: Distribusi & Logistik", href: "/distribusi" },
      ]}
      vacancyTitle="Lovise Sofa — Dashboard Distribusi & Logistik"
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
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <UserCheck size={12} />
                Role: Distribusi & Logistik
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Truck className="h-7 w-7 text-blue-600" />
              Dashboard Distribusi & Logistik
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Plotting Surat Jalan (SJ), warning perakitan & packing, pencatatan durasi/petugas Tim GS, armada truk internal vs ekspedisi kargo, serta integrasi WhatsApp blast.
            </p>
          </div>
        </div>

        {/* Distribusi Component */}
        <DistribusiSection onNotify={showNotification} />
      </div>
    </AppLayout>
  );
}
