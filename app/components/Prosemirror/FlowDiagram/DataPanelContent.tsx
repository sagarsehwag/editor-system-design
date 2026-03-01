'use client';

import React from 'react';
import type { TransactionEntry, LiveState } from './types';
import { JsonHighlight } from './JsonHighlight';
import { DocDiffView } from './DocDiffView';
import { DomDiffView } from './DomDiffView';
import { LiveStateView } from './LiveStateView';

type DataPanelContentProps = {
  selectedTx: TransactionEntry | null;
  activeStep: number | null;
  liveState: LiveState;
};

export function DataPanelContent({ selectedTx, activeStep, liveState }: DataPanelContentProps) {
  // No transaction yet — show live EditorState
  if (!selectedTx) {
    return <LiveStateView liveState={liveState} />;
  }

  if (activeStep === 0 && selectedTx.lastDomEvent) {
    return (
      <>
        <span className="pm-flow-data-label">DOM event</span>
        <pre className="pm-flow-data-json pm-flow-json-event">
          {selectedTx.lastDomEvent}
        </pre>
      </>
    );
  }

  if (activeStep === 1) {
    return (
      <>
        <span className="pm-flow-data-label">Transaction</span>
        <JsonHighlight data={selectedTx.tr} />
      </>
    );
  }

  if (activeStep === 2) {
    return (
      <div className="pm-flow-data-diff-wrapper">
        <DocDiffView before={selectedTx.beforeDoc} after={selectedTx.afterDoc} />
      </div>
    );
  }

  if (activeStep === 3 && selectedTx.beforeRendered && selectedTx.afterRendered) {
    return (
      <div className="pm-flow-data-diff-wrapper">
        <DomDiffView
          before={selectedTx.beforeRendered}
          after={selectedTx.afterRendered}
        />
      </div>
    );
  }

  if (activeStep === 3) {
    return (
      <>
        <span className="pm-flow-data-label">Result</span>
        <JsonHighlight data={selectedTx.afterDoc} />
      </>
    );
  }

  // Fallback when no step is hovered but a tx is selected — show live state
  return <LiveStateView liveState={liveState} />;
}
