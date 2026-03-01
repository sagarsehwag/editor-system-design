export function transactionToJSON(tr: {
  steps: Array<{ toJSON: () => object }>;
}): object {
  return {
    steps: tr.steps.map((step) => step.toJSON()),
  };
}
