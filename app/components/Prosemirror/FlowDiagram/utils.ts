import * as Diff from 'diff';
import type { TxType, StepChip, SelectionSnapshot, LiveState } from './types';

export function transactionToJSON(tr: {
  steps: Array<{ toJSON: () => object }>;
}): object {
  return {
    steps: tr.steps.map((step) => step.toJSON()),
  };
}

type RawStep = { stepType?: string; mark?: { type?: string } };

export function classifyTr(tr: {
  steps: Array<{ toJSON: () => RawStep }>;
  getMeta: (key: string) => unknown;
}): TxType {
  try {
    if (tr.getMeta('history$')) return 'history';
  } catch { /* ignore */ }
  if (tr.steps.length === 0) return 'selection';
  const hasMarkStep = tr.steps.some((s) => {
    const j = s.toJSON();
    return j.stepType === 'addMark' || j.stepType === 'removeMark';
  });
  if (hasMarkStep) return 'mark';
  return 'doc';
}

export function extractStepChips(
  steps: Array<{ toJSON: () => RawStep }>,
  charsBefore: number,
  charsAfter: number
): StepChip[] {
  if (steps.length === 0) return [{ kind: 'sel', label: 'SEL' }];

  const chips: StepChip[] = [];
  const delta = charsAfter - charsBefore;

  for (const step of steps) {
    const j = step.toJSON();
    if (j.stepType === 'replace' || j.stepType === 'replaceAround') {
      if (delta > 0) chips.push({ kind: 'insert', label: `INSERT +${delta}` });
      else if (delta < 0) chips.push({ kind: 'delete', label: `DELETE ${delta}` });
      else chips.push({ kind: 'replace', label: 'REPLACE' });
    } else if (j.stepType === 'addMark') {
      chips.push({ kind: 'mark', label: `+${j.mark?.type ?? 'MARK'}`.toUpperCase() });
    } else if (j.stepType === 'removeMark') {
      chips.push({ kind: 'mark', label: `-${j.mark?.type ?? 'MARK'}`.toUpperCase() });
    } else {
      chips.push({ kind: 'replace', label: (j.stepType ?? 'STEP').toUpperCase() });
    }
  }
  return chips;
}

export function getSelSnapshot(
  from: number,
  to: number,
  textBetween: (f: number, t: number) => string
): SelectionSnapshot {
  const text = from === to ? '' : textBetween(from, to).slice(0, 60);
  return { selType: from === to ? 'Caret' : 'Range', from, to, text };
}

export function getLiveStateSnapshot(
  docTextLength: number,
  docChildCount: number,
  version: number,
  selFrom: number,
  selTo: number,
  selText: string,
  storedMarkNames: string[],
  counts: {
    totalTx: number;
    docChanges: number;
    selChanges: number;
    markChanges: number;
    historyOps: number;
  }
): LiveState {
  return {
    charCount: docTextLength,
    nodeCount: docChildCount,
    version,
    hasMarks: storedMarkNames.length > 0,
    selType: selFrom === selTo ? 'Caret' : 'Range',
    selCollapsed: selFrom === selTo,
    selFrom,
    selTo,
    selText,
    activeMarks: storedMarkNames,
    ...counts,
  };
}

export function jsonToHighlightedHtml(str: string): string {
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

export function formatHtmlForDiff(html: string): string {
  return html.replace(/></g, '>\n<').trim();
}

export type DiffLineLeft = { text: string; type: 'removed' | 'unchanged' | 'empty' };
export type DiffLineRight = { text: string; type: 'added' | 'unchanged' | 'empty' };

export function computeLineDiff(
  beforeStr: string,
  afterStr: string
): { leftLines: DiffLineLeft[]; rightLines: DiffLineRight[] } {
  const changes = Diff.diffLines(beforeStr, afterStr);
  const leftLines: DiffLineLeft[] = [];
  const rightLines: DiffLineRight[] = [];

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
}
