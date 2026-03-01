'use client';

import React, { useState } from 'react';
import { LIFECYCLE_STEPS } from './constants';

type LifecycleProps = {
  activeStepIndex: number | null;
};

export function Lifecycle({ activeStepIndex }: LifecycleProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const visibleIdx = activeStepIndex ?? selectedIdx;
  const visibleStep = visibleIdx !== null ? LIFECYCLE_STEPS[visibleIdx] : null;

  return (
    <div className="viz-lifecycle">
      <div className="viz-lc-row">
        {LIFECYCLE_STEPS.map((step, i) => {
          const isActive = activeStepIndex === i;
          const isPast = activeStepIndex !== null && i < activeStepIndex;
          const isSelected = selectedIdx === i && activeStepIndex === null;
          const isLast = i === LIFECYCLE_STEPS.length - 1;
          const arrowActive = activeStepIndex !== null && activeStepIndex > i;
          return (
            <React.Fragment key={step.id}>
              <div
                className={`viz-lc-card viz-lc-color-${step.color} ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
              >
                <div className="viz-lc-card-num">{i + 1}</div>
                <div className="viz-lc-card-label">{step.label}</div>
              </div>
              {!isLast && (
                <span className={`viz-lc-arrow ${arrowActive ? 'active' : ''}`}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className={`viz-lc-callout ${visibleStep ? `viz-lc-callout-${visibleStep.color}` : ''}`}>
        {visibleStep ? (
          <>
            <span className="viz-lc-callout-label">{visibleStep.label}</span>
            <span className="viz-lc-callout-text">{visibleStep.tooltip}</span>
          </>
        ) : (
          <span className="viz-lc-callout-text">Click on a step to see details</span>
        )}
      </div>
    </div>
  );
}
