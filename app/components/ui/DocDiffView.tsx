'use client';

import React, { useMemo } from 'react';
import { computeLineDiff } from './utils/diff';
import { JsonHighlight } from './JsonHighlight';
import { DiffLayout } from './DiffLayout';

type DocDiffViewProps = {
  before: Record<string, unknown> | object;
  after: Record<string, unknown> | object;
  beforeLabel?: string;
  afterLabel?: string;
};

export function DocDiffView({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: DocDiffViewProps) {
  const { leftLines, rightLines } = useMemo(
    () =>
      computeLineDiff(
        JSON.stringify(before, null, 2),
        JSON.stringify(after, null, 2)
      ),
    [before, after]
  );

  return (
    <DiffLayout
      beforeLabel={beforeLabel}
      afterLabel={afterLabel}
      leftLines={leftLines}
      rightLines={rightLines}
      renderLeft={(line) =>
        line.text ? <JsonHighlight data={line.text} inline /> : '\u00A0'
      }
      renderRight={(line) =>
        line.text ? <JsonHighlight data={line.text} inline /> : '\u00A0'
      }
    />
  );
}
