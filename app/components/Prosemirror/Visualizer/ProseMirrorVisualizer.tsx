'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import './Visualizer.css';
import { Header } from './Header';
import { EditorPane } from './EditorPane';
import { Lifecycle } from './Lifecycle';
import { StatePanel } from './StatePanel';
import { StepInspector } from './StepInspector';
import { TransactionStream } from './TransactionStream';
import { useProseMirrorEditor } from './hooks/useProseMirrorEditor';
import { useTransactionCapture } from './hooks/useTransactionCapture';
import { useLifecycleAnimation } from './hooks/useLifecycleAnimation';
import type { TransactionRecord, EditorStats } from './types';

function statsFromTx(tx: TransactionRecord): EditorStats {
  return {
    charCount: tx.charsAfter,
    nodeCount: tx.nodesAfter,
    version: tx.id,
    hasMarks: tx.marksAfter.length > 0,
    activeMarks: tx.marksAfter,
    selection: tx.selAfter!,
    resolvedPos: tx.resolvedPos,
  };
}

export default function ProseMirrorVisualizer() {
  const [liveStats, setLiveStats] = useState<EditorStats | null>(null);
  const [activeMarks, setActiveMarks] = useState<string[]>([]);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  const {
    transactions,
    selectedTx,
    stats: txStats,
    addTransaction,
    selectTransaction,
    clearTransactions,
  } = useTransactionCapture();

  const { activeStepIndex, runAnimation } = useLifecycleAnimation();
  const suppressAnimRef = useRef(false);

  const handleTransaction = useCallback(
    (record: TransactionRecord) => {
      addTransaction(record);
      if (suppressAnimRef.current) {
        suppressAnimRef.current = false;
      } else if (animationEnabled) {
        runAnimation();
      }
      setLiveStats(statsFromTx(record));
      setActiveMarks(record.marksAfter);
    },
    [addTransaction, runAnimation, animationEnabled]
  );

  const { onEditorReady, execCommand } = useProseMirrorEditor(handleTransaction);

  const handleSelectTx = useCallback((tx: TransactionRecord | null) => {
    selectTransaction(tx);
    if (!tx) {
      suppressAnimRef.current = true;
    }
  }, [selectTransaction]);

  const latestTx = transactions.length > 0 ? transactions[0] : null;
  const inspectorTx = selectedTx ?? latestTx;

  const isViewingSelected = selectedTx !== null;
  const displayStats = useMemo(
    () => (isViewingSelected ? statsFromTx(selectedTx!) : liveStats),
    [isViewingSelected, selectedTx, liveStats]
  );

  return (
    <div className="viz-root">
      <Header
        animationEnabled={animationEnabled}
        onToggleAnimation={() => setAnimationEnabled(prev => !prev)}
        selectedTxId={isViewingSelected ? selectedTx!.id : null}
        onBackToLive={() => handleSelectTx(null)}
      />
      <div className="viz-main">
        <EditorPane
          onEditorReady={onEditorReady}
          onCommand={execCommand}
          activeMarks={activeMarks}
          snapshotHtml={isViewingSelected ? selectedTx!.afterRendered : null}
          onDismissSnapshot={() => handleSelectTx(null)}
        />
        <StatePanel
          editorStats={displayStats}
          txStats={txStats}
        />
      </div>
      <Lifecycle activeStepIndex={activeStepIndex} />
      <StepInspector
        selectedTx={inspectorTx}
        activeStepIndex={activeStepIndex}
      />
      <TransactionStream
        transactions={transactions}
        selectedTxId={selectedTx?.id ?? null}
        onSelect={handleSelectTx}
        onClear={clearTransactions}
      />
    </div>
  );
}
