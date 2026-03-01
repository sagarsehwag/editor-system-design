'use client';

import React from 'react';

type CalloutVariant = 'primary' | 'purple' | 'orange' | 'green' | 'blue' | 'red';

type CalloutProps = {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const VARIANT_CLASSES: Record<CalloutVariant, string> = {
  primary: 'prosemirror-callout',
  purple: 'prosemirror-callout',
  orange: 'prosemirror-callout',
  green: 'prosemirror-callout',
  blue: 'prosemirror-callout',
  red: 'prosemirror-callout',
};

export function Callout({
  variant = 'primary',
  title,
  children,
  className = '',
}: CalloutProps) {
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(' ');
  return (
    <div className={classes}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
