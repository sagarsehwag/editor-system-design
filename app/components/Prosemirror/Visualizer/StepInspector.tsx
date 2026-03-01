'use client';

import React from 'react';
import type { TransactionRecord } from './types';
import { describeTransaction } from './utils';
import { StepChips } from './StepChips';
import { JsonHighlight } from './JsonHighlight';
import { DocDiffView } from './DocDiffView';
import { DomDiffView } from './DomDiffView';
import { useFlash } from './hooks/useFlash';
import { LIFECYCLE_STEPS } from './constants';

type StepInspectorProps = {
  selectedTx: TransactionRecord | null;
  activeStepIndex: number | null;
  clickedStepIndex: number | null;
  flashDep: unknown;
  flashColor?: string;
};

type PanelId = 'view' | 'json' | 'doc' | 'dom';

const STEP_TO_PANEL: Record<number, PanelId> = {
  0: 'view',
  1: 'json',
  2: 'doc',
  3: 'dom',
};

function WhatHappened({ tx }: { tx: TransactionRecord }) {
  const desc = describeTransaction(tx);
  return (
    <div className={`viz-what-happened viz-what-${desc.color}`}>
      <span className='viz-what-icon'>{desc.icon}</span>
      <div className='viz-what-text'>
        <span className='viz-what-action'>{desc.action}</span>
        <span className='viz-what-detail'>{desc.detail}</span>
      </div>
    </div>
  );
}

function DeltaValue({
  before,
  after,
  unit,
}: {
  before: number;
  after: number;
  unit?: string;
}) {
  const delta = after - before;
  const suffix = unit ? ` ${unit}` : '';
  if (delta === 0)
    return (
      <span className='viz-v'>
        {after}
        {suffix}
      </span>
    );
  return (
    <span className='viz-v'>
      {before} → {after}
      {suffix}
      <span
        className={`viz-delta ${delta > 0 ? 'viz-delta-up' : 'viz-delta-down'}`}
      >
        {delta > 0 ? `+${delta}` : delta}
      </span>
    </span>
  );
}

function ViewPanel({ tx }: { tx: TransactionRecord }) {
  const desc = describeTransaction(tx);
  const selChanged =
    tx.selBefore?.anchor !== tx.selAfter?.anchor ||
    tx.selBefore?.head !== tx.selAfter?.head;

  return (
    <div className='viz-view-tab'>
      <WhatHappened tx={tx} />
      <div className='viz-insp-grid'>
        <div className='viz-insp-cell'>
          <span className='viz-k'>source</span>
          <span className='viz-v'>{tx.source}</span>
        </div>
        <div className='viz-insp-cell'>
          <span className='viz-k'>dom event</span>
          <span className='viz-v'>{tx.lastDomEvent || '—'}</span>
        </div>
        {selChanged && tx.selAfter && (
          <div className='viz-insp-cell'>
            <span className='viz-k'>cursor</span>
            <span className='viz-v'>
              {tx.selAfter.type} @ {tx.selAfter.anchor}
            </span>
          </div>
        )}
        <div className='viz-insp-cell'>
          <span className='viz-k'>type</span>
          <span className={`viz-type-badge viz-type-${tx.type}`}>
            {tx.type.toUpperCase()}
          </span>
        </div>
      </div>
      {desc.detail && (
        <div className='viz-view-detail'>
          <span className='viz-k'>result</span>
          <span className='viz-v'>{desc.detail}</span>
        </div>
      )}
    </div>
  );
}

function TransactionPanel({ tx }: { tx: TransactionRecord }) {
  const marksChanged = tx.marksBefore.join(',') !== tx.marksAfter.join(',');

  return (
    <div className='viz-tr-panel'>
      <div className='viz-tr-panel-json'>
        <JsonHighlight data={tx.tr} />
      </div>
      <div className='viz-tr-panel-meta'>
        <div className='viz-insp-header-row'>
          <span className={`viz-type-badge viz-type-${tx.type}`}>
            {tx.type.toUpperCase()}
          </span>
          <span className='viz-insp-id'>#{tx.id}</span>
          <span className='viz-insp-time'>{tx.time}</span>
        </div>
        {marksChanged && (
          <div className='viz-insp-flags'>
            <span className='viz-insp-flag viz-insp-flag-orange'>
              marksChanged
            </span>
          </div>
        )}
        <div className='viz-tr-panel-stats'>
          <div className='viz-insp-cell'>
            <span className='viz-k'>characters</span>
            <DeltaValue before={tx.charsBefore} after={tx.charsAfter} />
          </div>
          <div className='viz-insp-cell'>
            <span className='viz-k'>nodes</span>
            <DeltaValue before={tx.nodesBefore} after={tx.nodesAfter} />
          </div>
        </div>
        {tx.steps.length > 0 && (
          <div className='viz-tr-panel-steps'>
            <span className='viz-k'>steps ({tx.steps.length})</span>
            <StepChips steps={tx.steps} />
          </div>
        )}
      </div>
    </div>
  );
}

function PanelContent({
  panel,
  tx,
}: {
  panel: PanelId;
  tx: TransactionRecord;
}) {
  switch (panel) {
    case 'view':
      return <ViewPanel tx={tx} />;
    case 'json':
      return <TransactionPanel tx={tx} />;
    case 'doc':
      return <DocDiffView before={tx.beforeDoc} after={tx.afterDoc} />;
    case 'dom':
      return (
        <DomDiffView before={tx.beforeRendered} after={tx.afterRendered} />
      );
  }
}

export function StepInspector({
  selectedTx,
  activeStepIndex,
  clickedStepIndex,
  flashDep,
  flashColor,
}: StepInspectorProps) {
  const flashRef = useFlash(flashDep, flashColor);
  const stepIndex = activeStepIndex ?? clickedStepIndex;
  const panel: PanelId =
    stepIndex !== null ? (STEP_TO_PANEL[stepIndex] ?? 'view') : 'view';
  const stepDef =
    stepIndex !== null ? LIFECYCLE_STEPS[stepIndex] : LIFECYCLE_STEPS[0];

  if (!selectedTx) {
    return (
      <div className='viz-inspector'>
        <div className='viz-inspector-box' ref={flashRef}>
          <div className='viz-inspector-header'>
            <span className='viz-inspector-title'>{stepDef.label}</span>
            <span className='viz-inspector-subtitle'>{stepDef.desc}</span>
          </div>
          <div className='viz-inspector-callout'>{stepDef.tooltip}</div>
          <div className='viz-inspector-empty'>
            Type in the editor or select a transaction to inspect
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='viz-inspector'>
      <div className='viz-inspector-box' ref={flashRef}>
        <div className='viz-inspector-header'>
          <span className='viz-inspector-title'>{stepDef.label}</span>
          <span className='viz-inspector-subtitle'>{stepDef.desc}</span>
        </div>
        <div className='viz-inspector-callout'>{stepDef.tooltip}</div>
        <div className='viz-inspector-body'>
          <PanelContent panel={panel} tx={selectedTx} />
        </div>
      </div>
    </div>
  );
}
