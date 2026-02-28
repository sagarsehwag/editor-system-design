'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'rendering', icon: '🎨', label: 'Rendering Approaches', href: '/rich-text-editor?tab=rendering' },
  { id: 'contenteditable', icon: '✏️', label: 'ContentEditable Deep Dive', href: '/rich-text-editor?tab=contenteditable' },
  { id: 'selection', icon: '📍', label: 'Selection Inspector', href: '/rich-text-editor?tab=selection' },
  { id: 'state', icon: '🏗️', label: 'State Model & Formatting', href: '/rich-text-editor?tab=state' },
  { id: 'update-loop', icon: '🔄', label: 'Update Loop', href: '/rich-text-editor?tab=update-loop' },
  { id: 'node-structures', icon: '🔗', label: 'Node Structures', href: '/rich-text-editor?tab=node-structures' },
  { id: 'prosemirror', icon: '📦', label: 'Prosemirror', href: '/prosemirror' },
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
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      <nav className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <span className="sidebar-collapsed-logo" aria-hidden>📝</span>
          <div className="sidebar-header-content">
            <h1>📝 Rich Text Editor</h1>
            <p className="subtitle">System Design Demos</p>
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
          {navItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${activeDemo === item.id ? 'active' : ''}`}
              onClick={() => handleNavigate(item.id)}
            >
              {useRouter ? (
                <Link href={item.href} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <p className="tip">💡 Open DevTools (F12) to inspect elements!</p>
        </div>
      </nav>
    </>
  );
}
