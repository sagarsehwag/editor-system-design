'use client';

import React from 'react';

type CardVariant = 'default' | 'featured' | 'insight' | 'large';

type CardProps = {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: 'demo-card',
  featured: 'demo-card featured',
  insight: 'demo-card insight',
  large: 'demo-card large',
};

export function Card({
  variant = 'default',
  children,
  className = '',
  id,
}: CardProps) {
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(' ');
  return (
    <div className={classes} id={id}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`card-header ${className}`.trim()}>{children}</div>;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`card-content ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`card-footer ${className}`.trim()}>{children}</div>;
}
