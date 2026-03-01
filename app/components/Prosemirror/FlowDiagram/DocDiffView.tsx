'use client';

import React, { useMemo } from 'react';
import { computeLineDiff } from './utils';
import { JsonHighlight } from './JsonHighlight';

export function DocDiffView({ before, after }: { before: object; after: object }) {
  const { leftLines, rightLines } = useMemo(() => {
    const beforeStr = JSON.stringify(before, null, 2);
    const afterStr = JSON.stringify(after, null, 2);
    return computeLineDiff(beforeStr, afterStr);
  }, [before, after]);

  return (
    <div className="pm-flow-diff-view">
      <div className="pm-flow-diff-col pm-flow-diff-before">
        <span className="pm-flow-diff-col-label">Before</span>
        <pre className="pm-flow-diff-pre">
          {leftLines.map((line, i) => (
            <div
              key={i}
              className={`pm-flow-diff-line pm-flow-diff-${line.type}`}
            >
              {line.text ? (
                <JsonHighlight data={line.text} inline />
              ) : (
                '\u00A0'
              )}
            </div>
          ))}
        </pre>
      </div>
      <div className="pm-flow-diff-col pm-flow-diff-after">
        <span className="pm-flow-diff-col-label">After</span>
        <pre className="pm-flow-diff-pre">
          {rightLines.map((line, i) => (
            <div
              key={i}
              className={`pm-flow-diff-line pm-flow-diff-${line.type}`}
            >
              {line.text ? (
                <JsonHighlight data={line.text} inline />
              ) : (
                '\u00A0'
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
