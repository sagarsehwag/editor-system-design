'use client';

import React from 'react';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'default' | 'ghost' | 'outline';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  'aria-label': string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  className?: string;
};

const SIZE_CLASSES: Record<IconButtonSize, string> = {
  sm: 'ds-icon-btn-sm',
  md: '',
  lg: 'ds-icon-btn-lg',
};

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  default: '',
  ghost: 'ds-icon-btn-ghost',
  outline: 'ds-icon-btn-outline',
};

export function IconButton({
  children,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}: IconButtonProps) {
  const classes = [
    'ds-icon-btn',
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
