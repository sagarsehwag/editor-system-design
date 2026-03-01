'use client';

import React from 'react';

type ChipVariant = 'default' | 'red' | 'orange' | 'green' | 'blue' | 'purple';

type ChipProps = {
  variant?: ChipVariant;
  children: React.ReactNode;
  className?: string;
};

type ChipsProps = {
  children: React.ReactNode;
  className?: string;
};

const VARIANT_CLASSES: Record<ChipVariant, string> = {
  default: 'badge',
  red: 'badge badge-red',
  orange: 'badge badge-orange',
  green: 'badge badge-green',
  blue: 'badge badge-blue',
  purple: 'badge badge-purple',
};

export function Chip({
  variant = 'default',
  children,
  className = '',
}: ChipProps) {
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(' ');
  return <span className={classes}>{children}</span>;
}

export function Chips({ children, className = '' }: ChipsProps) {
  return (
    <div className={`ds-chips ${className}`.trim()} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--gap-sm)' }}>
      {children}
    </div>
  );
}
