'use client';

import React from 'react';
import type { EditorStats, TransactionStats } from './types';
import { StateCards } from './StateCards';
import { useFlash } from './hooks/useFlash';

type StatePanelProps = {
  editorStats: EditorStats | null;
  txStats: TransactionStats;
  flashDep: unknown;
  flashColor?: string;
};

export function StatePanel({ editorStats, txStats, flashDep, flashColor }: StatePanelProps) {
  const flashRef = useFlash(flashDep, flashColor);

  return (
    <div className="viz-state-col" ref={flashRef}>
      <div className="viz-state-header">
        <span>EditorState</span>
      </div>
      <StateCards editorStats={editorStats} txStats={txStats} />
    </div>
  );
}
