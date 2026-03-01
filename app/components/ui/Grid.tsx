'use client';

import React from 'react';

type GridCols = 2 | 4;

type GridProps = {
  cols?: GridCols;
  children: React.ReactNode;
  className?: string;
};

export function Grid({
  cols = 2,
  children,
  className = '',
}: GridProps) {
  const colsClass = cols === 4 ? 'four-cols' : 'two-cols';
  return (
    <div className={`demo-grid ${colsClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
