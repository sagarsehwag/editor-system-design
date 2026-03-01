'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { startTransition } from 'react';
import type { TransactionEntry } from '../types';
import { STEPS, FLASH_DURATION_MS, STATE_APPLY_DURATION_MS, MAX_TRANSACTIONS } from '../constants';

export function useTransactionFlow() {
  const [doc, setDoc] = useState<object>(() => ({
    type: 'doc',
    content: [{ type: 'paragraph' }],
  }));
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const selectedTx = useMemo(() => {
    if (transactions.length === 0) return null;
    const idx =
      selectedTxId !== null
        ? transactions.findIndex((t) => t.id === selectedTxId)
        : -1;
    return idx >= 0 ? transactions[idx] : transactions[transactions.length - 1];
  }, [transactions, selectedTxId]);

  const handleFlush = useCallback(
    (
      entries: TransactionEntry[],
      latest: { id: number; afterDoc: object } | null
    ) => {
      startTransition(() => {
        setTransactions((prev) =>
          [...prev, ...entries].slice(-MAX_TRANSACTIONS)
        );
        if (latest) {
          setSelectedTxId(latest.id);
          setDoc(latest.afterDoc);
          setActiveStep(0);
          setIsPaused(false);
        }
      });
    },
    []
  );

  useEffect(() => {
    if (activeStep === null || isPaused) return;
    const duration =
      activeStep === 2 ? STATE_APPLY_DURATION_MS : FLASH_DURATION_MS;
    if (activeStep >= STEPS.length - 1) {
      const id = setTimeout(() => setActiveStep(null), duration);
      return () => clearTimeout(id);
    }
    const id = setTimeout(
      () => setActiveStep((s) => (s ?? 0) + 1),
      duration
    );
    return () => clearTimeout(id);
  }, [activeStep, isPaused]);

  const handleStepHover = useCallback((index: number) => {
    setActiveStep(index);
    setIsPaused(true);
  }, []);

  const handleFlowEnter = useCallback(() => setIsPaused(true), []);
  const handleFlowLeave = useCallback(() => setIsPaused(false), []);

  const handleSelectTransaction = useCallback(
    (tx: TransactionEntry, _index: number) => {
      setSelectedTxId(tx.id);
      setActiveStep(0);
      setIsPaused(false);
    },
    []
  );

  const handleClearTransactions = useCallback(() => {
    setTransactions([]);
    setSelectedTxId(null);
    setActiveStep(null);
  }, []);

  return {
    doc,
    setDoc,
    transactions,
    selectedTx,
    selectedTxId,
    activeStep,
    isPaused,
    handleFlush,
    handleStepHover,
    handleFlowEnter,
    handleFlowLeave,
    handleSelectTransaction,
    handleClearTransactions,
  };
}
