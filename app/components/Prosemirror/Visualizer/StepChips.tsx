'use client';

import React from 'react';
import type { StepInfo } from './types';
import { formatStepLabel, stepChipClass } from './utils';

type StepChipsProps = {
  steps: StepInfo[];
};

export function StepChips({ steps }: StepChipsProps) {
  if (steps.length === 0) return null;
  return (
    <div className="viz-tr-chips">
      {steps.map((s, i) => (
        <span key={i} className={`viz-chip ${stepChipClass(s.type)}`}>
          {formatStepLabel(s)}
        </span>
      ))}
    </div>
  );
}
