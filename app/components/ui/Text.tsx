'use client';

import React from 'react';

type TextVariant = 'body' | 'secondary' | 'muted' | 'caption' | 'code';
type TextSize = 'xs' | 'sm' | 'md' | 'lg';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

type TextProps = {
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
  as?: 'span' | 'p' | 'div';
  children: React.ReactNode;
  className?: string;
};

const VARIANT_STYLES: Record<TextVariant, React.CSSProperties> = {
  body: { color: 'var(--text-primary)' },
  secondary: { color: 'var(--text-secondary)' },
  muted: { color: 'var(--text-muted)' },
  caption: { color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' },
  code: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)',
  },
};

const SIZE_STYLES: Record<TextSize, React.CSSProperties> = {
  xs: { fontSize: 'var(--font-size-xs)' },
  sm: { fontSize: 'var(--font-size-sm)' },
  md: { fontSize: 'var(--font-size-md)' },
  lg: { fontSize: 'var(--font-size-lg)' },
};

const WEIGHT_STYLES: Record<TextWeight, React.CSSProperties> = {
  normal: { fontWeight: 'var(--font-weight-normal)' },
  medium: { fontWeight: 'var(--font-weight-medium)' },
  semibold: { fontWeight: 'var(--font-weight-semibold)' },
  bold: { fontWeight: 'var(--font-weight-bold)' },
};

export function Text({
  variant = 'body',
  size,
  weight,
  as: Component = 'span',
  children,
  className = '',
}: TextProps) {
  const style: React.CSSProperties = {
    ...VARIANT_STYLES[variant],
    ...(size ? SIZE_STYLES[size] : {}),
    ...(weight ? WEIGHT_STYLES[weight] : {}),
  };

  return (
    <Component className={className} style={style}>
      {children}
    </Component>
  );
}
