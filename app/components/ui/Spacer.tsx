'use client';

import React from 'react';

type SpacerProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'vertical' | 'horizontal';
  className?: string;
};

const SIZE_MAP = {
  sm: 'var(--gap-sm)',
  md: 'var(--gap-md)',
  lg: 'var(--gap-lg)',
  xl: 'var(--gap-xl)',
} as const;

export function Spacer({
  size = 'md',
  direction = 'vertical',
  className = '',
}: SpacerProps) {
  const isVertical = direction === 'vertical';
  const style: React.CSSProperties = isVertical
    ? { height: SIZE_MAP[size], minHeight: SIZE_MAP[size] }
    : { width: SIZE_MAP[size], minWidth: SIZE_MAP[size] };

  return <div className={className} style={style} aria-hidden />;
}
