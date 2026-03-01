'use client';

import React, { useMemo } from 'react';
import { computeLineDiff, formatHtmlForDiff } from './utils/diff';
import { escapeHtml } from './utils/jsonHighlight';
import { DiffLayout } from './DiffLayout';

type DomDiffViewProps = {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export function DomDiffView({
  before,
  after,
  beforeLabel = 'Rendered before',
  afterLabel = 'Rendered after',
}: DomDiffViewProps) {
  const { leftLines, rightLines } = useMemo(
    () =>
      computeLineDiff(formatHtmlForDiff(before), formatHtmlForDiff(after)),
    [before, after]
  );

  return (
    <DiffLayout
      beforeLabel={beforeLabel}
      afterLabel={afterLabel}
      leftLines={leftLines}
      rightLines={rightLines}
      renderLeft={(line) =>
        line.text ? (
          <span dangerouslySetInnerHTML={{ __html: escapeHtml(line.text) }} />
        ) : (
          '\u00A0'
        )
      }
      renderRight={(line) =>
        line.text ? (
          <span dangerouslySetInnerHTML={{ __html: escapeHtml(line.text) }} />
        ) : (
          '\u00A0'
        )
      }
    />
  );
}
