'use client';

import { useCallback, useRef } from 'react';
import { startTransition } from 'react';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { DOMSerializer } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import {
  transactionToJSON,
  classifyTr,
  extractStepChips,
  getSelSnapshot,
  getLiveStateSnapshot,
} from '../utils';
import type { TransactionEntry, LiveState } from '../types';
import { DEBOUNCE_MS } from '../constants';

const PLACEHOLDER_TEXT = 'Type here to see the flow…';

function placeholderPlugin(text: string) {
  return new Plugin({
    props: {
      decorations(state) {
        const { $from } = state.selection;
        const parent = $from.parent;
        if (
          parent.isTextblock &&
          parent.content.size === 0 &&
          parent.type.name === 'paragraph'
        ) {
          return DecorationSet.create(state.doc, [
            Decoration.node($from.before(), $from.after(), {
              'data-placeholder': text,
            }),
          ]);
        }
        return DecorationSet.empty;
      },
    },
  });
}

type FlushCallback = (
  entries: TransactionEntry[],
  latest: { id: number; afterDoc: object } | null
) => void;

type LiveStateCallback = (state: LiveState) => void;

export function useProseMirrorEditor(
  setDoc: (doc: object) => void,
  onFlush: FlushCallback,
  onLiveState: LiveStateCallback
) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDomEventRef = useRef<string | null>(null);
  const latestEntryRef = useRef<{ id: number; afterDoc: object } | null>(null);
  const pendingTxRef = useRef<TransactionEntry[]>([]);
  const txIdCounter = useRef(0);
  const onFlushRef = useRef(onFlush);
  onFlushRef.current = onFlush;
  const onLiveStateRef = useRef(onLiveState);
  onLiveStateRef.current = onLiveState;

  // History stat counters (persisted across renders via ref)
  const statsRef = useRef({ totalTx: 0, docChanges: 0, selChanges: 0, markChanges: 0, historyOps: 0 });

  const flushPending = useCallback(() => {
    const pending = pendingTxRef.current;
    if (pending.length === 0) return;
    pendingTxRef.current = [];
    const latest = latestEntryRef.current;
    onFlushRef.current(pending, latest);
  }, []);

  const recordAndScheduleFlow = useCallback(
    (entry: TransactionEntry) => {
      pendingTxRef.current.push(entry);
      latestEntryRef.current = { id: entry.id, afterDoc: entry.afterDoc };
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        flushPending();
      }, DEBOUNCE_MS);
    },
    [flushPending]
  );

  const onEditorReady = useCallback(
    (container: HTMLDivElement) => {
      const state = EditorState.create({
        schema,
        plugins: [
          placeholderPlugin(PLACEHOLDER_TEXT),
          history(),
          keymap(baseKeymap),
        ],
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
          const prevState = view.state;
          const charsBefore = prevState.doc.textContent.length;
          const selBeforeFrom = prevState.selection.from;
          const selBeforeTo = prevState.selection.to;

          const beforeDoc = prevState.doc.toJSON();
          const newState = prevState.apply(tr);

          // Capture beforeRendered HTML
          let beforeRendered = '';
          try {
            const serializer = DOMSerializer.fromSchema(prevState.schema);
            const beforeWrapper = document.createElement('div');
            serializer.serializeFragment(prevState.doc.content, {}, beforeWrapper);
            beforeRendered = beforeWrapper.innerHTML;
          } catch {
            beforeRendered = JSON.stringify(beforeDoc, null, 2);
          }

          view.updateState(newState);
          const afterRendered = view.dom.innerHTML;
          const afterDoc = newState.doc.toJSON();
          const charsAfter = newState.doc.textContent.length;

          // Classify and build entry
          const txType = classifyTr(tr as Parameters<typeof classifyTr>[0]);
          const stepChips = extractStepChips(
            tr.steps as Parameters<typeof extractStepChips>[0],
            charsBefore,
            charsAfter
          );
          const selBefore = getSelSnapshot(
            selBeforeFrom,
            selBeforeTo,
            (f, t) => prevState.doc.textBetween(f, t)
          );
          const selAfter = getSelSnapshot(
            newState.selection.from,
            newState.selection.to,
            (f, t) => newState.doc.textBetween(f, t)
          );

          // Update stats
          const s = statsRef.current;
          s.totalTx++;
          if (txType === 'doc') s.docChanges++;
          else if (txType === 'selection') s.selChanges++;
          else if (txType === 'mark') s.markChanges++;
          else if (txType === 'history') s.historyOps++;

          // Build live state snapshot
          const storedMarkNames = newState.storedMarks?.map((m) => m.type.name) ?? [];
          const liveState = getLiveStateSnapshot(
            charsAfter,
            newState.doc.childCount,
            s.totalTx,
            newState.selection.from,
            newState.selection.to,
            selAfter.text,
            storedMarkNames,
            { ...s }
          );
          startTransition(() => onLiveStateRef.current(liveState));

          // Only record + animate for non-trivial transactions
          if (tr.steps.length > 0) {
            const id = ++txIdCounter.current;
            const entry: TransactionEntry = {
              id,
              tr: transactionToJSON(tr as Parameters<typeof transactionToJSON>[0]),
              txType,
              timestamp: new Date().toLocaleTimeString('en', { hour12: false }),
              charsBefore,
              charsAfter,
              selBefore,
              selAfter,
              stepChips,
              beforeDoc,
              afterDoc,
              beforeRendered,
              afterRendered,
              lastDomEvent: lastDomEventRef.current,
            };
            recordAndScheduleFlow(entry);
          } else {
            setDoc(afterDoc);
          }
        },
      });

      startTransition(() => setDoc(state.doc.toJSON()));

      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        view.destroy();
      };
    },
    [recordAndScheduleFlow, setDoc]
  );

  return { onEditorReady };
}
