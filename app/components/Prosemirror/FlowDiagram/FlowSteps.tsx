'use client';

import React, { useState, useRef, useEffect } from 'react';
import { STEPS } from './constants';
import { FlowStepPill } from './FlowStepPill';

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsTouch(mq.matches);
    const handler = () => setIsTouch(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isTouch;
}

type FlowStepsProps = {
  activeStep: number | null;
  isPaused: boolean;
  onStepHover: (index: number) => void;
};

export function FlowSteps({ activeStep, isPaused, onStepHover }: FlowStepsProps) {
  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();

  const handleTooltipToggle = (index: number) => {
    setOpenTooltipIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (!isTouchDevice || openTooltipIndex === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenTooltipIndex(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openTooltipIndex, isTouchDevice]);

  const openStep = openTooltipIndex !== null ? STEPS[openTooltipIndex] : null;

  return (
    <div ref={containerRef} className="pm-flow-horizontal">
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
            onTooltipToggle={handleTooltipToggle}
            isTooltipOpen={openTooltipIndex === i}
            showArrow={i < STEPS.length - 1}
            isArrowActive={activeStep === i}
          />
        ))}
      </div>
      <p className="pm-flow-steps-tap-hint" aria-hidden="true">
        Tap a step for details
      </p>
      {isTouchDevice && openStep && (
        <div className="pm-flow-step-callout">
          <strong>{openStep.label}</strong>
          <p>{openStep.tooltip}</p>
        </div>
      )}
    </div>
  );
}
