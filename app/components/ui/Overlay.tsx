'use client';

import React from 'react';

type OverlayProps = {
  onClick?: () => void;
  className?: string;
};

export function Overlay({ onClick, className = '' }: OverlayProps) {
  return (
    <div
      className={`ds-overlay ${className}`.trim()}
      onClick={onClick}
      role="presentation"
      aria-hidden
    />
  );
}
