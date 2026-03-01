'use client';

import React from 'react';

type KbdProps = {
  children: React.ReactNode;
  className?: string;
};

export function Kbd({ children, className = '' }: KbdProps) {
  return <kbd className={className}>{children}</kbd>;
}
