'use client';

import { useState, useCallback, useRef } from 'react';
import type { TransactionRecord } from '../types';
import { MAX_TRANSACTIONS } from '../constants';

export type TransactionStats = {
  total: number;
  docChanges: number;
  selChanges: number;
  markChanges: number;
  historyOps: number;
};

export function useTransactionCapture() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [stats, setStats] = useState<TransactionStats>({
    total: 0, docChanges: 0, selChanges: 0, markChanges: 0, historyOps: 0,
  });

  const statsRef = useRef(stats);

  const addTransaction = useCallback((record: TransactionRecord) => {
    setTransactions((prev) => {
      const next = [record, ...prev];
      return next.length > MAX_TRANSACTIONS ? next.slice(0, MAX_TRANSACTIONS) : next;
    });

    const s = statsRef.current;
    const newStats = {
      total: s.total + 1,
      docChanges: s.docChanges + (record.type === 'doc' ? 1 : 0),
      selChanges: s.selChanges + (record.type === 'selection' ? 1 : 0),
      markChanges: s.markChanges + (record.type === 'mark' ? 1 : 0),
      historyOps: s.historyOps + (record.type === 'history' ? 1 : 0),
    };
    statsRef.current = newStats;
    setStats(newStats);
  }, []);

  const selectTransaction = useCallback((tx: TransactionRecord | null) => {
    setSelectedTx(tx);
  }, []);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
    setSelectedTx(null);
    const reset = { total: 0, docChanges: 0, selChanges: 0, markChanges: 0, historyOps: 0 };
    statsRef.current = reset;
    setStats(reset);
  }, []);

  return {
    transactions,
    selectedTx,
    stats,
    addTransaction,
    selectTransaction,
    clearTransactions,
  };
}
