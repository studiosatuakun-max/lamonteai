"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Users, Briefcase, Factory, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const roles = [
    {
      id: "hr",
      title: "HR Manager",
      description: "Modul rekrutmen cerdas dengan AI CV Screening.",
      icon: <Users className="h-8 w-8 text-indigo-500 mb-4" />,
      path: "/hr",
    },
    {
      id: "finance",
      title: "Finance (FAT) Manager",
      description: "Modul rekonsiliasi dan deteksi anomali keuangan.",
      icon: <Briefcase className="h-8 w-8 text-blue-500 mb-4" />,
      path: "/finance",
    },
    {
      id: "operations",
      title: "Operations Manager",
      description: "Manajemen pesanan & AI Supply Chain Optimization.",
      icon: <Factory className="h-8 w-8 text-orange-500 mb-4" />,
      path: "/operations",
    },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900"
      style={{ 
        backgroundImage: "url('/assets/images/bg.webp')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-6 ring-1 ring-white/20 shadow-2xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Lovise Sofa <span className="text-indigo-400">Smart ERP</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Selamat datang. Silakan pilih role Anda untuk masuk ke dalam prototipe sistem ERP yang didukung oleh Artificial Intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
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
