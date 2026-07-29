'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
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
    icon: <LayoutDashboard size={16} />,
  },
  {
    key: 'nav-jobs',
    label: 'Job Vacancies',
    href: '/jobs',
    icon: <Briefcase size={16} />,
    badge: 3,
  },
  {
    key: 'nav-candidates',
    label: 'Candidates',
    href: '/',
    icon: <Users size={16} />,
    badge: 8,
  },
  {
    key: 'nav-settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={16} />,
  },
];

interface TopNavigationProps {
  breadcrumbs?: { label: string; href?: string }[];
  vacancyTitle?: string;
}

export default function TopNavigation({ breadcrumbs, vacancyTitle }: TopNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
      <header className="topnav">
        <div className="topnav-inner">
          {/* Left: Logo + Breadcrumbs */}
          <div className="topnav-left">
            <Link href="/" className="topnav-brand">
              <AppLogo size={28} />
              <span className="topnav-brand-text">LamonteAI</span>
            </Link>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="topnav-breadcrumbs">
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={`crumb-${i}`}>
                    {i > 0 && <ChevronRight size={12} className="topnav-breadcrumb-sep" />}
                    {crumb.href ? (
                      <Link href={crumb.href} className="topnav-breadcrumb-link">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="topnav-breadcrumb-current">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </div>

          {/* Center: Nav items (desktop) */}
          <nav className="topnav-center">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname === '/candidate-list-view'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`topnav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="topnav-item-icon">{item.icon}</span>
                  <span className="topnav-item-label">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="topnav-badge">{item.badge}</span>
                  )}
                  {isActive && <span className="topnav-active-indicator" />}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search + Notifications + Profile */}
          <div className="topnav-right">
            <div className="topnav-search-wrapper">
              <Search
                size={14}
                className="topnav-search-icon"
              />
              <input
                type="text"
                placeholder="Search candidates..."
                className="topnav-search-input"
              />
            </div>

            <button className="topnav-icon-btn" aria-label="Notifications">
              <Bell size={16} />
              <span className="topnav-notif-dot" />
            </button>

            {/* Profile dropdown */}
            <div className="topnav-profile" ref={profileRef}>
              <button
                className="topnav-profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="topnav-avatar">AP</div>
                <span className="topnav-profile-name">Andi Pratama</span>
                <ChevronDown size={14} className={`topnav-chevron ${profileOpen ? 'open' : ''}`} />
              </button>

              {profileOpen && (
                <div className="topnav-dropdown">
                  <div className="topnav-dropdown-header">
                    <div className="topnav-avatar-lg">AP</div>
                    <div>
                      <p className="topnav-dropdown-name">Andi Pratama</p>
                      <p className="topnav-dropdown-role">HR Manager</p>
                    </div>
                  </div>
                  <div className="topnav-dropdown-divider" />
                  <button className="topnav-dropdown-item" onClick={handleLogout}>
                    <LogOut size={14} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="topnav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Vacancy title bar (if provided) */}
        {vacancyTitle && (
          <div className="topnav-title-bar">
            <h1 className="topnav-vacancy-title">{vacancyTitle}</h1>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="topnav-mobile-overlay" onClick={() => setMobileOpen(false)}>
          <nav className="topnav-mobile-menu" onClick={(e) => e.stopPropagation()}>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname === '/candidate-list-view'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`topnav-mobile-item ${isActive ? 'active' : ''}`}
                >
                  <span className="topnav-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="topnav-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
            <div className="topnav-dropdown-divider" />
            <button className="topnav-mobile-item" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
