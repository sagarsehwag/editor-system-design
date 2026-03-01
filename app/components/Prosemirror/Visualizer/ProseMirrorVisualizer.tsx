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
      {fullscreen && (
        <button
          className='viz-fullscreen-close'
          onClick={exitFullscreen}
          title='Exit fullscreen (Esc)'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          >
            <line x1='5' y1='5' x2='15' y2='15' />
            <line x1='15' y1='5' x2='5' y2='15' />
          </svg>
        </button>
      )}
      <Header
        animationEnabled={viz.animationEnabled}
        onToggleAnimation={viz.toggleAnimation}
        selectedTxId={viz.isViewingSelected ? viz.selectedTx!.id : null}
        onBackToLive={() => viz.selectTx(null)}
        fullscreen={fullscreen}
        onToggleFullscreen={() => setFullscreen((f) => !f)}
      />
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
