'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import type { TransactionRecord } from './types';
import { TransactionBubble } from './TransactionBubble';

type TransactionStreamProps = {
  transactions: TransactionRecord[];
  selectedTxId: number | null;
  onSelect: (tx: TransactionRecord | null) => void;
  onClear: () => void;
};

export function TransactionStream({
  transactions,
  selectedTxId,
  onSelect,
  onClear,
}: TransactionStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [transactions.length]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY || e.deltaX;
  }, []);

  return (
    <div className="viz-tr-log">
      <div className="viz-tr-box">
        <div className="viz-tr-header">
          <span className="viz-tr-header-label">Transaction Stream</span>
          {transactions.length > 0 && (
            <span className="viz-tr-count">({transactions.length})</span>
          )}
          {transactions.length > 0 && (
            <button className="viz-clear-btn" onClick={onClear}>Clear</button>
          )}
        </div>
        <div ref={scrollRef} className="viz-tr-stream" onWheel={handleWheel}>
          {transactions.length === 0 ? (
            <div className="viz-empty-state">Start typing to see transactions flow →</div>
          ) : (
            transactions.map((tx) => (
              <TransactionBubble
                key={tx.id}
                record={tx}
                isSelected={tx.id === selectedTxId}
                onClick={() => onSelect(tx.id === selectedTxId ? null : tx)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
