'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProseMirrorSidebar from '../../components/layout/ProseMirrorSidebar';
import type { ProseMirrorTab } from '../../components/demos/ProseMirror';

const VALID_SECTIONS: ProseMirrorTab[] = [
  'overview',
  'schema',
  'state',
  'transform',
  'view',
  'positions',
  'plugins',
  'immutable',
];

function ProseMirrorLayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get('section') || 'overview';
  const activeSection = VALID_SECTIONS.includes(
    sectionFromUrl as ProseMirrorTab,
  )
    ? (sectionFromUrl as ProseMirrorTab)
    : 'overview';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <>
      <ProseMirrorSidebar
        activeSection={activeSection}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      <main
        className={`content ${sidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}
      >
        {children}
      </main>
    </>
  );
}

export default function ProseMirrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main className='content sidebar-visible'>
          <div className='demo-section active' style={{ padding: '2rem' }}>
            <p>Loading…</p>
          </div>
        </main>
      }
    >
      <ProseMirrorLayoutInner>{children}</ProseMirrorLayoutInner>
    </Suspense>
  );
}
