'use client';

import React from 'react';
import type { TransactionRecord } from './types';
import { TransactionBubble } from './TransactionBubble';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';

type TransactionStreamProps = {
  transactions: TransactionRecord[];
  selectedTxId: number | null;
  onSelect: (id: number | null) => void;
  onClear: () => void;
};

export function TransactionStream({
  transactions,
  selectedTxId,
  onSelect,
  onClear,
}: TransactionStreamProps) {
  const { scrollRef, handleWheel } = useHorizontalScroll(transactions.length);

  return (
    <div className='viz-tr-log'>
      <div className='viz-tr-box'>
        <div className='viz-tr-header'>
          <span className='viz-tr-header-label'>Transaction Stream</span>
          {transactions.length > 0 && (
            <span className='viz-tr-count'>({transactions.length})</span>
          )}
          {transactions.length > 0 && (
            <button className='viz-clear-btn' onClick={onClear}>
              Clear
            </button>
          )}
        </div>
        <div ref={scrollRef} className='viz-tr-stream' onWheel={handleWheel}>
          {transactions.length === 0 ? (
            <div className='viz-empty-state'>
              Start typing to see transactions flow →
            </div>
          ) : (
            transactions.map((tx) => (
              <TransactionBubble
                key={tx.id}
                record={tx}
                isSelected={tx.id === selectedTxId}
                onClick={() => onSelect(tx.id === selectedTxId ? null : tx.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
