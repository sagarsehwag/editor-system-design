'use client';

import React, { useMemo } from 'react';
import { formatHtmlForDiff, computeLineDiff } from './utils';

export function DomDiffView({ before, after }: { before: string; after: string }) {
  const { leftLines, rightLines } = useMemo(() => {
    return computeLineDiff(formatHtmlForDiff(before), formatHtmlForDiff(after));
  }, [before, after]);

  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div className="viz-diff-view">
      <div className="viz-diff-col viz-diff-before">
        <span className="viz-diff-label">Rendered before</span>
        <pre className="viz-diff-pre">
          {leftLines.map((line, i) => (
            <div key={i} className={`viz-diff-line viz-diff-${line.type}`}>
              {line.text ? <span dangerouslySetInnerHTML={{ __html: esc(line.text) }} /> : '\u00A0'}
            </div>
          ))}
        </pre>
      </div>
      <div className="viz-diff-col viz-diff-after">
        <span className="viz-diff-label">Rendered after</span>
        <pre className="viz-diff-pre">
          {rightLines.map((line, i) => (
            <div key={i} className={`viz-diff-line viz-diff-${line.type}`}>
              {line.text ? <span dangerouslySetInnerHTML={{ __html: esc(line.text) }} /> : '\u00A0'}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
