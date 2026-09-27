'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  Truck
} from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'nav-hr',
    label: '1. HR Manager',
    href: '/hr',
    icon: <Users size={18} />,
  },
  {
    key: 'nav-finance',
    label: '2. Finance (FAT)',
    href: '/finance',
    icon: <Briefcase size={18} />,
  },
  {
    key: 'nav-toko',
    label: '3. Koordinator Toko',
    href: '/toko',
    icon: <ClipboardList size={18} />,
  },
  {
    key: 'nav-purchasing',
    label: '4. Purchasing',
    href: '/purchasing',
    icon: <ShoppingBag size={18} />,
  },
  {
    key: 'nav-produksi',
    label: '5. Produksi Pabrik',
    href: '/produksi',
    icon: <Hammer size={18} />,
  },
  {
    key: 'nav-inventory',
    label: '6. Inventory Gudang',
    href: '/inventory',
    icon: <Warehouse size={18} />,
  },
  {
    key: 'nav-distribusi',
    label: '7. Distribusi',
    href: '/distribusi',
    icon: <Truck size={18} />,
  },
  {
    key: 'nav-ops',
    label: 'Operations Hub',
    href: '/operations',
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: 'nav-settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={18} />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`
        relative flex flex-col bg-card border-r border-border shadow-panel
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-16' : 'w-56'}
      `}
      style={{ minHeight: '100vh' }}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-border px-3 py-4 ${
          collapsed ? 'justify-center' : 'gap-2'
        }`}
        style={{ minHeight: 64 }}
      >
        <AppLogo size={32} src="" />
        {!collapsed && (
          <span className="font-bold text-base text-foreground tracking-tight">
            Lovise Sofa
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border shadow-card text-muted-foreground hover:text-primary hover:border-primary transition-all duration-150"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav section label */}
      {!collapsed && (
        <p className="px-4 pt-5 pb-1 text-[11px] font-600 uppercase tracking-widest text-muted-foreground">
          Menu
        </p>
      )}

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-2 pt-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/' || pathname === '/candidate-list-view'
              : pathname.startsWith(item.href);

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
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-600 text-primary">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-700 text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>

              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-elevated">
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="ml-1 text-blue-300">({item.badge})</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={`border-t border-border p-2 flex flex-col gap-1`}>
        {[
          { key: 'sidebar-notif', icon: <Bell size={18} />, label: 'Notifications', badge: 2 },
          { key: 'sidebar-help', icon: <HelpCircle size={18} />, label: 'Help & Support' },
        ].map((item) => (
          <div key={item.key} className="relative group">
            <button
              className={`sidebar-item w-full ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-600 text-primary">
                  {item.badge}
                </span>
              )}
            </button>
            {collapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-elevated">
                {item.label}
              </div>
            )}
          </div>
        ))}
        
        <button 
          onClick={() => router.push('/')}
          className={`sidebar-item w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="flex-1 text-left">Keluar</span>}
        </button>

        {/* User avatar / Active Role indicator */}
        {(() => {
          const getActiveRole = () => {
            if (pathname.startsWith('/hr')) return { name: 'Siti Rahma', role: '1. HR Manager', initials: 'SR', color: 'bg-indigo-100 text-indigo-700' };
            if (pathname.startsWith('/finance')) return { name: 'Hendra Wijaya', role: '2. Finance (FAT)', initials: 'HW', color: 'bg-blue-100 text-blue-700' };
            if (pathname.startsWith('/toko')) return { name: 'Rina Melati', role: '3. Koordinator Toko', initials: 'RM', color: 'bg-indigo-100 text-indigo-700' };
            if (pathname.startsWith('/purchasing')) return { name: 'Eko Prasetyo', role: '4. Purchasing Officer', initials: 'EP', color: 'bg-purple-100 text-purple-700' };
            if (pathname.startsWith('/produksi')) return { name: 'Joko Santoso', role: '5. Kepala Produksi', initials: 'JS', color: 'bg-amber-100 text-amber-700' };
            if (pathname.startsWith('/inventory')) return { name: 'Dedi Saputra', role: '6. Staff Inventory', initials: 'DS', color: 'bg-emerald-100 text-emerald-700' };
            if (pathname.startsWith('/distribusi')) return { name: 'Bambang Irawan', role: '7. Distribusi & Logistik', initials: 'BI', color: 'bg-blue-100 text-blue-700' };
            if (pathname.startsWith('/operations')) return { name: 'Pak Ronald', role: 'Operations Lead (Hub)', initials: 'PR', color: 'bg-orange-100 text-orange-700' };
            return { name: 'Andi Pratama', role: 'Super Admin', initials: 'AP', color: 'bg-slate-200 text-slate-800' };
          };
          const user = getActiveRole();
          return (
            <div
              className={`mt-2 flex items-center gap-2 rounded-lg p-2 bg-slate-50 border border-slate-200/80 transition-colors cursor-pointer ${
                collapsed ? 'justify-center' : ''
              }`}
              title={`Simulasi Role Aktif: ${user.role} (${user.name})`}
            >
              <div className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${user.color}`}>
                {user.initials}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] font-semibold text-indigo-700 truncate">{user.role}</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </aside>
  );
}