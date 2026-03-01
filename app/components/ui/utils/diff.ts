import * as Diff from 'diff';

export type DiffLineLeft = {
  text: string;
  type: 'removed' | 'unchanged' | 'empty';
};

export type DiffLineRight = {
  text: string;
  type: 'added' | 'unchanged' | 'empty';
};

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

export function formatHtmlForDiff(html: string): string {
  return html.replace(/></g, '>\n<').trim();
}
