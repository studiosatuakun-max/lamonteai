"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Warehouse, CheckCircle2, UserCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import InventorySection from "../operations/components/InventorySection";

export default function InventoryModulePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Operations", href: "/operations" },
        { label: "Role 6: Inventory Gudang", href: "/inventory" },
      ]}
      vacancyTitle="Lovise Sofa — Dashboard Inventory & Gudang"
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
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <UserCheck size={12} />
                Role: Staff Inventory / Gudang
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Warehouse className="h-7 w-7 text-emerald-600" />
              Dashboard Inventory & Gudang
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Monitoring stok fisik bahan baku (busa/kain/rangka) & sofa jadi, penerimaan barang lolos QC, alokasi pesanan konsumen, serta release barang ke pengiriman.
            </p>
          </div>
        </div>

        {/* Inventory Component */}
        <InventorySection onNotify={showNotification} />
      </div>
    </AppLayout>
  );
}
