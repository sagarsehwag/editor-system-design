'use client';

import React from 'react';

type SubtitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function Subtitle({ children, className = '' }: SubtitleProps) {
  return (
    <p
      className={`demo-subtitle ${className}`.trim()}
      style={{
        color: 'var(--text-secondary)',
        fontSize: 'var(--font-size-lg)',
      }}
    >
      {children}
    </p>
  );
}
