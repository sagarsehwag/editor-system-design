'use client';

import React from 'react';
import type { EditorStats, TransactionStats } from './types';

type StateCardsProps = {
  editorStats: EditorStats | null;
  txStats: TransactionStats;
};

export function StateCards({ editorStats, txStats }: StateCardsProps) {
  const s = editorStats;

  return (
    <div className="viz-state-list">
      <div className="viz-state-row">
        <span className="viz-k">doc</span>
        <span className="viz-v">{s?.charCount ?? 0} chars · {s?.nodeCount ?? 0} nodes · v{s?.version ?? 0}</span>
      </div>
      <div className="viz-state-row">
        <span className="viz-k">cursor</span>
        <span className="viz-v viz-v-highlight">{s?.selection.anchor ?? 0}</span>
      </div>
      <div className="viz-state-row">
        <span className="viz-k">selection</span>
        <span className="viz-v">
          {s?.selection.type ?? 'None'} [{s?.selection.from ?? 0}→{s?.selection.to ?? 0}]
        </span>
      </div>
      <div className="viz-state-row">
        <span className="viz-k">parent</span>
        <span className="viz-v">{s?.resolvedPos?.parentNode ?? '—'} (depth {s?.resolvedPos?.depth ?? 0})</span>
      </div>
      <div className="viz-state-row">
        <span className="viz-k">transactions</span>
        <span className="viz-v">{txStats.total} total · {txStats.docChanges} doc · {txStats.selChanges} sel</span>
      </div>
      {s?.selection.text ? (
        <div className="viz-state-row">
          <span className="viz-k">text</span>
          <span className="viz-v viz-v-trunc">{s.selection.text}</span>
        </div>
      ) : null}
    </div>
  );
}
