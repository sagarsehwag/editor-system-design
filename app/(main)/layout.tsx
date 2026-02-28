'use client';

import { useState, useCallback } from 'react';
import UnifiedSidebar from '../components/layout/UnifiedSidebar';

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
      <UnifiedSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <main className={`content ${sidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        {children}
      </main>
    </>
  );
}
