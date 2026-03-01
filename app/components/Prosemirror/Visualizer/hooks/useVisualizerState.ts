'use client';

import { useReducer, useMemo, useRef, useCallback, useEffect } from 'react';
import type { TransactionRecord, TransactionStats, EditorStats } from '../types';
import { MAX_TRANSACTIONS, LIFECYCLE_STEPS, LIFECYCLE_DELAY_MS } from '../constants';
import { statsFromTx } from '../utils';

const DEBOUNCE_MS = 800;

const EMPTY_COUNTERS: TransactionStats = {
  total: 0, docChanges: 0, selChanges: 0, markChanges: 0, historyOps: 0,
};

type VisualizerState = {
  transactions: TransactionRecord[];
  selectedTxId: number | null;
  animationEnabled: boolean;
  activeStepIndex: number | null;
  counters: TransactionStats;
};

type Action =
  | { type: 'TX_ADDED'; record: TransactionRecord }
  | { type: 'TX_SELECTED'; id: number | null }
  | { type: 'TX_CLEARED' }
  | { type: 'ANIM_TICK'; stepIndex: number | null }
  | { type: 'ANIM_TOGGLED' };

function incrementCounters(prev: TransactionStats, txType: string): TransactionStats {
  return {
    total: prev.total + 1,
    docChanges: prev.docChanges + (txType === 'doc' ? 1 : 0),
    selChanges: prev.selChanges + (txType === 'selection' ? 1 : 0),
    markChanges: prev.markChanges + (txType === 'mark' ? 1 : 0),
    historyOps: prev.historyOps + (txType === 'history' ? 1 : 0),
  };
}

function reducer(state: VisualizerState, action: Action): VisualizerState {
  switch (action.type) {
    case 'TX_ADDED': {
      const next = [action.record, ...state.transactions];
      return {
        ...state,
        transactions: next.length > MAX_TRANSACTIONS ? next.slice(0, MAX_TRANSACTIONS) : next,
        counters: incrementCounters(state.counters, action.record.type),
      };
    }
    case 'TX_SELECTED':
      return { ...state, selectedTxId: action.id };
    case 'TX_CLEARED':
      return { ...state, transactions: [], selectedTxId: null, counters: EMPTY_COUNTERS };
    case 'ANIM_TICK':
      return { ...state, activeStepIndex: action.stepIndex };
    case 'ANIM_TOGGLED':
      return { ...state, animationEnabled: !state.animationEnabled };
  }
}

const INITIAL_STATE: VisualizerState = {
  transactions: [],
  selectedTxId: null,
  animationEnabled: true,
  activeStepIndex: null,
  counters: EMPTY_COUNTERS,
};

export function useVisualizerState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressRef = useRef(false);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const clearAnimTimer = useCallback(() => {
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    clearAnimTimer();
    let i = 0;
    dispatch({ type: 'ANIM_TICK', stepIndex: null });

    function next() {
      if (i >= LIFECYCLE_STEPS.length) {
        dispatch({ type: 'ANIM_TICK', stepIndex: null });
        return;
      }
      dispatch({ type: 'ANIM_TICK', stepIndex: i });
      i++;
      animTimerRef.current = setTimeout(next, LIFECYCLE_DELAY_MS);
    }
    next();
  }, [clearAnimTimer]);

  const runAnimation = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(startAnimation, DEBOUNCE_MS);
  }, [startAnimation]);

  const handleTransaction = useCallback((record: TransactionRecord) => {
    dispatch({ type: 'TX_ADDED', record });
    if (suppressRef.current) {
      suppressRef.current = false;
    } else if (stateRef.current.animationEnabled) {
      runAnimation();
    }
  }, [runAnimation]);

  const selectTx = useCallback((id: number | null) => {
    dispatch({ type: 'TX_SELECTED', id });
    if (id !== null) {
      clearAnimTimer();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      dispatch({ type: 'ANIM_TICK', stepIndex: null });
    } else {
      suppressRef.current = true;
    }
  }, [clearAnimTimer]);

  const clearAll = useCallback(() => {
    dispatch({ type: 'TX_CLEARED' });
    clearAnimTimer();
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, [clearAnimTimer]);

  const toggleAnimation = useCallback(() => {
    dispatch({ type: 'ANIM_TOGGLED' });
  }, []);

  const stopAnimation = useCallback(() => {
    clearAnimTimer();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    dispatch({ type: 'ANIM_TICK', stepIndex: null });
  }, [clearAnimTimer]);

  // --- Derived state (all useMemo, zero useState) ---

  const latestTx = state.transactions[0] ?? null;

  const selectedTx = useMemo(
    () => state.selectedTxId !== null
      ? (state.transactions.find((t) => t.id === state.selectedTxId) ?? null)
      : null,
    [state.transactions, state.selectedTxId],
  );

  const isViewingSelected = selectedTx !== null;
  const inspectorTx = selectedTx ?? latestTx;

  const displayStats: EditorStats | null = useMemo(() => {
    const source = isViewingSelected ? selectedTx : latestTx;
    return source ? statsFromTx(source) : null;
  }, [isViewingSelected, selectedTx, latestTx]);

  const activeMarks = displayStats?.activeMarks ?? [];
  const snapshotHtml = isViewingSelected ? selectedTx!.afterRendered : null;

  return {
    transactions: state.transactions,
    activeStepIndex: state.activeStepIndex,
    animationEnabled: state.animationEnabled,
    counters: state.counters,

    selectedTx,
    inspectorTx,
    isViewingSelected,
    displayStats,
    activeMarks,
    snapshotHtml,

    handleTransaction,
    selectTx,
    clearAll,
    toggleAnimation,
    stopAnimation,
  };
}
