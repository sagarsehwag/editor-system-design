'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const PROSEMIRROR_SECTIONS = [
  'overview',
  'schema',
  'state',
  'transform',
  'view',
  'positions',
  'plugins',
  'immutable',
] as const;

const RICH_TEXT_DEMOS = [
  'rendering',
  'contenteditable',
  'selection',
  'state',
  'update-loop',
  'node-structures',
] as const;

function getNextLink(pathname: string, tab: string | null): { href: string; label: string } | null {
  const isProseMirror = pathname === '/' || pathname === '/prosemirror';
  const prosemirrorBase = pathname === '/prosemirror' ? '/prosemirror' : '/';

  if (isProseMirror) {
    const currentIndex = PROSEMIRROR_SECTIONS.indexOf(tab as (typeof PROSEMIRROR_SECTIONS)[number]);
    const idx = currentIndex < 0 ? 0 : currentIndex;
    if (idx < PROSEMIRROR_SECTIONS.length - 1) {
      const nextTab = PROSEMIRROR_SECTIONS[idx + 1];
      const label = nextTab.charAt(0).toUpperCase() + nextTab.slice(1).replace(/-/g, ' ');
      return {
        href: `${prosemirrorBase}?tab=${nextTab}`,
        label: `Next: ${label}`,
      };
    }
    return null;
  }

  if (pathname === '/rich-text-editor') {
    const currentIndex = RICH_TEXT_DEMOS.indexOf(tab as (typeof RICH_TEXT_DEMOS)[number]);
    const idx = currentIndex < 0 ? 0 : currentIndex;
    if (idx < RICH_TEXT_DEMOS.length - 1) {
      const nextTab = RICH_TEXT_DEMOS[idx + 1];
      const labelMap: Record<string, string> = {
        rendering: 'Rendering Approaches',
        contenteditable: 'ContentEditable Deep Dive',
        selection: 'Selection Inspector',
        state: 'State Model & Formatting',
        'update-loop': 'Update Loop',
        'node-structures': 'Node Structures',
      };
      return {
        href: `/rich-text-editor?tab=${nextTab}`,
        label: `Next: ${labelMap[nextTab] || nextTab}`,
      };
    }
    return null;
  }

  return null;
}

export default function NextButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const next = getNextLink(pathname, tab);

  if (!next) return null;

  return (
    <div className="next-button-wrapper">
      <Link href={next.href} className="next-button">
        {next.label}
        <span className="next-button-arrow" aria-hidden>→</span>
      </Link>
    </div>
  );
}
