'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'green';
type ButtonSize = 'default' | 'sm';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  green: 'btn btn-green',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: '',
  sm: 'btn-sm',
};

export function Button({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
