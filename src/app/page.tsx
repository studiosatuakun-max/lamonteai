"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Briefcase, Factory, Sparkles, ArrowRight, 
  ShoppingBag, Hammer, ClipboardList, Warehouse, Truck, LayoutDashboard 
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const roles = [
    {
      id: "hr",
      roleNumber: "Role 1",
      title: "HR Manager",
      persona: "Siti Rahma",
      description: "Rekrutmen cerdas, AI CV Screening, dan evaluasi KPI kinerja karyawan.",
      icon: <Users className="h-7 w-7 text-indigo-400 mb-2" />,
      colorBadge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      path: "/hr",
    },
    {
      id: "finance",
      roleNumber: "Role 2",
      title: "Finance (FAT)",
      persona: "Hendra Wijaya",
      description: "Rekonsiliasi mutasi bank, deteksi anomali transaksi, dan arus kas.",
      icon: <Briefcase className="h-7 w-7 text-blue-400 mb-2" />,
      colorBadge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      path: "/finance",
    },
    {
      id: "toko",
      roleNumber: "Role 3",
      title: "Koordinator Toko",
      persona: "Rina Melati",
      description: "Penerimaan SP (4 pemicu), validasi blueprint teknis, dan klasifikasi routing alur.",
      icon: <ClipboardList className="h-7 w-7 text-amber-400 mb-2" />,
      colorBadge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      path: "/toko",
    },
    {
      id: "purchasing",
      roleNumber: "Role 4",
      title: "Purchasing",
      persona: "Eko Prasetyo",
      description: "Rekomendasi supplier (Harga/Lead/Tempo), kalkulator restock, dan terbit PO.",
      icon: <ShoppingBag className="h-7 w-7 text-purple-400 mb-2" />,
      colorBadge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      path: "/purchasing",
    },
    {
      id: "produksi",
      roleNumber: "Role 5",
      title: "Produksi Pabrik",
      persona: "Joko Santoso",
      description: "Partner rekomendasi, 5 tahapan pengerjaan SPK custom & upload foto WIP.",
      icon: <Hammer className="h-7 w-7 text-orange-400 mb-2" />,
      colorBadge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      path: "/produksi",
    },
    {
      id: "inventory",
      roleNumber: "Role 6",
      title: "Inventory Gudang",
      persona: "Dedi Saputra",
      description: "Stok bahan & sofa, penerimaan QC masuk, alokasi pesanan & release kirim.",
      icon: <Warehouse className="h-7 w-7 text-emerald-400 mb-2" />,
      colorBadge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      path: "/inventory",
    },
    {
      id: "distribusi",
      roleNumber: "Role 7",
      title: "Distribusi & Logistik",
      persona: "Bambang Irawan",
      description: "Surat Jalan, warning rakit & packing, armada/ekspedisi, dan WhatsApp blast.",
      icon: <Truck className="h-7 w-7 text-cyan-400 mb-2" />,
      colorBadge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      path: "/distribusi",
    },
    {
      id: "operations",
      roleNumber: "Master View",
      title: "Operations Hub",
      persona: "Pak Ronald (Lead)",
      description: "Pusat kendali 5 divisi operasional, riwayat SP/PO terpadu, dan AI Daily Digest.",
      icon: <LayoutDashboard className="h-7 w-7 text-rose-400 mb-2" />,
      colorBadge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      path: "/operations",
    },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 py-12"
      style={{ 
        backgroundImage: "url('/assets/images/bg.webp')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"></div>

      <div className="relative z-10 w-full max-w-7xl px-4 md:px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-2xl backdrop-blur-md mb-3 ring-1 ring-white/20 shadow-2xl">
            <Sparkles className="h-7 w-7 text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            Lovise Sofa <span className="text-indigo-400">Smart ERP Suite</span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-3xl mx-auto">
            Portal Simulasi Multi-Role: Pilih salah satu dari <strong>7 Role Modul Utama</strong> atau <strong>Operations Hub Master</strong> untuk menguji alur kerja operasional end-to-end.
          </p>
        </motion.div>

        {/* 8-Card Responsive Grid for 7 Roles + Master Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <button
                onClick={() => router.push(role.path)}
                className="w-full h-full text-left bg-slate-900/70 hover:bg-slate-800/80 backdrop-blur-md transition-all duration-200 rounded-2xl p-5 ring-1 ring-white/10 hover:ring-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${role.colorBadge}`}>
                      {role.roleNumber}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300">
                      {role.persona}
                    </span>
                  </div>

                  {role.icon}

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">
                    {role.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Masuk Simulasi</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
