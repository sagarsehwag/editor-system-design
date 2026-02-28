'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProseMirror, { type ProseMirrorTab } from '../../components/Prosemirror';

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

function ProseMirrorContent() {
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get('section') || 'overview';
  const activeTab = VALID_SECTIONS.includes(sectionFromUrl as ProseMirrorTab)
    ? (sectionFromUrl as ProseMirrorTab)
    : 'overview';

  return (
    <div className="prosemirror-page">
      <ProseMirror activeTab={activeTab} />
    </div>
  );
}

export default function ProseMirrorPage() {
  return (
    <Suspense fallback={<div className="prosemirror-page" style={{ padding: '2rem' }}>Loading…</div>}>
      <ProseMirrorContent />
    </Suspense>
  );
}
