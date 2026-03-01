'use client';

import React from 'react';

type PanelHeaderProps = {
  label: string;
  count?: number;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function PanelHeader({
  label,
  count,
  action,
  children,
  className = '',
}: PanelHeaderProps) {
  return (
    <div className={`ds-panel-header ${className}`.trim()}>
      <span className="ds-panel-label">{label}</span>
      {(count !== undefined || action || children) && (
        <div className="ds-panel-meta">
          {count !== undefined && (
            <span className="ds-panel-count">{count}</span>
          )}
          {children}
          {action}
        </div>
      )}
    </div>
  );
}
