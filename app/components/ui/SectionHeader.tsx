'use client';

import React from 'react';

type SectionHeaderProps = {
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({
  title,
  subtitle,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`demo-header ${className}`.trim()}>
      <h2>{title}</h2>
      {subtitle && <p className="demo-subtitle">{subtitle}</p>}
    </div>
  );
}
