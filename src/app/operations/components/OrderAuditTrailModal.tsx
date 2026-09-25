"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SalesOrder } from "@/types/operations";

interface OrderAuditTrailModalProps {
  order: SalesOrder | null;
  onClose: () => void;
}

export default function OrderAuditTrailModal({ order, onClose }: OrderAuditTrailModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Audit Trail Terpusat (Single SP Identity)
                </span>
                <span className="font-mono font-bold text-amber-300">{order.spNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  order.sourceType === "Kebutuhan Stok" ? "bg-emerald-500/30 text-emerald-300" : "bg-blue-500/30 text-blue-300"
                }`}>
                  {order.sourceType}
                </span>
              </div>
              <h3 className="text-lg font-bold">{order.customerName}</h3>
              <p className="text-xs text-indigo-200">{order.productName} • {order.productType}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {order.sourceImage && (
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-indigo-600" /> Dokumen Fisik / Screenshot Terlampir:
                </span>
                <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-white max-h-40 flex items-center justify-center p-2">
                  <img src={order.sourceImage} alt="Dokumen SP" className="max-h-36 object-contain rounded" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Wilayah</span>
                <span className="font-semibold text-slate-800">{order.region}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Posisi Saat Ini</span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 inline-block">
                  {order.currentStage}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Pesanan</span>
                <span className={`font-bold inline-block px-1.5 py-0.5 rounded text-[11px] ${
                  order.status === "Selesai" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {order.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Permintaan Kirim</span>
                <span className="font-semibold text-slate-800">{order.requestDate || order.distributionDate || "Standar"}</span>
              </div>
            </div>

            {order.address && (
              <div className="text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Alamat Tujuan:</span>
                {order.address}
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Clock size={14} className="text-indigo-600" />
                Riwayat Perjalanan Pesanan Lintas Divisi ({order.timeline?.length || 0} Aktivitas)
              </h4>
              
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {order.timeline && order.timeline.length > 0 ? (
                  order.timeline.map((evt, idx) => (
                    <div key={evt.id || idx} className="relative">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        evt.status === "completed" ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"
                      }`}>
                        {evt.status === "completed" ? "✓" : "•"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-800">{evt.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {evt.division}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{evt.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span>🕒 {evt.timestamp}</span>
                          {evt.pic && <span>👤 PIC: {evt.pic}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Belum ada riwayat aktivitas tercatat.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
            <Button variant="outline" onClick={onClose} className="text-xs">
              Tutup
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
