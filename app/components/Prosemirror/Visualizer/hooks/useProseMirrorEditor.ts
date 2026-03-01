'use client';

import { useCallback, useRef } from 'react';
import { EditorState, Plugin, type Transaction } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import { DOMSerializer } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { transactionToJSON } from '../utils';
import type { TransactionRecord, TransactionType, SelectionInfo, StepInfo, ResolvedPosInfo } from '../types';

const PLACEHOLDER_TEXT = 'Start typing to see the transaction stream flow in real-time...';

function placeholderPlugin(text: string) {
  return new Plugin({
    props: {
      decorations(state) {
        const { $from } = state.selection;
        const parent = $from.parent;
        if (parent.isTextblock && parent.content.size === 0 && parent.type.name === 'paragraph') {
          return DecorationSet.create(state.doc, [
            Decoration.node($from.before(), $from.after(), { 'data-placeholder': text }),
          ]);
        }
        return DecorationSet.empty;
      },
    },
  });
}

function getSelectionInfo(state: EditorState): SelectionInfo {
  const sel = state.selection;
  let text = '';
  if (!sel.empty) {
    text = state.doc.textBetween(sel.from, sel.to, ' ').slice(0, 40);
  }
  return {
    type: sel.empty ? 'Cursor' : 'Range',
    anchor: sel.anchor,
    head: sel.head,
    from: sel.from,
    to: sel.to,
    empty: sel.empty,
    text,
  };
}

function getResolvedPosInfo(state: EditorState): ResolvedPosInfo {
  const $pos = state.selection.$anchor;
  return {
    pos: $pos.pos,
    depth: $pos.depth,
    parentNode: $pos.parent.type.name,
    parentOffset: $pos.parentOffset,
    textOffset: $pos.textOffset,
    nodeBefore: $pos.nodeBefore?.type.name ?? null,
    nodeAfter: $pos.nodeAfter?.type.name ?? null,
  };
}

function getActiveMarks(state: EditorState): string[] {
  const marks = state.storedMarks || state.selection.$from.marks();
  return marks.map((m) => m.type.name);
}

function classifyTransaction(tr: Transaction): TransactionType {
  if (tr.getMeta('history$')) return 'history';
  if (tr.docChanged) {
    const marks = tr.steps.some(
      (s) => s.toJSON().stepType === 'addMark' || s.toJSON().stepType === 'removeMark'
    );
    return marks ? 'mark' : 'doc';
  }
  if (tr.selectionSet) return 'selection';
  return 'meta';
}

function buildStepInfos(tr: Transaction, charDelta: number): StepInfo[] {
  if (tr.getMeta('history$')) {
    return [{ type: 'hist', action: tr.getMeta('history$')?.redo ? 'redo' : 'undo' }];
  }
  if (!tr.docChanged && tr.selectionSet) {
    return [{ type: 'selection' }];
  }
  const infos: StepInfo[] = [];
  for (const step of tr.steps) {
    const json = step.toJSON();
    if (json.stepType === 'addMark' || json.stepType === 'removeMark') {
      infos.push({ type: 'mark', cmd: json.mark?.type || 'mark', json });
    } else {
      if (charDelta > 0) {
        infos.push({ type: 'insert', delta: charDelta, json });
      } else if (charDelta < 0) {
        infos.push({ type: 'delete', delta: charDelta, json });
      } else {
        infos.push({ type: 'replace', delta: 0, json });
      }
    }
  }
  return infos.length ? infos : [{ type: 'meta' }];
}

export type OnTransactionCallback = (record: TransactionRecord) => void;

export function useProseMirrorEditor(onTransaction: OnTransactionCallback) {
  const viewRef = useRef<EditorView | null>(null);
  const txIdRef = useRef(0);
  const lastDomEventRef = useRef<string | null>(null);
  const onTransactionRef = useRef(onTransaction);
  onTransactionRef.current = onTransaction;

  const execCommand = useCallback((cmd: 'bold' | 'italic' | 'undo' | 'redo') => {
    const view = viewRef.current;
    if (!view) return;
    switch (cmd) {
      case 'bold':
        toggleMark(schema.marks.strong)(view.state, view.dispatch);
        break;
      case 'italic':
        toggleMark(schema.marks.em)(view.state, view.dispatch);
        break;
      case 'undo':
        undo(view.state, view.dispatch);
        break;
      case 'redo':
        redo(view.state, view.dispatch);
        break;
    }
    view.focus();
  }, []);

  const getStats = useCallback(() => {
    const view = viewRef.current;
    if (!view) return null;
    const state = view.state;
    const doc = state.doc;
    let nodeCount = 0;
    doc.descendants(() => { nodeCount++; return true; });
    return {
      charCount: doc.textContent.length,
      nodeCount,
      version: txIdRef.current,
      hasMarks:
        doc.textContent.length > 0 &&
        (() => {
          let found = false;
          doc.descendants((node) => {
            if (node.marks.length > 0) found = true;
            return !found;
          });
          return found;
        })(),
      activeMarks: getActiveMarks(state),
      selection: getSelectionInfo(state),
      resolvedPos: getResolvedPosInfo(state),
    };
  }, []);

  const onEditorReady = useCallback(
    (container: HTMLDivElement) => {
      const state = EditorState.create({
        schema,
        plugins: [
          placeholderPlugin(PLACEHOLDER_TEXT),
          history(),
          keymap({ 'Mod-z': undo, 'Mod-y': redo, 'Mod-Shift-z': redo }),
          keymap({
            'Mod-b': toggleMark(schema.marks.strong),
            'Mod-i': toggleMark(schema.marks.em),
          }),
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
            const inputType = event instanceof InputEvent ? event.inputType : 'unknown';
            lastDomEventRef.current = `input: inputType="${inputType}"`;
          },
          paste() { lastDomEventRef.current = 'paste'; },
          cut() { lastDomEventRef.current = 'cut'; },
        },
        dispatchTransaction(tr) {
          const prevState = view.state;
          const charsBefore = prevState.doc.textContent.length;
          const selBefore = getSelectionInfo(prevState);
          const marksBefore = getActiveMarks(prevState);
          const beforeDoc = prevState.doc.toJSON();
          let nodesBefore = 0;
          prevState.doc.descendants(() => { nodesBefore++; return true; });

          let beforeRendered = '';
          try {
            const serializer = DOMSerializer.fromSchema(prevState.schema);
            const wrapper = document.createElement('div');
            serializer.serializeFragment(prevState.doc.content, {}, wrapper);
            beforeRendered = wrapper.innerHTML;
          } catch {
            beforeRendered = '';
          }

          const newState = prevState.apply(tr);
          view.updateState(newState);

          const charsAfter = newState.doc.textContent.length;
          const selAfter = getSelectionInfo(newState);
          const marksAfter = getActiveMarks(newState);
          const afterDoc = newState.doc.toJSON();
          const afterRendered = view.dom.innerHTML;
          let nodesAfter = 0;
          newState.doc.descendants(() => { nodesAfter++; return true; });

          const charDelta = charsAfter - charsBefore;
          const type = classifyTransaction(tr);
          const id = ++txIdRef.current;

          const record: TransactionRecord = {
            id,
            type,
            time: new Date().toLocaleTimeString('en', { hour12: false }),
            source: lastDomEventRef.current || 'programmatic',
            steps: buildStepInfos(tr, charDelta),
            charsBefore,
            charsAfter,
            nodesBefore,
            nodesAfter,
            selBefore,
            selAfter,
            marksBefore,
            marksAfter,
            tr: transactionToJSON(tr),
            beforeDoc,
            afterDoc,
            beforeRendered,
            afterRendered,
            lastDomEvent: lastDomEventRef.current,
            resolvedPos: getResolvedPosInfo(newState),
          };

          onTransactionRef.current(record);
        },
      });

      viewRef.current = view;
      return () => {
        view.destroy();
        viewRef.current = null;
      };
    },
    []
  );

  return { onEditorReady, execCommand, getStats };
}
