'use client';

import React from 'react';

type ShortcutItem = {
  keys: React.ReactNode;
  label: string;
};

type ShortcutGridProps = {
  shortcuts: ShortcutItem[];
  className?: string;
};

export function ShortcutGrid({ shortcuts, className = '' }: ShortcutGridProps) {
  return (
    <div className={`shortcut-grid ${className}`.trim()}>
      {shortcuts.map((item, i) => (
        <div key={i} className="shortcut">
          <span>{item.keys}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
