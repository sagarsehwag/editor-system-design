'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Diff from 'diff';
import { startTransition } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMSerializer } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import 'prosemirror-view/style/prosemirror.css';

const STEPS = [
  {
    id: 'view-input',
    label: 'EditorView',
    sublabel: 'Input handler',
    desc: 'Captures DOM input (keydown, input, paste)',
    code: 'view.dom.addEventListener(...)',
    detail: 'Creates Transaction from DOM change',
    color: 'purple',
  },
  {
    id: 'transaction',
    label: 'Transaction',
    sublabel: 'Steps',
    desc: 'ReplaceStep, AddMarkStep, etc.',
    code: 'tr.steps',
    detail: 'Plugins: filterTransaction, appendTransaction',
    color: 'orange',
  },
  {
    id: 'apply',
    label: 'state.apply(tr)',
    sublabel: 'Immutable',
    desc: 'Returns new EditorState',
    code: 'const newState = state.apply(tr)',
    detail: 'Old state unchanged — enables undo',
    color: 'green',
  },
  {
    id: 'view-update',
    label: 'view.updateState()',
    sublabel: 'Re-render',
    desc: 'Updates DOM from new state',
    code: 'view.updateState(newState)',
    detail: 'Efficient diffing, preserves selection',
    color: 'blue',
  },
] as const;

const DEBOUNCE_MS = 500;
const FLASH_DURATION_MS = 1600;
const STATE_APPLY_DURATION_MS = 2800; /* step 2: state.apply - longer to view diff */
const MAX_TRANSACTIONS = 10;

type TransactionEntry = {
  id: number;
  tr: object;
  beforeDoc: object;
  afterDoc: object;
  beforeRendered: string;
  afterRendered: string;
  lastDomEvent: string | null;
};

function transactionToJSON(tr: {
  steps: Array<{ toJSON: () => object }>;
}): object {
  return {
    steps: tr.steps.map((step) => step.toJSON()),
  };
}

function jsonToHighlightedHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"([^"\\]*(?:\\.[^"\\]*)*)":/g, '<span class="pm-flow-json-key">"$1"</span>:')
    .replace(/: "([^"\\]*(?:\\.[^"\\]*)*)"/g, ': <span class="pm-flow-json-string">"$1"</span>')
    .replace(/: (-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, ': <span class="pm-flow-json-number">$1</span>')
    .replace(/: (true|false)/g, ': <span class="pm-flow-json-bool">$1</span>')
    .replace(/: (null)/g, ': <span class="pm-flow-json-null">$1</span>');
}

function JsonHighlight({
  data,
  inline,
}: {
  data: string | object;
  inline?: boolean;
}) {
  const html = useMemo(() => {
    const str =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return jsonToHighlightedHtml(str);
  }, [data]);

  if (inline) {
    return (
      <span
        className='pm-flow-json-inline'
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <pre
      className='pm-flow-data-json pm-flow-data-json-highlight'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function formatHtmlForDiff(html: string): string {
  return html.replace(/></g, '>\n<').trim();
}

function DomDiffView({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const { leftLines, rightLines } = useMemo(() => {
    const beforeStr = formatHtmlForDiff(before);
    const afterStr = formatHtmlForDiff(after);
    const changes = Diff.diffLines(beforeStr, afterStr);

    const leftLines: { text: string; type: 'removed' | 'unchanged' | 'empty' }[] =
      [];
    const rightLines: { text: string; type: 'added' | 'unchanged' | 'empty' }[] =
      [];

    for (const change of changes) {
      const rawLines = change.value.split('\n');
      const lines =
        rawLines.length > 1 && rawLines[rawLines.length - 1] === ''
          ? rawLines.slice(0, -1)
          : rawLines;
      if (change.added) {
        for (const line of lines) {
          leftLines.push({ text: '', type: 'empty' });
          rightLines.push({ text: line, type: 'added' });
        }
      } else if (change.removed) {
        for (const line of lines) {
          leftLines.push({ text: line, type: 'removed' });
          rightLines.push({ text: '', type: 'empty' });
        }
      } else {
        for (const line of lines) {
          leftLines.push({ text: line, type: 'unchanged' });
          rightLines.push({ text: line, type: 'unchanged' });
        }
      }
    }

    return { leftLines, rightLines };
  }, [before, after]);

  return (
    <div className='pm-flow-diff-view'>
      <div className='pm-flow-diff-col pm-flow-diff-before'>
        <span className='pm-flow-diff-col-label'>Rendered before</span>
        <pre className='pm-flow-diff-pre pm-flow-dom-diff'>
          {leftLines.map((line, i) => (
            <div
              key={i}
              className={`pm-flow-diff-line pm-flow-diff-${line.type}`}
            >
              {line.text ? (
                <span
                  className='pm-flow-html-inline'
                  dangerouslySetInnerHTML={{
                    __html: line.text
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;'),
                  }}
                />
              ) : (
                '\u00A0'
              )}
            </div>
          ))}
        </pre>
      </div>
      <div className='pm-flow-diff-col pm-flow-diff-after'>
        <span className='pm-flow-diff-col-label'>Rendered after</span>
        <pre className='pm-flow-diff-pre pm-flow-dom-diff'>
          {rightLines.map((line, i) => (
            <div
              key={i}
              className={`pm-flow-diff-line pm-flow-diff-${line.type}`}
            >
              {line.text ? (
                <span
                  className='pm-flow-html-inline'
                  dangerouslySetInnerHTML={{
                    __html: line.text
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;'),
                  }}
                />
              ) : (
                '\u00A0'
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function DocDiffView({
  before,
  after,
}: {
  before: object;
  after: object;
}) {
  const { leftLines, rightLines } = useMemo(() => {
    const beforeStr = JSON.stringify(before, null, 2);
    const afterStr = JSON.stringify(after, null, 2);
    const changes = Diff.diffLines(beforeStr, afterStr);

    const leftLines: { text: string; type: 'removed' | 'unchanged' | 'empty' }[] =
      [];
    const rightLines: { text: string; type: 'added' | 'unchanged' | 'empty' }[] =
      [];

    for (const change of changes) {
      const rawLines = change.value.split('\n');
      const lines =
        rawLines.length > 1 && rawLines[rawLines.length - 1] === ''
          ? rawLines.slice(0, -1)
          : rawLines;
      if (change.added) {
        for (const line of lines) {
          leftLines.push({ text: '', type: 'empty' });
          rightLines.push({ text: line, type: 'added' });
        }
      } else if (change.removed) {
        for (const line of lines) {
          leftLines.push({ text: line, type: 'removed' });
          rightLines.push({ text: '', type: 'empty' });
        }
      } else {
        for (const line of lines) {
          leftLines.push({ text: line, type: 'unchanged' });
          rightLines.push({ text: line, type: 'unchanged' });
        }
      }
    }

    return { leftLines, rightLines };
  }, [before, after]);

  return (
    <div className='pm-flow-diff-view'>
      <div className='pm-flow-diff-col pm-flow-diff-before'>
        <span className='pm-flow-diff-col-label'>Before</span>
        <pre className='pm-flow-diff-pre'>
          {leftLines.map((line, i) => (
            <div
              key={i}
              className={`pm-flow-diff-line pm-flow-diff-${line.type}`}
            >
              {line.text ? (
                <JsonHighlight data={line.text} inline />
              ) : (
                '\u00A0'
              )}
            </div>
          ))}
        </pre>
      </div>
      <div className='pm-flow-diff-col pm-flow-diff-after'>
        <span className='pm-flow-diff-col-label'>After</span>
        <pre className='pm-flow-diff-pre'>
          {rightLines.map((line, i) => (
            <div
              key={i}
              className={`pm-flow-diff-line pm-flow-diff-${line.type}`}
            >
              {line.text ? (
                <JsonHighlight data={line.text} inline />
              ) : (
                '\u00A0'
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

/** Isolated editor mount - never re-renders so React won't clear ProseMirror's DOM */
const EditorMount = React.memo(function EditorMount({
  onReady,
}: {
  onReady: (container: HTMLDivElement) => (() => void) | void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanup = onReady(el);
    return () => cleanup?.();
  }, [onReady]);
  return (
    <div
      ref={ref}
      className='pm-flow-editor pm-flow-editor-prosemirror'
      style={{ minHeight: 80 }}
    />
  );
});

export default function ProseMirrorFlowDiagram() {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [doc, setDoc] = useState<object>(() => ({
    type: 'doc',
    content: [{ type: 'paragraph' }],
  }));
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const txIdCounter = useRef(0);
  const selectedTx = useMemo(() => {
    if (transactions.length === 0) return null;
    const idx = selectedTxId !== null
      ? transactions.findIndex((t) => t.id === selectedTxId)
      : -1;
    return idx >= 0 ? transactions[idx] : transactions[transactions.length - 1];
  }, [transactions, selectedTxId]);

  const lastDomEventRef = useRef<string | null>(null);
  const latestEntryRef = useRef<{ id: number; afterDoc: object } | null>(null);
  const pendingTxRef = useRef<TransactionEntry[]>([]);

  const runFlowRef = useRef<
    (
      tr: object,
      beforeDoc: object,
      afterDoc: object,
      beforeRendered: string,
      afterRendered: string,
    ) => void
  >(() => {});

  const flushPendingTransactions = useCallback(() => {
    const pending = pendingTxRef.current;
    if (pending.length === 0) return;
    pendingTxRef.current = [];
    const latest = latestEntryRef.current;
    startTransition(() => {
      setTransactions((prev) =>
        [...prev, ...pending].slice(-MAX_TRANSACTIONS),
      );
      if (latest) {
        setSelectedTxId(latest.id);
        setDoc(latest.afterDoc);
        setActiveStep(0);
        setIsPaused(false);
      }
    });
  }, []);

  const recordAndScheduleFlow = useCallback(
    (
      tr: object,
      beforeDoc: object,
      afterDoc: object,
      beforeRendered: string,
      afterRendered: string,
    ) => {
      const id = ++txIdCounter.current;
      const entry: TransactionEntry = {
        id,
        tr,
        beforeDoc,
        afterDoc,
        beforeRendered,
        afterRendered,
        lastDomEvent: lastDomEventRef.current,
      };
      pendingTxRef.current.push(entry);
      latestEntryRef.current = { id, afterDoc };
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        flushPendingTransactions();
      }, DEBOUNCE_MS);
    },
    [flushPendingTransactions],
  );

  const onEditorReady = useCallback((container: HTMLDivElement) => {
    editorContainerRef.current = container;
    const state = EditorState.create({
      schema,
      plugins: [history(), keymap(baseKeymap)],
    });
    const view = new EditorView(container, {
      state,
      handleDOMEvents: {
        keydown(_view, event) {
          lastDomEventRef.current = `keydown: key="${event.key}"`;
        },
        input(_view, event) {
          const inputType =
            event instanceof InputEvent ? event.inputType : 'unknown';
          lastDomEventRef.current = `input: inputType="${inputType}"`;
        },
        paste() {
          lastDomEventRef.current = `paste`;
        },
        cut() {
          lastDomEventRef.current = `cut`;
        },
      },
      dispatchTransaction(tr) {
        const beforeDoc = view.state.doc.toJSON();
        const newState = view.state.apply(tr);
        let beforeRendered = '';
        let afterRendered = '';
        try {
          const serializer = DOMSerializer.fromSchema(view.state.schema);
          const beforeWrapper = document.createElement('div');
          serializer.serializeFragment(view.state.doc.content, {}, beforeWrapper);
          beforeRendered = beforeWrapper.innerHTML;
        } catch {
          beforeRendered = JSON.stringify(beforeDoc, null, 2);
        }
        view.updateState(newState);
        afterRendered = view.dom.innerHTML;
        const afterDoc = newState.doc.toJSON();

        if (tr.steps.length > 0) {
          runFlowRef.current(
            transactionToJSON(tr),
            beforeDoc,
            afterDoc,
            beforeRendered,
            afterRendered,
          );
        } else {
          setDoc(afterDoc);
        }
      },
    });
    viewRef.current = view;
    startTransition(() => setDoc(state.doc.toJSON()));

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      view.destroy();
      viewRef.current = null;
      editorContainerRef.current = null;
    };
  }, [setDoc]);

  useEffect(() => {
    runFlowRef.current = recordAndScheduleFlow;
  }, [recordAndScheduleFlow]);

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
      duration,
    );
    return () => clearTimeout(id);
  }, [activeStep, isPaused]);

  const handleStepHover = useCallback((index: number) => {
    setActiveStep(index);
    setIsPaused(true);
  }, []);

  const handleFlowEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleFlowLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  const dataPanelContent = selectedTx
    ? activeStep === 0 && selectedTx.lastDomEvent ? (
        <>
          <span className='pm-flow-data-label'>DOM event</span>
          <pre className='pm-flow-data-json pm-flow-json-event'>
            {selectedTx.lastDomEvent}
          </pre>
        </>
      ) : activeStep === 1 ? (
        <>
          <span className='pm-flow-data-label'>Transaction</span>
          <JsonHighlight data={selectedTx.tr} />
        </>
      ) : activeStep === 2 ? (
        <DocDiffView before={selectedTx.beforeDoc} after={selectedTx.afterDoc} />
      ) : activeStep === 3 && selectedTx.beforeRendered && selectedTx.afterRendered ? (
        <DomDiffView
          before={selectedTx.beforeRendered}
          after={selectedTx.afterRendered}
        />
      ) : activeStep === 3 ? (
        <>
          <span className='pm-flow-data-label'>Result</span>
          <JsonHighlight data={selectedTx.afterDoc} />
        </>
      ) : (
        <p className='pm-flow-data-placeholder'>
          Hover steps to inspect data.
        </p>
      )
    : (
      <p className='pm-flow-data-placeholder'>
        Type in the editor to see the flow. Hover steps to inspect data.
      </p>
    );

  return (
    <div className='pm-flow-diagram pm-flow-diagram-compact'>
      <div className='pm-flow-header'>
        <h3 className='pm-flow-title'>How ProseMirror works</h3>
        <p className='pm-flow-subtitle'>
          Type and watch the flow. Data updates live from the real ProseMirror
          instance.
        </p>
      </div>

      <div className='pm-flow-grid'>
        <div
          className='pm-flow-main-col'
          onMouseEnter={handleFlowEnter}
          onMouseLeave={handleFlowLeave}
        >
          <div className='pm-flow-editor-panel'>
            <div className='pm-flow-editor-header'>
              <span className='pm-flow-editor-label'>EditorView</span>
            </div>
            <EditorMount onReady={onEditorReady} />
          </div>

          <div className='pm-flow-horizontal'>
            <div className='pm-flow-steps-horizontal'>
              {STEPS.map((step, i) => (
                <React.Fragment key={step.id}>
                  <button
                    type='button'
                    className={`pm-flow-step-pill pm-flow-step-${step.color} ${activeStep === i ? 'active' : ''} ${activeStep !== null && activeStep > i ? 'completed' : ''} ${isPaused ? 'paused' : ''}`}
                    onMouseEnter={() => handleStepHover(i)}
                    onClick={() => handleStepHover(i)}
                    title={`${step.label}: ${step.desc}`}
                  >
                    <span className='pm-flow-step-num'>{i + 1}</span>
                    <span className='pm-flow-step-name'>{step.label}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`pm-flow-arrow ${activeStep === i ? 'active' : ''}`}
                    >
                      →
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className='pm-flow-data-panel'>
          <div className='pm-flow-data-header'>
            <span>
              {activeStep !== null && STEPS[activeStep]
                ? STEPS[activeStep].label
                : 'Data'}
            </span>
            {transactions.length > 0 && (
              <span className='pm-flow-data-badge'>
                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {transactions.length > 0 && (
            <div className='pm-flow-tx-list'>
              <div className='pm-flow-tx-row'>
                <div className='pm-flow-tx-scroll'>
                {transactions.map((tx, i) => (
                  <button
                    key={tx.id}
                    type='button'
                    className={`pm-flow-tx-item ${selectedTxId === tx.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedTxId(tx.id);
                      setActiveStep(0);
                      setIsPaused(false);
                    }}
                    title={`Replay transaction ${i + 1}`}
                  >
                    #{i + 1}
                  </button>
                ))}
              </div>
              <button
                type='button'
                className='pm-flow-tx-clear'
                onClick={() => {
                  setTransactions([]);
                  setSelectedTxId(null);
                  setActiveStep(null);
                }}
                title='Clear transaction history'
              >
                Clear
              </button>
            </div>
            </div>
          )}
          <div className='pm-flow-data-body'>{dataPanelContent}</div>
        </div>
      </div>

      <details className='pm-flow-plugins-note'>
        <summary>Plugin pipeline</summary>
        <p>
          Before <code>state.apply(tr)</code>, plugins run{' '}
          <code>filterTransaction</code> (can reject) and{' '}
          <code>appendTransaction</code> (can add steps). History stores inverse
          steps for undo.
        </p>
      </details>
    </div>
  );
}
