'use client';

import React from 'react';

type InstructionsProps = {
  children: React.ReactNode;
  className?: string;
};

export function Instructions({ children, className = '' }: InstructionsProps) {
  return (
    <div className={`instructions ${className}`.trim()}>
      {children}
    </div>
  );
}
