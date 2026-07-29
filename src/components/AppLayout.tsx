import React from 'react';
import TopNavigation from './TopNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  vacancyTitle?: string;
}

export default function AppLayout({
  children,
  breadcrumbs,
  vacancyTitle,
}: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <TopNavigation breadcrumbs={breadcrumbs} vacancyTitle={vacancyTitle} />
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}