import * as Diff from 'diff';

export function transactionToJSON(tr: {
  steps: Array<{ toJSON: () => object }>;
}): object {
  return {
    steps: tr.steps.map((step) => step.toJSON()),
  };
}

export function jsonToHighlightedHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
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

export function countNodes(doc: { content?: Array<object> }): number {
  let count = 1;
  if (doc.content) {
    for (const child of doc.content) {
      count += countNodes(child as { content?: Array<object> });
    }
  }
  return count;
}
