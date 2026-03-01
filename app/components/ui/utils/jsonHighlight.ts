export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const DEFAULT_PREFIX = 'ds-json';

export function jsonToHighlightedHtml(
  str: string,
  classPrefix: string = DEFAULT_PREFIX
): string {
  const key = `${classPrefix}-key`;
  const string_ = `${classPrefix}-string`;
  const number = `${classPrefix}-number`;
  const bool = `${classPrefix}-bool`;
  const null_ = `${classPrefix}-null`;

  return escapeHtml(str)
    .replace(
      /"([^"\\]*(?:\\.[^"\\]*)*)":/g,
      `<span class="${key}">"$1"</span>:`
    )
    .replace(
      /: "([^"\\]*(?:\\.[^"\\]*)*)"/g,
      `: <span class="${string_}">"$1"</span>`
    )
    .replace(
      /: (-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
      `: <span class="${number}">$1</span>`
    )
    .replace(/: (true|false)/g, `: <span class="${bool}">$1</span>`)
    .replace(/: (null)/g, `: <span class="${null_}">$1</span>`);
}
