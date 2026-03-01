'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { startTransition } from 'react';
import type { TransactionEntry, LiveState } from '../types';
import { STEPS, FLASH_DURATION_MS, STATE_APPLY_DURATION_MS, MAX_TRANSACTIONS } from '../constants';

const DEFAULT_LIVE_STATE: LiveState = {
  charCount: 0,
  nodeCount: 1,
  version: 0,
  hasMarks: false,
  selType: 'Caret',
  selCollapsed: true,
  selFrom: 0,
  selTo: 0,
  selText: '',
  activeMarks: [],
  totalTx: 0,
  docChanges: 0,
  selChanges: 0,
  markChanges: 0,
  historyOps: 0,
};

export function useTransactionFlow() {
  const [doc, setDoc] = useState<object>(() => ({
    type: 'doc',
    content: [{ type: 'paragraph' }],
  }));
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [liveState, setLiveState] = useState<LiveState>(DEFAULT_LIVE_STATE);
  const [detailTx, setDetailTx] = useState<TransactionEntry | null>(null);

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

  const handleLiveState = useCallback((state: LiveState) => {
    setLiveState(state);
  }, []);

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

  const handleOpenDetail = useCallback((tx: TransactionEntry) => {
    setDetailTx(tx);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailTx(null);
  }, []);

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
    liveState,
    detailTx,
    handleFlush,
    handleLiveState,
    handleStepHover,
    handleFlowEnter,
    handleFlowLeave,
    handleSelectTransaction,
    handleOpenDetail,
    handleCloseDetail,
    handleClearTransactions,
  };
}
