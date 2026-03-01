export type TxType = 'doc' | 'selection' | 'mark' | 'history';

export type StepChip = {
  kind: 'insert' | 'delete' | 'replace' | 'mark' | 'sel' | 'hist';
  label: string;
};

export type SelectionSnapshot = {
  selType: string;
  from: number;
  to: number;
  text: string;
};

export type LiveState = {
  charCount: number;
  nodeCount: number;
  version: number;
  hasMarks: boolean;
  selType: string;
  selCollapsed: boolean;
  selFrom: number;
  selTo: number;
  selText: string;
  activeMarks: string[];
  totalTx: number;
  docChanges: number;
  selChanges: number;
  markChanges: number;
  historyOps: number;
};

export type TransactionEntry = {
  id: number;
  tr: object;
  txType: TxType;
  timestamp: string;
  charsBefore: number;
  charsAfter: number;
  selBefore: SelectionSnapshot;
  selAfter: SelectionSnapshot;
  stepChips: StepChip[];
  beforeDoc: object;
  afterDoc: object;
  beforeRendered: string;
  afterRendered: string;
  lastDomEvent: string | null;
};

export type StepConfig = (typeof import('./constants').STEPS)[number];
