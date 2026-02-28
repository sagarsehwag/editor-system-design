'use client';

import { useState, useCallback, useSyncExternalStore, Suspense } from 'react';
import UnifiedSidebar from '../components/layout/UnifiedSidebar';
import NextButton from '../components/layout/NextButton';

const DESKTOP_MEDIA = '(min-width: 769px)';

function subscribeToViewport(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const m = window.matchMedia(DESKTOP_MEDIA);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}

function getViewportSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(DESKTOP_MEDIA).matches;
}

function getServerSnapshot() {
  return true;
}

function SidebarFallback() {
  return <nav className="sidebar unified-sidebar sidebar-collapsed" aria-hidden />;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useSyncExternalStore(subscribeToViewport, getViewportSnapshot, getServerSnapshot);
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const sidebarOpen = userOverride ?? isDesktop;

  const toggleSidebar = useCallback(() => {
    setUserOverride((prev) => (prev === null ? !isDesktop : !prev));
  }, [isDesktop]);

  return (
    <>
      <Suspense fallback={<SidebarFallback />}>
        <UnifiedSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      </Suspense>
      <main
        className={`content ${sidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}
        suppressHydrationWarning
      >
        {children}
        <Suspense fallback={null}>
          <NextButton />
        </Suspense>
      </main>
    </>
  );
}
