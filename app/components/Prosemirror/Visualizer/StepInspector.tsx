'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { TransactionRecord } from './types';
import { JsonHighlight } from './JsonHighlight';
import { DocDiffView } from './DocDiffView';
import { DomDiffView } from './DomDiffView';

type StepInspectorProps = {
  selectedTx: TransactionRecord | null;
  activeStepIndex: number | null;
};

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'json', label: 'Transaction' },
  { id: 'doc', label: 'Document' },
  { id: 'dom', label: 'DOM' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const STEP_TO_TAB: Record<number, TabId> = {
  0: 'summary',
  1: 'json',
  2: 'doc',
  3: 'dom',
};

type TxDescription = {
  icon: string;
  action: string;
  detail: string;
  color: string;
};

function describeTransaction(tx: TransactionRecord): TxDescription {
  const delta = tx.charsAfter - tx.charsBefore;

  if (tx.type === 'history') {
    const isRedo = tx.steps[0]?.action === 'redo';
    const charNote = delta !== 0
      ? ` · ${Math.abs(delta)} char${Math.abs(delta) !== 1 ? 's' : ''} ${delta > 0 ? 'restored' : 'removed'}`
      : '';
    return {
      icon: isRedo ? '↪' : '↩',
      action: isRedo ? 'Redo' : 'Undo',
      detail: `Reverted via ${tx.source}${charNote}`,
      color: 'green',
    };
  }

  if (tx.type === 'mark') {
    const cmds = tx.steps.filter(s => s.type === 'mark').map(s => s.cmd).filter(Boolean);
    return {
      icon: '✦',
      action: `Toggle ${cmds.join(', ') || 'formatting'}`,
      detail: `Triggered by ${tx.source}`,
      color: 'orange',
    };
  }

  if (tx.type === 'doc') {
    if (delta > 0) {
      const key = tx.lastDomEvent?.match(/key="(.+?)"/)?.[1];
      if (key && key.length === 1) {
        return {
          icon: '⌨',
          action: `Typed "${key}"`,
          detail: `${tx.charsAfter} chars · ${tx.nodesAfter} nodes · +${delta}`,
          color: 'purple',
        };
      }
      if (tx.lastDomEvent?.includes('paste')) {
        return {
          icon: '📋',
          action: `Pasted ${delta} char${delta !== 1 ? 's' : ''}`,
          detail: `${tx.charsAfter} chars · ${tx.nodesAfter} nodes`,
          color: 'purple',
        };
      }
      return {
        icon: '＋',
        action: `Inserted ${delta} char${delta !== 1 ? 's' : ''}`,
        detail: `${tx.charsAfter} chars · ${tx.nodesAfter} nodes`,
        color: 'purple',
      };
    }
    if (delta < 0) {
      return {
        icon: '⌫',
        action: `Deleted ${Math.abs(delta)} char${Math.abs(delta) !== 1 ? 's' : ''}`,
        detail: `${tx.charsAfter} chars · ${tx.nodesAfter} nodes`,
        color: 'purple',
      };
    }
    return {
      icon: '↔',
      action: 'Replaced content',
      detail: `Same length · ${tx.charsAfter} chars · ${tx.nodesAfter} nodes`,
      color: 'purple',
    };
  }

  if (tx.type === 'selection') {
    const sel = tx.selAfter;
    if (sel && !sel.empty) {
      return {
        icon: '▋',
        action: `Selected ${sel.to - sel.from} chars`,
        detail: `Range ${sel.from}→${sel.to} via ${tx.source}`,
        color: 'blue',
      };
    }
    return {
      icon: '│',
      action: `Cursor → ${sel?.anchor ?? 0}`,
      detail: `Moved via ${tx.source}`,
      color: 'blue',
    };
  }

  return {
    icon: '◆',
    action: 'Meta transaction',
    detail: `From ${tx.source}`,
    color: 'purple',
  };
}

function WhatHappened({ tx }: { tx: TransactionRecord }) {
  const desc = describeTransaction(tx);
  return (
    <div className={`viz-what-happened viz-what-${desc.color}`}>
      <span className="viz-what-icon">{desc.icon}</span>
      <div className="viz-what-text">
        <span className="viz-what-action">{desc.action}</span>
        <span className="viz-what-detail">{desc.detail}</span>
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

function SummaryTab({ tx }: { tx: TransactionRecord }) {
  const nodeDelta = tx.nodesAfter - tx.nodesBefore;
  const marksChanged = tx.marksBefore.join(',') !== tx.marksAfter.join(',');
  const selChanged =
    tx.selBefore?.anchor !== tx.selAfter?.anchor ||
    tx.selBefore?.head !== tx.selAfter?.head;

  return (
    <div className='viz-inspector-content'>
      <div className='viz-insp-header-row'>
        <span className={`viz-type-badge viz-type-${tx.type}`}>
          {tx.type.toUpperCase()}
        </span>
        <span className='viz-insp-id'>#{tx.id}</span>
        <span className='viz-insp-time'>{tx.time}</span>
        <div className='viz-insp-flags'>
          {tx.type === 'doc' && (
            <span className='viz-insp-flag viz-insp-flag-purple'>
              docChanged
            </span>
          )}
          {selChanged && (
            <span className='viz-insp-flag viz-insp-flag-blue'>
              selectionSet
            </span>
          )}
          {marksChanged && (
            <span className='viz-insp-flag viz-insp-flag-orange'>
              marksChanged
            </span>
          )}
        </div>
      </div>

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
        <div className='viz-insp-cell'>
          <span className='viz-k'>characters</span>
          <DeltaValue before={tx.charsBefore} after={tx.charsAfter} />
        </div>
        <div className='viz-insp-cell'>
          <span className='viz-k'>nodes</span>
          <DeltaValue before={tx.nodesBefore} after={tx.nodesAfter} />
          {nodeDelta !== 0 && (
            <span className='viz-insp-hint'>
              {nodeDelta > 0 ? 'nodes added' : 'nodes removed'}
            </span>
          )}
        </div>
      </div>

      {selChanged && tx.selBefore && tx.selAfter && (
        <div className='viz-insp-section'>
          <h4>Selection Change</h4>
          <div className='viz-insp-grid'>
            <div className='viz-insp-cell'>
              <span className='viz-k'>before</span>
              <span className='viz-v'>
                {tx.selBefore.type} @ {tx.selBefore.anchor}:{tx.selBefore.head}
              </span>
            </div>
            <div className='viz-insp-cell'>
              <span className='viz-k'>after</span>
              <span className='viz-v'>
                {tx.selAfter.type} @ {tx.selAfter.anchor}:{tx.selAfter.head}
              </span>
            </div>
          </div>
        </div>
      )}

      {marksChanged && (
        <div className='viz-insp-section'>
          <h4>Marks Change</h4>
          <div className='viz-insp-grid'>
            <div className='viz-insp-cell'>
              <span className='viz-k'>before</span>
              <span className='viz-v'>
                {tx.marksBefore.length ? tx.marksBefore.join(', ') : 'none'}
              </span>
            </div>
            <div className='viz-insp-cell'>
              <span className='viz-k'>after</span>
              <span className='viz-v'>
                {tx.marksAfter.length ? tx.marksAfter.join(', ') : 'none'}
              </span>
            </div>
          </div>
        </div>
      )}

      {tx.steps.length > 0 && (
        <div className='viz-insp-section'>
          <h4>Steps ({tx.steps.length})</h4>
          <div className='viz-insp-step-chips'>
            {tx.steps.map((s, i) => {
              let label = s.type.toUpperCase();
              if (s.delta !== undefined && s.delta !== 0)
                label += ` ${s.delta > 0 ? '+' : ''}${s.delta}`;
              if (s.cmd) label += ` ${s.cmd}`;
              if (s.action) label += ` ${s.action}`;
              const colorClass =
                s.type === 'insert'
                  ? 'viz-chip-insert'
                  : s.type === 'delete'
                    ? 'viz-chip-delete'
                    : s.type === 'mark'
                      ? 'viz-chip-mark'
                      : s.type === 'hist'
                        ? 'viz-chip-hist'
                        : 'viz-chip-sel';
              return (
                <span key={i} className={`viz-chip ${colorClass}`}>
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {tx.selAfter && !tx.selAfter.empty && tx.selAfter.text && (
        <div className='viz-insp-section'>
          <h4>Selected Text</h4>
          <div className='viz-code-block'>{tx.selAfter.text}</div>
        </div>
      )}
    </div>
  );
}

export function StepInspector({
  selectedTx,
  activeStepIndex,
}: StepInspectorProps) {
  const [userTab, setUserTab] = useState<TabId>('summary');
  const wasAnimatingRef = useRef(false);

  const isAnimating = activeStepIndex !== null;
  const animTab = isAnimating
    ? (STEP_TO_TAB[activeStepIndex] ?? 'summary')
    : null;
  const displayTab = animTab ?? userTab;

  useEffect(() => {
    if (!isAnimating && wasAnimatingRef.current) {
      setUserTab('summary');
    }
    wasAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  if (!selectedTx) {
    return (
      <div className='viz-inspector'>
        <div className='viz-inspector-box'>
          <div className='viz-inspector-tabs'>
            {TABS.map((t) => (
              <button key={t.id} className='viz-inspector-tab' disabled>
                {t.label}
              </button>
            ))}
          </div>
          <div className='viz-inspector-empty'>
            Select a transaction to inspect
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='viz-inspector'>
      <div className='viz-inspector-box'>
        <div className='viz-inspector-tabs'>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`viz-inspector-tab ${displayTab === t.id ? 'active' : ''}`}
              onClick={() => {
                if (!isAnimating) setUserTab(t.id);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className='viz-inspector-body'>
          {displayTab === 'summary' && <SummaryTab tx={selectedTx} />}
          {displayTab === 'json' && <JsonHighlight data={selectedTx.tr} />}
          {displayTab === 'doc' && (
            <DocDiffView
              before={selectedTx.beforeDoc}
              after={selectedTx.afterDoc}
            />
          )}
          {displayTab === 'dom' && (
            <DomDiffView
              before={selectedTx.beforeRendered}
              after={selectedTx.afterRendered}
            />
          )}
        </div>
      </div>
    </div>
  );
}
