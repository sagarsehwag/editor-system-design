'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutList,
  FileJson,
  Package,
  RefreshCw,
  Eye,
  Crosshair,
  Puzzle,
  Paperclip,
  Palette,
  Pencil,
  MousePointer,
  GitBranch,
  Link2,
  FileText,
  X,
  Menu,
  type LucideIcon,
} from 'lucide-react';
import type { ProseMirrorTab } from '../Prosemirror';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const ICON_SRC = `${BASE_PATH}/prosemirror-icon.svg`;

const ICON_SIZE = 18;

const PROSEMIRROR_SECTIONS: {
  id: ProseMirrorTab;
  icon: LucideIcon;
  label: string;
  badge?: string;
}[] = [
  { id: 'overview', icon: LayoutList, label: 'Overview' },
  { id: 'schema', icon: FileJson, label: 'Model' },
  { id: 'state', icon: Package, label: 'State' },
  { id: 'transform', icon: RefreshCw, label: 'Transform' },
  { id: 'view', icon: Eye, label: 'View' },
  { id: 'positions', icon: Crosshair, label: 'Positions & Selection' },
  { id: 'plugins', icon: Puzzle, label: 'Plugins' },
  { id: 'immutable', icon: Paperclip, label: 'Miscellaneous' },
];

const RICH_TEXT_DEMOS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: 'rendering', icon: Palette, label: 'Rendering Approaches' },
  { id: 'contenteditable', icon: Pencil, label: 'ContentEditable Deep Dive' },
  { id: 'selection', icon: MousePointer, label: 'Selection Inspector' },
  { id: 'state', icon: GitBranch, label: 'State Model & Formatting' },
  { id: 'update-loop', icon: RefreshCw, label: 'Update Loop' },
  { id: 'node-structures', icon: Link2, label: 'Node Structures' },
];

interface UnifiedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function UnifiedSidebar({
  isOpen,
  onToggle,
}: UnifiedSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isProseMirror = pathname === '/' || pathname === '/prosemirror';
  const isRichTextEditor = pathname === '/rich-text-editor';
  const prosemirrorBase = pathname === '/prosemirror' ? '/prosemirror' : '/';
  const activeProseMirrorSection =
    (searchParams.get('tab') as ProseMirrorTab) || 'overview';
  const activeDemo = searchParams.get('tab') || 'rendering';

  const handleNavItemClick = useCallback(
    (href: string) => {
      router.push(href);
      if (window.innerWidth <= 768) {
        onToggle();
      }
    },
    [router, onToggle],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  return (
    <>
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : 'sidebar-closed'}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={20} strokeWidth={2} aria-hidden />
        ) : (
          <Menu size={20} strokeWidth={2} aria-hidden />
        )}
      </button>

      {isOpen && <div className='sidebar-overlay' onClick={onToggle} />}

      <nav
        className={`sidebar unified-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}
      >
        <div className='sidebar-header'>
          <div className='sidebar-header-content'>
            <h1>Editor · ProseMirror</h1>
            <p className='subtitle'>
              How prosemirror and rich text editors work
            </p>
          </div>
          <button
            className='sidebar-collapse-btn'
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <X size={18} strokeWidth={2} aria-hidden />
            ) : (
              <Menu size={18} strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>

        <div className='unified-nav-sections'>
          {/* ProseMirror - Main nav */}
          <div className='nav-section'>
            <Link
              href={prosemirrorBase}
              className={`nav-section-header ${isProseMirror ? 'active' : ''}`}
            >
              <span className='nav-icon nav-icon-img'>
                <img src={ICON_SRC} alt='' width={20} height={20} />
              </span>
              <span>Prosemirror</span>
            </Link>
            {isProseMirror && (
              <ul className='nav-list nav-sublist'>
                {PROSEMIRROR_SECTIONS.map((item) => (
                  <li
                    key={item.id}
                    className={`nav-item ${
                      activeProseMirrorSection === item.id ? 'active' : ''
                    }`}
                  >
                    <button
                      type='button'
                      className='nav-link'
                      onClick={() =>
                        handleNavItemClick(`${prosemirrorBase}?tab=${item.id}`)
                      }
                    >
                      <span className='nav-icon'>
                        <item.icon size={ICON_SIZE} strokeWidth={2} />
                      </span>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className='nav-badge'>{item.badge}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rich Text Editor - Tab */}
          <div className='nav-section'>
            <Link
              href='/rich-text-editor?tab=rendering'
              className={`nav-section-header ${isRichTextEditor ? 'active' : ''}`}
            >
              <span className='nav-icon'>
                <FileText size={ICON_SIZE} strokeWidth={2} />
              </span>
              <span>Rich Text Editor</span>
            </Link>
            {isRichTextEditor && (
              <ul className='nav-list nav-sublist'>
                {RICH_TEXT_DEMOS.map((item) => (
                  <li
                    key={item.id}
                    className={`nav-item ${activeDemo === item.id ? 'active' : ''}`}
                  >
                    <button
                      type='button'
                      className='nav-link'
                      onClick={() =>
                        handleNavItemClick(`/rich-text-editor?tab=${item.id}`)
                      }
                    >
                      <span className='nav-icon'>
                        <item.icon size={ICON_SIZE} strokeWidth={2} />
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
