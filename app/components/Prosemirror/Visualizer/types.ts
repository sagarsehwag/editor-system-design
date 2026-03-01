export type TransactionType = 'doc' | 'selection' | 'mark' | 'history' | 'meta';

export type StepType = 'insert' | 'delete' | 'replace' | 'mark' | 'hist' | 'selection' | 'meta';

export type StepInfo = {
  type: StepType;
  delta?: number;
  cmd?: string;
  action?: string;
  json?: Record<string, unknown>;
};

export type SelectionInfo = {
  type: 'Cursor' | 'Range' | 'None';
  anchor: number;
  head: number;
  from: number;
  to: number;
  empty: boolean;
  text: string;
};

export const EMPTY_SELECTION: SelectionInfo = {
  type: 'None', anchor: 0, head: 0, from: 0, to: 0, empty: true, text: '',
};

export type TransactionRecord = {
  id: number;
  type: TransactionType;
  time: string;
  source: string;
  steps: StepInfo[];
  charsBefore: number;
  charsAfter: number;
  nodesBefore: number;
  nodesAfter: number;
  selBefore: SelectionInfo | null;
  selAfter: SelectionInfo | null;
  marksBefore: string[];
  marksAfter: string[];
  tr: Record<string, unknown>;
  beforeDoc: Record<string, unknown>;
  afterDoc: Record<string, unknown>;
  beforeRendered: string;
  afterRendered: string;
  lastDomEvent: string | null;
  resolvedPos: ResolvedPosInfo;
};

export type LifecycleStepDef = {
  id: string;
  label: string;
  desc: string;
  tooltip: string;
  color: string;
};

export type ResolvedPosInfo = {
  pos: number;
  depth: number;
  parentNode: string;
  parentOffset: number;
  textOffset: number;
  nodeBefore: string | null;
  nodeAfter: string | null;
};

export type EditorStats = {
  charCount: number;
  nodeCount: number;
  version: number;
  activeMarks: string[];
  selection: SelectionInfo;
  resolvedPos: ResolvedPosInfo;
};

export type TransactionStats = {
  total: number;
  docChanges: number;
  selChanges: number;
  markChanges: number;
  historyOps: number;
};
