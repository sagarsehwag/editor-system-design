'use client';

import React, { useState, useEffect, useCallback } from 'react';
import './Visualizer.css';
import { Header } from './Header';
import { EditorPane } from './EditorPane';
import { Lifecycle } from './Lifecycle';
import { StatePanel } from './StatePanel';
import { StepInspector } from './StepInspector';
import { TransactionStream } from './TransactionStream';
import { useProseMirrorEditor } from './hooks/useProseMirrorEditor';
import { useVisualizerState } from './hooks/useVisualizerState';

export default function ProseMirrorVisualizer() {
  const viz = useVisualizerState();
  const { onEditorReady, execCommand } = useProseMirrorEditor(
    viz.handleTransaction,
  );
  const [clickedStep, setClickedStep] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const exitFullscreen = useCallback(() => setFullscreen(false), []);

  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) exitFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [fullscreen, exitFullscreen]);

  return (
    <div className={`viz-root${fullscreen ? ' viz-fullscreen' : ''}`}>
      <Header
        animationEnabled={viz.animationEnabled}
        onToggleAnimation={viz.toggleAnimation}
        selectedTxId={viz.isViewingSelected ? viz.selectedTx!.id : null}
        onBackToLive={() => viz.selectTx(null)}
        fullscreen={fullscreen}
        onToggleFullscreen={() => setFullscreen((f) => !f)}
      />
      <p className='viz-subtitle'>
        Every edit follows the same cycle: a DOM event is intercepted by the
        EditorView, translated into a Transaction, applied to produce a new
        immutable EditorState, and rendered back to the DOM.
      </p>
      <div className='viz-main'>
        <EditorPane
          onEditorReady={onEditorReady}
          onCommand={execCommand}
          activeMarks={viz.activeMarks}
          snapshotHtml={viz.snapshotHtml}
          onDismissSnapshot={() => viz.selectTx(null)}
          flashDep={viz.selectedTx?.id ?? null}
          flashColor={viz.selectedTx?.type}
        />
        <StatePanel
          editorStats={viz.displayStats}
          txStats={viz.counters}
          flashDep={viz.selectedTx?.id ?? null}
          flashColor={viz.selectedTx?.type}
        />
      </div>
      <Lifecycle
        activeStepIndex={viz.activeStepIndex}
        onStepClick={(idx) => {
          viz.stopAnimation();
          setClickedStep(idx);
        }}
      />
      <StepInspector
        selectedTx={viz.inspectorTx}
        activeStepIndex={viz.activeStepIndex}
        clickedStepIndex={clickedStep}
        flashDep={viz.selectedTx?.id ?? null}
        flashColor={viz.selectedTx?.type}
      />
      <TransactionStream
        transactions={viz.transactions}
        selectedTxId={viz.selectedTx?.id ?? null}
        onSelect={viz.selectTx}
        onClear={viz.clearAll}
      />
    </div>
  );
}
