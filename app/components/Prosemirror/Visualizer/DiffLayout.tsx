'use client';

import React from 'react';
import type { DiffLineLeft, DiffLineRight } from './utils';

type DiffLayoutProps = {
  beforeLabel: string;
  afterLabel: string;
  leftLines: DiffLineLeft[];
  rightLines: DiffLineRight[];
  renderLeft: (line: DiffLineLeft, index: number) => React.ReactNode;
  renderRight: (line: DiffLineRight, index: number) => React.ReactNode;
};

export function DiffLayout({
  beforeLabel,
  afterLabel,
  leftLines,
  rightLines,
  renderLeft,
  renderRight,
}: DiffLayoutProps) {
  return (
    <div className="viz-diff-view">
      <div className="viz-diff-col viz-diff-before">
        <span className="viz-diff-label">{beforeLabel}</span>
        <pre className="viz-diff-pre">
          {leftLines.map((line, i) => (
            <div key={i} className={`viz-diff-line viz-diff-${line.type}`}>
              {renderLeft(line, i)}
            </div>
          ))}
        </pre>
      </div>
      <div className="viz-diff-col viz-diff-after">
        <span className="viz-diff-label">{afterLabel}</span>
        <pre className="viz-diff-pre">
          {rightLines.map((line, i) => (
            <div key={i} className={`viz-diff-line viz-diff-${line.type}`}>
              {renderRight(line, i)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
