'use client';

import React, { useMemo } from 'react';
import { formatHtmlForDiff, computeLineDiff } from './utils';

export function DomDiffView({ before, after }: { before: string; after: string }) {
  const { leftLines, rightLines } = useMemo(() => {
    const beforeStr = formatHtmlForDiff(before);
    const afterStr = formatHtmlForDiff(after);
    return computeLineDiff(beforeStr, afterStr);
  }, [before, after]);

  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div className="pm-flow-diff-view">
      <div className="pm-flow-diff-col pm-flow-diff-before">
        <span className="pm-flow-diff-col-label">Rendered before</span>
        <pre className="pm-flow-diff-pre pm-flow-dom-diff">
          {leftLines.map((line, i) => (
            <div
              key={i}
              className={`pm-flow-diff-line pm-flow-diff-${line.type}`}
            >
              {line.text ? (
                <span
                  className="pm-flow-html-inline"
                  dangerouslySetInnerHTML={{ __html: escapeHtml(line.text) }}
                />
              ) : (
                '\u00A0'
              )}
            </div>
          ))}
        </pre>
      </div>
      <div className="pm-flow-diff-col pm-flow-diff-after">
        <span className="pm-flow-diff-col-label">Rendered after</span>
        <pre className="pm-flow-diff-pre pm-flow-dom-diff">
          {rightLines.map((line, i) => (
            <div
              key={i}
              className={`pm-flow-diff-line pm-flow-diff-${line.type}`}
            >
              {line.text ? (
                <span
                  className="pm-flow-html-inline"
                  dangerouslySetInnerHTML={{ __html: escapeHtml(line.text) }}
                />
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
