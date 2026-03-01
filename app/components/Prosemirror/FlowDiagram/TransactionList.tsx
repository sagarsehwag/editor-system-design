'use client';

import React from 'react';
import type { TransactionEntry } from './types';

const TYPE_LABEL: Record<string, string> = {
  doc: 'DOC',
  selection: 'SEL',
  mark: 'MARK',
  history: 'HIST',
};

type TransactionListProps = {
  transactions: TransactionEntry[];
  selectedTxId: number | null;
  onSelect: (tx: TransactionEntry, index: number) => void;
  onDetail: (tx: TransactionEntry) => void;
  onClear: () => void;
};

export function TransactionList({
  transactions,
  selectedTxId,
  onSelect,
  onDetail,
  onClear,
}: TransactionListProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="pm-flow-tx-list">
      <div className="pm-flow-tx-stream-row">
        <div className="pm-flow-tx-stream">
          {transactions.map((tx, i) => {
            const delta = tx.charsAfter - tx.charsBefore;
            const deltaStr =
              delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : null;
            const isSelected = selectedTxId === tx.id;
            const isNewest = i === transactions.length - 1;

            return (
              <button
                key={tx.id}
                type="button"
                className={`pm-flow-tx-bubble pm-flow-tx-${tx.txType} ${isSelected ? 'active' : ''} ${isNewest ? 'new' : ''}`}
                onClick={() => onSelect(tx, i)}
                onDoubleClick={() => onDetail(tx)}
                title="Click to replay · Double-click for details"
              >
                <span className="pm-flow-tx-bubble-id">
                  #{tx.id} · {tx.timestamp}
                </span>
                <span className={`pm-flow-tx-bubble-type pm-flow-tx-type-${tx.txType}`}>
                  {TYPE_LABEL[tx.txType] ?? tx.txType.toUpperCase()}
                </span>
                <div className="pm-flow-tx-chips">
                  {tx.stepChips.map((chip, ci) => (
                    <span
                      key={ci}
                      className={`pm-flow-tx-chip pm-flow-tx-chip-${chip.kind}`}
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
                <span className="pm-flow-tx-bubble-meta">
                  {tx.charsBefore}→{tx.charsAfter}
                  {deltaStr && (
                    <span className={`pm-flow-tx-delta pm-flow-tx-delta-${delta > 0 ? 'pos' : 'neg'}`}>
                      {' '}{deltaStr}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
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
      <p className="pm-flow-tx-hint">Click to replay · Double-click for details</p>
    </div>
  );
}
