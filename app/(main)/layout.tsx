'use client';

import { useState, useCallback, Suspense } from 'react';
import UnifiedSidebar from '../components/layout/UnifiedSidebar';

function SidebarFallback() {
  return <nav className="sidebar unified-sidebar sidebar-collapsed" aria-hidden />;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <>
      <Suspense fallback={<SidebarFallback />}>
        <UnifiedSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      </Suspense>
      <main className={`content ${sidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        {children}
      </main>
    </>
  );
}
