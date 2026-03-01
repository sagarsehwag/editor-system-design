'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutList,
  FileJson,
  Package,
  RefreshCw,
  Eye,
  Crosshair,
  Puzzle,
  Paperclip,
  X,
  ChevronLeft,
  Menu,
  type LucideIcon,
} from 'lucide-react';
import type { ProseMirrorTab } from '../Prosemirror';

const ICON_SIZE = 18;

const SECTIONS: { id: ProseMirrorTab; icon: LucideIcon; label: string; badge?: string }[] = [
  { id: 'overview', icon: LayoutList, label: 'Overview' },
  { id: 'schema', icon: FileJson, label: 'Model' },
  { id: 'state', icon: Package, label: 'State' },
  { id: 'transform', icon: RefreshCw, label: 'Transform' },
  { id: 'view', icon: Eye, label: 'View' },
  { id: 'positions', icon: Crosshair, label: 'Positions & Selection' },
  { id: 'plugins', icon: Puzzle, label: 'Plugins' },
  { id: 'immutable', icon: Paperclip, label: 'Miscellaneous' },
];

interface ProseMirrorSidebarProps {
  activeSection: ProseMirrorTab;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProseMirrorSidebar({
  activeSection,
  isOpen,
  onToggle,
}: ProseMirrorSidebarProps) {
  const handleLinkClick = useCallback(() => {
    if (window.innerWidth <= 768) {
      onToggle();
    }
  }, [onToggle]);

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

      <nav className={`sidebar prosemirror-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <span className="sidebar-collapsed-logo" aria-hidden>
            <Package size={20} strokeWidth={2} />
          </span>
          <div className="sidebar-header-content">
            <Link href="/" className="prosemirror-back-link">
              ← Back to demos
            </Link>
            <h1>Prosemirror</h1>
            <p className="subtitle">Core concepts</p>
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
          {SECTIONS.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <Link href={`/prosemirror?tab=${item.id}`} className="nav-link">
                <span className="nav-icon">
                  <item.icon size={ICON_SIZE} strokeWidth={2} />
                </span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
