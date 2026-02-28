/**
 * ProseMirror-style position from DOM (node, offset).
 * Rules: +1 when entering/leaving block nodes, +1 per character, +1 for leaf nodes.
 * Matches https://prosemirror.net/docs/guide/#doc
 */
export function getProseMirrorPosition(
  container: Node,
  targetNode: Node,
  targetOffset: number
): number {
  let pos = 0;
  const BLOCK = new Set(['P', 'DIV', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'UL', 'OL', 'PRE']);
  const LEAF = new Set(['IMG', 'BR', 'HR', 'INPUT']);

  function isBlock(node: Node): boolean {
    return node.nodeType === Node.ELEMENT_NODE && BLOCK.has((node as Element).tagName);
  }

  function isLeaf(node: Node): boolean {
    return node.nodeType === Node.ELEMENT_NODE && LEAF.has((node as Element).tagName);
  }

  function walk(node: Node): boolean {
    if (node === targetNode) {
      if (node.nodeType === Node.TEXT_NODE) {
        pos += targetOffset;
        return true;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        if (isLeaf(el)) {
          if (targetOffset === 0) return true;
          pos += 1;
          return true;
        }
        if (isBlock(el)) {
          if (targetOffset === 0) {
            pos += 1; // enter = position before first child
            return true;
          }
          pos += 1; // enter
          for (let i = 0; i < targetOffset; i++) {
            if (walk(el.childNodes[i])) return true;
          }
          if (targetOffset === el.childNodes.length) {
            pos += 1; // leave = position after last child
          }
          return true;
        }
        for (let i = 0; i < targetOffset; i++) {
          if (walk(el.childNodes[i])) return true;
        }
        return true;
      }
      return true;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      pos += (node.textContent || '').length;
      return false;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (isLeaf(el)) {
        pos += 1;
        return false;
      }
      if (isBlock(el)) {
        pos += 1; // enter
        for (let i = 0; i < el.childNodes.length; i++) {
          if (walk(el.childNodes[i])) return true;
        }
        pos += 1; // leave
      } else {
        for (let i = 0; i < el.childNodes.length; i++) {
          if (walk(el.childNodes[i])) return true;
        }
      }
    }
    return false;
  }

  if (targetNode === container) {
    if (targetOffset === 0) return 0;
    for (let i = 0; i < targetOffset; i++) {
      walk(container.childNodes[i]);
    }
    return pos;
  }

  for (let i = 0; i < container.childNodes.length; i++) {
    if (walk(container.childNodes[i])) break;
  }
  return pos;
}

export const POSITION_TOOLTIPS: Record<number, string> = {
  0: 'Position 0: Start of document, right before the first content',
  1: "Position 1: After <p>, before 'O' in 'One'",
  2: "Position 2: After 'O', before 'n' in 'One'",
  3: "Position 3: After 'n', before 'e' in 'One'",
  4: "Position 4: After 'e', before </p>",
  5: 'Position 5: After </p>, before <blockquote>',
  6: 'Position 6: After <blockquote>, before <p>',
  7: "Position 7: After <p>, before 'T' in 'Two'",
  8: "Position 8: After 'T', before 'w' in 'Two'",
  9: "Position 9: After 'w', before 'o' in 'Two'",
  10: "Position 10: After 'o', before [img] (leaf node = 1 token)",
  11: 'Position 11: After [img], before </p>',
  12: 'Position 12: After </p>, before </blockquote>',
  13: 'Position 13: End of document (after </blockquote>)',
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
