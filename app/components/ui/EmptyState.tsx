'use client';

import React from 'react';

type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div className={`ds-empty-state ${className}`.trim()}>
      {message}
    </div>
  );
}
