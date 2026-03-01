'use client';

import React, { useMemo } from 'react';
import { computeLineDiff } from './utils';
import { JsonHighlight } from './JsonHighlight';

export function DocDiffView({ before, after }: { before: object; after: object }) {
  const { leftLines, rightLines } = useMemo(() => {
    return computeLineDiff(JSON.stringify(before, null, 2), JSON.stringify(after, null, 2));
  }, [before, after]);

  return (
    <div className="viz-diff-view">
      <div className="viz-diff-col viz-diff-before">
        <span className="viz-diff-label">Before</span>
        <pre className="viz-diff-pre">
          {leftLines.map((line, i) => (
            <div key={i} className={`viz-diff-line viz-diff-${line.type}`}>
              {line.text ? <JsonHighlight data={line.text} inline /> : '\u00A0'}
            </div>
          ))}
        </pre>
      </div>
      <div className="viz-diff-col viz-diff-after">
        <span className="viz-diff-label">After</span>
        <pre className="viz-diff-pre">
          {rightLines.map((line, i) => (
            <div key={i} className={`viz-diff-line viz-diff-${line.type}`}>
              {line.text ? <JsonHighlight data={line.text} inline /> : '\u00A0'}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
