'use client';

import React, { useMemo } from 'react';
import { formatHtmlForDiff, computeLineDiff, escapeHtml } from './utils';
import { DiffLayout } from './DiffLayout';

export function DomDiffView({ before, after }: { before: string; after: string }) {
  const { leftLines, rightLines } = useMemo(
    () => computeLineDiff(formatHtmlForDiff(before), formatHtmlForDiff(after)),
    [before, after],
  );

  return (
    <DiffLayout
      beforeLabel="Rendered before"
      afterLabel="Rendered after"
      leftLines={leftLines}
      rightLines={rightLines}
      renderLeft={(line) =>
        line.text ? <span dangerouslySetInnerHTML={{ __html: escapeHtml(line.text) }} /> : '\u00A0'
      }
      renderRight={(line) =>
        line.text ? <span dangerouslySetInnerHTML={{ __html: escapeHtml(line.text) }} /> : '\u00A0'
      }
    />
  );
}
