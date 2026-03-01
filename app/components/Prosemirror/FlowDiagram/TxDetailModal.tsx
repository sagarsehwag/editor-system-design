'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { TransactionEntry } from './types';

const TYPE_COLOR: Record<string, string> = {
  doc: 'var(--accent-purple)',
  selection: 'var(--accent-green)',
  mark: 'var(--accent-orange)',
  history: 'var(--accent-blue)',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pm-txd-section">
      <h3 className="pm-txd-section-title">{title}</h3>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="pm-txd-row">
      <span className="pm-txd-key">{k}</span>
      <span className="pm-txd-val">{v}</span>
    </div>
  );
}

const CODE_SNIPPET = `// Override dispatchTransaction on EditorView
const view = new EditorView(mount, {
  state,
  dispatchTransaction(tr) {
    const prev = this.state;
    const next = prev.apply(tr); // new immutable state

    // Inspect BEFORE updating DOM:
    tr.steps;               // Step[]
    tr.docChanged;          // boolean
    tr.selectionSet;        // boolean
    tr.getMeta('uiEvent');  // 'click' | 'paste' | ...

    this.updateState(next); // reconcile DOM
  }
});

// Or use Plugin hooks:
new Plugin({
  filterTransaction(tr, state) {
    return true; // false = block
  },
  appendTransaction(trs, oldState, newState) {
    return null; // return a tr to chain
  }
});`;

type Props = {
  tx: TransactionEntry;
  onClose: () => void;
};

export function TxDetailModal({ tx, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const delta = tx.charsAfter - tx.charsBefore;
  const deltaStr = delta > 0 ? `+${delta}` : `${delta}`;
  const typeColor = TYPE_COLOR[tx.txType] ?? 'var(--text-secondary)';

  const modal = (
    <div className="pm-txd-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pm-txd-box" role="dialog" aria-modal="true">
        <div className="pm-txd-header">
          <span className="pm-txd-title" style={{ color: typeColor }}>
            Transaction #{tx.id}
          </span>
          <button className="pm-txd-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="pm-txd-body">
          <Section title="Identity">
            <Row k="id" v={`#${tx.id}`} />
            <Row k="time" v={tx.timestamp} />
            <Row k="type" v={tx.txType} />
            <Row k="source" v={tx.lastDomEvent ?? '—'} />
          </Section>

          <Section title="Document Delta">
            <Row k="chars before" v={tx.charsBefore} />
            <Row k="chars after" v={tx.charsAfter} />
            <Row k="delta" v={delta === 0 ? '0' : deltaStr} />
          </Section>

          <Section title="Selection">
            <Row k="type before" v={tx.selBefore.selType} />
            <Row k="type after" v={tx.selAfter.selType} />
            <Row k="from" v={tx.selAfter.from} />
            <Row k="to" v={tx.selAfter.to} />
            {tx.selAfter.text && <Row k="selected text" v={`"${tx.selAfter.text}"`} />}
          </Section>

          <Section title={`Steps (${(tx.tr as { steps: unknown[] }).steps?.length ?? 0})`}>
            {((tx.tr as { steps: unknown[] }).steps?.length ?? 0) === 0 ? (
              <p className="pm-txd-empty">No steps — selection or meta transaction</p>
            ) : (
              (tx.tr as { steps: Record<string, unknown>[] }).steps.map((step, i) => (
                <div key={i} className="pm-txd-step">
                  <div className="pm-txd-step-type">{String(step.stepType ?? 'step').toUpperCase()}</div>
                  {Object.entries(step)
                    .filter(([k]) => k !== 'stepType')
                    .map(([k, v]) => (
                      <Row key={k} k={k} v={JSON.stringify(v)} />
                    ))}
                </div>
              ))
            )}
          </Section>

          <Section title="How to intercept">
            <pre className="pm-txd-code">{CODE_SNIPPET}</pre>
          </Section>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
}
