'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Palette,
  Pencil,
  MousePointer,
  GitBranch,
  RefreshCw,
  Link2,
  Package,
  FileText,
  Lightbulb,
  X,
  ChevronLeft,
  Menu,
  type LucideIcon,
} from 'lucide-react';

const ICON_SIZE = 18;

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'rendering', icon: Palette, label: 'Rendering Approaches', href: '/rich-text-editor?tab=rendering' },
  { id: 'contenteditable', icon: Pencil, label: 'ContentEditable Deep Dive', href: '/rich-text-editor?tab=contenteditable' },
  { id: 'selection', icon: MousePointer, label: 'Selection Inspector', href: '/rich-text-editor?tab=selection' },
  { id: 'state', icon: GitBranch, label: 'State Model & Formatting', href: '/rich-text-editor?tab=state' },
  { id: 'update-loop', icon: RefreshCw, label: 'Update Loop', href: '/rich-text-editor?tab=update-loop' },
  { id: 'node-structures', icon: Link2, label: 'Node Structures', href: '/rich-text-editor?tab=node-structures' },
  { id: 'prosemirror', icon: Package, label: 'Prosemirror', href: '/prosemirror' },
];

interface SidebarProps {
  activeDemo: string;
  onNavigate: (demoId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  useRouter?: boolean;
}

export default function Sidebar({ activeDemo, onNavigate, isOpen, onToggle, useRouter = false }: SidebarProps) {
  const handleNavigate = useCallback(
    (demoId: string) => {
      if (!useRouter) {
        onNavigate(demoId);
      }
      if (window.innerWidth <= 768) {
        onToggle();
      }
    },
    [onNavigate, onToggle, useRouter]
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

      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <nav className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <span className="sidebar-collapsed-logo" aria-hidden>
            <FileText size={20} strokeWidth={2} />
          </span>
          <div className="sidebar-header-content">
            <h1>Rich Text Editor</h1>
            <p className="subtitle">Interactive demos for schema, state, transforms & more</p>
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <X size={16} strokeWidth={2} aria-hidden />
            ) : (
              <ChevronLeft size={16} strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${activeDemo === item.id ? 'active' : ''}`}
              onClick={() => handleNavigate(item.id)}
            >
              {useRouter ? (
                <Link href={item.href} className="nav-link">
                  <span className="nav-icon">
                    <item.icon size={ICON_SIZE} strokeWidth={2} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  <span className="nav-icon">
                    <item.icon size={ICON_SIZE} strokeWidth={2} />
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <p className="tip">
            <Lightbulb size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Open DevTools (F12) to inspect elements!
          </p>
        </div>
      </nav>
    </>
  );
}
