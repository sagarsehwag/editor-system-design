'use client';

import React from 'react';
import type { TransactionEntry } from './types';

type TransactionListProps = {
  transactions: TransactionEntry[];
  selectedTxId: number | null;
  onSelect: (tx: TransactionEntry, index: number) => void;
  onClear: () => void;
};

export function TransactionList({
  transactions,
  selectedTxId,
  onSelect,
  onClear,
}: TransactionListProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="pm-flow-tx-list">
      <div className="pm-flow-tx-row">
        <div className="pm-flow-tx-scroll">
          {transactions.map((tx, i) => (
            <button
              key={tx.id}
              type="button"
              className={`pm-flow-tx-item ${selectedTxId === tx.id ? 'active' : ''}`}
              onClick={() => onSelect(tx, i)}
              title={`Replay transaction ${i + 1}`}
            >
              #{i + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="pm-flow-tx-clear"
          onClick={onClear}
          title="Clear transaction history"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
