'use client';

import React from 'react';
import type { TransactionEntry } from './types';
import { JsonHighlight } from './JsonHighlight';
import { DocDiffView } from './DocDiffView';
import { DomDiffView } from './DomDiffView';
type DataPanelContentProps = {
  selectedTx: TransactionEntry | null;
  activeStep: number | null;
};

export function DataPanelContent({ selectedTx, activeStep }: DataPanelContentProps) {
  if (!selectedTx) {
    return (
      <p className="pm-flow-data-placeholder">
        Type in the editor to see the flow. Hover steps to inspect data.
      </p>
    );
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

  return (
    <p className="pm-flow-data-placeholder">Hover steps to inspect data.</p>
  );
}
