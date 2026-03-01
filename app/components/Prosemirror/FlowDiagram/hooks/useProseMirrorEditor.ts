'use client';

import { useCallback, useRef } from 'react';
import { startTransition } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMSerializer } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { transactionToJSON } from '../utils';
import type { TransactionEntry } from '../types';
import { DEBOUNCE_MS } from '../constants';

type FlushCallback = (
  entries: TransactionEntry[],
  latest: { id: number; afterDoc: object } | null
) => void;

export function useProseMirrorEditor(
  setDoc: (doc: object) => void,
  onFlush: FlushCallback
) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDomEventRef = useRef<string | null>(null);
  const latestEntryRef = useRef<{ id: number; afterDoc: object } | null>(null);
  const pendingTxRef = useRef<TransactionEntry[]>([]);
  const txIdCounter = useRef(0);
  const onFlushRef = useRef(onFlush);
  onFlushRef.current = onFlush;

  const flushPending = useCallback(() => {
    const pending = pendingTxRef.current;
    if (pending.length === 0) return;
    pendingTxRef.current = [];
    const latest = latestEntryRef.current;
    onFlushRef.current(pending, latest);
  }, []);

  const recordAndScheduleFlow = useCallback(
    (
      tr: object,
      beforeDoc: object,
      afterDoc: object,
      beforeRendered: string,
      afterRendered: string
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
        flushPending();
      }, DEBOUNCE_MS);
    },
    [flushPending]
  );

  const onEditorReady = useCallback(
    (container: HTMLDivElement) => {
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
          try {
            const serializer = DOMSerializer.fromSchema(view.state.schema);
            const beforeWrapper = document.createElement('div');
            serializer.serializeFragment(view.state.doc.content, {}, beforeWrapper);
            beforeRendered = beforeWrapper.innerHTML;
          } catch {
            beforeRendered = JSON.stringify(beforeDoc, null, 2);
          }
          view.updateState(newState);
          const afterRendered = view.dom.innerHTML;
          const afterDoc = newState.doc.toJSON();

          if (tr.steps.length > 0) {
            recordAndScheduleFlow(
              transactionToJSON(tr),
              beforeDoc,
              afterDoc,
              beforeRendered,
              afterRendered
            );
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
