'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    key: 'nav-home',
    label: 'Home',
    href: '/',
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: 'nav-jobs',
    label: 'Job Vacancies',
    href: '/jobs',
    icon: <Briefcase size={18} />,
    badge: 3,
  },
  {
    key: 'nav-candidates',
    label: 'Candidates',
    href: '/',
    icon: <Users size={18} />,
    badge: 8,
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
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-base text-foreground tracking-tight">
            LamonteAI
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

        {/* User avatar */}
        <div
          className={`mt-2 flex items-center gap-2 rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-sm">
            HR
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-600 text-foreground truncate">Siti Rahayu</p>
              <p className="text-xs text-muted-foreground truncate">HR Manager</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}