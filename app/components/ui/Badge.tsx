'use client';

import React from 'react';

type BadgeVariant = 'red' | 'orange' | 'green' | 'blue' | 'purple';

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  live?: boolean;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  red: 'badge badge-red',
  orange: 'badge badge-orange',
  green: 'badge badge-green',
  blue: 'badge badge-blue',
  purple: 'badge badge-purple',
};

export function Badge({
  variant = 'blue',
  children,
  className = '',
  live = false,
}: BadgeProps) {
  const classes = [
    VARIANT_CLASSES[variant],
    live ? 'live-badge' : '',
    className,
  ].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
}
