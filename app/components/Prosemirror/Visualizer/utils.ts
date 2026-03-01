import * as Diff from 'diff';
import type { TransactionRecord, EditorStats, SelectionInfo, StepInfo, StepType } from './types';
import { EMPTY_SELECTION } from './types';

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function transactionToJSON(tr: {
  steps: Array<{ toJSON: () => Record<string, unknown> }>;
}): Record<string, unknown> {
  return { steps: tr.steps.map((step) => step.toJSON()) };
}

export function jsonToHighlightedHtml(str: string): string {
  return escapeHtml(str)
    .replace(/"([^"\\]*(?:\\.[^"\\]*)*)":/g, '<span class="viz-json-key">"$1"</span>:')
    .replace(/: "([^"\\]*(?:\\.[^"\\]*)*)"/g, ': <span class="viz-json-string">"$1"</span>')
    .replace(/: (-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, ': <span class="viz-json-number">$1</span>')
    .replace(/: (true|false)/g, ': <span class="viz-json-bool">$1</span>')
    .replace(/: (null)/g, ': <span class="viz-json-null">$1</span>');
}

export function formatHtmlForDiff(html: string): string {
  return html.replace(/></g, '>\n<').trim();
}

export type DiffLineLeft = { text: string; type: 'removed' | 'unchanged' | 'empty' };
export type DiffLineRight = { text: string; type: 'added' | 'unchanged' | 'empty' };

export function computeLineDiff(
  beforeStr: string,
  afterStr: string,
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

export function statsFromTx(tx: TransactionRecord): EditorStats {
  return {
    charCount: tx.charsAfter,
    nodeCount: tx.nodesAfter,
    version: tx.id,
    activeMarks: tx.marksAfter,
    selection: tx.selAfter ?? EMPTY_SELECTION,
    resolvedPos: tx.resolvedPos,
  };
}

export type TxDescription = {
  icon: string;
  action: string;
  detail: string;
  color: string;
};

export function describeTransaction(tx: TransactionRecord): TxDescription {
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
        return { icon: '⌨', action: `Typed "${key}"`, detail: `${tx.charsAfter} chars · ${tx.nodesAfter} nodes · +${delta}`, color: 'blue' };
      }
      if (tx.lastDomEvent?.includes('paste')) {
        return { icon: '📋', action: `Pasted ${delta} char${delta !== 1 ? 's' : ''}`, detail: `${tx.charsAfter} chars · ${tx.nodesAfter} nodes`, color: 'blue' };
      }
      return { icon: '＋', action: `Inserted ${delta} char${delta !== 1 ? 's' : ''}`, detail: `${tx.charsAfter} chars · ${tx.nodesAfter} nodes`, color: 'blue' };
    }
    if (delta < 0) {
      return { icon: '⌫', action: `Deleted ${Math.abs(delta)} char${Math.abs(delta) !== 1 ? 's' : ''}`, detail: `${tx.charsAfter} chars · ${tx.nodesAfter} nodes`, color: 'blue' };
    }
    return { icon: '↔', action: 'Replaced content', detail: `Same length · ${tx.charsAfter} chars · ${tx.nodesAfter} nodes`, color: 'blue' };
  }

  if (tx.type === 'selection') {
    const sel = tx.selAfter;
    if (sel && !sel.empty) {
      return { icon: '▋', action: `Selected ${sel.to - sel.from} chars`, detail: `Range ${sel.from}→${sel.to} via ${tx.source}`, color: 'purple' };
    }
    return { icon: '│', action: `Cursor → ${sel?.anchor ?? 0}`, detail: `Moved via ${tx.source}`, color: 'purple' };
  }

  return { icon: '◆', action: 'Meta transaction', detail: `From ${tx.source}`, color: 'blue' };
}

const CHIP_COLOR: Record<StepType, string> = {
  insert: 'viz-chip-insert',
  delete: 'viz-chip-delete',
  mark: 'viz-chip-mark',
  hist: 'viz-chip-hist',
  selection: 'viz-chip-sel',
  replace: 'viz-chip-sel',
  meta: 'viz-chip-sel',
};

export function formatStepLabel(s: StepInfo): string {
  let label = s.type.toUpperCase();
  if (s.delta !== undefined && s.delta !== 0)
    label += ` ${s.delta > 0 ? '+' : ''}${s.delta}`;
  if (s.cmd) label += ` ${s.cmd}`;
  if (s.action) label += ` ${s.action}`;
  return label;
}

export function stepChipClass(type: StepType): string {
  return CHIP_COLOR[type] ?? 'viz-chip-sel';
}
