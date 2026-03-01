'use client';

import React from 'react';
import { STEPS } from './constants';
import { FlowStepPill } from './FlowStepPill';

type FlowStepsProps = {
  activeStep: number | null;
  isPaused: boolean;
  onStepHover: (index: number) => void;
};

export function FlowSteps({ activeStep, isPaused, onStepHover }: FlowStepsProps) {
  return (
    <div className="pm-flow-horizontal">
      <div className="pm-flow-steps-horizontal">
        {STEPS.map((step, i) => (
          <FlowStepPill
            key={step.id}
            step={step}
            index={i}
            isActive={activeStep === i}
            isCompleted={activeStep !== null && activeStep > i}
            isPaused={isPaused}
            onHover={() => onStepHover(i)}
            showArrow={i < STEPS.length - 1}
            isArrowActive={activeStep === i}
          />
        ))}
      </div>
    </div>
  );
}
