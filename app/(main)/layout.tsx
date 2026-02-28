'use client';

import { useState, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';

function MainLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const activeDemo =
    pathname === '/prosemirror'
      ? 'prosemirror'
      : searchParams.get('demo') || 'rendering';

  // ProseMirror route has its own sidebar — don't render main sidebar
  if (pathname === '/prosemirror') {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar
        activeDemo={activeDemo}
        onNavigate={() => {}}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        useRouter
      />
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
