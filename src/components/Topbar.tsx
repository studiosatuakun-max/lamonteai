'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopbarProps {
  breadcrumbs?: BreadcrumbItem[];
  vacancyTitle?: string;
}

export default function Topbar({ breadcrumbs, vacancyTitle }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 flex-shrink-0" style={{ height: 64 }}>
      {/* Left: breadcrumbs + vacancy context */}
      <div className="flex flex-col justify-center min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={`crumb-${i}`}>
                {i > 0 && <ChevronRight size={12} className="flex-shrink-0" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-500 truncate">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {vacancyTitle && (
          <h1 className="text-base font-700 text-foreground truncate leading-tight">
            {vacancyTitle}
          </h1>
        )}
        {!vacancyTitle && !breadcrumbs && (
          <h1 className="text-base font-700 text-foreground">LamonteAI</h1>
        )}
      </div>

      {/* Right: search + notifications */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative hidden md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search candidates..."
            className="h-9 w-56 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary transition-all duration-150">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-sm cursor-pointer hover:bg-primary/20 transition-colors">
          SR
        </div>
      </div>
    </header>
  );
}