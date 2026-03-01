'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import type { StepConfig } from './types';

type FlowStepPillProps = {
  step: StepConfig;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isPaused: boolean;
  onHover: () => void;
  showArrow: boolean;
  isArrowActive: boolean;
};

export function FlowStepPill({
  step,
  index,
  isActive,
  isCompleted,
  isPaused,
  onHover,
  showArrow,
  isArrowActive,
}: FlowStepPillProps) {
  const tooltip = step.tooltip;
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipRect, setTooltipRect] = useState<DOMRect | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useLayoutEffect(() => {
    if (!isHovered || !wrapperRef.current) return;
    const updateRect = () => {
      if (wrapperRef.current) {
        setTooltipRect(wrapperRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [isHovered]);

  const tooltipEl =
    typeof document !== 'undefined' &&
    isHovered &&
    tooltipRect ? (
      <span
        id={`pm-flow-tooltip-${step.id}`}
        className="pm-flow-step-tooltip pm-flow-step-tooltip-portal"
        role="tooltip"
        style={{
          position: 'fixed',
          left: tooltipRect.left + tooltipRect.width / 2,
          top: tooltipRect.bottom + 6,
          transform: 'translateX(-50%)',
        }}
      >
        {tooltip}
      </span>
    ) : null;

  return (
    <>
      <div
        ref={wrapperRef}
        className="pm-flow-step-pill-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          className={`pm-flow-step-pill pm-flow-step-${step.color} ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPaused ? 'paused' : ''}`}
          onClick={onHover}
          aria-describedby={`pm-flow-tooltip-${step.id}`}
        >
          <span className="pm-flow-step-num">{index + 1}</span>
          <span className="pm-flow-step-name">{step.label}</span>
        </button>
      </div>
      {showArrow && (
        <div className={`pm-flow-arrow ${isArrowActive ? 'active' : ''}`}>
          →
        </div>
      )}
      {typeof document !== 'undefined' &&
        tooltipEl &&
        createPortal(tooltipEl, document.body)}
    </>
  );
}
