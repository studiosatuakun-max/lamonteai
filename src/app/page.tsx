"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, Factory, Sparkles, ArrowRight, ShoppingBag, Hammer } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const roles = [
    {
      id: "hr",
      title: "HR Manager",
      description: "Modul rekrutmen cerdas & AI CV Screening.",
      icon: <Users className="h-8 w-8 text-indigo-400 mb-3" />,
      path: "/hr",
    },
    {
      id: "finance",
      title: "Finance (FAT)",
      description: "Rekonsiliasi mutasi & AI deteksi anomali.",
      icon: <Briefcase className="h-8 w-8 text-blue-400 mb-3" />,
      path: "/finance",
    },
    {
      id: "operations",
      title: "Operations Hub",
      description: "Pusat kendali operasional 5 divisi & AI Digest.",
      icon: <Factory className="h-8 w-8 text-orange-400 mb-3" />,
      path: "/operations",
    },
    {
      id: "purchasing",
      title: "Purchasing",
      description: "Pengadaan bahan baku, PO supplier & restock.",
      icon: <ShoppingBag className="h-8 w-8 text-purple-400 mb-3" />,
      path: "/purchasing",
    },
    {
      id: "produksi",
      title: "Produksi Pabrik",
      description: "SPK pengerjaan sofa custom, kontrol tukang & QC.",
      icon: <Hammer className="h-8 w-8 text-amber-400 mb-3" />,
      path: "/produksi",
    },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900 py-12"
      style={{ 
        backgroundImage: "url('/assets/images/bg.webp')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-4 ring-1 ring-white/20 shadow-2xl">
            <Sparkles className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Lovise Sofa <span className="text-indigo-400">Smart ERP</span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Selamat datang di ekosistem ERP Terintegrasi Lovise Sofa. Pilih modul peran Anda untuk memulai simulasi alur kerja operasional cerdas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
            >
              <button
                onClick={() => router.push(role.path)}
                className="w-full h-full text-left bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 rounded-2xl p-6 ring-1 ring-white/20 hover:ring-white/40 shadow-xl group flex flex-col"
              >
                {role.icon}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{role.title}</h3>
                <p className="text-sm text-slate-300 flex-grow">{role.description}</p>
                <div className="mt-6 flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300">
                  Masuk sebagai {role.title.split(' ')[0]} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
