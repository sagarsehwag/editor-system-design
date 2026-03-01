'use client';

import React, { useEffect, useRef } from 'react';
import type { EditorStats } from './types';
import type { TransactionStats } from './hooks/useTransactionCapture';

type StateCardsProps = {
  editorStats: EditorStats | null;
  txStats: TransactionStats;
};

function useFlash(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  const prevDep = useRef(dep);
  useEffect(() => {
    if (prevDep.current !== dep && ref.current) {
      ref.current.classList.remove('viz-card-flash');
      void ref.current.offsetWidth;
      ref.current.classList.add('viz-card-flash');
    }
    prevDep.current = dep;
  }, [dep]);
  return ref;
}

export function StateCards({ editorStats, txStats }: StateCardsProps) {
  const ref = useFlash(editorStats?.selection.anchor);
  const s = editorStats;

  return (
    <div ref={ref} className="viz-state-list">
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
