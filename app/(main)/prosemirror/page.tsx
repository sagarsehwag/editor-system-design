'use client';

import { useSearchParamsClient } from '../../hooks/useSearchParams';
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

export default function ProseMirrorPage() {
  const searchParams = useSearchParamsClient();
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
