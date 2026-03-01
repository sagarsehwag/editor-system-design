'use client';

import React from 'react';

type ToolbarProps = {
  children: React.ReactNode;
  className?: string;
};

type ToolbarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  wide?: boolean;
  children: React.ReactNode;
};

export function Toolbar({ children, className = '' }: ToolbarProps) {
  return (
    <div className={`toolbar ${className}`.trim()} role="toolbar">
      {children}
    </div>
  );
}

export function ToolbarButton({
  active = false,
  wide = false,
  children,
  className = '',
  ...props
}: ToolbarButtonProps) {
  const classes = [
    'toolbar-btn',
    active ? 'active' : '',
    wide ? 'toolbar-btn-wide' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
