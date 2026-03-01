'use client';

import React from 'react';

type HintProps = {
  children: React.ReactNode;
  className?: string;
};

export function Hint({ children, className = '' }: HintProps) {
  return <p className={`hint ${className}`.trim()}>{children}</p>;
}
