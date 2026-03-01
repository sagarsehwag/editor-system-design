'use client';

import React, { useMemo } from 'react';
import { computeLineDiff } from './utils';
import { JsonHighlight } from './JsonHighlight';
import { DiffLayout } from './DiffLayout';

export function DocDiffView({ before, after }: { before: Record<string, unknown>; after: Record<string, unknown> }) {
  const { leftLines, rightLines } = useMemo(
    () => computeLineDiff(JSON.stringify(before, null, 2), JSON.stringify(after, null, 2)),
    [before, after],
  );

  return (
    <DiffLayout
      beforeLabel="Before"
      afterLabel="After"
      leftLines={leftLines}
      rightLines={rightLines}
      renderLeft={(line) => line.text ? <JsonHighlight data={line.text} inline /> : '\u00A0'}
      renderRight={(line) => line.text ? <JsonHighlight data={line.text} inline /> : '\u00A0'}
    />
  );
}
