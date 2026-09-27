'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle,
  LogOut,
  ShoppingBag,
  Hammer,
  ClipboardList,
  Warehouse,
  Truck,
  UserCheck,
  ChevronDown,
  X,
  Target,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface RoleConfig {
  id: string;
  roleNumber: string;
  title: string;
  persona: string;
  initials: string;
  colorBg: string;
  colorText: string;
  path: string;
  description: string;
  menuSectionTitle: string;
  items: NavItem[];
}

const ALL_ROLES: RoleConfig[] = [
  {
    id: 'hr',
    roleNumber: 'Role 1',
    title: 'HR Manager',
    persona: 'Siti Rahma',
    initials: 'SR',
    colorBg: 'bg-indigo-100',
    colorText: 'text-indigo-700',
    path: '/hr',
    description: 'Rekrutmen cerdas, AI CV screening, dan KPI kinerja.',
    menuSectionTitle: 'Menu HR & Talent',
    items: [
      { key: 'nav-hr-kpi', label: 'KPI & Kinerja', href: '/hr', icon: <Target size={18} /> },
      { key: 'nav-hr-recruit', label: 'Rekrutmen Kandidat', href: '/candidate-review', icon: <Users size={18} /> },
      { key: 'nav-settings', label: 'Pengaturan', href: '/settings', icon: <Settings size={18} /> },
    ]
  },
  {
    id: 'finance',
    roleNumber: 'Role 2',
    title: 'Finance (FAT)',
    persona: 'Hendra Wijaya',
    initials: 'HW',
    colorBg: 'bg-blue-100',
    colorText: 'text-blue-700',
    path: '/finance',
    description: 'Rekonsiliasi mutasi bank dan deteksi anomali kas.',
    menuSectionTitle: 'Menu Finance (FAT)',
    items: [
      { key: 'nav-finance-main', label: 'Rekonsiliasi & Kas', href: '/finance', icon: <Briefcase size={18} /> },
      { key: 'nav-settings', label: 'Pengaturan', href: '/settings', icon: <Settings size={18} /> },
    ]
  },
  {
    id: 'toko',
    roleNumber: 'Role 3',
    title: 'Koordinator Toko',
    persona: 'Rina Melati',
    initials: 'RM',
    colorBg: 'bg-amber-100',
    colorText: 'text-amber-800',
    path: '/toko',
    description: 'Input SP (4 pemicu), validasi blueprint & klasifikasi 3 jalur.',
    menuSectionTitle: 'Menu Koordinator Toko',
    items: [
      { key: 'nav-toko-main', label: 'Surat Pesanan & Routing', href: '/toko', icon: <ClipboardList size={18} /> },
      { key: 'nav-settings', label: 'Pengaturan', href: '/settings', icon: <Settings size={18} /> },
    ]
  },
  {
    id: 'purchasing',
    roleNumber: 'Role 4',
    title: 'Purchasing Officer',
    persona: 'Eko Prasetyo',
    initials: 'EP',
    colorBg: 'bg-purple-100',
    colorText: 'text-purple-700',
    path: '/purchasing',
    description: 'Rekomendasi supplier, kalkulator restock & PO pabrikan.',
    menuSectionTitle: 'Menu Purchasing',
    items: [
      { key: 'nav-purchasing-main', label: 'Purchase Orders & Restock', href: '/purchasing', icon: <ShoppingBag size={18} /> },
      { key: 'nav-settings', label: 'Pengaturan', href: '/settings', icon: <Settings size={18} /> },
    ]
  },
  {
    id: 'produksi',
    roleNumber: 'Role 5',
    title: 'Kepala Produksi Pabrik',
    persona: 'Joko Santoso',
    initials: 'JS',
    colorBg: 'bg-orange-100',
    colorText: 'text-orange-800',
    path: '/produksi',
    description: 'SPK custom, pemantauan 5 tahap & upload foto WIP.',
    menuSectionTitle: 'Menu Produksi Pabrik',
    items: [
      { key: 'nav-produksi-main', label: 'SPK & Kontrol Produksi', href: '/produksi', icon: <Hammer size={18} /> },
      { key: 'nav-settings', label: 'Pengaturan', href: '/settings', icon: <Settings size={18} /> },
    ]
  },
  {
    id: 'inventory',
    roleNumber: 'Role 6',
    title: 'Staff Inventory Gudang',
    persona: 'Dedi Saputra',
    initials: 'DS',
    colorBg: 'bg-emerald-100',
    colorText: 'text-emerald-800',
    path: '/inventory',
    description: 'Monitoring stok fisik, terima QC masuk & alokasi ready.',
    menuSectionTitle: 'Menu Inventory Gudang',
    items: [
      { key: 'nav-inventory-main', label: 'Stok & Alokasi Pesanan', href: '/inventory', icon: <Warehouse size={18} /> },
      { key: 'nav-settings', label: 'Pengaturan', href: '/settings', icon: <Settings size={18} /> },
    ]
  },
  {
    id: 'distribusi',
    roleNumber: 'Role 7',
    title: 'Distribusi & Logistik',
    persona: 'Bambang Irawan',
    initials: 'BI',
    colorBg: 'bg-cyan-100',
    colorText: 'text-cyan-800',
    path: '/distribusi',
    description: 'Surat Jalan, warning rakit (GS)/packing & WhatsApp blast.',
    menuSectionTitle: 'Menu Distribusi & Logistik',
    items: [
      { key: 'nav-distribusi-main', label: 'Surat Jalan & Pengiriman', href: '/distribusi', icon: <Truck size={18} /> },
      { key: 'nav-settings', label: 'Pengaturan', href: '/settings', icon: <Settings size={18} /> },
    ]
  },
  {
    id: 'operations',
    roleNumber: 'Master Hub',
    title: 'Operations Hub (Master)',
    persona: 'Pak Ronald',
    initials: 'PR',
    colorBg: 'bg-rose-100',
    colorText: 'text-rose-800',
    path: '/operations',
    description: 'Pusat kendali 5 divisi operasional, AI Daily Digest & Audit SP.',
    menuSectionTitle: 'Pusat Kendali (All Access)',
    items: [
      { key: 'nav-ops-main', label: 'Operations Hub All-in-One', href: '/operations', icon: <LayoutDashboard size={18} /> },
      { key: 'nav-ops-toko', label: 'Koordinator Toko', href: '/toko', icon: <ClipboardList size={18} /> },
      { key: 'nav-ops-purchasing', label: 'Purchasing', href: '/purchasing', icon: <ShoppingBag size={18} /> },
      { key: 'nav-ops-produksi', label: 'Produksi Pabrik', href: '/produksi', icon: <Hammer size={18} /> },
      { key: 'nav-ops-inventory', label: 'Inventory Gudang', href: '/inventory', icon: <Warehouse size={18} /> },
      { key: 'nav-ops-distribusi', label: 'Distribusi', href: '/distribusi', icon: <Truck size={18} /> },
      { key: 'nav-settings', label: 'Pengaturan', href: '/settings', icon: <Settings size={18} /> },
    ]
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Detect active role from URL pathname
  const getCurrentRole = (): RoleConfig => {
    if (pathname.startsWith('/hr') || pathname.startsWith('/candidate-review')) {
      return ALL_ROLES.find(r => r.id === 'hr')!;
    }
    if (pathname.startsWith('/finance')) {
      return ALL_ROLES.find(r => r.id === 'finance')!;
    }
    if (pathname.startsWith('/toko')) {
      return ALL_ROLES.find(r => r.id === 'toko')!;
    }
    if (pathname.startsWith('/purchasing')) {
      return ALL_ROLES.find(r => r.id === 'purchasing')!;
    }
    if (pathname.startsWith('/produksi')) {
      return ALL_ROLES.find(r => r.id === 'produksi')!;
    }
    if (pathname.startsWith('/inventory')) {
      return ALL_ROLES.find(r => r.id === 'inventory')!;
    }
    if (pathname.startsWith('/distribusi')) {
      return ALL_ROLES.find(r => r.id === 'distribusi')!;
    }
    // Default to Operations Master Hub
    return ALL_ROLES.find(r => r.id === 'operations')!;
  };

  const currentRole = getCurrentRole();
  const visibleNavItems = currentRole.items;

  return (
    <aside
      className={`
        relative flex flex-col bg-card border-r border-border shadow-panel
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
      style={{ minHeight: '100vh' }}
    >
      {/* Brand Header */}
      <div
        className={`flex items-center border-b border-border px-3 py-3.5 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
        style={{ minHeight: 60 }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <AppLogo size={28} src="" />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-bold text-sm text-foreground tracking-tight block truncate">
                Lovise Sofa ERP
              </span>
              <span className="text-[10px] text-muted-foreground block truncate">
                Smart Operations
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-14 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border shadow-card text-muted-foreground hover:text-primary hover:border-primary transition-all duration-150"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* ACTIVE ROLE SELECTOR CARD (Top of Sidebar) */}
      {!collapsed ? (
        <div className="mx-2 mt-3 p-2.5 rounded-xl bg-slate-100/90 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Akses Peran:
            </span>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
            >
              Ganti Role
            </button>
          </div>

          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-400 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${currentRole.colorBg} ${currentRole.colorText}`}>
                {currentRole.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">
                  {currentRole.title}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {currentRole.persona}
                </p>
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 shrink-0 group-hover:text-indigo-600 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setIsRoleModalOpen(true)}
            title={`Peran: ${currentRole.title} (${currentRole.persona}) - Klik untuk ganti`}
            className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${currentRole.colorBg} ${currentRole.colorText} shadow-xs border border-slate-300 hover:scale-105 transition-transform`}
          >
            {currentRole.initials}
          </button>
        </div>
      )}

      {/* Nav section label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {currentRole.menuSectionTitle}
          </p>
          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">
            {currentRole.roleNumber}
          </span>
        </div>
      )}

      {/* FILTERED NAV ITEMS (Only shows menu of current active role!) */}
      <nav className="flex flex-col gap-1 px-2 pt-1 flex-1">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <div key={item.key} className="relative group">
              <Link
                href={item.href}
                className={`sidebar-item ${isActive ? 'active' : ''} ${
                  collapsed ? 'justify-center px-0' : ''
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="flex-1 truncate font-medium">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-600 text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>

              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-elevated">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-2 flex flex-col gap-1">
        {/* Switch Role Quick Button */}
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className={`sidebar-item w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Simulasi Peran Lain"
        >
          <UserCheck size={18} />
          {!collapsed && <span className="flex-1 text-left text-xs">Pilih Peran Lain</span>}
        </button>

        {/* Portal Home Button */}
        <button 
          onClick={() => router.push('/')}
          className={`sidebar-item w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Kembali ke Portal Beranda"
        >
          <LogOut size={18} />
          {!collapsed && <span className="flex-1 text-left text-xs">Portal Beranda</span>}
        </button>

        {/* User avatar / Active Role indicator */}
        <div
          onClick={() => setIsRoleModalOpen(true)}
          className={`mt-1 flex items-center gap-2 rounded-lg p-2 bg-slate-100/80 border border-slate-200 transition-colors cursor-pointer hover:bg-slate-200/80 ${
            collapsed ? 'justify-center' : ''
          }`}
          title={`Simulasi Role: ${currentRole.title} (${currentRole.persona}) — Klik untuk ubah`}
        >
          <div className={`h-7 w-7 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${currentRole.colorBg} ${currentRole.colorText}`}>
            {currentRole.initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{currentRole.persona}</p>
              <p className="text-[10px] font-semibold text-indigo-700 truncate">{currentRole.title}</p>
            </div>
          )}
        </div>
      </div>

      {/* ROLE SWITCHER MODAL (Allows instant jumping between 7 roles + Master Hub) */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <UserCheck size={18} className="text-indigo-400" />
                    Simulasi Akses Peran (Multi-Role Switcher)
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Pilih modul peran di bawah ini untuk melihat tampilan dashboard & menu yang sesuai dengan hak akses masing-masing bagian.
                  </p>
                </div>
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Roles Grid */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[70vh] overflow-y-auto">
                {ALL_ROLES.map((role) => {
                  const isCurrent = currentRole.id === role.id;

                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setIsRoleModalOpen(false);
                        router.push(role.path);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${role.colorBg} ${role.colorText}`}>
                            {role.roleNumber}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {role.persona}
                          </span>
                        </div>

                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{role.title}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                              Aktif
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {role.description}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                        <span>Buka Dashboard</span>
                        <ArrowRight size={12} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Klik peran apa pun untuk beralih tampilan seketika.</span>
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 font-medium text-slate-700 bg-white hover:bg-slate-100 text-xs"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </aside>
  );
}