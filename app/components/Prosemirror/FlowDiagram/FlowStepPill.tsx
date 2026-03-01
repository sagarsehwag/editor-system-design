'use client';

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { StepConfig } from './types';

type FlowStepPillProps = {
  step: StepConfig;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isPaused: boolean;
  onHover: () => void;
  onTooltipToggle?: (index: number) => void;
  isTooltipOpen?: boolean;
  showArrow: boolean;
  isArrowActive: boolean;
};

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

export function FlowStepPill({
  step,
  index,
  isActive,
  isCompleted,
  isPaused,
  onHover,
  onTooltipToggle,
  isTooltipOpen = false,
  showArrow,
  isArrowActive,
}: FlowStepPillProps) {
  const tooltip = step.tooltip;
  const [isHoverTooltipOpen, setIsHoverTooltipOpen] = useState(false);
  const [tooltipRect, setTooltipRect] = useState<DOMRect | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();

  const showPortalTooltip = !isTouchDevice && isHoverTooltipOpen;

  const handleMouseEnter = () => {
    if (!isTouchDevice) setIsHoverTooltipOpen(true);
    onHover();
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) setIsHoverTooltipOpen(false);
  };

  const handleClick = () => {
    onHover();
    if (isTouchDevice && onTooltipToggle) {
      onTooltipToggle(index);
    }
  };

  useLayoutEffect(() => {
    if (!showPortalTooltip || !wrapperRef.current) return;
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
  }, [showPortalTooltip]);

  const tooltipEl =
    typeof document !== 'undefined' &&
    showPortalTooltip &&
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
          onClick={handleClick}
          aria-describedby={`pm-flow-tooltip-${step.id}`}
          aria-expanded={isTouchDevice ? isTooltipOpen : undefined}
          aria-label={step.label}
        >
          <span className="pm-flow-step-num">{index + 1}</span>
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
