'use client';

import React from 'react';
import type { DiffLineLeft, DiffLineRight } from './utils/diff';

type DiffLayoutProps = {
  beforeLabel: string;
  afterLabel: string;
  leftLines: DiffLineLeft[];
  rightLines: DiffLineRight[];
  renderLeft: (line: DiffLineLeft, index: number) => React.ReactNode;
  renderRight: (line: DiffLineRight, index: number) => React.ReactNode;
  className?: string;
};

export function DiffLayout({
  beforeLabel,
  afterLabel,
  leftLines,
  rightLines,
  renderLeft,
  renderRight,
  className = '',
}: DiffLayoutProps) {
  return (
    <div className={`ds-diff-view ${className}`.trim()}>
      <div className="ds-diff-col ds-diff-before">
        <span className="ds-diff-label">{beforeLabel}</span>
        <pre className="ds-diff-pre">
          {leftLines.map((line, i) => (
            <div key={i} className={`ds-diff-line ds-diff-${line.type}`}>
              {renderLeft(line, i)}
            </div>
          ))}
        </pre>
      </div>
      <div className="ds-diff-col ds-diff-after">
        <span className="ds-diff-label">{afterLabel}</span>
        <pre className="ds-diff-pre">
          {rightLines.map((line, i) => (
            <div key={i} className={`ds-diff-line ds-diff-${line.type}`}>
              {renderRight(line, i)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
