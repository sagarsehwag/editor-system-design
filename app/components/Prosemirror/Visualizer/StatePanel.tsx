'use client';

import React from 'react';
import type { EditorStats } from './types';
import type { TransactionStats } from './hooks/useTransactionCapture';
import { StateCards } from './StateCards';

type StatePanelProps = {
  editorStats: EditorStats | null;
  txStats: TransactionStats;
};

export function StatePanel({ editorStats, txStats }: StatePanelProps) {
  return (
    <div className="viz-state-col">
      <div className="viz-state-header">
        <span>EditorState</span>
      </div>
      <StateCards editorStats={editorStats} txStats={txStats} />
    </div>
  );
}
