'use client';

import { useState, useCallback, Suspense } from 'react';
import UnifiedSidebar from '../components/layout/UnifiedSidebar';

function MainLayoutInner({
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

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <main className="content sidebar-visible">
        <div className="demo-section active" style={{ padding: '2rem' }}>
          <p>Loading…</p>
        </div>
      </main>
    }>
      <MainLayoutInner>{children}</MainLayoutInner>
    </Suspense>
  );
}
