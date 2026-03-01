export type TransactionType = 'doc' | 'selection' | 'mark' | 'history' | 'meta';

export type StepInfo = {
  type: string;
  delta?: number;
  cmd?: string;
  action?: string;
  json?: object;
};

export type SelectionInfo = {
  type: string;
  anchor: number;
  head: number;
  from: number;
  to: number;
  empty: boolean;
  text: string;
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
  tr: object;
  beforeDoc: object;
  afterDoc: object;
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
  hasMarks: boolean;
  activeMarks: string[];
  selection: SelectionInfo;
  resolvedPos: ResolvedPosInfo;
};
