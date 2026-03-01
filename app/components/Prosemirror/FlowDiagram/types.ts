export type TransactionEntry = {
  id: number;
  tr: object;
  beforeDoc: object;
  afterDoc: object;
  beforeRendered: string;
  afterRendered: string;
  lastDomEvent: string | null;
};

export type StepConfig = (typeof import('./constants').STEPS)[number];
