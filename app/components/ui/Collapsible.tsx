'use client';

import React from 'react';

type CollapsibleProps = {
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function Collapsible({
  summary,
  children,
  defaultOpen = false,
  className = '',
}: CollapsibleProps) {
  return (
    <details
      className={`ds-collapsible ${className}`.trim()}
      open={defaultOpen}
    >
      <summary className="ds-collapsible-summary">{summary}</summary>
      <div className="ds-collapsible-content">{children}</div>
    </details>
  );
}
