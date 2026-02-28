'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import type { ProseMirrorTab } from '../Prosemirror';

const SECTIONS: { id: ProseMirrorTab; icon: string; label: string }[] = [
  { id: 'overview', icon: '📋', label: 'Overview' },
  { id: 'schema', icon: '📄', label: 'Model' },
  { id: 'state', icon: '📦', label: 'State' },
  { id: 'transform', icon: '🔄', label: 'Transform' },
  { id: 'view', icon: '👁', label: 'View' },
  { id: 'positions', icon: '📍', label: 'Positions & Selection' },
  { id: 'plugins', icon: '🧩', label: 'Plugins' },
  { id: 'immutable', icon: '📎', label: 'Miscellaneous' },
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
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <nav className={`sidebar prosemirror-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <span className="sidebar-collapsed-logo" aria-hidden>📦</span>
          <div className="sidebar-header-content">
            <Link href="/" className="prosemirror-back-link">
              ← Back to demos
            </Link>
            <h1>📦 Prosemirror</h1>
            <p className="subtitle">Core concepts</p>
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
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
              <Link href={`/prosemirror?section=${item.id}`} className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
